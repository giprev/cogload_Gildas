# Load required packages
library(dplyr)
library(purrr)
#library(lubridate)
library(ggplot2)
library(EnvStats)

setwd("/Users/domitilleprevost/Documents/Master E&P/Stage/coding/jatos/study_assets_root/073bfc0a-f209-4ca9-9665-9f66dd9fd4ef/dataAnalysis")
PATH_TO_DATA <- "/Users/domitilleprevost/Documents/Master E&P/Stage/coding/jatos/study_assets_root/073bfc0a-f209-4ca9-9665-9f66dd9fd4ef/dataAnalysis"
dir.create(file.path(PATH_TO_DATA, "Figures_pilot3&4&5"), showWarnings = FALSE, recursive = TRUE)
getwd()

# helper to generate unique random ids
generate_ids <- function(n, len = 8) {
  make_one <- function() paste0(sample(letters, len, replace = TRUE), collapse = "")
  ids <- replicate(n, make_one())
  while (any(duplicated(ids))) {
    dup_idx <- which(duplicated(ids))
    ids[dup_idx] <- replicate(length(dup_idx), make_one())
  }
  ids
}

roundDownToFifth <- function(number) {
  return(floor(number * 5) / 5)
}
midPoint <- 0.1
createSequenceArray <- function(y, X, position) {
  
  lengthSurePayments <- 17  # One unit less
  lengthSurePaymentsGO <- 24 # 
  
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

make_switchRow1Choice <- function(mplType_vec, participant_id_vec, switch_row1_vec){
  mplType_vec <- as.character(mplType_vec)
  participant_id_vec <- as.character(participant_id_vec)
  switch_row1_vec <- as.integer(switch_row1_vec)
  
  n <- length(mplType_vec)
  out <- character(n)
  
  out[mplType_vec %in% mplType_sureFirst] <- "sure"
  out[mplType_vec %in% mplType_lotteryFirst] <- "lottery"
  
  mask <- !(participant_id_vec %in% participants_rational) & switch_row1_vec == -1
  if (any(mask)) {
    idx <- which(mask)
    out[idx] <- ifelse(stats::runif(length(idx)) < 0.5, "lottery", "sure")
  }
  
  return(out)
  
}

make_ev = function(mplType,switch_row1, switch_row2, switchRow1Choice, switchRow2Choice, position) {
  y_value <- as.numeric(gsub("[^0-9]", "", mplType))
  X_value <- case_when(
    str_starts(mplType, "G") ~ "G", #(mplType !== "GO10") & (mplType !== "GO90")
    str_starts(mplType, "L") ~ "L",
    str_starts(mplType, "A") ~ "A",
    TRUE ~ NA_character_
  )
  if (!(mplType == "GO10") & !(mplType == "GO90")) {
    surePayments <- createSequenceArray(y_value, X_value, position) # CAUTION if no switch sr1 = sr2 = -1 !!! Then need to see if choices only lotteries or only mirror
    midPoint <- 0.1
  }
  else if ((mplType == "GO10") | (mplType == "GO90")){
    surePayments <- c(1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25)
    midPoint <- 0.5
  }
  # cat("surePayments defined with position =", position)
  
  if (switch_row1 == -1 && switch_row2 == -1) {
    if (X_value == "A") {
      if (switchRow1Choice == "lottery") {
        ev_value <- (y_value - (surePayments[1] - 0.5))/2 # sure amount as if the switching point was on the line after the last line
        #cat("all choices lottery in A",y_value, "position is", position, "lottery, ev is", ev_value, "\n")
      } else if (switchRow1Choice== "sure") {
        ev_value <- (y_value - (surePayments[length(surePayments)]+ 0.5))/2 # sure amount as if the switching point was on the line after the last line
      } else {
        ev_value <- NA  # Undefined behavior
        cat ("switch_row1 = -1 and switch_row2 = -1 but calculation failed, ev is NA\n")
      }
    }
    else{
      if (switchRow1Choice == "lottery") {
        ev_value <- surePayments[length(surePayments)] + midPoint # sure amount as if the switching point was on the line after the last line
      } else if (switchRow1Choice == "sure") {
        ev_value <- surePayments[1] - midPoint # sure amount as if the switching point was on the line before the first line
      } else {
        cat ("switch_row1 = -1 and switch_row2 = -1 but calculation failed, ev is NA\n")
      }
    }
    
  } else if (switch_row1 == -2 & switch_row2 == -2){
    ev_value = NA
    cat("no choices made in time limit \n")
  }
  else {
    if (X_value == "A") {
      ev_value <- (y_value - ((surePayments[switch_row2 + 1] + surePayments[switch_row1 + 1])/2))/2 # 50% chance of positive amount and 50% chance of - 10
      #cat("Calculated ev for A lottery mirror, mplType is", mplType, "y_value is", y_value, "X_value is", X_value, "ev_value is", ev_value, "position is" ,position, "surePayments[switch_row2 + 1] is ", surePayments[switch_row2 + 1], "switch_row2 is",switch_row2,"\n")
    }
    else ev_value <- (surePayments[switch_row2 + 1] + surePayments[switch_row1 + 1]) / 2 # last value of the function is assigned to ev in mutate. ADD 1 because R starts at 1 instead of 0 (js)
    #cat("Calculated ev for L or G lottery mirror, mplType is", mplType, "y_value is", y_value, "X_value is", X_value, "ev_value is", ev_value, "position is" ,position, "surePayments[switch_row2 + 1] is ", surePayments[switch_row2 + 1], "switch_row2 is",switch_row2,"\n")
  }
  if ((str_starts(mplType, "G") || str_starts(mplType, "L")) && (switchRow1Choice == "sure" && switchRow2Choice == "lottery")){
    ev_value <- NA_real_
    cat("inversion detected, NA put as ev", mplType, ", switchRow1Choice is ", switchRow1Choice, " position is ", position, "\n")
  }
  else if (str_starts(mplType, "A") && (switchRow1Choice == "lottery" && switchRow2Choice == "sure")){
    ev_value <- NA_real_
  }
  return(ev_value)
}

make_EGEmpirical <- function(mplType, switch_row1, switch_row2, switchRow1Choice, switchRow2Choice, position){
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
  if (!(mplType == "GO10") & !(mplType == "GO90")) {
    surePayments <- createSequenceArray(y_value, X_value, position) # CAUTION if no switch sr1 = sr2 = -1 !!! Then need to see if choices only lotteries or only mirror
  }
  else if ((mplType == "GO10") | (mplType == "GO90")){
    surePayments <- c(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25)
  }
  spLength <- length(surePayments)
  if (switch_row1 == -1 & switch_row2 == -1) {
    if(X_value=="G" | X_value=="L"){
      if(switchRow1Choice == "lottery"){
        if(X_value=="G"){EG <- 25*y_value/100 + endowment}
        else if(X_value=="L"){EG <- -25*y_value/100 + endowment}
      }
      else if(switchRow1Choice == "sure"){
        EG <-(surePayments[1] + surePayments[spLength])/2 + endowment
      }
      else { cat("Error in calculating EGEmpirical when no switch and X is G or L\n")}
    }
    else if(X_value=="A"){
      if(switchRow1Choice == "lottery"){
        EG <- ((((surePayments[1]-y_value)/2 + (surePayments[spLength]-y_value)/2))/2) + endowment
      }
      else if(switchRow1Choice=="sure"){
        EG <- 0 + endowment
      }
      else { cat("Error in calculating EGEmpirical when no switch and X is A\n")}
    }
  }
  else if (switch_row1==-2 & switch_row2==-2){
    EG <- 0
  }
  else if (!(switch_row1==-1 & switch_row2==-1) & !(switch_row1==-2 & switch_row2==-2)){
    if(X_value=="G"){
      EG <- (25*y_value/100)*((switch_row1+1)/spLength) + ((surePayments[switch_row2+1]+surePayments[spLength])/2)*((spLength-switch_row1-1)/spLength) + endowment # add +1 at indices because R initializes vectors at 0
    }
    else if (X_value=="L"){
      EG <- -(25*y_value/100)*((switch_row1+1)/spLength) + ((surePayments[switch_row2+1]+surePayments[spLength])/2)*((spLength-switch_row1-1)/spLength) + endowment
    }
    else if (X_value=="A"){
      EG <- 0 + ((((surePayments[switch_row2+1]-y_value)/2)+((surePayments[spLength]-y_value)/2))/2)*((spLength-switch_row1-1)/spLength) + endowment
    }
  }
  else {cat("error: switch_row 1 & 2 neither -1 and -1 nor -2 and -2 nor NORMAL \n")}
  #cat("EG is ", EG, " with X_value=", X_value," y=", y_value, " switch_row1=",switch_row1, "all(choices == `lottery`) is ", all(choices == "lottery"), " position is ", position, "(switch_row1+1)/spLength+(spLength-switch_row1-1)/spLength = ", (switch_row1+1)/spLength+(spLength-switch_row1-1)/spLength, "\n")
  return(EG)
}

dfA_plot_maker = function (type = NULL, med = NULL, data = dfA) {
  if (is.null(med)){
    df <- data
  }
  else if (med == "aboveCogLoad"){
    df <- data%>%filter(aboveMedImpactCogLoad ==1)
  }
  else if (med == "belowCogLoad"){
    df <- data %>% filter(aboveMedImpactCogLoad == 0)
  }
  else if (med == "aboveRt"){
    df <- data%>%filter(aboveMedRtChoice ==1)
  }
  else if (med == "belowRt"){
    df <- data %>% filter(aboveMedRtChoice == 0)
  }
  
  
  dfA_plot <- df %>%
    filter(!mplType %in% c("GS10", "GS25", "GS50", "GS75", "GS90", 
                           "LS10", "LS25", "LS50", "LS75", "LS90", 
                           "AS10", "AS15", "GO10", "GO90")) %>%
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
    summarise( # inside summarise call vectorized functions, bc we are talking about vectors. Unlike mutate which is more line by line from what I understand. In if not vectorized : || and &&, not | and &
      n=length(unique(participant_id)),
      
      # Count valid observations for each measure 
      n_valid_lottery = sum(!is.na(lottery_ev)),
      n_valid_mirror = sum(!is.na(mirror_ev)),
      n_valid_both = sum(!is.na(lottery_ev) & !is.na(mirror_ev)),
      n_valid_lottery_hard_high = sum(!is.na(lottery_ev) & treatment == "hard" & position == "high"),
      n_valid_lottery_hard_low = sum(!is.na(lottery_ev) & treatment == "hard" & position == "low"),
      n_valid_lottery_easy_high = sum(!is.na(lottery_ev) & treatment == "easy" & position == "high"),
      n_valid_lottery_easy_low = sum(!is.na(lottery_ev) & treatment == "easy" & position == "low"),
      n_valid_mirror_hard_high = sum(!is.na(mirror_ev) & treatment == "hard" & position == "high"),
      n_valid_mirror_hard_low = sum(!is.na(mirror_ev) & treatment == "hard" & position == "low"),
      n_valid_mirror_easy_high = sum(!is.na(mirror_ev) & treatment == "easy" & position == "high"),
      n_valid_mirror_easy_low = sum(!is.na(mirror_ev) & treatment == "easy" & position == "low"),
      
      medDiff=median(lottery_ev-mirror_ev),
      meanEVLoss1=mean(abs(pred-((lottery_ev+mirror_ev)/2))),
      pred=mean(pred),
      #ceLotteryse=sd(lottery_ev, na.rm = TRUE)/sqrt(n_valid_lottery), 
      #ceMirrorse=sd(mirror_ev, na.rm = TRUE)/sqrt(n_valid_mirror),  # uncorrect s.e. , because they are the sample s.e.
      ceLotteryse = if ((is.null(type)) && n_valid_lottery > 0) 
      {
        (1/n_valid_lottery)*
          sqrt((n_valid_lottery_hard_high*var(lottery_ev[position == "high" & treatment == "hard"], na.rm = TRUE) + 
                  n_valid_lottery_hard_low*var(lottery_ev[position == "low" & treatment == "hard"], na.rm = TRUE) + 
                  n_valid_lottery_easy_low*var(lottery_ev[position == "low" & treatment == "easy"], na.rm = TRUE) +
                  n_valid_lottery_easy_high*var(lottery_ev[position == "high" & treatment == "easy"], na.rm = TRUE)))
      }
      else if (type == "hard")
      {
        (1/(n_valid_lottery_hard_low+ n_valid_lottery_hard_high))*
          sqrt((n_valid_lottery_hard_high*var(lottery_ev[position == "high" & treatment == "hard"], na.rm = TRUE) + 
                  n_valid_lottery_hard_low*var(lottery_ev[position == "low" & treatment == "hard"], na.rm = TRUE)))
      }
      else if (type == "easy")
      {
        (1/(n_valid_lottery_easy_low+ n_valid_lottery_easy_high))*
          sqrt((n_valid_lottery_easy_high*var(lottery_ev[position == "high" & treatment == "easy"], na.rm = TRUE) + 
                  n_valid_lottery_easy_low*var(lottery_ev[position == "low" & treatment == "easy"], na.rm = TRUE)))
      }
      else if (type == "high")
      {
        (1/(n_valid_lottery_hard_high+ n_valid_lottery_easy_high))*
          sqrt((n_valid_lottery_hard_high*var(lottery_ev[position == "high" & treatment == "hard"], na.rm = TRUE) + 
                  n_valid_lottery_easy_high*var(lottery_ev[position == "high" & treatment == "easy"], na.rm = TRUE)))
      }
      else if (type == "low")
      {
        (1/(n_valid_lottery_hard_low+ n_valid_lottery_easy_low))*
          sqrt((n_valid_lottery_hard_low*var(lottery_ev[position == "low" & treatment == "hard"], na.rm = TRUE) + 
                  n_valid_lottery_easy_low*var(lottery_ev[position == "low" & treatment == "easy"], na.rm = TRUE)))
      }
      else {
        cat("type is no low or high and not null but", type, "\n")
        NA_real_},
      ceMirrorse = if ((is.null(type)) && n_valid_mirror > 0) 
      {(1/n_valid_mirror)*
          sqrt((n_valid_mirror_hard_high*var(mirror_ev[position == "high" & treatment == "hard"], na.rm = TRUE) + 
                  n_valid_mirror_hard_low*var(mirror_ev[position == "low" & treatment == "hard"], na.rm = TRUE) + 
                  n_valid_mirror_easy_low*var(mirror_ev[position == "low" & treatment == "easy"], na.rm = TRUE) +
                  n_valid_mirror_easy_high*var(mirror_ev[position == "high" & treatment == "easy"], na.rm = TRUE)))}
      else if (type == "hard")
      {
        (1/(n_valid_mirror_hard_low+ n_valid_mirror_hard_high))*
          sqrt((n_valid_mirror_hard_high*var(mirror_ev[position == "high" & treatment == "hard"], na.rm = TRUE) + 
                  n_valid_mirror_hard_low*var(mirror_ev[position == "low" & treatment == "hard"], na.rm = TRUE)))
      }
      else if (type == "easy")
      {
        (1/(n_valid_mirror_easy_low+ n_valid_mirror_easy_high))*
          sqrt((n_valid_mirror_easy_high*var(mirror_ev[position == "high" & treatment == "easy"], na.rm = TRUE) + 
                  n_valid_mirror_easy_low*var(mirror_ev[position == "low" & treatment == "easy"], na.rm = TRUE)))
      }
      else if (type == "high")
      {
        (1/(n_valid_mirror_hard_high+ n_valid_mirror_easy_high))*
          sqrt((n_valid_mirror_hard_high*var(mirror_ev[position == "high" & treatment == "hard"], na.rm = TRUE) + 
                  n_valid_mirror_easy_high*var(mirror_ev[position == "high" & treatment == "easy"], na.rm = TRUE)))
      }
      else if (type == "low")
      {
        (1/(n_valid_mirror_hard_low+ n_valid_mirror_easy_low))*
          sqrt((n_valid_mirror_hard_low*var(mirror_ev[position == "low" & treatment == "hard"], na.rm = TRUE) + 
                  n_valid_mirror_easy_low*var(mirror_ev[position == "low" & treatment == "easy"], na.rm = TRUE)))
      }
      else {
        cat("type is no low or high and not null but", type, "\n")
        NA_real_},
      #   ceLotteryse = pmax(sd(lottery_ev, na.rm = TRUE) / sqrt(n), 0.01),
      #   ceMirrorse = pmax(sd(mirror_ev, na.rm = TRUE) / sqrt(n), 0.01),   
      lottery=mean(lottery_ev, na.rm = TRUE),
      mirror=mean(mirror_ev, na.rm = TRUE),
      
      # position-conditioned means (NA-safe)
      #lottery_high = mean(ifelse(lottery_position == "high", lottery_ev, NA_real_), na.rm = TRUE),
      #lottery_low  = mean(ifelse(lottery_position == "low",  lottery_ev, NA_real_), na.rm = TRUE),
      #mirror_high  = mean(ifelse(mirror_position  == "high", mirror_ev,  NA_real_), na.rm = TRUE),
      #mirror_low   = mean(ifelse(mirror_position  == "low",  mirror_ev,  NA_real_), na.rm = TRUE),
      .groups = 'drop'
    )%>%
    mutate(
      meanEVLoss2=abs(abs(pred)-abs(lottery+mirror)/2)
    )
}

mainPlot<-function(F, F_high, F_low, F_hard, F_easy, F_above, F_below, lab='TEST TITRE', ylim=c(-2,2), position = 0, cogload = 0, median = 0){
  
  cex<- 3 #1.7
  pt.cex<- 1.3 #0.8
  offset<-1
  par(mar=c(5,5,4,2))
  
  colors <- if (position == 1 || cogload == 1 | median == 1) {
    list(
      lottery_high = "darkred", mirror_high = "lightcoral",
      lottery_low = "darkblue", mirror_low = "lightblue",
      lottery_hard = "darkred", mirror_hard = "lightcoral",
      lottery_easy = "darkblue", mirror_easy = "lightblue",
      lottery_above = "darkred", mirror_above = "lightcoral",
      lottery_below = "darkblue", mirror_below = "lightblue"
    )
  } else {
    list(lottery = "gray", mirror = "white")
  }
  if (position == 1) {
    x<-F_high %>%filter(grepl('G',mplType))#%>%filter(prob!=50)
  }
  else if (cogload == 1) {
    x<-F_hard %>%filter(grepl('G',mplType))#%>%filter(prob!=50)
  }
  else if (median == 1) {
    x<-F_above %>%filter(grepl('G',mplType))#%>%filter(prob!=50)
  }
  else {
    x<-F %>%filter(grepl('G',mplType))#%>%filter(prob!=50)
  }
  plot(x$prob-0.5,x$lottery-x$pred,type='n',xlim=c(0,100), ylim=ylim,ylab='Deviation from Expected Value',xlab='Probability',yaxt='n',bty='n',xaxt='n',main=lab, cex=1.6, cex.lab=1.6) # type='n' to create an empty plot
  axis(1,at=seq(0,100,10),labels=seq(0,1,0.1), cex.axis=1.6)
  mtext("Risk/Loss Seeking",at=1,side=4,srt=180, cex=1.6); mtext("Risk/Loss Averse",at=-1,side=4,srt=180, cex=1.6) #-1 and 1 for the text y 
  
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
  else if (median == 1) {
    legend("top", legend=c("Lottery Above", "Mirror Above", "Lottery Below", "Mirror Below"),
           col=c('black','black','black','black'), 
           pt.bg=c(colors$lottery_above, colors$mirror_above, colors$lottery_below, colors$mirror_below),
           pch=c(21,21,21,21), lty=c(1,1,1,1), cex=0.9, pt.cex=1.5, bg=NA, box.lwd=NA)
  }
  else {
    legend("top", legend=c("Lottery (Certainty Equivalents)", 'Mirror (Simplicity Equivalents)'),
           col=c('black','black'), pt.bg=c(colors$lottery, colors$mirror), pch=c(21,21), 
           lty=c(1,1), cex=1.6, pt.cex=2.2, bg=NA, box.lwd=NA) #cex=0.9, pt.cex=1.5
  }
  # original legend 
  # legend("top",legend=c("Lottery (Certainty Equivalents)",'Mirror (Simplicity Equivalents)'),col=c('black','black'),pt.bg=c('gray','white'),pch=c(21,21),lty=c(1,1),cex=0.9,pt.cex=1.5,bg=NA,box.lwd=NA)
  
  major_ticks <- seq(-10, 10, 5)   # original major ticks
  minor_ticks <- seq(-10, 10, 1)   # additional ticks every 1 unit
  minor_ticks <- setdiff(minor_ticks, major_ticks) # avoid duplicating major ticks
  # draw minor ticks (no labels, shorter tick length)
  axis(2, at = minor_ticks, labels = minor_ticks, tcl = -0.25, cex.axis=1.6)
  # draw major ticks with labels (same as before)
  axis(2, at = major_ticks, labels = major_ticks, cex.axis=1.6)
  abline('h'=0,lty=1)
  
  # Helper function to plot points for a given dataset and position
  plot_points <- function(data, lottery_color, mirror_color, pch_type=21, show_labels=TRUE) {
    if (nrow(data) == 0) return()
    
    # Lottery points
    y_val <- if (pch_type == 25) data$lottery else data$lottery-data$pred # because the values from A types are already calculated for the plot in dfA and final_data
    arrows(x0=data$prob-0.5, y0=y_val-2*data$ceLotteryse, 
           x1=data$prob-0.5, y1=y_val+2*data$ceLotteryse, 
           code=3, angle=90, length=0.05, col="black", lwd=0.5)
    points(data$prob-0.5, y_val, bg=lottery_color, col='black', pch=pch_type, cex=cex)
    if (show_labels) {
      text(data$prob, y_val, pos=2, labels=data$mplType, cex=pt.cex, col='black', offset=offset)
    }
    
    # Mirror points
    y_val <- if (pch_type == 25) data$mirror else data$mirror-data$pred # # because the values from A types are already calculated for the plot in dfA and final_data
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
    x_high <- F_high %>% filter(grepl('G', mplType))# %>% filter(prob != 50)
    x_low <- F_low %>% filter(grepl('G', mplType))# %>% filter(prob != 50)
    plot_points(x_high, lottery_color = colors$lottery_high, mirror_color = colors$mirror_high, pch_type = 21, show_labels = TRUE)
    plot_points(x_low, lottery_color = colors$lottery_low, mirror_color = colors$mirror_low, pch_type = 21, show_labels = TRUE)
  } 
  else if (cogload == 1) {
    x_hard <- F_hard %>% filter(grepl('G', mplType))# %>% filter(prob != 50)
    x_easy <- F_easy %>% filter(grepl('G', mplType))# %>% filter(prob != 50)
    plot_points(x_hard, lottery_color = colors$lottery_hard, mirror_color = colors$mirror_hard, pch_type = 21, show_labels = TRUE)
    plot_points(x_easy, lottery_color = colors$lottery_easy, mirror_color = colors$mirror_easy, pch_type = 21, show_labels = TRUE)
  }
  else if (median == 1) {
    x_above <- F_above %>% filter(grepl('G', mplType))# %>% filter(prob != 50)
    x_below <- F_below %>% filter(grepl('G', mplType))# %>% filter(prob != 50)
    plot_points(x_above, lottery_color = colors$lottery_above, mirror_color = colors$mirror_above, pch_type = 21, show_labels = TRUE)
    plot_points(x_below, lottery_color = colors$lottery_below, mirror_color = colors$mirror_below, pch_type = 21, show_labels = TRUE)
  }
  else if (position == 0 && cogload == 0 && median == 0) {
    x <- F %>% filter(grepl('G', mplType)) %>% filter(prob != 50)
    plot_points(x, lottery_color = colors$lottery, mirror_color = colors$mirror, pch_type = 21, show_labels = TRUE)
  }
  
  # Plot L types
  if (position == 1) {
    x_high <- F_high %>% filter(grepl('L', mplType))# %>% filter(prob != 50) 
    x_low <- F_low %>% filter(grepl('L', mplType))# %>% filter(prob != 50)
    plot_points(x_high, lottery_color = colors$lottery_high, mirror_color = colors$mirror_high, pch_type = 21, show_labels = TRUE)
    plot_points(x_low, lottery_color = colors$lottery_low, mirror_color = colors$mirror_low, pch_type = 21, show_labels = TRUE)
  } 
  else if (cogload == 1) {
    x_hard <- F_hard %>% filter(grepl('L', mplType))# %>% filter(prob != 50) 
    x_easy <- F_easy %>% filter(grepl('L', mplType))# %>% filter(prob != 50)
    plot_points(x_hard, lottery_color = colors$lottery_hard, mirror_color = colors$mirror_hard, pch_type = 21, show_labels = TRUE)
    plot_points(x_easy, lottery_color = colors$lottery_easy, mirror_color = colors$mirror_easy, pch_type = 21, show_labels = TRUE)
  }
  else if (median == 1) {
    x_above <- F_above %>% filter(grepl('L', mplType))# %>% filter(prob != 50) 
    x_below <- F_below %>% filter(grepl('L', mplType))# %>% filter(prob != 50)
    plot_points(x_above, lottery_color = colors$lottery_above, mirror_color = colors$mirror_above, pch_type = 21, show_labels = TRUE)
    plot_points(x_below, lottery_color = colors$lottery_below, mirror_color = colors$mirror_below, pch_type = 21, show_labels = TRUE)
  }
  else if (position == 0 && cogload == 0 && median == 0) {
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
  else if (median == 1) {
    x_above <- F_above %>% filter(grepl('A', mplType) | grepl('M', mplType))
    x_below <- F_below %>% filter(grepl('A', mplType) | grepl('M', mplType))
    plot_points(x_above, lottery_color = colors$lottery_above, mirror_color = colors$mirror_above, pch_type = 25, show_labels = TRUE)
    plot_points(x_below, lottery_color = colors$lottery_below, mirror_color = colors$mirror_below, pch_type = 25, show_labels = TRUE)
  } 
  else if (position == 0 && cogload == 0 && median == 0) {
    x <- F %>% filter(grepl('A', mplType) | grepl('M', mplType))
    plot_points(x, lottery_color = colors$lottery, mirror_color = colors$mirror, pch_type = 25, show_labels = TRUE)
  }
}


# Set a seed for reproducibility
set.seed(123)
# Define the number of observations (patients) to generate
n_participants <- 200

participant_ids <- generate_ids(n_participants, len = 8)

tasks <- c("G10","G25","G50","G75","G90","L10","L25","L50","L75","L90","A10","A15")
mplType_sureFirst <- c("A15", "A10") # in loss aversion tasks, participants should choose sure amounts first then switch to lotteries
mplType_lotteryFirst<- c("G10","L10","G90","L90","G25","L25","G75","L75","G50","L50")


# one row per participant x task
df_base <- tibble(
  participant_id = rep(participant_ids, each = length(tasks)),
  mplType = rep(tasks, times = n_participants)
)

# Replace random half-sample with pair-wise inversion:
# define the task pairs: each pair must have one "high" and one "low"
pairs <- list(
  c("G10","L10"),
  c("G25","L25"),
  c("G50","L50"),
  c("G75","L75"),
  c("G90","L90"),
  c("A10","A15")
)

pair_map <- tibble(
  mplType = unlist(pairs),
  pair_id = rep(seq_along(pairs), each = 2),
  pos_role = rep(c("first","second"), times = length(pairs))
)

positionsRationalsr1 <-tibble::tibble(
  position=c("high","low","PTDirection"),
  A10 = c(7,9, 1), # loss averse : switch to late
  A15 = c(7,9, 1),
  G10 = c(5,11, 1), # risk seeking : switch to late
  L10 = c(5,11, -1), # risk averse : switch to soon
  G90 = c(5,11, -1),
  L90 = c(5,11, 1),
  G25 = c(4,12, 1),
  L25 = c(4,12, -1),
  G75 = c(4,12, -1),
  L75 = c(4,12, 1),
  G50 = c(3,13, -1),
  L50 = c(3,13, 1),
)
positionsRationalsr1 <- as.data.frame(positionsRationalsr1)
rownames(positionsRationalsr1)
rownames(positionsRationalsr1) <- positionsRationalsr1$position
positionsRationalsr1$position <- NULL


df_pos <- df_base %>%
  left_join(pair_map, by = "mplType") %>%
  group_by(participant_id, pair_id) %>%
  mutate(
    # one draw per participant-per-pair: TRUE => first task in pair is "high"
    first_is_high = sample(c(TRUE, FALSE), size = 1)
  ) %>%
  ungroup() %>%
  mutate(
    position = if_else((pos_role == "first" & first_is_high) |
                         (pos_role == "second" & !first_is_high),
                       "high", "low")
  ) %>%
  select(-pair_id, -pos_role, -first_is_high) %>%
  ungroup()


# duplicate each row into lottery + mirror status (original first -> lottery, second -> mirror)
df_status <- df_pos %>%
  slice(rep(1:n(), each = 2)) %>%
  mutate(statusMpl = rep(c("lottery", "mirror"), times = nrow(df_pos)))

# add treatment=="hard" to the first 50
participantsList <- unique(df_status$participant_id)
n_list_hard <- floor(length(participantsList) / 2)
participants_hard <- sample(participantsList, size = n_list_hard, replace = FALSE)

df_treatment <- df_status %>%
  mutate(
    treatment = if_else(participant_id %in% participants_hard, "hard", "easy")
  )

# add accuracy source and target, impactCogLoad
accEmp <- tibble::tibble(
  indicator = c("distribution","mean", "sd"),
  hard_source = c("normal",0.5,0.207),
  hard_target = c("normal",0.25,0.13),
  easy_source = c("binomial, either 1 (p=15/22) or 0.83(7/22)", 0.94, 0.07),
  easy_target = c("left-skewed",  0.69, 0.19)
)
accEmp <- as.data.frame(accEmp)
rownames(accEmp) <- accEmp$indicator
accEmp$indicator <- NULL


dataExIllustration <- data.frame(
  #x1 =rbeta(10000, 2,2),
  #hard_source= rnormTrunc(40, mean=0.5, sd=0.207, min=0, max=1),
  #hard_target= rnormTrunc(1000, mean=0.25, sd=0.13, min=0, max=1),
  x6 = rnormTrunc(1000, mean=0.9068182, sd=0.291018,min=0, max=1)
  #x2 = rbeta(1000, 5,2),
  #x4 = rbeta(1000, 2, 5),
  #easy_source= sample(c(0.83,1), 1000, prob=c(5/22, 17/22), replace=TRUE),
  #easy_target = rbeta(1000, 5, 2)
)

ggplot(dataExIllustration%>%pivot_longer(colnames(dataExIllustration))%>%as.data.frame(),                  # Draw all densities in ggplot2 plot
       aes(value,
           fill = name)) +
  geom_density(alpha = 0.25)

# view mean accuracy span mpl and sd
s_mplChoice_ex <- s_mpl_scatterCogLoadChoiceLevel%>%
  pivot_longer(
    cols = c(wmirrorError, wlotteryError),
    names_to = "type",
    values_to = "value") %>%
  mutate(
    type = if_else(str_detect(type, "mirror"), "mirror", "lottery"),
    rtChoice = if_else(type == "mirror", mirror_rtChoice, lottery_rtChoice),
    accuracy = if_else(type == "mirror", mirror_accuracy, lottery_accuracy)
  )
mean(s_mplChoice_ex[s_mplChoice_ex$treatment=="hard",]$accuracy) #0.6816546
sd(s_mplChoice_ex[s_mplChoice_ex$treatment=="hard",]$accuracy) # 0.2916598
mean(s_mplChoice_ex[s_mplChoice_ex$treatment=="easy",]$accuracy) #0.9068182
sd(s_mplChoice_ex[s_mplChoice_ex$treatment=="easy",]$accuracy) #0.291018

df_accuracy <- df_treatment%>%
  group_by(participant_id)%>%
  mutate(
    accuracySource = case_when(
      treatment=="hard" ~ rnormTrunc(1, mean=0.5, sd=0.207, min=0, max=1),
      treatment=="easy" ~ sample(c(0.83,1), 1, prob=c(5/22, 17/22), replace=TRUE)
    ),
    accuracyTarget = case_when(
      treatment=="hard" ~ rnormTrunc(1, mean=0.25, sd=0.13, min=0, max=1),
      treatment=="easy" ~ rbeta(1, 5, 2)
    ),
    accuracyDifference = accuracySource - accuracyTarget
  )%>%
  ungroup()%>%
  rowwise()%>%
  mutate(
    accuracy_span_mpl= case_when(
      treatment=="hard" ~ rnormTrunc(1, mean=0.6816546, sd=0.2916598,min=0, max=1),
      treatment=="easy" ~ rnormTrunc(1, mean=0.9068182, sd=0.291018,min=0, max=1),
    )
  )%>%
  ungroup()

# add rt 
accEmp <- tibble::tibble(
  indicator = c("mean", "sd"),
  hard = c(0.507,0.28),
  easy = c(0.503, 0.24)
)
sd(dataForPpPlot_choice%>%
  filter(treatment=="easy")%>%
  pull(rtChoice)) # 0.507

df_rt<-df_accuracy%>%
  rowwise()%>%
  mutate(
  rtChoice = case_when(
    treatment=="hard" ~ rnormTrunc(1, mean=0.507, sd=0.28, min=0, max=1),
    treatment=="easy" ~ rnormTrunc(1, mean=0.503, sd=0.24, min=0, max=1)
  ))%>%
  ungroup()%>%
  group_by(participant_id)%>%
  mutate(
  maxSpan = sample(6:10, 1, prob = c(7/45, 13/45, 15/45, 8/45, 2/45)) # actual distribution, counting the 14 as a 10 (kind of winsorizing)
  )%>%
  ungroup()



# function makeSr1: 90% of rational agents, 10% of mindless
share_rational <- 0
participants_rational <- sample(participantsList, size = floor(share_rational * length(participantsList)))


# Vectorized switch-row generator: returns integer vector of same length as inputs
make_switch_row1_vec_mindless <- function(status_vec, mplType_vec, participant_id_vec, position_vec) {
  # ensure character vectors
  mplType_vec <- as.character(mplType_vec)
  participant_id_vec <- as.character(participant_id_vec)
  position_vec <- as.character(position_vec)

  n <- length(mplType_vec)
  out <- integer(n)

  # boolean: rational participants
  is_rational <- participant_id_vec %in% participants_rational
  #cat("is_rational", is_rational , "\n")

  # handle rational participants by lookup using rownames of positionsRationalsr1
  if (any(is_rational)) {
    idx <- which(is_rational)
    
    valid_pos <- position_vec[idx]%in%rownames(positionsRationalsr1)
    valid_mplType <- mplType_vec[idx]%in%colnames(positionsRationalsr1)
    valid_idx = idx[valid_pos&valid_mplType]
      out[valid_idx] <- vapply(valid_idx, function(i) {
        as.integer(positionsRationalsr1[position_vec[i], mplType_vec[i]])
      }, integer(1))
      
      invalid_idx <- setdiff(idx, valid_idx)
      if (length(invalid_idx) > 0) out[invalid_idx] <- NA_integer_
    }

  # non-rational: sample integers 0..16 with replacement (as if the data comes from jsPsych, indexing starts from 0)
  if (any(!is_rational)) {
    idx_nr <- which(!is_rational)
    out[idx_nr] <- sample(-1:16, size = length(idx_nr), replace = TRUE, prob = c(2/18,rep(1/18, 17))*18/19) # if it is -1 it means that all rows are selected on one side only. Twice as probable
  }

  return(out)
}
make_switch_row1_vec_middle <- function(status_vec, mplType_vec, participant_id_vec, position_vec) {
  # ensure character vectors
  mplType_vec <- as.character(mplType_vec)
  participant_id_vec <- as.character(participant_id_vec)
  position_vec <- as.character(position_vec)
  
  n <- length(mplType_vec)
  out <- integer(n)
  
  # boolean: rational participants
  is_rational <- participant_id_vec %in% participants_rational
  #cat("is_rational", is_rational , "\n")
  
  # handle rational participants by lookup using rownames of positionsRationalsr1
  if (any(is_rational)) {
    idx <- which(is_rational)
    
    valid_pos <- position_vec[idx]%in%rownames(positionsRationalsr1)
    valid_mplType <- mplType_vec[idx]%in%colnames(positionsRationalsr1)
    valid_idx = idx[valid_pos&valid_mplType]
    out[valid_idx] <- vapply(valid_idx, function(i) {
      as.integer(positionsRationalsr1[position_vec[i], mplType_vec[i]] ) # if I want to add a bias : + positionsRationalsr1["PTDirection", mplType_vec[i]]*sample(1:4,1)
    }, integer(1))
    
    invalid_idx <- setdiff(idx, valid_idx)
    if (length(invalid_idx) > 0) out[invalid_idx] <- NA_integer_
  }
  
  # non-rational: sample integers 0:16 with replacement (as if the data comes from jsPsych, indexing starts from 0)
  if (any(!is_rational)) {
    idx_nr <- which(!is_rational)
    out[idx_nr] <- 8L #they click on the middle cell
  }
  
  return(out)
}
stochastic_round <- function(x) { # used to round the effect of rtChoice and impactCogLoad on switch_row1
  ifelse(runif(length(x)) < 0.5, floor(x), ceiling(x))
}
make_switch_row1_vec_biased <- function(status_vec, mplType_vec, participant_id_vec, position_vec, accuracyDifference_vec, rtChoice_vec) {
  # ensure character vectors
  mplType_vec <- as.character(mplType_vec)
  participant_id_vec <- as.character(participant_id_vec)
  rtChoice_vec <- as.numeric(rtChoice_vec)
  accuracyDifference_vec <- as.numeric(accuracyDifference_vec)
  position_vec <- as.character(position_vec)
  
  n <- length(mplType_vec)
  out_sr1 <- integer(n)
  
  # boolean: rational participants
  is_rational <- participant_id_vec %in% participants_rational
  #cat("is_rational", is_rational , "\n")
  
  # handle rational participants by lookup using rownames of positionsRationalsr1
  if (any(is_rational)) {
    idx <- which(is_rational)
    
    valid_pos <- position_vec[idx]%in%rownames(positionsRationalsr1)
    valid_mplType <- mplType_vec[idx]%in%colnames(positionsRationalsr1)
    valid_idx = idx[valid_pos&valid_mplType]
    out_sr1[valid_idx] <- vapply(valid_idx, function(i) {
      as.integer(positionsRationalsr1[position_vec[i], mplType_vec[i]])
    }, integer(1))
    
    invalid_idx <- setdiff(idx, valid_idx)
    if (length(invalid_idx) > 0) out[invalid_idx] <- NA_integer_
  }
  
  # non-rational: as rational but with added bias and noise due to rtChoice and accuracyDiffernece(as if the data comes from jsPsych, indexing starts from 0)
  if (any(!is_rational)) {
    idx_nr <- which(!is_rational)
    out_sr1[idx_nr] <- vapply(idx_nr, function(i) {
      base <- as.integer(positionsRationalsr1[position_vec[i], mplType_vec[i]]) 
      dir  <- as.integer(positionsRationalsr1["PTDirection", mplType_vec[i]]) # does PT predicts switch row below or above the EV choice ?
      noise_term <- accuracyDifference_vec[i]*4 - (accuracyDifference_vec[i] * rtChoice_vec[i]) * 2 +
        rtChoice_vec[i] * sample(-2:2, 1) +
        sample(-2:2, 1)
      noise <- stochastic_round(noise_term)
      as.integer(base + dir * noise)
    }, integer(1))
  }
  
   #determine switchRow1Choice
  out_sr1C <- character(n)
  out_sr1C[mplType_vec %in% mplType_sureFirst] <- "sure"
  out_sr1C[mplType_vec %in% mplType_lotteryFirst] <- "lottery"
  
  mask_extra_h <- out_sr1<0
  if (any(mask_extra_h, na.rm=TRUE)){
  out_sr1C[mask_extra_h & (mplType_vec %in% mplType_sureFirst)] <- "lottery"
  out_sr1C[mask_extra_h & (mplType_vec %in% mplType_lotteryFirst)] <- "sure"
  }
  mask_extra_l <- out_sr1>16
  if (any(mask_extra_l, na.rm=TRUE)){
    out_sr1C[mask_extra_l & (mplType_vec %in% mplType_sureFirst)] <- "sure"
    out_sr1C[mask_extra_l & (mplType_vec %in% mplType_lotteryFirst)] <- "lottery"
  }
  
  out_sr1[mask_extra_l | mask_extra_h] <- -1
  tibble::tibble(switch_row1 = out_sr1, switchRow1Choice = out_sr1C)
}
make_switch_row1_vec_noSwitch <- function(status_vec, mplType_vec, participant_id_vec, position_vec) {
  # ensure character vectors
  mplType_vec <- as.character(mplType_vec)
  participant_id_vec <- as.character(participant_id_vec)
  position_vec <- as.character(position_vec)
  
  n <- length(mplType_vec)
  out <- integer(n) # switch_row1
  out_sr1C <- character(n) # switchRow1Choice
  
  # boolean: rational participants
  is_rational <- participant_id_vec %in% participants_rational
  #cat("is_rational", is_rational , "\n")
  
  # handle rational participants by lookup using rownames of positionsRationalsr1
  if (any(is_rational)) {
    idx <- which(is_rational)
    
    valid_pos <- position_vec[idx]%in%rownames(positionsRationalsr1)
    valid_mplType <- mplType_vec[idx]%in%colnames(positionsRationalsr1)
    valid_idx = idx[valid_pos&valid_mplType]
    out[valid_idx] <- vapply(valid_idx, function(i) {
      as.integer(positionsRationalsr1[position_vec[i], mplType_vec[i]])
    }, integer(1))
    
    invalid_idx <- setdiff(idx, valid_idx)
    if (length(invalid_idx) > 0) out[invalid_idx] <- NA_integer_
  }
  
  out_sr1C[mplType_vec %in% mplType_sureFirst] <- "sure"
  out_sr1C[mplType_vec %in% mplType_lotteryFirst] <- "lottery"
  
  # non-rational: make PT choice with as much deviation as strong as possible: no switch
  if (any(!is_rational)) {
    idx_nr <- which(!is_rational)
    out[idx_nr] <- -1 
    out_sr1C[idx_nr] <- ifelse(mplType_vec%in%c("A10", "A15", "G50", "G75", "G90", "L10", "L25"), "sure", "lottery")
  }
  
  
  tibble::tibble(switch_row1 = out, switchRow1Choice = out_sr1C)
}




# mindless type
sim_df <- df_rt %>%
  mutate(switch_row1 = make_switch_row1_vec_mindless(status, mplType, participant_id, position),
         switch_row2 = case_when(switch_row1==-1 ~ -1, TRUE ~ switch_row1+1),
         switchRow1Choice = make_switchRow1Choice(mplType, participant_id, switch_row1),
         switchRow2Choice = case_when(
           !(switch_row1==-1) & switchRow1Choice=="sure" ~ "lottery", 
           !(switch_row1==-1) & switchRow1Choice=="lottery" ~ "sure", 
           (switch_row1==-1) ~ switchRow1Choice, 
           TRUE ~ "sure"),
         is_rational = case_when(participant_id%in%participants_rational ~ 1, TRUE ~0)
         )

# middle type
sim_df <- df_rt %>%
  mutate(switch_row1 = make_switch_row1_vec_middle(status, mplType, participant_id, position),
         switch_row2 = case_when(switch_row1==-1 ~ -1, TRUE ~ switch_row1+1),
         switchRow1Choice = make_switchRow1Choice(mplType, participant_id, switch_row1), # share this function with mindless bc no one have sr1 == -1 in middle errors
         switchRow2Choice = case_when(
           !(switch_row1==-1) & switchRow1Choice=="sure" ~ "lottery", 
           !(switch_row1==-1) & switchRow1Choice=="lottery" ~ "sure", 
           (switch_row1==-1) ~ switchRow1Choice, 
           TRUE ~ "sure"),
         is_rational = case_when(participant_id%in%participants_rational ~ 1, TRUE ~0)
  )

# biased type
res <- make_switch_row1_vec_biased(df_rt$status, df_rt$mplType, df_rt$participant_id, df_rt$position, df_rt$accuracyDifference, df_rt$rtChoice)
sim_df <- bind_cols(df_rt,res)%>%
  mutate(
      switch_row2 = case_when(switch_row1==-1 ~ -1, TRUE ~ switch_row1+1),
      switchRow2Choice = case_when(
        !(switch_row1==-1) & switchRow1Choice=="sure" ~ "lottery", 
        !(switch_row1==-1) & switchRow1Choice=="lottery" ~ "sure", 
        (switch_row1==-1) ~ switchRow1Choice, 
        TRUE ~ "sure"),
      is_rational = case_when(participant_id%in%participants_rational ~ 1, TRUE ~0)
  )

# no-switch type (maximally biased)
res <- make_switch_row1_vec_noSwitch(df_rt$status, df_rt$mplType, df_rt$participant_id, df_rt$position)
sim_df <- bind_cols(df_rt,res)%>%
  mutate(
    switch_row2 = case_when(switch_row1==-1 ~ -1, TRUE ~ switch_row1+1),
    switchRow2Choice = case_when(
      !(switch_row1==-1) & switchRow1Choice=="sure" ~ "lottery", 
      !(switch_row1==-1) & switchRow1Choice=="lottery" ~ "sure", 
      (switch_row1==-1) ~ switchRow1Choice, 
      TRUE ~ "sure"),
    is_rational = case_when(participant_id%in%participants_rational ~ 1, TRUE ~0)
  )



sim_dfA_before_wide <- sim_df%>%
  rowwise()%>%
  mutate(
        ev = make_ev(mplType, switch_row1, switch_row2, switchRow1Choice,switchRow2Choice, position),
        EGEmpirical= make_EGEmpirical(mplType, switch_row1, switch_row2, switchRow1Choice, switchRow2Choice, position),
        pred = case_when(
          str_starts(mplType, "G") ~ roundDownToFifth(25 * (as.numeric(str_extract(mplType, "\\d+")) / 100))+0.1,
          str_starts(mplType, "L") ~ roundDownToFifth((-25 * as.numeric(str_extract(mplType, "\\d+")) / 100))+0.1,
          str_starts(mplType, "A") ~ 0,
          TRUE ~ NA_real_
        ))%>%
  ungroup()%>%
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
    ))%>%
  mutate(
    absoluteDeviation=abs(ev - pred),
    normalizedDeviation=multiplier*(ev -pred))

sim_dfA_before_wide_subjectLevel <- sim_dfA_before_wide%>%
  group_by(participant_id)%>%
  summarise(
    treatment=unique(treatment),
    absoluteDeviation=mean(absoluteDeviation),
    normalizedDeviation=mean(normalizedDeviation),
    rtChoice=mean(rtChoice),
    accuracy_span_mpl = mean(accuracy_span_mpl),
    accuracySource = unique(accuracySource),
    accuracyTarget = unique(accuracyTarget),
    accuracyDifference = unique(accuracyDifference)
  )


sim_dfA <- sim_dfA_before_wide%>%
  select(-c(EGEmpirical, switch_row1, switch_row2, switchRow1Choice, switchRow2Choice, rtChoice, accuracy_span_mpl))%>%
  pivot_wider(
    #id_cols = c(participant_id, mplType),
    names_from=c(statusMpl),
    values_from=ev,
    names_glue = "{statusMpl}_ev"
  )




# Fully mindless
mean(sim_dfA_before_wide$absoluteDeviation) #1.324133 #1.328
mean(sim_dfA_before_wide$normalizedDeviation) #-0.005691667 #-0.0155
mean(sim_dfA_before_wide_subjectLevel$absoluteDeviation) #1.324133
mean(sim_dfA_before_wide_subjectLevel$normalizedDeviation) #-0.005691667

# Full middle
mean(sim_dfA_before_wide$absoluteDeviation) #0.7166667 #0.7166667
mean(sim_dfA_before_wide$normalizedDeviation) #0.0028 #-0.0008666667
mean(sim_dfA_before_wide_subjectLevel$absoluteDeviation) #0.7166667
mean(sim_dfA_before_wide_subjectLevel$normalizedDeviation) #0.0028

# Full noSwitch
mean(sim_dfA_before_wide$absoluteDeviation) #2.249133
mean(sim_dfA_before_wide$normalizedDeviation) #2.249133
mean(sim_dfA_before_wide_subjectLevel$absoluteDeviation) #2.249133
mean(sim_dfA_before_wide_subjectLevel$normalizedDeviation) #2.249133


# do not delete but do not run it or else it takes time !
#env_originalAnalysis <- new.env()
#sys.source("data_analysis_span_mpl_3.R", envir = env_originalAnalysis)

dfA_plot_new <- dfA_plot_maker(data=sim_dfA)
dfA_plot_new

mainPlot(dfA_plot_new, lab ="Simulation of deviations with choices in the center only (n=200)")

#mainPlot1SimDevFullMindless.pdf
pdf(file.path(PATH_TO_DATA,"mainPlot1SimDevCenter.pdf"), width = 8, height = 8.31) # width = 7.41, height = 8.31
mainPlot(dfA_plot_new, lab ="Simulation of deviations with choices in the center only (n=200)")
dev.off()



fit_sim_test <- lm(absoluteDeviation ~ accuracyDifference*rtChoice, sim_dfA_before_wide)
summary(fit_sim_test)
fit_sim_test <- lm(absoluteDeviation ~ accuracyDifference*rtChoice, sim_dfA_before_wide_subjectLevel[sim_dfA_before_wide_subjectLevel$treatment=="hard",])
summary(fit_sim_test)
fit_sim_test <- lm(normalizedDeviation ~ accuracyDifference*rtChoice, sim_dfA_before_wide[sim_dfA_before_wide$treatment=="hard",])
summary(fit_sim_test)
fit_sim_test <- lm(normalizedDeviation ~ accuracyDifference*rtChoice, sim_dfA_before_wide_subjectLevel[sim_dfA_before_wide_subjectLevel$treatment=="hard",])
summary(fit_sim_test)
