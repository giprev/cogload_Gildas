# Load required libraries
library(jsonlite)
library(openxlsx)
library(dplyr)

json_file_path <- "/Users/domitilleprevost/Downloads/jatos_results_data_20251002081859.txt"

# Function to convert JSON experiment data to Excel (handles .txt files with JSON content)
json_to_excel <- function(json_file_path, output_excel_path = NULL) {
  
  # Read file content
  cat("Reading file:", json_file_path, "\n")
  
  # Read the text file content
  file_content <- readLines(json_file_path, warn = FALSE)
  
  # Join all lines into a single string
  json_string <- paste(file_content, collapse = "\n")
  
  # Parse JSON from string
  json_data <- fromJSON(json_string, flatten = TRUE)
  
  # If output path not specified, create one based on input file
  if (is.null(output_excel_path)) {
    # Replace .txt extension with .xlsx
    output_excel_path <- gsub("\\.(txt|json)$", ".xlsx", json_file_path)
  }
  
  # Handle different JSON structures
  if (is.data.frame(json_data)) {
    # If JSON is already a flat data frame
    main_data <- json_data
  } else if (is.list(json_data)) {
    # If JSON is a list, try to convert to data frame
    if (all(sapply(json_data, is.list))) {
      # If it's a list of lists (typical experiment data)
      main_data <- bind_rows(json_data)
    } else {
      # If it's a simple list, convert to single-row data frame
      main_data <- as.data.frame(json_data)
    }
  } else {
    stop("Unexpected JSON structure")
  }
  
  # Create workbook
  wb <- createWorkbook()
  
  # Add main data sheet
  addWorksheet(wb, "experiment_data")
  writeData(wb, "experiment_data", main_data)
  
  # If there are nested columns, create separate sheets for complex data
  nested_cols <- names(main_data)[sapply(main_data, function(x) any(sapply(x, is.list)))]
  
  if (length(nested_cols) > 0) {
    cat("Found nested columns:", paste(nested_cols, collapse = ", "), "\n")
    
    for (col in nested_cols) {
      sheet_name <- paste0("nested_", col)
      if (nchar(sheet_name) > 31) sheet_name <- substr(sheet_name, 1, 31) # Excel sheet name limit
      
      # Extract nested data
      nested_data <- main_data[[col]]
      
      # Try to flatten nested data
      if (is.list(nested_data)) {
        tryCatch({
          if (all(sapply(nested_data, is.data.frame))) {
            # If list of data frames, combine them
            flat_nested <- bind_rows(nested_data, .id = "row_id")
          } else if (all(sapply(nested_data, is.list))) {
            # If list of lists, try to convert to data frame
            flat_nested <- bind_rows(lapply(nested_data, as.data.frame), .id = "row_id")
          } else {
            # Simple list, convert to data frame
            flat_nested <- data.frame(
              row_id = seq_along(nested_data),
              value = I(nested_data)
            )
          }
          
          addWorksheet(wb, sheet_name)
          writeData(wb, sheet_name, flat_nested)
        }, error = function(e) {
          cat("Could not process nested column:", col, "\n")
        })
      }
    }
  }
  
  # Save Excel file
  saveWorkbook(wb, output_excel_path, overwrite = TRUE)
  cat("Excel file saved to:", output_excel_path, "\n")
  
  return(output_excel_path)
}

# Function to process multiple files in a directory (handles both .txt and .json)
process_multiple_files <- function(directory_path, pattern = "\\.(txt|json)$") {
  files <- list.files(directory_path, pattern = pattern, full.names = TRUE)
  
  if (length(files) == 0) {
    cat("No .txt or .json files found in:", directory_path, "\n")
    return(NULL)
  }
  
  cat("Found", length(files), "files\n")
  
  excel_files <- c()
  for (file in files) {
    tryCatch({
      excel_file <- json_to_excel(file)
      excel_files <- c(excel_files, excel_file)
    }, error = function(e) {
      cat("Error processing", file, ":", e$message, "\n")
    })
  }
  
  return(excel_files)
}

# Now you can run:
json_to_excel(json_file_path)

cat("Functions loaded. Use:\n")
cat("- json_to_excel('file.txt') to convert a single .txt file with JSON content\n")
cat("- process_multiple_files('.') to convert all .txt and .json files in current directory\n")