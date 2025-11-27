const level = 3; //available levels: 0, 1, 2, 3
const fixationDuration = 500; //500ms
const letterDuration = 1500; //1500ms
const feedBackDuration = 1000;//1000ms
const payment = 0 // payment amount for the n-back nback task
const basePayment_hard = 7; // Payment amount: = 8 euros
const basePayment_easy = 7; // Payment amount: = 7 euros
const notUnderstoodPayment = 6; // if the participant does not understand the comprehension questions,
const basePaymentThird = 1; // additional base payment for the third part of the experiment (if they answer the comprehension questions correctly)
const spanMplPayment_hard = 4.2;
const calibrationPayment = 1.8; 
const spanSpanPayment_hard = 1.35;
const spanMplPayment_easy = spanMplPayment_hard;
//const spanSpanPayment_easy = spanMplPayment_hard * 0.25; // NOT USED as it's the same as spanSpanPayment_hard
const propSelecForMPL = 10; // 1 out of propSelecForMPL participants will be selected for the MPL payment : that makes an EV of around 2.1€.
const fds_letter_presentation = 500; //500ms
const fds_post_trial_gap = 250; //250ms
// Change default language to French

const practice_duration = 30; //= 30000; // duration of practice flanker
const main_duration = 150; //= 15000; // duration of main task flanker
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
console.log("base payment third in parameters is", basePaymentThird)
let totalFdsTrainingTrials = 12; // 12 in the main experiment // number of rounds of the calibration
