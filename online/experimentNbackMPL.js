/* 
Created by Teodora Vekony (vekteo@gmail.com)
MEMO Team (PI: Dezso Nemeth)
Lyon Neuroscience Research Center
Universite Claude Bernard Lyon 1

Github:https://github.com/vekteo/Nback_JSPsych
*/

/* experiment 5 : compared to experiment 4 (old 3_2), the goal is to randomize the order of the blocks, (1-back and 3 back). There is not anymore firstBlock and secondBlock but easyBlock and hardBlock */

/*************** VARIABLES nback ***************/

let nbackStimuli = {};
let instruction;
let timeline = [];
const buttonToPressForTarget = ["f","j"];
const trialStructure = { type: "html-keyboard-response" };
const subjectId = jsPsych.randomization.randomID(15)
let nbackCounter = 0; // the counter for each n-back trial


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



if (level == 0) {
  instruction_hard = language.instructions0back
} else if (level == 1) {
  instruction_hard = language.instructions1back
} else if (level == 2) {
  instruction_hard = language.instructions2back
} else if (level == 3) {
  instruction_hard = language.instructions3back
}

taskEasy = language.task1back
console.log(language.task1back)
if (level == 0) {
  taskHard = language.task1back
} else if (level == 1) {
  taskHard = language.task1back
} else if (level == 2) {
  taskHard = language.task2back
} else if (level == 3) {
  taskHard= language.task3back
}

/*************** Instructions ***************/


const welcome = {
  type: "instructions",
  pages: [
      `<h1>${language.welcomePage.welcome}</h1><br><p>${language.welcomePage.clickNext}</p>`],
  show_clickable_nav: true,
  button_label_next: language.button.next,
  button_label_previous: language.button.previous,
}

const instructions_easy = {
  type: "instructions",
  pages: [
      `<p>${language.instructions1back.letter}</p><p>${language.instructions1back.yourTask1}</p><p>${language.instructions1back.yourTask2}</p><p>${language.generalInstruction.fastAndAccurate}</p>${language.instructions1back.image}<p>${language.generalInstruction.clickNext}</p>`
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
}

const instructions_hard = {
  type: "instructions",
  pages: [
      `<p>${instruction_hard.letter}</p><p>${instruction_hard.yourTask1}</p><p>${instruction_hard.yourTask2}</p><p>${language.generalInstruction.fastAndAccurate}</p>${instruction_hard.image}<p>${language.generalInstruction.clickNext}</p>`
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
const startPractice = {... trialStructure, stimulus: `<p>${language.practice.practice}</p><p>${language.practice.startPractice}<p>`};
const afterPracticeEasy = {... trialStructure, stimulus: `<h2>${language.practice.end}</h2><p>${taskEasy.start}</p><p>${taskEasy.remember1}</p><p>${taskEasy.remember2}</p><p>${taskEasy.press}<p>` };
const afterPracticeHard = {... trialStructure, stimulus: `<h2>${language.practice.end}</h2><p>${taskHard.start}</p><p>${taskHard.remember1}</p><p>${taskHard.remember2}</p><p>${taskHard.press}<p>` };



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
                        nbackStimuli.correctResponse;
                        nbackStimuli.target;
                          */

defineEasyBack()
console.log(nbackStimuli.practiceListEasy_flanker, "is nbackStimuli.practiceListEasy_flanker")

if (level === 2) {
    defineHard2Back(); 
} else if (level === 3) {
    defineHard3Back();
} // these functions define nbackStimuli.practiceListHard and nbackStimuli.stimuliListHard


createBlocks(nbackStimuli.practiceListEasy_flanker, nbackStimuli.stimuliPracticeEasy_flanker, 1)
createBlocks(nbackStimuli.practiceListHard_flanker, nbackStimuli.stimuliPracticeHard_flanker, level)
createBlocks(nbackStimuli.stimuliListHard_flanker, nbackStimuli.stimuliHard_flanker, level)
createBlocks(nbackStimuli.stimuliListEasy_flanker,nbackStimuli.stimuliEasy_flanker, 1)
createBlocks(nbackStimuli.practiceListEasy_span, nbackStimuli.stimuliPracticeEasy_span, 1)
createBlocks(nbackStimuli.practiceListHard_span, nbackStimuli.stimuliPracticeHard_span, level)
createBlocks(nbackStimuli.stimuliListHard_span, nbackStimuli.stimuliHard_span, level)
createBlocks(nbackStimuli.stimuliListEasy_span,nbackStimuli.stimuliEasy_span, 1)

// previoulsy "createBlocks(nbackStimuli.stimuliListSecondBlock, nbackStimuli.stimuliSecondBlock, level)"

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
  stimulus: `<div style="font-size:40px; color: green">${language.feedback.correct}</div>`,
  choices: jsPsych.NO_KEYS,
  trial_duration: feedBackDuration,
  data: {test_part: 'feedback_nback'}
}
const feedbackWrong = { ... feedbackCorrect, stimulus: `<div style="font-size:40px; color: red">${language.feedback.wrong}</div>` }
const feedbackNo = { ... feedbackCorrect, stimulus: `<div style="font-size:40px; color: red">${language.feedback.noResponse}</div>` }

/* define task trials for n-back*/

const fixation = {
  ... trialStructure,
  stimulus: '<div style="font-size:30px;">+</div>',
  choices: jsPsych.NO_KEYS,
  trial_duration: fixationDuration,
  data: {test_part: 'fixation_nback'}
}

const test = {
  ... trialStructure,
  stimulus: jsPsych.timelineVariable('stimulus'),
  choices: buttonToPressForTarget,
  data: jsPsych.timelineVariable('data'),
  trial_duration: letterDuration,
  stimulus_duration: letterDuration,
  on_finish: function(data){
    nbackCounter ++ ; 
    data.task = 'n-back'
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
  },
}

// const everyTenTrials = {
//     ... trialStructure,
//     stimulus: "<p>Conditional task test. Press any key to continue. </p>", 
//     on_start: function(trial){
//       console.log("Checking if nbackCounter == 10, 20, 30...");
//     }
//   }

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
    total_flanker_hard = total_flanker
    total_flanker = 0
    nbackCounter = 0
    console.log(total_flanker_hard, "is total_flanker_hard at the end of the hard block")
  }
}

const afterEasyBlock_flanker = {
  ... trialStructure,
  stimulus: "",
  trial_duration:0,
  on_start: function () {
    console.log("afterEasyBlock activated")
    total_flanker_easy = total_flanker
    total_flanker = 0
    nbackCounter = 0
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
                '<b style="color:blue;">3</b>, you would respond with <b style="color:blue;">1</b>, <b style="color:blue;">2</b>, <b style="color:blue;">3</b></p>',
    choices: ["Continue"]
}

// const letter_fds_vis_practice = {
//     type: 'html-keyboard-response',
//     stimulus: function(){return stimList[idx];},
//     choices: jsPsych.NO_KEYS,
//     trial_duration: 500,
//     post_trial_gap: 250,
//     on_finish: function(){
//         idx += 1; //update the index
//         //check to see if we are at the end of the letter array
//         if (idx == stimList.length) {
//             exitLetters = 1;
//         } else	{
//             exitLetters = 0;
//         }
//     }
// };

// const fds_response_screen_practice = {
//     type: 'html-keyboard-response',
//     stimulus: response_grid,
//     choices: ['Enter'],
//         on_finish: function(data){
//             var curans = response;
//             var corans = fds_correct_ans;
//             if(JSON.stringify(curans) === JSON.stringify(corans)) {
//                 var gotItRight = 1;
//                 console.log("correct");
//                 staircaseChecker[staircaseIndex] = 1;
//             } else {
//                 var gotItRight = 0;
//                 console.log("incorrect");
//                 staircaseChecker[staircaseIndex] = 0;
//             }
//             response = []; //clear the response for the next trial
//             staircaseIndex += 1; //update the staircase index
//             console.log(staircaseChecker);
    
//             jsPsych.data.addDataToLastTrial({
//                 designation: 'FDS-RESPONSE',
//                 span: currentSpan,
//                 answer: curans,
//                 correct: corans,
//                 was_correct: gotItRight,
//                 spanHistory: spanHistory,
//                 task: "span"
//             });
//         }
// };

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

  

//set-up screen
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
      fdsTrialNum = 1
      nbackCounter = 0
    }
  }

const afterHardBlock_span = {
    ... trialStructure,
    stimulus: "",
    trial_duration: 0,
    on_start: function () {
      console.log("afterHardBlock activated")
      fdsTrialNum = 1
      nbackCounter = 0
    }
  }

/* define conditional timeline elements for practice */

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
  ... trialStructure,
  stimulus: function () {
    let nth;
    switch (block_order) {
      case 0:
        nth = "first";
        break;
      case 1:
        nth = "second";
        break;
      case 2:
        nth = "third";
        break;
      case 3:
        nth = "fourth";
        break;
      default:
        nth = "unknown";
    }
    return `<p>This is the ${nth} block. Press any key to continue.</p>`;
  }
}
// const everyTenTrials = {
//     ... trialStructure,
//     stimulus: "<p>Conditional task test. Press any key to continue. </p>", 
//     on_start: function(trial){
//       console.log("Checking if nbackCounter == 10, 20, 30...");
//     }
//   }

// MPL trials and timeline, 

// let sure_payments = [];
// for (var i = 20; i >= 1; i--) {
//   sure_payments.push(i);
// }
// let mpl_table = `
//   <table border="1" style="border-collapse: collapse; text-align: center;">
//     <tr><th>Row</th><th>Lottery</th><th>Sure payment</th><th>Choice</th></tr>
//     ${sure_payments.map((amount, i) => `
//       <tr>
//         <td>${i+1}</td>
//         <td>50% chance to win 20€, else 0€</td>
//         <td>${amount}€ for sure</td>
//         <td>
//           <input type="radio" name="row${i}" value="A" required> A
//           <input type="radio" name="row${i}" value="B" required> B
//         </td>
//       </tr>
//     `).join('')}
//   </table>
// `;

// const mpl_trial = {
//   type: 'survey-html-form',
//   html: mpl_table,
//   on_load: function() {
//     console.log("on_load function functions")
//   }
// };

// Data setup
function surePaymentsGenerator(x) { // add that it can't go under 0
  let payments = []; // Create a local array
  for (let i = x + 10; i >= (x-10); i--) {
    payments.push(i);
  };
  console.log(payments);
  return payments; 
}

let sure_payments = [];
function mplGenerator(G, y) {
  // Map G to multiplier
  const multipliers = {
    G: 0.25,
    L: -0.25,
    A: 0
  };

  let x = (multipliers[G] || 0) * y;

  // Generate sure payment values
  sure_payments = surePaymentsGenerator(x);

  // HTML generation
  let rows = sure_payments.map((amt, i) => `
    <tr>
      <td>${i + 1}</td>
      <td class="choice" data-row="${i}" data-choice="lottery">
        $25
        <input type="radio" name="row${i}" value="lottery">
      </td>
      <td class="mirror" data-row="${i}">$0</td>
      <td class="choice" data-row="${i}" data-choice="sure">
        $${amt}
        <input type="radio" name="row${i}" value="sure">
      </td>
    </tr>
  `).join('');

  let mpl_html = `
    <p>Please make your choices. Once you switch from the sure payment to the lottery (or vice versa), all later rows will be selected automatically.</p>
    <table class="mpl">
      <tr>
        <th></th>
        <th colspan="2">Set A</th>
        <th>Set B</th>
      </tr>
      <tr>
        <th>Version</th>
        <th>${y} boxes</th>
        <th>${100-y} boxes</th>
        <th>100 boxes</th>
      </tr>
      ${rows}
    </table>
  `;

  return mpl_html;
}



let mpl_html = mplGenerator("L", 75)

// ------------------------------
// JSPSYCH TRIAL
// ------------------------------

const mpl_trial = {
  type: 'survey-html-form',
  html: mpl_html,
  on_load: function() {

    function selectRow(row, choice) {
        document.querySelectorAll(`.choice[data-row="${row}"]`)
          .forEach(b => b.classList.remove('selected'));
        let cell = document.querySelector(`.choice[data-row="${row}"][data-choice="${choice}"]`);
        cell.classList.add('selected');
        cell.querySelector('input').checked = true;
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
        console.log(row, "is row of choice")
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
        for (let r = row + 1; r < sure_payments.length; r++) {
          selectRow(r, otherChoice);
          if (choice == "lottery"){
            document.querySelector(`.mirror[data-row="${r}"]`).classList.remove('selected')
          }
          if (choice == "sure") {
            document.querySelector(`.mirror[data-row="${r}"]`).classList.add('selected')
          }        }
      });
    });
  },

  
  on_finish: function(data) {
    // Parse the responses JSON
    console.log(data)
    let responses_mpl = JSON.parse(data.responses);
    console.log(data.responses)

    // Determine switching row
    let prevChoice = null;
    let switchRow = null;
    let choicesArray = [];

    for (var i = 0; i < sure_payments.length; i++) {
      let choice = responses_mpl[`row${i}`];
      choicesArray.push(choice);
      if (prevChoice && choice !== prevChoice && switchRow === null) {
        switchRow = i + 1; // +1 for human-readable row index
      }
      prevChoice = choice;
    }

    data.switch_row = switchRow; // null means no switch
    console.log(switchRow)
    data.choices = choicesArray;
    console.log(choicesArray)
    data.sure_payments = sure_payments;
    console.log(sure_payments)
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
// const practiceBlock = { ... timelineElementStructure, timeline_variables: nbackStimuli.stimuliPractice, timeline: [fixation, test, feedBackN, feedBackC, feedBackW] }
// const firstBlock = { ... timelineElementStructure, timeline_variables: nbackStimuli.stimuliFirstBlock, timeline: [fixation, test, everyTenT] }
// const secondBlock = { ... firstBlock, timeline_variables: nbackStimuli.stimuliSecondBlock }


const practiceEasyBlock_nback_flanker = { ... timelineElementStructure, timeline_variables: nbackStimuli.stimuliPracticeEasy_flanker, timeline: [fixation, test, feedBackN, feedBackC, feedBackW]}
const practiceHardBlock_nback_flanker = { ... timelineElementStructure, timeline_variables: nbackStimuli.stimuliPracticeHard_flanker, timeline: [fixation, test, feedBackN, feedBackC, feedBackW] }

const easyBlock_nback_flanker = { ... timelineElementStructure, timeline_variables: nbackStimuli.stimuliEasy_flanker, timeline: [fixation, test, flanker_1, flanker_2, flanker_3, flanker_4, flanker_5, flanker_6] }
const hardBlock_nback_flanker = { ... easyBlock_nback_flanker, timeline_variables: nbackStimuli.stimuliHard_flanker,timeline: [fixation, test, flanker_7, flanker_8, flanker_9, flanker_10, flanker_11, flanker_12] }

const practiceAndTestEasy_nback_flanker = {
  timeline: [block_indicator, instructions_easy, startPractice, practiceEasyBlock_nback_flanker, afterPracticeEasy, easyBlock_nback_flanker, afterEasyBlock_flanker],
  repetitions: 1,
  randomize_order: false,
  on_start: function () {
    blockEasy = 1;
  },
  on_finish: function () {
    block_order++;
  }
};

const practiceAndTestHard_nback_flanker = {
  timeline: [block_indicator, instructions_hard, startPractice, practiceHardBlock_nback_flanker, afterPracticeHard, hardBlock_nback_flanker, afterHardBlock_flanker],
  repetitions: 1,
  randomize_order: false,
  on_start: function () {
    blockEasy = 0;
    console.log("practiceAndTestHard")
  },
  on_finish: function () {
    block_order++;
  }
};


if (Math.random() < 0.5) {
  experimentBlocks_nback_flanker = [practiceAndTestHard_nback_flanker, practiceAndTestEasy_nback_flanker];
} else {
  experimentBlocks_nback_flanker = [practiceAndTestEasy_nback_flanker, practiceAndTestHard_nback_flanker];
}

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
      return trial.hit === 1 || trial.correct_rejection === 1;
  })
    let accuracy = Math.round(correct_trials.count()/trials.count() * 100);
    let rt = Math.round(correct_trials.select('rt').mean());

    return `
    <h2>${language.end.end}</h2>
    <p>${language.feedback.accuracy}${accuracy}${language.feedback.accuracy2}</p>
    <p>${language.feedback.rt}${rt}${language.feedback.rt2}</p>
    <p>${language.end.thankYou}</p>`;
  },
  trial_duration: 3000,
  on_finish: function(trial) { statCalculation(trial) }
};


// span timelines

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

const easyBlock_nback_span = { ... timelineElementStructure, timeline_variables: nbackStimuli.stimuliEasy_span, timeline: [fixation, test, fds_mainproc] }
const hardBlock_nback_span = { ... timelineElementStructure, timeline_variables: nbackStimuli.stimuliHard_span, timeline: [fixation, test, fds_mainproc] }

const practiceEasyBlock_nback_span = { ... timelineElementStructure, timeline_variables: nbackStimuli.stimuliPracticeEasy_span, timeline: [fixation, test, feedBackN, feedBackC, feedBackW]}
const practiceHardBlock_nback_span = { ... timelineElementStructure, timeline_variables: nbackStimuli.stimuliPracticeHard_span, timeline: [fixation, test, feedBackN, feedBackC, feedBackW] }

const practiceAndTestEasy_nback_span = {
  timeline: [block_indicator, instructions_easy, startPractice, practiceEasyBlock_nback_span, afterPracticeEasy, easyBlock_nback_span, afterEasyBlock_span],
  repetitions: 1,
  randomize_order: false,
  on_start: function () {
    blockEasy = 1;
    console.log("practiceAndTestEasy span")
  },
  on_finish: function () {
    block_order++; // unused variable, could be deleted
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
    block_order++;
  }
};

if (Math.random() < 0.5) { experimentBlocks_nback_span = [practiceAndTestHard_nback_span, practiceAndTestEasy_nback_span];} 
else { experimentBlocks_nback_span = [practiceAndTestEasy_nback_span, practiceAndTestHard_nback_span]; }

const experiment_nback_span = {
timeline: experimentBlocks_nback_span,
randomize_order: true,
};


/* main timeline */ 

jsPsych.data.addProperties({subject: subjectId});
timeline.push({type: "fullscreen", fullscreen_mode: false}, mpl_trial, welcome, instructions_span, fds_practiceproc, experiment_nback_span, instructions_flanker_1, flanker_practice, afterFlankerPractice, /*startPractice, practiceBlock, afterPractice, firstBlock, betweenBlockRest, ready, secondBlock,*/ experiment_nback_flanker,  debriefBlock, {type: "fullscreen", fullscreen_mode: false});
// instructions, instructions_flanker_1, experiment, debriefBlock.

/*************** EXPERIMENT START AND DATA UPDATE ***************/

jsPsych.init({
  timeline: timeline,
  on_data_update: function() {
    let interactionData = jsPsych.data.getInteractionData()
    const interactionDataOfLastTrial = interactionData.filter({'trial': jsPsych.data.get().last(1).values()[0].trial_index}).values();
    if (interactionDataOfLastTrial) {
        jsPsych.data.get().last(1).values()[0].browser_events = JSON.stringify(interactionDataOfLastTrial)
    }
  },
  on_close: function() {
    jsPsych.data.get().localSave("csv", `NBack_Subject_${subjectId}_${level}back_quitted_output.csv`);
  },
  on_finish: function() {
    jsPsych.data.get().localSave("csv", `NBack_Subject_${subjectId}_${level}back_output.csv`);
  }
});

