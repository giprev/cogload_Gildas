//function to push button responses to array
var recordClick = function(elm) {
    response.push(Number($(elm).text()))
    document.getElementById("echoed_txt").innerHTML = response;
};

//function to clear the response array
var clearResponse = function() {
    response = [];
    document.getElementById("echoed_txt").innerHTML = response;
};

//function to map digit names to audio files (for auditory BDS)
var digitToFile = function (digit) {
    return folder + fileMap[digit];
};

// var staircase_assess = {
//     type: 'call-function',
//     func: updateSpan
// };

//function to shuffle an array (Fisher-Yates)
function shuffle(a) {
	var j, x, i;
	for (i = a.length - 1; i > 0; i--) {
		j = Math.floor(Math.random() * (i + 1));
		x = a[i];
		a[i] = a[j];
		a[j] = x;
	}
	return a;
}

//function to get digit list for a trial
function getDigitList(len) {
	var shuff_final = [];
	//shuffle the digit list
	if(len <= digit_list.length) {
		shuff_final = shuffle(digit_list);
	} else {
		//this is overkill (generating too many digits) but it works and we slice it later anyway
		for (var j=0; j<len; j++){
			var interim_digits = shuffle(digit_list);
			shuff_final = [...shuff_final, ...interim_digits];
		}
	}
	var digitList = shuff_final.slice(0,len); //array to hold the final digits
	return digitList;
}

//function to push the stimuli to an array
function getStimuli(numDigits) {
	var digit;
	var stimList = [];
	currentDigitList = getDigitList(numDigits);
	for (var i = 0; i < currentDigitList.length; i += 1) {
		if (useAudio) {
			digit = currentDigitList[i];
			stimList.push(digitToFile(digit));
		} else {
			digit = currentDigitList[i].toString();
			stimList.push('<p style="font-size:60px;font-weight:600;">' + digit + '</p>');
		}
	}
	fds_correct_ans = currentDigitList; //this is the reversed array for assessing performance
	return stimList;
}

//function to update the span as appropriate (using a 1:2 staircase procedure)
function updateSpan() {
	//if they got the last trial correct, increase the span.
	if (arrSum(staircaseChecker) == 1) {
		currentSpan += 1; //add to the span if last trial was correct
		staircaseChecker = []; //reset the staircase checker
		staircaseIndex = 0; //reset the staircase index
		//if they got the last two trials incorrect, decrease the span
	} else if (arrSum(staircaseChecker) == 0) {
		if(staircaseChecker.length == 2) {
			currentSpan -= 1; //lower the span if last two trials were incorrect
			if (currentSpan == 0) {
				currentSpan = 1; //make sure the experiment cannot break with exceptionally poor performance (floor of 1 digit)
			}
			staircaseChecker = []; //reset the staircase checker
			staircaseIndex = 0; //reset the staircase index
		}
	} else {
		return false;
	}
};

function updateTotalTrials() {
    fdsTotalTrials = 2
}