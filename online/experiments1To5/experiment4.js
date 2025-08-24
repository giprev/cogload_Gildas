/* 
Created by Teodora Vekony (vekteo@gmail.com)
MEMO Team (PI: Dezso Nemeth)
Lyon Neuroscience Research Center
Universite Claude Bernard Lyon 1

Github:https://github.com/vekteo/Nback_JSPsych
*/

/* experiment 3.2 : flanker inserted in between n-back */

/*************** VARIABLES ***************/

let nbackStimuli = {};
let instruction;
let timeline = [];
const buttonToPressForTarget = ["f","j"];
const trialStructure = { type: "html-keyboard-response" };
const subjectId = jsPsych.randomization.randomID(15)
let nbackCounter = 0; // the counter for each n-back trial

if (level == 0) {
  instruction = language.instructions0back
} else if (level == 1) {
  instruction = language.instructions1back
} else if (level == 2) {
  instruction = language.instructions2back
} else if (level == 3) {
  instruction = language.instructions3back
}

const instructions = {
  type: "instructions",
  pages: [
      `<h1>${language.welcomePage.welcome}</h1><br><p>${language.welcomePage.clickNext}</p>`,
      `<p>${instruction.letter}</p><p>${instruction.yourTask1}</p><p>${instruction.yourTask2}</p><p>${language.generalInstruction.fastAndAccurate}</p>${instruction.image}<p>${language.generalInstruction.clickNext}</p>`
  ],
  show_clickable_nav: true,
  button_label_next: language.button.next,
  button_label_previous: language.button.previous
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
const startPractice = {... trialStructure, stimulus: `<p>${language.practice.practice}</p><p>${language.practice.startPractice}<p>`}
const afterPractice = {... trialStructure, stimulus: `<h2>${language.practice.end}</h2><p>${language.task.start}</p><p>${language.task.press}<p>` };



/*create blocks*/

setArrays() 

if (level === 0) {
    defineNullBack()
} else if (level === 1) {
    defineOneBack()
} else if (level === 2) {
    defineTwoBack()
} else if (level === 3) {
    defineThreeBack()
}

createBlocks(nbackStimuli.practiceList, nbackStimuli.stimuliPractice, level)
createBlocks(nbackStimuli.stimuliListFirstBlock, nbackStimuli.stimuliFirstBlock, level)
createBlocks(nbackStimuli.stimuliListSecondBlock, nbackStimuli.stimuliSecondBlock, level)


/* define practice feedback trials */

const feedbackCorrect = {
  ... trialStructure,
  stimulus: `<div style="font-size:40px; color: green">${language.feedback.correct}</div>`,
  choices: jsPsych.NO_KEYS,
  trial_duration: feedBackDuration,
  data: {test_part: 'feedback'}
}

const feedbackWrong = { ... feedbackCorrect, stimulus: `<div style="font-size:40px; color: red">${language.feedback.wrong}</div>` }
const feedbackNo = { ... feedbackCorrect, stimulus: `<div style="font-size:40px; color: red">${language.feedback.noResponse}</div>` }

/* define task trials */

const fixation = {
  ... trialStructure,
  stimulus: '<div style="font-size:30px;">+</div>',
  choices: jsPsych.NO_KEYS,
  trial_duration: fixationDuration,
  data: {test_part: 'fixation'}
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

/* define the functions for the flanker task */

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

const everyTenT = {
    timeline: [trial_flanker, feedback_flanker ],
    timeline_variables: practice_array, // ou array of stimuli
      conditional_function: function () {
          return nbackCounter > 0 && nbackCounter % 10 === 0
      }
  }

/*************** TIMELINE ***************/
 
const timelineElementStructure = {
    repetitions: 1,
    randomize_order: false,
}

const practiceBlock = { ... timelineElementStructure, timeline_variables: nbackStimuli.stimuliPractice, timeline: [fixation, test, feedBackN, feedBackC, feedBackW] }
const firstBlock = { ... timelineElementStructure, timeline_variables: nbackStimuli.stimuliFirstBlock, timeline: [fixation, test, everyTenT] }
const secondBlock = { ... firstBlock, timeline_variables: nbackStimuli.stimuliSecondBlock }


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

jsPsych.data.addProperties({subject: subjectId});
timeline.push({type: "fullscreen", fullscreen_mode: false}, /*instructions, instructions_flanker_1, startPractice, practiceBlock,*/ afterPractice, firstBlock, betweenBlockRest, ready, secondBlock, debriefBlock, {type: "fullscreen", fullscreen_mode: false});

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

