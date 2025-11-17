/*************** VARIABLES nback ***************/

let nbackStimuli = {};
let instruction;
let timeline = [];
const buttonToPressForTarget = ["f","j"];
const trialStructure = { type: "html-keyboard-response" };
const subjectId = jsPsych.randomization.randomID(15)
let nbackCounter = 0; // the counter for each n-back trial
let practiceNbackCounter = 0; // the counter for each n-back trial in practice blocks
let generalNbackCounter = 0; // the counter for each n-back trial (visual included) in both main and practice blocks
let mainNbackCounter = 0; // the counter for each n-back trial (visual included) in the main task
let nbackVisualCounter = 0; // the counter for each visual n-back trial
let passPractice = 0; // the counter of achieved (>= 80%) practice block
let practiceIndex = 0; // the index of the practice stimuli list
let block_order = 0;
let subBlock = 0;  // the counter of target + source task block (used for incentives)
let totSubBlocks = 12; // 6 easy and 6 hard for the nback only experiment
let lastSubBlockOfFirstBlock = 6 // the last sub-block of the first block (used for incentives), if it is selected, the first trials before the first visual nback are taken into account for the incentives
let nbackLevel = 0; // store the level of the n-back task selected for the incentives payment
let remindDuration = 6000;
let pc = 0;
let isPostVisualWithFirsts = 0;
let maximumSpanCalibration = 0;

/*************** VARIABLES span ***************/
var useAudio = false; // change to false if you want this to be a visual task!

var currentDigitList; //current digit list
var totalCorrect = 0; //counter for total correct
var totalTrials = 0; //counter for total trials
var maxSpan; //value that will reflect a participant's maximum span (e.g., 6)
var folder = "digits/"; //folder name for storing the audio files
var fdsTrialNum = 1; //counter for trials
let fdsTotalTrials = 12;
let totalFdsSpanSpanTrials = 6;
var response = []; //for storing partcipants' responses
var fds_correct_ans; //for storing the correct answer on a given trial
var fds_correct_ans_first_letters; //for storing the correct answer of the fist letters in the span_span task
var staircaseChecker = []; //for assessing whether the span should move up/down/stay
var staircaseIndex = 0; //index for the current staircase
var digit_list = [1,2,3,4,5,6,7,8,9]; //digits to be used (unlikely you will want to change this)

let startingSpan = 3; //starting span for the calibration task. Then it is updated based on performance

var currentSpan; //to reference where participants currently are
var spanHistory = []; //easy logging of the participant's trajectory
var stimList; //this is going to house the ordering of the stimuli for each trial
var idx = 0; //for indexing the current letter to be presented
var exitLetters; //for exiting the letter loop
var fdb = "Not assigned"; // is the feedback displayed for the span, when it nothing has been selected

const arrSum = arr => arr.reduce((a,b) => a + b, 0) //simple variable for calculating sum of an array

let block_order_indicator_span_MPL = "";
let block_type = ""; // calibration/span_span/span_mpl
let subBlock_span_span = 0; // for incentives of span_span

let statusMPL = "none"; // at the beginning. Then it is mirror or lottery in the span_MPL phase
let actual_payment_calibration = 0;
/*************** VARIABLES nback-visual ***************/

var point_location = [];



/*************** VARIABLES span ***************/
let spanCounter = 0; // the counter for each n-back trial
let mplCounter = 0; // the counter for each mpl trial

const luckyPp = getRandomInt(1, propSelecForMPL); // determine if the participant is selected to be paid a random draw of an MPL
//let luckyPp = 1; // for testing purposes, set to 1 so that everyone is selected for MPL payment
console.log("luckyPp is ", luckyPp)



let taskEasy;
taskEasy = language.task1back

console.log(level, "is level")
let paymentExplanationEasy;
let paymentExplanationHard;
paymentExplanationEasy = language.paymentExplanation1Back

let explainHard;
let remindAfterHard;
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
  remindAfterHard = language.overallTrainingFeedback.remindAfter2Back
  explainHard = language.overallTrainingFeedback.explain2Back
} else if (level == 3) {
  instruction_hard = language.instructions3back
  taskHard= language.task3back
  paymentExplanationHard = language.paymentExplanation3Back
  remindAfterHard = language.overallTrainingFeedback.remindAfter3Back
  console.log(remindAfterHard, "is remindAfterHard")
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

// const overviewPage ={
//     type: "instructions",
//     pages: [],
//     show_clickable_nav: true,
//     button_label_next: language.button.next,
//     button_label_previous: language.button.previous,
//     allow_backward: true,
// }

const descriptionExperimentNback = {
    type: "instructions",
    pages: [
        `<div style="max-width: 1200px"> <p>${language.descriptionExperimentNback.twoGames}</p>
        <p>${language.descriptionExperimentNback.instructionsAfter}</p>
        <p>${language.descriptionExperimentNback.subBlockExplanation}</p>
        <p>${language.descriptionExperimentNback.paymentAfter}</p>
        <p>${language.descriptionExperimentNback.clickNext}</p> </div>`
    ],
    show_clickable_nav: true,
    button_label_next: language.button.next,
    button_label_previous: language.button.previous,
}

// const descriptionExperimentSpanMPL= {
//     type: "instructions",
//     pages: [

//     ],
//     show_clickable_nav: true,
//     button_label_next: language.button.next,
//     button_label_previous: language.button.previous,
//     allow_backward: true,
// }
const consentForm = {
    type: "instructions", //<p>${language.overviewPage.IRB}</p> when it'll be available
    pages: [`<h2>${language.overviewPage.purpose}</h2>
                <p>${language.overviewPage.anonimity}</p>
                <p>${language.overviewPage.credits}</p>
                <p>${language.overviewPage.question}</p>
                <p>${language.overviewPage.withdrawal}</p> 
                <p>${language.overviewPage.clickNext}</p>`]
    ,
    show_clickable_nav: true,
    button_label_next: language.button.next,
    button_label_previous: language.button.previous,
    allow_backward: true,
}
const instructionsBeforeCalibration = {
    type: "instructions",
    // <p>${language.descriptionExperimentSpanMPL.warningComprehensionQuestions.replace('{notUnderstoodPayment}', Math.round(notUnderstoodPayment*100)/100)}</p>
    pages: [    
        `       <h2>${language.descriptionExperimentSpanMPL.title}</h2>
                <p>${language.descriptionExperimentSpanMPL.threeParts}</p>
                <ul>
                <li>${language.descriptionExperimentSpanMPL.part1}</li>
                <li>${language.descriptionExperimentSpanMPL.part2}</li>
                <li>${language.descriptionExperimentSpanMPL.part3}</li>
                </ul>
                <p>${language.descriptionExperimentSpanMPL.payment.replace("{notUnderstoodPayment}", Math.round(notUnderstoodPayment * 100)/100).replace("{basePaymentThird}", Math.round(basePaymentThird * 100)/100)}</p>
                <p>${language.descriptionExperimentSpanMPL.paymentBonus}</p>
                <p>${language.descriptionExperimentSpanMPL.paymentAfter}</p>
                <p>${language.descriptionExperimentSpanMPL.clickNext}</p>`,

                `<h2>${language.instruction_span_general.title}</h2>
                <p>${language.instruction_span_general.description}</p>
                <p>${language.instruction_span_general.examplePresentation}</p>
                <p>${language.instruction_span_general.precision}</p>
                <p>${language.instruction_span_general.examplePrecision}</p>
                <p>${language.instruction_span_general.clickNext}</p>`,

                `<h2>${language.instructionCalibration.title}</h2>
                <p>${language.instructionCalibration.rounds}</p>
                <p>${language.instructionCalibration.staircase}</p>
                <p>${language.instructionCalibration.goal}</p>
                <p>${language.instructionCalibration.incentiveRule.replace("{bonus}", calibrationPayment)}</p>
                <p>${language.instructionCalibration.incentiveRuleExample.replace("{bonus}", calibrationPayment).replace("{examplePayment}", Math.round(calibrationPayment*(7/10)*100)/100)}</p>
                <p>${language.instructionCalibration.clickNext}</p>`
            ],
    show_clickable_nav: true,
    button_label_next: language.button.next,
    button_label_previous: language.button.previous,
    allow_backward: true,
}


const instructionsSpanSpan = {
    type: "instructions",
    pages: function(){
        let someBlueDigits, theBlueDigits, the;
        if (treatment == "hard") {
            someBlueDigits = language.instructionsSpanSpan.variableHard.someBlueDigits.replace("{startingSpan}", startingSpan).replace("{the}", the).replace("{startingSpan}",startingSpan);
            theBlueDigits = language.instructionsSpanSpan.variableHard.theBlueDigits.replace("{startingSpan}", startingSpan);
            the = language.instructionsSpanSpan.variableHard.the;
            displayed = language.instructionsSpanSpan.variableHard.displayed;
        }
        if (treatment == "easy") {
            someBlueDigits = language.instructionsSpanSpan.variableEasy.someBlueDigits;
            theBlueDigits = language.instructionsSpanSpan.variableEasy.theBlueDigits;
            the = language.instructionsSpanSpan.variableEasy.the;
            displayed = language.instructionsSpanSpan.variableEasy.displayed;
        }

    //     return [`<h2>${language.instructionsSpanSpan.title}</h2>
    //     <p>${language.instructionsSpanSpan.description}</p>
    //     <p>${language.instructionsSpanSpan.lettersOrder.replace("{someBlueDigits}", someBlueDigits).replace("{the}", the).replace("{theBlueDigits}", theBlueDigits)}</p>
    //     <p>${language.instructionsSpanSpan.goal}</p>
    //     <p>${language.instructionsSpanSpan.clickNext}</p>`,
    //     `<h2>${language.instructionsSpanSpanPayment.title}</h2>
    //     <h3>${language.instructionsSpanSpanPayment.subTitle}</h3>
    //     <p>${language.instructionsSpanSpanPayment.incentives.replace("{bonus}", spanSpanPayment_hard)}</p>
    //     <p>${language.instructionsSpanSpanPayment.incentiveRule.replace("{theBlueDigits}", theBlueDigits)}</p>
    //     <p>${language.instructionsSpanSpanPayment.incentiveRuleExample.replace("{theBlueDigits}", theBlueDigits).replace("{bonus}", spanSpanPayment_hard).replace("{examplePayment}", Math.round(spanSpanPayment_hard*(7.75/10)*100)/100)}</p>
    //     <p>${language.instructionsSpanSpanPayment.remember.replace("{theBlueDigits}", theBlueDigits)}</p>
    //     <p>${language.instructionsSpanSpanPayment.clickNext}</p>`
    // ];

        // version where the red digits task is named
        return [`<h2>${language.instructionsSpanSpan.title}</h2>
        <p>${language.instructionsSpanSpan.description}</p>
        <p>${language.instructionsSpanSpan.lettersOrder.replace("{theBlueDigits}", theBlueDigits).replace("{displayed}", displayed).replace("{theBlueDigits}", theBlueDigits)}</p>
        <p>${language.instructionsSpanSpan.goal.replace("{theBlueDigits}", theBlueDigits)}</p>
        <p>${language.instructionsSpanSpan.clickNext}</p>`,
        `<h2>${language.instructionsSpanSpanPayment.title}</h2>
        <h3>${language.instructionsSpanSpanPayment.subTitle}</h3>
        <p>${language.instructionsSpanSpanPayment.incentives.replace("{bonus}", spanSpanPayment_hard)}</p>
        <p>${language.instructionsSpanSpanPayment.incentiveRule.replace("{theBlueDigits}", theBlueDigits)}</p>
        <p>${language.instructionsSpanSpanPayment.incentiveRuleExample.replace("{theBlueDigits}", theBlueDigits).replace("{bonus}", spanSpanPayment_hard).replace("{examplePayment}", Math.round(spanSpanPayment_hard*(7.75/10)*100)/100)}</p>
        <p>${language.instructionsSpanSpanPayment.remember.replace("{theBlueDigits}", theBlueDigits)}</p>
        <p>${language.instructionsSpanSpanPayment.clickNext}</p>`
    ];


    },
    show_clickable_nav: true,
    button_label_next: language.button.next,
    button_label_previous: language.button.previous,
    allow_backward: true,
}

const instructionsSpanMPLMirror = {
    type: "instructions",
    pages: function(){

        return [`<h2>${language.instructionsThirdPart.title}</h2>
        <p>${language.instructionsThirdPart.description}</p>
        <p>${language.instructionsThirdPart.freqMPL.replace('{frequency}', propSelecForMPL)}</p>
        <p>${language.instructionsThirdPart.clickNext}</p>`,
               `<h2>${language.instructionsDecisionTable.title}</h2>
        <h3>${language.instructionsBoxesWithMoney.subTitle}</h3>
        <p>${language.instructionsBoxesWithMoney.initialSum}</p>
        <p>${language.instructionsBoxesWithMoney.chooseSet}</p>
        ${generateHTML("Lot A", "Lot B")}
        <p>${language.instructionsBoxesWithMoney.choice}</p>
        <p>${language.instructionsBoxesWithMoney.moneyInside}</p>
        <p>${language.instructionsBoxesWithMoney.clickNext}</p>`,
        `<h2>${language.instructionsDecisionTable.title}</h2>
        <h3>${language.instructionsDecisionTable.subTitle}</h3>
        <p>${language.instructionsDecisionTable.description}</p>
        ${example1MPL.replace('width: 50vw; margin: auto;', 'width: 100%; margin: 0;')}
        <p>${language.instructionsDecisionTable.exampleAbove}</p>
        <p>${language.instructionsDecisionTable.exampleBelow}</p>
        ${example2MPL.replace('width: 50vw; margin: auto;', 'width: 100%; margin: 0;')}
        <p>${language.instructionsDecisionTable.clickToChoose}</p>
        ${example1MPLSelected.replace('width: 50vw; margin: auto;', 'width: 100%; margin: 0;')}
        <p>${language.instructionsDecisionTable.clickNext}</p>`,
        `<h2>${language.instructionsPaymentRuleMirror.title}</h2>
        <h3>${language.instructionsPaymentRuleMirror.subTitle}</h3>
        <p>${language.instructionsPaymentRuleMirror.paymentRule}</p>
        <br>
        <p>${language.instructionsPaymentRuleMirror.example1}</p>
        ${example1MPLSelected.replace('width: 50vw; margin: auto;', 'width: 100%; margin: 0;')}
        <p>${language.instructionsPaymentRuleMirror.example1Payment}</p>
        <br>
        <p>${language.instructionsPaymentRuleMirror.example2}</p>
        ${example3MPLSelected.replace('width: 50vw; margin: auto;', 'width: 100%; margin: 0;')}
        <p>${language.instructionsPaymentRuleMirror.example2Payment}</p>
        <p>${language.instructionsPaymentRuleMirror.clickNext}</p>
        `
    //         <p>${language.instructionsPaymentRuleMirror.remindNotEveryone.replace('{frequency}', propSelecForMPL)}</p>

    ];
    },
    show_clickable_nav: true,
    button_label_next: language.button.next,
    button_label_previous: language.button.previous,
    allow_backward: true,
}
const instructionsSpanMPLLottery = {
    type: "instructions",
    pages: function(){

        return [`<h2>${language.instructionsThirdPart.title}</h2>
        <p>${language.instructionsThirdPart.description}</p>
        <p>${language.instructionsThirdPart.freqMPL.replace('{frequency}', propSelecForMPL)}</p>
        <p>${language.instructionsThirdPart.clickNext}</p>`,
        `<h2>${language.instructionsDecisionTable.title}</h2>
        <h3>${language.instructionsBoxesWithMoney.subTitle}</h3>
        <p>${language.instructionsBoxesWithMoney.initialSum}</p>
        <p>${language.instructionsBoxesWithMoney.chooseSet}</p>
        ${generateHTML("Lot A", "Lot B")}
        <p>${language.instructionsBoxesWithMoney.choice}</p>
        <p>${language.instructionsBoxesWithMoney.moneyInside}</p>
        <p>${language.instructionsBoxesWithMoney.clickNext}</p>`,
        `<h2>${language.instructionsDecisionTable.title}</h2>
        <h3>${language.instructionsDecisionTable.subTitle}</h3>
        <p>${language.instructionsDecisionTable.description}</p>
        ${example1MPL.replace('width: 50vw; margin: auto;', 'width: 100%; margin: 0;')}
        <p>${language.instructionsDecisionTable.exampleAbove}</p>
        <p>${language.instructionsDecisionTable.exampleBelow}</p>
        ${example2MPL.replace('width: 50vw; margin: auto;', 'width: 100%; margin: 0;')}
        <p>${language.instructionsDecisionTable.clickToChoose}</p>
        ${example1MPLSelected.replace('width: 50vw; margin: auto;', 'width: 100%; margin: 0;')}
        <p>${language.instructionsDecisionTable.clickNext}</p>`,
        `<h2>${language.instructionsPaymentRuleRandomBox.title}</h2>
        <h3>${language.instructionsPaymentRuleRandomBox.subTitle}</h3>
        <p>${language.instructionsPaymentRuleRandomBox.paymentRule}</p>
        <br>
        <p>${language.instructionsPaymentRuleRandomBox.example1}</p>
        ${example1MPLSelected.replace('width: 50vw; margin: auto;', 'width: 100%; margin: 0;')}
        <p>${language.instructionsPaymentRuleRandomBox.example1Payment}</p>
        <br>
        <p>${language.instructionsPaymentRuleRandomBox.example2}</p>
        ${example3MPLSelected.replace('width: 50vw; margin: auto;', 'width: 100%; margin: 0;')}
        <p>${language.instructionsPaymentRuleRandomBox.example2Payment}</p>
        <p>${language.instructionsPaymentRuleRandomBox.clickNext}</p>`,
        //         <p>${language.instructionsPaymentRuleRandomBox.remindNotEveryone.replace('{frequency}', propSelecForMPL)}</p>

    ];

    },
    show_clickable_nav: true,
    button_label_next: language.button.next,
    button_label_previous: language.button.previous,
    allow_backward: true,
};

const instructionsPaymentRuleLottery = {
    type: "instructions",
    pages: function(){

        return [`<h2>${language.instructionsPaymentRuleRandomBox.title}</h2>
        <h3>${language.instructionsPaymentRuleRandomBox.subTitle}</h3>
        <p>${language.instructionsPaymentRuleRandomBox.paymentRule}</p>
        <br>
        <p>${language.instructionsPaymentRuleRandomBox.example1}</p>
        ${example1MPLSelected.replace('width: 50vw; margin: auto;', 'width: 100%; margin: 0;')}
        <p>${language.instructionsPaymentRuleRandomBox.example1Payment}</p>
        <br>
        <p>${language.instructionsPaymentRuleRandomBox.example2}</p>
        ${example3MPLSelected.replace('width: 50vw; margin: auto;', 'width: 100%; margin: 0;')}
        <p>${language.instructionsPaymentRuleRandomBox.example2Payment}</p>
        <p>${language.instructionsPaymentRuleRandomBox.clickNext}</p>`,
    ];
    },
    show_clickable_nav: true,
    button_label_next: language.button.next,
    button_label_previous: language.button.previous,
    allow_backward: true,
};
const instructionsPaymentRuleMirror = {
    type: "instructions",
    pages: function(){

        return [`<h2>${language.instructionsPaymentRuleMirror.title}</h2>
        <h3>${language.instructionsPaymentRuleMirror.subTitle}</h3>
        <p>${language.instructionsPaymentRuleMirror.paymentRule}</p>
        <br>
        <p>${language.instructionsPaymentRuleMirror.example1}</p>
        ${example1MPLSelected.replace('width: 50vw; margin: auto;', 'width: 100%; margin: 0;')}
        <p>${language.instructionsPaymentRuleMirror.example1Payment}</p>
        <br>
        <p>${language.instructionsPaymentRuleMirror.example2}</p>
        ${example3MPLSelected.replace('width: 50vw; margin: auto;', 'width: 100%; margin: 0;')}
        <p>${language.instructionsPaymentRuleMirror.example2Payment}</p>
        <p>${language.instructionsPaymentRuleMirror.clickNext}</p>`]
    },
    show_clickable_nav: true,
    button_label_next: language.button.next,
    button_label_previous: language.button.previous,
    allow_backward: true,
}
const instructionsChoosingASetOfBoxes = {
    type: "instructions",
    pages: function(){
        if (treatment === "hard") {bonusSpan = spanMplPayment_hard}
        else {bonusSpan = spanMplPayment_easy}

        return [`<h2>${language.instructionsChoosingASetOfBoxes.title}</h2>
        <br>
         <h3>${language.instructionsChoosingASetOfBoxes.subTitle}</h3>
        <p>${language.instructionsChoosingASetOfBoxes.description}</p>
        <p>${language.instructionsChoosingASetOfBoxes.example1}</p>
        ${example5MPL.replace('width: 50vw; margin: auto;', 'width: 100%; margin: 0;')}
        <p>${language.instructionsChoosingASetOfBoxes.chooseSet}</p>
        ${example5MPLSelected.replace('width: 50vw; margin: auto;', 'width: 100%; margin: 0;')}
        <p>${language.instructionsChoosingASetOfBoxes.example2}</p>
        <p>${language.instructionsChoosingASetOfBoxes.computerOnlyOneChoice}</p>
        <br>
        <h3>${language.instructionsChoosingASetOfBoxes.severalTables}</h3>
        <p>${language.instructionsChoosingASetOfBoxes.severalTablesDescription}</p>
        <p>${language.instructionsChoosingASetOfBoxes.incentivesMPL}</p>
        <br>
        <p>${language.instructionsChoosingASetOfBoxes.clickNext}</p>`,
        ]
    },
    show_clickable_nav: true,
    button_label_next: language.button.next,
    button_label_previous: language.button.previous,
    allow_backward: true,
}

const instructionsIncentivesSpanMPL= {
    type: "instructions",
    pages: function(){
        if (treatment === "hard") {bonusSpan = spanMplPayment_hard}
        else {bonusSpan = spanMplPayment_easy}

        return [
        `<h2>${language.instructionsSpanInMPL.title}</h2>
        <br>
        <h3>${language.instructionsSpanInMPL.subTitle}</h3>
        <p>${language.instructionsSpanInMPL.MPLInSpan}</p>
        <p>${language.instructionsSpanInMPL.lettersOrder}</p>
        <p>${language.instructionsSpanInMPL.MPLInSpanRepeat}</p>
            <br>
        <h3>${language.instructionsSpanInMPL.incentives}</h3>
        <p>${language.instructionsSpanInMPL.incentivesSpan.replace("{bonusSpan}", bonusSpan)}</p>
        <p>${language.instructionsSpanInMPL.incentivesSpanDetails}</p>
        <p>${language.instructionsSpanInMPL.incentiveSpanExample.replace("{bonusSpan}", bonusSpan).replace("{examplePaymentSpan}", Math.round((bonusSpan * 0.8)*100)/100)}</p>
        <p>${language.instructionsSpanInMPL.randomMechanism}</p>
        <p>${language.instructionsSpanInMPL.priority}</p>
        <br>
        <p>${language.instructionsSpanInMPL.clickNext}</p> `
        ]
    },
    show_clickable_nav: true,
    button_label_next: language.button.next,
    button_label_previous: language.button.previous,
    allow_backward: true,
}
const introductionFinalExampleSpanMPL = {
    type: "instructions",
    pages: function(){
        return [`<h2>${language.introductionFinalExampleSpanMPL.title}</h2>
        <p>${language.introductionFinalExampleSpanMPL.description}</p>
        `
        ]
    },
    show_clickable_nav: true,
    button_label_next: language.button.next,
    button_label_previous: language.button.previous,
    allow_backward: true,
}

let correct_responses =[];


const comprehensionQuestionsMPLLottery = {
    type: "survey-multi-select",
    data: {task: 'comprehensionSurveyMPLLottery'},
    questions: [
        {
            prompt: `${example6MPLSelected.replace('width: 50vw; margin: auto;', 'width: 100%; margin: 0;')}
            <p>${language.comprehensionQMPL.q1.prompt}</p>`,
            options: [
                language.comprehensionQMPL.q1.options[0],
                language.comprehensionQMPL.q1.options[1],
                language.comprehensionQMPL.q1.options[2],
                language.comprehensionQMPL.q1.options[3]
            ],
            required: true,
            correct_response: 3,
        },
        {
            prompt: language.comprehensionQMPL.q2.prompt,
            options: [
                language.comprehensionQMPL.q2.options[0],
                language.comprehensionQMPL.q2.options[1],
                language.comprehensionQMPL.q2.options[2],
                language.comprehensionQMPL.q2.options[3]
            ],
            required: true,
            correct_response: 1,
        },
        {
            prompt: language.comprehensionQMPL.q3.prompt,
            options: [
                language.comprehensionQMPL.q3.options[0],
                language.comprehensionQMPL.q3.options[1],
                language.comprehensionQMPL.q3.options[2],
                language.comprehensionQMPL.q3.options[3]
            ],
            required: true,
            correct_response: 3,
        },
        {
            prompt: language.comprehensionQMPL.q4.prompt,
            options: [
                language.comprehensionQMPL.q4.options[0],
                language.comprehensionQMPL.q4.options[1],
                language.comprehensionQMPL.q4.options[2],
                language.comprehensionQMPL.q4.options[3]
            ],
            required: true,
            correct_response: 1,
        },
        {
            prompt: `<br><br>${example7MPLSelected.replace('width: 50vw; margin: auto;', 'width: 100%; margin: 0;')}
            <p>${language.comprehensionQMPL.q5.prompt}</p>`,
            options: [
                language.comprehensionQMPL.q5.options[0],
                language.comprehensionQMPL.q5.options[1],
                language.comprehensionQMPL.q5.options[2],
                language.comprehensionQMPL.q5.options[3]
            ],
            required: true,
            correct_response: 3,
        },
    ],
    button_label: language.button.next,
    randomize_question_order : false,
    preamble: `
    <div style="position: fixed; top: 10px; right: 10px; z-index: 1000;">
    <button type="button" id="help-button-comprehension" style="padding: 16px 34px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 18px;">
        ${language.button.help || "Help"}
    </button>
    </div>
    <h2>${language.comprehensionMPLIntro}</h2>
    <h3>${language.comprehensionMPLExplanation.replace('{notUnderstoodPayment}', Math.round(notUnderstoodPayment*100)/100).replace('{buttonHelp}', language.button.help)}</h3>
    <br><br>`,
    on_finish: function (data) {
        const responses = JSON.parse(data.responses);
        
        let all_correct = true;
        let questions_correct = []; // Array to track which questions were correct
        let questions_incorrect = []; // Array to track which questions were incorrect
        let detailed_results = {}; // Object to store detailed results for each question

        comprehensionQuestionsMPLLottery.questions.forEach((q, i) => {
            const given_answer = responses["Q" + i];
            const correct_text = q.options[q.correct_response-1]; // correct text (1-based index)
            const is_correct = given_answer == correct_text;
            
            // Track results
            if (is_correct) {
                questions_correct.push(i + 1); // Store 1-based question numbers
            } else {
                questions_incorrect.push(i + 1);
                all_correct = false;
            }
            
            // Store detailed results
            detailed_results[`q${i + 1}`] = {
                question_number: i + 1,
                given_answer: given_answer,
                correct_answer: correct_text,
                is_correct: is_correct,
                correct_option_index: q.correct_response - 1 // 0-based index
            };
            
            console.log(`Question ${i + 1}: Given="${given_answer}", Correct="${correct_text}", Is Correct=${is_correct}`);
        });

        // Save comprehensive results to trial data
        data.all_correct = all_correct;
        data.questions_correct = questions_correct;
        data.questions_incorrect = questions_incorrect;
        data.num_correct = questions_correct.length;
        data.num_incorrect = questions_incorrect.length;
        data.detailed_results = detailed_results;
        
        console.log(`MPL Comprehension Results: ${questions_correct.length}/${comprehensionQuestionsMPLLottery.questions.length} correct`);
        console.log("Questions answered correctly:", questions_correct);
        console.log("Questions answered incorrectly:", questions_incorrect);
        console.log("All correct:", all_correct);
    },
    on_load: function() {
                // Set statusMPL for the help modal
        
        // Add click handler for help button
        const helpButton = document.getElementById('help-button-comprehension');
        if (helpButton) {
        helpButton.addEventListener('click', function(e) {
                e.preventDefault(); // Prevent any default behavior

                // Check if modal is already open
                if (!document.getElementById('instruction-modal')) {
                    showInstructionModalForQuestions("lottery");
                }
            });
        }
}
};

const comprehensionQuestionsMPLMirror = {
    ...comprehensionQuestionsMPLLottery,
    data: {task: 'comprehensionSurveyMPLMirror'},
        questions: [
        {
            prompt: `${example6MPLSelected.replace('width: 50vw; margin: auto;', 'width: 100%; margin: 0;')}
            <p>${language.comprehensionQMPL.q1.prompt}</p>`,
            options: [
                language.comprehensionQMPL.q1.options[0],
                language.comprehensionQMPL.q1.options[1],
                language.comprehensionQMPL.q1.options[2],
                language.comprehensionQMPL.q1.options[3]
            ],
            required: true,
            correct_response: 1,
        },
        {
            prompt: language.comprehensionQMPL.q2.prompt,
            options: [
                language.comprehensionQMPL.q2.options[0],
                language.comprehensionQMPL.q2.options[1],
                language.comprehensionQMPL.q2.options[2],
                language.comprehensionQMPL.q2.options[3]
            ],
            required: true,
            correct_response: 1,
        },
        {
            prompt: language.comprehensionQMPL.q3.prompt,
            options: [
                language.comprehensionQMPL.q3.options[0],
                language.comprehensionQMPL.q3.options[1],
                language.comprehensionQMPL.q3.options[2],
                language.comprehensionQMPL.q3.options[3]
            ],
            required: true,
            correct_response: 1,
        },
        {
            prompt: language.comprehensionQMPL.q4.prompt,
            options: [
                language.comprehensionQMPL.q4.options[0],
                language.comprehensionQMPL.q4.options[1],
                language.comprehensionQMPL.q4.options[2],
                language.comprehensionQMPL.q4.options[3]
            ],
            required: true,
            correct_response: 4,
        },
        {
            prompt: `<br><br>${example7MPLSelected.replace('width: 50vw; margin: auto;', 'width: 100%; margin: 0;')}
            <p>${language.comprehensionQMPL.q5.prompt}</p>`,
            options: [
                language.comprehensionQMPL.q5.options[0],
                language.comprehensionQMPL.q5.options[1],
                language.comprehensionQMPL.q5.options[2],
                language.comprehensionQMPL.q5.options[3]
            ],
            required: true,
            correct_response: 3,
        },

    ],

    button_label: language.button.next,
    randomize_question_order : false,
    preamble: `
    <div style="position: fixed; top: 10px; right: 10px; z-index: 1000;">
    <button type="button" id="help-button-comprehension" style="padding: 16px 34px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 18px;">
        ${language.button.help || "Help"}
    </button>
    </div>
    <h2>${language.comprehensionMPLIntro}</h2>
    <h3>${language.comprehensionMPLExplanation.replace('{notUnderstoodPayment}', Math.round(notUnderstoodPayment*100)/100).replace('{buttonHelp}', language.button.help)}</h3>
    <br><br>`,
    on_finish: function (data) {
        const responses = JSON.parse(data.responses);
        
        let all_correct = true;
        let questions_correct = []; // Array to track which questions were correct
        let questions_incorrect = []; // Array to track which questions were incorrect
        let detailed_results = {}; // Object to store detailed results for each question

        comprehensionQuestionsMPLMirror.questions.forEach((q, i) => {
            const given_answer = responses["Q" + i];
            const correct_text = q.options[q.correct_response-1]; // correct text (1-based index)
            const is_correct = given_answer == correct_text;
            
            // Track results
            if (is_correct) {
                questions_correct.push(i + 1); // Store 1-based question numbers
            } else {
                questions_incorrect.push(i + 1);
                all_correct = false;
            }
            
            // Store detailed results
            detailed_results[`q${i + 1}`] = {
                question_number: i + 1,
                given_answer: given_answer,
                correct_answer: correct_text,
                is_correct: is_correct,
                correct_option_index: q.correct_response - 1 // 0-based index
            };
            
            console.log(`Question ${i + 1}: Given="${given_answer}", Correct="${correct_text}", Is Correct=${is_correct}`);
        });

        // Save comprehensive results to trial data
        data.all_correct = all_correct;
        data.questions_correct = questions_correct;
        data.questions_incorrect = questions_incorrect;
        data.num_correct = questions_correct.length;
        data.num_incorrect = questions_incorrect.length;
        data.detailed_results = detailed_results;
        
        console.log(`MPL Comprehension Results: ${questions_correct.length}/${comprehensionQuestionsMPLMirror.questions.length} correct`);
        console.log("Questions answered correctly:", questions_correct);
        console.log("Questions answered incorrectly:", questions_incorrect);
        console.log("All correct:", all_correct);
    },
    on_load: function() {
        // Add click handler for help button
        const helpButton = document.getElementById('help-button-comprehension');
        if (helpButton) {
        helpButton.addEventListener('click', function(e) {
                e.preventDefault(); // Prevent any default behavior

                // Check if modal is already open
                if (!document.getElementById('instruction-modal')) {
                    showInstructionModalForQuestions("mirror"); // or "lottery"
                }
            });
        }
}
}

const comprehensionFailureTrial = {
    type: "html-keyboard-response",
    choices: ['Enter'],
    stimulus: function() {
        
        return `
            <h2>${language.comprehensionFailure.title}</h2>
            <p>${language.comprehensionFailure.description.replace('{notUnderstoodPayment}', Math.round(notUnderstoodPayment*100)/100).replace('{actual_payment_calibration}', Math.round(actual_payment_calibration*100)/100).replace('{actual_payment_span_span}', Math.round(actual_payment_span_span*100)/100)}</p>
            <p>${language.comprehensionFailure.thanks}</p>
            <p>${language.comprehensionFailure.clickNext}</p>
        </div>`;
    },
    on_start: function(trial) {
        console.log("notUnderstoodPayment is", notUnderstoodPayment);
        console.log("actual_payment_calibration is", actual_payment_calibration);
        console.log("actual_payment_span_span is", actual_payment_span_span);
        console.log("total payment is", Math.min(notUnderstoodPayment + actual_payment_calibration + actual_payment_span_span, 6.25));
        
        // Add data to trial object instead of data parameter
        trial.data = trial.data || {};
        trial.data.totalPayment = Math.min(notUnderstoodPayment + actual_payment_calibration + actual_payment_span_span, 6.25);
        trial.data.versionFirst = block_order_indicator_span_MPL;
        trial.data.treatment = treatment;
        trial.data.helpPageCounter = helpPageCounter;
        trial.data.totalBonus = Math.min(actual_payment_calibration + actual_payment_span_span, 1.25) ;
        trial.data.payment_span_span = actual_payment_span_span;
        trial.data.payment_calibration = actual_payment_calibration;
        trial.data.task = 'comprehensionFailure';
    },
    on_finish: function() {
        // End the experiment
        //jsPsych.data.get().localSave("csv", `span_Subject_${subjectId}_${level}back_output.csv`);
        jatos.endStudy(jsPsych.data.get().json());
    }
};

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

// const temporary = {
//     // `<div style="max-width: 1200px">
//     type: "instructions",
//     pages: [
//         `<h2>${language.feedbackExampleSpanMPLTemporary.title}</h2>
//         <p>${language.feedbackExampleSpanMPLTemporary.description}</p>
//         <p>${language.feedbackExampleSpanMPLTemporary.paymentSpan}</p>
//         <p>${language.feedbackExampleSpanMPLTemporary.paymentMPL}</p>
//         <div class="important-note">    
//         <p>${language.feedbackExampleSpanMPLTemporary.remind}</p>
//         </div>
//         <p>${language.feedbackExampleSpanMPLTemporary.instructionReminder}</p>
//         <p>${language.feedbackExampleSpanMPLTemporary.clickNext}</p>
//         </div>`
//     ],
//     show_clickable_nav: true,
//     button_label_next: language.button.next,
//     button_label_previous: language.button.previous,
// }

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
const loopAgainSpanMpl = {
    type: "instructions",
    pages: [
        `<div style="max-width: 1200px"> <p>${language.loopAgainSpanMpl.failed}</p>
        <p>${language.loopAgainSpanMpl.surveyAgain}</p>
        <p>${language.loopAgainSpanMpl.readInstructions}</p>
        <p>${language.loopAgainSpanMpl.clickNext}</p>
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
const afterPracticeEasy = {... trialStructure, 
    stimulus: `<h2>${language.practice.end}</h2><p>${taskEasy.remember1}</p><p>${taskEasy.remember2}</p><p>${taskEasy.press}<p>`,
    on_start: function() {
        passPractice = 0;
        practiceIndex = 0;
    }
};
const afterPracticeHard = {... trialStructure, 
    stimulus: `<h2>${language.practice.end}</h2><p>${taskHard.remember1}</p><p>${taskHard.remember2}</p><p>${taskHard.press}<p>`,
    on_start: function() {
        passPractice = 0;
        practiceIndex = 0;
    }
};



/*create n-back variables*/

setArrays()

defineEasyBack()
assignRandomStimuli1back()

if (level === 2) {
    defineHard2Back(); 
    assignRandomStimuli2back();
} else if (level === 3) {
    defineHard3Back();
    assignRandomStimuli3back();
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
createBlocks(nbackStimuli.stimuliListEasy_span, nbackStimuli.stimuliEasy_span, 1)

// createBlocks(nbackStimuli.practiceListHard_nback, nbackStimuli.stimuliPracticeHard_nback, level)
// createBlocks(nbackStimuli.practiceListEasy_nback, nbackStimuli.stimuliPracticeEasy_nback, 1)
createBlocks(nbackStimuli.stimuliListHard_nback, nbackStimuli.stimuliHard_nback, level)
createBlocks(nbackStimuli.stimuliListEasy_nback, nbackStimuli.stimuliEasy_nback, 1)

createBlocks(nbackStimuli.stimuliListHardOverallTraining, nbackStimuli.stimuliHardOverallTraining, level)
createBlocks(nbackStimuli.stimuliListEasyOverallTraining, nbackStimuli.stimuliEasyOverallTraining, 1)

for (let i=0; i<possibleStimuliList_practice1back.length; i++) {
    if (!nbackStimuli.stimuliPracticeEasy_nback[i]) {
        nbackStimuli.stimuliPracticeEasy_nback[i] = []; // Initialize if undefined
    }
    if (!nbackStimuli.stimuliPracticeHard_nback[i]) {
        nbackStimuli.stimuliPracticeHard_nback[i] = []; // Initialize if undefined
    }
createBlocks(nbackStimuli.practiceListEasy_nback[i], nbackStimuli.stimuliPracticeEasy_nback[i], 1)
createBlocks(nbackStimuli.practiceListHard_nback[i], nbackStimuli.stimuliPracticeHard_nback[i], level)
}


/* define timeline_variables for each visual nback (target task)*/
assignRandomStimuliVisual();
for (let i=0; i<stimuliList_nbackVisual_practice.length; i++) {
    if (!stimuli_nbackVisual_practice[i]) {
        stimuli_nbackVisual_practice[i] = []; // Initialize if undefined
    }
createBlocksVisual(stimuliList_nbackVisual_practice[i], stimuli_nbackVisual_practice[i], 2)
}
createBlocksVisual(stimuliList_nbackVisualOverallPractice, stimuli_nbackVisual_overall_training, 2)
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
console.log(stimuli_nback_1, "is stimuli_nback_1")



var response_grid =
'<div class = numbox>' +
//'<p>What were the numbers <b>in order</b>?<br>(When you are ready to lock in your answer, press ENTER)</p>' +
'<p>{instructions}</p>' +
'<button id = button_1 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>1</div></div></button>' +
'<button id = button_2 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>2</div></div></button>' +
'<button id = button_3 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>3</div></div></button>' +
'<button id = button_4 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>4</div></div></button>' +
'<button id = button_5 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>5</div></div></button>' +
'<button id = button_6 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>6</div></div></button>' +
'<button id = button_7 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>7</div></div></button>' +
'<button id = button_8 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>8</div></div></button>' +
'<button id = button_9 class = "square num-button" onclick = "recordClick(this)"><div class = content><div class = numbers>9</div></div></button>' +
`<button class = clear_button id = "ClearButton" onclick = "clearResponse()">${language.responseGrid.clear}</button>`+
`<p><u><b>${language.responseGrid.currentAnswer}:</b></u></p><div id=echoed_txt style="font-size: 30px; color:#ff8000;"><b></b></div></div>`


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

const feedbackRemindBeforeHard = { 
  ... feedbackCorrect,
  trial_duration: remindDuration,
  stimulus: `<p>${language.overallTrainingFeedback.remindBeforeHard}</p>`
}

const feedbackRemindBeforeEasy = { 
  ... feedbackCorrect,
  trial_duration: remindDuration,
  stimulus: `<p>${language.overallTrainingFeedback.remindBefore1Back}</p>` 
}
const feedbackRemindAfterHard0 = { 
  ... feedbackCorrect,
  trial_duration: remindDuration,
  stimulus: `<p>${remindAfterHard[0]}</p>` 
}
const feedbackRemindAfterHard1 = { 
  ... feedbackCorrect,
  trial_duration: remindDuration,
  stimulus: `<p>${remindAfterHard[1]}</p>` 
}
const feedbackRemindAfterHard2 = { 
  ... feedbackCorrect,
  trial_duration: remindDuration,
  stimulus: function (){
    if (level == 3) {
      return `<p>${remindAfterHard[2]}</p>` 
    }
    else return `error : level should be 3`
  }
}
const feedbackRemindAfterEasy = { 
  ... feedbackCorrect,
  trial_duration: remindDuration,
  stimulus: `<p>${language.overallTrainingFeedback.remindAfter1Back}</p>` 
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
    data: jsPsych.timelineVariable('data'),
//   stimulus: jsPsych.timelineVariable('stimulus'),
  stimulus: function() {
    return jsPsych.timelineVariable('stimulus', true);
  // Below is the code to make last stimuli appear in pink
    // const baseStimulus = jsPsych.timelineVariable('stimulus', true);
    // let data = jsPsych.timelineVariable('data', true);
    // // Check if generalNbackCounter is odd
    // let shouldShowRed = false;
    // let positionInBlock = data.trial_number % 10; // Position within each 10-trial block
    // if (data.block === "main_easy" || data.block === "main_hard") {
    //   if (data.level == 3 && (positionInBlock == 8 || positionInBlock == 9 || positionInBlock == 0)) {
    //     shouldShowRed = true;
    //   } else if ((data.level == 2 || data.level == 3) && (positionInBlock == 9 || positionInBlock == 0)) {
    //     shouldShowRed = true;
    //   } else if ((data.level == 1 || data.level == 2 || data.level == 3) && positionInBlock == 0) {
    //     shouldShowRed = true;
    //   }
    // }
    // else if (data.block === "overall_training_hard" || data.block === "overall_training_easy") {
    //   if (data.level == 3 && (data.trial_number == 8 || data.trial_number == 9 || data.trial_number == 10)) {
    //     shouldShowRed = true;
    //     console.log("shouldShowRed is true for level 3 overall training")
    //   }
    //   else if ((data.level == 2 || data.level == 3) && (data.trial_number == 9 || data.trial_number == 10 )) {
    //     shouldShowRed = true;
    //     console.log("shouldShowRed is true for level 2 overall training")
    //   }
    //   else if ((data.level == 1 || data.level == 2 || data.level == 3) && data.trial_number == 10 ) {
    //     shouldShowRed = true;
    //     console.log("shouldShowRed is true for level 1 overall training")
    //   }
    // };
    // return shouldShowRed ? 
    //   baseStimulus.replace("class='stimulus'", "class='stimulus' style='color: #F016DF;'") : 
    //   baseStimulus;
  },
  choices: buttonToPressForTarget,
  response_ends_trial: false,
  trial_duration: letterDuration,
  stimulus_duration: letterDuration,
  on_finish: function(data){
    if ((data.task == "nback") && (data.block == "main_easy" || data.block == "main_hard" || data.block == "practice_easy" || data.block == "practice_hard" || data.block =='overall_training_hard' || data.block =='overall_training_easy')){
    nbackCounter ++};
    if ((data.task == "nback") && (data.block == "practice_easy" || data.block == "practice_hard" || data.block == 'nbackVisual_practice')){
    practiceNbackCounter ++;
    data.practiceNbackCounter = practiceNbackCounter;
    console.log(practiceNbackCounter, "is practiceNbackCounter")
    }
    if ((data.task == "nback" || data.task =="nbackVisual") && (data.block == "main_easy" || data.block == "main_hard")){
    mainNbackCounter ++ ;
    data.mainNbackCounter = mainNbackCounter;
    console.log(mainNbackCounter, "is mainNbackCounter")
    };
    if (data.task == "nbackVisual" && (data.block == "main_easy" || data.block == "main_hard")){
    nbackVisualCounter ++ ;
    data.nbackVisualCounter = nbackVisualCounter;
    }
    if (data.task == "nbackVisual"){
        pc = 0;
    }
    if (data.task == "nback"){
        pc ++;
        if (data.level == 1 && pc == 1){
            isPostVisualWithFirsts = 1
        }
        else if (data.level == 2 && (pc == 1 || pc == 2)){
            isPostVisualWithFirsts = 1
        }
        else if (data.level == 3 && (pc == 1 || pc == 2 || pc == 3)){
            isPostVisualWithFirsts = 1
        }
        else {
            isPostVisualWithFirsts = 0;
        }
    }
    data.isPostVisualWithFirsts = isPostVisualWithFirsts;
    data.pc = pc;
    console.log(pc, "is pc")
    console.log(isPostVisualWithFirsts, "is isPostVisualWithFirsts")
    
    console.log(nbackVisualCounter, "is nbackVisualCounter")
    generalNbackCounter ++ ;
    data.generalNbackCounter = generalNbackCounter;

    // data.task = 'n-back';
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
    console.log(generalNbackCounter, "is generalNbackCounter at the end of the nback trial")
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
const passPracAndPracIndReset = {
    ... trialStructure,
    stimulus: "",
    trial_duration:0,
    on_start: function () {
        console.log("passPracAndPracIndReset function starting, passPractice and practiceIndex reset to 0")
        passPractice = 0;
        practiceIndex = 0;
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
    // question 5: college major
    qs.push({
        prompt: language.demographics.questions[5],
        options: language.demographics.options.collegeDegree.slice(),
        required: true
    });
    // question 6: college course
    qs.push({
        prompt: language.demographics.questions[6],
        options: language.demographics.options.collegeCourse.slice(),
        required: true
    });
    // question 7: life satisfaction
    qs.push({
        prompt: language.demographics.questions[7],
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

const feedbackPracticeBlockAgain = {
    type: 'html-button-response',
    stimulus:"",
    on_start: function(trial) {
        practiceIndex++;
        // console.log(nbackStimuli.stimuliPracticeHard_nback[0].length, "is nbackStimuli.stimuliPracticeHard_nback[0].length")
        // console.log(jsPsych.data.get().last(2).values()[0], "is jsPsych.data.get().last(2).values()[0]")
        console.log(
            jsPsych.data.get().filterCustom(function(trial) {
                return trial.block === 'practice_easy' || trial.block === 'practice_hard' || trial.block === 'nbackVisual_practice';
            }).last(15).values()[0], 
            "are the 15 last trials from practice_easy or practice_hard blocks"
        );
        console.log(
            jsPsych.data.get().filterCustom(function(trial) {
                return trial.block === 'practice_easy' || trial.block === 'practice_hard'|| trial.block === 'nbackVisual_practice';
            }).values()[0], 
            "is the last trial from practice_easy or practice_hard blocks"
        );
        let allTrials = jsPsych.data.get().values();
        console.log(allTrials, "is allTrials")
        let practiceTrials = allTrials.filter(trial => 
            (trial.block === 'practice_easy' || trial.block === 'practice_hard'|| trial.block === 'nbackVisual_practice') && 
            (trial.task === 'nback' || trial.task === 'nbackVisual')
        );
        console.log(practiceTrials, "is practiceTrials")
        // Take last 15 trials or all available
        let blockSize = Math.min(15, practiceTrials.length);
        let recentTrials = practiceTrials.slice(-blockSize);
        console.log(recentTrials, "is recentTrials. Check if they are the last or the fist trials")

        let correctCount = recentTrials.filter(trial => 
        trial.hit === 1 || trial.correct_rejection === 1
        ).length;
        let accuracy = correctCount / recentTrials.length;
        console.log(trial, "is the trial data on feedbackPracticeBlockAgain");
        trial.data = trial.data || {};
        trial.data.accuracy = accuracy;
        trial.data.passPractice = passPractice;
        trial.data.practiceIndex = practiceIndex;
        console.log(accuracy, "is accuracy on feedbackPracticeBlockAgain");
        console.log(passPractice, "is passPractice on feedbackPracticeBlockAgain");
        console.log(practiceIndex, "is practiceIndex on feedbackPracticeBlockAgain");

        let html;
        if (accuracy >= 0.8){
            passPractice ++;
            if (passPractice == 1){
            html =`
                <p>${language.feedbackPracticeBlock.yourPerformance.replace('{accuracy}', Math.round(accuracy * 100))}</p>
                <p>${language.feedbackPracticeBlock.firstAchieved}</p>
                <p>${language.feedbackPracticeBlock.firstAchievedClickNext}</p>`
            }
            else if (passPractice == 2){
            html =`
                <p>${language.feedbackPracticeBlock.yourPerformance.replace('{accuracy}', Math.round(accuracy * 100))}</p>
                <p>${language.feedbackPracticeBlock.achievedMessage}</p>
                <p>${language.feedbackPracticeBlock.achievedClickNext}</p>`
            }
        }
        else if(accuracy <= 0.8){
            passPractice = 0;
            html = `
                <p>${language.feedbackPracticeBlock.yourPerformance.replace('{accuracy}', Math.round(accuracy * 100))}</p>
                <p>${language.feedbackPracticeBlock.rules}</p>
                <p>${language.feedbackPracticeBlock.notAchievedClickNext}</p>`
        }
        else {
            html = `<p>error</p>`
        }
        trial.stimulus = html;
        // passPractice and practiceIndex are reseted to 0 in the afterTraining trials, or in the passPracAndPracIndReset trial
    },
    choices: [language.button.next],
    on_finish: function(data) {
        console.log(data.accuracy, "is accuracy on feedbackPracticeBlockAgain at the end of the trial");
    }
};

const experimentStopTrial = {
    type: 'html-button-response',
    stimulus: function() {
        return `<div style="max-width: 1200px">
            <h2>${language.experimentStop?.title || "Practice Session Completed"}</h2>
            <p>${language.experimentStop?.message || "Unfortunately, you were unable to achieve the required accuracy of 80% in two consecutive practice blocks after multiple attempts."}</p>
            <p>${language.experimentStop?.explanation || "This indicates that the task may be too difficult for you at this level. The experiment will now end."}</p>
            <p>${language.experimentStop?.thankYou || "Thank you for your participation and effort."}</p>
            <p>${language.experimentStop?.contact || "If you have any questions, please contact the research team."}</p>
        </div>`;
    },
    choices: [language.button?.finish || "Finish Experiment"],
    on_finish: function() {
        // End the experiment here
        console.log("Experiment ended due to practice failure");
        // You can redirect to a completion page or end JATOS study
        jatos.endStudy(jsPsych.data.get().json());
    }
};



const changeRuleTo3Back = {
    type: "html-keyboard-response",
    stimulus: function() {
        return `<div style="max-width: 1200px">
            <div style="border: 3px solid #FF6B35; background-color: #FFF3E0; padding: 20px; margin: 20px auto; border-radius: 8px;">
                <h2 style="color: #FF6B35; text-align: center; margin-top: 0;">⚠️ ${language.changeRules.title} ⚠️</h2>
                <div style="background-color: white; padding: 15px; border-radius: 4px; border-left: 4px solid #FF6B35;">
                    <p style="font-size: 1.1em; font-weight: bold; margin: 0;">${language.changeRules.ruleTo3Back}</p>
                </div>
            </div>
            <p style="text-align: center; margin-top: 20px;">${language.changeRules.pressKey}</p>
        </div>`;
    }
};

const changeRuleTo1Back = {
    type: "html-keyboard-response",
    stimulus: function() {
        return `<div style="max-width: 1200px">
            <div style="border: 3px solid #FF6B35; background-color: #FFF3E0; padding: 20px; margin: 20px auto; border-radius: 8px;">
                <h2 style="color: #FF6B35; text-align: center; margin-top: 0;">⚠️ ${language.changeRules.title} ⚠️</h2>
                <div style="background-color: white; padding: 15px; border-radius: 4px; border-left: 4px solid #FF6B35;">
                    <p style="font-size: 1.1em; font-weight: bold; margin: 0;">${language.changeRules.ruleTo1Back}</p>
                </div>
            </div>
            <p style="text-align: center; margin-top: 20px;">${language.changeRules.pressKey}</p>
        </div>`;
    }
};
const changePaymentRule = {
    type: "html-keyboard-response",
    stimulus: function() {
        return `<div style="max-width: 1200px">
            <div style="border: 3px solid #FF6B35; background-color: #FFF3E0; padding: 20px; margin: 20px auto; border-radius: 8px;">
                <h2 style="color: #FF6B35; text-align: center; margin-top: 0;">⚠️ ${language.changeRules.title} ⚠️</h2>
                <div style="background-color: white; padding: 15px; border-radius: 4px; border-left: 4px solid #FF6B35;">
                    <p style="font-size: 1.1em; font-weight: bold; margin: 0;">${language.changeRules.paymentRuleChange}</p>
                </div>
            </div>
        </div>
        <p>${language.changeRules.paymentRuleChange2}</p>
        <p>${language.changeRules.pressKey}</p>`;
    }
};
const paymentExplanationEasyTrialFirst = {
    type: 'instructions',
    pages: [
        `<div style="max-width: 1200px">
            <h2>${paymentExplanationEasy.title}</h2>
            <p>${paymentExplanationEasy.mainText.replace(/\$\{payment\}/g, payment)}</p>
            <p>${paymentExplanationEasy.score.replace(/__PAYMENT__/g, payment)}<br>
            <p>${paymentExplanationEasy.clickNext}</p>
        </div>`, `<p>${language.rulesWillChange.attention}</p><p>${language.rulesWillChange.clear}</p><p>${language.descriptionExperimentNback.clickNext}</p>`
    ],
    show_clickable_nav: true,
  button_label_next: language.button.next,
  button_label_previous: language.button.previous,
};

const paymentExplanationEasyTrialSecond = {
    type: 'instructions',
    pages: [
        `<div style="max-width: 1200px">
            <h2>${paymentExplanationEasy.title}</h2>
            <p>${paymentExplanationEasy.changeScore}</p>
            <p>${paymentExplanationEasy.score.replace(/__PAYMENT__/g, payment)}<br>
            <p>${paymentExplanationEasy.clickNext}</p>
        </div>`
    ],
show_clickable_nav: true,
  button_label_next: language.button.next,
  button_label_previous: language.button.previous,
};
// const paymentExplanationHardTrialFirst = {
//     type: "html-keyboard-response",
//     stimulus: function() { // to improve lisibility why not style="text-align: left;
//         return `<div style="max-width: 1200px">
//             <h2>${paymentExplanationHard.title}</h2>
//             <p>${paymentExplanationHard.mainText.replace(/\$\{payment\}/g, payment)}</p>
//             <p>${paymentExplanationHard.score.replace(/__PAYMENT__/g, payment)}<br>
//         </div>`;
//     }
// };
const paymentExplanationHardTrialFirst = {
    type: 'instructions',
    pages:[// to improve lisibility why not style="text-align: left;
         `<div style="max-width: 1200px">
            <h2>${paymentExplanationHard.title}</h2>
            <p>${paymentExplanationHard.mainText.replace(/\$\{payment\}/g, payment)}</p>
            <p>${paymentExplanationHard.score.replace(/__PAYMENT__/g, payment)}<br>
            <p>${paymentExplanationHard.clickNext}</p>
        </div>`, `<p>${language.rulesWillChange.attention}</p><p>${language.rulesWillChange.clear}</p><p>${language.descriptionExperimentNback.clickNext}</p>`
    ],
    show_clickable_nav: true,
  button_label_next: language.button.next,
  button_label_previous: language.button.previous,
};

const paymentExplanationHardTrialSecond = {
    type: "instructions",
    pages: [
        `<div style="max-width: 1200px">
            <h2>${paymentExplanationHard.title}</h2>
            <p>${paymentExplanationHard.changeScore}</p>
            <p>${paymentExplanationHard.score.replace(/__PAYMENT__/g, payment)}<br>
            <p>${paymentExplanationEasy.clickNext}</p>
        </div>`],
    show_clickable_nav: true,
  button_label_next: language.button.next,
  button_label_previous: language.button.previous,
};

const overallTrainingExplanationEasy = {... trialStructure, stimulus: 
    `<div style="max-width: 1200px">
        <h2>${language.overallTrainingIntro.title}</h2>
        <p>${language.overallTrainingIntro.description1Back}</p>
        <p>${language.overallTrainingIntro.structure1Back}</p>
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
        <p>${language.overallTrainingIntro.description3Back}</p>
        <p>${language.overallTrainingIntro.structure3Back}</p>
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
        }).last(stimuliList_nbackVisualOverallPractice.length);
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
            <p>${language.overallTrainingFeedback.nbackLetter3Back.replace('{accuracy}', accuracyNPercent).replace('{correct}', corTrialsN).replace('{total}', totalTrialsN)}</p>
            <p>${language.overallTrainingFeedback.visualNback.replace('{accuracy}', accuracyVNPercent).replace('{correct}', corTrialsVN).replace('{total}', totalTrialsVN)}</p>
            <p>${language.overallTrainingFeedback.afterVisual.replace('{Lettres}', "Lettres").replace('{accuracy}', accuracyPostVisualPercent).replace('{correct}', corPostVT).replace('{total}', postVT).replace('{total}', postVT)}. ${explainHard}</p>
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
        }).last(stimuliList_nbackVisualOverallPractice.length);
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
            <p>${language.overallTrainingFeedback.nbackLetter1Back.replace('{accuracy}', accuracyNPercent).replace('{correct}', corTrialsN).replace('{total}', totalTrialsN)}</p>
            <p>${language.overallTrainingFeedback.visualNback.replace('{accuracy}', accuracyVNPercent).replace('{correct}', corTrialsVN).replace('{total}', totalTrialsVN)}</p>
            <p>${language.overallTrainingFeedback.afterVisual.replace('{accuracy}', accuracyPostVisualPercent).replace('{correct}', corPostVT).replace('{total}', postVT).replace('{Lettres}', "Lettre").replace('{total}', postVT)}. ${language.overallTrainingFeedback.explain1Back}</p>
            <p>${language.overallTrainingFeedback.keyImportanceEasy}</p>
            <p>${language.overallTrainingFeedback.calculation.replace('{payment}', payment).replace('{afterVisualAcc}', accuracyPostVisual.toFixed(2)).replace('{visualAcc}', accuracyVN.toFixed(2)).replace('{letterAcc}', accuracyN.toFixed(2)).replace('{totalBonus}', totalPayment.toFixed(2))}</p>
            <p>${language.overallTrainingFeedback.rememberEasy}</p>
            <p>${language.overallTrainingFeedback.continue}</p>
        </div>`;
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



/********** define the MPL trials *************/


// Data setup



let numbersArray_lottery = generateShuffledArray();
console.log(numbersArray_lottery, "is numbersArray_lottery");
let numbersArray_mirror = generateShuffledArray();
console.log(numbersArray_mirror, "is numbersArray_mirror");
let mpl_html_array_lottery = [];
let mpl_html_array_mirror = [];
let example_mpl_html_array_lottery = [];
let example_mpl_html_array_mirror = [];
let training_mpl_html_array1 = [];
let training_mpl_html_array2 = [];
let list_mpl_tables = {
    1: "G10",
    2: "G25",
    3: "G50",
    4: "G75",
    5: "G90",
    6: "L10",
    7: "L25",
    8: "L50",
    9: "L75",
    10: "L90",
    11: "A10",
    12: "A15"};
const mplPositionDict = createMPLPositionDictionaryFromList();
// Create mpl_html_array_lottery following the order of numbersArray
mpl_html_array_lottery = numbersArray_lottery.map(x => {
    const tableType = list_mpl_tables[x];
    // Extract the probability and type from the table identifier
    const probability = parseInt(tableType.substring(1)); // Extract number part
    const type = tableType.charAt(0); // Extract letter part (G, L, or A)
    const position = mplPositionDict[tableType]; // Get the position from dictionary
    console.log("MPLGenerator2 called with:", probability, type, "lottery", position);
    return mplGenerator2(probability, type, "lottery", position);
});
mpl_html_array_mirror = numbersArray_mirror.map(x => {
    const tableType = list_mpl_tables[x];
    // Extract the probability and type from the table identifier
    const probability = parseInt(tableType.substring(1)); // Extract number part
    const type = tableType.charAt(0); // Extract letter part (G, L, or A)
    const position = mplPositionDict[tableType]; // Get the position from dictionary ("high" or "low")
    console.log("MPLGenerator2 called with:", probability, type, "mirror", position);
    return mplGenerator2(probability, type, "mirror", position);
});
example_mpl_html_array_lottery = [mplGenerator2(50, "G", "lottery", 'low')];
example_mpl_html_array_mirror = [mplGenerator2(50, "G", "mirror", 'low')];
training_mpl_html_array1 = [mplGenerator3(1)];
training_mpl_html_array2 = [mplGenerator3(2)];
training_mpl_html_array = [mplGenerator3(1), mplGenerator3(2)];
training_mpl_html_array1 = training_mpl_html_array1.map(html => ({html: html, statusMPL: "mirror"}));
training_mpl_html_array2 = training_mpl_html_array2.map(html => ({html: html, statusMPL: "mirror"}));
training_mpl_html_array = training_mpl_html_array.map(html => ({html: html, statusMPL: "mirror"}));
console.log(training_mpl_html_array, "is training_mpl_html_array with generated HTML");
mpl_html_array_lottery = mpl_html_array_lottery.map(html => ({html: html, statusMPL: "lottery"}));
mpl_html_array_mirror = mpl_html_array_mirror.map(html => ({html: html, statusMPL: "mirror"}));
example_mpl_html_array_lottery = example_mpl_html_array_lottery.map(html => ({html: html, statusMPL: "lottery"}));
example_mpl_html_array_mirror = example_mpl_html_array_mirror.map(html => ({html: html, statusMPL: "mirror"}));
console.log(example_mpl_html_array_lottery, "is example_mpl_html_array_lottery with generated HTML");
// console.log(mpl_html_array_lottery, "is mpl_html_array_lottery with generated HTML");


//console.log(mpl_html_array_lottery, "is mpl_html_array_lottery with generated HTML");
console.log(`Generated ${mpl_html_array_lottery.length} MPL tables in randomized order`);
console.log(`Generated ${mpl_html_array_mirror.length} MPL tables in randomized order`);
console.log( "is mpl_html_array_mirror with generated HTML", mpl_html_array_mirror);

// let mpl_html = mplGenerator(75, "L");

const mpl_trial = {
  type: 'survey-html-form',
  button_label: language.button.next,
  html: function() {
    return jsPsych.timelineVariable("html", true);  
  },
  on_load: function() {

    // Disable the submit button initially
    const submitButton = document.querySelector('input[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.style.opacity = '0.5';
      submitButton.style.cursor = 'not-allowed';
    }

    let hasSelections = false;

    function checkSelections() {
      // Check if at least one choice has been made
      const anySelected = document.querySelector('.choice.selected');
      hasSelections = !!anySelected;
      
      if (submitButton) {
        submitButton.disabled = !hasSelections;
        submitButton.style.opacity = hasSelections ? '1' : '0.5';
        submitButton.style.cursor = hasSelections ? 'pointer' : 'not-allowed';
      }
    }

    function selectRow(row, choice) {
        document.querySelectorAll(`.choice[data-row="${row}"]`)
          .forEach(b => b.classList.remove('selected'));
        let cell = document.querySelector(`.choice[data-row="${row}"][data-choice="${choice}"]`);
        cell.classList.add('selected');
        cell.querySelector('input').checked = true;

        // Check if we can enable submit button
        checkSelections();
      }

    document.querySelectorAll('.mirror').forEach(cell => {
      cell.addEventListener('click', function() {
          let row = parseInt(this.dataset.row);
          this.classList.add('selected');
          console.log(row, "is row of mirror")
          let lotteryCell = document.querySelector(`.choice[data-row="${row}"][data-choice="lottery"]`);
          // this.classList.add('selected')
      if (lotteryCell) {
          let clickEvent = new MouseEvent('click', {
              bubbles: true,    // Allows the event to bubble up through the DOM
              cancelable: true,  // Allows the event to be canceled
              // view: window       // Associates the event with the window
          });
          lotteryCell.dispatchEvent(clickEvent);
          }
    });
      cell.addEventListener('mouseenter', function() {
        let row = parseInt(this.dataset.row);
        let lotteryCell = document.querySelector(`.choice[data-row="${row}"][data-choice="lottery"]`);
        if (lotteryCell){
          lotteryCell.classList.add('hovered');
        }
      });
      cell.addEventListener('mouseleave', function() {
        let row = parseInt(this.dataset.row);
        let lotteryCell = document.querySelector(`.choice[data-row="${row}"][data-choice="lottery"]`);
        if (lotteryCell) {
          lotteryCell.classList.remove('hovered');
        }
      });
    });
  
    document.querySelectorAll('.choice').forEach(cell => {
      cell.addEventListener('click', function() {
        let row = parseInt(this.dataset.row); // dataset refers to all the custom data attributes of an element (data-*)
        let choice = this.dataset.choice;
        // Fill from row 0 to clicked row with clicked choice
        for (let r = 0; r <= row; r++) {
          selectRow(r, choice);
          if (choice == "lottery"){
            document.querySelector(`.mirror[data-row="${r}"]`).classList.add('selected')
          }
          if (choice == "sure") {
            document.querySelector(`.mirror[data-row="${r}"]`).classList.remove('selected')
          }
        }
        // Fill from clicked row+1 to end with the opposite choice
        let otherChoice = (choice === 'sure') ? 'lottery' : 'sure';
        for (let r = row + 1; r < lengthSurePayments + 1; r++) {
          selectRow(r, otherChoice);
          if (choice == "lottery"){
            document.querySelector(`.mirror[data-row="${r}"]`).classList.remove('selected')
          }
          if (choice == "sure") {
            document.querySelector(`.mirror[data-row="${r}"]`).classList.add('selected')
          }        
        }
      });
    });
  },
  
  on_finish: function(data) {
    // Parse the responses JSON
    console.log("data is ", data)
    let responses_mpl = JSON.parse(data.responses);
    console.log("data.responses is ",data.responses)

    // Determine switching row
    let prevChoice = null;
    let switchRow = null;
    let switchRow1 = null;
    let switchRow2 = null;
    let choicesArray = [];


    for (var i = 0; i < lengthSurePayments + 1; i++) {
      let choice = responses_mpl[`row${i}`];
      choicesArray.push(choice);
      prevChoice = i > 0 ? choicesArray[i-1] : null;
      if (prevChoice && choice !== prevChoice) {
        switchRow2 = i; // +1 for human-readable row index
        switchRow1 = i - 1; // 0-based index
        switchRow2Choice = responses_mpl[`row${i}`];
        switchRow1Choice = responses_mpl[`row${i - 1}`];
      }
    }
    // Add condition for all same choices
    if (switchRow1 === null && switchRow2 === null) {
        // Check if all choices are the same
        let firstChoice = choicesArray[0];
        let allSame = choicesArray.every(choice => choice === firstChoice);
        if (allSame) {
            switchRow1 = -1; // Row index 1 (second row)
            switchRow2 = -1; // Row index 1 (second row)
            switchRow1Choice = firstChoice;
            switchRow2Choice = firstChoice;
        }
    }

    let html = jsPsych.timelineVariable("html", true);
    // statusMPL = jsPsych.timelineVariable("statusMPL", true);
    let mplTypeMatch = html.match(/data-mpl-type="([^"]+)"/);
            if (mplTypeMatch && mplTypeMatch[1]) {
                data.mplType = mplTypeMatch[1];
            } else {
                data.mplType = "unknown";
            }

    
    console.log("MPL type saved:", data.mplType);
    console.log("block type is ", block_type)
    console.log("subBlock is ", subBlock)
    console.log("data.mplType is ", data.mplType)
    mplCounter++;
    data.mplCounter = mplCounter;
    data.subBlock = subBlock;
    data.statusMPL = statusMPL
    data.block = block_type;
    data.switch_row2 = switchRow2; // null means no switch
    data.switch_row1 = switchRow1; // null means no switch
    data.switchRow2Choice = switchRow2Choice;
    data.switchRow1Choice = switchRow1Choice;
    console.log("data.switchRow2Choice is ", data.switchRow2Choice, "and data.switchRow1Choice is ", data.switchRow1Choice)
    data.choices = choicesArray;
    console.log("choicesArray is ", choicesArray)
    console.log("status of mpl is", data.statusMPL)
    data.task = "mpl";
    data.position = mplPositionDict[data.mplType]
    console.log("data.position is ", data.position)
    let exampleLine = getRandomInt(0, lengthSurePayments);
    console.log("calculateMPLPayment with line ", 0, " is", calculateMPLPayment(data.mplType, 0, data.choices, data.statusMPL));
  }
};

const mpl_trial_training = {
  type: 'survey-html-form',
  button_label: language.button.next,
  html: function() {
    return jsPsych.timelineVariable("html", true);
  },
  on_load: function() {

    // Disable the submit button initially
    const submitButton = document.querySelector('input[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.style.opacity = '0.5';
      submitButton.style.cursor = 'not-allowed';
    }

    if (jsPsych.timelineVariable("html", true) == training_mpl_html_array[0].html){
    function checkCorrectSelections() {
      // Check if the correct pattern is selected:
      // Rows 0-6 should have "lottery" selected
      // Rows 7-17 should have "sure" selected
      let correctPattern = true;
      
      // Check rows 0-6 for lottery selection
      for (let r = 0; r < 6; r++) {
        const lotteryCell = document.querySelector(`.choice[data-row="${r}"][data-choice="lottery"]`);
        if (!lotteryCell || !lotteryCell.classList.contains('selected')) {
          correctPattern = false;
          break;
        }
      }
      
      // Check rows 7-17 for sure selection (only if rows 0-6 are correct)
      if (correctPattern) {
        for (let r = 6; r <= 17; r++) {
          const sureCell = document.querySelector(`.choice[data-row="${r}"][data-choice="sure"]`);
          if (!sureCell || !sureCell.classList.contains('selected')) {
            correctPattern = false;
            break;
          }
        }
      }
      
      // Enable/disable submit button based on correct pattern
      if (submitButton) {
        submitButton.disabled = !correctPattern;
        submitButton.style.opacity = correctPattern ? '1' : '0.5';
        submitButton.style.cursor = correctPattern ? 'pointer' : 'not-allowed';
      }
    }
    } else if (jsPsych.timelineVariable("html", true) == training_mpl_html_array[1].html){
    function checkCorrectSelections() {
      // Check if the correct pattern is selected:
      // Rows 0-6 should have "lottery" selected
      // Rows 7-17 should have "sure" selected
      let correctPattern = true;
      
      // Check rows 0-6 for lottery selection
      for (let r = 0; r < 8; r++) {
        const lotteryCell = document.querySelector(`.choice[data-row="${r}"][data-choice="sure"]`);
        if (!lotteryCell || !lotteryCell.classList.contains('selected')) {
          correctPattern = false;
          break;
        }
      }
      
      // Check rows 7-17 for sure selection (only if rows 0-6 are correct)
      if (correctPattern) {
        for (let r = 8; r <= 17; r++) {
          const sureCell = document.querySelector(`.choice[data-row="${r}"][data-choice="lottery"]`);
          if (!sureCell || !sureCell.classList.contains('selected')) {
            correctPattern = false;
            break;
          }
        }
      }
      
      // Enable/disable submit button based on correct pattern
      if (submitButton) {
        submitButton.disabled = !correctPattern;
        submitButton.style.opacity = correctPattern ? '1' : '0.5';
        submitButton.style.cursor = correctPattern ? 'pointer' : 'not-allowed';
      }
    }
    }

    function selectRow(row, choice) {
        document.querySelectorAll(`.choice[data-row="${row}"]`)
          .forEach(b => b.classList.remove('selected'));
        let cell = document.querySelector(`.choice[data-row="${row}"][data-choice="${choice}"]`);
        if (cell) {
          cell.classList.add('selected');
          cell.querySelector('input').checked = true;
        }

        // Check if the correct pattern is selected
        checkCorrectSelections();
      }

    document.querySelectorAll('.mirror').forEach(cell => {
      cell.addEventListener('click', function() {
          let row = parseInt(this.dataset.row);
          this.classList.add('selected');
          console.log(row, "is row of mirror")
          let lotteryCell = document.querySelector(`.choice[data-row="${row}"][data-choice="lottery"]`);
      if (lotteryCell) {
          let clickEvent = new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
          });
          lotteryCell.dispatchEvent(clickEvent);
          }
    });
      cell.addEventListener('mouseenter', function() {
        let row = parseInt(this.dataset.row);
        let lotteryCell = document.querySelector(`.choice[data-row="${row}"][data-choice="lottery"]`);
        if (lotteryCell){
          lotteryCell.classList.add('hovered');
        }
      });
      cell.addEventListener('mouseleave', function() {
        let row = parseInt(this.dataset.row);
        let lotteryCell = document.querySelector(`.choice[data-row="${row}"][data-choice="lottery"]`);
        if (lotteryCell) {
          lotteryCell.classList.remove('hovered');
        }
      });
    });
  
    // Modified click behavior - restore auto-filling logic but check for correct pattern
    document.querySelectorAll('.choice').forEach(cell => {
      cell.addEventListener('click', function() {
        let row = parseInt(this.dataset.row);
        let choice = this.dataset.choice;
        
        // Fill from row 0 to clicked row with clicked choice (original auto-fill logic)
        for (let r = 0; r <= row; r++) {
          selectRow(r, choice);
          if (choice == "lottery"){
            document.querySelector(`.mirror[data-row="${r}"]`).classList.add('selected')
          }
          if (choice == "sure") {
            document.querySelector(`.mirror[data-row="${r}"]`).classList.remove('selected')
          }
        }
        // Fill from clicked row+1 to end with the opposite choice (original auto-fill logic)
        let otherChoice = (choice === 'sure') ? 'lottery' : 'sure';
        for (let r = row + 1; r < lengthSurePayments + 1; r++) {
          selectRow(r, otherChoice);
          if (choice == "lottery"){
            document.querySelector(`.mirror[data-row="${r}"]`).classList.remove('selected')
          }
          if (choice == "sure") {
            document.querySelector(`.mirror[data-row="${r}"]`).classList.add('selected')
          }        
        }
      });
    });
  },
  
  on_finish: function(data) {
    // Parse the responses JSON
    console.log("Training MPL data is ", data)
    let responses_mpl = JSON.parse(data.responses);
    console.log("Training MPL data.responses is ",data.responses)

    // Determine switching row
    let prevChoice = null;
    let switchRow = null;
    let switchRow1 = null;
    let switchRow2 = null;
    let choicesArray = [];

    for (var i = 0; i < lengthSurePayments + 1; i++) {
      let choice = responses_mpl[`row${i}`];
      choicesArray.push(choice);
      prevChoice = i > 0 ? choicesArray[i-1] : null;
      if (prevChoice && choice !== prevChoice) {
        switchRow2 = i;
        switchRow1 = i - 1;
        switchRow2Choice = responses_mpl[`row${i}`];
        switchRow1Choice = responses_mpl[`row${i - 1}`];
      }
    }
    
    // Add condition for all same choices
    if (switchRow1 === null && switchRow2 === null) {
        let firstChoice = choicesArray[0];
        let allSame = choicesArray.every(choice => choice === firstChoice);
        if (allSame) {
            switchRow1 = -1;
            switchRow2 = -1;
            switchRow1Choice = firstChoice;
            switchRow2Choice = firstChoice;
        }
    }

    let html = jsPsych.timelineVariable("html", true);

    data.mplType = "training";
    console.log("Training MPL type saved:", data.mplType);
    mplCounter++;
    data.mplCounter = mplCounter;
    data.subBlock = subBlock;
    data.statusMPL = statusMPL
    data.block = block_type;
    data.switch_row2 = switchRow2;
    data.switch_row1 = switchRow1;
    data.switchRow2Choice = switchRow2Choice;
    data.switchRow1Choice = switchRow1Choice;
    data.choices = choicesArray;
    data.task = "mpl_training";
    console.log("Training MPL completed with correct pattern");
  }
};


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


/************ define the span trials ***************/



const fdsTotalTrialsTraining_update = {
    type: 'call-function',
    func: function() {
        fdsTotalTrials = totalFdsTrainingTrials
        block_type = "calibration"
    }
}
// const fdsTotalTrialsSpanMpl_update = {
//     type: 'call-function',
//     func: function() {
//         fdsTotalTrials = totalFdsSpanMplTrials
//         currentSpan = mplSpan
//         block_type = "spanMpl"
//     }
// }

const feedback_span ={
    type: 'html-keyboard-response',
    stimulus: "nana",
//`<p><b>${fdb}</b><br>Your answer was ${response}, the right numbers were ${fds_correct_ans}</br></p>`,
    choices: jsPsych.NO_KEYS,
    trial_duration: 2000,
    on_start: function (trial) {
        console.log(jsPsych.data.get().last(1).values()[0], "is last 1")
        console.log(jsPsych.data.get().last(2).values()[0], "is last 2")
        console.log(jsPsych.data.get().last(3).values()[0], "is last 3")
        console.log(jsPsych.data.get().last(4).values()[0], "is last 4")


        console.log(jsPsych.data.get().last(1).values()[0].was_correct)
        console.log(jsPsych.data.get().last(1).values()[0].answer, "is the answer")
        if (jsPsych.data.get().last(1).values()[0].was_correct == 0){
            if (language == fr) {
                fdb = 'Faux'
            }
            if (language == en) {
                fdb = 'Wrong'
            }
            console.log(fdb, "is fdb")
        }
        if (jsPsych.data.get().last(1).values()[0].was_correct == 1){
            if (language == fr) {
                fdb = 'Correct'
            }
            if (language == en) {
            fdb ='Right'
            }
            console.log(fdb, "is fdb")
        }
        console.log(fdb, "is fdb")
        console.log(response, "is response")
        if (treatment == 'hard') {
            return trial.stimulus = language.feedback_span.hard.replace('{fdb}', fdb).replace('{answer}', jsPsych.data.get().last(1).values()[0].answer).replace('{fds_correct_ans}', fds_correct_ans);
        }
        else if (treatment == 'easy') {
            return trial.stimulus = language.feedback_span.easy.replace('{fdb}', fdb).replace('{answer}', jsPsych.data.get().last(1).values()[0].answer).replace('{fds_correct_ans}', fds_correct_ans);
        }
    },
}

const staircase_assess = {
    type: 'call-function',
    func: updateSpan //update currentSpan based on staircase
};

const setup_fds = {
    type: 'html-button-response',
    stimulus: function(){
        const trialInfo = language.fds.trialOutOf.replace('{current}', fdsTrialNum).replace('{total}', fdsTotalTrials);
        
        // Add help button to the stimulus
        const helpButton = `
            <div style="position: fixed; top: 10px; right: 10px; z-index: 1000;">
                <button type="button" id="help-button" style="padding: 16px 34px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 18px;">
                    ${language.button.help || "Help"}
                </button>
            </div>
        `;
        if (block_type == "span_mpl") {
            return helpButton + trialInfo;
        }
        else {return trialInfo;}
    },
    choices: [`${language.button.next}`],
    post_trial_gap: 500,
    on_load: function() {
        // Add click handler for help button
        const helpButton = document.getElementById('help-button');
        if (helpButton) {
            helpButton.addEventListener('click', function() {
                showInstructionModal();
            });
        }
    },
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

const before_span_span1 = {
    type: 'html-button-response',
    stimulus: function(){
        if (treatment == 'hard') {
            theBlueDigits = language.span_span.variableHard.theBlueDigits
            the = language.span_span.variableHard.the
        }
        else if (treatment == 'easy') {
            theBlueDigits = language.span_span.variableEasy.theBlueDigits
            the = language.span_span.variableEasy.the
        }
        return `<p>${language.fds.trialOutOf.replace('{current}', fdsTrialNum).replace('{total}', totalFdsSpanSpanTrials)}</p><br>
        <p>${language.span_span.first_letters_priority.replace("{theBlueDigits}", theBlueDigits).replace("{the}", the)}</p><br>
        <p>${language.span_span.first_letters_give_back.replace("{theBlueDigits}", theBlueDigits).replace("{theBlueDigits}", theBlueDigits)}</p>`;
    },
    choices: [`${language.button.next}`],
        post_trial_gap: 500,
        on_finish: function(){
            // if(fdsTrialNum == 1) {
            //     currentSpan = startingSpan;
            // }
            if (treatment == 'hard') {
                stimList = getStimuliFirstLetters(startingSpan),
                spanHistory[fdsTrialNum-1]=startingSpan;
            }
            else if (treatment == 'easy') {
                stimList = getStimuliFirstLetters(1),
                spanHistory[fdsTrialNum-1]=1
            }; //get the current stimuli for the trial
            spanHistory[fdsTrialNum-1]=startingSpan; //log the current span in an array
            idx = 0; //reset the index prior to the letter presentation
            exitLetters = 0; //reset the exit letter variable
            fdsTotalTrials = totalFdsSpanSpanTrials;
            block_type = "spanSpan";
        }
};
const before_span_span2 = {
    type: 'html-button-response',
    stimulus: function(){return `
        <p>${language.span_span.second_letters_priority.replace("{theBlueDigits}", theBlueDigits)}</p><br>
        <p>${language.span_span.second_letters_give_back.replace("{theBlueDigits}", theBlueDigits)}</p>`;},
    choices: [`${language.button.next}`],
        post_trial_gap: 500,
        on_finish: function(){
            stimList = getStimuliSecondLetters(startingSpan);
            spanHistory[fdsTrialNum-1]=startingSpan;
            idx = 0; //reset the index prior to the letter presentation
            exitLetters = 0; //reset the exit letter variable
        }
};


const letter_fds_vis = {
    type: 'html-keyboard-response',
    stimulus: function(){return stimList[idx];},
    choices: jsPsych.NO_KEYS,
    trial_duration: fds_letter_presentation,
    post_trial_gap: fds_post_trial_gap,
    on_start: function (trial){
        trial.data = trial.data || {};
        trial.data.subBlock = subBlock;
        trial.data.subBlock_span_span = subBlock_span_span;
    },
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
    stimulus: response_grid.replace('{instructions}', language.response_grid_instructions),
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
            spanCounter ++;
    
            jsPsych.data.addDataToLastTrial({
                designation: 'FDS-RESPONSE',
                span: currentSpan,
                answer: curans,
                correct: corans,
                was_correct: gotItRight,
                spanHistory: spanHistory,
                task: "spanTest",
                block: block_type,
                subBlock: subBlock,
                statusMPL: statusMPL,
                spanCounter: spanCounter,
            });
            console.log("accuracySpanSpan(data.answer, data.correct) is ", accuracySpanSpan(data.answer, data.correct));
            console.log("data.answer is ", curans, "and data.correct is ", corans, "and data.was_correct is ", gotItRight);
        }
}
const fds_response_screen_span_span1 = {
    type: 'html-keyboard-response',
    stimulus: response_grid.replace('{instructions}', language.span_span.type_second_letters),
    choices: ['Enter'],
    on_load: function() {
        // Add red theme class for this specific trial
        document.querySelector('.jspsych-content').classList.add('span-span1-red');
    },
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
            spanCounter ++;
            console.log(staircaseChecker);
    
            jsPsych.data.addDataToLastTrial({
                designation: 'FDS-RESPONSE',
                span: currentSpan,
                answer: curans,
                correct: corans,
                was_correct: gotItRight,
                spanHistory: spanHistory,
                task: "spanTest",
                block: block_type,
                letterType: 2,
                subBlock_span_span: subBlock_span_span,
                spanCounter: spanCounter,
                accuracySpanSpan: accuracySpanSpan(data.answer, data.correct)
            });
            console.log("accuracySpanSpan(data.answer, data.correct) is ", accuracySpanSpan(data.answer, data.correct));
            console.log("data.answer is ", curans, "and data.correct is ", corans, "and data.was_correct is ", gotItRight);
            
            // Remove red theme class when trial ends
            document.querySelector('.jspsych-content').classList.remove('span-span1-red');
        }
}
const fds_response_screen_span_span2 = {
    type: 'html-keyboard-response',
    stimulus: function () {
        let stim;
        if (treatment == 'hard') {
            stim = language.span_span.type_first_letters.replace('{theBlueDigits}', language.span_span.variableHard.theBlueDigits);}
        else if (treatment == 'easy') {
            stim = language.span_span.type_first_letters.replace('{theBlueDigits}', language.span_span.variableEasy.theBlueDigits);}
        return response_grid.replace('{instructions}', stim);
    },
    choices: ['Enter'],
    on_load: function() {
        // Add blue theme class for this specific trial
        document.querySelector('.jspsych-content').classList.add('span-span2-blue');
    },
        on_finish: function(data){
            var curans = response;
            var corans = fds_correct_ans_first_letters;
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
            fdsTrialNum += 1; //add 1 to the total trial count only after the two trials
            spanCounter ++;
    
            jsPsych.data.addDataToLastTrial({
                designation: 'FDS-RESPONSE',
                span: currentSpan,
                answer: curans,
                correct: corans,
                was_correct: gotItRight,
                task: "spanTest",
                block: block_type,
                letterType: 1,
                subBlock_span_span: subBlock_span_span,
                spanCounter: spanCounter,
            });
            console.log("accuracySpanSpan(data.answer, data.correct) is ", accuracySpanSpan(data.answer, data.correct));
            console.log("data.answer is ", curans, "and data.correct is ", corans, "and data.was_correct is ", gotItRight);
            
            // Remove blue theme class when trial ends
            document.querySelector('.jspsych-content').classList.remove('span-span2-blue');
        }
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

const fdsTrialNumReset = {
    type: "call-function",
    func: function() {
        fdsTrialNum = 1;
        console.log("fdsTrialNumReset, fdsTrialNum is " + fdsTrialNum);
    },
};

const fdsTrialNumResetAndSubBlockReset = {
    type: "call-function",
    func: function() {
        fdsTrialNum = 1;
        console.log("fdsTrialNumReset, fdsTrialNum is " + fdsTrialNum);
        subBlock = 0;
        console.log("fdsTrialNumReset, subBlock is " + subBlock);
    },
};

const fdsBlockToSpanMplAndSubBlockIncrementLottery = {
    type: "call-function",
    func: function() {
        block_type = "span_mpl";
        subBlock ++;
        statusMPL = "lottery";
        console.log("span_mpl, block_type is " + block_type);
        console.log("fdsBlockToSpanMplAndSubBlockIncrementLottery is activated");
        correct_responses = [3,1,3,1,3];
    },
};
const fdsBlockToSpanMplAndSubBlockIncrementMirror = {
    type: "call-function",
    func: function() {
        block_type = "span_mpl";
        subBlock ++;
        statusMPL = "mirror";
        console.log("span_mpl, block_type is " + block_type);
        correct_responses = [1,1,1,4,3];
    },
};

const blockIsExample = {
    type: "call-function",
    func: function() {
        block_type = "example_span_mpl";
        fdsTotalTrials = 1;
        console.log("block_type is " + block_type);
    },
};
const blockIsTraining = {
    type: "call-function",
    func: function() {
        block_type = "training_span_mpl";
        fdsTotalTrials = 1;
        console.log("block_type is " + block_type);
    },
};
const blockIsspan_mPLAndFdsTrialNumReset = {
    type: "call-function",
    func: function() {
        block_type = "span_mpl";
        fdsTrialNum = 1;
        fdsTotalTrials = totalFdsSpanMplTrials;
        mplCounter = mplCounter - 1; // to exclude this trial from the count of mpls that matter for data analysis
        spanCounter = spanCounter - 1; // same reason
        console.log("block_type is " + block_type + ", fdsTrialNum is " + fdsTrialNum);
    },
};


const cognitiveUncertaintyMirror = {
    type: 'survey-html-form',
    html: function(){
        if (block_order_indicator_span_MPL == "mirror_first") {
            sliderOrder = language.choicesBefore;
        }
        else if (block_order_indicator_span_MPL == "lottery_first") {
            sliderOrder = language.choicesAfter;
        }

        return `
            <div style="max-width: 800px; margin: 0 auto;">
                <h2>${language.sliderTitle}</h2><br>
                <p>${language.sliderMirror.replace('{order}', sliderOrder)}</p><br>
                <p>${language.sliderHonest}</p><br>
                
                <div style="margin: 30px 0;">
                    <p>${language.sliderCognitiveUncertainty.question}</p>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span>${language.sliderCognitiveUncertainty.veryUncertain}</span>
                        <input type="range" name="cognitiveUncertainty" min="0" max="100" value="50" style="flex-grow: 1;" required>
                        <span>${language.sliderCognitiveUncertainty.veryCertain}</span>
                    </div>
                </div><br>
                
                <div style="margin: 30px 0;">
                    <p>${language.sliderInattention.questionBoxes}</p>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span>${language.sliderInattention.veryUncertain}</span>
                        <input type="range" name="inattentionBoxes" min="0" max="100" value="50" style="flex-grow: 1;" required>
                        <span>${language.sliderInattention.veryCertain}</span>
                    </div>
                </div><br>

                <div style="margin: 30px 0;">
                    <p>${language.sliderInattention.questionPayoffs}</p>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span>${language.sliderInattention.veryUncertain}</span>
                        <input type="range" name="inattentionPayoffs" min="0" max="100" value="50" style="flex-grow: 1;" required>
                        <span>${language.sliderInattention.veryCertain}</span>
                    </div>
                </div><br>
                
                <div style="margin: 30px 0;">
                    <p>${language.sliderImprecision.question}</p>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span>${language.sliderImprecision.veryUncertain}</span>
                        <input type="range" name="imprecision" min="0" max="100" value="50" style="flex-grow: 1;" required>
                        <span>${language.sliderImprecision.veryCertain}</span>
                    </div>
                </div>
            </div>
        `},
    button_label: language.button.next, 
    on_finish: function(data) {
        // Parse the responses JSON
        const responses = JSON.parse(data.responses);
        
        // Store each slider value with your desired naming convention
        data.sliderCognitiveUncertainty = parseInt(responses.cognitiveUncertainty);
        console.log(data.sliderCognitiveUncertainty, "is data.sliderCognitiveUncertainty");
        data.sliderInattentionBoxes = parseInt(responses.inattentionBoxes);
        console.log(data.sliderInattentionBoxes, "is data.sliderInattentionBoxes");
        data.sliderInattentionPayoffs = parseInt(responses.inattentionPayoffs);
        console.log(data.sliderInattentionPayoffs, "is data.sliderInattentionPayoffs");
        data.sliderImprecision = parseInt(responses.imprecision);
        console.log(data.sliderImprecision, "is data.sliderImprecision");
        // Add task identifier
        if (block_order_indicator_span_MPL == "mirror_first") {
            data.task = 'sliderQuestionsMirror';
        }
        else if (block_order_indicator_span_MPL == "lottery_first") {
            data.task = 'sliderQuestionsLottery';
        }
    }
};
const cognitiveUncertaintyLottery = {
    type: 'survey-html-form',
    html: function(){
        if (block_order_indicator_span_MPL == "mirror_first") {
            sliderOrder = language.choicesAfter;
        }
        else if (block_order_indicator_span_MPL == "lottery_first") {
            sliderOrder = language.choicesBefore;
        }

        return `
            <div style="max-width: 800px; margin: 0 auto;">
                <h2>${language.sliderTitle}</h2><br>
                <p>${language.sliderLottery.replace('{order}', sliderOrder)}</p><br>
                <p>${language.sliderHonest}</p><br>
                
                <div style="margin: 30px 0;">
                    <p>${language.sliderCognitiveUncertainty.question}</p>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span>${language.sliderCognitiveUncertainty.veryUncertain}</span>
                        <input type="range" name="cognitiveUncertainty" min="0" max="100" value="50" style="flex-grow: 1;" required>
                        <span>${language.sliderCognitiveUncertainty.veryCertain}</span>
                    </div>
                </div><br>
                
                <div style="margin: 30px 0;">
                    <p>${language.sliderInattention.questionBoxes}</p>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span>${language.sliderInattention.veryUncertain}</span>
                        <input type="range" name="inattentionBoxes" min="0" max="100" value="50" style="flex-grow: 1;" required>
                        <span>${language.sliderInattention.veryCertain}</span>
                    </div>
                </div><br>

                <div style="margin: 30px 0;">
                    <p>${language.sliderInattention.questionPayoffs}</p>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span>${language.sliderInattention.veryUncertain}</span>
                        <input type="range" name="inattentionPayoffs" min="0" max="100" value="50" style="flex-grow: 1;" required>
                        <span>${language.sliderInattention.veryCertain}</span>
                    </div>
                </div><br>
                
                <div style="margin: 30px 0;">
                    <p>${language.sliderImprecision.question}</p>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span>${language.sliderImprecision.veryUncertain}</span>
                        <input type="range" name="imprecision" min="0" max="100" value="50" style="flex-grow: 1;" required>
                        <span>${language.sliderImprecision.veryCertain}</span>
                    </div>
                </div>
            </div>
        `},
    button_label: language.button.next, 
    on_finish: function(data) {
        // Parse the responses JSON
        const responses = JSON.parse(data.responses);
        
        // Store each slider value with your desired naming convention
        data.sliderCognitiveUncertainty = parseInt(responses.cognitiveUncertainty);
        console.log(data.sliderCognitiveUncertainty, "is data.sliderCognitiveUncertainty");
        data.sliderInattentionBoxes = parseInt(responses.inattentionBoxes);
        console.log(data.sliderInattentionBoxes, "is data.sliderInattentionBoxes");
        data.sliderInattentionPayoffs = parseInt(responses.inattentionPayoffs);
        console.log(data.sliderInattentionPayoffs, "is data.sliderInattentionPayoffs");
        data.sliderImprecision = parseInt(responses.imprecision);
        console.log(data.sliderImprecision, "is data.sliderImprecision");
        // Add task identifier
        data.task = 'sliderQuestionsMirror';
    }
};

/************* define conditional timeline elements for nback practice ************/

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


const easyBlock_nbackVisual = { ... timelineElementStructure, timeline_variables: nbackStimuli.stimuliEasy_nback, timeline: [fixation, testNback, nbackVisual_1, nbackVisual_2, nbackVisual_3, nbackVisual_4, nbackVisual_5, nbackVisual_6] }
const hardBlock_nbackVisual = { ... timelineElementStructure, timeline_variables: nbackStimuli.stimuliHard_nback, timeline: [fixation, testNback, nbackVisual_7, nbackVisual_8, nbackVisual_9, nbackVisual_10, nbackVisual_11, nbackVisual_12] }

// nbackStimuli.stimuliPracticeHard_nback

// const blockPractice_nback_nback = { ... timelineElementStructure, timeline: [fixation, testNback, feedBackN, feedBackC, feedBackW] } // practiceEasyBlock_nback_nback

// const loopPracticeHard_nback_nback = {
//     timeline: [
//         blockPractice_nback_nback, 
//         { // after 15 trials, show a feedback and move on if accuracy > 80%
//             conditional_function: function() {
//                 console.log(practiceNbackCounter, "is practiceNbackCounter")
//             if (practiceNbackCounter == 15) {
//             // if (practiceNbackCounter % nbackStimuli.stimuliPracticeHard_nback[0].length === 0) {
//                     console.log("conditional function shows feedback")
//                     return true;
//                 }},
//             timeline: [feedbackPracticeBlockAgain]
//         }
//     ],
//     timeline_variables : nbackStimuli.stimuliPracticeHard_nback[0],
//     loop_function: function() {
//         // let data = jsPsych.data.get().filter({block: 'practice_easy'}).last(nbackStimuli.stimuliPracticeHard_nback[0].length).values()[0];
//         // let accuracy = (data.filter((miss == 1) | (correct_rejection == 1)).count()) / data.count();
//         // return (accuracy <= 0.8);
//         return passPractice<=2
//     }
// };
function createPracticeNbackVisualTimeline(index) {
    return {
        timeline: [visualCache, testNback, feedBackN, feedBackC, feedBackW],
        timeline_variables: stimuli_nbackVisual_practice[index],
        conditional_function: function() {
            return practiceIndex === index;
        }
    };
}
const practiceNbackVisualTimelines = [];
for (let i = 0; i < stimuli_nbackVisual_practice.length; i++) {
    practiceNbackVisualTimelines.push(createPracticeNbackVisualTimeline(i));
}


const loopPracticeNbackVisual_nback_nback = {
    timeline: [
        ...practiceNbackVisualTimelines,
            // timeline: [fixation, testNback, feedBackN, feedBackC, feedBackW],
            // timeline_variables: nbackStimuli.stimuliPracticeHard_nback[practiceIndex],
        feedbackPracticeBlockAgain,
        {
            // Conditional trial for experiment termination
            conditional_function: function() {
                console.log(`practiceIndex: ${practiceIndex}, checking if > 40`);
                return practiceIndex > 40;
            },
            timeline: [experimentStopTrial]
        }
    ],

    loop_function: function() {
        console.log(`nback Visual Practice block completed. passPractice: ${passPractice}`);
        return passPractice < 2;
    }
};

function createPracticeHardTimeline(index) {
    return {
        timeline: [fixation, testNback, feedBackN, feedBackC, feedBackW],
        timeline_variables: nbackStimuli.stimuliPracticeHard_nback[index],
        conditional_function: function() {
            return practiceIndex === index;
        }
    };
}
const practiceHardTimelines = [];
for (let i = 0; i < nbackStimuli.stimuliPracticeHard_nback.length; i++) {
    practiceHardTimelines.push(createPracticeHardTimeline(i));
}
console.log(nbackStimuli.stimuliPracticeHard_nback[0], "is nbackStimuli.stimuliPracticeHard_nback[0]");
console.log(practiceHardTimelines[0], "is practiceHardTimelines[0]");
const loopPracticeHard_nback_nback = {
    timeline: [
        ...practiceHardTimelines,
            // timeline: [fixation, testNback, feedBackN, feedBackC, feedBackW],
            // timeline_variables: nbackStimuli.stimuliPracticeHard_nback[practiceIndex],
        feedbackPracticeBlockAgain,
        {
            // Conditional trial for experiment termination
            conditional_function: function() {
                console.log(`practiceIndex: ${practiceIndex}, checking if > 40`);
                return practiceIndex > 40;
            },
            timeline: [experimentStopTrial]
        }
    ],
    loop_function: function() {
        console.log(`nback hard practice block completed. passPractice: ${passPractice}`);
        return passPractice < 2;
    }
};

function createPracticeEasyTimeline(index) {
    return {
        timeline: [fixation, testNback, feedBackN, feedBackC, feedBackW],
        timeline_variables: nbackStimuli.stimuliPracticeEasy_nback[index],
        conditional_function: function() {
            return practiceIndex === index;
        }
    };
}
const practiceEasyTimelines = [];
for (let i = 0; i < nbackStimuli.stimuliPracticeEasy_nback.length; i++) {
    practiceEasyTimelines.push(createPracticeEasyTimeline(i));
}

const loopPracticeEasy_nback_nback = {
    timeline: [
        ...practiceEasyTimelines,
            // timeline: [fixation, testNback, feedBackN, feedBackC, feedBackW],
            // timeline_variables: nbackStimuli.stimuliPracticeHard_nback[practiceIndex],
        feedbackPracticeBlockAgain,
        {
            // Conditional trial for experiment termination
            conditional_function: function() {
                console.log(`practiceIndex: ${practiceIndex}, checking if > 40`);
                return practiceIndex > 40;
            },
            timeline: [experimentStopTrial]
        }
    ],

    loop_function: function() {
        console.log(`nback easy practice block completed. passPractice: ${passPractice}`);
        return passPractice < 2;
    }
};



// const practiceEasyBlock_nback_nback = { ... timelineElementStructure, timeline_variables: nbackStimuli.stimuliPracticeEasy_nback, timeline: [fixation, testNback, feedBackN, feedBackC, feedBackW]}
// const practiceHardBlock_nback_nback = { ... timelineElementStructure, timeline_variables: nbackStimuli.stimuliPracticeHard_nback, timeline: [fixation, testNback, feedBackN, feedBackC, feedBackW]}

/* Overall training blocks */

const overallTrainingNbackVisual = { timeline: [visualCache, testNback], timeline_variables: stimuli_nbackVisual_overall_training, 
    conditional_function: function() {
        if (nbackCounter > 0 && nbackCounter % 10 === 0) {
            timeout = 0;
        }
        return nbackCounter === 10;
    } }

const feedbackRBEasy = {
    timeline: [feedbackRemindBeforeEasy],
    timeline_variables: feedbackNo.data,
        conditional_function: function () {
            return nbackCounter === 9;
        }
}
const feedbackRBHard3back = {
    timeline: [feedbackRemindBeforeHard],
    timeline_variables: feedbackNo.data,
        conditional_function: function () {
            return nbackCounter === 7 & level == 3;
        }
}
const feedbackRBHard2back = {
    timeline: [feedbackRemindBeforeHard],
    timeline_variables: feedbackNo.data & level == 2,
        conditional_function: function () {
            return nbackCounter === 8 & level == 2;
        }
}

const feedbackRAEasy = {
    timeline: [feedbackRemindAfterEasy],
    timeline_variables: feedbackNo.data,
        conditional_function: function () {
            return nbackCounter === 10;
        }
}
const feedbackRAHard0 = {
    timeline: [feedbackRemindAfterHard0],
    timeline_variables: feedbackNo.data,
        conditional_function: function () {
            return nbackCounter === 10;
        }
}
const feedbackRAHard1 = {
    timeline: [feedbackRemindAfterHard1],
    timeline_variables: feedbackNo.data,
        conditional_function: function () {
            return nbackCounter === 11;
        }
}
const feedbackRAHard2 = {
    timeline: [feedbackRemindAfterHard2],
    timeline_variables: feedbackNo.data,
        conditional_function: function () {
            return nbackCounter === 12 & level == 3;
        }
}

const overallTrainingHard_nback = { ... timelineElementStructure, timeline_variables: nbackStimuli.stimuliHardOverallTraining, timeline: [fixation, testNback, overallTrainingNbackVisual, feedbackRBHard3back, feedbackRBHard2back, feedbackRAHard0, feedbackRAHard1, feedbackRAHard2] }
const overallTrainingEasy_nback = { ... timelineElementStructure, timeline_variables: nbackStimuli.stimuliEasyOverallTraining, timeline: [fixation, testNback, overallTrainingNbackVisual, feedbackRBEasy, feedbackRAEasy] }

// const hardBlock_overallTraining = { ...timelineElementStructure, timeline: [overallTrainingHard_nback] } // overallTrainingNbackVisual
// const easyBlock_overallTraining = { ...timelineElementStructure, timeline: [overallTrainingEasy_nback] } // overallTrainingNbackVisual

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
// const loopComprehensionQuestionsMPLLottery = {
//     timeline: [
//         comprehensionQuestionsMPLLottery,
//         {
//             conditional_function: function() {
//                 const last = jsPsych.data.get().filter({task: 'comprehensionSurveyHard'}).last(1).values()[0];
//                 console.log(last, "is last")
//                 return last && last.all_correct === false;
//             },
//             timeline: [loopAgain]
//         }
//     ],
//     loop_function: function() {
//         const last = jsPsych.data.get().filter({task: 'comprehensionSurveyEasy'}).last(1).values()[0];
//         // if no survey data found, repeat; otherwise repeat while not all_correct
//         console.log("exited the loopComprehensionSurveyEasy")
//         return !(last && last.all_correct === true);
//     }
// };



const overallTrainingHard = { ...timelineElementStructure, timeline: [nback_reset, overallTrainingExplanationHard, overallTrainingHard_nback, overallTrainingHardFeedback, loopComprehensionSurveyHard, nback_and_subBlock_reset_to_6] }
const overallTrainingEasy = { ...timelineElementStructure, timeline: [nback_reset, overallTrainingExplanationEasy, overallTrainingEasy_nback, overallTrainingEasyFeedback, loopComprehensionSurveyEasy, nback_and_subBlock_reset_to_0] }






let experimentBlocks_nback_nback = [];
let practiceAndTestEasy_nback_nback;
let practiceAndTestHard_nback_nback;

practiceAndTestEasy_nback_nback = {
    timeline: [
        // block_indicator, 
        instructions_easy, 
        startPractice,
        loopPracticeEasy_nback_nback,
        //practiceEasyBlock_nback_nback,
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
        loopPracticeHard_nback_nback,
        //practiceHardBlock_nback_nback,
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
    practiceAndTestHard_nback_nback.timeline.splice(5, 0, overallTrainingHard);

    practiceAndTestEasy_nback_nback.timeline.splice(0, 0, changeRuleTo1Back);
    practiceAndTestEasy_nback_nback.timeline.splice(5, 0, changePaymentRule);
    practiceAndTestEasy_nback_nback.timeline.splice(6, 0, paymentExplanationEasyTrialSecond);
    practiceAndTestEasy_nback_nback.timeline.splice(7, 0, overallTrainingEasy); // reset subBlock to 0

    
} else {
    experimentBlocks_nback_nback = [practiceAndTestEasy_nback_nback, practiceAndTestHard_nback_nback];
    block_order_indicator = "easy_first";
    console.log("practiceAndTestEasy_nback_nback first");

    practiceAndTestEasy_nback_nback.timeline.splice(4, 0, paymentExplanationEasyTrialFirst);
    practiceAndTestEasy_nback_nback.timeline.splice(5, 0, overallTrainingEasy);

    practiceAndTestHard_nback_nback.timeline.splice(0, 0, changeRuleTo3Back);
    practiceAndTestHard_nback_nback.timeline.splice(5, 0, changePaymentRule);
    practiceAndTestHard_nback_nback.timeline.splice(6, 0, paymentExplanationHardTrialSecond);
    practiceAndTestHard_nback_nback.timeline.splice(7, 0, overallTrainingHard); // reset subBlock to 6
}

const experiment_nback_nback = {
    timeline: experimentBlocks_nback_nback,
    randomize_order: true,
}

const incentives_nback_nbackVisual = {
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

        trial.data = trial.data || {};

        trial.data.totalPayment = totalPayment;
        trial.data.accuracy_post_visual = accuracyPostVisual;
        trial.data.accuracy_visual = accuracyVN;
        trial.data.accuracy_letter = accuracyN;
        trial.data.nback_level_payment = nbackLevel;

        let html;
        if (language == fr) {
            html = `
            <p>${language.incentives.selectedBlock.replace('${subBlockInteger}', subBlockInteger)}</p>
            <p>${language.incentives.accuracies
                .replace('${percentPostVisual}', Math.round(accuracyPostVisual * 100))
                .replace('${len}', (nbackLevel == 1) ? "l'" : (nbackLevel == 2) ? "les deux " : "les trois ")
                .replace('${percentVN}', Math.round(accuracyVN * 100))
                .replace('${percentN}', Math.round(accuracyN * 100))
            .replace('${n}', nbackLevel)
            }</p>
            <p>${language.incentives.postVisualDetails
                .replace('${N-lettres}', (nbackLevel == 1) ? "Lettre" : (nbackLevel == 2) ? "Deux lettres" : "Trois lettres")
                .replace('${postVisualTrials}', postVisualTrials.count())
                .replace('${corPostVisualTrials}', corPostVisualTrials)}</p>
            <p>${language.incentives.visualDetails
                .replace('${totalTrialsVN}', totalTrialsVN)
                .replace('${corTrialsVN}', corTrialsVN)}</p>
            <p>${language.incentives.letterDetails
                .replace('${N}', nbackLevel)
                .replace('${totalTrialsN}', totalTrialsN)
                .replace('${corTrialsN}', corTrialsN)}</p>
            <p>${language.incentives.paymentExplanation
                .replace('${accuracyPostVisual}', Math.round(accuracyPostVisual * 100) + '%')
                .replace('${accuracyVN}', Math.round(accuracyVN * 100) + '%')
                .replace('${accuracyN}', Math.round(accuracyN * 100) + '%')}</p>
            <p><b>${language.incentives.totalPayment.replace('${totalPayment}', totalPayment)}</b></p>
            <p>${language.incentives.thankYou}</p>
            <p>${language.incentives.redirect}</p>
            <p>${language.incentives.continue}</p>`;
        } else if (language == en) {
            html = `
            <p>${language.incentives.selectedBlock.replace('${subBlockInteger}', subBlockInteger)}</p>
            <p>${language.incentives.accuracies
                .replace('${percentPostVisual}', Math.round(accuracyPostVisual * 100))
                .replace('${percentVN}', Math.round(accuracyVN * 100))
                .replace('${percentN}', Math.round(accuracyN * 100))
            .replace('${n}', nbackLevel)
            }</p>
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
        }

            trial.stimulus = html; // set final display

    },
    on_finish: function(trial) { 
        trial.selected_subblock = subBlockInteger;
        trial.block_order_indicator = block_order_indicator;

        statCalculation(trial);
    },
};

const calibrationDebrief = {
    type: "html-button-response",
    choices: [`${language.button.next}`],
    stimulus: "",
    on_start: function(trial) {

    actual_payment_calibration = calibrationPayment * ((maximumSpanCalibration)/10)
    actual_payment_calibration = Math.min(actual_payment_calibration, 0.75);
    console.log(actual_payment_calibration, "is actual_payment_calibration")

    // Use the calculated payments
    trial.data = trial.data || {};
    trial.data.payment_calibration = actual_payment_calibration;

    let html;
    html = 
    `<h2>${language.debriefCalibration.title}</h2>
    <p>${language.debriefCalibration.performance.replace('{maxSpan}', maximumSpanCalibration)}</p>
    <p>${language.debriefCalibration.bonus.replace('{bonus}', calibrationPayment).replace('{maxSpan}', maximumSpanCalibration).replace('{totalBonus}', Math.round(actual_payment_calibration*100)/100)}</p>
    `
    trial.stimulus = html; // set final display
    },
};

let actual_payment_span_span = 0;
const spanSpanDebrief = {
    type: "html-button-response",
    choices: [`${language.button.next}`],
    stimulus: "",
    on_start: function(trial) {

    /******* payment for span_span *********/

    const subBlockIntegerSpanSpan = getRandomInt(0, 5);
    console.log("subBlockIntegerSpanSpan is ", subBlockIntegerSpanSpan);
    let trialsSpanSpan = jsPsych.data.get().filterCustom(function(trial){
        return trial.task == 'spanTest' && trial.block == 'spanSpan' && trial.subBlock_span_span == subBlockIntegerSpanSpan;
    });
    console.log(trialsSpanSpan, "is trialsSpanSpan");
    console.log(trialsSpanSpan.count(), "is trialsSpanSpan.count()");
    let trialsSpan1Letters = trialsSpanSpan.filter({letterType: 1});
    console.log("trialsSpan1Letters is ", trialsSpan1Letters);
    let trialsSpan2Letters = trialsSpanSpan.filter({letterType: 2});
    console.log("trialsSpan2Letters is ", trialsSpan2Letters);
    let accuracyLetters1 = accuracySpanSpan(trialsSpan1Letters.select('answer').values[0], trialsSpan1Letters.select('correct').values[0]);
    console.log("trialsSpan1Letters.select('answer').values[0] is ", trialsSpan1Letters.select('answer').values[0] );
    console.log("accuracyLetters1 is ", accuracyLetters1);
    let accuracyLetters2 = accuracySpanSpan(trialsSpan2Letters.select('answer').values[0], trialsSpan2Letters.select('correct').values[0]);
    console.log("accuracyLetters2 is ", accuracyLetters2);
    actual_payment_span_span = (spanSpanPayment_hard * 0.75 * accuracyLetters1) + (spanSpanPayment_hard * 0.25 * accuracyLetters2);
    actual_payment_span_span = Math.min(actual_payment_span_span, 0.5);

    // Use the calculated payments
    trial.data = trial.data || {};
    trial.data.payment_span_span = actual_payment_span_span;

    let html;
    if (treatment == "hard"){
    html = 
        `<h2>${language.debriefSpanSpan.title}</h2>
        <p>${language.debriefSpanSpan.performance.replace('{theBlueDigits}', language.debriefSpanSpan.variableHard.theBlueDigits.replace('{startingSpan}', startingSpan)).replace('{blueAccuracy}', Math.round(accuracyLetters1*100)).replace('{redAccuracy}', Math.round(accuracyLetters2*100))}</p>
        <p>${language.debriefSpanSpan.bonus.replace('{bonus}', spanSpanPayment_hard).replace('{blueAccuracy}', Math.round(accuracyLetters1*100)).replace('{redAccuracy}', Math.round(accuracyLetters2*100)).replace('{totalBonus}', Math.round(actual_payment_span_span*100)/100)}</p>
        `}
    else if (treatment == "easy"){
    html = 
        `<h2>${language.debriefSpanSpan.title}</h2>
        <p>${language.debriefSpanSpan.performance.replace('{theBlueDigits}', language.debriefSpanSpan.variableEasy.theBlueDigits).replace('{blueAccuracy}', Math.round(accuracyLetters1*100)).replace('{redAccuracy}', Math.round(accuracyLetters2*100))}</p>
        <p>${language.debriefSpanSpan.bonus.replace('{bonus}', spanSpanPayment_hard).replace('{blueAccuracy}', Math.round(accuracyLetters1*100)).replace('{redAccuracy}', Math.round(accuracyLetters2*100)).replace('{totalBonus}', Math.round(actual_payment_span_span*100)/100)}</p>
        `}
    trial.stimulus = html; // set final display
    },
};

const feedbackExampleSpanMPL = {
    type: "html-button-response",
    choices: [`${language.button.next}`],
    stimulus: "",
    on_start: function(trial) {
    /******* span_mpl payment *********/
    let actual_payment_span_mpl;
    let answerSpan;
    let correctSpan;
    let accuracy;
    if (treatment == "hard"){
        let trialsSpanMpl = jsPsych.data.get().filterCustom(function(trial){
            return trial.task == 'spanTest' && trial.block == 'example_span_mpl';
        });
        console.log("trialsSpanMPL is ", trialsSpanMpl);
        console.log("trialsSpanMPL.count() is (should be 1) ", trialsSpanMpl.count());
        answerSpan = trialsSpanMpl.select('answer').values[0];
        correctSpan = trialsSpanMpl.select('correct').values[0];
        accuracy = accuracySpanSpan(trialsSpanMpl.select('answer').values[0], trialsSpanMpl.select('correct').values[0]);
        console.log("trialsSpanMpl.select('answer').values[0] is ", trialsSpanMpl.select('answer').values[0]);
        console.log("trialsSpanMpl.select('correct').values[0] is ", trialsSpanMpl.select('correct').values[0]);
        console.log("accuracy is ", accuracy);
        actual_payment_span_mpl = spanMplPayment_hard * accuracy;
        actual_payment_span_mpl = Math.min(actual_payment_span_mpl, 2);
    } 
    else if (treatment == "easy") {
        let trialsSpanMpl = jsPsych.data.get().filterCustom(function(trial){
            return trial.task == 'spanTest' && trial.block == 'example_span_mpl';
        });
        console.log("trialsSpanMPL is ", trialsSpanMpl);
        console.log("trialsSpanMPL.count() is (should be 1) ", trialsSpanMpl.count());
        answerSpan = trialsSpanMpl.select('answer').values[0];
        correctSpan = trialsSpanMpl.select('correct').values[0];
        accuracy = accuracySpanSpan(trialsSpanMpl.select('answer').values[0], trialsSpanMpl.select('correct').values[0]);
        console.log("trialsSpanMpl.select('answer').values[0] is ", trialsSpanMpl.select('answer').values[0]);
        console.log("trialsSpanMpl.select('correct').values[0] is ", trialsSpanMpl.select('correct').values[0]);
        console.log("accuracy is ", accuracy);
        actual_payment_span_mpl = spanMplPayment_easy * accuracy;
        actual_payment_span_mpl = Math.min(actual_payment_span_mpl, 1);
    } 
    let bonusSpan;
    if (treatment == "hard") {
        bonusSpan = spanMplPayment_hard}
    else if (treatment == "easy") {
        bonusSpan = spanMplPayment_easy}
    console.log("bonusSpan is " + bonusSpan);

    // mpl
    let actual_payment_mpl_example;
    let selectedRow = getRandomInt(0, lengthSurePayments); // select one of the 18 rows
    console.log("selectedRow is ", selectedRow);
    let selectedTrial = jsPsych.data.get().filterCustom(function(trial){
        return trial.task == 'mpl' && trial.block == 'example_span_mpl';
    });
    console.log(selectedTrial, "is the selectedTrial for mpl payment");
    console.log(selectedTrial.count(), "is the selectedTrial count for mpl payment (should be one)");
    let mplType = selectedTrial.select('mplType').values[0]; // should be the same for all trials in the subBlock
    console.log(mplType, "is the mplType for the selected trial");
    let choices = selectedTrial.select('choices').values[0]; // should be the same for all trials in the subBlock
    console.log(choices, "is the choices for the selected trial");
    let chosenStatusExample = block_order_indicator_span_MPL == "mirror_first" ? "mirror" : "lottery";
    actual_payment_mpl_example = calculateMPLPayment(mplType, selectedRow, choices, chosenStatusExample);
    actual_payment_mpl_example = Math.min(actual_payment_mpl_example, 30);
    console.log(actual_payment_mpl_example)
    let chosenLot = "";
    if (choices[selectedRow] == "sure") { chosenLot = "<span style='color: blue'>lot B</span>"; }
    else if (choices[selectedRow] == "lottery") { chosenLot = "<span style='color: red'>lot A</span>"; }
    console.log("choices[selectedRow]", choices[selectedRow]);
    console.log("chosenLot is ", chosenLot);

    // Use the calculated payments
    trial.data = trial.data || {};
    trial.data.payment_span_mpl_exemple = actual_payment_span_mpl;
    trial.data.payment_mpl_exemple = actual_payment_mpl_example;
    let html;
    html = 
    `<h2>${language.feedbackExampleSpanMPL.title}</h2>
    <p>${language.feedbackExampleSpanMPL.description}<p>
    <p>${language.feedbackExampleSpanMPL.paymentSpan.replace('{correctSpan}', correctSpan).replace('{answerSpan}', answerSpan).replace('{precision}', Math.round(accuracy*100)).replace('{bonusSpan}',bonusSpan).replace('{precision}', Math.round(accuracy*100)).replace('{paymentSpan}', Math.round(actual_payment_span_mpl*100)/100)}</p>
    <p>${language.feedbackExampleSpanMPL.paymentMPL.replace('{selectedRow}', selectedRow + 1).replace('{chosenLot}', chosenLot).replace('{paymentMPL}', actual_payment_mpl_example).replace('{selectedRow}', selectedRow + 1)}</p>
    <div class="important-note">                     
    💡 ${language.feedbackExampleSpanMPL.remind.replace('{frequency}', propSelecForMPL)} 
    </div>
    <p>${language.feedbackExampleSpanMPL.instructionReminder}</p>
     <p>${language.feedbackExampleSpanMPL.clickNext}</p>
    `
    trial.stimulus = html; // set final display
    },
};



const incentives_span_mpl = {
    type: "html-keyboard-response",
    choices: ['Enter'],
    stimulus: "",
    on_start: function(trial) {

    let chosenStatus = "";
    if (Math.random() < 0.5){ chosenStatus = "mirror"; }
    else { chosenStatus = "lottery"; }
    console.log("chosenStatus is ", chosenStatus);

    console.log(actual_payment_calibration, "is actual_payment_calibration")

   
    /******* span_mpl payment *********/
    let actual_payment_span_mpl;
    const subBlockIntegerSpanMpl = getRandomInt(1, 14)
    if (treatment == "hard"){
        let trialsSpanMpl = jsPsych.data.get().filterCustom(function(trial){
            return trial.task == 'spanTest' && trial.block == 'span_mpl' && trial.subBlock == subBlockIntegerSpanMpl && trial.statusMPL == chosenStatus;
        });
        console.log("trialsSpanMPL is ", trialsSpanMpl);
        console.log("trialsSpanMPL.count() is (should be 1) ", trialsSpanMpl.count());
        let accuracy = accuracySpanSpan(trialsSpanMpl.select('answer').values[0], trialsSpanMpl.select('correct').values[0]);
        console.log("trialsSpanMpl.select('answer').values[0] is ", trialsSpanMpl.select('answer').values[0]);
        console.log("trialsSpanMpl.select('correct').values[0] is ", trialsSpanMpl.select('correct').values[0]);
        console.log("accuracy is ", accuracy);
        actual_payment_span_mpl = spanMplPayment_hard * accuracy;
        actual_payment_span_mpl = Math.min(actual_payment_span_mpl, 2);
        console.log("subBlock chosen for payment span_mpl is", subBlockIntegerSpanMpl, "and accuracy is ", accuracy);
    } 
    else if (treatment == "easy") {
        let trialsSpanMpl = jsPsych.data.get().filterCustom(function(trial){
            return trial.task == 'spanTest' && trial.block == 'span_mpl' && trial.subBlock == subBlockIntegerSpanMpl && trial.statusMPL == chosenStatus;
        });
        console.log("trialsSpanMPL is ", trialsSpanMpl);
        console.log("trialsSpanMPL.count() is (should be 1) ", trialsSpanMpl.count());
        let accuracy = accuracySpanSpan(trialsSpanMpl.select('answer').values[0], trialsSpanMpl.select('correct').values[0]);
        console.log("trialsSpanMpl.select('answer').values[0] is ", trialsSpanMpl.select('answer').values[0]);
        console.log("trialsSpanMpl.select('correct').values[0] is ", trialsSpanMpl.select('correct').values[0]);
        console.log("accuracy is ", accuracy);
        actual_payment_span_mpl = spanMplPayment_easy * accuracy;
        actual_payment_span_mpl = Math.min(actual_payment_span_mpl, 1);
        console.log("subBlock chosen for payment span_mpl is", subBlockIntegerSpanMpl, "and accuracy is ", accuracy);
    } 
    console.log("actual_payement_span_mpl is " + actual_payment_span_mpl);

    // mpl
    let actual_payment_mpl = 0;

    if (luckyPp == 1) { // 1 in propSelecForMPL chance of being selected for MPL payment
        const selectedRow = getRandomInt(0, lengthSurePayments); // select one of the 18 rows
        console.log("selectedRow is ", selectedRow);
        let selectedTrial = jsPsych.data.get().filterCustom(function(trial){
            return trial.task == 'mpl' && trial.block == 'span_mpl' && trial.subBlock == subBlockIntegerSpanMpl && trial.statusMPL == chosenStatus;
        });
        console.log(selectedTrial, "is the selectedTrial for mpl payment");
        console.log(selectedTrial.count(), "is selectedTrial count for mpl payment");
        let mplType = selectedTrial.select('mplType').values[0]; // should be the same for all trials in the subBlock
        console.log(mplType, "is the mplType for the selected trial");
        let choices = selectedTrial.select('choices').values[0];
        console.log(choices, "is the choices for the selected trial");
        actual_payment_mpl = calculateMPLPayment(mplType, selectedRow, choices, chosenStatus);
        actual_payment_mpl = Math.min(actual_payment_mpl, 44.5);
        console.log("actual_payment_mpl is", actual_payment_mpl)
        console.log("selectedRow is ", selectedRow, "and subBlockIntegerSpanMpl is", subBlockIntegerSpanMpl, "and luckyPp is ", luckyPp, "and chosenStatus is ", chosenStatus,
        "and choices are ", choices);
    }

        
    // Use the calculated payments
    trial.data = trial.data || {};
    trial.data.treatment = treatment;
    trial.data.versionFirst = block_order_indicator_span_MPL;
    trial.data.payment_calibration = actual_payment_calibration;
    trial.data.payment_span_span = actual_payment_span_span;
    trial.data.payment_span_mpl = actual_payment_span_mpl;
    trial.data.luckyPp = luckyPp;
    trial.data.payment_mpl = actual_payment_mpl;
    trial.data.helpPageCounter = helpPageCounter;
    const cCal  = actual_payment_calibration ?? 0;
    const cSpan = actual_payment_span_span ?? 0;
    const cSpanMpl = actual_payment_span_mpl ?? 0;
    const cMpl  = actual_payment_mpl ?? 0;
    trial.data.totalBonus = Math.min(cCal + cSpan + cSpanMpl + cMpl , 57.25); // cap total bonus at 57.25
    if (treatment == "hard") {
    trial.data.totalPayment = basePayment_hard + trial.data.totalBonus;}
    else if (treatment == "easy") {
    trial.data.totalPayment = basePayment_easy + trial.data.totalBonus;
}

    let html;
    if (treatment == "hard"){
        if (luckyPp == 1) {
                html = 
            `<h2>${language.debrief_incentives_span_mpl.title}</h2>
            <p>${language.debrief_incentives_span_mpl.calibrationPayment.replace('{trainingBonus}', Math.round(actual_payment_calibration*100)/100)}</p>
            <p>${language.debrief_incentives_span_mpl.spanSpanPayment_hard.replace('{spanSpanBonus}', Math.round(actual_payment_span_span*100)/100)}</p>
            <p>${language.debrief_incentives_span_mpl.selectedForMPL}</p>
            <p>${language.debrief_incentives_span_mpl.bonusSpanMPL.replace('{spanMplBonus}', Math.round((actual_payment_span_mpl + actual_payment_mpl)*100)/100).replace('{spanMPL}', Math.round(actual_payment_span_mpl*100)/100).replace('{mplBonus}', Math.round(actual_payment_mpl*100)/100)}</p>
            <p>${language.debrief_incentives_span_mpl.totalBonus.replace('{totalBonus}', Math.round(trial.data.totalBonus*100)/100)}</p>
            <p>${language.debrief_incentives_span_mpl.thanksAgain}</p>`;
        }
        else if (luckyPp != 1){
                html = 
            `<h2>${language.debrief_incentives_span_mpl.title}</h2>
            <p>${language.debrief_incentives_span_mpl.calibrationPayment.replace('{trainingBonus}', Math.round(actual_payment_calibration*100)/100)}</p>
            <p>${language.debrief_incentives_span_mpl.spanSpanPayment_hard.replace('{spanSpanBonus}', Math.round(actual_payment_span_span*100)/100)}</p>
            <p>${language.debrief_incentives_span_mpl.notSelectedForMPL}</p>
            <p>${language.debrief_incentives_span_mpl.bonusSpanWithoutMPL.replace('{spanMplBonus}', Math.round(actual_payment_span_mpl*100)/100)}</p>
            <p>${language.debrief_incentives_span_mpl.totalBonus.replace('{totalBonus}', Math.round((trial.data.totalBonus)*100)/100)}</p>
            <p>${language.debrief_incentives_span_mpl.thanksAgain}</p>`;
        }
    } else if (treatment == "easy"){
        if (luckyPp == 1) {
            html = 
            `<h2>${language.debrief_incentives_span_mpl.title}</h2>
            <p>${language.debrief_incentives_span_mpl.calibrationPayment.replace('{trainingBonus}', Math.round(actual_payment_calibration*100)/100)}</p>
            <p>${language.debrief_incentives_span_mpl.spanSpanPayment_hard.replace('{spanSpanBonus}', Math.round(actual_payment_span_span*100)/100)}</p>
            <p>${language.debrief_incentives_span_mpl.selectedForMPL}</p>
            <p>${language.debrief_incentives_span_mpl.bonusSpanMPL.replace('{spanMplBonus}', Math.round((actual_payment_span_mpl + actual_payment_mpl)*100)/100).replace('{spanMPL}',Math.round(actual_payment_span_mpl*100)/100).replace('{mplBonus}', Math.round(actual_payment_mpl*100)/100)}</p>
            <p>${language.debrief_incentives_span_mpl.totalBonus.replace('{totalBonus}', Math.round((trial.data.totalBonus)*100)/100)}</p>
            <p>${language.debrief_incentives_span_mpl.thanksAgain}</p>`;
        }
        else if (luckyPp != 1) {
                html = 
            `<h2>${language.debrief_incentives_span_mpl.title}</h2>
            <p>${language.debrief_incentives_span_mpl.calibrationPayment.replace('{trainingBonus}', Math.round(actual_payment_calibration*100)/100)}</p>
            <p>${language.debrief_incentives_span_mpl.spanSpanPayment_hard.replace('{spanSpanBonus}', Math.round(actual_payment_span_span*100)/100)}</p>
            <p>${language.debrief_incentives_span_mpl.notSelectedForMPL}</p>
            <p>${language.debrief_incentives_span_mpl.bonusSpanWithoutMPL.replace('{spanMplBonus}', Math.round(actual_payment_span_mpl*100)/100)}</p>
            <p>${language.debrief_incentives_span_mpl.totalBonus.replace('{totalBonus}', Math.round((trial.data.totalBonus)*100)/100)}</p>
            <p>${language.debrief_incentives_span_mpl.thanksAgain}</p>`;
        }
    }

    trial.stimulus = html; // set final display

     },
};



/* timelines flanker */

const practiceEasyBlock_nback_flanker = { ... timelineElementStructure, timeline_variables: nbackStimuli.stimuliPracticeEasy_flanker, timeline: [fixation, testNback, feedBackN, feedBackC, feedBackW]}
const practiceHardBlock_nback_flanker = { ... timelineElementStructure, timeline_variables: nbackStimuli.stimuliPracticeHard_flanker, timeline: [fixation, testNback, feedBackN, feedBackC, feedBackW] }

const easyBlock_nback_flanker = { ... timelineElementStructure, timeline_variables: nbackStimuli.stimuliEasy_flanker, timeline: [fixation, testNback, flanker_1, flanker_2, flanker_3, flanker_4, flanker_5, flanker_6] }
const hardBlock_nback_flanker = { ... easyBlock_nback_flanker, timeline_variables: nbackStimuli.stimuliHard_flanker,timeline: [fixation, testNback, flanker_7, flanker_8, flanker_9, flanker_10, flanker_11, flanker_12] }


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



const letter_proc = {
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
    timeline: [setup_fds, letter_proc, fds_response_screen]
};


const fds_calibration = {
    timeline: [fdsTotalTrialsTraining_update, staircase, feedback_span, staircase_assess],
    loop_function: function() {
        if((fdsTrialNum) == fdsTotalTrials +1) {
            if (currentSpan == 0 || currentSpan == 1) {
                startingSpan = 1}
            else if (currentSpan >= 2) {
                console.log("currentSpan before updating startingSpan is " + currentSpan);
                startingSpan = currentSpan -1;
                console.log("startingSpan is now " + startingSpan);
            }
            fdsTrialNum =1 ;
            idx = 0;
            exitLetters = 0;
            fdsTotalTrials = totalFdsSpanSpanTrials;
            maximumSpanCalibration = currentSpan;
            console.log("maximumSpanCalibration is " + maximumSpanCalibration);

            console.log("exiting fds_calibration, currentSpan is " + currentSpan);
            return false;
        } else {
            return true;
        }
    },
};


const fds_span_span_proc = {
    timeline: [ before_span_span1, letter_proc, before_span_span2, letter_proc, fds_response_screen_span_span1, fds_response_screen_span_span2],
    loop_function: function() {
        subBlock_span_span ++;
        console.log("subBlock_span_span is now " + subBlock_span_span);
        if((fdsTrialNum) == totalFdsSpanSpanTrials +1) {
            fdsTrialNum =1 ;
            idx = 0;
            exitLetters = 0;
            fdsTotalTrials = totalFdsSpanMplTrials;
            if (treatment == "easy") {
                startingSpan = 1;
                currentSpan = 1;
            }
            console.log("exiting fds_span_span_proc, currentSpan is " + currentSpan);
            return false;
        } else {
            return true;
        }
    },
}




const comprehensionQuestionsMPLLotteryWithCheck = {
    timeline: [
        comprehensionQuestionsMPLLottery,
            {
            timeline: [loopAgainSpanMpl],
            conditional_function: function() {
                const last = jsPsych.data.get().filter({task: 'comprehensionSurveyMPLLottery'}).last(1).values()[0];
                console.log("Checking comprehension results:", last);
                console.log("last.questions_correct.length is ", last.questions_correct.length);
                // Check if fewer than 4 questions were correct
                return last && last.questions_correct.length == 4;
            }
        },
        {
            timeline: [comprehensionFailureTrial],
            conditional_function: function() {
                const last = jsPsych.data.get().filter({task: 'comprehensionSurveyMPLLottery'}).last(1).values()[0];
                console.log("Checking comprehension results:", last);
                console.log("last.questions_correct.length is ", last.questions_correct.length);
                // Check if fewer than 4 questions were correct
                return last && last.questions_correct.length < 4;
            }
        }
    ],
    loop_function: function() {
        const last = jsPsych.data.get().filter({task: 'comprehensionSurveyMPLLottery'}).last(1).values()[0];
        return !(last && last.questions_correct.length === 5);
    }
};

const comprehensionQuestionsMPLMirrorWithCheck = {
    timeline: [
        comprehensionQuestionsMPLMirror,
        {
            timeline: [loopAgainSpanMpl],
            conditional_function: function() {
                const last = jsPsych.data.get().filter({task: 'comprehensionSurveyMPLMirror'}).last(1).values()[0];
                console.log("Checking comprehension results:", last);
                console.log("last.questions_correct.length is ", last.questions_correct.length);
                // Check if fewer than 4 questions were correct
                return last && last.questions_correct.length == 4;
            }
        },
        {
            timeline: [comprehensionFailureTrial],
            conditional_function: function() {
                const last = jsPsych.data.get().filter({task: 'comprehensionSurveyMPLMirror'}).last(1).values()[0];
                console.log("Checking comprehension results:", last);
                console.log("last.questions_correct.length is ", last.questions_correct.length);
                // Check if fewer than 4 questions were correct
                return last && last.questions_correct.length < 4;
            }
        }
    ],
        loop_function: function() {
        const last = jsPsych.data.get().filter({task: 'comprehensionSurveyMPLMirror'}).last(1).values()[0];
        return !(last && last.questions_correct.length === 5);
    }
};

const timelineTrainingSpanMPLTrial= {
    timeline : [blockIsTraining, mpl_trial_training],
    timeline_variables: training_mpl_html_array,
}
const timelineExampleSpanMPLTrialMirror= {
    timeline : [blockIsExample, introductionFinalExampleSpanMPL, setup_fds, letter_proc, mpl_trial, fds_response_screen, feedbackExampleSpanMPL, blockIsspan_mPLAndFdsTrialNumReset],
    timeline_variables: example_mpl_html_array_mirror,
}
const timelineExampleSpanMPLTrialLottery= {
    timeline : [blockIsExample, introductionFinalExampleSpanMPL, setup_fds, letter_proc, mpl_trial, fds_response_screen, feedbackExampleSpanMPL, blockIsspan_mPLAndFdsTrialNumReset],
    timeline_variables: example_mpl_html_array_lottery,
}
const timelineFirstInstructionsLottery = {
    timeline: [instructionsSpanMPLLottery, comprehensionQuestionsMPLLotteryWithCheck, instructionsChoosingASetOfBoxes, timelineTrainingSpanMPLTrial, instructionsIncentivesSpanMPL, timelineExampleSpanMPLTrialLottery],
    conditional_function: function() { return fdsTrialNum == 1; }
}
const timelineFirstInstructionsMirror = {
    timeline: [instructionsSpanMPLMirror, comprehensionQuestionsMPLMirrorWithCheck, instructionsChoosingASetOfBoxes, timelineTrainingSpanMPLTrial, instructionsIncentivesSpanMPL, timelineExampleSpanMPLTrialMirror],
    conditional_function: function() { return fdsTrialNum == 1; }
}
const timelineSecondInstructionsLottery = {
    timeline: [changePaymentRule, instructionsPaymentRuleLottery, comprehensionQuestionsMPLLotteryWithCheck],
    conditional_function: function() { return fdsTrialNum == 1; }
};
const timelineSecondInstructionsMirror = {
    timeline: [changePaymentRule, instructionsPaymentRuleMirror, comprehensionQuestionsMPLMirrorWithCheck],
    conditional_function: function() { return fdsTrialNum == 1; }
};
const timeline_spanMPL_lottery = {
    timeline: [fdsBlockToSpanMplAndSubBlockIncrementLottery, setup_fds, letter_proc, mpl_trial, fds_response_screen, { conditional_function: function() { return fdsTrialNum == totalFdsSpanMplTrials + 1; }, timeline: [fdsTrialNumResetAndSubBlockReset]}],
    timeline_variables: mpl_html_array_lottery,
    // conditional_function: function() { return treatment == "hard"; }
};
const timeline_spanMPL_mirror = {
    timeline: [fdsBlockToSpanMplAndSubBlockIncrementMirror, setup_fds, letter_proc, mpl_trial, fds_response_screen, { conditional_function: function() { return fdsTrialNum == totalFdsSpanMplTrials + 1; }, timeline: [fdsTrialNumResetAndSubBlockReset]}],
    timeline_variables: mpl_html_array_mirror,
    // conditional_function: function() { return treatment == "hard"; }
};


if (Math.random() < 0.5) {
    experimentBlocks_span_MPL = [timeline_spanMPL_lottery, timeline_spanMPL_mirror /*, timeline_spanMPL_easy_lottery, timeline_spanMPL_easy_mirror*/];
    block_order_indicator_span_MPL = "lottery_first";
    timeline_spanMPL_lottery.timeline.splice(1, 0, timelineFirstInstructionsLottery);
    timeline_spanMPL_mirror.timeline.splice(1, 0, timelineSecondInstructionsMirror);
    console.log(block_order_indicator_span_MPL)
    
} else {
    experimentBlocks_span_MPL = [timeline_spanMPL_mirror, timeline_spanMPL_lottery /*, timeline_spanMPL_easy_mirror, timeline_spanMPL_easy_lottery*/];
    block_order_indicator_span_MPL = "mirror_first";
    timeline_spanMPL_mirror.timeline.splice(1, 0, timelineFirstInstructionsMirror);
    timeline_spanMPL_lottery.timeline.splice(1, 0, timelineSecondInstructionsLottery);
    console.log(block_order_indicator_span_MPL);
}

const experiment_span_MPL = {
    timeline: experimentBlocks_span_MPL,
}

const uncertaintyTrials = [cognitiveUncertaintyMirror, cognitiveUncertaintyLottery];
if (Math.random() < 0.5) {
    uncertaintyTrials.reverse();
}
const timelineUncertainty = {
    timeline: uncertaintyTrials
};


const easyBlock_nback_span = { ... timelineElementStructure, timeline_variables: nbackStimuli.stimuliEasy_span, timeline: [fixation, testNback, fds_calibration] }
const hardBlock_nback_span = { ... timelineElementStructure, timeline_variables: nbackStimuli.stimuliHard_span, timeline: [fixation, testNback, fds_calibration] }

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




// const prolific_redirect = {
//     type: "html-keyboard-response",
//     stimulus: function() {
//         return `<p>${language.redirectProlific}</p>`;
//     },
//     choices: jsPsych.NO_KEYS,
//     trial_duration: 3000,
//     data: {task: 'prolific_redirect'},
//     on_finish: function() {
//         // End the JATOS study first, then redirect
//         // jatos.endStudy(jsPsych.data.get().json(), true);
//         jatos.endStudyAndRedirect("https://www.prolific.com/participants", jsPsych.data.get().json());
//     }
//     };

/* main timeline */ 

jsPsych.data.addProperties({subject: subjectId});

timeline.push({type: "fullscreen", fullscreen_mode: true}, welcome, consentForm, demographics_age_loop, demographics, instructionsBeforeCalibration, fds_calibration, calibrationDebrief,
    instructionsSpanSpan, fds_span_span_proc, spanSpanDebrief, fdsTrialNumReset, experiment_span_MPL, timelineUncertainty, incentives_span_mpl, /* 
descriptionExperimentNback, instructions_NbackVisual, startPractice, loopPracticeNbackVisual_nback_nback, passPracAndPracIndReset, experiment_nback_nback, */
    /*instructions_span, experiment_nback_span, incentives_span_mpl,
    instructions_flanker_1, flanker_practice, afterFlankerPractice, experiment_nback_flanker, debriefBlock, incentives_nback_nbackVisual*/);
// instructions, instructions_flanker_1, experiment, debriefBlock.

/*************** EXPERIMENT START AND DATA UPDATE ***************/

jatos.onLoad(() => {
    jsPsych.init({
        timeline: timeline,
        on_finish: function() {
            jatos.endStudy(jsPsych.data.get().json());
            //jsPsych.data.get().localSave("csv", `span_Subject_${subjectId}_${level}back_output.csv`);
        }
    });
});