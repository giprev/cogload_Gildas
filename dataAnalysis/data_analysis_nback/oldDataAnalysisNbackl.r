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
file_path <- "/Users/domitilleprevost/Documents/Master Eco-psycho/Stage/coding/jatos/study_assets_root/073bfc0a-f209-4ca9-9665-9f66dd9fd4ef/dataAnalysis/jatos_results_data_20250903131954(1).txt"
file_path1 <- "/Users/domitilleprevost/Documents/Master Eco-psycho/Stage/coding/jatos/study_assets_root/073bfc0a-f209-4ca9-9665-9f66dd9fd4ef/dataAnalysis/data_test.txt"
file_path2 <- "/Users/domitilleprevost/Downloads/jatos_results_data_20250909110248.txt"
file_path3 <- "/Users/domitilleprevost/Downloads/jatos_pilot_2_first(codeerror).txt"
file_path4 <- "/Users/domitilleprevost/Downloads/jatos_pilot_5_first(codeerror).txt"
file_path5 <- "/Users/domitilleprevost/Downloads/jatos_pilot_5_second(codeerror).txt"
file_path_test <- "/Users/domitilleprevost/Downloads/jatos_results_data_20250911170821.txt"
file_path_test2 <- "/Users/domitilleprevost/Downloads/jatos_results_data_20250912120513.txt"

#text <- readLines(file_path)
#text1 <- readLines(file_path1)
text <- readLines(file_path5)

length(text)




#Loop through each part of the text file and write it to a separate text file
for(i in 1:length(text)) {
  part <- text[i]
  writeLines(part, paste0("part", i, ".txt"))
}

nSub <- length(text)


# Initialize final_data outside the loop
final_data <- data.frame()

# create final_data : data in a wide format, one row per subject
for(iSub in 1:nSub) { 
  partDirectory <- paste("part", as.character(iSub), ".txt", sep = "")
  
  dataPerParticipant <- fromJSON(partDirectory)
  
  # Filter for nback and nbackVisual trials only, excluding practice trials
  # Count all_correct == FALSE occurrences
  all_correct_false_count <- sum(dataPerParticipant$all_correct == FALSE, na.rm = TRUE)    
  
  dataPerParticipant <- dataPerParticipant %>%
    mutate(key_press =
             case_when(
               key_press == 74 ~ "j",
               key_press == 70 ~ "f"
             ))

  # Determine block order
  block_order <- dataPerParticipant %>%
    filter(test_part %in% "debrief") %>%
    select(block_order_indicator) %>%
    pull()
  
  # Extract the demographics cell
  demographics_values <- dataPerParticipant%>%
    filter(task == "demographics") %>%
    select(responses) %>%
    pull()
  #demographics age
  demographics_age <- dataPerParticipant %>%
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

  # Create nback_trials
  nback_trials <- dataPerParticipant %>%
    filter(task %in% c("nback", "nbackVisual")) %>%
    filter(block %in% c("main_hard", "main_easy")) %>%
    select(subject, task, block, trial_number, miss, hit, false_alarm, correct_rejection, all_correct, mainNbackCounter, nbackVisualCounter, key_press)# %>%
  
  # Add block_position column for trials
  nback_trials <- nback_trials %>%
  mutate(
    is_first_block = case_when(
      block == "main_easy" & block_order == "easy_first" ~ 1,
      block == "main_hard" & block_order == "hard_first" ~ 1,
      block == "main_easy" & block_order == "hard_first" ~ 0,
      block == "main_hard" & block_order == "easy_first" ~ 0,
      TRUE ~ NA_real_  # Handle any unexpected cases
    )
  )
  
# Find the trials that are counting for 50% of the payment
  nback_trials <- nback_trials %>%
    arrange(mainNbackCounter) %>%
    mutate(
      # Determine n based on block
      n_letters = ifelse(block == "main_easy", 1, 3),
      # Mark if previous trial was nbackVisual
      prev_was_visual = lag(task == "nbackVisual", default = FALSE),
      # Create a counter for consecutive nback trials after visual
      consecutive_after_visual1 = ifelse(task == "nback" & prev_was_visual, 1, 0),
      consecutive_after_visual2 = ifelse(task == "nback" & lag(consecutive_after_visual1, default = 0) == 1 & n_letters == 3, 1, 0),
      consecutive_after_visual3 = ifelse(task == "nback" & lag(consecutive_after_visual2, default = 0) == 1 & n_letters == 3, 1, 0),
      # Final after_visual column
      after_visual = case_when(
        task == "nback" & (
          consecutive_after_visual1 == 1 | consecutive_after_visual2 == 1 | consecutive_after_visual3 == 1
        ) ~ 1,
        TRUE ~ 0
      )
    ) %>%
    select(-n_letters, -prev_was_visual, -consecutive_after_visual1, -consecutive_after_visual2, -consecutive_after_visual3)  # Remove helper columns

  if(nrow(nback_trials) > 0) {
    # Get subject ID (assuming it's consistent across trials)
    subject_id <- nback_trials$subject[1]
    
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

    stat_accuracy_2firstVisualTrials <- calc_accuracy(nback_trials %>% filter(task == "nbackVisual" & nbackVisualCounter %% 10 %in% c(1, 2)))  
    stat_accuracy_without_2firstVisualTrials <- calc_accuracy(nback_trials %>% filter(task == "nbackVisual" & !(nbackVisualCounter %% 10 %in% c(1, 2))))
    stat_accuracy_without_2firstVisualTrials_1stBlock <- calc_accuracy(nback_trials %>% filter(task == "nbackVisual" & !(nbackVisualCounter %% 10 %in% c(1, 2)) & is_first_block == 1))
    stat_accuracy_without_2firstVisualTrials_2ndBlock <- calc_accuracy(nback_trials %>% filter(task == "nbackVisual" & !(nbackVisualCounter %% 10 %in% c(1, 2)) & is_first_block == 0))
    stat_accuracy_2firstVisualTrials_1stBlock <- calc_accuracy(nback_trials %>% filter(task == "nbackVisual" & nbackVisualCounter %% 10 %in% c(1, 2) & is_first_block == 1))
    stat_accuracy_2firstVisualTrials_2ndBlock <- calc_accuracy(nback_trials %>% filter(task == "nbackVisual" & nbackVisualCounter %% 10 %in% c(1, 2) & is_first_block == 0))

    stat_accuracy_afterVisualTrials <- calc_accuracy(nback_trials %>% filter(after_visual == 1))
    stat_accuracy_afterVisualTrials_hard <- calc_accuracy(nback_trials %>% filter( after_visual == 1 & block == "main_hard"))
    stat_accuracy_afterVisualTrials_easy <- calc_accuracy(nback_trials %>% filter( after_visual == 1 & block == "main_easy"))

    # Create wide format data - Use unified trial number
    trial_data_wide <- nback_trials %>%
      select(mainNbackCounter, miss, hit, false_alarm, correct_rejection, task, is_first_block, after_visual) %>%
      # Create unique identifier using task and mainNbackCounter
      mutate(trial_id = paste0("trial_", task, "_", mainNbackCounter)) %>%
      pivot_longer(cols = c(miss, hit, false_alarm, correct_rejection, is_first_block, after_visual), 
                   names_to = "measure", 
                   values_to = "value") %>%
      unite("column_name", trial_id, measure, sep = "_") %>%
      select(column_name, value) %>%
      # group_by(column_name) %>%
      pivot_wider(names_from = column_name, values_from = value)
    
    block_data_wide <- nback_trials %>%
      select(mainNbackCounter, block, task) %>%
      # Create unique identifier for block columns
      mutate(trial_id = paste0("trial_", task, "_", mainNbackCounter, "_block")) %>%
      select(trial_id, block) %>%
      # group_by(trial_id) %>%
      pivot_wider(names_from = trial_id, values_from = block)

    keypress_data_wide <- nback_trials %>%
      select(mainNbackCounter, key_press, task) %>%
      # Create unique identifier for key_press columns
      mutate(trial_id = paste0("trial_", task, "_", mainNbackCounter, "_key_press")) %>%
      select(trial_id, key_press) %>%
      pivot_wider(names_from = trial_id, values_from = key_press)
    
    # Create the final row for this participant
    participant_row <- data.frame(
      subject = subject_id,
      STAT_accuracy_nback = stat_accuracy_nback,
      STAT_accuracy_nbackVisual = stat_accuracy_nbackVisual,
      STAT_accuracy_nback_hard = stat_accuracy_nback_hard,
      STAT_accuracy_nback_easy = stat_accuracy_nback_easy,
      STAT_accuracy_nbackVisual_hard = stat_accuracy_nbackVisual_hard,
      STAT_accuracy_nbackVisual_easy = stat_accuracy_nbackVisual_easy,
      STAT_accuracy_2firstVisualTrials = stat_accuracy_2firstVisualTrials,
      STAT_accuracy_without_2firstVisualTrials = stat_accuracy_without_2firstVisualTrials,
      STAT_accuracy_without_2firstVisualTrials_1stBlock = stat_accuracy_without_2firstVisualTrials_1stBlock,
      STAT_accuracy_without_2firstVisualTrials_2ndBlock = stat_accuracy_without_2firstVisualTrials_2ndBlock,
      STAT_accuracy_2firstVisualTrials_1stBlock = stat_accuracy_2firstVisualTrials_1stBlock,
      STAT_accuracy_2firstVisualTrials_2ndBlock = stat_accuracy_2firstVisualTrials_2ndBlock,
      STAT_accuracy_afterVisualTrials = stat_accuracy_afterVisualTrials,
      STAT_accuracy_afterVisualTrials_hard = stat_accuracy_afterVisualTrials_hard,
      STAT_accuracy_afterVisualTrials_easy = stat_accuracy_afterVisualTrials_easy,
      repeated_comprehension_question = all_correct_false_count,
      treatment_order = block_order
    )
    
    # Combine with trial data
    if(ncol(trial_data_wide) > 0) {
      participant_row <- cbind(participant_row, trial_data_wide)
    }
    if(ncol(block_data_wide) > 0) {
      participant_row <- cbind(participant_row, block_data_wide)
    }
    if(ncol(keypress_data_wide) > 0) {
      participant_row <- cbind(participant_row, keypress_data_wide)
    }
    if(ncol(keypress_data_wide) > 0) {
      participant_row <- cbind(participant_row, demographics_df)
    }
    

    # Create dynamically named dataset for this participant
    dataset_name <- paste0("final_data_", iSub)
    assign(dataset_name, participant_row)
    
    # Add to final_data
    if (iSub == 1) {
      final_data <- participant_row
    } else {
      final_data <- rbind(final_data, participant_row)
    }
    
    # # Optional: Also save as CSV file
    # csv_filename <- paste0("final_data_", iSub, ".csv")
    # write.csv(participant_row, csv_filename, row.names = FALSE)
    
  }
}
 view(final_data)
 
mean_nbackVisual_easy <- dataPerParticipant %>%
  filter(block == "main_easy", task == "nbackVisual") %>%
  select("hit", "correct_rejection") %>%
  sum()
mean_nbackVisual_easy
mean_nbackVisual_hard <- dataPerParticipant %>%
  filter(block == "main_hard", task == "nbackVisual") %>%
  select("hit", "correct_rejection") %>%
  sum()
mean_nbackVisual_hard

mean_nbackVisual_easy_df <- df_model %>%
  filter(block == "main_easy", task == "nbackVisual") %>%
  select("hit", "correct_rejection") %>%
  sum()
mean_nbackVisual_easy_df
mean_nbackVisual_hard_fd <- df_model %>%
  filter(block == "main_hard", task == "nbackVisual") %>%
  select("hit", "correct_rejection") %>%
  sum()
mean_nbackVisual_hard_func <- calc_accuracy(df_model %>% filter(block == "main_hard", task == "nbackVisual"))
mean_nbackVisual_hard_func #0.4
calc_accuracy <- function(data) {
  if(nrow(data) == 0) return(NA)
  correct_trials <- sum(data$hit == 1 | data$correct_rejection == 1, na.rm = TRUE)
  total_trials <- nrow(data)
  return(correct_trials / total_trials)
}
mean_nbackVisual_hard
view(dataPerParticipant)

mean_nback_easy <- dataPerParticipant %>%
  filter(block == "main_easy", task == "nback", subject == "edeklr84k5op981") %>%
  select("hit", "correct_rejection") %>%
  sum()
mean_nback_easy
mean_nback_hard <- dataPerParticipant %>%
  filter(block == "main_hard", task == "nback") %>%
  select("hit", "correct_rejection") %>%
  sum()
mean_nback_hard



# Create df_model for linear models from final_data - reshape from wide to long
df_model <- final_data %>%
  # Select relevant columns and demographic data
  select(subject, treatment_order, demo_age, demo_occu, demo_gend, demo_educ, 
         demo_lsat, demo_reve, repeated_comprehension_question,
         starts_with("trial_")) %>%
  # Reshape to long format - each trial becomes a row
  pivot_longer(
    cols = starts_with("trial_") & !ends_with("_block") &!ends_with("key_press"), # exclude block columns because not the same class
    names_to = "trial_info",
    values_to = "value"
  ) %>%
  # Separate the trial information
  separate(trial_info, 
           into = c("trial", "task", "trial_number", "measure"), 
           sep = "_", 
           extra = "merge")%>%
  # Pivot wider to get measures as columns
  pivot_wider(
    names_from = measure,
    values_from = value
  ) %>%
  # Extract block information from block columns in final_data
  left_join( final_data %>%
      select(subject, starts_with("trial_") & ends_with("_block") & !ends_with("first_block")) %>%
      pivot_longer(
        cols = starts_with("trial_") & ends_with("_block"),
        names_to = "trial_info",
        values_to = "block"
      ) %>%
      separate(trial_info, 
               into = c("trial", "task", "trial_number", "block_label"), 
               sep = "_") %>%
      select(subject, task, trial_number, block),
   by = c("subject", "task", "trial_number")
  ) %>%
  left_join( final_data %>%
               select(subject, starts_with("trial_") & ends_with("key_press")) %>%
               pivot_longer(
                 cols = starts_with("trial_") & ends_with("key_press"),
                 names_to = "trial_info",
                 values_to = "key_press"
               ) %>%
               separate(trial_info, 
                        into = c("trial", "task", "trial_number", "key_label"), 
                        sep = "_",
                        extra = "merge") %>%
               select(subject, task, trial_number, key_press),
             by = c("subject", "task", "trial_number")
  ) %>%
  # Add is_first_block logic
  mutate(
    is_first_block = case_when(
      block == "main_easy" & treatment_order == "easy_first" ~ 1,
      block == "main_hard" & treatment_order == "hard_first" ~ 1,
      block == "main_easy" & treatment_order == "hard_first" ~ 0,
      block == "main_hard" & treatment_order == "easy_first" ~ 0,
      TRUE ~ NA_real_
    ),
    # add an is_correct column to fit linear models
    is_correct_excluding = case_when( # excluding : no responses = NA . Incorrect  = miss or f-a
      miss == 1 | false_alarm == 1 ~ 0,
      hit == 1 | correct_rejection == 1 ~ 1,
      hit == 0 & false_alarm == 0 & hit == 0 & correct_rejection == 0 ~ NA_real_
    ),
    is_correct_including = case_when( # including : no responses = incorrect
      miss == 1 | false_alarm == 1 ~ 0,
      hit == 1 | correct_rejection == 1 ~ 1,
      hit == 0 & false_alarm == 0 & hit == 0 & correct_rejection == 0 ~ 0,
    ),
    # Convert to appropriate types
    demo_age = as.numeric(demo_age),
    demo_occu = as.factor(demo_occu),
    demo_gend = as.factor(demo_gend),
    demo_educ = as.factor(demo_educ),
    block = as.factor(block),
    task = as.factor(task),
    trial_number = as.numeric(trial_number)
  ) %>%
  # Select final columns in desired order
  select(subject, block, is_first_block, demo_age, demo_occu, demo_gend, demo_educ,
         task, trial_number, miss, hit, false_alarm, correct_rejection, 
         is_correct_excluding, is_correct_including, key_press) #%>%
  # Remove rows with missing essential data
  #filter(!is.na(block), !is.na(task))
df_model["is_correct_excluding"]
view(df_model)
# Check the result
print(paste("df_model has", nrow(df_model), "rows and", ncol(df_model), "columns"))
str(df_model)
head(df_model)












#------------- Data analysis -----------#

# I - Descriptive statistics

# Verify that participants have understood that they should press F on the two first visualNback trials

t_test_2firstVisualTrials <- t.test(final_data$STAT_accuracy_2firstVisualTrials,
                                    final_data$STAT_accuracy_without_2firstVisualTrials)
t_test_2firstVisualTrials # Significant difference. But still 25% of time on average participants press J instead of F.

final_data["is_first_block"]
data_t_test_2firstVisualTrials_1stBlock <- final_data %>%
  select(ends_with("_is_first_block") == 1)
data_t_test_2firstVisualTrials_2ndBlock <- final_data %>%
  select(ends_with("_is_first_block") == 0)

t_test_2firstVisualTrials_1stBlock <- t.test(data_t_test_2firstVisualTrials_1stBlock$STAT_accuracy_2firstVisualTrials,
                                             data_t_test_2firstVisualTrials_1stBlock$STAT_accuracy_without_2firstVisualTrials)

# II - Understanding the instructions

# III - Strategy used

# Define the chance levels for different strategies 
chance_level <- function (propTa, strat, task) {
  if (strat == "stratF"){
    chance_level <- 1- propTa
  }
  else if (strat == "stratJ"){
    chance_level <- propTa
  }
  else if (strat == "stratR"){
    chance_level <- 0.5
  }
  else if (strat == "stratF-2" & task == "nbackVisual"){
    chance_level <- 0.2 + 0.8*(1- propTa)
  }
  else if (strat == "stratJ-2" & task == "nbackVisual"){
    chance_level <- 0.2 + 0.8*(propTa)
  }
  else if (strat == "stratR-2" & task == "nbackVisual"){
    chance_level <- 0.6
  }
}
compare_chance_levels <- function() {
  # Define parameters
  propTa_nback <- 20/63
  propTa_nbackVisual <- 3/10

  # Calculate all chance levels
  results <- data.frame(
    Strategy = c("stratF", "stratJ", "stratR", "stratF", "stratJ", "stratR", "stratF-2", "stratJ-2", "stratR-2"),
    Task = c("nback", "nback", "nback", "nbackVisual", "nbackVisual", "nbackVisual", "nbackVisual", "nbackVisual", "nbackVisual"),
    Chance_Level = c(
      chance_level(propTa_nback, "stratF", "nback"),
      chance_level(propTa_nback, "stratJ", "nback"),
      chance_level(propTa_nback, "stratR", "nback"),
      chance_level(propTa_nbackVisual, "stratF", "nbackVisual"),
      chance_level(propTa_nbackVisual, "stratJ", "nbackVisual"),
      chance_level(propTa_nbackVisual, "stratR", "nbackVisual"),
      chance_level(propTa_nbackVisual, "stratF-2", "nbackVisual"),
      chance_level(propTa_nbackVisual, "stratJ-2", "nbackVisual"),
      chance_level(propTa_nbackVisual, "stratR-2", "nbackVisual")),
    stringsAsFactors = FALSE
  )
  results <- results %>%
    arrange(Task, Chance_Level)
  cat("For nback task:\n")
  nback_results <- results %>% filter(Task == "nback")
  print(nback_results %>% select(Strategy, Chance_Level))
  
  cat("\nFor nbackVisual task:\n")
  visual_results <- results %>% filter(Task == "nbackVisual")
  print(visual_results %>% select(Strategy, Chance_Level))
  
  cat("• Best strategy for nback:", results$Strategy[which.max(nback_results$Chance_Level)], 
      "with", round(max(nback_results$Chance_Level), 3), "accuracy\n")
  cat("• Worst strategy for nback:", nback_results$Strategy[which.min(nback_results$Chance_Level)], 
      "with", round(min(nback_results$Chance_Level), 3), "accuracy\n")
  cat("• Best strategy for nbackVisual:", visual_results$Strategy[which.max(visual_results$Chance_Level)], 
      "with", round(max(visual_results$Chance_Level), 3), "accuracy\n")
  cat("• Worst strategy for nbackVisual:", visual_results$Strategy[which.min(visual_results$Chance_Level)], 
      "with", round(min(visual_results$Chance_Level), 3), "accuracy\n")
  return(results)
}
chance_comparison <- compare_chance_levels()
# Extract the values you need from the returned data
nback_results <- chance_comparison %>% filter(Task == "nback")
visual_results <- chance_comparison %>% filter(Task == "nbackVisual")

accuracy_best_strat_nback <- max(nback_results$Chance_Level)
accuracy_worst_strat_nback <- min(nback_results$Chance_Level)
accuracy_best_strat_nbackVisual <- max(visual_results$Chance_Level)
accuracy_worst_strat_nbackVisual <- min(visual_results$Chance_Level)



  
# Assess the use of non-random strategies (press only f or only j) for all conditions:
key_press_summary <- df_model %>%
  filter(!is.na(key_press)) %>%
  group_by(task, block) %>%
  summarise(
    total_trials = n(),
    f_presses = sum(key_press == "f", na.rm = TRUE),
    j_presses = sum(key_press == "j", na.rm = TRUE),
    proportion_f = f_presses / total_trials,
    proportion_j = j_presses / total_trials,
    .groups = 'drop'
  )
print("Key press summary by task and block:")
print(key_press_summary)


# IV - Impact of treatments




#PLOTS
#Plot nback visual
plot_data_nbackVisual <- final_data %>%
  select(subject, STAT_accuracy_nbackVisual_hard, STAT_accuracy_nbackVisual_easy) %>%
  pivot_longer(
    cols = c(STAT_accuracy_nbackVisual_hard, STAT_accuracy_nbackVisual_easy),
    names_to = "condition",
    values_to = "accuracy"
  ) %>%
  mutate(
    condition = case_when(
      condition == "STAT_accuracy_nbackVisual_hard" ~ "Hard",
      condition == "STAT_accuracy_nbackVisual_easy" ~ "Easy"
    ),
    condition = factor(condition, levels = c("Easy", "Hard"))
  )

# Calculate descriptive statistics
desc_stats <- plot_data_nbackVisual %>%
  group_by(condition) %>%
  summarise(
    mean = mean(accuracy, na.rm = TRUE),
    sd = sd(accuracy, na.rm = TRUE),
    n = n(),
    se = sd / sqrt(n),
    .groups = 'drop'
  )

print(desc_stats)

# Statistical test
stat_test <- plot_data_nbackVisual %>%
  t_test(accuracy ~ condition, paired = TRUE) %>%
  add_significance()

print(stat_test)

# Get chance level for nbackVisual (stratF-2 is the best strategy)
chance_level_visual <- accuracy_best_strat_nbackVisual

# Create the plot
p <- ggbarplot(
  plot_data_nbackVisual, 
  x = "condition", 
  y = "accuracy",
  add = c("mean_se", "dotplot"),  # Add standard error bars and data points
  color = "condition",
  fill = "condition",
  palette = c("#00AFBB", "#E7B800"),  # Easy = blue, Hard = yellow
  position = position_dodge(0.8),
  alpha = 0.2,
  size = 0.8,
  width = 0.6,
) +
  # Add horizontal line for chance level
  geom_hline(
    yintercept = chance_level_visual, 
    linetype = "dashed", 
    color = "red", 
    linewidth = 1
  ) +
  # Add chance level annotation
  annotate(
    "text", 
    x = 1.5, 
    y = chance_level_visual + 0.02, 
    label = paste0("Chance level = ", round(chance_level_visual, 3)), 
    color = "red", 
    size = 3.5
  ) +
  # Add statistical comparison
  stat_pvalue_manual(
    stat_test, 
    label = "p = {p}",
    tip.length = 0.01,
    y.position = max(plot_data_nbackVisual$accuracy, na.rm = TRUE) + 0.05
  ) +
  # # Customize appearance
  labs(
    title = "Accuracy in nbackVisual Task: Hard vs Easy Blocks",
    subtitle = paste0("n = ", desc_stats$n[1], " participants"),
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
# Save the plot
ggsave("barplot_accuracy_hard_vs_easy_nbackVisual.png", p, width = 8, height = 6, dpi = 300)


# Plot nback letters

plot_data_nback <- final_data %>%
  select(subject, STAT_accuracy_nback_hard, STAT_accuracy_nback_easy) %>%
  pivot_longer(
    cols = c(STAT_accuracy_nback_hard, STAT_accuracy_nback_easy),
    names_to = "condition",
    values_to = "accuracy"
  ) %>%
  mutate(
    condition = case_when(
      condition == "STAT_accuracy_nback_hard" ~ "Hard",
      condition == "STAT_accuracy_nback_easy" ~ "Easy"
    ),
    condition = factor(condition, levels = c("Easy", "Hard"))
  )

# Calculate descriptive statistics
desc_stats <- plot_data_nback %>%
  group_by(condition) %>%
  summarise(
    mean = mean(accuracy, na.rm = TRUE),
    sd = sd(accuracy, na.rm = TRUE),
    n = n(),
    se = sd / sqrt(n),
    .groups = 'drop'
  )

print(desc_stats)

# Statistical test
stat_test <- plot_data_nback %>%
  t_test(accuracy ~ condition, paired = TRUE) %>%
  add_significance()

print(stat_test)

# Get chance level for nbackVisual (stratF-2 is the best strategy)
chance_level <- accuracy_best_strat_nback

# Create the plot
p <- ggbarplot(
  plot_data_nback, 
  x = "condition", 
  y = "accuracy",
  add = c("mean_se", "dotplot"),  # Add standard error bars and data points
  color = "condition",
  fill = "condition",
  palette = c("#00AFBB", "#E7B800"),  # Easy = blue, Hard = yellow
  position = position_dodge(0.8),
  alpha = 0.2,
  size = 0.8,
  width = 0.6,
) +
  # Add horizontal line for chance level
  geom_hline(
    yintercept = chance_level, 
    linetype = "dashed", 
    color = "red", 
    linewidth = 1
  ) +
  # Add chance level annotation
  annotate(
    "text", 
    x = 1.5, 
    y = chance_level_visual + 0.02, 
    label = paste0("Chance level = ", round(chance_level, 3)), 
    color = "red", 
    size = 3.5
  ) +
  # Add statistical comparison
  stat_pvalue_manual(
    stat_test, 
    label = "p = {p}",
    tip.length = 0.01,
    y.position = 1 #max(plot_data_nback$accuracy, na.rm = TRUE) + 0.05
  ) +
  # Customize appearance
  labs(
    title = "Accuracy in nbackVisual Task: Hard vs Easy Blocks",
    subtitle = paste0("n = ", desc_stats$n[1], " participants"),
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
# Save the plot
ggsave("barplot_accuracy_hard_vs_easy_nback.png", p, width = 8, height = 6, dpi = 300)



# Scatter plot: Easy vs Hard nbackVisual accuracy for each participant
scatter_plot <- ggplot(final_data, aes(x = STAT_accuracy_nbackVisual_easy, y = STAT_accuracy_nbackVisual_hard)) +
  # Add diagonal line (equal performance line)
  geom_abline(
    intercept = 0, 
    slope = 1, 
    linetype = "dashed", 
    color = "gray50", 
    linewidth = 1,
    alpha = 1
  ) +
  # Add individual participant points
  geom_point(
    size = 3,
    alpha = 1,
    color = "#2E86AB"  # Nice blue color
  ) +
  # Add chance level lines
  geom_hline(
    yintercept = accuracy_best_strat_nbackVisual,
    linetype = "dotted",
    color = "red",
    linewidth = 0.8
  ) +
  geom_vline(
    xintercept = accuracy_best_strat_nbackVisual,
    linetype = "dotted",
    color = "red",
    linewidth = 0.8
  ) +
  # Add chance level annotation
  annotate(
    "text",
    x = 0.05,
    y = accuracy_best_strat_nbackVisual + 0.02,
    label = paste0("Chance level = ", round(accuracy_best_strat_nbackVisual, 3)),
    size = 3,
    color = "red",
    hjust = 0
  ) +
  # Customize axes and theme
  scale_x_continuous(
    limits = c(0, 0.99),
    breaks = seq(0, 1, 0.2),
    labels = scales::percent_format(accuracy = 1),
    expand = c(0, 0) 
  ) +
  scale_y_continuous(
    limits = c(0, 0.99),
    breaks = seq(0, 1, 0.2),
    labels = scales::percent_format(accuracy = 1),
    expand = c(0, 0) 
  ) +
  coord_cartesian(xlim = c(0, 1), ylim = c(0, 1)) +
  labs(
    title = "Individual Performance: Easy vs Hard nbackVisual",
    subtitle = paste0("n = ", nrow(final_data), " participants"),
    x = "Accuracy in Easy Block",
    y = "Accuracy in Hard Block",
    caption = "Dashed line = equal performance | Dotted lines = theoretical chance level"
  ) +
  theme_pubr() +
  theme(
    plot.title = element_text(hjust = 0.5),
    plot.subtitle = element_text(hjust = 0.5),
    aspect.ratio = 1  # Make the plot square
  )

print(scatter_plot)
ggsave("scatter_easy_vs_hard_nbackVisual.png", scatter_plot, width = 8, height = 8, dpi = 300)




#------------- PLOTTING FUNCTIONS -----------#

create_comparison_barplot <- function(data, easy_col, hard_col, task_name, chance_level) {
  # Prepare data
  plot_data <- data %>%
    select(subject, all_of(easy_col), all_of(hard_col), treatment_order) %>%
    pivot_longer(
      cols = c(all_of(easy_col), all_of(hard_col)),
      names_to = "condition",
      values_to = "accuracy"
    ) %>%
    mutate(
      condition = case_when(
        str_detect(condition, "hard") ~ "Hard",
        str_detect(condition, "easy") ~ "Easy"
      ),
      condition = factor(condition, levels = c("Easy", "Hard")),
      point_color = case_when(
        condition == "Hard" & treatment_order == "hard_first" ~ "white",
        condition == "Hard" & treatment_order == "easy_first" ~ "black", 
        condition == "Easy" & treatment_order == "hard_first" ~ "black",
        condition == "Easy" & treatment_order == "easy_first" ~ "white",
        TRUE ~ "red"  # fallback for any unexpected cases
    ))
  
  # Calculate stats
  desc_stats <- plot_data %>%
    group_by(condition) %>%
    summarise(
      mean = mean(accuracy, na.rm = TRUE),
      sd = sd(accuracy, na.rm = TRUE),
      n = n(),
      se = sd / sqrt(n),
      .groups = 'drop'
    )
  
  stat_test <- plot_data %>%
    t_test(accuracy ~ condition, paired = TRUE) %>%
    add_significance()
  
  
  p <- ggplot(plot_data, aes(x = condition, y = accuracy)) +
    # Add bars manually to avoid conflict
    stat_summary(
      fun = mean,
      geom = "bar",
      aes(fill = condition),
      alpha = 0.7,
      width = 0.6,
      color = "black",
      linewidth = 0.8
    ) +
    # Add error bars
    stat_summary(
      fun.data = mean_se,
      geom = "errorbar",
      color = "black",
      width = 0.2,
      linewidth = 1
    ) +
    # Add points with treatment order colors
    geom_jitter(
      aes(fill = point_color),
      width = 0.2,
      height = 0,
      size = 3,
      alpha = 0.9,
      stroke = 1.5,
      shape = 21,  # Circle with separate fill and border
      color = "black"  # Black border
    ) +
    # Set bar colors
    scale_fill_manual(
      values = c("Easy" = "#00AFBB", "Hard" = "#E7B800", 
                 "white" = "white", "black" = "black", "gray" = "gray"),
      guide = "none"
    ) +
    geom_hline(
      yintercept = chance_level, 
      linetype = "dashed", 
      color = "red", 
      linewidth = 1
    ) +
    annotate(
      "text", 
      x = 1.5, 
      y = chance_level + 0.02, 
      label = paste0("Chance level = ", round(chance_level, 3)), 
      color = "red", 
      size = 3.5
    ) +
    stat_pvalue_manual(
      stat_test, 
      label = "p = {p}",
      tip.length = 0.01,
      y.position = 0.95
    ) +
    labs(
      title = paste("Accuracy in", task_name, "Task: Hard vs Easy Blocks"),
      subtitle = paste0("n = ", desc_stats$n[1], " participants"),
      x = "Block Difficulty",
      y = "Accuracy",
      caption = paste0("Error bars represent standard error of the mean | Red line = theoretical chance level\n",
                      "Point colors: White = block done first, Black = block done second")
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

      # Print point color summary
  color_summary <- plot_data %>%
    group_by(condition, treatment_order, point_color) %>%
    summarise(n = n(), .groups = 'drop')
  cat("\nPoint color mapping:\n")
  print(color_summary)
  
  return(list(plot = p, stats = desc_stats, test = stat_test, color_summary = color_summary)) }
#   # Create plot
#   p <- ggbarplot(
#     plot_data, 
#     x = "condition", 
#     y = "accuracy",
#     add = c("mean_se"),  # Changed from dotplot to avoid binning warning
#     color = "condition",
#     fill = "condition",
#     palette = c("#00AFBB", "#E7B800"),
#     alpha = 0.7,
#     size = 0.8,
#     width = 0.6
#   ) +
#     # Add custom jittered points with better visibility
#     geom_jitter(
#       data = plot_data,
#       width = 0.2,
#       height = 0,
#       size = 3,               # Larger points
#       alpha = 0.8,            # More opaque
#       stroke = 1,             # Add border
#       shape = 21,             # Circle with border
#       color = "black",
#     ) +
#     geom_hline(
#       yintercept = chance_level, 
#       linetype = "dashed", 
#       color = "red", 
#       linewidth = 1
#     ) +
#     annotate(
#       "text", 
#       x = 1.5, 
#       y = chance_level + 0.02, 
#       label = paste0("Chance level = ", round(chance_level, 3)), 
#       color = "red", 
#       size = 3.5
#     ) +
#     stat_pvalue_manual(
#       stat_test, 
#       label = "p = {p}",
#       tip.length = 0.01,
#       y.position = 1  # Fixed position within plot range
#     ) +
#     labs(
#       title = paste("Accuracy in", task_name, "Task: Hard vs Easy Blocks"),
#       subtitle = paste0("n = ", desc_stats$n[1], " participants"),
#       x = "Block Difficulty",
#       y = "Accuracy",
#       caption = "Error bars represent standard error of the mean\nRed dashed line shows theoretical chance level"
#     ) +
#     theme_pubr() +
#     theme(
#       legend.position = "none",
#       plot.title = element_text(hjust = 0.5),
#       plot.subtitle = element_text(hjust = 0.5)
#     ) +
#     scale_y_continuous(
#       limits = c(0, 1),
#       breaks = seq(0, 1, 0.1),
#       labels = scales::percent_format(accuracy = 1)
#     )
  
#   # Print statistics
#   cat("\n=== ", toupper(task_name), " ANALYSIS ===\n")
#   print(desc_stats)
#   print(stat_test)
  
#   return(list(plot = p, stats = desc_stats, test = stat_test))
# }




# # Super compact version using purrr
library(purrr)

# Define plot specifications
plot_specs <- list(
  nbackVisual = list(
    easy_col = "STAT_accuracy_nbackVisual_easy",
    hard_col = "STAT_accuracy_nbackVisual_hard", 
    task_name = "nbackVisual",
    chance_level = accuracy_best_strat_nbackVisual
  ),
  nback = list(
    easy_col = "STAT_accuracy_nback_easy",
    hard_col = "STAT_accuracy_nback_hard",
    task_name = "nback", 
    chance_level = accuracy_best_strat_nback
  ),
  afterNbackVisual = list(
    easy_col = "STAT_accuracy_afterVisualTrials_easy",
    hard_col = "STAT_accuracy_afterVisualTrials_hard",
    task_name = "nbackAfterVisualTrials",
    chance_level = accuracy_best_strat_nback
  )
)

# Generate all plots at once
all_plots <- map(plot_specs, ~create_comparison_barplot(
  final_data, .$easy_col, .$hard_col, .$task_name, .$chance_level
))

# Save all plots
iwalk(all_plots, ~ggsave(
  paste0("barplot_", .y, "_hard_vs_easy.png"), 
  .x$plot, width = 8, height = 6, dpi = 300
))

all_plots

print(all_plots$nbackVisual$plot)
print(all_plots$nback$plot)
print(all_plots$afterNbackVisual$plot)




t_test_hard_easy <- t.test(final_data$STAT_accuracy_nbackVisual_hard, 
                           final_data$STAT_accuracy_nbackVisual_easy)
t_test_hard_easy

fit_c <- lm_robust(
  guess ~ direction + ty1 + direction:ty1 + immigration + feminism + fraud + security + round + comprehension + participant_id_number,
  data = dl_c1_comp,
  clusters = participant_id_number
)





