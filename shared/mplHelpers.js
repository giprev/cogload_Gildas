let sure_payments = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
let Y_valuesMPL = [-24, -22, -20, -18, -16, -14, -12, -10, -8, -6, -4, -2, 0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24];

function mplGenerator(y, X) {
    let sign = "";
    if (X == "G") {
        sign = "";
    }
    else if (X == "L") {
        sign = "-";
    }
    else if (X == "A") {
        sign = "";
    }
    else {
        console.log("sign error for the lottery");
    }

    // Dynamically assign endowmentsMPL based on parameters
    let Xy = X + y; // e.g., "G75" or "L75"
    let endowmentsMPL = language.endowmentsMPL[Xy];


  // Generate sure payment values
    let rows = ``;
    let mpl_html = ``;
    if (X == "G" || X == "L") {
        // HTML generation
        rows = sure_payments.map((amt, i) => `
        <tr>
            <td>${i + 1}</td>
            <td class="choice" data-row="${i}" data-choice="lottery">
            ${sign}$25
            <input type="radio" name="row${i}" value="lottery">
            </td>
            <td class="mirror" data-row="${i}">$0</td>
            <td class="choice" data-row="${i}" data-choice="sure">
            ${sign}$${amt}
            <input type="radio" name="row${i}" value="sure">
            </td>
        </tr>
        `).join('');

        mpl_html = `
        <p>${language.instructionsMPL.makeChoice}</p>
        <table class="mpl" data-mpl-type="${X}${y}">
        <tr>
        <span style="color: green">${endowmentsMPL}</span>
        </tr>
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
    }
    else if (X == "A") {
        // HTML generation
        rows = Y_valuesMPL.map((amt, i) => `
        <tr>
            <td>${i + 1}</td>
            <td class="choice" data-row="${i}" data-choice="lottery">
            $${sign}${amt} <input type="radio" name="row${i}" value="lottery">
            </td>
            <td class="mirror" data-row="${i}">$${y}</td>
            <td class="choice" data-row="${i}" data-choice="sure">
            $0
            <input type="radio" name="row${i}" value="sure">
            </td>
        </tr>
        `).join('');

        mpl_html = `
        <p> ${language.instructionsMPL.makeChoice}</p>
        <table class="mpl" data-mpl-type="${X}${y}">
        <tr>
        <span style="color: green">${endowmentsMPL}</span>
        </tr>
            <tr>
            <th></th>
            <th colspan="2">Set A</th>
            <th>Set B</th>
            </tr>
            <tr>
            <th>Version</th>
            <th>50 boxes</th>
            <th>50 boxes</th>
            <th>100 boxes</th>
            </tr>
            ${rows}
        </table>
        `;
    }
  return mpl_html;
}

function generateShuffledArray() {
    // Create base array 1-12
    let arr = Array.from({length: 12}, (_, i) => i + 1);
    // Create array of indices [0,1,2,...,11] and shuffle it
    let shuffledIndices = Array.from({length: 12}, (_, i) => i);
    for (let i = shuffledIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledIndices[i], shuffledIndices[j]] = [shuffledIndices[j], shuffledIndices[i]];
    }
    // Take first 2 indices (guaranteed to be different)
    let [firstIndex, secondIndex] = shuffledIndices;
    // Add the duplicates
    arr.push(arr[firstIndex]);
    arr.push(arr[secondIndex]);
    // Shuffle the final array
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
