function createBlocks(list, stimuli, level){
  for (let i = 0; i < list.length; i++) {

    if (level === 0){
      targetStimulus = "X"
    }
    else {
      targetStimulus = list[i-level];
    }

    if(i > 0) {
      if (list[i] === targetStimulus){
        correctResponse = "j" 
        target = 1;
      } else {
        correctResponse = "f"
        target = 0;
      }
    } else {
      correctResponse = "f"
      target = 0;
    }


    if (list === nbackStimuli.stimuliListEasy_flanker || list === nbackStimuli.stimuliListEasy_span || list === nbackStimuli.stimuliListEasy_nback){
      block = "main_easy"
    } else if (list === nbackStimuli.stimuliListHard_flanker || list === nbackStimuli.stimuliListHard_span || list === nbackStimuli.stimuliListHard_nback){
      block = "main_hard"
    } else if (list === nbackStimuli.practiceListEasy_flanker || list === nbackStimuli.practiceListEasy_span || list === nbackStimuli.practiceListEasy_nback) {
      block = "practice_easy"
    } else if (list === nbackStimuli.practiceListHard_flanker || list === nbackStimuli.practiceListHard_span || list === nbackStimuli.practiceListHard_nback) {
      block = "practice_hard"
    } else if (list === nbackStimuli.stimuliListEasyOverallTraining) {
      block = "overall_training_easy"
    } else if (list === nbackStimuli.stimuliListHardOverallTraining) {
      block = "overall_training_hard"
    } else {
      block = "practice or error for letter nback"
      console.log("Block assignment error for list:", list)
    }

    let newElement = { stimulus: "<p class='stimulus'>" + list[i]+ "</p>" /*+ "<br></br><p> Press either the key f or the key j. </p>" */, data: { test_part: 'test nback', level: level, correct_response: correctResponse, block: block, trial_number: i+1, target: target, letter: list[i], task: "nback" } }
    stimuli.push(newElement)
  }
}

function createBlocksVisual(list, stimuli, level){
  for (let i = 0; i < list.length; i++) {

    if (level === 0){
      targetStimulus = "X"
    }
    else {
      targetStimulus = list[i-level];
    }

    if(i > 0) {
      if (list[i] === targetStimulus){
        correctResponse = "j" 
        target = 1;
      } else {
        correctResponse = "f"
        target = 0;
      }
    } else {
      correctResponse = "f"
      target = 0;
    }
    
    if (list == stimuliList_nbackVisual_1){
      block = "nbackVisual_easy1"}
    else if (list == stimuliList_nbackVisual_2){
      block = "nbackVisual_easy2"}
    else if (list == stimuliList_nbackVisual_3){
      block = "nbackVisual_easy3"}
    else if (list == stimuliList_nbackVisual_4){
      block = "nbackVisual_easy4"}
    else if (list == stimuliList_nbackVisual_5){
      block = "nbackVisual_easy5"}
    else if (list == stimuliList_nbackVisual_6){
      block = "nbackVisual_easy6"}
    else if (list == stimuliList_nbackVisual_7){
      block = "nbackVisual_hard7"}
    else if (list == stimuliList_nbackVisual_8){
      block = "nbackVisual_hard8"}
    else if (list == stimuliList_nbackVisual_9){
      block = "nbackVisual_hard9"}
    else if (list == stimuliList_nbackVisual_10){
      block = "nbackVisual_hard10"}
    else if (list == stimuliList_nbackVisual_11){
      block = "nbackVisual_hard11"}
    else if (list == stimuliList_nbackVisual_12){
      block = "nbackVisual_hard12"}
    else if (list == stimuliList_nbackVisualOverallPractice){
      block = "nbackVisual_overall_practice"}
    else {block = "practice or error for visual nback"}

    // console.log(list[i], "is list[i]")
    let newElement = { stimulus: list[i] /*+ "<br></br><p class='comment'> Press either the key f or the key j. </p>"*/, data: { test_part: 'test_nbackVisual', level: level, correct_response: correctResponse, block: block, trial_nback_number: i+1, target: target, point_location: i, task: "nbackVisual" } }
    stimuli.push(newElement)
  }
}