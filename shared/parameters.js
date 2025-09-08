const level = 3; //available levels: 0, 1, 2, 3
const fixationDuration = 500; //500
const letterDuration = 1500; //1500
const feedBackDuration = 100;// 1000
const payment = 1; // Payment amount: = 1 euro 

// Change default language to French

const practice_duration = 30000; // duration of practice flanker
const main_duration = 15000; // duration of main task flanker
let total_flanker = 0;
let total_flanker_easy = 0;
let total_flanker_hard = 0;
let block_trial_count = 0;
let practice_indicator = 1; // Indicator of whether the trials being shown belong to the practice phase. The first does, then it switches to 0 in after_flanker_practice. 
let timeout = 0; // Indicator whether trial was responded to when the task timed out
let block_start;
let block_time_limit;
let items_flanker = Array.from(Array(16).keys()); // Array from 0-15
let blockEasy = 0;

