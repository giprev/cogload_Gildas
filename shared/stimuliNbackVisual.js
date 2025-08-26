

function makeGridWithDot(index) {
    let html = '<div class="grid">';
    for (let i = 0; i < 9; i++) {
      html += '<div class="cell">';
      if (i === index) {
        html += '<div class="dot"></div>';
      }
      html += '</div>';
    }
    html += '</div>';
    return html;
  }

  // Make 9 different stimuli
  const st0 = makeGridWithDot(0);
  const st1 = makeGridWithDot(1);
  const st2 = makeGridWithDot(2);
  const st3 = makeGridWithDot(3);
  const st4 = makeGridWithDot(4);
  const st5 = makeGridWithDot(5);
  const st6 = makeGridWithDot(6);
  const st7 = makeGridWithDot(7);
  const st8 = makeGridWithDot(8);


let  stimuliList_nbackVisual_practice = [st3, st3, st1, st5, st5, st4, st8, st4, st8, st8, st3, st7, st7, st5, st5, st4, st2, st4, st4, st1]; // 6 1-backs, 3 2-backs, no three consecutive letters(this line counted by myself)

let stimuliList_nbackVisualOverallPractice= [st6, st6, st2, st6, st2, st6, st6, st8, st3, st3]; // Overall training visual stimuli: 3 1-backs, 2 2-backs

let  stimuliList_nbackVisual_1 = [st5, st5, st1, st5, st1, st5, st4, st4, st1, st1]; // 3 1-backs, 3 2-backs, no three consecutive letters
let  stimuliList_nbackVisual_2 = [st6, st6, st4, st6, st4, st4, st2, st2, st6, st2];
let  stimuliList_nbackVisual_3 = [st2, st2, st8, st2, st8, st2, st3, st3, st5, st5]; 
let  stimuliList_nbackVisual_4 = [st1, st6, st1, st6, st6, st1, st6, st6, st1, st1]; 
let  stimuliList_nbackVisual_5 = [st4, st4, st2, st2, st8, st8, st6, st8, st6, st8];
let  stimuliList_nbackVisual_6 = [st7, st7, st5, st7, st8, st8, st3, st8, st3, st3]; 
let  stimuliList_nbackVisual_7 = [st7, st7, st5, st5, st8, st5, st8, st5, st7, st7]; 
let  stimuliList_nbackVisual_8 = [st5, st5, st7, st5, st7, st1, st1, st6, st1, st1];
let  stimuliList_nbackVisual_9 = [st7, st7, st2, st2, st8, st2, st8, st2, st3, st3];
let  stimuliList_nbackVisual_10 = [st7, st7, st2, st7, st7, st3, st3, st7, st3, st7];
let  stimuliList_nbackVisual_11 = [st6, st5, st5, st6, st6, st5, st6, st5, st6, st6];
let  stimuliList_nbackVisual_12 = [st7, st3, st3, st5, st3, st3, st4, st3, st4, st4];

let stimuli_nback_practice =[];
let stimuli_nback_1 = [];
let stimuli_nback_2 = [];
let stimuli_nback_3 = [];
let stimuli_nback_4 = [];
let stimuli_nback_5 = [];
let stimuli_nback_6 = [];
let stimuli_nback_7 = [];
let stimuli_nback_8 = [];
let stimuli_nback_9 = [];
let stimuli_nback_10 = [];
let stimuli_nback_11 = [];
let stimuli_nback_12 = [];