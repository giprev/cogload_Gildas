const level = 3; //available levels: 0, 1, 2, 3
const fixationDuration = 500; //500ms
const letterDuration = 1500; //1500ms
const feedBackDuration = 1000;//1000ms
const basePayment_hard = 6; //
const basePayment_easy = 6; // 
const notUnderstoodPayment = 6; 
const spanMplPayment_hard = 3.2;
const calibrationPayment = 1.03; // 1.125€ rounded
const spanSpanPayment_hard = 1.03;// 1.125€ rounded
const spanMplPayment_easy = spanMplPayment_hard;
//const spanSpanPayment_easy = spanMplPayment_hard * 0.25; // NOT USED as it's the same as spanSpanPayment_hard
const propSelecForMPL = 11; // 1 out of propSelecForMPL participants will be selected for the MPL payment : that makes an EV of around 2.1€.
const fds_letter_presentation = 500; //500ms
const fds_post_trial_gap = 250; //250ms
// Change default language to French

const practice_duration = 30; //= 30000; // duration of practice flanker
const main_duration = 150; //= 15000; // duration of main task flanker
const mplTimeLimit = 30000; // time limit for the MPL task in ms
const betweenSpanTimeInterval = 3000; // time interval between blue (source) and red (target) letters in ms
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


let totalFdsSpanMplTrials = 14;
let treatment = "";
if (Math.random() < 0.5) { treatment = "hard"; } else { treatment = "easy"; }
console.log("treatment is", treatment)
console.log("not understood payment in parameters is", notUnderstoodPayment)
let totalFdsTrainingTrials = 9; // 12 in the main experiment // number of rounds of the calibration
