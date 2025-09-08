/*************** VARIABLES nback ***************/

let nbackStimuli = {};
let instruction;
let timeline = [];
const buttonToPressForTarget = ["f","j"];
const trialStructure = { type: "html-keyboard-response" };
const subjectId = jsPsych.randomization.randomID(15)
let nbackCounter = 0; // the counter for each n-back trial
let block_order = 0;
let subBlock = 0;  // the counter of target + source task block (used for incentives)
let totSubBlocks = 12; // 6 easy and 6 hard for the nback only experiment
let lastSubBlockOfFirstBlock = 6 // the last sub-block of the first block (used for incentives), if it is selected, the first trials before the first visual nback are taken into account for the incentives
let nbackLevel = 0; // store the level of the n-back task selected for the incentives payment
let remindDuration = 6000;


/*************** VARIABLES span ***************/
var useAudio = false; // change to false if you want this to be a visual task!

var currentDigitList; //current digit list
var totalCorrect = 0; //counter for total correct
var totalTrials = 0; //counter for total trials
var maxSpan; //value that will reflect a participant's maximum span (e.g., 6)
var folder = "digits/"; //folder name for storing the audio files
var fdsTrialNum = 1; //counter for trials
let fdsTotalTrials = 12; //total number of desired trials
var response = []; //for storing partcipants' responses
var fds_correct_ans; //for storing the correct answer on a given trial
var staircaseChecker = []; //for assessing whether the span should move up/down/stay
var staircaseIndex = 0; //index for the current staircase
var digit_list = [1,2,3,4,5,6,7,8,9]; //digits to be used (unlikely you will want to change this)

var startingSpan = 3; //where we begin in terms of span
var currentSpan; //to reference where participants currently are
var spanHistory = []; //easy logging of the participant's trajectory
var stimList; //this is going to house the ordering of the stimuli for each trial
var idx = 0; //for indexing the current letter to be presented
var exitLetters; //for exiting the letter loop
var fdb = "Not assigned"; // is the feedback displayed for the span, when it nothing has been selected

const arrSum = arr => arr.reduce((a,b) => a + b, 0) //simple variable for calculating sum of an array

/*************** VARIABLES nback-visual ***************/

var point_location = [];
let mainNbackCounter = 0; // the counter for each n-back trial (visual included) in the main task
let nbackVisualCounter = 0; // the counter for each visual n-back trial


/*************** VARIABLES span ***************/


let taskEasy;
taskEasy = language.task1back

console.log(level, "is level")
let paymentExplanationEasy;
let paymentExplanationHard;
paymentExplanationEasy = language.paymentExplanation1Back
if (level == 0) {
  instruction_hard = language.instructions0back
  taskHard = language.task1back
  paymentExplanationHard = "error : level should be higher than 0"
} else if (level == 1) {
  instruction_hard = language.instructions1back
  taskHard = language.task1back
  paymentExplanationHard = language.paymentExplanation1Back
  explainHard = language.overallTrainingFeedback.explain1Back
} else if (level == 2) {
  instruction_hard = language.instructions2back
  taskHard = language.task2back
  paymentExplanationHard = language.paymentExplanation2Back
  remindHard = language.overallTrainingFeedback.remind2Back
  explainHard = language.overallTrainingFeedback.explain2Back
} else if (level == 3) {
  instruction_hard = language.instructions3back
  taskHard= language.task3back
  paymentExplanationHard = language.paymentExplanation3Back
  remindHard = language.overallTrainingFeedback.remind3Back
  explainHard = language.overallTrainingFeedback.explain3Back
}

/*************** Instructions nback source task ***************/


const welcome = {
  type: "instructions",
  pages: [
      `<h1>${language.welcomePage.welcome}</h1><br><p>${language.welcomePage.clickNext}</p>`], // ${language.welcomePage.testGif}
  show_clickable_nav: true,
  button_label_next: language.button.next,
  button_label_previous: language.button.previous,
//   on_load: function () {
//     startNbackDemoLetter('demo2', sequence2, {stim_ms: 2000, fix: 1000})
    // startNbackDemoLetter('nback-demo-letter', sequence, {
    //   stim_ms: 1000,
    //   fix_ms: 1000
    // });
//   }
}

const overviewPage ={
    type: "instructions",
    pages: [`<div style="max-width: 1200px"><p>${language.overviewPage.purpose}</p><p>${language.overviewPage.anonimity}</p><p>${language.overviewPage.credits}</p>
        <p>${language.overviewPage.question}</p><p>${language.overviewPage.withdrawal}</p> <p>${language.overviewPage.clickNext}</p></div>`
       ],
    show_clickable_nav: true,
    button_label_next: language.button.next,
    button_label_previous: language.button.previous,
}

const descriptionExperiment = {
    type: "instructions",
    pages: [
        `<div style="max-width: 1200px"> <p>${language.descriptionExperiment.twoGames}</p>
        <p>${language.descriptionExperiment.instructionsAfter}</p>
        <p>${language.descriptionExperiment.subBlockExplanation}</p>
        <p>${language.descriptionExperiment.paymentAfter}</p>
        <p>${language.descriptionExperiment.clickNext}</p> </div>`
    ],
    show_clickable_nav: true,
    button_label_next: language.button.next,
    button_label_previous: language.button.previous,
}

const instructions_easy = {
    type: "instructions",
    pages: function() {
        if (block_order === 0) {
            return [
                `<div style="max-width: 1200px"> <p>${language.instructions1back.firstGameLetter}</p>
                <p>${language.instructions1back.letter}</p>
                <p>${language.instructions1back.yourTask1}</p>
                <p>${language.instructions1back.yourTask2}</p>
                <p>${language.generalInstruction.fastAndAccurate}</p>
                <p>${language.generalInstruction.clickNext}</p> </div>`
            ];
        } else {
            return [
                `<div style="max-width: 1200px"><p>${language.instructions1back.changeN}</p>
                <p>${language.instructions1back.letter}</p>
                <p>${language.instructions1back.yourTask1}</p>
                <p>${language.instructions1back.yourTask2}</p>
                <p>${language.generalInstruction.fastAndAccurate}</p>
                <p>${language.generalInstruction.clickNext}</p></div>`
            ];
        }
    },
    show_clickable_nav: true,
    button_label_next: language.button.next,
    button_label_previous: language.button.previous,
}

const instructions_hard = {
    type: "instructions",
    pages: function() {
        if (block_order === 0) {
            return [
                `<div style="max-width: 1200px"><p>${instruction_hard.firstGameLetter}</p>
                <p>${instruction_hard.letter}</p>
                <p>${instruction_hard.yourTask1}</p>
                <p>${instruction_hard.yourTask2}</p>
                <p>${language.generalInstruction.fastAndAccurate}</p>
                <p>${language.generalInstruction.clickNext}</p></div>`
            ];
        } else {
            return [
                `<div style="max-width: 1200px"> <p>${instruction_hard.changeN}</p>
                <p>${instruction_hard.letter}</p>
                <p>${instruction_hard.yourTask1}</p>
                <p>${instruction_hard.yourTask2}</p>
                <p>${language.generalInstruction.fastAndAccurate}</p>
                <p>${language.generalInstruction.clickNext}</p></div>`
            ];
        }
    },
    show_clickable_nav: true,
    button_label_next: language.button.next,
    button_label_previous: language.button.previous,
}

let sequence1 = [];
if (language == en) {
    sequence1 =  [
      {pos: 0, text: '<span style="color:red;">PRESS</span> F'},
      {pos: 1, text: '<span style="color:red;">PRESS</span> F'},
      {pos: 0, text: '<span style="color:red;">PRESS</span> J'},
      {pos: 4, text: '<span style="color:red;">PRESS</span> F'},
      {pos: 0, text: '<span style="color:red;">PRESS</span> J'},
      {pos: 4, text: '<span style="color:red;">PRESS</span> J'},
      {pos: 2, text: '<span style="color:red;">PRESS</span> F'},
    ];
}

else if (language == fr) {
    sequence1 = [
      {pos: 0, text: '<span style="color:red;">APPUYEZ SUR</span> F'},
      {pos: 1, text: '<span style="color:red;">APPUYEZ SUR</span> F'},
      {pos: 0, text: '<span style="color:red;">APPUYEZ SUR</span> J'},
      {pos: 4, text: '<span style="color:red;">APPUYEZ SUR</span> F'},
      {pos: 0, text: '<span style="color:red;">APPUYEZ SUR</span> J'},
      {pos: 4, text: '<span style="color:red;">APPUYEZ SUR</span> J'},
      {pos: 2, text: '<span style="color:red;">APPUYEZ SUR</span> F'},
    ];
}


const instructions_NbackVisual= {
  type: "instructions",
  pages: [
      `<div style="max-width: 1200px"> <p>${language.instructions2back.firstGameVisual}</p><p>${language.instructions2back.grid}</p><p>${language.instructions2back.yourTask1Grid}</p><p>${language.instructions2back.yourTask2}</p>
      <p>${language.generalInstruction.fastAndAccurate}</p><br>${language.instructions2back.liveDemo}<p><br><p>${language.instructions2back.firstGrids}</p><p>${language.instructions2back.allGame}</p><p>${language.generalInstruction.clickNext}</p></div>`
  ],
  show_clickable_nav: true,
  button_label_next: language.button.next,
  button_label_previous: language.button.previous,
  // on_start: function () {
  //   console.log("instructions function starting")
  //   if (easyBlock == 1) {
  //     instruction = language.instructions1back
  //   }
  //   else if (easyBlock == 1 & level == 2)  {
  //      instruction = language.instructions2back}
  //   else { 
  //     instruction = language.instructions3back}
  // }
  on_load: function () {
    startNbackDemo('nback-demo', {
      stim_ms: 1500,
      fix_ms: 1000,
      sequence: sequence1
    //   : [
    //     {pos: 0, text: '<span style="color:red;">PRESS</span> F'},
    //     {pos: 0, text: '<span style="color:red;">PRESS</span> J'},
    //     {pos: 4, text: '<span style="color:red;">PRESS</span> F'},
    //     {pos: 7, text: '<span style="color:red;">PRESS</span> F'},
    //     {pos: 7, text: '<span style="color:red;">THE SEQUENCE IN DEFINED IN THE TRIAL</span> J'}
    //   ]
    });
  }
};

const loopAgain = {
    type: "instructions",
    pages: [
        `<div style="max-width: 1200px"> <p>${language.loopAgain.failed}</p>
        <p>${language.loopAgain.viewInstructions}</p>
        <p>${language.loopAgain.surveyAgain}</p>
        <p>${language.loopAgain.press}</p>
        </div>`
    ],
    show_clickable_nav: true,
    button_label_next: language.button.next,
    button_label_previous: language.button.previous,
}


const instructions_flanker_1 = {
	type: "html-button-response",
	stimulus: `<p style='font-size: 15pt; text-align: left;'>See what direction the outside arrows are pointing. From the two options below<br>
				select the one that has the middle arrow pointing in that direction. DON'T pay<br>
				attention to the direction of the top middle arrow or the outside arrow direction of<br>
				the two options below. It's important to match the top outside arrow direction with<br>
				the middle arrow direction of the options below. We will begin with a practice round.<br>
				You will have 30 seconds to earn as many points as possible.</p>
    <div style='height: 75px;'></div>
    <span style='font-size: 9pt;'>OUTSIDE ARROWS ARE POINTING LEFT</span><br>
    <img src='${mr_fl}' width='290'><p><br></p>
    <div>
      <button class="choiceStyle" style="font-family: Open Sans;">
        <div style="color: red; font-size: 34pt; font-weight: 200;">&#10008;</div>
        <img src='${mr_fl}' width='290'>
        <div style="font-size: 9pt; color: white; font-weight: normal;">WRONG ANSWER<br>(Inside arrow is right)</div>
      </button>
      <div class="space"></div>
      <button class="choiceStyle" style="font-family: Open Sans;">
        <div style="color: #1ED760; font-size: 34pt; font-weight: 200;">&#10004;</div>
        <img src='${ml_fr}' width='290'>
        <div style="font-size: 9pt; color: white; font-weight: normal;">RIGHT ANSWER<br>(Inside arrow is left)</div>
      </button>
    </div>
  `,
	choices: ["Begin practice"],
	button_html: `<div style='height: 70px;'></div><button class="defaultButton">%choice%</button>`,
	on_finish: function(data) {
		data.task = "flanker";
	}
}


const betweenBlockRest = {... trialStructure, stimulus: `<p>${language.betweenBlocks.rest}</p><p>${language.betweenBlocks.pressKey}</p>` };
const ready = {... trialStructure, stimulus: `<p>${language.betweenBlocks.continue}</p>` };
const startPractice = {... trialStructure, stimulus: `<p>${language.practice.practice}</p><p>${language.practice.startPractice}<p>` };
const afterPracticeEasy = {... trialStructure, stimulus: `<h2>${language.practice.end}</h2><p>${taskEasy.remember1}</p><p>${taskEasy.remember2}</p><p>${taskEasy.press}<p>` };
const afterPracticeHard = {... trialStructure, stimulus: `<h2>${language.practice.end}</h2><p>${taskHard.remember1}</p><p>${taskHard.remember2}</p><p>${taskHard.press}<p>` };



/*create n-back variables*/

setArrays() /* defines  nbackStimuli = {};
                        nbackStimuli.stimuliEasy_flanker = [];
                        nbackStimuli.stimuliHard_flanker = [];
                        nbackStimuli.stimuliPracticeEasy_flanker = [];
                        nbackStimuli.stimuliPracticeHard_flanker = [];
                        nbackStimuli.stimuliEasy_span = [];
                        nbackStimuli.stimuliHard_span = [];
                        nbackStimuli.stimuliPracticeEasy_span = [];
                        nbackStimuli.stimuliPracticeHard_span = [];
                        nbackStimuli.stimuliEasy_nback = [];
                        nbackStimuli.stimuliHard_nback = [];
                        nbackStimuli.stimuliPracticeEasy_nback = [];
                        nbackStimuli.stimuliPracticeHard_nback = [];
                        nbackStimuli.correctResponse;
                        nbackStimuli.target;
                          */


defineEasyBack()
assignRandomStimuli1back()

if (level === 2) {
    defineHard2Back(); 
    assignRandomStimuli2back();
} else if (level === 3) {
    defineHard3Back();
    assignRandomStimuli2back();
} // these functions define nbackStimuli.practiceListHard and nbackStimuli.stimuliListHard and nbackStimuli.stimuliListHardOverallTraining etc.
console.log(nbackStimuli.stimuliHard_nback, "is nbackStimuli.stimuliHard_nback")
console.log(nbackStimuli.stimuliEasy_nback, "is nbackStimuli.stimuliEasy_nback")


/* define timeline variables for the (source task) nback, for each block (hard and easy) and for each target task*/
createBlocks(nbackStimuli.practiceListEasy_flanker, nbackStimuli.stimuliPracticeEasy_flanker, 1)
createBlocks(nbackStimuli.practiceListHard_flanker, nbackStimuli.stimuliPracticeHard_flanker, level)
createBlocks(nbackStimuli.stimuliListHard_flanker, nbackStimuli.stimuliHard_flanker, level)
createBlocks(nbackStimuli.stimuliListEasy_flanker, nbackStimuli.stimuliEasy_flanker, 1)

createBlocks(nbackStimuli.practiceListEasy_span, nbackStimuli.stimuliPracticeEasy_span, 1)
createBlocks(nbackStimuli.practiceListHard_span, nbackStimuli.stimuliPracticeHard_span, level)
createBlocks(nbackStimuli.stimuliListHard_span, nbackStimuli.stimuliHard_span, level)
createBlocks(nbackStimuli.stimuliListEasy_span,nbackStimuli.stimuliEasy_span, 1)

createBlocks(nbackStimuli.practiceListHard_nback, nbackStimuli.stimuliPracticeHard_nback, level)
createBlocks(nbackStimuli.practiceListEasy_nback, nbackStimuli.stimuliPracticeEasy_nback, 1)
createBlocks(nbackStimuli.stimuliListHard_nback, nbackStimuli.stimuliHard_nback, level)
createBlocks(nbackStimuli.stimuliListEasy_nback, nbackStimuli.stimuliEasy_nback, 1)

createBlocks(nbackStimuli.stimuliListHardOverallTraining, nbackStimuli.stimuliHardOverallTraining, level)
createBlocks(nbackStimuli.stimuliListEasyOverallTraining, nbackStimuli.stimuliEasyOverallTraining, 1)


/* define timeline_variables for each visual nback (target task)*/
assignRandomStimuliVisual();
console.log(stimuliList_nbackVisual_1, "is stimuliList_nbackVisual_1")

console.log(stimuli_nback_1, "is stimuli_nback_1")
createBlocksVisual(stimuliList_nbackVisualOverallPractice, stimuli_nbackVisual_overall_training, 2)
createBlocksVisual(stimuliList_nbackVisual_practice, stimuli_nback_practice, 2)
createBlocksVisual(stimuliList_nbackVisual_1, stimuli_nback_1, 2)
createBlocksVisual(stimuliList_nbackVisual_2, stimuli_nback_2, 2)
createBlocksVisual(stimuliList_nbackVisual_3, stimuli_nback_3, 2)
createBlocksVisual(stimuliList_nbackVisual_4, stimuli_nback_4, 2)
createBlocksVisual(stimuliList_nbackVisual_5, stimuli_nback_5, 2)
createBlocksVisual(stimuliList_nbackVisual_6, stimuli_nback_6, 2)
createBlocksVisual(stimuliList_nbackVisual_7, stimuli_nback_7, 2)
createBlocksVisual(stimuliList_nbackVisual_8, stimuli_nback_8, 2)
createBlocksVisual(stimuliList_nbackVisual_9, stimuli_nback_9, 2)
createBlocksVisual(stimuliList_nbackVisual_10, stimuli_nback_10, 2)
createBlocksVisual(stimuliList_nbackVisual_11, stimuli_nback_11, 2)
createBlocksVisual(stimuliList_nbackVisual_12, stimuli_nback_12, 2)


var response_grid =
'<div class = numbox>' +
'<p>What were the numbers <b>in order</b>?<br>(When you are ready to lock in your answer, press ENTER)</p>' +
'<button id = button_1 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>1</div></div></button>' +
'<button id = button_2 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>2</div></div></button>' +
'<button id = button_3 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>3</div></div></button>' +
'<button id = button_4 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>4</div></div></button>' +
'<button id = button_5 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>5</div></div></button>' +
'<button id = button_6 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>6</div></div></button>' +
'<button id = button_7 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>7</div></div></button>' +
'<button id = button_8 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>8</div></div></button>' +
'<button id = button_9 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>9</div></div></button>' +
'<button class = clear_button id = "ClearButton" onclick = "clearResponse()">Clear</button>'+
'<p><u><b>Current Answer:</b></u></p><div id=echoed_txt style="font-size: 30px; color:blue;"><b></b></div></div>'


/* define practice feedback trials for n-back */

const feedbackCorrect = {
  ... trialStructure,
  stimulus: `<div style="font-size:30px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">+</div><div style="font-size:40px; color: green; position: absolute; top: 40%; left: 50%; transform: translate(-50%, -50%);">${language.feedback.correct}</div>`,
  choices: jsPsych.NO_KEYS,
  trial_duration: feedBackDuration,
  data: {test_part: 'feedback_nback'}
}
const feedbackWrong = { 
  ... feedbackCorrect, 
  stimulus: `<div style="font-size:30px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">+</div><div style="font-size:40px; color: red; position: absolute; top: 40%; left: 50%; transform: translate(-50%, -50%);">${language.feedback.wrong}</div>` 
}
const feedbackNo = { 
  ... feedbackCorrect, 
  stimulus: `<div style="font-size:30px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">+</div><div style="font-size:40px; color: red; position: absolute; top: 40%; left: 50%; transform: translate(-50%, -50%);">${language.feedback.noResponse}</div>` 
}

const feedbackRemindHard = { 
  ... feedbackCorrect,
  trial_duration: remindDuration,
  stimulus: `<p>${remindHard}</p>` 
}
const feedbackRemindEasy = { 
  ... feedbackCorrect,
  trial_duration: remindDuration,
  stimulus: `<p>${language.overallTrainingFeedback.remind1Back}</p>` 
}

/* define task trials for n-back*/

const fixation = {
  ... trialStructure,
  stimulus: '<div style="font-size:30px;">+</div>',
  choices: jsPsych.NO_KEYS,
  trial_duration: fixationDuration,
  data: {test_part: 'fixation_nback'}
}

const testNback = {
  ... trialStructure,
  stimulus: jsPsych.timelineVariable('stimulus'),
  choices: buttonToPressForTarget,
  data: jsPsych.timelineVariable('data'),
  response_ends_trial: false,
  trial_duration: letterDuration,
  stimulus_duration: letterDuration,
  on_finish: function(data){
    if ((data.task == "nback") && (data.block == "main_easy" || data.block == "main_hard" || data.block == "practice_easy" || data.block == "practice_hard" || data.block =='overall_training_hard' || data.block =='overall_training_easy')){
    nbackCounter ++};

    if ((data.task == "nback" || data.task =="nbackVisual") && (data.block == "main_easy" || data.block == "main_hard")){
    mainNbackCounter ++ ;
    data.mainNbackCounter = mainNbackCounter;
    console.log(mainNbackCounter, "is mainNbackCounter")
    };


    if (data.task == "nbackVisual" && (data.block == "main_easy" || data.block == "main_hard")){
    nbackVisualCounter ++ ;
    data.nbackVisualCounter = nbackVisualCounter;
    console.log(nbackVisualCounter, "is nbackVisualCounter")
    };

    // data.task = 'n-back';ffff
    if (data.correct_response == "f" && data.key_press == 70){
        data.correct_rejection = 1;
    } else {
        data.correct_rejection = 0;
    }
    if (data.correct_response == "j" && data.key_press == 70){
        data.miss = 1;
    } else {
        data.miss = 0;
    }
    if (data.correct_response == "j" && data.key_press == 74){
        data.hit = 1;
    } else {
        data.hit = 0;
    }
    if (data.correct_response == "f" && data.key_press == 74){
        data.false_alarm = 1;
    } else {
        data.false_alarm = 0;
    }
    data.subBlock = subBlock;
    console.log(subBlock, "is subBlock at the end of the nback trial")
    console.log(data.block, "is block at the end of the nback trial")
    console.log(nbackCounter, "is nbackCounter at the end of the nback trial")
  },
}
const visualCache = {
  ... trialStructure,
  stimulus: stCache,
  choices: jsPsych.NO_KEYS,
  response_ends_trial: false,
  trial_duration: fixationDuration,
  stimulus_duration: fixationDuration,
}

const afterBlock_nback = {
    ... trialStructure,
    stimulus: "",
    trial_duration:0,
    on_start: function () {
        console.log("afterBlock_nback function starting, nbackCounter reset to 0")
        block_order++;
        nbackCounter = 0;
    }
}

const nback_reset = {
    ... trialStructure,
    stimulus: "",
    trial_duration:0,
    on_start: function () {
        console.log("nbackreset function starting, nbackCounter reset to 0")
        nbackCounter = 0;
    }
}


const nback_and_subBlock_reset_to_0 = {
    type: "html-keyboard-response",
    stimulus: `<p>L'expérience commence maintenant.</p><br>
    <p> Appuyez sur la touche 'F' ou la touche 'J' pour débuter.</p>`,
    on_start: function () {
        console.log("nback_and_subBlock_reset function starting, nbackCounter reset to 0")
        nbackCounter = 0;
        subBlock = 0;
    },
    choices: buttonToPressForTarget
}
const nback_and_subBlock_reset_to_6 = {
    type: "html-keyboard-response",
    stimulus: `<p>L'expérience commence maintenant.</p><br>
    <p> Appuyez sur la touche 'F' ou la touche 'J' pour débuter.</p>`,
    on_start: function () {
        console.log("nback_and_subBlock_reset function starting, nbackCounter reset to 0")
        nbackCounter = 0;
        subBlock = 6;
    },
    choices: buttonToPressForTarget
}

const comprehensionSurveyHard = {
    type: "survey-multi-choice",
    // Add a top-level array with the correct answers (1-based indices as requested)
    data: {task: 'comprehensionSurveyHard'},
    questions: [
        {
            prompt: language.comprehension.q1Hard.prompt,
            options: [
                language.comprehension.q1Hard.options[0],
                language.comprehension.q1Hard.options[1],
                language.comprehension.q1Hard.options[2],
                language.comprehension.q1Hard.options[3]
            ],
            required: true,
            // good answer for question 1 (1-based index as specified)
            correct_response: 4
        },
        {
            prompt: language.comprehension.q2.prompt,
            options: [
                language.comprehension.q2.options[0],
                language.comprehension.q2.options[1],
                language.comprehension.q2.options[2]
            ],
            required: true,
            // good answer for question 2 (1-based index as specified)
            correct_response: 1
        },
        {
            prompt: language.comprehension.q3Hard.prompt,
            options: [
                language.comprehension.q3Hard.options[0],
                language.comprehension.q3Hard.options[1],
                language.comprehension.q3Hard.options[2]
            ],
            required: true,
            // good answer for question 3 (1-based index as specified)
            correct_response: 2
        },
    ],
    button_label: language.button.next,
    randomize_question_order : false,
    preamble: `<h2>${language.comprehensionIntro}</h2>`,
    on_finish: function (data) {
    // jsPsych stores answers as { Q0: "chosen option text", Q1: "...", ... }
    const responses = JSON.parse(data.responses);

    let all_correct = true;

    comprehensionSurveyHard.questions.forEach((q, i) => {
      const given_answer = responses["Q" + i];    // the text chosen
      console.log(given_answer, "is given answer")
      const correct_text = q.options[q.correct_response -1]; // correct text -1
      console.log(correct_text, "is correct text")
      if (given_answer !== correct_text) {
        all_correct = false;
        console.log(all_correct, "is all_correct")
      }
    });

    // Save result to trial data
    data.all_correct = all_correct;
    console.log(all_correct, "is all_correct at the end of the survey")
  }
};

const comprehensionSurveyEasy = {
    type: "survey-multi-choice",
    data: {task: 'comprehensionSurveyEasy'},
    // Add a top-level array with the correct answers (1-based indices as requested)
    questions: [
        {
            prompt: language.comprehension.q1Easy.prompt,
            options: [
                language.comprehension.q1Easy.options[0],
                language.comprehension.q1Easy.options[1],
                language.comprehension.q1Easy.options[2],
                language.comprehension.q1Easy.options[3]
            ],
            required: true,
            // good answer for question 1 (1-based index as specified)
            correct_response: 4
        },
        {
            prompt: language.comprehension.q2.prompt,
            options: [
                language.comprehension.q2.options[0],
                language.comprehension.q2.options[1],
                language.comprehension.q2.options[2]
            ],
            required: true,
            // good answer for question 2 (1-based index as specified)
            correct_response: 1
        },
        {
            prompt: language.comprehension.q3Easy.prompt,
            options: [
                language.comprehension.q3Easy.options[0],
                language.comprehension.q3Easy.options[1],
                language.comprehension.q3Easy.options[2]
            ],
            required: true,
            // good answer for question 3 (1-based index as specified)
            correct_response: 2
        },
    ],
    button_label: language.button.next,    
    randomize_question_order : true,
    preamble: `<h2>${language.comprehensionIntro}</h2>`,
        on_finish: function (data) {
    // jsPsych stores answers as { Q0: "chosen option text", Q1: "...", ... }
    const responses = JSON.parse(data.responses);

    let all_correct = true;

    comprehensionSurveyEasy.questions.forEach((q, i) => {
      const given_answer = responses["Q" + i];    // the text chosen
      console.log(given_answer, "is given answer")
      const correct_text = q.options[q.correct_response -1]; // correct text -1
      console.log(correct_text, "is correct text")
      if (given_answer !== correct_text) {
        all_correct = false;
        console.log(all_correct, "is all_correct")
      }
    });

    // Save result to trial data
    data.all_correct = all_correct;
    console.log(all_correct, "is all_correct at the end of the survey")
  }
}


// Demographics adn prolific id: separate age text-entry (numeric) + multi-choice rest
const prolificID = {
    type: "survey-text",
    data: {task: 'prolificID'},
    questions: [
        {
            prompt: language.prolificID,
            required: true,
            name: 'prolificID'
        }
    ],
    preamble: ``,
    button_label: language.button.next,
    on_finish: function(data) {
        const responses = JSON.parse(data.responses);
        const prolific_id = responses.prolificID;
        console.log('Prolific ID entered (responses.prolificID):', prolific_id);
        console.log('responses are', responses);
        // Validate age: enforce 9..100 (inclusive)
        if (prolific_id.length != 24) {
            data.prolific_id = null;
            data.prolific_id_valid = false;
            console.log('Invalid prolific id entry:', prolific_id);
            // Show a blocking localized alert so the participant immediately knows what's wrong
            try {
                if (language === fr) {
                    window.alert('Entrée invalide. Veuillez indiquer votre identifiant Prolific (24 caractères).');
                } else {
                    window.alert('Invalid entry. Please enter your Prolific ID (24 characters).');
                }
            } catch (e) {
                // fallback to console log if alerts are disabled
                console.log('Alert failed, invalid prolific id entered:', prolific_id);
            }
        } else {
            data.prolific_id = prolific_id;
            data.prolific_id_valid = true;
        }
    }
};

// Loop the prolific ID entry until a valid ID (15 characters) is provided.
const prolific_id_loop = {
    timeline: [
        prolificID
    ],
    loop_function: function() {
        const last = jsPsych.data.get().filter({task: 'prolificID'}).last(1).values()[0];
        // repeat while last.prolific_id_valid is not true
        return !(last && last.prolific_id_valid === true);
    }
};



// Age as a text input so participants can type their exact age
const demographics_age = {
    type: "survey-text",
    data: {task: 'demographics_age'},
    questions: [
        {
            prompt: language.demographics.questions[0],
            required: true,
            name: 'age'
        }
    ],
    preamble: `<p>${language.demographics.preamble}</p>`,
    button_label: language.button.next,
    on_finish: function(data) {
        const responses = JSON.parse(data.responses);
        const ageStr = responses.Q0 || responses.age || '';
        const ageNum = parseInt(ageStr, 10);
        // Validate age: enforce 9..100 (inclusive)
        if (!Number.isInteger(ageNum) || ageNum < 9 || ageNum > 100) {
            data.age = null;
            data.age_valid = false;
            console.log('Invalid age entry:', ageStr);
            // Show a blocking localized alert so the participant immediately knows what's wrong
            try {
                if (language === fr) {
                    window.alert('Entrée invalide. Veuillez indiquer votre âge en années (entre 9 et 100).');
                } else {
                    window.alert('Invalid entry. Please enter your age in years (between 9 and 100).');
                }
            } catch (e) {
                // fallback to console log if alerts are disabled
                console.log('Alert failed, invalid age entered:', ageStr);
            }
        } else {
            data.age = ageNum;
            data.age_valid = true;
        }
    }
};

// Loop the age entry until a valid numeric age (9-100) is provided.
const demographics_age_loop = {
    timeline: [
        demographics_age
    ],
    loop_function: function() {
        const last = jsPsych.data.get().filter({task: 'demographics_age'}).last(1).values()[0];
        // repeat while last.age_valid is not true
        return !(last && last.age_valid === true);
    }
};

const demographics = (function(){
    const qs = [];
    // question 1: gender
    qs.push({
        prompt: language.demographics.questions[1],
        options: language.demographics.options.gender.slice(),
        required: true
    });
    // question 2: education
    qs.push({
        prompt: language.demographics.questions[2],
        options: language.demographics.options.education.slice(),
        required: true
    });
    // question 3: work
    qs.push({
        prompt: language.demographics.questions[3],
        options: language.demographics.options.work.slice(),
        required: true
    });
    // question 4: income
    qs.push({
        prompt: language.demographics.questions[4],
        options: language.demographics.options.income.slice(),
        required: true
    });
    // question 5: life satisfaction
    qs.push({
        prompt: language.demographics.questions[5],
        options: language.demographics.options.life.slice(),
        required: true
    });

    return {
        type: "survey-multi-choice",
        data: {task: 'demographics'},
        on_start: function(trial) {
            // copy the last validated age into this trial's data so it is saved with the rest
            const last = jsPsych.data.get().filter({task: 'demographics_age', age_valid: true}).last(1).values()[0];
            if (last && typeof last.age !== 'undefined') {
                trial.data = trial.data || {};
                trial.data.age = last.age;
            }
        },
        preamble: `<p>${language.demographics.preamble}</p>`,
        questions: qs,
        button_label: language.button.next,
        randomize_question_order: false,
        on_finish: function(data) {
            // nothing special for now, responses are saved in data.responses
            console.log('demographics finished', JSON.parse(data.responses));
        }
    };
})();


const prolific_redirect = {
    type: "html-keyboard-response",
    stimulus: function() {
        return `<p>${language.redirectProlific}</p>`;
    },
    choices: jsPsych.NO_KEYS,
    trial_duration: 3000,
    data: {task: 'prolific_redirect'},
    on_finish: function() {
        // // Redirect to Prolific
        // window.location.href = prolific_url;
        // End the JATOS study first, then redirect
        // jatos.endStudy(jsPsych.data.get().json(), true);
        jatos.endStudyAndRedirect("https://www.prolific.com/participants", jsPsych.data.get().json());
    }
    };


/* define the functions for flanker */

function countdown(start, timelimit) {

	var timeleft_bar = document.getElementById("timeleft");
	var timeleft_width = (timelimit - (Date.now() - start))*100/timelimit;
	timeleft_bar.style.width = timeleft_width + "%";

	function shorten_timebar() {
		if (timeleft_width <= 0) {
			clearInterval(update_timeleft)
		} else {
			timeleft_width -= 10*100/timelimit // 10: time interval set in setInterval;
			timeleft_bar.style.width = timeleft_width + "%";
		}
	}

	var update_timeleft = setInterval(shorten_timebar, 10);
}

function display_flanker(stimulus) {
	// var stim = stimuli_flanker[stimulus].stim;
	return "<div style='font-size: 10pt; position: relative; left: 5%; display: flex; align-items: center;'>Time left<div id = 'countdownbar' style = 'margin: 0px 25px;'><div id = 'timeleft'></div></div><div style='align-self: baseline;'>Score<br><span style='font-size:27pt;'><b>" + total_flanker + "</b></span></div></div><div style='height: 130px;'></div>" +
	// "<img src='" + stimulus + "' width='290'><p><br></p>"
    `<img src='${stimulus}' width='290'><p><br></p>`
}

/* define the flanker trials */ 

const trial_flanker = {
    type: "html-button-response",
    stimulus: function() { return display_flanker(jsPsych.timelineVariable('stim', true)); },
    choices: function() { return [jsPsych.timelineVariable('resp1', true), jsPsych.timelineVariable('resp2', true)]; },
    button_html: function() {
        var choice1 = '<button class="choiceStyle"; style="font-family: Open Sans; font-weight: 1000;"><div style="color: black; font-size: 34pt; font-weight: 200;">_</div><img src=%choice% width="290"></button>'
        var choice2 = '<button class="choiceStyle"; style="font-family: Open Sans; font-weight: 1000;"><div style="color: black; font-size: 34pt; font-weight: 200;">_</div><img src=%choice% width="290"></button>'

        return [choice1, choice2];
    },  
    margin_horizontal: '50px',
    on_start: function() {
        // Set up timer if it's the first trial
        if (block_trial_count == 0) {
            block_time_limit = practice_indicator == 1 ? practice_duration : main_duration;
            block_start = Date.now();

            end_timer = setTimeout(function() {

                block_trial_count = 0;
                timeout = 1;

                // console.log("Block timed out at this trial", block_trial_count, timeout); // Here to debug

                // this function is all you need to end the current timeline
                jsPsych.endCurrentTimeline();

            }, block_time_limit);
        }
    },
    on_load: function() {
        countdown(block_start, block_time_limit);
    },
    on_finish: function(data) { // 
        data.block_trial_count = timeout == 1 ? block_trial_count : block_trial_count + 1;
        data.task = "flanker";
        data.practice_indicator = practice_indicator;
        data.item = jsPsych.timelineVariable('item', true) ; //flanker[block_trial_count]; // flanker here is the array of trials, 100 between 1:16 for practice, 500 for main test. Data item is the line number of the stimuli and choices associated
        data.stim = jsPsych.timelineVariable('stimsign', true) ; //stimuli_flanker[flanker[block_trial_count]].stimsign; 
        data.resp1 = jsPsych.timelineVariable('resp1sign', true) ; //stimuli_flanker[flanker[block_trial_count]].resp1sign;
        data.resp2 = jsPsych.timelineVariable('resp2sign', true) ; //stimuli_flanker[flanker[block_trial_count]].resp2sign;
        data.correct_response = jsPsych.timelineVariable('correct_response', true) ; //stimuli_flanker[flanker[block_trial_count]].correct_response;
        data.condition = jsPsych.timelineVariable('condition', true) ; //stimuli_flanker[flanker[block_trial_count]].condition;
        data.accuracy = /*data.response*/data.button_pressed == jsPsych.timelineVariable('correct_response', true) ? 1 : 0;
        data.timeout = timeout;

        switch(timeout) {
            case 0:
                total_flanker = data.accuracy == 1 ? total_flanker + 1 : total_flanker - 1;
                break;
            case 1:
                total_flanker = total_flanker;
                break;
        }

        data.score_after_trial = total_flanker;

        // console.log(data, block_time_limit - (Date.now()-block_start), (Date.now() - block_start)) // Here to debug
    }
}

const feedback_flanker = {
    type: "html-button-response",
    stimulus: function() { return display_flanker(jsPsych.timelineVariable('stim', true)); },
    choices: function() { return [jsPsych.timelineVariable('resp1', true), jsPsych.timelineVariable('resp2', true)]; },
    button_html: function() {
        var resp = Number(jsPsych.data.get().last(1).values()[0].button_pressed); //jsPsych.data.get().last(1).values()[0].response;
        var correct_response = jsPsych.data.get().last(1).values()[0].correct_response;

        switch (resp) {
            // console.log("switchstarted")
            case 0:
                var feedback1 = correct_response == 0 ? '<div style="color: #1ED760; font-size: 34pt; font-weight: 200;">&#10004;</div>' : '<div style="color: red; font-size: 34pt; font-weight: 200;">&#10008;</div>';
                var feedback2 = '<div style="color: black; font-size: 34pt; font-weight: 200;">_</div>';
                break;
            case 1:
                var feedback1 = '<div style="color: black; font-size: 34pt; font-weight: 200;">_</div>';
                var feedback2 = correct_response == 1 ? '<div style="color: #1ED760; font-size: 34pt; font-weight: 200;">&#10004;</div>' : '<div style="color: red; font-size: 34pt; font-weight: 200;">&#10008;</div>';
                break;
        }

        var img1 = jsPsych.timelineVariable('resp1', true);
        var img2 = jsPsych.timelineVariable('resp2', true);

        var choice1 = `<button class="choiceStyle" style="font-family: Open Sans; font-weight: 1000; color: #0000FF;">${feedback1}<img src="${img1}" width="290"></button>`;
        var choice2 = `<button class="choiceStyle" style="font-family: Open Sans; font-weight: 1000; color: #0000FF;">${feedback2}<img src="${img2}" width="290"></button>`;

        return [choice1, choice2];
    },
    margin_horizontal: '50px',
    on_start: function() {
        block_trial_count++
    },
    on_load: function() {
        countdown(block_start, block_time_limit);
    },
    on_finish: function() {
        timeout = 0
    },
    trial_duration: 500,
    response_ends_trial: false
}

const afterHardBlock_flanker = {
  ... trialStructure,
  stimulus: "",
  trial_duration: 0,
  on_start: function () {
    console.log("afterHardBlock activated")
    total_flanker_hard = total_flanker;
    total_flanker = 0;
    nbackCounter = 0;
    block_order++;
    console.log(total_flanker_hard, "is total_flanker_hard at the end of the hard block");
  }
}

const afterEasyBlock_flanker = {
  ... trialStructure,
  stimulus: "",
  trial_duration:0,
  on_start: function () {
    console.log("afterEasyBlock activated")
    total_flanker_easy = total_flanker;
    total_flanker = 0;
    nbackCounter = 0;
    block_order++;
    console.log(total_flanker_easy, "is total_flanker_easy at the end of the easy block")
  }
}

const afterFlankerPractice = {
  ... trialStructure,
  stimulus: "",
  trial_duration: 0,
  on_start: function () {
    console.log("afterFlankerPractice activated")
    total_flanker = 0
    practice_indicator = 0
    console.log(total_flanker, "is total_flanker at the end of the the flanker_practice")
    console.log(practice_indicator, "is practice_indicator, the indicator for flanker trials (their length)")
  }
}


/* define the span trials */


const instructions_span = {
    type: "html-button-response",
    stimulus: '<p>Instructions for the span test game.</p>'+
                '<p>On each trial, you will see a sequence of digits and be asked to type them back in the same order in which they were seen.</p>'+
                '<p>For example, if you saw the digits <b style="color:blue;">1</b>, <b style="color:blue;">2</b>, '+ 
                '<b style="color:blue;">3</b>, you would respond with <b style="color:blue;">1</b>, <b style="color:blue;">2</b>, <b style="color:blue;">3</b>.</p>'+
                '<p>You will start a short practice round on the next page.</p>',

    choices: ["Continue"]
}

const fdsTotalTrials_update = {
    type: 'call-function',
    func: updateTotalTrials
}

const feedback_span ={
    type: 'html-keyboard-response',
    stimulus: "nana",
//`<p><b>${fdb}</b><br>Your answer was ${response}, the right numbers were ${fds_correct_ans}</br></p>`,
    choices: jsPsych.NO_KEYS,
    trial_duration: 2000,
    on_start: function (trial) {
        console.log(jsPsych.data.get().last(2).values()[0].was_correct)
        console.log(jsPsych.data.get().last(2).values()[0].answer, "is the answer")
        if (jsPsych.data.get().last(2).values()[0].was_correct == 0){
            fdb = 'wrong'
            console.log(fdb, "is fdb")
        }
        if (jsPsych.data.get().last(2).values()[0].was_correct == 1){
            fdb ='right'
            console.log(fdb, "is fdb")
        }
        console.log(fdb)
        console.log(response, "is response")
        return trial.stimulus = `<p><b>${fdb}</b><br>Your answer was ${jsPsych.data.get().last(2).values()[0].answer}, the right numbers were ${fds_correct_ans}</br></p>`
    },
}

const setup_fds = {
    type: 'html-button-response',
    stimulus: function(){return '<p>Trial '+fdsTrialNum+' of '+fdsTotalTrials+'</p>';},
    choices: ['Begin'],
        post_trial_gap: 500,
        on_finish: function(){
            if(fdsTrialNum == 1) {
                currentSpan = startingSpan;
            }
            stimList = getStimuli(currentSpan); //get the current stimuli for the trial
            spanHistory[fdsTrialNum-1]=currentSpan; //log the current span in an array
            fdsTrialNum += 1; //add 1 to the total trial count
            idx = 0; //reset the index prior to the letter presentation
            exitLetters = 0; //reset the exit letter variable
        }
};

const letter_fds_vis = {
    type: 'html-keyboard-response',
    stimulus: function(){return stimList[idx];},
    choices: jsPsych.NO_KEYS,
    trial_duration: 500,
    post_trial_gap: 250,
    on_finish: function(){
        idx += 1; //update the index
        //check to see if we are at the end of the letter array
        if (idx == stimList.length) {
            exitLetters = 1;
        } else	{
            exitLetters = 0;
        }
    }
}

const fds_response_screen = {
    type: 'html-keyboard-response',
    stimulus: response_grid,
    choices: ['Enter'],
        on_finish: function(data){
            var curans = response;
            var corans = fds_correct_ans;
            if(JSON.stringify(curans) === JSON.stringify(corans)) {
                var gotItRight = 1;
                console.log("correct");
                staircaseChecker[staircaseIndex] = 1;
            } else {
                var gotItRight = 0;
                console.log("incorrect");
                staircaseChecker[staircaseIndex] = 0;
            }
            response = []; //clear the response for the next trial
            staircaseIndex += 1; //update the staircase index
            console.log(staircaseChecker);
    
            jsPsych.data.addDataToLastTrial({
                designation: 'FDS-RESPONSE',
                span: currentSpan,
                answer: curans,
                correct: corans,
                was_correct: gotItRight,
                spanHistory: spanHistory,
                task: "span"
            });
        }
}

const staircase_assess = {
    type: 'call-function',
    func: updateSpan
}

const afterEasyBlock_span = {
    ... trialStructure,
    stimulus: "",
    trial_duration:0,
    on_start: function () {
      console.log("afterEasyBlock activated")
      fdsTrialNum = 1;
      nbackCounter = 0;
      block_order++;
    }
  }

const afterHardBlock_span = {
    ... trialStructure,
    stimulus: "",
    trial_duration: 0,
    on_start: function () {
      console.log("afterHardBlock activated")
      fdsTrialNum = 1;
      nbackCounter = 0;
      block_order++;
    }
  }


/* define conditional timeline elements for nback practice */

const feedBackC = {
  timeline: [feedbackCorrect],
  timeline_variables: feedbackCorrect.data,
    conditional_function: function () {
        let data = jsPsych.data.get().last(1).values()[0];

        return data.hit == 1 || data.correct_rejection == 1
    }
}

const feedBackW = {
  timeline: [feedbackWrong],
  timeline_variables: feedbackWrong.data,
    conditional_function: function () {
        let data = jsPsych.data.get().last(1).values()[0];
        return data.hit == 0 || data.correct_rejection == 0
    }
}

const feedBackN = {
    timeline: [feedbackNo],
    timeline_variables: feedbackNo.data,
      conditional_function: function () {
          let data = jsPsych.data.get().last(1).values()[0];
          return data.hit === 0 && data.correct_rejection === 0 && data.miss === 0 && data.false_alarm === 0
      }
  }



const block_indicator = {
    ...trialStructure,
    stimulus: function () {
      const blockNames = {
        fr: ["premier", "deuxième", "troisième", "quatrième", "cinquième", "sixième"],
        en: ["first", "second", "third", "fourth", "fifth", "sixth"]
      };
  
      const lang = language === fr ? 'fr' : 'en';
      const nth = blockNames[lang][block_order] || "unknown";
  
      console.log(block_order, "is block_order", nth, "is nth");
      console.log(language);
      return `<p>${language === fr ? `Ceci est le ${nth} bloc. Appuyez sur une touche pour continuer.` : `This is the ${nth}block. Press any key to continue.`}</p>`;
    }
  };
  

/*************** TIMELINE ***************/

 
const timelineElementStructure = {
    repetitions: 1,
    randomize_order: false,
}

const flanker_practice = {
  timeline: [trial_flanker, feedback_flanker],
  timeline_variables: practice_array, // or main_array
    // conditional_function: function () {
    //     return nbackCounter > 0 && nbackCounter % 10 === 0
    // }
}
const flanker_1 = {
  timeline: [trial_flanker, feedback_flanker ],
  timeline_variables: main_array_1,//flanker_variables,
  conditional_function: function () {
      if (nbackCounter > 0 && nbackCounter % 10 === 0) {
        timeout = 0
    };
      return nbackCounter == 10;
  }
}
const flanker_2 = {
timeline: [trial_flanker, feedback_flanker ],
timeline_variables: main_array_2,//flanker_variables,
conditional_function: function () {
    if (nbackCounter > 0 && nbackCounter % 10 === 0) {
        timeout = 0
    };
    return nbackCounter == 20;
}
}
const flanker_3 = {
timeline: [trial_flanker, feedback_flanker ],
timeline_variables: main_array_3,//flanker_variables,
conditional_function: function () {
    if (nbackCounter > 0 && nbackCounter % 10 === 0) {
        timeout = 0
    };
    return nbackCounter == 30;
}
}
const flanker_4 = {
timeline: [trial_flanker, feedback_flanker ],
timeline_variables: main_array_4,//flanker_variables,
conditional_function: function () {
    if (nbackCounter > 0 && nbackCounter % 10 === 0) {
        timeout = 0
    };
    return nbackCounter == 40;
}
}
const flanker_5 = {
timeline: [trial_flanker, feedback_flanker ],
timeline_variables: main_array_5,//flanker_variables,
conditional_function: function () {
    if (nbackCounter > 0 && nbackCounter % 10 === 0) {
        timeout = 0
    };
    return nbackCounter == 50;
}
}
const flanker_6 = {
timeline: [trial_flanker, feedback_flanker ],
timeline_variables: main_array_6, //flanker_variables,
conditional_function: function () {
    if (nbackCounter > 0 && nbackCounter % 10 === 0) {
        timeout = 0
    };
    return nbackCounter == 60;
}
}
const flanker_7 = {
timeline: [trial_flanker, feedback_flanker ],
timeline_variables: main_array_7,//flanker_variables,
conditional_function: function () {
    if (nbackCounter > 0 && nbackCounter % 10 === 0) {
        timeout = 0
    };
    return nbackCounter == 10;
}
} 
const flanker_8 = {
    timeline: [trial_flanker, feedback_flanker ],
    timeline_variables: main_array_8,//flanker_variables,
    conditional_function: function () {
        if (nbackCounter > 0 && nbackCounter % 10 === 0) {
        timeout = 0
    };
        return nbackCounter == 20;
    }
} 
const flanker_9 = {
    timeline: [trial_flanker, feedback_flanker ],
    timeline_variables: main_array_9,//flanker_variables,
    conditional_function: function () {
        if (nbackCounter > 0 && nbackCounter % 10 === 0) {
        timeout = 0
    };
        return nbackCounter == 30;
    }
}
const flanker_10 = {
    timeline: [trial_flanker, feedback_flanker ],
    timeline_variables: main_array_10,//flanker_variables,
    conditional_function: function () {
        if (nbackCounter > 0 && nbackCounter % 10 === 0) {
        timeout = 0
    };
        return nbackCounter == 40;
    }
}
const flanker_11 = {
    timeline: [trial_flanker, feedback_flanker ],
    timeline_variables: main_array_11,//flanker_variables,
    conditional_function: function () {
        if (nbackCounter > 0 && nbackCounter % 10 === 0) {
        timeout = 0
    };
        return nbackCounter == 50;
    }
}
const flanker_12 = {
    timeline: [trial_flanker, feedback_flanker ],
    timeline_variables: main_array_12, //flanker_variables,
    conditional_function: function () {
        if (nbackCounter > 0 && nbackCounter % 10 === 0) {
        timeout = 0
    };
        return nbackCounter == 60;
    }
}


const nbackVisual_practice = {
    timeline: [visualCache, testNback, feedBackC, feedBackN, feedBackW],
    timeline_variables: stimuli_nback_practice,
};


const nbackVisual_1 = {
    timeline: [visualCache, testNback],
    timeline_variables: stimuli_nback_1,
    conditional_function: function() {
        if (nbackCounter > 0 && nbackCounter % 10 === 0) {
            timeout = 0;
        }
        if (nbackCounter === 10) {
            subBlock = 1;
        }
        console.log
        return nbackCounter === 10;
    }
};
const nbackVisual_2 = {
    timeline: [visualCache, testNback],
    timeline_variables: stimuli_nback_2,
    conditional_function: function() {
        if (nbackCounter > 0 && nbackCounter % 10 === 0) {
            timeout = 0;
        }
        if (nbackCounter === 20) {
            subBlock = 2;
        }
        return nbackCounter === 20;
    }
};
const nbackVisual_3 = {
    timeline: [visualCache, testNback],
    timeline_variables: stimuli_nback_3,
    conditional_function: function() {
        if (nbackCounter > 0 && nbackCounter % 10 === 0) {
            timeout = 0;
        }
        if (nbackCounter === 30) {
            subBlock = 3;
        }
        return nbackCounter === 30;
    }
};
const nbackVisual_4 = {
    timeline: [visualCache, testNback],
    timeline_variables: stimuli_nback_4,
    conditional_function: function() {
        if (nbackCounter > 0 && nbackCounter % 10 === 0) {
            timeout = 0;
        }
        if (nbackCounter === 40) {
            subBlock = 4;
        }
        return nbackCounter === 40;
    }
};
const nbackVisual_5 = {
    timeline: [visualCache, testNback],
    timeline_variables: stimuli_nback_5,
    conditional_function: function() {
        if (nbackCounter > 0 && nbackCounter % 10 === 0) {
            timeout = 0;
        }
        if (nbackCounter === 50) {
            subBlock = 5;
        }
        return nbackCounter === 50;
    }
};
const nbackVisual_6 = {
    timeline: [visualCache, testNback],
    timeline_variables: stimuli_nback_6,
    conditional_function: function() {
        if (nbackCounter > 0 && nbackCounter % 10 === 0) {
            timeout = 0;
        }
        if (nbackCounter === 60) {
            subBlock = 6;
        }
        return nbackCounter === 60;
    }
};
const nbackVisual_7 = {
    timeline: [visualCache, testNback],
    timeline_variables: stimuli_nback_7,
    conditional_function: function() {
        if (nbackCounter > 0 && nbackCounter % 10 === 0) {
            timeout = 0;
        }
        if (nbackCounter === 10) {
            subBlock = 7;
        }
        return nbackCounter === 10;
    }
};
const nbackVisual_8 = {
    timeline: [visualCache, testNback],
    timeline_variables: stimuli_nback_8,
    conditional_function: function() {
        if (nbackCounter > 0 && nbackCounter % 10 === 0) {
            timeout = 0;
        }
        if (nbackCounter === 20) {
            subBlock = 8;
        }
        return nbackCounter === 20;
    }
};
const nbackVisual_9 = {
    timeline: [visualCache, testNback],
    timeline_variables: stimuli_nback_9,
    conditional_function: function() {
        if (nbackCounter > 0 && nbackCounter % 10 === 0) {
            timeout = 0;
        }
        if (nbackCounter === 30) {
            subBlock = 9;
        }
        return nbackCounter === 30;
    }
};
const nbackVisual_10 = {
    timeline: [visualCache, testNback],
    timeline_variables: stimuli_nback_10,
    conditional_function: function() {
        if (nbackCounter > 0 && nbackCounter % 10 === 0) {
            timeout = 0;
        }
        if (nbackCounter === 40) {
            subBlock = 10;
        }
        return nbackCounter === 40;
    }
};
const nbackVisual_11 = {
    timeline: [visualCache, testNback],
    timeline_variables: stimuli_nback_11,
    conditional_function: function() {
        if (nbackCounter > 0 && nbackCounter % 10 === 0) {
            timeout = 0;
        }
        if (nbackCounter === 50) {
            subBlock = 11;
        }
        return nbackCounter === 50;
    }
};
const nbackVisual_12 = {
    timeline: [visualCache, testNback],
    timeline_variables: stimuli_nback_12,
    conditional_function: function() {
        if (nbackCounter > 0 && nbackCounter % 10 === 0) {
            timeout = 0;
        }
        if (nbackCounter === 60) {
            subBlock = 12;
        }
        return nbackCounter === 60;
    }
};

const paymentExplanationEasyTrialFirst = {
    type: "html-keyboard-response",
    stimulus: function() { // to improve lisibility why not style="text-align: left;
        return `<div style="max-width: 1200px">
            <h2>${paymentExplanationEasy.title}</h2>
            <p>${paymentExplanationEasy.mainText.replace(/\$\{payment\}/g, payment)}</p>
            <p>${paymentExplanationEasy.score.replace(/__PAYMENT__/g, payment)}<br>
        </div>`;
    }
};
const paymentExplanationEasyTrialSecond = {
    type: "html-keyboard-response",
    stimulus: function() { // to improve lisibility why not style="text-align: left;
        return `<div style="max-width: 1200px">
            <h2>${paymentExplanationEasy.title}</h2>
            <p>${paymentExplanationEasy.changeScore}</p>
            <p>${paymentExplanationEasy.score.replace(/__PAYMENT__/g, payment)}<br>
        </div>`;
    }
};
const paymentExplanationHardTrialFirst = {
    type: "html-keyboard-response",
    stimulus: function() { // to improve lisibility why not style="text-align: left;
        return `<div style="max-width: 1200px">
            <h2>${paymentExplanationHard.title}</h2>
            <p>${paymentExplanationHard.mainText.replace(/\$\{payment\}/g, payment)}</p>
            <p>${paymentExplanationHard.score.replace(/__PAYMENT__/g, payment)}<br>
        </div>`;
    }
};
const paymentExplanationHardTrialSecond = {
    type: "html-keyboard-response",
    stimulus: function() { // to improve lisibility why not style="text-align: left;
        return `<div style="max-width: 1200px">
            <h2>${paymentExplanationHard.title}</h2>
            <p>${paymentExplanationHard.changeScore}</p>
            <p>${paymentExplanationHard.score.replace(/__PAYMENT__/g, payment)}<br>
        </div>`;
    }
};

const overallTrainingExplanationEasy = {... trialStructure, stimulus: 
    `<div style="max-width: 1200px">
        <h2>${language.overallTrainingIntro.title}</h2>
        <p>${language.overallTrainingIntro.description}</p>
        <p>${language.overallTrainingIntro.structure}</p>
        <p>${language.overallTrainingIntro.importance}</p>
        <p>${language.overallTrainingIntro.feedback}</p>
        <p>${language.overallTrainingIntro.highlightEasy}</p>
        <p>${language.overallTrainingIntro.ready}</p><br>
    </div>`,
    on_start: function () {
        subBlock = -1;
    }
}
const overallTrainingExplanationHard = {... trialStructure, stimulus: 
    `<div style="max-width: 1200px">
        <h2>${language.overallTrainingIntro.title}</h2>
        <p>${language.overallTrainingIntro.description}</p>
        <p>${language.overallTrainingIntro.structure}</p>
        <p>${language.overallTrainingIntro.importance}</p>
        <p>${language.overallTrainingIntro.feedback}</p>
        <p>${language.overallTrainingIntro.highlightHard.replace('{level}', level)}</p>
        <p>${language.overallTrainingIntro.ready}</p><br>
    </div>`,
    on_start: function () {
        subBlock = -1;
    }
}


const overallTrainingHardFeedback = {
    ...trialStructure,
    type: "html-keyboard-response",
    stimulus: function() {
        // Get n-back level for the selected subBlock
        let nbackLevel = level;

        // Get all trials and correct trials for visual nback
        let totalTrialsVisualNback = jsPsych.data.get().filterCustom(function(trial) {
            return trial.block === "nbackVisual_overall_practice" && trial.task === "nbackVisual";
        });
        let totalTrialsVN = totalTrialsVisualNback.count();
        let corTrialsVN = totalTrialsVisualNback.filterCustom(function(trial) {
            return (trial.hit === 1 || trial.correct_rejection === 1) && trial.key_press !== null && trial.key_press !== -1;
        }).count();

        let totalTrialsNback = jsPsych.data.get().filterCustom(function(trial) {
            return trial.task === "nback" && trial.block === "overall_training_hard" && trial.trial_number > 10;
        });
        let totalTrialsN = totalTrialsNback.count();
        let corTrialsN = totalTrialsNback.filterCustom(function(trial) {
            return  (trial.hit === 1 || trial.correct_rejection === 1) &&
                        trial.key_press !== null && trial.key_press !== -1;
        }).count();

        let postVisualTrials = totalTrialsNback.filterCustom(function(trial){
            return trial.trial_number >10 && trial.trial_number < (11 + nbackLevel);
        })
        let postVT = postVisualTrials.count();

        let corPostVT = postVisualTrials.filterCustom(function(trial) {
            console.log(postVisualTrials, "is postVisualTrials")
            return (trial.hit === 1 || trial.correct_rejection === 1) &&
                   trial.key_press !== null && trial.key_press !== -1; // Exclude no-response trials from correct count
        }).count();

        // Calculate accuracies as decimals (0-1 range instead of percentages)
        let accuracyVN = corTrialsVN / totalTrialsVN;
        let accuracyN = corTrialsN / totalTrialsN;
        let accuracyPostVisual = corPostVT / postVT;

        // Calculate total payment - weighted sum of accuracies
        let totalPayment = payment * (0.5 * accuracyPostVisual + 0.25 * accuracyVN + 0.25 * accuracyN);
        // Round to 2 decimal places
        totalPayment = Math.round(totalPayment * 100) / 100;

        // Convert to percentages for display
        let accuracyVNPercent = Math.round(accuracyVN * 100);
        let accuracyNPercent = Math.round(accuracyN * 100);
        let accuracyPostVisualPercent = Math.round(accuracyPostVisual * 100);

        // Create stimulus with calculated values
        return `<div style="max-width: 1200px">
            <h2>${language.overallTrainingFeedback.title}</h2>
            <p>${language.overallTrainingFeedback.performance}</p>
            <p>${language.overallTrainingFeedback.nback.replace('{accuracy}', accuracyNPercent).replace('{correct}', corTrialsN).replace('{total}', totalTrialsN)}</p>
            <p>${language.overallTrainingFeedback.visualNback.replace('{accuracy}', accuracyVNPercent).replace('{correct}', corTrialsVN).replace('{total}', totalTrialsVN)}</p>
            <p>${language.overallTrainingFeedback.afterVisual.replace('{Lettres}', "Lettres").replace('{accuracy}', accuracyPostVisualPercent).replace('{correct}', corPostVT).replace('{total}', postVT)}. ${explainHard}</p>
            <p>${language.overallTrainingFeedback.keyImportanceHard.replace('{level}', nbackLevel)}</p>
            <p>${language.overallTrainingFeedback.calculation.replace('{payment}', payment).replace('{afterVisualAcc}', accuracyPostVisual.toFixed(2)).replace('{visualAcc}', accuracyVN.toFixed(2)).replace('{letterAcc}', accuracyN.toFixed(2)).replace('{totalBonus}', totalPayment.toFixed(2))}</p>
            <p>${language.overallTrainingFeedback.rememberHard.replace('{level}', nbackLevel)}</p>
            <p>${language.overallTrainingFeedback.continue}</p>
        </div>`;
    }
};
const overallTrainingEasyFeedback = {
    ...trialStructure,
    type: "html-keyboard-response",
    stimulus: function() {

        // Get n-back level for the selected subBlock
        let nbackLevel = 1;

        let totalTrialsVisualNback = jsPsych.data.get().filterCustom(function(trial) {
            return trial.block === "nbackVisual_overall_practice" && trial.task === "nbackVisual";
        });
        let totalTrialsVN = totalTrialsVisualNback.count();
        let corTrialsVN = totalTrialsVisualNback.filterCustom(function(trial) {
            return (trial.hit === 1 || trial.correct_rejection === 1) && trial.key_press !== null && trial.key_press !== -1;
        }).count();

        let totalTrialsNback = jsPsych.data.get().filterCustom(function(trial) {
            return trial.task === "nback" && trial.block === "overall_training_easy" && trial.trial_number > 10;
        });
        let totalTrialsN = totalTrialsNback.count();
        let corTrialsN = totalTrialsNback.filterCustom(function(trial) {
            return  (trial.hit === 1 || trial.correct_rejection === 1) &&
                        trial.key_press !== null && trial.key_press !== -1;
        }).count();
        
        let postVisualTrials = totalTrialsNback.filterCustom(function(trial){
            return trial.trial_number == 11;
        });
        let postVT = postVisualTrials.count();

        let corPostVT = postVisualTrials.filterCustom(function(trial) {
            console.log(postVisualTrials, "is postVisualTrials")
            return (trial.hit === 1 || trial.correct_rejection === 1) &&
                   trial.key_press !== null && trial.key_press !== -1; // Exclude no-response trials from correct count
        }).count();

        // Calculate accuracies as decimals (0-1 range instead of percentages)
        let accuracyVN = corTrialsVN / totalTrialsVN;
        let accuracyN = corTrialsN / totalTrialsN;
        let accuracyPostVisual = corPostVT / postVT;

        // Calculate total payment - weighted sum of accuracies
        let totalPayment = payment * (0.5 * accuracyPostVisual + 0.25 * accuracyVN + 0.25 * accuracyN);
        // Round to 2 decimal places
        totalPayment = Math.round(totalPayment * 100) / 100;

        // Convert to percentages for display
        let accuracyVNPercent = Math.round(accuracyVN * 100);
        let accuracyNPercent = Math.round(accuracyN * 100);
        let accuracyPostVisualPercent = Math.round(accuracyPostVisual * 100);

        // Create stimulus with calculated values
        return `<div style="max-width: 1200px">
            <h2>${language.overallTrainingFeedback.title}</h2>
            <p>${language.overallTrainingFeedback.performance}</p>
            <p>${language.overallTrainingFeedback.nback.replace('{accuracy}', accuracyNPercent).replace('{correct}', corTrialsN).replace('{total}', totalTrialsN)}</p>
            <p>${language.overallTrainingFeedback.visualNback.replace('{accuracy}', accuracyVNPercent).replace('{correct}', corTrialsVN).replace('{total}', totalTrialsVN)}</p>
            <p>${language.overallTrainingFeedback.afterVisual.replace('{accuracy}', accuracyPostVisualPercent).replace('{correct}', corPostVT).replace('{total}', postVT).replace('{Lettres}', "Lettre")}. ${language.overallTrainingFeedback.explain1Back}</p>
            <p>${language.overallTrainingFeedback.keyImportanceEasy}</p>
            <p>${language.overallTrainingFeedback.calculation.replace('{payment}', payment).replace('{afterVisualAcc}', accuracyPostVisual.toFixed(2)).replace('{visualAcc}', accuracyVN.toFixed(2)).replace('{letterAcc}', accuracyN.toFixed(2)).replace('{totalBonus}', totalPayment.toFixed(2))}</p>
            <p>${language.overallTrainingFeedback.rememberEasy}</p>
            <p>${language.overallTrainingFeedback.continue}</p>
        </div>`;
    }
};


const easyBlock_nbackVisual = { ... timelineElementStructure, timeline_variables: nbackStimuli.stimuliEasy_nback, timeline: [fixation, testNback, nbackVisual_1, nbackVisual_2, nbackVisual_3, nbackVisual_4, nbackVisual_5, nbackVisual_6] }
const hardBlock_nbackVisual = { ... timelineElementStructure, timeline_variables: nbackStimuli.stimuliHard_nback, timeline: [fixation, testNback, nbackVisual_7, nbackVisual_8, nbackVisual_9, nbackVisual_10, nbackVisual_11, nbackVisual_12] }

const practiceEasyBlock_nback_nback = { ... timelineElementStructure, timeline_variables: nbackStimuli.stimuliPracticeEasy_nback, timeline: [fixation, testNback, feedBackN, feedBackC, feedBackW]}
const practiceHardBlock_nback_nback = { ... timelineElementStructure, timeline_variables: nbackStimuli.stimuliPracticeHard_nback, timeline: [fixation, testNback, feedBackN, feedBackC, feedBackW]}

/* Overall training blocks */

const overallTrainingNbackVisual = { timeline: [visualCache, testNback], timeline_variables: stimuli_nbackVisual_overall_training, 
    conditional_function: function() {
        if (nbackCounter > 0 && nbackCounter % 10 === 0) {
            timeout = 0;
        }
        return nbackCounter === 10;
    } }
const feedbackREasy = {
    timeline: [feedbackRemindEasy],
    timeline_variables: feedbackNo.data,
        conditional_function: function () {
            return nbackCounter === 10;
        }
}
const feedbackRHard = {
    timeline: [feedbackRemindHard],
    timeline_variables: feedbackNo.data,
        conditional_function: function () {
            return nbackCounter === 10 || nbackCounter === 11 || nbackCounter === 12;
        }
}
const overallTrainingHard_nback = { ... timelineElementStructure, timeline_variables: nbackStimuli.stimuliHardOverallTraining, timeline: [fixation, testNback, overallTrainingNbackVisual, feedbackRHard] }
const overallTrainingEasy_nback = { ... timelineElementStructure, timeline_variables: nbackStimuli.stimuliEasyOverallTraining, timeline: [fixation, testNback, overallTrainingNbackVisual, feedbackREasy] }

const hardBlock_overallTraining = { ...timelineElementStructure, timeline: [overallTrainingHard_nback, overallTrainingNbackVisual] }
const easyBlock_overallTraining = { ...timelineElementStructure, timeline: [overallTrainingEasy_nback, overallTrainingNbackVisual] }

const loopComprehensionSurveyHard = {
    timeline: [
        comprehensionSurveyHard,
        {
            conditional_function: function() {
                const last = jsPsych.data.get().filter({task: 'comprehensionSurveyHard'}).last(1).values()[0];
                console.log(last, "is last")
                return last && last.all_correct === false;
            },
            timeline: [loopAgain, instructions_NbackVisual, instructions_hard, paymentExplanationHardTrialFirst]
        }
    ],
    loop_function: function() {
        const last = jsPsych.data.get().filter({task: 'comprehensionSurveyHard'}).last(1).values()[0];
        console.log("exited the loopComprehensionSurveyHard")
        return !(last && last.all_correct === true);
    }
};
const loopComprehensionSurveyEasy = {
    timeline: [
        comprehensionSurveyEasy,
        {
            conditional_function: function() {
                const last = jsPsych.data.get().filter({task: 'comprehensionSurveyEasy'}).last(1).values()[0];
                console.log(last, "is last")
                return last && last.all_correct === false;
            },
            timeline: [loopAgain, instructions_NbackVisual, instructions_easy, paymentExplanationEasyTrialFirst]
        }
    ],
    loop_function: function() {
        const last = jsPsych.data.get().filter({task: 'comprehensionSurveyEasy'}).last(1).values()[0];
        // if no survey data found, repeat; otherwise repeat while not all_correct
        console.log("exited the loopComprehensionSurveyEasy")
        return !(last && last.all_correct === true);
    }
};

const overallTrainingHard = { ...timelineElementStructure, timeline: [nback_reset, overallTrainingExplanationHard, hardBlock_overallTraining, overallTrainingHardFeedback, loopComprehensionSurveyHard, nback_and_subBlock_reset_to_6] }
const overallTrainingEasy = { ...timelineElementStructure, timeline: [nback_reset, overallTrainingExplanationEasy, easyBlock_overallTraining, overallTrainingEasyFeedback, loopComprehensionSurveyEasy, nback_and_subBlock_reset_to_0] }




const practiceEasyBlock_nback_flanker = { ... timelineElementStructure, timeline_variables: nbackStimuli.stimuliPracticeEasy_flanker, timeline: [fixation, testNback, feedBackN, feedBackC, feedBackW]}
const practiceHardBlock_nback_flanker = { ... timelineElementStructure, timeline_variables: nbackStimuli.stimuliPracticeHard_flanker, timeline: [fixation, testNback, feedBackN, feedBackC, feedBackW] }

const easyBlock_nback_flanker = { ... timelineElementStructure, timeline_variables: nbackStimuli.stimuliEasy_flanker, timeline: [fixation, testNback, flanker_1, flanker_2, flanker_3, flanker_4, flanker_5, flanker_6] }
const hardBlock_nback_flanker = { ... easyBlock_nback_flanker, timeline_variables: nbackStimuli.stimuliHard_flanker,timeline: [fixation, testNback, flanker_7, flanker_8, flanker_9, flanker_10, flanker_11, flanker_12] }








let experimentBlocks_nback_nback = [];
let practiceAndTestEasy_nback_nback;
let practiceAndTestHard_nback_nback;

practiceAndTestEasy_nback_nback = {
    timeline: [
        // block_indicator, 
        instructions_easy, 
        startPractice, 
        practiceEasyBlock_nback_nback,
        afterPracticeEasy,
        nback_reset,
        easyBlock_nbackVisual, 
        afterBlock_nback
    ],
    repetitions: 1,
    randomize_order: false,
    on_start: function () {
        blockEasy = 1;
    }
};

practiceAndTestHard_nback_nback = {
    timeline: [
        // block_indicator, 
        instructions_hard, 
        startPractice, 
        practiceHardBlock_nback_nback,
        afterPracticeHard,
        nback_reset,
        hardBlock_nbackVisual, 
        afterBlock_nback
    ],
    repetitions: 1,
    randomize_order: false,
    on_start: function () {
        blockEasy = 0;
    }
};

let block_order_indicator;

if (Math.random() < 0.5) {
    experimentBlocks_nback_nback = [practiceAndTestHard_nback_nback, practiceAndTestEasy_nback_nback];
    block_order_indicator = "hard_first";
    console.log("practiceAndTestHard_nback_nback first");
    practiceAndTestHard_nback_nback.timeline.splice(4, 0, paymentExplanationHardTrialFirst);
    practiceAndTestEasy_nback_nback.timeline.splice(4, 0, paymentExplanationEasyTrialSecond);
    // Insert overall training after payment explanation (hard first)
    // Hard level can be 2-back or 3-back - use the global level variable
    const trainingLevel = level || 2; // Use global level or default to 2
    practiceAndTestHard_nback_nback.timeline.splice(5, 0, overallTrainingHard);
} else {
    experimentBlocks_nback_nback = [practiceAndTestEasy_nback_nback, practiceAndTestHard_nback_nback];
    block_order_indicator = "easy_first";
    console.log("practiceAndTestEasy_nback_nback first");
    practiceAndTestEasy_nback_nback.timeline.splice(4, 0, paymentExplanationEasyTrialFirst);
    practiceAndTestHard_nback_nback.timeline.splice(4, 0, paymentExplanationHardTrialSecond);
    // Insert overall training after payment explanation (easy first, so level 1)
    const trainingLevel = 1; // Easy level is always 1-back
    practiceAndTestEasy_nback_nback.timeline.splice(5, 0, overallTrainingEasy);
}

const experiment_nback_nback = {
    timeline: experimentBlocks_nback_nback,
    randomize_order: true,
}




/* timelines flanker */

const practiceAndTestEasy_nback_flanker = {
  timeline: [block_indicator, instructions_easy, startPractice, practiceEasyBlock_nback_flanker, afterPracticeEasy, easyBlock_nback_flanker, afterEasyBlock_flanker],
  repetitions: 1,
  randomize_order: false,
  on_start: function () {
    blockEasy = 1;
  },
  on_finish: function () {
  }
};
const practiceAndTestHard_nback_flanker = {
  timeline: [block_indicator, instructions_hard, startPractice, practiceHardBlock_nback_flanker, afterPracticeHard, hardBlock_nback_flanker, afterHardBlock_flanker],
  repetitions: 1,
  randomize_order: false,
  on_start: function () {
  },
  on_finish: function () {
  }
};

if (Math.random() < 0.5) {
  experimentBlocks_nback_flanker = [practiceAndTestHard_nback_flanker, practiceAndTestEasy_nback_flanker];} 
else {experimentBlocks_nback_flanker = [practiceAndTestEasy_nback_flanker, practiceAndTestHard_nback_flanker];}

const experiment_nback_flanker = {
timeline: experimentBlocks_nback_flanker,
randomize_order: true,
};

const debriefBlock = {
  type: "html-keyboard-response",
  choices: jsPsych.NO_KEYS,
  stimulus: function() {
    let trials = jsPsych.data.get().filterCustom(function(trial){
      return (trial.block === 1 || trial.block === 2) && trial.test_part === "test";
  }); 
    let correct_trials = trials.filterCustom(function(trial){
      return (trial.hit === 1 || trial.correct_rejection === 1) &&
             trial.key_press !== null && trial.key_press !== -1; // Exclude no-response trials from correct count
  })
    let accuracy = Math.round(correct_trials.count()/trials.count() * 100);
    let rt = Math.round(correct_trials.select('rt').mean());

    return `
    <h2>${language.end.end}</h2>
    <p>${language.end.thankYou}</p>`;
    // <p>${language.feedback.accuracy}${accuracy}${language.feedback.accuracy2}</p>
    // <p>${language.feedback.rt}${rt}${language.feedback.rt2}</p>
  },
  trial_duration: 3000,
  on_finish: function(trial) { statCalculation(trial) }
};

// Function to generate a random integer between min and max (inclusive)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  // Generate a random integer between 1 and 11
const subBlockInteger = getRandomInt(1, 12);
//getRandomInt(1, totSubBlocks);
console.log(subBlockInteger, "selected subBlock for payment"); // Output: random integer between 2 and 11



// Incentives screen after n-back tasks

  const incentives = {
    type: "html-keyboard-response",
    choices: ['Enter'],
    stimulus: "",
    on_start: function(trial) {

        // Get n-back level for the selected subBlock // could also be determined by the subBlock number : if <=6 it is 1; if >= 7, it is level
        if (subBlockInteger <= 6) {
            nbackLevel = 1;
        } else {
            nbackLevel = level;
        }
        console.log(nbackLevel, "is the nback level for the subBlock selected for payment")
        // let nbackLevel = jsPsych.data.get().filterCustom(function(trial) {
        //     return trial.subBlock == subBlockInteger && trial.level;
        // }).select('level').values[0];
        // console.log(nbackLevel, "is the nback level for the selected subBlock"
        // )

        // Get all trials and correct trials for visual nback
        let totalTrialsVN = jsPsych.data.get().filterCustom(function(trial) {
            console.log(trial.task, "is trial.task inside the incentives filter, when subBlockInteger == 6")
            console.log(trial.subBlock, "is trial.subBlock inside the incentives filter, when subBlockInteger == 6")
            return trial.subBlock == subBlockInteger && trial.task == "nbackVisual";
        }).count();
        console.log(totalTrialsVN, "is totalTrialsVN inside the incentives filter, when subBlockInteger == 6")
        
        let corTrialsVN = jsPsych.data.get().filterCustom(function(trial) {
            return trial.subBlock == subBlockInteger && 
                   (trial.hit === 1 || trial.correct_rejection === 1) && 
                   trial.task == "nbackVisual" &&
                   trial.key_press !== null && trial.key_press !== -1; // Exclude no-response trials from correct count
        }).count();
        console.log(corTrialsVN, "is corTrialsVN inside the incentives filter, when subBlockInteger == 6")

        // Get all trials and correct trials for classic nback
        let totalTrialsNback = jsPsych.data.get().filterCustom(function(trial) {
            if (subBlockInteger == 6) {
                console.log(trial.block, "is trial.block inside the incentives filter, when subBlockInteger == 6")
                return trial.task === "nback" && trial.block === "main_easy" && (trial.subBlock === 6 || (trial.trial_number >= 1 && trial.trial_number <= 10));
            }
            else if (subBlockInteger == 12) {
                return trial.task === "nback" && trial.block === "main_hard" && (trial.subBlock === 12 || (trial.trial_number >= 1 && trial.trial_number <= 10));
            }
            else return trial.task === "nback" && trial.subBlock === subBlockInteger
        });

        let totalTrialsN = totalTrialsNback.count();
        let corTrialsN = totalTrialsNback.filterCustom(function(trial) {
            return (trial.hit === 1 || trial.correct_rejection === 1) && trial.key_press !== null && trial.key_press !== -1; // Exclude no-response trials from correct count
        }).count();


        // Get trials immediately following visual n-back
        let minTrialNumber = jsPsych.data.get()
        .filterCustom(function(trial) {
            return trial.subBlock == subBlockInteger && 
                trial.task == "nback";
        })
        .select('trial_number')
        .min();

        let postVisualTrials = jsPsych.data.get()
        .filterCustom(function(trial) {
            return trial.subBlock == subBlockInteger && 
                   trial.task == "nback" &&
                   trial.trial_number >= minTrialNumber &&
                   trial.trial_number < (minTrialNumber + nbackLevel);
        });
        console.log(postVisualTrials, "is postVisualTrials inside the incentives filter, when subBlockInteger == 6")

        let corPostVisualTrials = postVisualTrials.filterCustom(function(trial) {
            return (trial.hit === 1 || trial.correct_rejection === 1) &&
                   trial.key_press !== null && trial.key_press !== -1; // Exclude no-response trials from correct count
        }).count();

        // Calculate accuracies as decimals (0-1 range instead of percentages)
        let accuracyVN = corTrialsVN / totalTrialsVN;
        let accuracyN = corTrialsN / totalTrialsN;
        let accuracyPostVisual = corPostVisualTrials / postVisualTrials.count();

        // Calculate total payment - weighted sum of accuracies
        let totalPayment = payment * (0.5 * accuracyPostVisual + 0.25 * accuracyVN + 0.25 * accuracyN);
        // Round to 2 decimal places
        totalPayment = Math.round(totalPayment * 100) / 100;

        trial.totalPayment = totalPayment;
        trial.accuracy_post_visual = accuracyPostVisual;
        trial.accuracy_visual = accuracyVN;
        trial.accuracy_letter = accuracyN;
        trial.nback_level_payment = nbackLevel;

        const html =  `
            <p>${language.incentives.selectedBlock.replace('${subBlockInteger}', subBlockInteger)}</p>
            <p>${language.incentives.accuracies
                .replace('${percentPostVisual}', Math.round(accuracyPostVisual * 100))
                .replace('${percentVN}', Math.round(accuracyVN * 100))
                .replace('${percentN}', Math.round(accuracyN * 100))}</p>
            <p>${language.incentives.visualDetails
                .replace('${totalTrialsVN}', totalTrialsVN)
                .replace('${corTrialsVN}', corTrialsVN)}</p>
            <p>${language.incentives.letterDetails
                .replace('${totalTrialsN}', totalTrialsN)
                .replace('${corTrialsN}', corTrialsN)}</p>
            <p>${language.incentives.postVisualDetails
                .replace('${postVisualTrials}', postVisualTrials.count())
                .replace('${corPostVisualTrials}', corPostVisualTrials)}</p>
            <p>${language.incentives.paymentExplanation
                .replace('${accuracyPostVisual}', Math.round(accuracyPostVisual * 100) + '%')
                .replace('${accuracyVN}', Math.round(accuracyVN * 100) + '%')
                .replace('${accuracyN}', Math.round(accuracyN * 100) + '%')}</p>
            <p><b>${language.incentives.totalPayment.replace('${totalPayment}', totalPayment)}</b></p>
            <p>${language.incentives.thankYou}</p>
            <p>${language.incentives.redirect}</p>
            <p>${language.incentives.continue}</p>`;

            trial.stimulus = html; // set final display

    },
    on_finish: function(trial) { 
        trial.selected_subblock = subBlockInteger;
        trial.block_order_indicator = block_order_indicator;
        trial.totalPayment = trial.totalPayment;

        statCalculation(trial);
    },
};

//   const incentives_originals = {
//     type: "html-keyboard-response",
//     choices: ['Enter'],
//     stimulus: function() {

//         // Get n-back level for the selected subBlock // could also be determined by the subBlock number : if <=6 it is 1; if >= 7, it is level
//         if (subBlockInteger <= 6) {
//             nbackLevel = 1;
//         } else {
//             nbackLevel = level;
//         }
//         console.log(nbackLevel, "is the nback level for the subBlock selected for payment")
//         // let nbackLevel = jsPsych.data.get().filterCustom(function(trial) {
//         //     return trial.subBlock == subBlockInteger && trial.level;
//         // }).select('level').values[0];
//         // console.log(nbackLevel, "is the nback level for the selected subBlock"
//         // )

//         // Get all trials and correct trials for visual nback
//         let totalTrialsVN = jsPsych.data.get().filterCustom(function(trial) {
//             console.log(trial.task, "is trial.task inside the incentives filter, when subBlockInteger == 6")
//             console.log(trial.subBlock, "is trial.subBlock inside the incentives filter, when subBlockInteger == 6")
//             return trial.subBlock == subBlockInteger && trial.task == "nbackVisual";
//         }).count();
//         console.log(totalTrialsVN, "is totalTrialsVN inside the incentives filter, when subBlockInteger == 6")
        
//         let corTrialsVN = jsPsych.data.get().filterCustom(function(trial) {
//             return trial.subBlock == subBlockInteger && 
//                    (trial.hit === 1 || trial.correct_rejection === 1) && 
//                    trial.task == "nbackVisual" &&
//                    trial.key_press !== null && trial.key_press !== -1; // Exclude no-response trials from correct count
//         }).count();
//         console.log(corTrialsVN, "is corTrialsVN inside the incentives filter, when subBlockInteger == 6")

//         // Get all trials and correct trials for classic nback
//         let totalTrialsNback = jsPsych.data.get().filterCustom(function(trial) {
//             if (subBlockInteger == 6) {
//                 console.log(trial.block, "is trial.block inside the incentives filter, when subBlockInteger == 6")
//                 return trial.task === "nback" && trial.block === "main_easy" && (trial.subBlock === 6 || (trial.trial_number >= 1 && trial.trial_number <= 10));
//             }
//             else if (subBlockInteger == 12) {
//                 return trial.task === "nback" && trial.block === "main_hard" && (trial.subBlock === 12 || (trial.trial_number >= 1 && trial.trial_number <= 10));
//             }
//             else return trial.task === "nback" && trial.subBlock === subBlockInteger
//         });

//         let totalTrialsN = totalTrialsNback.count();
//         let corTrialsN = totalTrialsNback.filterCustom(function(trial) {
//             return (trial.hit === 1 || trial.correct_rejection === 1) && trial.key_press !== null && trial.key_press !== -1; // Exclude no-response trials from correct count
//         }).count();


//         // Get trials immediately following visual n-back
//         let minTrialNumber = jsPsych.data.get()
//         .filterCustom(function(trial) {
//             return trial.subBlock == subBlockInteger && 
//                 trial.task == "nback";
//         })
//         .select('trial_number')
//         .min();

//         let postVisualTrials = jsPsych.data.get()
//         .filterCustom(function(trial) {
//             return trial.subBlock == subBlockInteger && 
//                    trial.task == "nback" &&
//                    trial.trial_number >= minTrialNumber &&
//                    trial.trial_number < (minTrialNumber + nbackLevel);
//         });
//         console.log(postVisualTrials, "is postVisualTrials inside the incentives filter, when subBlockInteger == 6")

//         let corPostVisualTrials = postVisualTrials.filterCustom(function(trial) {
//             return (trial.hit === 1 || trial.correct_rejection === 1) &&
//                    trial.key_press !== null && trial.key_press !== -1; // Exclude no-response trials from correct count
//         }).count();

//         // Calculate accuracies as decimals (0-1 range instead of percentages)
//         let accuracyVN = corTrialsVN / totalTrialsVN;
//         let accuracyN = corTrialsN / totalTrialsN;
//         let accuracyPostVisual = corPostVisualTrials / postVisualTrials.count();

//         // Calculate total payment - weighted sum of accuracies
//         let totalPayment = payment * (0.5 * accuracyPostVisual + 0.25 * accuracyVN + 0.25 * accuracyN);
//         // Round to 2 decimal places
//         totalPayment = Math.round(totalPayment * 100) / 100;

//         return `
//     <p>${language.incentives.selectedBlock.replace('${subBlockInteger}', subBlockInteger)}</p>
//     <p>${language.incentives.accuracies
//         .replace('${percentPostVisual}', Math.round(accuracyPostVisual * 100))
//         .replace('${percentVN}', Math.round(accuracyVN * 100))
//         .replace('${percentN}', Math.round(accuracyN * 100))}</p>
//     <p>${language.incentives.visualDetails
//         .replace('${totalTrialsVN}', totalTrialsVN)
//         .replace('${corTrialsVN}', corTrialsVN)}</p>
//     <p>${language.incentives.letterDetails
//         .replace('${totalTrialsN}', totalTrialsN)
//         .replace('${corTrialsN}', corTrialsN)}</p>
//     <p>${language.incentives.postVisualDetails
//         .replace('${postVisualTrials}', postVisualTrials.count())
//         .replace('${corPostVisualTrials}', corPostVisualTrials)}</p>
//     <p>${language.incentives.paymentExplanation
//         .replace('${accuracyPostVisual}', Math.round(accuracyPostVisual * 100) + '%')
//         .replace('${accuracyVN}', Math.round(accuracyVN * 100) + '%')
//         .replace('${accuracyN}', Math.round(accuracyN * 100) + '%')}</p>
//     <p><b>${language.incentives.totalPayment.replace('${totalPayment}', totalPayment)}</b></p>
//     <p>${language.incentives.thankYou}</p>
//     <p>${language.incentives.redirect}</p>
//     <p>${language.incentives.continue}</p>`;
//     },
//     on_finish: function(trial) { 
//         trial.selected_subblock = subBlockInteger;
//         trial.block_order_indicator = block_order_indicator;

//         statCalculation(trial);
//     },
// };


var letter_proc = {
    timeline: [letter_fds_vis],
    loop_function: function(){
        if(exitLetters == 0){
            return true;
        } else {
            return false;
        }
    }
}
const staircase = {
    timeline: [setup_fds, letter_proc, fds_response_screen , staircase_assess]
    }

const fds_practiceproc = {
    timeline: [fdsTotalTrials_update, staircase, feedback_span],
    loop_function: function() {
        //if we have reached the specified total trial amount, exit
        // if(fdsTrialNum > fdsTotalTrials) {
        if(fdsTrialNum == 3) {
            fdsTotalTrials = 12
            fdsTrialNum =1
            console.log(fdsTotalTrials, "is fdsTotalTrials at the end of the loop practice session")
            return false;
        } else {
            return true;
        }
    },
};
const fds_mainproc = {
    timeline: [staircase],
    conditional_function: function () {
        if (nbackCounter > 0 && nbackCounter % 10 === 0) {
            return true
        }
        else {return false}
    },
    loop_function: function() {
        //if we have reached the specified total trial amount, exit
        // if(fdsTrialNum > fdsTotalTrials) {
        if((fdsTrialNum + 1)% 2 == 0) {
            return false;
        } else {
            return true;
        }
    }
};

const easyBlock_nback_span = { ... timelineElementStructure, timeline_variables: nbackStimuli.stimuliEasy_span, timeline: [fixation, testNback, fds_mainproc] }
const hardBlock_nback_span = { ... timelineElementStructure, timeline_variables: nbackStimuli.stimuliHard_span, timeline: [fixation, testNback, fds_mainproc] }

const practiceEasyBlock_nback_span = { ... timelineElementStructure, timeline_variables: nbackStimuli.stimuliPracticeEasy_span, timeline: [fixation, testNback, feedBackN, feedBackC, feedBackW]}
const practiceHardBlock_nback_span = { ... timelineElementStructure, timeline_variables: nbackStimuli.stimuliPracticeHard_span, timeline: [fixation, testNback, feedBackN, feedBackC, feedBackW] }

const practiceAndTestEasy_nback_span = {
  timeline: [block_indicator, instructions_easy, startPractice, practiceEasyBlock_nback_span, afterPracticeEasy, easyBlock_nback_span, afterEasyBlock_span],
  repetitions: 1,
  randomize_order: false,
  on_start: function () {
  },
  on_finish: function () {
  }
};
const practiceAndTestHard_nback_span = {
  timeline: [block_indicator, instructions_hard, startPractice, practiceHardBlock_nback_span, afterPracticeHard, hardBlock_nback_span, afterHardBlock_span],
  repetitions: 1,
  randomize_order: false,
  on_start: function () {
    blockEasy = 0;
    console.log("practiceAndTestHard span")
  },
  on_finish: function () {
  }
};

if (Math.random() < 0.5) { experimentBlocks_nback_span = [practiceAndTestHard_nback_span, practiceAndTestEasy_nback_span];

} 
else { experimentBlocks_nback_span = [practiceAndTestEasy_nback_span, practiceAndTestHard_nback_span]; 
}


const experiment_nback_span = {
timeline: experimentBlocks_nback_span,
randomize_order: true,
};


/* main timeline */ 

jsPsych.data.addProperties({subject: subjectId});

timeline.push( {type: "fullscreen", fullscreen_mode: true}, welcome, prolific_id_loop, overviewPage, demographics_age_loop, demographics, descriptionExperiment, instructions_NbackVisual, startPractice, nbackVisual_practice, experiment_nback_nback, /* instructions_span, fds_practiceproc, experiment_nback_span , instructions_flanker_1, flanker_practice, afterFlankerPractice, experiment_nback_flanker, debriefBlock,*/ incentives, prolific_redirect);
// instructions, instructions_flanker_1, experiment, debriefBlock.

/*************** EXPERIMENT START AND DATA UPDATE ***************/

// jsPsych.init({
//   timeline: timeline,
//   on_data_update: function() {
//     let interactionData = jsPsych.data.getInteractionData()
//     const interactionDataOfLastTrial = interactionData.filter({'trial': jsPsych.data.get().last(1).values()[0].trial_index}).values();
//     if (interactionDataOfLastTrial) {
//         jsPsych.data.get().last(1).values()[0].browser_events = JSON.stringify(interactionDataOfLastTrial)
//     }
//   },
//   on_close: function() {
//     jsPsych.data.get().localSave("csv", `NBack_Subject_${subjectId}_${level}back_quitted_output.csv`);
//   },
//   on_finish: function() {
//     jsPsych.data.get().localSave("csv", `NBack_Subject_${subjectId}_${level}back_output.csv`);
//     jsPsych.data.get().localSave("csv", `NBack_Subject_${subjectId}_${level}back_output.csv`);
//   }
// });

//  /* initialize jsPsych */
//  const jsPsyche = jsPsych.init({
//         timeline: timeline,
//         on_finish: function() {
//             jatos.endStudy(jsPsych.data.get().json());
//         }
//     });

// /* start the experiment */
//     jatos.onLoad(() => {
//         jsPsyche.run(timeline);
//     });

/* initialize jsPsych via jatos onLoad (do not call .run on an undefined return) */
jatos.onLoad(() => {
    jsPsych.init({
        timeline: timeline,
        // on_finish: function() {
        //     jatos.endStudy(jsPsych.data.get().json());
            // jsPsych.data.get().localSave("csv", `NBack_Subject_${subjectId}_${level}back_output.csv`);
        // }
    });
});

