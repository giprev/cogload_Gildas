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
filePath_testGildas03_20251104 <- "/Users/domitilleprevost/Downloads/jatos_results_data_20251104152827.txt"

text <- readLines(filePath_testGildas03_20251104)

nSub <- length(text)

 # length(text)

# Loop through each part of the text file and write it to a separate text file
for(i in 1:nSub) {
  part <- text[i]
  writeLines(part, paste0("part", i, ".txt"))
}

# Initialize final_data outside the loop
final_data <- data.frame()

accuracySpan <- function(answer, correct) {
    # Handle edge cases

    if (is.list(answer)) {
        answer <- answer[[1]]
    }
    if (is.list(correct)) {
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
    cat("answer is", answer, "\n")
    cat("correct is", correct, "\n")


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
    cat("correctMatches is", correctMatches, "\n")
    cat("maxPositions is", maxPositions, "\n")
    cat("accuracySpan is", correctMatches / maxPositions, "\n")
    # Return the ratio of correct matches to the maximum number of positions
    return(correctMatches / maxPositions)
}

roundToDownToFifth <- function(number) {
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
    EV <- roundToDownToFifth(y * 0.25)
  } else if (X == "L") {
    EV <- roundToDownToFifth(-y * 0.25)
  } else if (X == "A" & y == 10) {
    EV <- 9.5
  } else if (X == "A" & y == 15) {
    EV <- 14.5
  }
  
  if (X == "G") {
    cat("y is", y, "X is", X, "position is", position, "\n")
    cat("EV in G is", EV, "\n")
    cat("pos in G is", pos, "\n")
    startValue <- EV - ((pos-1) * 0.2)
    cat("startValue in G is", startValue, "\n")
    for (i in 0:lengthSurePayments) {
      array <- c(array, round((startValue + (i * 0.2)) * 10) / 10)
    }
  } else if (X == "L") {
    cat("y is", y, "X is", X, "position is", position, "\n")
    cat("EV in L is", EV, "\n")
    cat("pos in L is", pos, "\n")
    startValue <- EV - ((pos-1) * 0.2)
    cat("startValue in L is", startValue, "\n")
    for (i in 0:lengthSurePayments) {
      array <- c(array, round((startValue + (i * 0.2)) * 10) / 10)
    }
  } else if (X == "A") {
    cat("y is", y, "X is", X, "position is", position, "\n")
    cat("EV in A is", EV, "\n")
    cat("pos in A is", pos, "\n")
    startValue <- EV - (pos-1)
    cat("startValue in A is", startValue, "\n")
    for (i in 0:lengthSurePayments) {
      array <- c(array, startValue + i)
    }
  }
  return(array)
}
cat("createSequenceArray(50, 'G', 'low'):", createSequenceArray(50, 'G', 'low'), "\n")


extract_mpl_dataframes <- function(dataPerParticipant) {

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
  
  # Get unique combinations of mplType and statusMPL
  unique_combinations <- mpl_data %>%
    select(mplType_modified, statusMPL) %>%
    distinct()
  
  # Initialize list to store dataframes
  dataframes_list <- list()
  
  # Loop through each unique combination
  for(i in 1:nrow(unique_combinations)) {
    mpl_type <- unique_combinations$mplType_modified[i]
    status_mpl <- unique_combinations$statusMPL[i]
    
    # Filter data for this specific combination
    subset_data <- mpl_data %>%
      filter(mplType_modified == mpl_type & statusMPL == status_mpl)
    
    # Calculate ev based on mplType
    subset_data <- subset_data %>%
      mutate(
        ev = case_when(
          str_starts(mplType, "G") ~ (2 * switch_row2 + 1) / 2,
          mplType == "A10" ~ switch_row2 - 5,
          mplType == "AS10" ~ switch_row2 - 5,
          mplType == "A15" ~ switch_row2 - 7.5,
          mplType == "AS15" ~ switch_row2 - 7.5,
          str_starts(mplType, "L") ~ - (2 * switch_row2 - 1) / 2,
          TRUE ~ NA_real_  # For any unexpected mplType values
        ),
      )
    
    # Select and rename columns as specified
    final_subset <- subset_data %>%
      select(
        ev = ev,
        rt = rt,
        subBlockNumber = subBlock,
        accuracy = accuracy
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





for (iSub in 1:nSub) {
    partDirectory <- paste("part", as.character(iSub), ".txt", sep = "")
  
    dataPerParticipant <- fromJSON(partDirectory)
    
    participant_id <- as.character(dataPerParticipant[1,'subject'])


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
    cat(paste("length(spanLength) is", length(spanLength)), "\n")
    
    treatment <- dataPerParticipant %>%
        filter (!is.na(treatment)) %>%
        select(treatment) %>%
        pull()
    treatment <- as.character(treatment)
    cat(paste("length(treatment) is", length(treatment)), "\n")
    
    isLotteryFirst <- dataPerParticipant %>%
        filter(!is.na(versionFirst)) %>%
        select(versionFirst) %>%
        pull()
    cat(paste("length(isLotteryFirst) is", length(isLotteryFirst)), "\n")

    cat("isLotteryFirst before ifelse is", isLotteryFirst, "\n")
    isLotteryFirst <- ifelse(length(isLotteryFirst) > 0 & isLotteryFirst[1] == "lottery_first", 1, 0)

    numCorrectQuestionMirror <- dataPerParticipant %>%
        filter( !is.na(num_correct) & task == "comprehensionSurveyMPLMirror") %>%
        select(num_correct) %>%
        pull()
    cat(paste("length(numCorrectQuestionMirror) is", length(numCorrectQuestionMirror)), "\n")
    
    numCorrectQuestionLottery <- dataPerParticipant %>%
        filter( !is.na(num_correct) & task == "comprehensionSurveyMPLLottery") %>%
        select(num_correct) %>%
        pull()
    cat(paste("length(numCorrectQuestionLottery) is", length(numCorrectQuestionLottery)), "\n")


    payment_spanMpl <- dataPerParticipant %>%
        filter(!is.na(payment_span_mpl)) %>%
        select(payment_span_mpl) %>%
        pull()
    cat(paste("length(payment_spanMpl) is", length(payment_spanMpl)), "\n")

    #put THIS PAYMENT MPL BACK WHEN DATA WILL BE ACTUALIZED
    # payment_mpl <- dataPerParticipant %>%
    #     filter(!is.na(payment_mpl)) %>%
    #     select(payment_mpl) %>%
    #     pull()

    payment_spanSpan <- dataPerParticipant %>%
        filter(!is.na(payment_span_span)) %>%
        select(payment_span_span) %>%
        pull()
    payment_spanSpan <- ifelse(length(payment_spanSpan) > 0, as.numeric(payment_spanSpan[1]), NA)
    cat(paste("length(payment_spanSpan) is", length(payment_spanSpan)), "\n")

    payment_calibration <- dataPerParticipant %>%
        filter(!is.na(payment_calibration)) %>%
        select(payment_calibration) %>%
        pull()
    payment_calibration <- ifelse(length(payment_calibration) > 0, as.numeric(payment_calibration[1]), NA)
    cat(paste("length(payment_calibration) is", length(payment_calibration)), "\n")

        # Extract total payment
    payment_total <- dataPerParticipant %>%
        filter(!is.na(totalPayment)) %>%
        select(totalPayment) %>%
        pull()
    cat(paste("length(payment_total) is", length(payment_total)), "\n")

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
        mutate ( accuracy = case_when(
            !is.na(answer) & !is.null(correct) & mplType != "" & block == "span_mpl" & task == "spanTest" ~ accuracySpan(answer, correct),
            TRUE ~ NA_real_
            ),
            .before = was_correct
        )
    dataPerParticipant <- dataPerParticipant %>%
    # Fill down accuracy for mpl trials
    mutate(
        accuracy = case_when(
            # For span test trials in span_mpl block, use the previous row's accuracy
            block == "span_mpl" & task == "mpl" ~ lead(accuracy),
            # Default case
            TRUE ~ accuracy
        )
    )

    # Extract MPL dataframes
    mpl_dataframes <- extract_mpl_dataframes(dataPerParticipant)
    
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
        treatment = treatment,
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

    # Define all possible combinations
    mpl_types <- c("G10", "G25", "G50", "G75", "G90", "L10", "L25", "L50", "L75", "L90", "A10", "A15",
                    "GS10", "GS25", "GS50", "GS75", "GS90", "LS10", "LS25", "LS50", "LS75", "LS90", "AS10", "AS15")
    status_types <- c("mirror", "lottery")
    column_types <- c("ev", "rt", "subBlockNumber", "accuracy")

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

    cat("Processed participant", iSub, "\n")


}
view(final_data)

# Create df_model for linear models from final_data - reshape from wide to long
dfA <- final_data %>%
  # Keep all demographic/payment columns as-is, pivot only MPL columns
  pivot_longer(
    cols = matches("^(A|G|L)S?(10|15|25|50|75|90)_(mirror|lottery)_"),  # Match MPL pattern
    names_to = c("MPLType", "status", "measure"),
    names_sep = "_" # Split at the first underscore
  ) %>%
  # Combine status and measure
  unite("status_measure", status, measure, sep = "_") %>%
  # Pivot wider
  pivot_wider(
    names_from = status_measure,
    values_from = value
  ) %>%
  mutate(
    pred = case_when(
      str_starts(MPLType, "G") ~ 25 * (as.numeric(str_extract(MPLType, "\\d+")) / 100),
      str_starts(MPLType, "L") ~ -25 * (as.numeric(str_extract(MPLType, "\\d+")) / 100),
      str_starts(MPLType, "A") ~ 0,
      TRUE ~ NA_real_
    ),
  ) %>%
  mutate(
    prob = case_when(
      str_starts(MPLType, "G") ~ as.numeric(str_extract(MPLType, "\\d+")),
      str_starts(MPLType, "L") ~ as.numeric(str_extract(MPLType, "\\d+")),
      str_starts(MPLType, "A") & MPLType %in% c("A10", "AS10") ~ 50,
      str_starts(MPLType, "A") & MPLType %in% c("A15", "AS15") ~ 50,
      TRUE ~ NA_real_
    )
  )




#------------- Data analysis -----------#



mainPlot<-function(F,lab='',ylim=c(-10,10)){

  cex<-1.7
  pt.cex<-0.8
  offset<-1
  x<-F%>%filter(grepl('G',MPLType))%>%filter(prob!=50)
  cat(length(x), "is length of x dfA_plot for G\n")
  plot(x$prob-0.5,x$lottery-x$pred,type='n',pch=21,bg='blue',col='blue',xlim=c(0,100),ylim=ylim,ylab='Deviation from Expected Value',xlab='Probability',yaxt='n',bty='n',xaxt='n',main=lab)
  axis(1,at=seq(0,100,10),labels=seq(0,1,0.1))
  mtext("Risk/Loss Seeking",at=4,side=4,srt=180); mtext("Risk/Loss Averse",at=-4,side=4,srt=180)

  legend("top",legend=c("Lottery (Certainty Equivalents)",'Mirror (Simplicity Equivalents)'),col=c('black','black'),pt.bg=c('gray','white'),pch=c(21,21),lty=c(1,1),cex=0.9,pt.cex=1.5,bg=NA,box.lwd=NA)

  axis(2,at=seq(-10,10,5))
  abline('h'=0,lty=1)

  arrows(x0=x$prob-0.5, y0=x$lottery-x$pred-2*x$ceLotteryse, x1=x$prob-0.5, y1=x$lottery-x$pred+2*x$ceLotteryse, code=3, angle=90, length=0.05, col="black", lwd=0.5)
  points(x$prob-0.5,x$lottery-x$pred,bg='gray',col='black',pch=21,type='p',cex=cex)
  text(x$prob,x$lottery-x$pred,pos=2,labels=x$MPLType,cex=pt.cex,col='black',offset=offset)

  arrows(x0=x$prob+0.5, y0=x$mirror-x$pred-2*x$ceMirrorse, x1=x$prob+0.5, y1=x$mirror-x$pred+2*x$ceMirrorse, code=3, angle=90, length=0.05, col="black", lwd=0.5,lty=1)
  points(x$prob+0.5,x$mirror-x$pred,bg='white',col='black',pch=21,type='p',cex=cex)
  text(x$prob,x$mirror-x$pred,pos=4,labels=x$MPLType,cex=pt.cex,col='black',offset=offset)

  x<-F%>%filter(grepl('L',MPLType))%>%filter(prob!=50)
  cat(length(x), "is length of x dfA_plot for L\n")
  cat(x$prob, "is x$prob \n")
  cat(x$lottery, "is x$lottery \n")
  cat(x$pred, "is x$pred \n")
  cat(x$ceLotteryse, "is x$ceLotteryse \n")
  cat(x$ceMirrorse, "is x$ceMirrorse \n")
  arrows(x0=x$prob-0.5, y0=x$lottery-x$pred-2*x$ceLotteryse, x1=x$prob-0.5, y1=x$lottery-x$pred+2*x$ceLotteryse, code=3, angle=90, length=0.05, col="black", lwd=0.5,lty=1)
  points(x$prob-0.5,x$lottery-x$pred,pch=21,bg='gray',col='black',cex=cex)
  #points(50, 9, pch=21,bg='green',col='black',cex=cex)
  #text(50, 9,pos=2,labels=x$MPLType,cex=pt.cex,col='black',offset=offset)

  arrows(x0=x$prob+0.5, y0=x$mirror-x$pred-2*x$ceMirrorse, x1=x$prob+0.5, y1=x$mirror-x$pred+2*x$ceMirrorse, code=3, angle=90, length=0.05, col="black", lwd=0.5,lty=1)
  points(x$prob+0.5,x$mirror-x$pred,pch=21,bg='white',col='black',cex=cex)
  text(x$prob,x$mirror-x$pred,pos=4,labels=x$MPLType,cex=pt.cex,col='black',offset=offset)

  x<-F%>%filter(grepl('A',MPLType) | grepl('M',MPLType))
  cat(length(x), "is length of x dfA_plot for A\n")
  arrows(x0=x$prob-0.5, y0=x$lottery-2*x$ceLotteryse, x1=x$prob-0.5, y1=x$lottery+2*x$ceLotteryse, code=3, angle=90, length=0.05, col="black", lwd=0.5,lty=1)
  points(x$prob-0.5,x$lottery,pch=25,bg='gray',col='black',cex=cex)
  text(x$prob,x$lottery,pos=2,labels=x$MPLType,cex=pt.cex,col='black',offset=offset)

  arrows(x0=x$prob+0.5, y0=x$mirror-2*x$ceMirrorse, x1=x$prob+0.5, y1=x$mirror+2*x$ceMirrorse, code=3, angle=90, length=0.05, col="black", lwd=0.5,lty=1)
  points(x$prob+0.5,x$mirror,pch=25,bg='white',col='black',cex=cex)
  # text(x$prob,-x$mirror-x$pred,pos=4,labels=x$MPLType,cex=0.5,col='red')
  text(x$prob,x$mirror,pos=4,labels=x$MPLType,cex=pt.cex,col='black',offset=offset)

}

dfA_plot<-dfA%>%
  #filter(treatment=='main')%>%
  filter(!MPLType %in% c("GS10", "GS25", "GS50", "GS75", "GS90", 
                         "LS10", "LS25", "LS50", "LS75", "LS90", 
                         "AS10", "AS15")) %>%
  group_by(prob,MPLType)%>%
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

mainPlot(dfA_plot,'')


pdf(file.path(PATH_TO_DATA,"Figures/Figure1.pdf"), width = 7.41, height = 8.31)
mainPlot(dfA_plot,'')
dev.off()





