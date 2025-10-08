let sure_payments = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
let Y_valuesMPL = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50];

function mplGenerator(y, X, condition) {
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
    // let endowmentsMPL = language.endowmentsMPL[Xy];
    let endowmentsMPL = "";
    if (condition == "mirror") {
        endowmentsMPL = language.endowmentsMPL.mirror[Xy];
    } else if (condition == "lottery") {
        endowmentsMPL = language.endowmentsMPL.lottery[Xy];
    }

  // Generate sure payment values
    let rows = ``;
    let mpl_html = ``;
    if (X == "G" || X == "L") {
        // HTML generation
        rows = sure_payments.map((amt, i) => `
        <tr>
            <td>${i + 1}</td>
            <td class="choice" data-row="${i}" data-choice="lottery" style="color: red">
            ${sign}$25
            <input type="radio" name="row${i}" value="lottery">
            </td>
            <td class="mirror" data-row="${i}" style="color: red">$0</td>
            <td class="choice" data-row="${i}" data-choice="sure" style="color: blue">
            ${sign}$${amt}
            <input type="radio" name="row${i}" value="sure">
            </td>
        </tr>
        `).join('');

        mpl_html = `
        <div style="width: 50vw; margin: auto;">
        <ul>
        <li>${language.instructionsMPL.makeChoice}</li><br>
        <li>${language.instructionsMPL.computerChooses}</li><br>
        <li><span style="color: green">${endowmentsMPL}</span></li><br>
        </ul></div>

        <table class="mpl" data-mpl-type="${X}${y}">
            <tr>
            <th></th>
            <th colspan="2" style="color: red">Lot A</th>
            <th style="color: blue">Lot B</th>
            </tr>
            <tr>
            <th>Version</th>
            <th style="color: red">${y} boites</th>
            <th style="color: red">${100-y} boites</th>
            <th style="color: blue">100 boites</th>
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
            <td class="choice" data-row="${i}" data-choice="lottery" style="color: red">
            $${amt} <input type="radio" name="row${i}" value="lottery">
            </td>
            <td class="mirror" data-row="${i}" style="color: red">$-${y}</td>
            <td class="choice" data-row="${i}" data-choice="sure" style="color: blue">
            $0
            <input type="radio" name="row${i}" value="sure">
            </td>
        </tr>
        `).join('');

        mpl_html = `

        <div style="width: 50vw; margin: auto;">
        <ul>
        <li>${language.instructionsMPL.makeChoice}</li><br>
        <li>${language.instructionsMPL.computerChooses}</li><br>
        <li><span style="color: green">${endowmentsMPL}</span></li><br>
        </ul></div>

        <table class="mpl" data-mpl-type="${X}${y}">
            <tr>
            <th></th>
            <th colspan="2" style="color: red">Set A</th>
            <th style="color: blue">Set B</th>
            </tr>
            <tr>
            <th>Version</th>
            <th style="color: red">50 boxes</th>
            <th style="color: red">50 boxes</th>
            <th style="color: blue">100 boxes</th>
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
    
    // Shuffle the main array directly
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    
    // Now randomly select 2 different indices to duplicatte
    let firstIndex = Math.floor(Math.random() * 12);
    let secondIndex;
    do {
        secondIndex = Math.floor(Math.random() * 12);
    } while (secondIndex === firstIndex);
    
    // Add the duplicates at the end
    arr.push(arr[firstIndex]);
    arr.push(arr[secondIndex]);
    
    return arr;
}

function calculateMPLPayment(mplType, rowNumber, choices, chosenStatus) {
    console.log("Beginning of calculateMPLPayment with parameters: mplType is", mplType, "rowNumber is", rowNumber, "choices are", choices, "chosenStatus is", chosenStatus);
    const type = mplType.charAt(0);
    const probability = parseInt(mplType.substring(1));
    let sure = choices[rowNumber]; // either "sure" or "lottery"
    if (sure == "sure") {
        if (type == "G") {
            return sure_payments[rowNumber] + 5;
        } else if (type == "L") {
            return -sure_payments[rowNumber] + 30;
        }
        else if (type == "A") {
            return probability + 5;
        }
    } else if (sure == "lottery") {
            if (chosenStatus == "lottery") {
            let randomDraw = Math.random(); // Random number between 0 and 1
            if (type == "G") {
                if (randomDraw <= (probability / 100)) {
                    return 25 + 5;
                }
                else if (randomDraw > (probability / 100)) {
                    return 0 + 5;
                }
            } else if (type == "L") {
                if (randomDraw <= (probability / 100)) {
                    return -25 + 30;
                } 
                else if (randomDraw > (probability / 100)) {
                    return 0 + 30;
                }
            } else if (type == "A") {
                if (randomDraw <= 0.5) {
                    return Y_valuesMPL[rowNumber] + probability + 5;
                } else if (randomDraw > 0.5) {
                    return 5;
                }
            }
        }
        else if (chosenStatus == "mirror") {
            if (type == "G") {
                return (probability/100) * 25 + 5;
            } else if (type == "L") {
                return - (probability/100) * 25 + 30;
            } else if (type == "A") {
                let endow = 0;
                if (probability == 10) { endow  = 15;}
                else if (probability == 15) { endow = 20;}
                return (((Y_valuesMPL[rowNumber] - probability)/2) + endow);
            }
        } 
    }
}

// function calculateMPLPayment(mplType, rowNumber, choices, chosenStatus) {
//     console.log("=== calculateMPLPayment DEBUG START ===");
//     console.log("Input parameters:");
//     console.log("  mplType:", mplType);
//     console.log("  rowNumber:", rowNumber);
//     console.log("  choices:", choices);
//     console.log("  chosenStatus:", chosenStatus);
    
//     const type = mplType.charAt(0);
//     const probability = parseInt(mplType.substring(1));
//     let sure = choices[rowNumber]; // either "sure" or "lottery"
    
//     console.log("Parsed values:");
//     console.log("  type:", type);
//     console.log("  probability:", probability);
//     console.log("  sure (choice at rowNumber):", sure);
    
//     if (sure == "sure") {
//         console.log("BRANCH: sure == 'sure'");
//         if (type == "G") {
//             console.log("  SUB-BRANCH: type == 'G'");
//             console.log("  sure_payments[rowNumber]:", sure_payments[rowNumber]);
//             const result = sure_payments[rowNumber] + 5;
//             console.log("  RETURN VALUE:", result, "(sure_payments[" + rowNumber + "] + 5)");
//             return result;
//         } else if (type == "L") {
//             console.log("  SUB-BRANCH: type == 'L'");
//             console.log("  sure_payments[rowNumber]:", sure_payments[rowNumber]);
//             const result = -sure_payments[rowNumber] + 30;
//             console.log("  RETURN VALUE:", result, "(-sure_payments[" + rowNumber + "] + 30)");
//             return result;
//         }
//         else if (type == "A") {
//             console.log("  SUB-BRANCH: type == 'A'");
//             console.log("  Y_valuesMPL[rowNumber]:", Y_valuesMPL[rowNumber]);
//             console.log("  probability:", probability);
//             const result = probability + 5;
//             console.log("  RETURN VALUE:", result, "(Y_valuesMPL[" + rowNumber + "] + " + probability + " + 5)");
//             return result;
//         }
//     } else if (sure == "lottery") {
//         console.log("BRANCH: sure == 'lottery'");
//         console.log("  chosenStatus:", chosenStatus);
        
//         if (chosenStatus == "lottery") {
//             console.log("  SUB-BRANCH: chosenStatus == 'lottery'");
//             let randomDraw = Math.random();
//             console.log("  randomDraw:", randomDraw);
            
//             if (type == "G") {
//                 console.log("    TYPE: G (Gains)");
//                 console.log("    probability/100:", probability/100);
//                 if (randomDraw <= (probability / 100)) {
//                     const result = 25 + 5;
//                     console.log("    LOTTERY WIN: RETURN VALUE:", result, "(25 + 5)");
//                     return result;
//                 }
//                 else if (randomDraw > (probability / 100)) {
//                     const result = 0 + 5;
//                     console.log("    LOTTERY LOSE: RETURN VALUE:", result, "(0 + 5)");
//                     return result;
//                 }
//             } else if (type == "L") {
//                 console.log("    TYPE: L (Losses)");
//                 console.log("    probability/100:", probability/100);
//                 if (randomDraw <= (probability / 100)) {
//                     const result = -25 + 30;
//                     console.log("    LOTTERY WIN (bad outcome): RETURN VALUE:", result, "(-25 + 30)");
//                     return result;
//                 } 
//                 else if (randomDraw > (probability / 100)) {
//                     const result = 0 + 30;
//                     console.log("    LOTTERY LOSE (good outcome): RETURN VALUE:", result, "(0 + 30)");
//                     return result;
//                 }
//             } else if (type == "A") {
//                 console.log("    TYPE: A (Ambiguity)");
//                 if (randomDraw <= 0.5) {
//                     console.log("    Y_valuesMPL[rowNumber]:", Y_valuesMPL[rowNumber]);
//                     const result = Y_valuesMPL[rowNumber] + probability + 5;
//                     console.log("    AMBIGUITY OUTCOME 1: RETURN VALUE:", result, "(Y_valuesMPL[" + rowNumber + "] + " + probability + " + 5)");
//                     return result;
//                 } else if (randomDraw > 0.5) {
//                     const result = 2 * probability + 5;
//                     console.log("    AMBIGUITY OUTCOME 2: RETURN VALUE:", result, "(5)");
//                     return result;
//                 }
//             }
//         }
//         else if (chosenStatus == "mirror") {
//             console.log("  SUB-BRANCH: chosenStatus == 'mirror'");
//             if (type == "G") {
//                 console.log("    TYPE: G (Gains) - Mirror");
//                 console.log("    probability:", probability);
//                 const result = (probability/100) * 25 + 5;
//                 console.log("    MIRROR RETURN VALUE:", result, "(" + probability + " * 25 + 5)");
//                 return result;
//             } else if (type == "L") {
//                 console.log("    TYPE: L (Losses) - Mirror");
//                 console.log("    probability:", probability);
//                 const result = - (probability/100) * 25 + 30;
//                 console.log("    MIRROR RETURN VALUE:", result, "(-" + probability + " * 25 + 30)");
//                 return result;
//             } else if (type == "A") {
//                 console.log("    TYPE: A (Ambiguity) - Mirror");
//                 let endow = 0;
//                 if (probability == 10) { endow = 15; }
//                 else if (probability == 15) { endow = 20; }
//                 console.log("    probability:", probability);
//                 console.log("    endow:", endow);
//                 console.log("    Y_valuesMPL[rowNumber]:", Y_valuesMPL[rowNumber]);
//                 const result = -probability + Y_valuesMPL[rowNumber] + endow;
//                 console.log("    MIRROR RETURN VALUE:", result, "(-" + probability + " + Y_valuesMPL[" + rowNumber + "] + " + endow + ")");
//                 return result;
//             }
//         } 
//     }
    
//     console.log("ERROR: No condition matched, returning undefined!");
//     console.log("=== calculateMPLPayment DEBUG END ===");
//     return undefined;
// }