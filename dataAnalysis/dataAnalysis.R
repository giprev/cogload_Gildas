#install.packages("jsonlite")
library(jsonlite)
library(tidyverse)
library(dplyr)

setwd("/Users/domitilleprevost/Documents/Master Eco-psycho/Stage/coding/jatos/study_assets_root/073bfc0a-f209-4ca9-9665-9f66dd9fd4ef/dataAnalysis")
getwd()
rm(list = ls())





#------------- Data formatting -----------#

# Path to your file
file_path <- "/Users/domitilleprevost/Documents/Master Eco-psycho/Stage/coding/jatos/study_assets_root/073bfc0a-f209-4ca9-9665-9f66dd9fd4ef/dataAnalysis/jatos_results_data_20250903131954(1).txt"
file_path1 <- "/Users/domitilleprevost/Documents/Master Eco-psycho/Stage/coding/jatos/study_assets_root/073bfc0a-f209-4ca9-9665-9f66dd9fd4ef/dataAnalysis/data_test.txt"
text2 <- readLines(file_path1)

#Loop through each part of the text file and write it to a separate text file
for(i in 1:length(text2)) {
  part <- text[i]
  writeLines(part, paste0("part", i+4, ".txt"))
}

nSub <- length(text)




############## test of the pivot wider

  dataPerParticipant <- fromJSON("part1.txt")

  # test with a single line file:
  dataPerParticipant <- fromJSON("/Users/domitilleprevost/Documents/Master Eco-psycho/Stage/coding/jatos/study_assets_root/073bfc0a-f209-4ca9-9665-9f66dd9fd4ef/dataAnalysis/jatos_results_data_20250908163714/study_result_870/comp-result_871/data.txt")

  # Filter for nback and nbackVisual trials only
  nback_trials <- dataPerParticipant %>%
    filter(task %in% c("nback", "nbackVisual")) %>%
    select(subject, task, block, trial_number, miss, hit, false_alarm, correct_rejection, all_correct, mainNbackCounter, nbackVisualCounter)# %>%
    # Create sequential trial counter for nbackVisual
    # mutate(
    #   trial_nbackVisual_number = ifelse(task == "nbackVisual", 
    #                                    cumsum(task == "nbackVisual"), 
    #                                    NA),
      # Create a unified trial identifier
      # unified_trial_number = case_when(
      #   task == "nback" ~ trial_number,
      #   task == "nbackVisual" ~ trial_nbackVisual_number,
      #   TRUE ~ NA
      # )
    #)
  
    # Get subject ID (assuming it's consistent across trials)
    subject_id <- nback_trials$subject[1]
    
    # Count all_correct == FALSE occurrences
    all_correct_false_count <- sum(nback_trials$all_correct == FALSE, na.rm = TRUE)
    
    # Calculate accuracy statistics
    calc_accuracy <- function(data) {
      if(nrow(data) == 0) return(NA)
      correct_trials <- sum(data$hit == 1 | data$correct_rejection == 1, na.rm = TRUE)
      total_trials <- nrow(data)
      return(correct_trials / total_trials)
    }
    
    # Calculate STAT accuracy columns
    stat_accuracy_nback <- calc_accuracy(nback_trials %>% filter(task == "nback"))
    stat_accuracy_nbackVisual <- calc_accuracy(nback_trials %>% filter(task == "nbackVisual"))
    stat_accuracy_nback_hard <- calc_accuracy(nback_trials %>% filter(task == "nback" & block == "main_hard"))
    stat_accuracy_nback_easy <- calc_accuracy(nback_trials %>% filter(task == "nback" & block == "main_easy"))
    stat_accuracy_nbackVisual_hard <- calc_accuracy(nback_trials %>% filter(task == "nbackVisual" & block == "main_hard"))
    stat_accuracy_nbackVisual_easy <- calc_accuracy(nback_trials %>% filter(task == "nbackVisual" & block == "main_easy"))
    
    # Create wide format data - Use unified trial number
    trial_data_wide <- nback_trials %>%
      select(mainNbackCounter, miss, hit, false_alarm, correct_rejection, task) %>%
      # Create unique identifier using task and mainNbackCounter
      mutate(trial_id = paste0("trial_", task, "_", mainNbackCounter)) %>%
      pivot_longer(cols = c(miss, hit, false_alarm, correct_rejection), 
                   names_to = "measure", 
                   values_to = "value") %>%
      unite("column_name", trial_id, measure, sep = "_") %>%
      select(column_name, value) #%>%
      # group_by(column_name) %>%
      pivot_wider(names_from = column_name, values_from = value)

      View(trial_data_wide)
      View(nback_trials)
      View(dataPerParticipant[mainNbackCounter])

    block_data_wide <- nback_trials %>%
      select(mainNbackCounter, block, task) %>%
      # Create unique identifier for block columns
      mutate(trial_id = paste0("trial_", task, "_", mainNbackCounter, "_block")) %>%
      select(trial_id, block) %>%
      # group_by(trial_id) %>%
      pivot_wider(names_from = trial_id, values_from = block)


head(trial_data_wide)
  ################## end of the test of the pivot wider





























# Initialize final_data outside the loop
final_data <- data.frame()

for(iSub in 1:nSub) {
  partDirectory <- paste("part", as.character(iSub), ".txt", sep = "")
  
  dataPerParticipant <- fromJSON(partDirectory)
  
  # Filter for nback and nbackVisual trials only
  nback_trials <- dataPerParticipant %>%
    filter(task %in% c("nback", "nbackVisual")) %>%
    select(subject, task, block, trial_number, miss, hit, false_alarm, correct_rejection, all_correct) %>%
    # Create sequential trial counter for nbackVisual
    mutate(
      trial_nbackVisual_number = ifelse(task == "nbackVisual", 
                                       cumsum(task == "nbackVisual"), 
                                       NA),
      # Create a unified trial identifier
      unified_trial_number = case_when(
        task == "nback" ~ trial_number,
        task == "nbackVisual" ~ trial_nbackVisual_number,
        TRUE ~ NA
      )
    )
  
  if(nrow(nback_trials) > 0) {
    # Get subject ID (assuming it's consistent across trials)
    subject_id <- nback_trials$subject[1]
    
    # Count all_correct == FALSE occurrences
    all_correct_false_count <- sum(nback_trials$all_correct == FALSE, na.rm = TRUE)
    
    # Calculate accuracy statistics
    calc_accuracy <- function(data) {
      if(nrow(data) == 0) return(NA)
      correct_trials <- sum(data$hit == 1 | data$correct_rejection == 1, na.rm = TRUE)
      total_trials <- nrow(data)
      return(correct_trials / total_trials)
    }
    
    # Calculate STAT accuracy columns
    stat_accuracy_nback <- calc_accuracy(nback_trials %>% filter(task == "nback"))
    stat_accuracy_nbackVisual <- calc_accuracy(nback_trials %>% filter(task == "nbackVisual"))
    stat_accuracy_nback_hard <- calc_accuracy(nback_trials %>% filter(task == "nback" & block == "main_hard"))
    stat_accuracy_nback_easy <- calc_accuracy(nback_trials %>% filter(task == "nback" & block == "main_easy"))
    stat_accuracy_nbackVisual_hard <- calc_accuracy(nback_trials %>% filter(task == "nbackVisual" & block == "main_hard"))
    stat_accuracy_nbackVisual_easy <- calc_accuracy(nback_trials %>% filter(task == "nbackVisual" & block == "main_easy"))
    
    # Create wide format data - Use unified trial number
    trial_data_wide <- nback_trials %>%
      select(unified_trial_number, miss, hit, false_alarm, correct_rejection, task) %>%
      # Create unique identifier using task and unified trial number
      mutate(trial_id = paste0("trial_", task, "_", unified_trial_number)) %>%
      pivot_longer(cols = c(miss, hit, false_alarm, correct_rejection), 
                   names_to = "measure", 
                   values_to = "value") %>%
      unite("column_name", trial_id, measure, sep = "_") %>%
      select(column_name, value) %>%
      # group_by(column_name) %>%
      pivot_wider(names_from = column_name, values_from = value)
    
    block_data_wide <- nback_trials %>%
      select(unified_trial_number, block, task) %>%
      # Create unique identifier for block columns
      mutate(trial_id = paste0("trial_", task, "_", unified_trial_number, "_block")) %>%
      select(trial_id, block) %>%
      # group_by(trial_id) %>%
      pivot_wider(names_from = trial_id, values_from = block)
    
    # Create the final row for this participant
    participant_row <- data.frame(
      subject = subject_id,
      STAT_accuracy_nback = stat_accuracy_nback,
      STAT_accuracy_nbackVisual = stat_accuracy_nbackVisual,
      STAT_accuracy_nback_hard = stat_accuracy_nback_hard,
      STAT_accuracy_nback_easy = stat_accuracy_nback_easy,
      STAT_accuracy_nbackVisual_hard = stat_accuracy_nbackVisual_hard,
      STAT_accuracy_nbackVisual_easy = stat_accuracy_nbackVisual_easy,
      all_correct_false_count = all_correct_false_count
    )
    
    # Combine with trial data
    if(ncol(trial_data_wide) > 0) {
      participant_row <- cbind(participant_row, trial_data_wide)
    }
    if(ncol(block_data_wide) > 0) {
      participant_row <- cbind(participant_row, block_data_wide)
    }
    
    # Create dynamically named dataset for this participant
    dataset_name <- paste0("final_data_", iSub)
    assign(dataset_name, participant_row)
    
    # Optional: Also save as CSV file
    # csv_filename <- paste0("final_data_", iSub, ".csv")
    # write.csv(participant_row, csv_filename, row.names = FALSE)
    
    # Print confirmation
    print(paste("Created dataset:", dataset_name, "with dimensions:", 
                nrow(participant_row), "x", ncol(participant_row)))
  }
}

# # Optional: View the first participant's data
# if(exists("final_data_1")) {
#   print(paste("Final dataset dimensions:", nrow(final_data_1), "x", ncol(final_data_1)))
#   print("Column names:")
#   print(colnames(final_data_1))
# }
