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
rm(list = ls())

setwd("/Users/domitilleprevost/Documents/Master Eco-psycho/Stage/coding/jatos/study_assets_root/073bfc0a-f209-4ca9-9665-9f66dd9fd4ef/dataAnalysis")
PATH_TO_DATA <- "/Users/domitilleprevost/Documents/Master Eco-psycho/Stage/coding/jatos/study_assets_root/073bfc0a-f209-4ca9-9665-9f66dd9fd4ef/dataAnalysis"
dir.create(file.path(PATH_TO_DATA, "Figures"), showWarnings = FALSE, recursive = TRUE)
getwd()






#------------- Data formatting -----------#

# Path to your file
filePath_testGildas01_20251016 <- "/Users/domitilleprevost/Downloads/jatos_results_data_20251015161854.txt"
filePath_testGildas02_20251017 <- "/Users/domitilleprevost/Downloads/jatos_results_data_20251017112941.txt"
filePath_testGildasSiméon01_20251021 <- "/Users/domitilleprevost/Downloads/jatos_results_data_20251021083554.txt"
filePath_testGildas03_20251104 <- "/Users/domitilleprevost/Downloads/jatos_results_data_20251104152827.txt" # risk neutral
filePath_testGildas04_20251105 <- "/Users/domitilleprevost/Downloads/jatos_results_data_20251105121134.txt" # no special pattern
filePath_testGildas05_20251105 <- "/Users/domitilleprevost/Downloads/jatos_results_data_20251105121317.txt" # choices up for high gains and small losses, choices down for small gains and large losses
filePath_testGildas06_20251105 <- "/Users/domitilleprevost/Downloads/jatos_results_data_20251105121734.txt" # multiple trials, some of which failed at comprehension questions
filePath_testGildas07_20251105 <- "/Users/domitilleprevost/Downloads/jatos_results_data_20251105150400.txt"# trial with failure at the comprehension questions
filePath_testGildas08_20251105 <- "/Users/domitilleprevost/Downloads/jatos_results_data_20251106092713.txt"# trial with failure at the comprehension questions
filePath_testGildas09_20251114 <- "/Users/domitilleprevost/Downloads/jatos_results_data_20251114111004.txt"
filePath_testGildas10_20251117 <- "/Users/domitilleprevost/Downloads/jatos_results_data_20251117123042.txt"




text <- readLines(filePath_testGildas06_20251105)

nSub <- length(text)

 # length(text)

# Loop through each part of the text file and write it to a separate text file
for(i in 1:nSub) {
  part <- text[i]
  writeLines(part, paste0("part", i, ".txt"))
}


accuracySpan <- function(answer, correct) {
    # Handle edge cases

    if (is.list(answer)) {
      if (length(answer) == 0) {
        return(0)
      }
        answer <- answer[[1]]
    }
    if (is.list(correct)) {
      if (length(correct) == 0) {
        return(0)
      }
        correct <- correct[[1]]
    }
    
    if (is.null(answer) || is.null(correct) || (length(correct) == 0) || length(answer) == 0 ) {
        return(0)
    }
    # Convert answer to integer vector if it's character
    if (is.character(answer)) {
        answer <- as.integer(answer)
    }
    # If correct is character vector, convert to integers
    if (is.character(correct)) {
        correct <- as.integer(correct)
    }


    totalPositions <- length(correct)
    maxPositions <- max(length(answer), length(correct))
    correctMatches <- 0

    # Compare each position up to the length of the correct array
    for (i in 1:totalPositions) {
      if (i <= length(answer) && i <= length(correct) && !is.na(answer[i]) && !is.na(correct[i])){
        if (answer[i] == correct[i]) {
            correctMatches <- correctMatches + 1
        }
      }
    }
    # Return the ratio of correct matches to the maximum number of positions
    return(correctMatches / maxPositions)
}

cat(accuracySpan(c(1,2,3,4), c(1,2,3,5)), "\n") # should be 0.75

roundDownToFifth <- function(number) {
  return(floor(number * 5) / 5)
}


createSequenceArray <- function(y, X, position) {

  lengthSurePayments <- 17  # Adjust this value as needed
  
  array <- c()
  pos <- 0
  
  # hard code the position of the upper line of the rational switch point
  if (position == "high" & (y == 10 | y == 90) & (X == "G" | X == "L")) {
    pos <- 6
  } else if (position == "low" & (y == 10 | y == 90) & (X == "G" | X == "L")) {
    pos <- 12
  } else if (position == "high" & (y == 25 | y == 75)) {
    pos <- 5
  } else if (position == "low" & (y == 25 | y == 75)) {
    pos <- 13
  } else if (position == "high" & y == 50) {
    pos <- 4
  } else if (position == "low" & y == 50) {
    pos <- 14
  } else if (position == "high" & (y == 10 | y == 15) & X == "A") {
    pos <- 8
  } else if (position == "low" & (y == 10 | y == 15) & X == "A") {
    pos <- 10
  }
  
  EV <- 0
  if (X == "G") {
    EV <- roundDownToFifth(y * 0.25)
  } else if (X == "L") {
    EV <- roundDownToFifth(-y * 0.25)
  } else if (X == "A" & y == 10) {
    EV <- 9.5
  } else if (X == "A" & y == 15) {
    EV <- 14.5
  }
  
  if (X == "G") {
    # cat("y is", y, "X is", X, "position is", position, "\n")
    # cat("EV in G is", EV, "\n")
    # cat("pos in G is", pos, "\n")
    startValue <- EV - ((pos-1) * 0.2)
    # cat("startValue in G is", startValue, "\n")
    for (i in 0:lengthSurePayments) {
      array <- c(array, round((startValue + (i * 0.2)) * 10) / 10)
    }
  } else if (X == "L") {
    # cat("y is", y, "X is", X, "position is", position, "\n")
    # cat("EV in L is", EV, "\n")
    # cat("pos in L is", pos, "\n")
    startValue <- EV - ((pos-1) * 0.2)
    # cat("startValue in L is", startValue, "\n")
    for (i in 0:lengthSurePayments) {
      array <- c(array, round((startValue + (i * 0.2)) * 10) / 10)
    }
  } else if (X == "A") {
    # cat("y is", y, "X is", X, "position is", position, "\n")
    # cat("EV in A is", EV, "\n")
    # cat("pos in A is", pos, "\n")
    startValue <- EV - (pos-1)
    # cat("startValue in A is", startValue, "\n")
    for (i in 0:lengthSurePayments) {
      array <- c(array, startValue + i)
    }
  }
  return(array)
}


extractMplDataframes <- function(dataPerParticipant) {

  # Filter data for the conditions you specified
  mpl_data <- dataPerParticipant %>%
    filter(!is.na(mplType) & !is.null(mplType) & mplType != "" & block == "span_mpl" & task == "mpl")

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
  
  # Get unique combinations of mplType and statusMpl
  unique_combinations <- mpl_data %>%
    select(mplType_modified, statusMpl) %>%
    distinct()
  
  # Initialize list to store dataframes
  dataframes_list <- list()
  
  # Loop through each unique combination
  for(i in 1:nrow(unique_combinations)) {
    mpl_type <- unique_combinations$mplType_modified[i]
    status_mpl <- unique_combinations$statusMpl[i]
    
    # Filter data for this specific combination
    subset_data <- mpl_data %>%
      filter(mplType_modified == mpl_type & statusMpl == status_mpl)
    
    # Calculate ev based on mplType
    subset_data <- subset_data %>%
      rowwise() %>%
      mutate(
        ev = {
          y_value <- as.numeric(gsub("[^0-9]", "", mplType))
          X_value <- case_when(
            str_starts(mplType, "G") ~ "G",
            str_starts(mplType, "L") ~ "L",
            str_starts(mplType, "A") ~ "A",
            TRUE ~ NA_character_
          )
          surePayments <- createSequenceArray(y_value, X_value, position) # CAUTION if no switch sr1 = sr2 = -1 !!! Then need to see if choices only lotteries or only mirror
          if (switch_row1 == -1 & switch_row2 == -1) {
            if (all(choices == "lottery")) {
              ev_value <- surePayments[length(surePayments)] + 0.1 # sure amount as if the switching point was on the line after the last line
              cat("all choices lottery, ev is", ev_value, "\n")
            } else if (all(choices == "sure")) {
              ev_value <- surePayments[1] - 0.1 # sure amount as if the switching point was on the line before the first line
              cat("all choices sure, ev is", ev_value, "\n")
            } else {
              ev_value <- NA  # Undefined behavior
              cat ("switch_row1 = -1 and switch_row2 = -1 but choices are mixed, ev is NA\n")
            }
          } else {
            ev_value <- (surePayments[switch_row2 + 1] + surePayments[switch_row1 + 1]) / 2 # last value of the function is assigned to ev in mutate. ADD 1 because R starts at 1 instead of 0 (js)
            cat("calculated ev is", ev_value, "\n")
          }
        ev_value
        }
      ) %>%
      ungroup()
    
    # Select and rename columns as specified
    final_subset <- subset_data %>%
      select(
        ev = ev,
        rt = rt,
        subBlockNumber = subBlock,
        accuracy = accuracy,
        position = position
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




# Initialize final_data outside the loop
final_data <- data.frame()
final_data_2 <- data.frame()

for (iSub in 1:nSub) {
    partDirectory <- paste("part", as.character(iSub), ".txt", sep = "")
  
    dataPerParticipant <- fromJSON(partDirectory)

    # Check if this participant has comprehensionFailure and skip if they do
    if(any(dataPerParticipant$task == "comprehensionFailure", na.rm = TRUE)) {
        cat("Skipping participant", iSub, "due to comprehensionFailure\n")
        next  # Skip to the next iteration
    }
    
    participant_id <- as.character(dataPerParticipant[1,'subject'])

    dataPerParticipant <- dataPerParticipant %>% rename_at('statusMPL', ~'statusMpl')


    # Extract the demographics cell
    demo_values <- dataPerParticipant%>%
        filter(task == "demographics") %>%
        select(responses) %>%
        pull()
    cat(demo_values)
    #demographics age
    demo_age <- dataPerParticipant %>%
        filter(task== "demographics_age") %>%
        select(responses) %>%
        pull()
    
    
    # Create a demographics data frame
    demo_data_age <- fromJSON(demo_age)
    demo_data <- fromJSON(demo_values)
    
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
        filter(task == "spanTest" & block == "spanSpan" & letterType == 2 & spanCounter == 13) %>%
        select(span) %>%
        pull()
    spanLength <- as.integer(spanLength + 1) # add 1 because one is retrieved after the maximum is achieved, to make the task easier
    
    treatmentValue <- dataPerParticipant %>%
        filter (!is.na(treatment)) %>%
        select(treatment) %>%
        pull()
    treatmentValue <- as.character(treatmentValue)
    
    isLotteryFirst <- dataPerParticipant %>%
        filter(!is.na(versionFirst)) %>%
        select(versionFirst) %>%
        pull()

    isLotteryFirst <- ifelse(length(isLotteryFirst) > 0 & isLotteryFirst[1] == "lottery_first", TRUE, FALSE)

    numCorrectQuestionMirror <- dataPerParticipant %>%
        filter( !is.na(num_correct) & task == "comprehensionSurveyMPLMirror") %>%
        select(num_correct) %>%
        pull()
    
    numCorrectQuestionLottery <- dataPerParticipant %>%
        filter( !is.na(num_correct) & task == "comprehensionSurveyMPLLottery") %>%
        select(num_correct) %>%
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
    payment_spanSpan <- ifelse(length(payment_spanSpan) > 0, as.numeric(payment_spanSpan[1]), NA)

    payment_calibration <- dataPerParticipant %>%
        filter(!is.na(payment_calibration)) %>%
        select(payment_calibration) %>%
        pull()
    payment_calibration <- ifelse(length(payment_calibration) > 0, as.numeric(payment_calibration[1]), NA)

    payment_total <- dataPerParticipant %>%
        filter(!is.na(totalPayment)) %>%
        select(totalPayment) %>%
        pull()

    dataPerParticipant <- dataPerParticipant %>%
    # Fill down mplType for span test trials
    mutate(
        mplType = case_when(
            # Keep existing mplType values for non-span test trials
            !(block == "span_mpl" & task == "spanTest") ~ mplType,
            # For span test trials in span_mpl block, use the previous row's mplType
            block == "span_mpl" & task == "spanTest" ~ lag(mplType),
            # Default case
            TRUE ~ mplType
        )
    )
    
    dataPerParticipant <- dataPerParticipant %>%
    rowwise() %>%
        mutate ( accuracy = case_when(
          task == "spanTest" ~  accuracySpan(answer, correct), # & mplType != "" & block == "span_mpl"  !is.na(answer) & !is.null(correct) & 
            TRUE ~ NA_real_
            ),
            .before = was_correct
        ) %>%
      ungroup()

    dataPerParticipant <- dataPerParticipant %>%
    # Fill down accuracy for mpl trials
    mutate(
        accuracy = case_when(
            # For span test trials in span_mpl block, use the next row's accuracy
            !(block == "span_mpl" & task == "mpl") ~ accuracy,
            block == "span_mpl" & task == "mpl" ~ lead(accuracy), #lead(task)
        )
    )

    # Extract MPL dataframes
    mpl_dataframes <- extractMplDataframes(dataPerParticipant)
    
    # Create base participant row
    participant_row <- data.frame(
        participant_id = participant_id,
        demo_gend = demographics_df$demo_gend,
        demo_educ = demographics_df$demo_educ,
        demo_occu = demographics_df$demo_occu,
        demo_reve = demographics_df$demo_reve,
        demo_lsat = demographics_df$demo_lsat,
        demo_age = demographics_df$demo_age,
        spanLength = ifelse(length(spanLength) > 0, spanLength, NA),
        treatment = treatmentValue,
        isLotteryFirst = isLotteryFirst,
        numCorrectQuestionMirror = ifelse(length(numCorrectQuestionMirror) > 0, numCorrectQuestionMirror[1], NA),
        numCorrectQuestionLottery = ifelse(length(numCorrectQuestionLottery) > 0, numCorrectQuestionLottery[1], NA),
        payment_spanMpl = payment_spanMpl,
        # payment_mpl = payment_mpl,
        payment_spanSpan = payment_spanSpan,
        payment_calibration = payment_calibration,
        payment_total = payment_total,
        stringsAsFactors = FALSE
    )
    dataPerParticipant_2 <- dataPerParticipant %>%
      mutate(
        participant_id = participant_id,
        demo_gend = demographics_df$demo_gend,
        demo_educ = demographics_df$demo_educ,
        demo_occu = demographics_df$demo_occu,
        demo_reve = demographics_df$demo_reve,
        demo_lsat = demographics_df$demo_lsat,
        demo_age = demographics_df$demo_age,
        spanLength = ifelse(length(spanLength) > 0, spanLength, NA),
        treatment = treatmentValue,
        isLotteryFirst = isLotteryFirst,
        numCorrectQuestionMirror = ifelse(length(numCorrectQuestionMirror) > 0, numCorrectQuestionMirror[1], NA),
        numCorrectQuestionLottery = ifelse(length(numCorrectQuestionLottery) > 0, numCorrectQuestionLottery[1], NA),
        payment_spanMpl = payment_spanMpl,
        # payment_mpl = payment_mpl,
        payment_spanSpan = payment_spanSpan,
        payment_calibration = payment_calibration,
        payment_total = payment_total,
      )

    # Define all possible combinations
    mpl_types <- c("G10", "G25", "G50", "G75", "G90", "L10", "L25", "L50", "L75", "L90", "A10", "A15",
                    "GS10", "GS25", "GS50", "GS75", "GS90", "LS10", "LS25", "LS50", "LS75", "LS90", "AS10", "AS15")
    status_types <- c("mirror", "lottery")
    column_types <- c("ev", "rt", "subBlockNumber", "accuracy", "position")

    # Initialize ALL possible MPL columns with NA values first
    for(mpl_type in mpl_types) {
        for(status_type in status_types) {
            for(col_type in column_types) {
                new_col_name <- paste0(mpl_type, "_", status_type, "_", col_type)
                participant_row[[new_col_name]] <- NA
            }
        }
    }

    # Now add MPL data columns dynamically based on actual dataframes (this will overwrite the NAs where data exists)
    for(df_name in names(mpl_dataframes)) {
        df_data <- mpl_dataframes[[df_name]]
        
        # Get all column names from this dataframe
        col_names <- names(df_data) # ev, rt, subBlockNumber, accuracy
        
        # For each column in the dataframe, update the corresponding column in participant_row
        for(col_name in col_names) {
            new_col_name <- paste0(df_name, "_", col_name)
            
            # Update the column with the first row's value (overwriting the NA)
            if(nrow(df_data) > 0) {
                participant_row[[new_col_name]] <- df_data[[col_name]][1]
            }
            # If dataframe is empty, the NA value remains
        }
    }
    

    # Add to final dataset
    if(nrow(final_data) == 0) {
        final_data <- participant_row
    } else {
        final_data <- rbind(final_data, participant_row)
    }
    
    # Add to final dataset 2
    if(nrow(final_data_2) == 0) {
      final_data_2 <- dataPerParticipant_2
    } else {
      final_data_2 <- bind_rows(final_data_2, dataPerParticipant_2)
    }

    cat("Processed participant", iSub, "\n")


}

view(dataPerParticipant_2)
view(final_data_2)



# Create df_model for linear models from final_data - reshape from wide to long, one line per MPL type, both status on the same line
dfA <- final_data %>%
  # Keep all demographic/payment columns as-is, pivot only MPL columns
  pivot_longer(
    cols = matches("^(A|G|L)S?(10|15|25|50|75|90)_(mirror|lottery)_(ev|rt|subBlockNumber|accuracy)$"),  # Match MPL pattern
    names_to = c("mplType", "status", "measure"),
    names_sep = "_" # Split at the first underscore
  ) %>%
  # Combine status and measure
  unite("status_measure", status, measure, sep = "_") %>%
  # Pivot wider
  pivot_wider(
    names_from = status_measure,
    values_from = value
  ) %>%
  # add position columns separately
  left_join(
    final_data %>%
      select(participant_id, matches("^(A|G|L)S?(10|15|25|50|75|90)_(mirror|lottery)_position$")) %>%
      pivot_longer(
        cols = matches("_position$"),
        names_to = c("mplType", "status", "measure"),
        names_sep = "_"
      ) %>%
    # Combine status and measure
    unite("status_measure", status, measure, sep = "_") %>%
      pivot_wider(
        names_from = status_measure,
        values_from = value
      ),
    by = c("participant_id", "mplType")
  ) %>%
  # Remove all the original position columns that weren't pivoted
  select(-matches("^(A|G|L)S?(10|15|25|50|75|90)_(mirror|lottery)_position$")) %>%
  mutate(
    pred = case_when(
      str_starts(mplType, "G") ~ roundDownToFifth(25 * (as.numeric(str_extract(mplType, "\\d+")) / 100))+0.1,
      str_starts(mplType, "L") ~ roundDownToFifth((-25 * as.numeric(str_extract(mplType, "\\d+")) / 100))+0.1,
      str_starts(mplType, "A") ~ 0,
      TRUE ~ NA_real_
    ),
  ) %>%
  mutate(
    prob = case_when(
      str_starts(mplType, "G") ~ as.numeric(str_extract(mplType, "\\d+")),
      str_starts(mplType, "L") ~ as.numeric(str_extract(mplType, "\\d+")),
      str_starts(mplType, "A") & mplType %in% c("A10", "AS10") ~ 50,
      str_starts(mplType, "A") & mplType %in% c("A15", "AS15") ~ 50,
      TRUE ~ NA_real_
    ),
  )%>%
  mutate(
    multiplier = case_when(
      (prob %in% c(10, 25) & str_starts(mplType, "G")) ~ 1,
      (prob %in% c(50, 75, 90) & str_starts(mplType, "G")) ~ -1,
      (prob %in% c(50, 75, 90) & str_starts(mplType, "L")) ~ 1,
      (prob %in% c(10, 25) & str_starts(mplType, "L")) ~ -1,
      (str_starts(mplType, "A")) ~ -1,
    ),
  )



view(dfA)
dfA$mirror_accuracy
dfA$lottery_accuracy
sum(!is.na(dfA$mirror_accuracy))




#------------- Data analysis -----------#

plot_precision_cogload <- final_data_2 %>%
filter(
    block == "spanSpan" & task == "spanTest"
  ) %>%
  group_by(subject, treatment) %>%
  summarise (
    accuracy_mean_participant = mean(accuracy, na.rm = TRUE),
    #condition = c("Hard", "Easy")
  ) %>% 
  ungroup() %>%
  mutate(
    difference = t.test(accuracy_mean_participant ~ treatment, data =.)[['p.value']]
  ) %>%
  group_by(treatment)%>%
  summarise(
    accuracy = mean(accuracy_mean_participant),
    se = sd(accuracy_mean_participant),
    p.value = difference[[1]]
  ) %>% ungroup()

plot_precision_cogload

# impact of memory load on memory performance check

# Create the plot
p <- ggbarplot(
  plot_precision_cogload, 
  x = "treatment", 
  y = "accuracy",
  color = "treatment",
  fill = "treatment",
  palette = c("#00AFBB", "#E7B800"),  # Easy = blue, Hard = yellow
  position = position_dodge(0.8),
  alpha = 0.2,
  size = 0.8,
  width = 0.6,
) +
  geom_errorbar(
    aes(ymin = accuracy - se, ymax = accuracy + se),
    width = 0.2,
    position = position_dodge(0.8)
  ) +
  # Add horizontal line for chance level
  geom_hline(
    yintercept = 1/9, 
    linetype = "dashed", 
    color = "red", 
    linewidth = 1
  ) +
  # Add chance level annotation
  annotate(
    "text", 
    x = 1.5, 
    y = 1/9 + 0.02, 
    label = paste0("Chance level = ", round(1/9, 3)), 
    color = "red", 
    size = 3.5
  ) +
  # Add statistical comparison
  # stat_pvalue_manual(
  #   plot_precision_cogload, 
  #   label = "p = {p}",
  #   tip.length = 0.01,
  #   y.position = max(plot_data_nbackVisual$accuracy, na.rm = TRUE) + 0.05
  # ) +
  # Customize appearance
  labs(
    title = "Accuracy target task (span): cogload vs baseline treatment",
    #subtitle = paste0("n = ", desc_stats$n[1], " participants"),
    x = "Block Difficulty",
    y = "Accuracy",
    caption = "Error bars represent standard error of the mean\nRed dashed line shows theoretical chance level"
  ) +
  theme_pubr() +
  theme(
    legend.position = "none",
    plot.title = element_text(hjust = 0.5),
    plot.subtitle = element_text(hjust = 0.5)
  ) +
  scale_y_continuous(
    limits = c(0, 1),
    breaks = seq(0, 1, 0.1),
    labels = scales::percent_format(accuracy = 1)
  )

print(p)


# deviation from expected value plots

mainPlot<-function(F, F_high, F_low, F_hard, F_easy, lab='', ylim=c(-3,3), position = 0, cogload = 0){

  cex<-1.7
  pt.cex<-0.8
  offset<-1

  colors <- if (position == 1 || cogload == 1) {
    list(
      lottery_high = "darkgreen", mirror_high = "lightgreen",
      lottery_low = "darkblue", mirror_low = "lightblue",
      lottery_hard = "darkgreen", mirror_hard = "lightgreen",
      lottery_easy = "darkblue", mirror_easy = "lightblue"
    )
  } else {
    list(lottery = "gray", mirror = "white")
  }
  if (position == 1) {
      x<-F_high %>%filter(grepl('G',mplType))%>%filter(prob!=50)
  }
  else if (cogload == 1) {
      x<-F_hard %>%filter(grepl('G',mplType))%>%filter(prob!=50)
  }
  else {
      x<-F %>%filter(grepl('G',mplType))%>%filter(prob!=50)
  }
  plot(x$prob-0.5,x$lottery-x$pred,type='n',xlim=c(0,100), ylim=ylim,ylab='Deviation from Expected Value',xlab='Probability',yaxt='n',bty='n',xaxt='n',main=lab) # type='n' to create an empty plot
  axis(1,at=seq(0,100,10),labels=seq(0,1,0.1))
  mtext("Risk/Loss Seeking",at=4,side=4,srt=180); mtext("Risk/Loss Averse",at=-4,side=4,srt=180)

  # Legend
  if (position == 1) {
    legend("top", legend=c("Lottery High", "Mirror High", "Lottery Low", "Mirror Low"),
           col=c('black','black','black','black'), 
           pt.bg=c(colors$lottery_high, colors$mirror_high, colors$lottery_low, colors$mirror_low),
           pch=c(21,21,21,21), lty=c(1,1,1,1), cex=0.9, pt.cex=1.5, bg=NA, box.lwd=NA)
  } else if (cogload == 1) {
    legend("top", legend=c("Lottery Hard", "Mirror Hard", "Lottery Easy", "Mirror Easy"),
           col=c('black','black','black','black'), 
           pt.bg=c(colors$lottery_hard, colors$mirror_hard, colors$lottery_easy, colors$mirror_easy),
           pch=c(21,21,21,21), lty=c(1,1,1,1), cex=0.9, pt.cex=1.5, bg=NA, box.lwd=NA)
  }
  else {
    legend("top", legend=c("Lottery (Certainty Equivalents)", 'Mirror (Simplicity Equivalents)'),
           col=c('black','black'), pt.bg=c(colors$lottery, colors$mirror), pch=c(21,21), 
           lty=c(1,1), cex=0.9, pt.cex=1.5, bg=NA, box.lwd=NA)
  }
  # original legend 
  # legend("top",legend=c("Lottery (Certainty Equivalents)",'Mirror (Simplicity Equivalents)'),col=c('black','black'),pt.bg=c('gray','white'),pch=c(21,21),lty=c(1,1),cex=0.9,pt.cex=1.5,bg=NA,box.lwd=NA)

  axis(2,at=seq(-10,10,5))
  abline('h'=0,lty=1)

  # Helper function to plot points for a given dataset and position
  plot_points <- function(data, lottery_color, mirror_color, pch_type=21, show_labels=TRUE) {
    if (nrow(data) == 0) return()
  
    # Lottery points
    arrows(x0=data$prob-0.5, y0=data$lottery-data$pred-2*data$ceLotteryse, 
           x1=data$prob-0.5, y1=data$lottery-data$pred+2*data$ceLotteryse, 
           code=3, angle=90, length=0.05, col="black", lwd=0.5)
    points(data$prob-0.5, data$lottery-data$pred, bg=lottery_color, col='black', pch=pch_type, cex=cex)
    if (show_labels) {
      text(data$prob, data$lottery-data$pred, pos=2, labels=data$mplType, cex=pt.cex, col='black', offset=offset)
    }
    
    # Mirror points
    y_val <- if (pch_type == 25) data$mirror else data$mirror-data$pred
    arrows(x0=data$prob+0.5, y0=y_val-2*data$ceMirrorse, 
           x1=data$prob+0.5, y1=y_val+2*data$ceMirrorse, 
           code=3, angle=90, length=0.05, col="black", lwd=0.5, lty=1)
    points(data$prob+0.5, y_val, bg=mirror_color, col='black', pch=pch_type, cex=cex)
    if (show_labels) {
      text(data$prob, y_val, pos=4, labels=data$mplType, cex=pt.cex, col='black', offset=offset)
    }
  }
  
  # Plot G types
  if (position == 1) {
    x_high <- F_high %>% filter(grepl('G', mplType)) %>% filter(prob != 50)
    x_low <- F_low %>% filter(grepl('G', mplType)) %>% filter(prob != 50)
    plot_points(x_high, lottery_color = colors$lottery_high, mirror_color = colors$mirror_high, pch_type = 21, show_labels = TRUE)
    plot_points(x_low, lottery_color = colors$lottery_low, mirror_color = colors$mirror_low, pch_type = 21, show_labels = TRUE)
  } 
  else if (cogload == 1) {
    x_hard <- F_hard %>% filter(grepl('G', mplType)) %>% filter(prob != 50)
    x_easy <- F_easy %>% filter(grepl('G', mplType)) %>% filter(prob != 50)
    plot_points(x_hard, lottery_color = colors$lottery_hard, mirror_color = colors$mirror_hard, pch_type = 21, show_labels = TRUE)
    plot_points(x_easy, lottery_color = colors$lottery_easy, mirror_color = colors$mirror_easy, pch_type = 21, show_labels = TRUE)
  }
  else if (position == 0 && cogload == 0) {
    x <- F %>% filter(grepl('G', mplType)) %>% filter(prob != 50)
    plot_points(x, lottery_color = colors$lottery, mirror_color = colors$mirror, pch_type = 21, show_labels = TRUE)
  }

  # Plot L types
  if (position == 1) {
    x_high <- F_high %>% filter(grepl('L', mplType)) %>% filter(prob != 50) 
    x_low <- F_low %>% filter(grepl('L', mplType)) %>% filter(prob != 50)
    plot_points(x_high, lottery_color = colors$lottery_high, mirror_color = colors$mirror_high, pch_type = 21, show_labels = TRUE)
    plot_points(x_low, lottery_color = colors$lottery_low, mirror_color = colors$mirror_low, pch_type = 21, show_labels = TRUE)
  } 
  else if (cogload == 1) {
    x_hard <- F_hard %>% filter(grepl('L', mplType)) %>% filter(prob != 50) 
    x_easy <- F_easy %>% filter(grepl('L', mplType)) %>% filter(prob != 50)
    plot_points(x_hard, lottery_color = colors$lottery_hard, mirror_color = colors$mirror_hard, pch_type = 21, show_labels = TRUE)
    plot_points(x_easy, lottery_color = colors$lottery_easy, mirror_color = colors$mirror_easy, pch_type = 21, show_labels = TRUE)
  }
  else if (position == 0 && cogload == 0) {
    x <- F %>% filter(grepl('L', mplType)) %>% filter(prob != 50)
    plot_points(x, lottery_color = colors$lottery, mirror_color = colors$mirror, pch_type = 21, show_labels = TRUE)
  }
  
  # Plot A types (triangle shape)
  if (position == 1) {
    x_high <- F_high %>% filter(grepl('A', mplType) | grepl('M', mplType))
    x_low <- F_low %>% filter(grepl('A', mplType) | grepl('M', mplType))
    plot_points(x_high, lottery_color = colors$lottery_high, mirror_color = colors$mirror_high, pch_type = 25, show_labels = TRUE)
    plot_points(x_low, lottery_color = colors$lottery_low, mirror_color = colors$mirror_low, pch_type = 25, show_labels = TRUE)
  } 
  else if (cogload == 1) {
    x_hard <- F_hard %>% filter(grepl('A', mplType) | grepl('M', mplType))
    x_easy <- F_easy %>% filter(grepl('A', mplType) | grepl('M', mplType))
    plot_points(x_hard, lottery_color = colors$lottery_hard, mirror_color = colors$mirror_hard, pch_type = 25, show_labels = TRUE)
    plot_points(x_easy, lottery_color = colors$lottery_easy, mirror_color = colors$mirror_easy, pch_type = 25, show_labels = TRUE)
  } 
  else if (position == 0 && cogload == 0) {
    x <- F %>% filter(grepl('A', mplType) | grepl('M', mplType))
    plot_points(x, lottery_color = colors$lottery, mirror_color = colors$mirror, pch_type = 25, show_labels = TRUE)
  }
}

dfA_plot_maker = function (type = NULL) {
  dfA_plot <- dfA %>%
    filter(!mplType %in% c("GS10", "GS25", "GS50", "GS75", "GS90", 
                         "LS10", "LS25", "LS50", "LS75", "LS90", 
                         "AS10", "AS15")) %>%
    {if (!is.null(type)) {
      switch(type,
        "hard" = filter(., treatment == "hard"),
        "easy" = filter(., treatment == "easy"), 
        "high" = filter(., mirror_position == "high" & lottery_position == "high"),
        "low" = filter(., mirror_position == "low" & lottery_position == "low"),
        .  
      )
    } else .} %>%
    group_by(prob,mplType)%>%
    summarise(
      n=length(unique(participant_id)),
      medDiff=median(lottery_ev-mirror_ev),
      pred=mean(pred),
      ceLotteryse=sd(lottery_ev)/sqrt(n),
      ceMirrorse=sd(mirror_ev)/sqrt(n),
      #   ceLotteryse = pmax(sd(lottery_ev, na.rm = TRUE) / sqrt(n), 0.01),
      #   ceMirrorse = pmax(sd(mirror_ev, na.rm = TRUE) / sqrt(n), 0.01),   
      lottery=mean(lottery_ev),
      mirror=mean(mirror_ev),
    )
}
dfA_plot <- dfA_plot_maker()  # No filtering
dfA_plot_high <- dfA_plot_maker("high")
dfA_plot_low <- dfA_plot_maker("low") 
dfA_plot_hard <- dfA_plot_maker("hard")
dfA_plot_easy <- dfA_plot_maker("easy")

  

mainPlot(F = dfA_plot, lab = '', position=0)
mainPlot(F_high = dfA_plot_high, F_low = dfA_plot_low, lab = '', position=1)
mainPlot(F_hard = dfA_plot_hard, F_easy = dfA_plot_easy, lab = '', cogload=1)

pdf(file.path(PATH_TO_DATA,"Figures/Figure1.pdf"), width = 7.41, height = 8.31)
mainPlot(F = dfA_plot, F_high = dfA_plot_high, F_low = dfA_plot_low, lab = '', position=1)
dev.off()

# main tests

main_tests_rounded<-function(df){
  print(
    df%>%
      filter(!mplType %in% c("GS10", "GS25", "GS50", "GS75", "GS90", 
                             "LS10", "LS25", "LS50", "LS75", "LS90", 
                             "AS10", "AS15")) %>%
      group_by(mplType)%>%
      summarise(
        lottery_p=wilcox.test(round(lottery_ev, 6),pred,paired=TRUE)$p.value,
        mirror_p=wilcox.test(round(mirror_ev, 6),pred,paired=TRUE)$p.value,
        lottery5=wilcox.test(round(lottery_ev,6), pred,paired=TRUE)$p.value<0.05,
        mirror5=wilcox.test(round(mirror_ev, 6) ,pred,paired=TRUE)$p.value<0.05,
        median_difference=median(round(lottery_ev-mirror_ev,6)),
        difference_test_p=wilcox.test(round(lottery_ev,6),round(mirror_ev,6),paired=TRUE)$p.value,
        difference_test_sig=wilcox.test(round(lottery_ev,6),round(mirror_ev,6),paired=TRUE)$p.value<0.05    
        )
    )
}
main_tests<-function(df){
  print(
    df%>%
      filter(!mplType %in% c("GS10", "GS25", "GS50", "GS75", "GS90", 
                             "LS10", "LS25", "LS50", "LS75", "LS90", 
                             "AS10", "AS15")) %>%
      group_by(mplType)%>%
      summarise(
        lottery_p=wilcox.test(lottery_ev,pred,paired=TRUE)$p.value,
        mirror_p=wilcox.test(mirror_ev,pred,paired=TRUE)$p.value,
        lottery5=wilcox.test(lottery_ev,pred,paired=TRUE)$p.value<0.05,
        mirror5=wilcox.test(mirror_ev,pred,paired=TRUE)$p.value<0.05,
        median_difference=median(lottery_ev-mirror_ev),
        difference_test_p=wilcox.test(lottery_ev,mirror_ev,paired=TRUE)$p.value,
        difference_test_sig=wilcox.test(lottery_ev,mirror_ev,paired=TRUE)$p.value<0.05    
      )
  )
}

main_tests_df<-data.frame(main_tests(dfA))
main_tests_df$lottery_p[[4]]
main_tests_rounded_df<-data.frame(main_tests_rounded(dfA))
main_tests_rounded_df$lottery_p[[4]]

view(dfA %>% filter(mplType == "G25"))

G25_pred_values <- dfA %>% filter(mplType=="G25")%>%select(pred)
G25_pred_values
pred = c(6.3, 6.3, 6.3, 6.3, 6.3, 6.3)
G25_pred_values==pred

G25_mirror_ev_values <- dfA %>% filter(mplType=="G25")%>%select(mirror_ev)
G25_mirror_ev_values
mirror_ev <- c(6.5, 5.5, 5.5, 6.9, 7.1, 6.7)
G25_mirror_ev_values[[1]]
G25_mirror_ev_values[[1]]==mirror_ev
round(G25_mirror_ev_values,6)==mirror_ev

mirror <- wilcox.test(round(G25_mirror_ev_values[[1]],6),pred,paired=TRUE)
mirror
mirror <- wilcox.test(G25_mirror_ev_values[[1]],pred,paired=TRUE)
mirror


G25_mirror_ev_values[[1]]

identical(mirror_ev, round(G25_mirror_ev_values[[1]],6))


# Check for exact binary representation differences
all.equal(lottery_ev, G25_lottery_ev_values[[1]])
# Check individual elements with maximum precision
options(digits = 22)
print(lottery_ev)
print(G25_lottery_ev_values[[1]])


# Scatter plots of individual errors

s_mpl<-dfA%>%
  filter(!mplType %in% c("GS10", "GS25", "GS50", "GS75", "GS90", 
                         "LS10", "LS25", "LS50", "LS75", "LS90", 
                         "AS10", "AS15")) %>%
  filter(!grepl('50',mplType)) %>%
  group_by(isLotteryFirst, participant_id)%>%
  summarise(
    mirrorError=mean(abs(mirror_ev - pred)),
    lotteryError=mean(abs(lottery_ev - pred)),
    wmirrorError=mean(multiplier*(mirror_ev -pred)),
    wlotteryError=mean(multiplier*(lottery_ev -pred))
  )


makeScatter<-function(s,lab){

  layout(matrix(1:2,1,2,byrow=FALSE))

  x<-s%>%filter(isLotteryFirst==TRUE)
  cat("nrow(x) in second plot for lottery first is", nrow(x), "\n")
  print(x$mirrorError)
  print(x$lotteryError)
  plot(x$mirrorError,x$lotteryError,type='n',col=rgb(0,0,0,0.35),pch=19,xlab='Mirror',ylab='Lottery',xlim=c(0,15),ylim=c(0,15),bty='n',main=paste(lab,'Absolute  Deviations'))
  legend("topleft",legend=c("Lottery First",'Mirror First'),col=c('black','black'),pt.bg=c('gray','white'),pt.cex=1.5,pch=21,cex=1,bg=NA,box.lwd=NA)
  points(x$mirrorError,x$lotteryError,col='black',bg='darkgray',pch=21,xlab='DPL Mean Error',ylab='SPL Mean Error',xlim=c(0,12),ylim=c(0,12),bty='n',main='Absolute Mean Error')
  x<-s%>%filter(isLotteryFirst==FALSE)
  # points(x$mirrorError,x$lotteryError,col=rgb(1,0,0,0.35),pch=19,ylab='lottery Error')
  points(x$mirrorError,x$lotteryError,col='black',bg='white',pch=21,ylab='lottery Error')
  abline('a'=0,'b'=1,lty=4)

  x<-s%>%filter(isLotteryFirst==TRUE)
  plot(x$wmirrorError,x$wlotteryError,type='n',col=rgb(0,0,0,0.35),pch=19,xlab='Mirror',ylab='Lottery',xlim=c(-10,15),ylim=c(-10,15),bty='n',main=paste(lab,'Normalized  Deviations'),xaxt='n',yaxt='n')
  axis(1,at=seq(-10,16,2))
  axis(2,at=seq(-10,16,2))
  abline('h'=0);abline('v'=0)
  points(x$wmirrorError,x$wlotteryError,col='black',bg='gray',pch=21,xlab='DPL Mean Error',ylab='SPL Mean Error',xlim=c(-10,16),ylim=c(-10,10),bty='n',main='Normalized Mean Error',xaxt='n',yaxt='n')
  x<-s%>%filter(isLotteryFirst==FALSE)
  points(x$wmirrorError,x$wlotteryError,col='black',bg='white',pch=21,ylab='lottery Error')
  abline('a'=0,'b'=1,lty=4)

  print(
    data.frame(
    'Normalized'=unlist(cor.test(s$wmirrorError,s$wlotteryError)[c('estimate','p.value')]),
    'Absolute'=unlist(cor.test(s$mirrorError,s$lotteryError)[c('estimate','p.value')]),
     'Mirror_First_Normalized'=unlist(cor.test(s[s$isLotteryFirst==FALSE,]$wmirrorError,s[s$isLotteryFirst==FALSE,]$wlotteryError)[c('estimate','p.value')]),
     'Lottery_First_Normalized'=unlist(cor.test(s[s$isLotteryFirst==TRUE,]$wmirrorError,s[s$isLotteryFirst==TRUE,]$wlotteryError)[c('estimate','p.value')]),  
     'Mirror_First_Absolute'=unlist(cor.test(s[s$isLotteryFirst==FALSE,]$mirrorError,s[s$isLotteryFirst==FALSE,]$lotteryError)[c('estimate','p.value')]),
     'Lottery_First_Absolute'=unlist(cor.test(s[s$isLotteryFirst==TRUE,]$mirrorError,s[s$isLotteryFirst==TRUE,]$lotteryError)[c('estimate','p.value')])
     )
  )

}
cor.test(s_mpl$wmirrorError,s_mpl$wlotteryError)
         
makeScatter(s_mpl,"")

pdf(file.path(PATH_TO_DATA,"/Figures/Figure4.pdf"), width = 13.05, height = 7.14)
makeScatter(s_mpl,"")
dev.off()
layout(matrix(1))


