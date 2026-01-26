# Load required packages
library(dplyr)
library(purrr)
#library(lubridate)
library(ggplot2)
# Set a seed for reproducibility
set.seed(123)
# Define the number of observations (patients) to generate
n_participants <- 100

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

participant_ids <- generate_ids(n_participants, len = 8)

tasks <- c("G10","G25","G50","G75","G90","L10","L25","L50","L75","L90","A10","A15")

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
  mutate(status = rep(c("lottery", "mirror"), times = nrow(df_pos)))


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

# function makeSr1: 90% of rational agents, 10% of mindless
makeSr1 <- function(status_value) {
  
  sr1=
    if( mplType == "A10" | mplType == "A15"){
      if (position == "high"){
        res <- 8
      } else res <- 10
    } else 
  
}

surePayments <- createSequenceArray(y_value, X_value, position) # CAUTION if no switch sr1 = sr2 = -1 !!! Then need to see if choices only lotteries or only mirror



# add switch_row1 column (applied rowwise but vectorized here)
sim_df <- df_status %>%
  mutate(switch_row1 = makeSr1(status))


