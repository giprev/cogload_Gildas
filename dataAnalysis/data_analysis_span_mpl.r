#install.packages("jsonlite")
library(jsonlite)
library(tidyverse)
library(dplyr)
library(sandwich)
library(ggpubr)
library(rstatix)
library(estimatr)
library(ggplot2)
library(purrr)

setwd("/Users/domitilleprevost/Documents/Master Eco-psycho/Stage/coding/jatos/study_assets_root/073bfc0a-f209-4ca9-9665-9f66dd9fd4ef/dataAnalysis")
getwd()
rm(list = ls())





#------------- Data formatting -----------#

# Path to your file
file_path1 <- "/Users/domitilleprevost/Downloads/jatos_results_data_20251015161854.txt"

text <- readLines(file_path1)

length(text)
nSub <- length(text)

# Loop through each part of the text file and write it to a separate text file
for(i in 1:nSub) {
  part <- text[i]
  writeLines(part, paste0("part", i, ".txt"))
}

# Initialize final_data outside the loop
final_data <- data.frame()

for (iSub in 1:nSub) {
    partDirectory <- paste("part", as.character(iSub), ".txt", sep = "")
  
    dataPerParticipant <- fromJSON(partDirectory)

    # Extract the demographics cell
    demo_values <- dataPerParticipant%>%
        filter(task == "demographics") %>%
        select(responses) %>%
        pull()
    #demographics age
    demo_age <- dataPerParticipant %>%
        filter(task== "demographics_age") %>%
        select(responses) %>%
        pull()
    
    # Create a demographics data frame
    demo_data_age <- fromJSON(demographics_age)
    demo_data <- fromJSON(demographics_values)
    
    demographics_df <- data.frame(
        demo_gend = as.character(demo_data$Q0),
        demo_educ = as.character(demo_data$Q1),
        demo_occu = as.character(demo_data$Q2),
        demo_reve = as.character(demo_data$Q3),
        demo_lsat = as.character(demo_data$Q4),
        demo_age = as.integer(demo_data_age),
        stringsAsFactors = TRUE # Convert to factors
    )
    # ensure we don't keep the letters used to help participants to understand
    demographics_df$demo_lsat <- case_when(
        demographics_df$demo_lsat == "10 (très)" ~ "10",
        demographics_df$demo_lsat == "0 (pas du tout)" ~ "0",
        TRUE ~ demographics_df$demo_lsat  # Keep original value for all others
    )

    # extract maximal span length achieved
    spanLength <- dataPerParticipant %>%
        filter(task == "spanTest" && block == "spanSpan" && letterType == 2 && spanCounter == 13) %>%
        select(span) %>%
        pull()
    spanLength <- as.integer(spanLength + 1) # add 1 because one is retrieved after the maximum is achieved, to make the task easier
    
    treatment <- dataPerParticipant %>%
        filter (!is.na(treatment)) %>%
        select(treatment) %>%
        pull()
    treatment <- as.character(treatment)

    # select the order with is_lottery_first when I'll have the actualized data

    # This returns a double value as long as the comprehension question trials are not differentiated
    numCorrectQuestion <- dataPerParticipant %>%
        filter( !is.na(number_correct)) %>%
        select(number_correct) %>%
        pull()

    payment_spanMpl <- dataPerParticipant %>%
        filter(!is.na(payment_span_mpl)) %>%
        select(payment_span_mpl) %>%
        pull()
    payment_mpl <- dataPerParticipant %>%
        filter(!is.na(payment_mpl)) %>%
        select(payment_mpl) %>%
        pull()
    payment_spanSpan <- dataPerParticipant %>%
        filter(!is.na(payment_span_span)) %>%
        select(payment_span_span) %>%
        pull()
    payment_calibration <- dataPerParticipant %>%
        filter(!is.na(payment_calibration)) %>%
        select(payment_calibration) %>%
        pull()
        # Extract total payment
    payment_total <- dataPerParticipant %>%
        filter(!is.na(totalPayment)) %>%
        select(totalPayment) %>%
        pull()

    extract_mpl_dataframes <- function(dataPerParticipant) {
        
        # Filter data for the conditions you specified
        mpl_data <- dataPerParticipant %>%
            filter(!is.na(mplType) & 
                !is.null(mplType) & 
                mplType != "" &
                block == "span_mpl" & 
                task == "mpl")
        
        # Check if we have any data
        if(nrow(mpl_data) == 0) {
            warning("No data found matching the criteria")
            return(list())
        }

        # Create modified mplType for doubled lotteries (subBlock 13 or 14)
        mpl_data <- mpl_data %>%
            mutate(
                mplType_modified = case_when(
                   subBlock %in% c(13, 14) ~ paste0(substr(mplType, 1, 1), "S", substr(mplType, 2, nchar(mplType))),
                  TRUE ~ mplType
             )
         )
        
        # Get unique combinations of mplType and statusMPL
        unique_combinations <- mpl_data %>%
            select(mplType, statusMPL) %>%
            distinct()
        
        # Initialize list to store dataframes
        dataframes_list <- list()
        
        # Loop through each unique combination
        for(i in 1:nrow(unique_combinations)) {
            mpl_type <- unique_combinations$mplType[i]
            status_mpl <- unique_combinations$statusMPL[i]
            
            # Filter data for this specific combination
            subset_data <- mpl_data %>%
                filter(mplType == mpl_type & statusMPL == status_mpl)
            
            # Calculate ev based on mplType
            subset_data <- subset_data %>%
                mutate(
                    ev = case_when(
                    str_starts(mplType, "G") ~ (2 * switchRow2 + 1) / 2,
                    mplType == "A10" ~ switchRow2 - 5,
                    mplType == "A15" ~ switchRow2 - 7.5,
                    str_starts(mplType, "L") ~ (2 * switchRow2 - 1) / 2,
                    TRUE ~ NA_real_  # For any unexpected mplType values
                    )
                )
            
            # Select and rename columns as specified
            final_subset <- subset_data %>%
            select(
                ev = ev,
                rt = rt,
                subBlockNumber = subBlock
            )
            
            # Create dataframe name
            df_name <- paste0(mpl_type, "_", status_mpl)
            
            # Store in list
            dataframes_list[[df_name]] <- final_subset
            
            # Also assign to global environment (optional)
            assign(df_name, final_subset, envir = .GlobalEnv)
        }
        
        # Print summary of created dataframes
        cat("Created", length(dataframes_list), "dataframes:\n")
        for(name in names(dataframes_list)) {
            cat("- ", name, ": ", nrow(dataframes_list[[name]]), " rows\n")
        }
        
        return(dataframes_list)
    }

        # Extract MPL dataframes
    mpl_dataframes <- extract_mpl_dataframes(dataPerParticipant)
    
    # Create base participant row
    participant_row <- data.frame(
        participant_id = iSub,
        demo_gend = demographics_df$demo_gend,
        demo_educ = demographics_df$demo_educ,
        demo_occu = demographics_df$demo_occu,
        demo_reve = demographics_df$demo_reve,
        demo_lsat = demographics_df$demo_lsat,
        demo_age = demographics_df$demo_age,
        spanLength = ifelse(length(spanLength) > 0, spanLength, NA),
        treatment = treatment,
        numCorrectQuestion = ifelse(length(numCorrectQuestion) > 0, numCorrectQuestion[1], NA),
        payment_spanMpl = payment_spanMpl,
        payment_mpl = payment_mpl,
        payment_spanSpan = payment_spanSpan,
        payment_calibration = payment_calibration,
        payment_total = payment_total,
        stringsAsFactors = FALSE
    )

    # Define all possible combinations
    mpl_types <- c("G10", "G25", "G50", "G75", "G90", "L10", "L25", "L50", "L75", "L90", "A10", "A15",
                   "GS10", "GS25", "GS50", "GS75", "GS90", "LS10", "LS25", "LS50", "LS75", "LS90", "AS10", "AS15")
    status_types <- c("mirror", "lottery")
    
    # Add MPL data columns
    for(mpl_type in mpl_types) {
        for(status_type in status_types) {
            df_name <- paste0(mpl_type, "_", status_type)
            
            # Initialize columns with NA
            participant_row[[paste0(df_name, "_ev")]] <- NA
            participant_row[[paste0(df_name, "_rt")]] <- NA
            participant_row[[paste0(df_name, "_subBlockNumber")]] <- NA
            
            # Fill with actual data if it exists
            if(df_name %in% names(mpl_dataframes) && nrow(mpl_dataframes[[df_name]]) > 0) {
                df_data <- mpl_dataframes[[df_name]]
                # Take first row if multiple rows exist
                participant_row[[paste0(df_name, "_ev")]] <- df_data$ev[1]
                participant_row[[paste0(df_name, "_rt")]] <- df_data$rt[1]
                participant_row[[paste0(df_name, "_subBlockNumber")]] <- df_data$subBlockNumber[1]
            }
        }
    }

    # Add to final dataset
    if(nrow(final_data) == 0) {
        final_data <- participant_row
    } else {
        final_data <- rbind(final_data, participant_row)
    }

    cat("Processed participant", iSub, "\n")


}