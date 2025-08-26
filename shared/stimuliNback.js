// function setArrays (){
//     nbackStimuli = {};
//     nbackStimuli.stimuliFirstBlock = [];
//     nbackStimuli.stimuliSecondBlock = [];
//     nbackStimuli.stimuliPractice = [];
//     nbackStimuli.correctResponse;
//     nbackStimuli.target;
//   }
function setArrays (){
    nbackStimuli = {};
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
    nbackStimuli.stimuliHardOverallTraining = [];
    nbackStimuli.stimuliEasyOverallTraining = [];
    nbackStimuli.correctResponse;
    nbackStimuli.target;
  }
  
  function defineNullBack() {
    nbackStimuli.practiceList = ["B", "P", "X", "K", "H", "M", "Q", "X", "N","T"];
    nbackStimuli.stimuliListFirstBlock = ["R", "B", "Q", "N", "Q", "K", "X", "X", "N", "R", "B", "X", "M", "H", "X", "T", "R", "X", "P", "P", "M", "M", "Q", "K", "T", "P", "X", "H", "N", "T", "X", "H", "Q", "N", "R", "K", "M", "K", "B", "X", "K", "T", "B", "X", "R", "P", "N", "H", "B", "X"];
    nbackStimuli.stimuliListSecondBlock = ["H", "Q", "X", "R", "M", "R", "Q", "H", "Q", "X", "H", "T", "X", "Q", "B", "N", "K", "P", "K", "R", "B", "X", "R", "X", "X", "N", "K", "X", "P", "N", "P", "X", "T", "P", "T", "B", "H", "M", "M", "Q", "N", "M", "K", "X", "H", "M", "T", "X", "B", "P"]
  }
  
  function defineEasyBack() {
    nbackStimuli.practiceListEasy_flanker = ['A', 'U', 'A', 'M', 'M', 'U', 'U', 'U', 'U', 'E', 'E', 'O', 'O', 'U', 'U', 'U', 'U', 'B', 'B', 'Y']; // 10 1-back, 5 2-backs
    nbackStimuli.stimuliListEasy_flanker = ['C', 'C', 'C', 'C', 'K', 'Y', 'P', 'I', 'O', 'O', 'C', 'O', 'C', 'B', 'B', 'B', 'O', 'O', 'O', 'E', 'B', 'B', 'B', 'B', 'Y', 'B', 'B', 'Y', 'B', 'Y', 'B', 'C', 'C', 'B', 'U', 'U', 'M', 'C', 'O', 'U', 'I', 'U', 'O', 'O', 'O', 'I', 'O', 'A', 'I', 'A', 'I', 'M', 'U', 'U', 'U', 'Y', 'C', 'K', 'C', 'M', 'O', 'O', 'O'];
    nbackStimuli.practiceListEasy_span =  ['B', 'B', 'B', 'Y', 'Y', 'Y', 'U', 'U', 'B', 'B', 'C', 'E', 'G', 'E', 'E', 'C', 'C', 'C', 'C', 'Y'];
    nbackStimuli.stimuliListEasy_span = ['U', 'B', 'B', 'B', 'B', 'I', 'I', 'M', 'K', 'U', 'Y', 'U', 'K', 'B', 'O', 'P', 'P', 'P', 'P', 'A', 'P', 'E', 'E', 'B', 'B', 'P', 'P', 'P', 'M', 'U', 'M', 'B', 'B', 'B', 'B', 'O', 'E', 'Y', 'E', 'E', 'M', 'E', 'A', 'Y', 'G', 'Y', 'B', 'G', 'I', 'I', 'I', 'I', 'U', 'A', 'A', 'A', 'U', 'A', 'U', 'Y', 'K', 'Y', 'K'];
    nbackStimuli.practiceListEasy_nback = ['M', 'I', 'I', 'P', 'G', 'G', 'G', 'A', 'A', 'A', 'U', 'G', 'G', 'G', 'I', 'C', 'C', 'C', 'C', 'O'];
    nbackStimuli.stimuliListEasy_nback = ['C', 'C', 'G', 'G', 'G', 'I', 'A', 'E', 'A', 'E', 'A', 'O', 'O', 'P', 'P', 'E', 'P', 'O', 'G', 'O', 'G', 'C', 'B', 'A', 'C', 'C', 'I', 'I', 'I', 'G', 'Y', 'Y', 'Y', 'Y', 'C', 'Y', 'U', 'Y', 'U', 'K', 'I', 'K', 'U', 'Y', 'Y', 'Y', 'G', 'U', 'U', 'U', 'U', 'M', 'M', 'A', 'A', 'A', 'M', 'A', 'O', 'A', 'G', 'G', 'U'] // 20 1-back, 20 2-backs
    nbackStimuli.stimuliListEasyOverallTraining =['T', 'A', 'U', 'Q', 'P', 'B', 'C', 'T', 'A', 'U', 'Q', 'P', 'B', 'C']

  }
  
  function defineHard2Back() {
    nbackStimuli.practiceListHard_flanker = ['O', 'O', 'O', 'A', 'O', 'A', 'B', 'Y', 'B', 'Y', 'B', 'B', 'I', 'K', 'I', 'K', 'K', 'Y', 'K', 'Y']; // 10 2-backs, 4 1-backs and 4 3-backs
    nbackStimuli.stimuliListHard_flanker = ['G', 'C', 'G', 'C', 'P', 'C', 'P', 'G', 'C', 'E', 'M', 'C', 'M', 'E', 'M', 'E', 'O', 'U', 'O', 'U', 'O', 'O', 'U', 'U', 'U', 'K', 'Y', 'P', 'O', 'P', 'P', 'O', 'A', 'I', 'I', 'Y', 'B', 'B', 'K', 'B', 'K', 'A', 'K', 'K', 'K', 'I', 'U', 'E', 'U', 'C', 'C', 'U', 'P', 'P', 'B', 'P', 'C', 'P', 'I', 'P']; // 20 2 backs, 10 1 backs and 10 3-backs
    nbackStimuli.practiceListHard_span = ['C', 'C', 'M', 'C', 'M', 'C', 'C', 'C', 'P', 'C', 'U', 'A', 'E', 'K', 'E', 'K', 'E', 'K', 'E', 'E'];
    nbackStimuli.stimuliListHard_span = ['U', 'U', 'Y', 'P', 'Y', 'P', 'Y', 'P', 'Y', 'I', 'B', 'I', 'I', 'I', 'C', 'K', 'K', 'I', 'Y', 'Y', 'G', 'A', 'G', 'G', 'G', 'Y', 'U', 'O', 'Y', 'K', 'O', 'K', 'K', 'Y', 'E', 'Y', 'E', 'Y', 'E', 'E', 'K', 'C', 'B', 'B', 'E', 'B', 'C', 'E', 'P', 'C', 'P', 'C', 'U', 'P', 'U', 'B', 'E', 'A', 'E', 'A', 'B', 'C', 'E'];
    nbackStimuli.practiceListHard_nback = ['A', 'A', 'Y', 'A', 'Y', 'G', 'G', 'G', 'O', 'G', 'O', 'G', 'O', 'K', 'O', 'K', 'I', 'O', 'I', 'I'];
    nbackStimuli.stimuliListHard_nback = ['M', 'P', 'M', 'M', 'P', 'U', 'C', 'C', 'U', 'K', 'P', 'G', 'P', 'G', 'K', 'U', 'G', 'O', 'O', 'G', 'G', 'G', 'O', 'C', 'M', 'C', 'B', 'B', 'C', 'B', 'I', 'O', 'I', 'O', 'I', 'O', 'I', 'O', 'O', 'A', 'I', 'O', 'I', 'A', 'I', 'A', 'E', 'A', 'E', 'B', 'U', 'B', 'U', 'I', 'I', 'U', 'U', 'U', 'B', 'A', 'I', 'E', 'U'];
    nbackStimuli.stimuliListHardOverallTraining =['T', 'A', 'U', 'Q', 'P', 'B', 'C', 'T', 'A', 'U', 'Q', 'P', 'B', 'C']
  }
  
  function defineHard3Back() {
    console.log("function defineHard3Back runs")
    nbackStimuli.practiceListHard_flanker =  ['K', 'A', 'K', 'A', 'A', 'C', 'A', 'A', 'C', 'K', 'K', 'M', 'P', 'K', 'M', 'P', 'P', 'M', 'P', 'P']; // 10 3-backs, 4 2-backs and 4 4-backs
    nbackStimuli.stimuliListHard_flanker = ['G', 'Y', 'G', 'G', 'P', 'I', 'U', 'G', 'I', 'A', 'I', 'M', 'C', 'A', 'A', 'A', 'A', 'B', 'A', 'C', 'P', 'E', 'A', 'B', 'E', 'C', 'B', 'E', 'C', 'B', 'C', 'E', 'B', 'M', 'G', 'C', 'M', 'Y', 'E', 'M', 'E', 'Y', 'E', 'M', 'Y', 'M', 'I', 'A', 'G', 'I', 'E', 'G', 'E', 'E', 'B', 'G', 'O', 'B', 'M', 'G', 'B', 'M', 'G']; // 20 3-backs, 10 2-backs and 10 4-backs
    nbackStimuli.practiceListHard_span = ['P', 'C', 'P', 'P', 'C', 'P', 'P', 'C', 'E', 'E', 'P', 'E', 'E', 'P', 'P', 'G', 'C', 'C', 'G', 'C'];
    nbackStimuli.stimuliListHard_span = ['G', 'E', 'K', 'G', 'O', 'K', 'G', 'G', 'O', 'M', 'G', 'U', 'G', 'U', 'A', 'O', 'G', 'B', 'O', 'U', 'E', 'C', 'E', 'E', 'C', 'O', 'I', 'B', 'O', 'I', 'B', 'O', 'O', 'B', 'O', 'B', 'A', 'A', 'B', 'O', 'M', 'P', 'O', 'O', 'M', 'P', 'O', 'I', 'P', 'I', 'P', 'P', 'Y', 'Y', 'Y', 'O', 'P', 'U', 'O', 'P', 'O', 'Y', 'O'];
    nbackStimuli.practiceListHard_nback = ['G', 'M', 'G', 'G', 'M', 'G', 'G', 'M', 'A', 'G', 'G', 'A', 'G', 'G', 'A', 'M', 'M', 'M', 'I', 'G'];
    nbackStimuli.stimuliListHard_nback = ['K', 'P', 'G', 'E', 'K', 'G', 'E', 'O', 'C', 'G', 'O', 'O', 'P', 'O', 'A', 'C', 'C', 'A', 'Y', 'Y', 'A', 'Y', 'Y', 'B', 'A', 'P', 'I', 'B', 'E', 'O', 'B', 'Y', 'M', 'A', 'Y', 'M', 'M', 'Y', 'M', 'G', 'P', 'G', 'P', 'P', 'Y', 'M', 'A', 'M', 'B', 'M', 'P', 'B', 'M', 'M', 'B', 'M', 'E', 'M', 'M', 'I', 'G', 'I', 'I']
    nbackStimuli.stimuliListHardOverallTraining =['T', 'A', 'U', 'Q', 'P', 'B', 'C', 'T', 'A', 'U', 'Q', 'P', 'B', 'C']
  }
  
  /* 63 n-back stimuli: 10 before each target task (6 target tasks of 15 seconds each = 1min 30) + 3 at the end so participants are incentivized to keep the letters in mind for the last task. */