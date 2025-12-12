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
library(patchwork)
library(ggtext)


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
filePath_testGildas07_20251105 <- "/Users/domitilleprevost/Downloads/jatos_results_data_20251105150400.txt" # trial with failure at the comprehension questions
filePath_testGildas08_20251105 <- "/Users/domitilleprevost/Downloads/jatos_results_data_20251106092713.txt" # trial with failure at the comprehension questions
filePath_testGildas09_20251114 <- "/Users/domitilleprevost/Downloads/jatos_results_data_20251114111004.txt"
filePath_testGildas10_20251117 <- "/Users/domitilleprevost/Downloads/jatos_results_data_20251117123042.txt"
filePath_testGildas11_20251125<- "/Users/domitilleprevost/Downloads/jatos_results_data_20251125093815.txt" # multiple trials taken from the last days (from 17/11 at 1:16 pm to 25/11 at 10:08am)
filePath_testGildas12_20251125 <- "/Users/domitilleprevost/Downloads/jatos_results_data_20251126225013.txt"
filePath_testGildas13_20251127 <- "/Users/domitilleprevost/Downloads/jatos_results_data_20251127132619.txt" # three test trials completed in the lab after updated payment rule. Only one until the end

filePath_pilot_1And2FromJatos <- "/Users/domitilleprevost/Downloads/jatos_results_data_20251201101543.txt" # two first pilots downloaded from jatos not reunited by hand

filePath_pilot1_20251126 <- "/Users/domitilleprevost/Documents/Master Eco-psycho/Stage/coding/dataExperiment/results_pilot1_20251126.txt" # first pilot
filePath_pilot_1And2 <- "/Users/domitilleprevost/Documents/Master Eco-psycho/Stage/coding/dataExperiment/results_pilot_1&2.txt" # first and second pilot pooled

filePath_pilot2_20251127 <- "/Users/domitilleprevost/Documents/Master Eco-psycho/Stage/coding/dataExperiment/results_pilot2_20251127.txt" # 


text <- readLines(filePath_pilot_1And2FromJatos)

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
      mutate(rtSpanMpl = case_when(
          (block == "span_mpl" & task == "mpl") ~ lead(rt),
          TRUE ~ NA
        )
      ) %>%
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
          # cat("surePayments defined with position =", position)
          
          if (switch_row1 == -1 & switch_row2 == -1) {
            noSwitchCounter <<- noSwitchCounter + 1
            if ((isLotteryFirst == TRUE & status_mpl =="lottery") | (isLotteryFirst == FALSE & status_mpl =="mirror")) {
              noSwitchCounterFirstPart <<- noSwitchCounterFirstPart + 1
            }
            else if ((isLotteryFirst == FALSE & status_mpl == "lottery") | (isLotteryFirst == TRUE & status_mpl =="mirror")) {
              noSwitchCounterSecondPart <<- noSwitchCounterSecondPart + 1
            }
            if (status_mpl == "lottery"){ noSwitchCounterLottery <<- noSwitchCounterLottery + 1} 
            if (status_mpl == "mirror"){noSwitchCounterMirror <<- noSwitchCounterMirror + 1}

            varName <- paste0("noSwitchCounter_", mpl_type, "_", status_mpl)
            noSwitchCounters[[varName]] <<- noSwitchCounters[[varName]] + 1
            #cat("noSwitchCounters[[varName]]=", noSwitchCounters[[varName]], " for ", varName, "\n")
            #cat("noSwitchCounter updated and is now", noSwitchCounter, "\n")
            if (X_value == "A") {
              if (all(choices == "lottery")) {
              noSwitchCounterRisky <<- noSwitchCounterRisky + 1
              if (position == "high") {noSwitchCounterHighRisky <<- 1 + noSwitchCounterHighRisky}
              else if (position == "low") {noSwitchCounterLowRisky <<- 1 + noSwitchCounterLowRisky}
              ev_value <- (y_value - (surePayments[1] - 0.5))/2 # sure amount as if the switching point was on the line after the last line
              # cat("all choices lottery in A",y_value, "lottery, ev is", ev_value, "\n")
            } else if (all(choices == "sure")) {
              noSwitchCounterSure <<- noSwitchCounterSure + 1
              if (position == "high") {noSwitchCounterHighSure <<- 1 + noSwitchCounterHighSure}
              else if (position == "low") {noSwitchCounterLowSure <<- 1 + noSwitchCounterLowSure}
              ev_value <- (y_value - (surePayments[length(surePayments)]+ 0.5))/2 # sure amount as if the switching point was on the line after the last line
              # cat("all choices sure in A",y_value, "lottery, ev is", ev_value, "\n")
            } else {
              ev_value <- NA  # Undefined behavior
              cat ("switch_row1 = -1 and switch_row2 = -1 but calculation failed, ev is NA\n")
            }
            }
            else{
              if (all(choices == "lottery")) {
                noSwitchCounterRisky <<- noSwitchCounterRisky + 1
                if (position == "high") {noSwitchCounterHighRisky <<- 1 + noSwitchCounterHighRisky}
                else if (position == "low") {noSwitchCounterLowRisky <<- 1 + noSwitchCounterLowRisky}
                ev_value <- surePayments[length(surePayments)] + 0.1 # sure amount as if the switching point was on the line after the last line
                # cat("all choices lottery, ev is", ev_value, "\n")
              } else if (all(choices == "sure")) {
                noSwitchCounterSure <<- noSwitchCounterSure + 1
                if (position == "high") {noSwitchCounterHighSure <<- 1 + noSwitchCounterHighSure}
                else if (position == "low") {noSwitchCounterLowSure <<- 1 + noSwitchCounterLowSure}
                ev_value <- surePayments[1] - 0.1 # sure amount as if the switching point was on the line before the first line
                # cat("all choices sure, ev is", ev_value, "\n")
              } else {
                ev_value <- NA  # Undefined behavior
                cat ("switch_row1 = -1 and switch_row2 = -1 but calculation failed, ev is NA\n")
              }
          }
          #ev_value <- NA # if we trials without switching points
          #cat("ev_value is NA/n")
          } else {
            if (X_value == "A") {
                ev_value <- (y_value - ((surePayments[switch_row2 + 1] + surePayments[switch_row1 + 1])/2))/2 # 50% chance of positive amount and 50% chance of - 10
                #cat("Calculated ev for A lottery mirror, mplType is", mplType, "y_value is", y_value, "X_value is", X_value, "ev_value is", ev_value, "position is" ,position, "surePayments[switch_row2 + 1] is ", surePayments[switch_row2 + 1], "switch_row2 is",switch_row2,"\n")
                }
            else ev_value <- (surePayments[switch_row2 + 1] + surePayments[switch_row1 + 1]) / 2 # last value of the function is assigned to ev in mutate. ADD 1 because R starts at 1 instead of 0 (js)
            }
          ev_value
          },
        EGEmpirical= {
            y_value <- as.numeric(gsub("[^0-9]", "", mplType))
            X_value <- case_when(
              str_starts(mplType, "G") ~ "G",
              str_starts(mplType, "L") ~ "L",
              str_starts(mplType, "A") ~ "A",
              TRUE ~ NA_character_
            )
            endowment <- case_when(
              X_value == "G" ~ 5,
              X_value == "L" ~ 30,
              (X_value == "A" & y_value == 10) ~ 15,
              (X_value == "A" & y_value == 15) ~ 20
            )
            surePayments <- createSequenceArray(y_value, X_value, position)
            spLength <- length(surePayments)
            if (switch_row1 == -1 & switch_row2 == -1) {
              if(X_value=="G" | X_value=="L"){
                if(all(choices == "lottery")){
                  if(X_value=="G"){EG <- 25*y_value/100 + endowment}
                  else if(X_value=="L"){EG <- -25*y_value/100 + endowment}
                }
                else if(all(choices == "sure")){
                  EG <-(surePayments[1] + surePayments[spLength])/2 + endowment
                }
                else { cat("Error in calculating EGEmpirical when no switch and X is G or L\n")}
              }
              else if(X_value=="A"){
                if(all(choices == "lottery")){
                  EG <- ((((surePayments[1]-y_value)/2 + (surePayments[spLength]-y_value)/2))/2) + endowment
                }
                else if(all(choices=="sure")){
                  EG <- 0 + endowment
                }
                else { cat("Error in calculating EGEmpirical when no switch and X is A\n")}
              }
            }
            else if (!(switch_row1==-1 & switch_row2==-1)){
              if(X_value=="G"){
                EG <- (25*y_value/100)*(switch_row1/spLength) + ((surePayments[switch_row2]+surePayments[spLength])/2)*((spLength-switch_row1)/spLength) + endowment
              }
              else if (X_value=="L"){
                EG <- -(25*y_value/100)*(switch_row1/spLength) + ((surePayments[switch_row2]+surePayments[spLength])/2)*((spLength-switch_row1)/spLength) + endowment
              }
              else if (X_value=="A"){
                EG <- 0 + ((((surePayments[switch_row2]-y_value)/2)+((surePayments[spLength]-y_value)/2))/2)*((spLength-switch_row1)/spLength) + endowment
              }
            }
          cat("EG is ", EG, " with X_value=", X_value," y=", y_value, " switch_row1=",switch_row1, "all(choices == `lottery`) is ", all(choices == "lottery"), " position is ", position, "\n")
          EG
          },
        noSwitchSure = case_when(
          (switch_row1 == -1 & switch_row2 == -1 & all(choices=="sure")) ~ 1,
          TRUE ~ 0
        ),
        noSwitchLottery = case_when(
          (switch_row1 == -1 & switch_row2 == -1 & all(choices=="lottery")) ~ 1, # lotteries stand for "not sure amount", they can be mirrors
          TRUE ~ 0
        ),
        noSwitch = case_when(
          (switch_row1 == -1 & switch_row2 == -1) ~ 1,
          TRUE ~ 0
        )
      ) %>%
      ungroup()
    
    # Select and rename columns as specified
    final_subset <- subset_data %>%
      select(
        ev = ev,
        EGEmpirical = EGEmpirical,
        rtChoice = rt,
        rtSpanMpl = rtSpanMpl,
        subBlockNumber = subBlock,
        accuracy = accuracy,
        position = position,
        noSwitch = noSwitch,
        noSwitchSure = noSwitchSure,
        noSwitchLottery = noSwitchLottery
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
  #for(name in names(dataframes_list)) {
  #  cat("- ", name, ": ", nrow(dataframes_list[[name]]), " rows\n")
  #}
  
  return(dataframes_list)
}




# Initialize final_data outside the loop
final_data <- data.frame()
final_data_2 <- data.frame()

# Initialize noSwitchCounter : number of MPLs where the participants never switched
noSwitchCounter <- 0
noSwitchCounterRisky <- 0
noSwitchCounterSure <- 0
noSwitchCounterHighSure <- 0
noSwitchCounterLowSure <- 0
noSwitchCounterHighRisky <- 0
noSwitchCounterLowRisky <- 0
noSwitchCounters <- list()
# Define all possible combinations
mpl_types <- c("G10", "G25", "G50", "G75", "G90", "L10", "L25", "L50", "L75", "L90", "A10", "A15",
"GS10", "GS25", "GS50", "GS75", "GS90", "LS10", "LS25", "LS50", "LS75", "LS90", "AS10", "AS15")
status_types <- c("mirror", "lottery")
# Initialize ALL possible MPL columns with NA values first
for(mpl_type in mpl_types) {
    for(status_type in status_types) {
            varName <- paste0("noSwitchCounter_",mpl_type, "_", status_type)
            noSwitchCounters[[varName]] <- 0
    }
}
inversionCounter <- 0



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
    
    
    completionCountLottery <- max(dataPerParticipant$failedQuestionsCountLottery, na.rm=TRUE)
    completionCountMirror <- max(dataPerParticipant$failedQuestionsCountMirror, na.rm=TRUE)
    wrongAnswerCountLottery <- sum(dataPerParticipant$incorrectQCountLottery, na.rm = TRUE)
    wrongAnswerCountMirror <- sum(dataPerParticipant$incorrectQCountMirror, na.rm = TRUE)

    noSwitchCounterBeginning <- noSwitchCounter
    noSwitchCounterFirstPart <- 0
    noSwitchCounterSecondPart <- 0
    noSwitchCounterLottery <- 0
    noSwitchCounterMirror <- 0


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
        filter(task == "spanTest" & block == "spanSpan" & spanCounter == 13 & letterType == 2) %>%
        select(span) %>%
        pull()
    spanLength <- as.integer(spanLength)
    
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

#    numCorrectQuestionMirror <- dataPerParticipant %>%
#        filter( !is.na(num_correct) & task == "comprehensionSurveyMPLMirror") %>%
#        select(num_correct) %>%
#        pull()
    
#    numCorrectQuestionLottery <- dataPerParticipant %>%
#        filter( !is.na(num_correct) & task == "comprehensionSurveyMPLLottery") %>%
#        select(num_correct) %>%
#        pull()

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
#        numCorrectQuestionMirror = ifelse(length(numCorrectQuestionMirror) > 0, numCorrectQuestionMirror[1], NA),
#        numCorrectQuestionLottery = ifelse(length(numCorrectQuestionLottery) > 0, numCorrectQuestionLottery[1], NA),
        completionCountLottery = ifelse(length(completionCountLottery)>0, completionCountLottery, NA),
        completionCountMirror = ifelse(length(completionCountMirror)>0, completionCountMirror, NA),
        wrongAnswerCountLottery = ifelse(length(wrongAnswerCountLottery)>0, wrongAnswerCountLottery, NA),
        wrongAnswerCountMirror = ifelse(length(wrongAnswerCountMirror)>0,wrongAnswerCountMirror, NA),
        noSwitchCounter = noSwitchCounter - noSwitchCounterBeginning,
        noSwitchCounterFirstPart = noSwitchCounterFirstPart,
        noSwitchCounterSecondPart = noSwitchCounterSecondPart,
        noSwitchCounterLottery = noSwitchCounterLottery,
        noSwitchCounterMirror = noSwitchCounterMirror,
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
#        numCorrectQuestionMirror = ifelse(length(numCorrectQuestionMirror) > 0, numCorrectQuestionMirror[1], NA),
#        numCorrectQuestionLottery = ifelse(length(numCorrectQuestionLottery) > 0, numCorrectQuestionLottery[1], NA),
        completionCountLottery = ifelse(length(completionCountLottery)>0, completionCountLottery, NA),
        completionCountMirror = ifelse(length(completionCountMirror)>0, completionCountMirror, NA),
        wrongAnswerCountLottery = ifelse(length(wrongAnswerCountLottery)>0, wrongAnswerCountLottery, NA),
        wrongAnswerCountMirror = ifelse(length(wrongAnswerCountMirror)>0,wrongAnswerCountMirror, NA),
        noSwitchCounter = noSwitchCounter - noSwitchCounterBeginning,
        noSwitchCounterFirstPart = noSwitchCounterFirstPart,
        noSwitchCounterSecondPart = noSwitchCounterSecondPart,
        noSwitchCounterLottery = noSwitchCounterLottery,
        noSwitchCounterMirror = noSwitchCounterMirror,
        payment_spanMpl = payment_spanMpl,
        # payment_mpl = payment_mpl,
        payment_spanSpan = payment_spanSpan,
        payment_calibration = payment_calibration,
        payment_total = payment_total,
      )

    # Define all possible combinations
    mpl_types <- c("G10", "G25", "G50", "G75", "G90", "L10", "L25", "L50", 
                   "L75", "L90", "A10", "A15",
                    "GS10", "GS25", "GS50", "GS75", "GS90", "LS10", "LS25", 
                   "LS50", "LS75", "LS90", "AS10", "AS15")
    status_types <- c("mirror", "lottery")
    column_types <- c("ev", "rtChoice", "subBlockNumber", "accuracy", 
                      "position", "rtSpanMpl", "EGEmpirical", "noSwitch",
                      "noSwitchSure", "noSwitchLottery")

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
        col_names <- names(df_data) # ev, rtChoice, subBlockNumber, accuracy, rtSpanMpl, EGEmpirical, noSwitch, noSwitchSure, noSwitchLottery
        
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
    
    accuracyOverall <- participant_row %>%
      summarise(
        accuracyOverall = mean(c_across(ends_with("_accuracy")), na.rm=TRUE)
      ) %>%
      pull(accuracyOverall)

    # Check if this participant has accuracy less than chance level (1/9 around 0.12)
    if(accuracyOverall < 0.12) {
        cat("Skipping participant", iSub, "due to chance level accuracy\n")
        next  # Skip to the next iteration
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

#view(final_data_2)
view(final_data)

tableNoSwitchByPosition <- data.frame(choices = c("risky", "sure", "ratio"), high = c(noSwitchCounterHighRisky, noSwitchCounterHighSure, noSwitchCounterHighRisky/noSwitchCounterHighSure), low = c(noSwitchCounterLowRisky, noSwitchCounterLowSure, noSwitchCounterLowRisky/noSwitchCounterLowSure))
tableNoSwitchByPosition


rtBetweenRoundsMplHard <- final_data_2 %>%
  filter(grepl("<div style=\"position: fixed; top: 10px", stimulus)) %>%
  filter(treatment=="hard")%>%
  pull(rt)
rtBetweenRoundsMplEasy <- final_data_2 %>%
  filter(grepl("<div style=\"position: fixed; top: 10px", stimulus)) %>%
  filter(treatment=="easy")%>%
  pull(rt)

hist(rtBetweenRoundsMpl, breaks = 100)
meanRTHard <- mean(rtBetweenRoundsMplHard)
medianRTHard <- median(rtBetweenRoundsMplHard)
meanRTEasy <- mean(rtBetweenRoundsMplEasy)
medianRTEasy <- median(rtBetweenRoundsMplEasy)
timeRT <- tibble::tibble(treatment=c("hard", "easy"), meanRT=c(meanRTHard, meanRTEasy), medianRT=c(medianRTHard, medianRTEasy))
timeRT







# Create df_model for linear models from final_data - reshape from wide to long, one line per MPL type, both status on the same line
dfA <- final_data %>%
  # Keep all demographic/payment columns as-is, pivot only MPL columns
  pivot_longer(
    cols = matches("^(A|G|L)S?(10|15|25|50|75|90)_(mirror|lottery)_(ev|rtChoice|rtSpanMpl|subBlockNumber|accuracy|EGEmpirical|noSwitch|noSwitchSure|noSwitchLottery)$"),  # Match MPL pattern
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






#------------- Data analysis -----------#





rtCalibration <- final_data_2 %>%
  filter(task == "spanTest" & block == "calibration") %>%
  group_by(subject) %>%
  summarise(
    mean_rt_perParticipant = mean(rt),
    span_max = mean(spanLength)
  )
rtCalibration





# Cognitive load analysis (on span)
#view(dfA)

#Distribution of maximum span length
spanLengthData <- final_data %>%
  pull(spanLength)
spanLengthData
mean(spanLengthData)

df_span <- tibble::tibble(spanLength = spanLengthData)

p_span <- ggplot(df_span, aes(x = spanLength)) +
  geom_histogram(binwidth = 1, boundary = 0.5, colour = "white", fill = "#2c7fb8") +
  scale_x_continuous(breaks = seq(min(spanLengthData, na.rm = TRUE),
                                  max(spanLengthData, na.rm = TRUE), by = 1)) +
  labs(#title = "Distribution of maximum span length",
       x = "Span length",
       y = "Count") +
  theme_minimal(base_size = 14)
p_span<-annotate_figure(p_span, top = text_grob("Distribution of maximum span length", face = "bold", size = 14))


print(p_span)
ggsave(filename = file.path(PATH_TO_DATA, "Figures", "p_span.pdf"),
       plot = p_span, device = "pdf", width = 6, height = 4)



# Distribution of mean accuracy in source vs target span

# table of mean accuracy in source vs target span
mean_accuracy_perParticipants <- final_data_2 %>%
  filter(block == "spanSpan" & task == "spanTest") %>%
  group_by(subject, treatment, letterType) %>%
  summarise(
    mean_accuracy_pp = mean(accuracy, na.rm = TRUE),
    spanLength = unique(spanLength)[[1]],
    rt_r = mean(rt),
    .groups = "drop") %>%
  mutate(
    letterType = dplyr::recode(letterType, `1` = "source", `2` = "target"),
    treatment = dplyr::recode(treatment, `easy` = "control", `hard` = "cognitive load")) %>%
  #group_by(treatment)%>%
  pivot_wider(
    names_from = letterType, 
    values_from = c(mean_accuracy_pp, rt_r),
    names_glue = "{.value}_{letterType}"
  ) %>% 
  ungroup() %>%
  rename(
    accuracy_source = mean_accuracy_pp_source,
    accuracy_target = mean_accuracy_pp_target,
    rt_target = rt_r_target
  ) %>%    
  left_join( # add rt_m_source separately
    final_data_2 %>%
      filter(
        str_detect(stimulus, regex("Vous allez voir les chiffres <span style='color: red'>rouges</span>\\.", ignore_case = TRUE)) 
        & trial_type == "html-button-response") %>%
      group_by(subject, treatment) %>%
      summarise(rt_m_source = mean(rt), .groups= "drop") %>%
      mutate(treatment = dplyr::recode(treatment, `easy` = "control", `hard` = "cognitive load")),
    by = c("subject", "treatment")
  ) %>%
  rowwise() %>%
  mutate(
    accuracy_difference = accuracy_source - accuracy_target,
    rt_difference = rt_r_source - rt_target
  ) %>% ungroup()

mean_accuracy_perParticipants

accuraciesPerParticipants <- mean_accuracy_perParticipants %>% 
  group_by(treatment) %>%
  summarise(
    n = sum(!is.na(accuracy_source) & !is.na(accuracy_target)),
    mean_source = mean(accuracy_source, na.rm = TRUE),
    se_source = sd(accuracy_source)/sqrt(n),
    mean_target = mean(accuracy_target, na.rm = TRUE),
    se_target = sd(accuracy_target)/sqrt(n),
    p_value = ifelse(n >= 2, t.test(accuracy_source, accuracy_target, paired = TRUE)$p.value),
    .groups = "drop"
  )
accuraciesPerParticipants

meanAccuracyPerTargetSource <- mean_accuracy_perParticipants %>%
  summarise(
    meanAccuracySource = mean(accuracy_source, na.rm = TRUE),
    meanAccuracyTarget = mean(accuracy_target, na.rm = TRUE)
  )
meanAccuracyPerTargetSource

# impact of memory load on memory performance check

# Create the plot: accuracy source vs target in cog load vs control condition
makePlotAccuracySourceVsTarget <- function (data) {
  
  data <- data %>% 
    group_by(treatment) %>%
    summarise(
    n = sum(!is.na(accuracy_source) & !is.na(accuracy_target)),
    mean_source = mean(accuracy_source, na.rm = TRUE),
    se_source = sd(accuracy_source)/sqrt(n),
    mean_target = mean(accuracy_target, na.rm = TRUE),
    se_target = sd(accuracy_target)/sqrt(n),
    p_value = ifelse(n >= 2, t.test(accuracy_source, accuracy_target, paired = TRUE)$p.value),
    .groups = "drop"
  )
  
  plots <- list()

  for (i in 1:nrow(data)){
    
    row <-  data[i, ]
    
    df_plot <- tibble::tibble(
      letterType = c("source", "target"), accuracy=c(row$mean_source, row$mean_target), se=c(row$se_source, row$se_target)
      )
    
    manual_p <- tibble(
      group1 = "source", group2 = "target", 
      p= round(row$p_value,3))

    p_i <- ggbarplot(
      df_plot, 
      x = "letterType", 
      y = "accuracy",
      color = "letterType",
      fill = "letterType",
      palette = c("#00AFBB", "#E7B800"),  # 
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
      stat_pvalue_manual(
        manual_p, 
        label = "p = {p}",
        tip.length = -0.01,
        y.position = max(df_plot$accuracy, na.rm = TRUE) - 0.2
      ) +
      # Customize appearance
      labs(
        #title = "Accuracy in source vs target task",
        #subtitle = paste0("n = ", desc_stats$n[1], " participants"),
        x = data$treatment[[i]],
        y = "Accuracy",
        caption = "Error bars = s.e. of the mean on each side"
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
    plots[[i]] <- p_i
  }
  # arrange side-by-side (will handle 1 or 2 rows automatically)
  ncol <- min(2, length(plots))
  combined <- ggpubr::ggarrange(plotlist = plots, ncol = ncol, nrow = ceiling(length(plots)/ncol))
  combined<-annotate_figure(combined, top = text_grob("Accuracy in source vs target task depending on cognitive load", face = "bold", size = 14))
  return(combined)
}
barPlotAccuracySourceVsTarget <- makePlotAccuracySourceVsTarget(mean_accuracy_perParticipants)
barPlotAccuracySourceVsTarget

ggsave(filename = file.path(PATH_TO_DATA, "Figures", "barPlotAccuracySourceVsTarget.pdf"),
       plot = barPlotAccuracySourceVsTarget, device = "pdf", width = 8, height = 5)




makeScatterPlotAccuracyOnSpan <- function (data, acc) {
  plots <- list()
  
  for (i in acc){
    ac <- i
    
    if (!ac %in% names(data)) {
      plots[[i]] <- ggplot() + labs(title = paste0("variable '", ac, "' not found")) 
      next
    }
  
  if (ac == "accuracy_difference") {
    y_limit <- c(-1, 1)
    y_break <- seq(-1, 1, 0.2)
    cat(y_limit, "is y_limit \n")
  } else {
    y_limit <- c(0, 1)
    y_break <- seq(0, 1, 0.1)
    cat(y_limit, "is y_limit \n")
  }
  
    p <- ggscatter(
      data, 
      x = "spanLength", 
      y = ac,
      #color = "letterType",
      #fill = "letterType",
      #palette = c("#00AFBB", "#E7B800"),  # Easy = blue, Hard = yellow
      add = "reg.line",
      add.params = list(color = "blue"),
      alpha = 0
    ) +
      geom_count(aes(x = spanLength, y = .data[[ac]]), colour = "black", fill = "#2c7fb8",
                 show.legend = FALSE, alpha = 0.75) +
      scale_size_area(max_size = 10) +
      # Add horizontal line 
      geom_hline(
        yintercept = 0, 
        linetype =  "solid", 
        color = "black", 
        linewidth = 0.5
      ) +
      # Customize appearance
      labs(
        #title = "Accuracy depending on maxSpan",
        #subtitle = paste0("n = ", desc_stats$n[1], " participants"),
        x = "maximum span achieved at calibration",
        y = ac
      ) +
      theme_pubr() +
      theme(
        legend.position = "none",
        plot.title = element_text(hjust = 0.5),
        plot.subtitle = element_text(hjust = 0.5)
      ) +
      scale_y_continuous(
        limits = y_limit,
        breaks = y_break,
        labels = scales::percent_format(accuracy = 1)
      )
    plots[[i]] <- p
  }
  combined <- ggpubr::ggarrange(plotlist = plots, ncol = length(plots), nrow = 1)
  combined <- annotate_figure(combined, top = text_grob("Accuracies on maximum span achieved", face = "bold", size = 14)) # ))color = "red",
  return(combined)
}
scatterAccuracyOnSpan <- makeScatterPlotAccuracyOnSpan(mean_accuracy_perParticipants, c("accuracy_source", "accuracy_target", "accuracy_difference"))
scatterAccuracyOnSpan


ggsave(filename = file.path(PATH_TO_DATA, "Figures", "scatterAccuracyOnSpan.pdf"),
       plot = scatterAccuracyOnSpan, device = "pdf", width = 12, height = 8)

makeScatterRTOnCogLoad <- function (data) {
  
      plotFunction <- function (acc, rt){
      p <- ggscatter(
      data, 
      x = rt, 
      y = acc,
      #color = "letterType",
      #fill = "letterType",
      #palette = c("#00AFBB", "#E7B800"),  # Easy = blue, Hard = yellow
      add = "reg.line",
      add.params = list(color = "blue"),
    ) +
      # Customize appearance
      labs(
        #title = "accuracy on rt",
        #subtitle = paste0("n = ", desc_stats$n[1], " participants"),
        x = rt,
        y = acc,
        #caption = "Error bars = s.e. of the mean on each side"
      ) +
      theme_pubr() +
      theme(
        legend.position = "none",
        plot.title = element_text(hjust = 0.5),
        plot.subtitle = element_text(hjust = 0.5)
      ) +
      scale_y_continuous(
        limits = c(0, 1),
        breaks = seq(0, 1, 0.2),
        labels = scales::percent_format(accuracy = 1)
      )
     
      }
  
  accuracy_names <- c("accuracy_target", "accuracy_source")
  rt_names <- c("rt_r_source", "rt_m_source", "rt_target")
  plots <- vector("list", length(accuracy_names) * length(rt_names))
  counter = 1
  for (acc in accuracy_names){
    for (rt in rt_names){
      plots[[counter]] <- plotFunction(acc,rt)
      counter <- counter + 1
    }
  }
  
  combined <- ggpubr::ggarrange(plotlist = plots, ncol = 3, nrow = 2)
  combined <- annotate_figure(combined, top = text_grob("Accuracies on RT", face = "bold", size = 14))
  
}
scatterRTOnCogLoad <- makeScatterRTOnCogLoad(mean_accuracy_perParticipants)
scatterRTOnCogLoad
ggsave(filename = file.path(PATH_TO_DATA, "Figures", "scatterRTOnCogLoad.pdf"),
       plot = scatterRTOnCogLoad, device = "pdf", width = 12, height = 6)


# see if people in cognitive load take more time to memorize their source span (rt_m_source)
dataRtMSourcePerTreatment <- mean_accuracy_perParticipants %>%
  group_by(treatment) %>%
  summarise(
    n = n(),
    mean_rt_m_source = mean(rt_m_source),
    median_rt_m_source = median(rt_m_source),
    sd_rt_m_source = sd(rt_m_source),
    se_rt_m_source = sd(rt_m_source)/sqrt(n())
  ) %>%
  ungroup()
dataRtMSourcePerTreatment


makeRtMSourcePerTreatment <- function(data){
  
  p <- ggbarplot(
    data, 
    x = "treatment", 
    y = "median_rt_m_source",
    color = "treatment",
    fill = "treatment",
    palette = c("#00AFBB", "#E7B800"),
    position = position_dodge(0.8),
    alpha = 0.2,
    size = 0.8,
    width = 0.6,
  ) +
    geom_errorbar(
      aes(ymin = median_rt_m_source - se_rt_m_source, ymax = median_rt_m_source + se_rt_m_source),
      width = 0.2,
      position = position_dodge(0.8)
    ) +
    # Add statistical comparison
    #stat_pvalue_manual(
    #  manual_p,
     # label = "p = {p}",
    #  tip.length = -0.01,
    #  y.position = max(df_plot$accuracy, na.rm = TRUE) - 0.2
    #) +
    # Customize appearance
    labs(
      #title = "",
      #subtitle = paste0("n = ", desc_stats$n[1], " participants"),
      x = "treatment",
      y = "median time for memorizing the source span (ms)",
      caption = "Error bars = s.e. of the mean on each side"
    ) +
    theme_pubr() +
    theme(
      legend.position = "none",
      plot.title = element_text(hjust = 0.5),
      plot.subtitle = element_text(hjust = 0.5)
    ) #+
   # scale_y_continuous(
      #limits = c(0, 1),
     # breaks = seq(0, 1, 0.1),
     # labels = scales::percent_format(accuracy = 1)
    #)
}
rtMSourcePerTreatment <-makeRtMSourcePerTreatment(dataRtMSourcePerTreatment)
rtMSourcePerTreatment
ggsave(filename = file.path(PATH_TO_DATA, "Figures", "rtMSourcePerTreatment.pdf"),
       plot = rtMSourcePerTreatment, device = "pdf", width = 12, height = 6)
makeRtMSourcePerTreatment <- function(data){
  
  p <- ggbarplot(
    data, 
    x = "treatment", 
    y = "mean_rt_m_source",
    color = "treatment",
    fill = "treatment",
    palette = c("#00AFBB", "#E7B800"),
    position = position_dodge(0.8),
    alpha = 0.2,
    size = 0.8,
    width = 0.6,
  ) +
    geom_errorbar(
      aes(ymin = mean_rt_m_source - se_rt_m_source, ymax = mean_rt_m_source + se_rt_m_source),
      width = 0.2,
      position = position_dodge(0.8)
    ) +
    # Add statistical comparison
    #stat_pvalue_manual(
    #  manual_p,
    # label = "p = {p}",
    #  tip.length = -0.01,
    #  y.position = max(df_plot$accuracy, na.rm = TRUE) - 0.2
    #) +
    # Customize appearance
    labs(
      #title = "",
      #subtitle = paste0("n = ", desc_stats$n[1], " participants"),
      x = "treatment",
      y = "mean time for memorizing the source span (ms)",
      caption = "Error bars = s.e. of the mean on each side"
    ) +
    theme_pubr() +
    theme(
      legend.position = "none",
      plot.title = element_text(hjust = 0.5),
      plot.subtitle = element_text(hjust = 0.5)
    ) #+
  # scale_y_continuous(
  #limits = c(0, 1),
  # breaks = seq(0, 1, 0.1),
  # labels = scales::percent_format(accuracy = 1)
  #)
}
rtMSourcePerTreatment <-makeRtMSourcePerTreatment(dataRtMSourcePerTreatment)
rtMSourcePerTreatment
ggsave(filename = file.path(PATH_TO_DATA, "Figures", "rtMSourcePerTreatment.pdf"),
       plot = rtMSourcePerTreatment, device = "pdf", width = 12, height = 6)



data_plot_precision_cogload <- final_data_2 %>%
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
    n = n(),
    accuracy = mean(accuracy_mean_participant),
    se = sd(accuracy_mean_participant)/sqrt(n),
    p.value = difference[[1]]
  ) %>% ungroup()

data_plot_precision_cogload


# comparison cogload vs control on target task (span)
makeBarPlotCogLoadOnTargetAccuracy <- function (data) {
  
  manual_p <- tibble(
    group1 = "easy", group2 = "hard", 
    p= round(data$p.value[[1]],3))
  
  plot <- ggbarplot(
  data, 
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
   stat_pvalue_manual(
     manual_p, 
     label = "p = {p}",
     tip.length = -0.01,
     y.position = max(data$accuracy, na.rm = TRUE) - 0.2
     ) +
  # Customize appearance
  labs(
    #title = "Accuracy target task (span): cogload vs baseline treatment",
    #subtitle = paste0("n = ", desc_stats$n[1], " participants"),
    x = "Block Difficulty",
    y = "Accuracy",
    caption = "Error bars represent s.e. of the mean\nRed dashed line shows theoretical chance level"
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
  plot <- annotate_figure(plot, top = text_grob("Accuracy target task (span): cogload vs baseline treatment", face = "bold", size = 14))
  return(plot)

}

barPlotCogLoadOnTargetAccuracy <- makeBarPlotCogLoadOnTargetAccuracy(data_plot_precision_cogload)
barPlotCogLoadOnTargetAccuracy
ggsave(filename = file.path(PATH_TO_DATA, "Figures", "barPlotCogLoadOnTargetAccuracy.pdf"),
       plot = barPlotCogLoadOnTargetAccuracy, device = "pdf", width = 6, height = 5)


# analysis of the RT of choice on accuracy
makeScatterRTOnAccuracy <- function (data) {
  
  plots <- list()
  
  makeDataForPlotFunction <- function (df, treatment_filter=NULL) {
    
    newDf <- df %>%
      filter(!is.na(mplType) & !grepl("^(GS|AS|LS)", mplType)) %>% # starts_with doesn't work in filter, only for select
      {if (!is.null(treatment_filter)) filter(., treatment == treatment_filter) else . }%>%
      select(participant_id, mirror_rtChoice, lottery_rtChoice, mirror_rtSpanMpl, lottery_rtSpanMpl, mirror_accuracy, lottery_accuracy) %>%
      # Pivot RTs only
      pivot_longer(
        cols = matches("_rt"),
        names_to = c("condition", "rtType"),
        names_pattern = "(mirror|lottery)_rt(.*)",
        values_to = "rt"
      ) %>%
      # Pivot accuracy only
      pivot_longer(
        cols = ends_with("accuracy"),
        names_to = "condition_acc",
        names_pattern = "(mirror|lottery)_accuracy",
        values_to = "accuracy"
      ) %>%
      # Keep matching accuracy per condition
      filter(condition == condition_acc) %>%
      select(-condition_acc)
  }
  
  plotFunctionRT <- function (df, ii){
    title_string <- {
      if (is.null(treatment_wanted) & ii == "Choice"){paste0("accuracy on RT memorization/choice")}
      else if (is.null(treatment_wanted) & ii == "SpanMpl"){paste0("accuracy on RT restitution")}
      else if(ii == "Choice" & treatment_wanted == "hard"){ paste0("accuracy on RT memorization/choice, cognitive load" )}
      else if (ii == "SpanMpl" & treatment_wanted == "hard"){ paste0("accuracy on RT restitution, cognitive load" )}
      else if (ii == "SpanMpl" & treatment_wanted == "easy"){ paste0("accuracy on RT restitution, control" )}
      else if (ii == "Choice" & treatment_wanted == "easy"){ paste0("accuracy on RT memorization/choice, control" )}
    }
    cat("title_string", title_string, " with treatment_wanted =", treatment_wanted, " and ii = ", ii , "\n")
    dfB <- df %>%
      filter(rtType == ii)
    cat("colnames(dfB) inside plotFunctionRT is", colnames(dfB), "\n" )
    cat("nrow(dfB) inside plotFunctionRT is", nrow(dfB), "\n" )
    cat("rt is", ii, "\n")
    p <- ggscatter(
      dfB, 
      x = "rt", 
      y = "accuracy",
      #color = "letterType",
      #fill = "letterType",
      add = "reg.line",
      add.params = list(color = "blue"),
    ) +
      # Customize appearance
      labs(
        title = title_string,
        #subtitle = paste0("n = ", desc_stats$n[1], " participants"),
        x = paste0("reaction time"),
        y = "accuracy",
        #caption = "Error bars = s.e. of the mean on each side"
      ) +
      theme_pubr() +
      theme(
        legend.position = "none",
        plot.title = element_text(hjust = 0.5),
        plot.subtitle = element_text(hjust = 0.5)
      ) +
      scale_y_continuous(
        limits = c(0, 1),
        breaks = seq(0, 1, 0.2),
        labels = scales::percent_format(accuracy = 1)
      )
    
  }

  accuracy_names <- c("accuracy")
  treatments_wanted <- list(NULL, "hard", "easy")
  plots <- list()
  counter = 1
  for (treatment_wanted in treatments_wanted) {
    tidy_data <- makeDataForPlotFunction(data, treatment_wanted)
    cat("tidy_data is created with treatment", treatment_wanted, "\n")
    rt_names <- unique(tidy_data$rtType)
    for (acc in accuracy_names){
      for (rt_name in rt_names){
        plots[[counter]] <- plotFunctionRT(tidy_data, rt_name)
        counter <- counter + 1
      }
    }
  }
  
  combined <- ggpubr::ggarrange(plotlist = plots, ncol = 2, nrow = 3)
  combined <- annotate_figure(combined, top = text_grob("Accuracy on RT with MPL as target", face = "bold", size = 14))
}
scatterRTOnAccuracy <- makeScatterRTOnAccuracy(dfA)
scatterRTOnAccuracy
ggsave(filename = file.path(PATH_TO_DATA, "Figures", "scatterRTOnAccuracy.pdf"),
       plot = scatterRTOnAccuracy, device = "pdf", width = 12, height = 10)









# Choices analysis



# empirical EV of the MPL
empiricalEVMpls <- dfA %>%
  pull(mirror_EGEmpirical, lottery_EGEmpirical)%>%
  mean(., na.rm=TRUE)
empiricalEVMpls # 18.07418

accuraciesMpls <- dfA %>%
  pull(mirror_accuracy, lottery_accuracy) %>%
  mean(., na.rm = TRUE)
accuraciesMpls


# inversions of switching pattern 
final_data_2 <- final_data_2 %>%
  filter(block == "span_mpl" & task == "mpl") %>%
  mutate(
    switchInversion = case_when(
      (str_starts(mplType,"G") | str_starts(mplType,"L")) & switchRow1Choice == "sure" & switchRow2Choice == "lottery" ~ 1,
      str_starts(mplType,"A") & switchRow1Choice == "lottery" & switchRow2Choice == "sure" ~ 1,
      TRUE ~ 0
    ),
    .after = switchRow1Choice
  )
view(final_data_2)

#do inversions of switching patterns are influenced by training or cognitive load?
invSubject <- final_data_2 %>%
  group_by(subject)%>%
  summarise(
    inversionCount = sum(switchInversion)
  )
invSubject
invTable <- final_data_2 %>%
  group_by(mplType)%>%
  summarise(
    inversionCount = sum(switchInversion)
  )
invTable
invTreatment <- final_data_2 %>%
  group_by(treatment)%>%
  summarise(
    inversionCount = sum(switchInversion)
  )
invTreatment

makeInversionPlots <- function(invSubject, invTable, invTreatment) {
  # compute common y limit
  max_count <- max(c(invSubject$inversionCount, invTable$inversionCount, invTreatment$inversionCount), na.rm = TRUE)
  y_max <- ifelse(is.finite(max_count), ceiling(max_count * 1.1), 1)
  y_lim <- c(0, y_max)

  p_subj <- ggplot(invSubject, aes(x = factor(subject), y = inversionCount)) +
    geom_col(fill = "#2c7fb8") +
    labs(title = "Inversions per subject", x = "Subject", y = "Inversion count") +
    theme_pubr() +
    theme(axis.text.x = element_text(angle = 90, vjust = 0.5, hjust = 1)) +
    scale_y_continuous(limits = c(0, max(invSubject$inversionCount)*1.1), expand = c(0, 0))

  p_table <- ggplot(invTable, aes(x = factor(mplType), y = inversionCount)) +
    geom_col(fill = "#E7B800") +
    labs(title = "Inversions per MPL type", x = "MPL type", y = "Inversion count") +
    theme_pubr() +
    theme(axis.text.x = element_text(angle = 45, hjust = 1)) +
    scale_y_continuous(limits = c(0, max(invTable$inversionCount)*1.1), expand = c(0, 0))

  p_treat <- ggplot(invTreatment, aes(x = factor(treatment), y = inversionCount)) +
    geom_col(fill = "#4CAF50") +
    labs(title = "Inversions by treatment", x = "Treatment", y = "Inversion count") +
    theme_pubr() +
    theme(axis.text.x = element_text(angle = 0, vjust = 0.5)) +
    scale_y_continuous(limits = c(0, max(invTreatment$inversionCount)*1.1), expand = c(0, 0))

  combined <- ggpubr::ggarrange(p_subj, p_table, p_treat, ncol = 1, nrow = 3, heights = c(1, 1, 0.7))

  return(combined)
}

# Example call (after invSubject, invTable, invTreatment exist)
invPlot <- makeInversionPlots(invSubject, invTable, invTreatment)
print(invPlot)

# merged table: remove an "S" immediately after the first letter, then sum
noSwitchTable <- dfA %>%
  mutate(mpl_base = sub("^([A-Z])S", "\\1", mplType)) %>%   # GS25 -> G25 ; AS10 -> A10 ; LS90 -> L90
  group_by(mpl_base) %>%
  summarise(
    noSwitchCount = sum(mirror_noSwitch, na.rm = TRUE) + sum(lottery_noSwitch, na.rm = TRUE),
    noSwitchCountSure = sum(mirror_noSwitchSure, na.rm = TRUE) + sum(lottery_noSwitchSure, na.rm = TRUE),
    noSwitchCountLottery = sum(mirror_noSwitchLottery, na.rm = TRUE) + sum(lottery_noSwitchLottery, na.rm = TRUE)
  ) %>%
  ungroup() %>%
  rename(mplType = mpl_base) %>%
  arrange(mplType)
noSwitchTable
  

noSwitchSubject <- dfA %>%
  group_by(participant_id) %>%
  summarise(
    noSwitchCount = sum(mirror_noSwitch, na.rm=TRUE) + sum(lottery_noSwitch, na.rm=TRUE),
    noSwitchCountSure = sum(mirror_noSwitchSure, na.rm=TRUE) + sum(lottery_noSwitchSure, na.rm=TRUE),
    noSwitchCountLottery = sum(mirror_noSwitchLottery, na.rm=TRUE) + sum(lottery_noSwitchLottery, na.rm=TRUE)
  )
noSwitchStatus <- tibble::tibble(status = c("mirror", "lottery"), 
                                 noSwitchCount = c(sum(dfA$mirror_noSwitch, na.rm=TRUE), sum(dfA$lottery_noSwitch, na.rm=TRUE)),
                                 noSwitchCountSure = c(sum(dfA$mirror_noSwitchSure, na.rm = TRUE), sum(dfA$lottery_noSwitchSure, na.rm = TRUE)),
                                 noSwitchCountLottery = c(sum(dfA$mirror_noSwitchLottery, na.rm = TRUE), sum(dfA$lottery_noSwitchLottery, na.rm=TRUE))
                                   )
noSwitchStatus

noSwitchTreatment <- dfA %>%
  group_by(treatment) %>%
  summarise(
    noSwitchCount = sum(mirror_noSwitch, na.rm=TRUE) + sum(lottery_noSwitch, na.rm=TRUE),
    noSwitchCountSure = sum(mirror_noSwitchSure, na.rm=TRUE) + sum(lottery_noSwitchSure, na.rm=TRUE),
    noSwitchCountLottery = sum(mirror_noSwitchLottery, na.rm=TRUE) + sum(lottery_noSwitchLottery, na.rm=TRUE),
  )
noSwitchTreatment


makeNoSwitchPanels <- function(noSwitchTable, noSwitchSubject, noSwitchStatus, noSwitchTreatment) {

  # helper to create plots with two stacked geom_col layers (sure bottom, lottery top)
  make_plot_two_layer <- function(df, x_col, xlab = "") {
    
    df <- df %>%
      mutate(x = as.character(.data[[x_col]])) %>%
      arrange(desc(noSwitchCountLottery)) %>%
      mutate(x = factor(x, levels = unique(x)))
    ggplot(df) +
      geom_col(aes(x = x, y = noSwitchCountSure), fill = "#0D47A1", colour = "black", width = 0.7) +   # bottom
      geom_col(aes(x = x, y = noSwitchCountLottery), fill = "#8B0000", colour = "black", width = 0.7, position = "stack") + # top
      labs(x = xlab, y = "No-switch count") +
      theme_pubr() +
      theme(axis.text.x = element_text(angle = ifelse(nlevels(df$x) > 10, 90, 45), hjust = 1))
      # no coord_cartesian / scale_y_continuous -> each plot has its own y scale
  }

  p1 <- make_plot_two_layer(noSwitchTable, "mplType", "MPL type")
  p2 <- make_plot_two_layer(noSwitchSubject, "participant_id", "Subject") + theme(axis.text.x = element_blank())
  p3 <- make_plot_two_layer(noSwitchStatus, "status", "Status")
  p4 <- make_plot_two_layer(noSwitchTreatment, "treatment", "Treatment")

 caption_html <- paste0(
    "Sure amounts selected : <span style='color:#0D47A1;font-weight:600;'>blue</span><br>",
    "Lotteries/mirrors selected : <span style='color:#8B0000;font-weight:600;'>red</span>"
  )

  combined <- (p1) / (p2) / (p3 | p4) + plot_layout(heights = c(1, 1, 0.8)) + plot_annotation(
    title = "noSwitch behaviors counts",
    caption = caption_html,
  ) & theme(
    plot.title = element_text(face = "bold", size = 16, hjust = 0.5),
    plot.caption = ggtext::element_markdown(size = 12, hjust = 0)
  )
  return(combined)
}
makeNoSwitchPanels(noSwitchTable, noSwitchSubject, noSwitchStatus, noSwitchTreatment)






# rt choices analysis
makeDataForRTChoice <- function (df, treatment_filter=NULL) {
  
  newDf <- df %>%
    filter(!is.na(mplType) & !grepl("^(GS|AS|LS)", mplType)) %>% # starts_with doesn't work in filter, only for select
    {if (!is.null(treatment_filter)) filter(., treatment == treatment_filter) else . }%>%
    select(participant_id, mirror_rtChoice, lottery_rtChoice, mirror_rtSpanMpl, lottery_rtSpanMpl, mirror_accuracy, lottery_accuracy, treatment) %>%
    # Pivot RTs only
    pivot_longer(
      cols = matches("_rt"),
      names_to = c("condition", "rtType"),
      names_pattern = "(mirror|lottery)_rt(.*)",
      values_to = "rt"
    ) %>%
    # Pivot accuracy only
    pivot_longer(
      cols = ends_with("accuracy"),
      names_to = "condition_acc",
      names_pattern = "(mirror|lottery)_accuracy",
      values_to = "accuracy"
    ) %>%
    # Keep matching accuracy per condition
    filter(condition == condition_acc) %>%
    select(-condition_acc)
}
dataForRTChoice <-makeDataForRTChoice(dfA)
dataForRTChoice

# Create 4 density panels (hard/ easy × Choice / SpanMpl)
makeRTDensities <- function(data_for_rt) {
  
  df <- data_for_rt %>%
    mutate(
      treatment = factor(treatment, levels = c("hard", "easy")),
      rtType = factor(rtType, levels = c("Choice", "SpanMpl")),
      panel = paste(treatment, rtType, sep = " | ")
    ) %>%
    # keep only the four combinations (order ensured by factor levels)
    filter(treatment %in% c("hard","easy") & rtType %in% c("Choice","SpanMpl"))
  
  if (nrow(df) == 0) stop("No RT data available for plotting.")
  
  # compute summary + peak density for placing annotations
  dens_info <- df %>%
    group_by(treatment, rtType) %>%
    summarise(
      mean_rt = mean(rt, na.rm = TRUE),
      median_rt = median(rt, na.rm = TRUE),
      sd_rt   = sd(rt, na.rm = TRUE),
      n       = sum(!is.na(rt)),
      max_dens = max(density(rt, na.rm = TRUE)$y),
      right_x = max(rt, na.rm = TRUE),
      .groups = "drop"
    ) %>%
    mutate(panel = paste(treatment, rtType, sep = " | "))
  
  # ensure panels appear in the requested order:
  panel_levels <- c("hard | Choice", "hard | SpanMpl", "easy | Choice", "easy | SpanMpl")
  df$panel <- factor(df$panel, levels = panel_levels)
  dens_info$panel <- factor(dens_info$panel, levels = panel_levels)
  
  p <- ggplot(df, aes(x = rt)) +
    geom_density(aes(y = ..density..), fill = "#2c7fb8", alpha = 0.45, colour = NA, adjust = 1) +
    # mean and ±1 sd lines (solid = mean, dashed = mean ± sd)
    geom_vline(data = dens_info, aes(xintercept = mean_rt), colour = "black", size = 0.6) +
    geom_vline(data = dens_info, aes(xintercept = mean_rt + sd_rt), linetype = "dashed", colour = "black", size = 0.4) +
    geom_vline(data = dens_info, aes(xintercept = mean_rt - sd_rt), linetype = "dashed", colour = "black", size = 0.4) +
    # annotation with n, mean and sd
    geom_text(
      data = dens_info,
      aes(x = Inf, y = Inf,
          label = paste0("n=", n, "\nmean=", round(mean_rt, 1), " ms\nmedian=",
                         round(median_rt,1), "ms\nsd=", round(sd_rt, 1), " ms")),
      inherit.aes = FALSE,
      #linewidth = 3,
      hjust = 1,
      vjust = 1
    ) +
    facet_wrap(~ panel, ncol = 2, scales = "free_x") +
    labs(x = "Reaction time (ms)", y = "Density",
         title = "RT densities by treatment and rtType\n(black solid = mean, dashed = ±1 sd)") +
    theme_minimal(base_size = 12) +
    theme(
      strip.text = element_text(face = "bold"),
      plot.title = element_text(hjust = 0.5),
      legend.position = "none"
    )
  

}
rtDensityPlot <- makeRTDensities(dataForRTChoice)
print(rtDensityPlot)
ggsave(filename = file.path(PATH_TO_DATA, "Figures", "rtDensityPlot.pdf"),
       plot = rtDensityPlot, device = "pdf", width = 12, height = 10)


dataRTCalibrateChoice <- dataForRTChoice %>%
  filter(rtType== "Choice") %>%
  pull(rt)

mean(dataRTCalibrateChoice<30000)









# deviation from expected value plots

mainPlot<-function(F, F_high, F_low, F_hard, F_easy, lab='', ylim=c(-3,3), position = 0, cogload = 0){

  cex<-1.7
  pt.cex<-0.8
  offset<-1

  colors <- if (position == 1 || cogload == 1) {
    list(
      lottery_high = "darkred", mirror_high = "lightcoral",
      lottery_low = "darkblue", mirror_low = "lightblue",
      lottery_hard = "darkred", mirror_hard = "lightcoral",
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
      
      # Count valid observations for each measure IF removing no switch point
      n_valid_lottery = sum(!is.na(lottery_ev)),
      n_valid_mirror = sum(!is.na(mirror_ev)),
      n_valid_both = sum(!is.na(lottery_ev) & !is.na(mirror_ev)),
      
      medDiff=median(lottery_ev-mirror_ev),
      meanEVLoss1=mean(abs(pred-((lottery_ev+mirror_ev)/2))),
      pred=mean(pred),
      ceLotteryse=sd(lottery_ev, na.rm = TRUE)/sqrt(n_valid_lottery),
      ceMirrorse=sd(mirror_ev, na.rm = TRUE)/sqrt(n_valid_mirror),
      #   ceLotteryse = pmax(sd(lottery_ev, na.rm = TRUE) / sqrt(n), 0.01),
      #   ceMirrorse = pmax(sd(mirror_ev, na.rm = TRUE) / sqrt(n), 0.01),   
      lottery=mean(lottery_ev, na.rm = TRUE),
      mirror=mean(mirror_ev, na.rm = TRUE),
      .groups = 'drop'
    )%>%
    mutate(
      meanEVLoss2=abs(abs(pred)-abs(lottery+mirror)/2)
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

view(dfA_plot)
meanEVLoss <- dfA_plot %>%
  pull(meanEVLoss)%>%
  mean(.)
meanEVLoss

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




# Scatter plots of individual errors

s_mpl<-dfA%>%
  filter(!mplType %in% c("GS10", "GS25", "GS50", "GS75", "GS90", 
                         "LS10", "LS25", "LS50", "LS75", "LS90", 
                         "AS10", "AS15")) %>% # put back A10 and A15 !
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
  plot(x$mirrorError,x$lotteryError,type='n',col=rgb(0,0,0,0.35),pch=19,xlab='Mirror',ylab='Lottery',xlim=c(0,6),ylim=c(0,6),bty='n',main=paste(lab,'Absolute  Deviations'))
  legend("topleft",legend=c("Lottery First",'Mirror First'),col=c('black','black'),pt.bg=c('gray','white'),pt.cex=1.5,pch=21,cex=1,bg=NA,box.lwd=NA)
  points(x$mirrorError,x$lotteryError,col='black',bg='darkgray',pch=21,xlab='DPL Mean Error',ylab='SPL Mean Error',xlim=c(0,6),ylim=c(0,6),bty='n',main='Absolute Mean Error')
  x<-s%>%filter(isLotteryFirst==FALSE)
  # points(x$mirrorError,x$lotteryError,col=rgb(1,0,0,0.35),pch=19,ylab='lottery Error')
  points(x$mirrorError,x$lotteryError,col='black',bg='white',pch=21,ylab='lottery Error')
  abline('a'=0,'b'=1,lty=4)

  x<-s%>%filter(isLotteryFirst==TRUE)
  plot(x$wmirrorError,x$wlotteryError,type='n',col=rgb(0,0,0,0.35),pch=19,xlab='Mirror',ylab='Lottery',xlim=c(-6,6),ylim=c(-6,6),bty='n',main=paste(lab,'Normalized  Deviations'),xaxt='n',yaxt='n')
  axis(1,at=seq(-6,6,1))
  axis(2,at=seq(-6,6,1))
  abline('h'=0);abline('v'=0)
  points(x$wmirrorError,x$wlotteryError,col='black',bg='gray',pch=21,xlab='DPL Mean Error',ylab='SPL Mean Error',xlim=c(-6,6),ylim=c(-6,6),bty='n',main='Normalized Mean Error',xaxt='n',yaxt='n')
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



dataOprea <- read.csv("/Users/domitilleprevost/Documents/Master Eco-psycho/Stage/coding/jatos/study_assets_root/073bfc0a-f209-4ca9-9665-9f66dd9fd4ef/dataAnalysis/replication_official_oprea/Data/DATA.csv")
rts <- dataOprea %>%
  select(time_mirror, time_lottery, ID, treatment) %>%
  filter(treatment == "main")%>%
  pull(time_mirror)

rts <- rts[rts < 400]
mean(rts[rts < 400], na.rm=TRUE)
mean(rts<35, na.rm=TRUE)
hist(rts, breaks=1000, xlim = range(0:200))



# Overlayed density plot of time_mirror and time_lottery from rts
plot_rts_mirror_lottery_densities <- function(rts_df) {
  
  df_long <- rts_df %>%
    select(time_mirror, time_lottery) %>%
    pivot_longer(cols = everything(), names_to = "which", values_to = "rt") %>%
    filter(!is.na(rt))
  
  if (nrow(df_long) == 0) stop("No RT data available to plot.")
  
  means <- df_long %>% group_by(which) %>% summarise(mean_rt = mean(rt, na.rm = TRUE), .groups = "drop")
  
  colours <- c(time_mirror = "#2c7fb8", time_lottery = "#E7B800")
  
  p <- ggplot(df_long, aes(x = rt, color = which, fill = which)) +
    geom_density(alpha = 0.35, size = 0.6, bw = "nrd0") +
    geom_vline(data = means, aes(xintercept = mean_rt, color = which), linetype = "solid", size = 0.7) +
    scale_color_manual(values = colours, labels = c(time_mirror = "Mirror", time_lottery = "Lottery")) +
    scale_fill_manual(values = colours, labels = c(time_mirror = "Mirror", time_lottery = "Lottery")) +
    labs(title = "RT density: mirror vs lottery",
         x = "Reaction time (ms)",
         y = "Density",
         color = NULL, fill = NULL) +
    theme_minimal(base_size = 13) +
    theme(plot.title = element_text(hjust = 0.5))

  
  return(p)
}

# Example call (uses rts from your script)
rts_density_plot <- plot_rts_mirror_lottery_densities(rts)
print(rts_density_plot)
# ...existing code...
  




