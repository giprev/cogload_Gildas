const sure_payments = [25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
const Y_valuesMPL = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50];
let helpPageCounter = 0;
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
    let endowmentValue = "";
    if (X == "G"){ endowmentValue = 5;}
    else if (X == "L") { endowmentValue = 30;}
    else if (X == "A" && y == 10) { endowmentValue = 15;}
    else if (X == "A" && y == 15) { endowmentValue = 20;}

  // Generate sure payment values
    let rows = ``;
    let mpl_html = ``;
    if (X == "L") {
        // HTML generation
        rows = sure_payments.map((amt, i) => `
        <tr>
            <td>${i + 1}</td>
            <td class="choice" data-row="${i}" data-choice="lottery" style="color: red">
            ${sign}25€
            <input type="radio" name="row${i}" value="lottery">
            </td>
            <td class="mirror" data-row="${i}" style="color: red">0€</td>
            <td class="choice" data-row="${i}" data-choice="sure" style="color: blue">
            ${sign}${amt}€
            <input type="radio" name="row${i}" value="sure">
            </td>
        </tr>
        `).join('');

        mpl_html = `
        <div style="width: 50vw; margin: auto;">
        <h2> <span style="color: green">Somme initiale: ${endowmentValue}€ </span></h2>
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
            <th style="color: red">${y} boîtes</th>
            <th style="color: red">${100-y} boîtes</th>
            <th style="color: blue">100 boîtes</th>
            </tr>
            ${rows}
        </table>
        `;
    }
    else if (X == "G") {
        // HTML generation
        rows = sure_payments.map((amt, i) => `
        <tr>
            <td>${i + 1}</td>
            <td class="choice" data-row="${i}" data-choice="lottery" style="color: red">
            ${sign}25€
            <input type="radio" name="row${i}" value="lottery">
            </td>
            <td class="mirror" data-row="${i}" style="color: red">
            0€</td>
            <td class="choice" data-row="${i}" data-choice="sure" style="color: blue">
            ${sign}${26 - amt}€
            <input type="radio" name="row${i}" value="sure">
            </td>
        </tr>
        `).join('');

        mpl_html = `
        <div style="width: 50vw; margin: auto;">
        <h2> <span style="color: green">Somme initiale: ${endowmentValue}€ </span></h2>
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
            <th style="color: red">${y} boîtes</th>
            <th style="color: red">${100-y} boîtes</th>
            <th style="color: blue">100 boîtes</th>
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
            ${amt}€ <input type="radio" name="row${i}" value="lottery">
            </td>
            <td class="mirror" data-row="${i}" style="color: red">-${y}€</td>
            <td class="choice" data-row="${i}" data-choice="sure" style="color: blue">
            0€
            <input type="radio" name="row${i}" value="sure">
            </td>
        </tr>
        `).join('');

        mpl_html = `

        <div style="width: 50vw; margin: auto;">
        <h2> <span style="color: green">Somme initiale: ${endowmentValue}€ </span></h2>
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
            <th style="color: red">50 boîtes</th>
            <th style="color: red">50 boîtes</th>
            <th style="color: blue">100 boîtes</th>
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
            return sure_payments[24 - rowNumber] + 5;
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

function generateHTML(setALabel = "Set A", setBLabel = "Set B") {
        // Generate 100 squares for each set
        let setASquares = '';
        let setBSquares = '';
        
        for (let i = 0; i < 100; i++) {
            setASquares += '<div class="squareMPL square-a"></div>';
            setBSquares += '<div class="squareMPL square-b"></div>';
        }
        //             ${this.styles}
        return `

            <div class="squares-container">
                <div class="square-set set-a">
                    <h3>${setALabel}</h3>
                    <div class="squares-grid grid-a">
                        ${setASquares}
                    </div>
                </div>
                
                <div class="square-set set-b">
                    <h3>${setBLabel}</h3>
                    <div class="squares-grid grid-b">
                        ${setBSquares}
                    </div>
                </div>
            </div>
        `;
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
function showInstructionModal() {
    helpPageCounter ++;
    console.log("helpPageCounter is ", helpPageCounter);
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
        background-color: rgba(0,0,0,0.5); z-index: 2000; 
        display: flex; justify-content: center; align-items: center;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white; padding: 20px; border-radius: 8px; 
        max-width: 80%; max-height: 80%; overflow-y: auto;
        position: relative;
    `;
    
    // You can customize the help content based on the current block type
    let helpContent = '';
    let spanPayment = 0;
    if (treatment == "hard"){
        spanPayment = spanMplPayment_hard;
    }
    else if (treatment == "easy"){
        spanPayment = spanMplPayment_easy;
    }
    if (statusMPL === "mirror") {
        helpContent = 
        `<h2>${language.instructionsDecisionTable.title}</h2>
        <h3>${language.instructionsBoxesWithMoney.subTitle}</h3>
        <p>${language.instructionsBoxesWithMoney.initialSum}</p>
        <p>${language.instructionsBoxesWithMoney.chooseSet}</p>
        ${generateHTML("Lot A", "Lot B")}
        <p>${language.instructionsBoxesWithMoney.choice}</p>
        <p>${language.instructionsBoxesWithMoney.moneyInside}</p>
        <h3>${language.instructionsDecisionTable.subTitle}</h3>
        <p>${language.instructionsDecisionTable.description}</p>
        ${example1MPL.replace('width: 50vw; margin: auto;', 'width: 100%; margin: 0;')}
        <p>${language.instructionsDecisionTable.exampleAbove}</p>
        <p>${language.instructionsDecisionTable.exampleBelow}</p>
        ${example2MPL.replace('width: 50vw; margin: auto;', 'width: 100%; margin: 0;')}
        <p>${language.instructionsDecisionTable.clickToChoose}</p>
        ${example1MPLSelected.replace('width: 50vw; margin: auto;', 'width: 100%; margin: 0;')}
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
         <h3>${language.instructionsChoosingASetOfBoxes.subTitle}</h3>
        <p>${language.instructionsChoosingASetOfBoxes.description}</p>
        <p>${language.instructionsChoosingASetOfBoxes.example1}</p>
        ${example5MPL.replace('width: 50vw; margin: auto;', 'width: 100%; margin: 0;')}
        <p>${language.instructionsChoosingASetOfBoxes.chooseSet}</p>
        ${example5MPLSelected.replace('width: 50vw; margin: auto;', 'width: 100%; margin: 0;')}
        <p>${language.instructionsChoosingASetOfBoxes.example2}</p>
        <p>${language.instructionsChoosingASetOfBoxes.computerOnlyOneChoice}</p>
        <h3>${language.instructionsChoosingASetOfBoxes.severalTables}</h3>
        <p>${language.instructionsChoosingASetOfBoxes.severalTablesDescription}</p>
        <p>${language.instructionsChoosingASetOfBoxes.incentivesMPL}</p>
        <h3>${language.instructionsSpanInMPL.subTitle}</h3>
        <p>${language.instructionsSpanInMPL.MPLInSpan}</p>
        <p>${language.instructionsSpanInMPL.MPLInSpanRepeat}</p>
        <p>${language.instructionsSpanInMPL.priority}</p>
        <h3>${language.instructionsSpanInMPL.incentives}</h3>
        <p>${language.instructionsSpanInMPL.incentivesSpan.replace("{bonusSpan}", spanPayment)}</p>
        <p>${language.instructionsSpanInMPL.incentivesSpanDetails}</p>
        <p>${language.instructionsSpanInMPL.incentiveSpanExample.replace("{bonusSpan}", spanPayment).replace("{examplePaymentSpan}", Math.round((spanPayment * 0.8)*100)/100)}</p>
        <p>${language.instructionsSpanInMPL.randomMechanism}</p>
         `;
        
    } else if (statusMPL === "lottery") {
        helpContent = 
        `<h2>${language.instructionsDecisionTable.title}</h2>
        <h3>${language.instructionsBoxesWithMoney.subTitle}</h3>
        <p>${language.instructionsBoxesWithMoney.initialSum}</p>
        <p>${language.instructionsBoxesWithMoney.chooseSet}</p>
        ${generateHTML("Lot A", "Lot B")}
        <p>${language.instructionsBoxesWithMoney.choice}</p>
        <p>${language.instructionsBoxesWithMoney.moneyInside}</p>
        <h3>${language.instructionsDecisionTable.subTitle}</h3>
        <p>${language.instructionsDecisionTable.description}</p>
        ${example1MPL.replace('width: 50vw; margin: auto;', 'width: 100%; margin: 0;')}
        <p>${language.instructionsDecisionTable.exampleAbove}</p>
        <p>${language.instructionsDecisionTable.exampleBelow}</p>
        ${example2MPL.replace('width: 50vw; margin: auto;', 'width: 100%; margin: 0;')}
        <p>${language.instructionsDecisionTable.clickToChoose}</p>
        ${example1MPLSelected.replace('width: 50vw; margin: auto;', 'width: 100%; margin: 0;')}
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
        <h3>${language.instructionsChoosingASetOfBoxes.subTitle}</h3>
        <p>${language.instructionsChoosingASetOfBoxes.description}</p>
        <p>${language.instructionsChoosingASetOfBoxes.example1}</p>
        ${example5MPL.replace('width: 50vw; margin: auto;', 'width: 100%; margin: 0;')}
        <p>${language.instructionsChoosingASetOfBoxes.chooseSet}</p>
        ${example5MPLSelected.replace('width: 50vw; margin: auto;', 'width: 100%; margin: 0;')}
        <p>${language.instructionsChoosingASetOfBoxes.example2}</p>
        <p>${language.instructionsChoosingASetOfBoxes.computerOnlyOneChoice}</p>
        <h3>${language.instructionsChoosingASetOfBoxes.severalTables}</h3>
        <p>${language.instructionsChoosingASetOfBoxes.severalTablesDescription}</p>
        <p>${language.instructionsChoosingASetOfBoxes.incentivesMPL}</p>
        <h3>${language.instructionsSpanInMPL.subTitle}</h3>
        <p>${language.instructionsSpanInMPL.MPLInSpan}</p>
        <p>${language.instructionsSpanInMPL.MPLInSpanRepeat}</p>
        <p>${language.instructionsSpanInMPL.priority}</p>
        <h3>${language.instructionsSpanInMPL.incentives}</h3>
        <p>${language.instructionsSpanInMPL.incentivesSpan.replace("{bonusSpan}", spanPayment)}</p>
        <p>${language.instructionsSpanInMPL.incentivesSpanDetails}</p>
        <p>${language.instructionsSpanInMPL.incentiveSpanExample.replace("{bonusSpan}", spanPayment).replace("{examplePaymentSpan}", Math.round((spanPayment * 0.8)*100)/100)}</p>
        <p>${language.instructionsSpanInMPL.randomMechanism}</p>
        `;
    }
    
    modalContent.innerHTML = `
        ${helpContent}
        <div style="margin-top: 20px; text-align: center;">
            <button id="close-modal" style="padding: 8px 16px; background-color: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">
                ${language.button.close || "Close"}
            </button>
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Close button handler
    document.getElementById('close-modal').addEventListener('click', function() {
        document.body.removeChild(modal);
    });
}
function showInstructionModalForQuestions(instructionType) {

    // Check if modal already exists - prevent duplicates
    if (document.getElementById('instruction-modal')) {
        console.log("Modal already open, preventing duplicate");
        return;
    }

    helpPageCounter ++;
    console.log("helpPageCounter is ", helpPageCounter);
    const modal = document.createElement('div');
    modal.id = 'instruction-modal';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
        background-color: rgba(0,0,0,0.5); z-index: 2000; 
        display: flex; justify-content: center; align-items: center;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white; padding: 20px; border-radius: 8px; 
        max-width: 80%; max-height: 80%; overflow-y: auto;
        position: relative;
    `;

    //Prevent Enter key from submitting form while modal is open
    function preventEnterSubmission(e) {
        if (e.key === 'Enter' && document.getElementById('instruction-modal')) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }
    
    // Add the event listener
    document.addEventListener('keydown', preventEnterSubmission);
    
    let helpContent = '';
    if (instructionType === "mirror") {
        console.log("Generating help content for mirror condition");
        helpContent = 
        `<h2>${language.instructionsDecisionTable.title}</h2>
        <h3>${language.instructionsBoxesWithMoney.subTitle}</h3>
        <p>${language.instructionsBoxesWithMoney.initialSum}</p>
        <p>${language.instructionsBoxesWithMoney.chooseSet}</p>
        ${generateHTML("Lot A", "Lot B")}
        <p>${language.instructionsBoxesWithMoney.choice}</p>
        <p>${language.instructionsBoxesWithMoney.moneyInside}</p>
        <h3>${language.instructionsDecisionTable.subTitle}</h3>
        <p>${language.instructionsDecisionTable.description}</p>
        ${example1MPL.replace('width: 50vw; margin: auto;', 'width: 100%; margin: 0;')}
        <p>${language.instructionsDecisionTable.exampleAbove}</p>
        <p>${language.instructionsDecisionTable.exampleBelow}</p>
        ${example2MPL.replace('width: 50vw; margin: auto;', 'width: 100%; margin: 0;')}
        <p>${language.instructionsDecisionTable.clickToChoose}</p>
        ${example1MPLSelected.replace('width: 50vw; margin: auto;', 'width: 100%; margin: 0;')}
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
         `;
//<p>${language.instructionsPaymentRuleMirror.remindNotEveryone.replace('{frequency}', propSelecForMPL)}</p>

    } else if (instructionType === "lottery") {
        console.log("Generating help content for lottery condition");
        helpContent = 
        `<h2>${language.instructionsDecisionTable.title}</h2>
        <h3>${language.instructionsBoxesWithMoney.subTitle}</h3>
        <p>${language.instructionsBoxesWithMoney.initialSum}</p>
        <p>${language.instructionsBoxesWithMoney.chooseSet}</p>
        ${generateHTML("Lot A", "Lot B")}
        <p>${language.instructionsBoxesWithMoney.choice}</p>
        <p>${language.instructionsBoxesWithMoney.moneyInside}</p>
        <h3>${language.instructionsDecisionTable.subTitle}</h3>
        <p>${language.instructionsDecisionTable.description}</p>
        ${example1MPL.replace('width: 50vw; margin: auto;', 'width: 100%; margin: 0;')}
        <p>${language.instructionsDecisionTable.exampleAbove}</p>
        <p>${language.instructionsDecisionTable.exampleBelow}</p>
        ${example2MPL.replace('width: 50vw; margin: auto;', 'width: 100%; margin: 0;')}
        <p>${language.instructionsDecisionTable.clickToChoose}</p>
        ${example1MPLSelected.replace('width: 50vw; margin: auto;', 'width: 100%; margin: 0;')}
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
        `;
// <p>${language.instructionsPaymentRuleRandomBox.remindNotEveryone.replace('{frequency}', propSelecForMPL)}</p>

    }
    
    modalContent.innerHTML = `
        ${helpContent}
        <div style="margin-top: 20px; text-align: center;">
            <button id="close-modal" style="padding: 8px 16px; background-color: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">
                ${language.button.close || "Close"}
            </button>
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Close button handler
    document.getElementById('close-modal').addEventListener('click', function() {
        document.removeEventListener('keydown', preventEnterSubmission);
        document.body.removeChild(modal);
    });
    // Close when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.removeEventListener('keydown', preventEnterSubmission);
            modal.parentNode.removeChild(modal);
        }
    });
}

const example1MPL = `
        <div style="width: 50vw; margin: auto;">
        <table class="mpl">
            <tr>
            <th></th>
            <th colspan="2" style="color: red">Lot A</th>
            <th style="color: blue">Lot B</th>
            </tr>
            <tr>
            <th>Version</th>
            <th style="color: red"> 50 boîtes</th>
            <th style="color: red"> 50 boîtes</th>
            <th style="color: blue">100 boîtes</th>
            </tr>
            <tr>
            <td>1</td>
            <td class="choice" data-row="1" data-choice="lottery" style="color: red">
            16€
            <input type="radio" name="row1" value="lottery">
            </td>
            <td class="mirror" data-row="1" style="color: red">0€</td>
            <td class="choice" data-row="1" data-choice="sure" style="color: blue">
            4€
            <input type="radio" name="row1" value="sure">
            </td>
        </tr>
        </table>
        `; 

const example1MPLSelected = `
        <div style="width: 50vw; margin: auto;">
        <table class="mpl">
            <tr>
            <th></th>
            <th colspan="2" style="color: red">Lot A</th>
            <th style="color: blue">Lot B</th>
            </tr>
            <tr>
            <th>Version</th>
            <th style="color: red"> 50 boîtes</th>
            <th style="color: red"> 50 boîtes</th>
            <th style="color: blue">100 boîtes</th>
            </tr>
            <tr>
            <td>1</td>
            <td class="choice selected" data-row="1" data-choice="lottery" style="color: red">
            16€
            <input type="radio" name="row1" value="lottery" checked>
            </td>
            <td class="choice selected" data-row="1" style="color: red">0€</td>
            <td class="choice" data-row="1" data-choice="sure" style="color: blue">
            4€
            <input type="radio" name="row1" value="sure">
            </td>
        </tr>
        </table>
        `;

const example2MPL = `
        <div style="width: 50vw; margin: auto;">
        <table class="mpl">
            <tr>
            <th></th>
            <th colspan="2" style="color: red">Lot A</th>
            <th style="color: blue">Lot B</th>
            </tr>
            <tr>
            <th>Version</th>
            <th style="color: red"> 25 boîtes</th>
            <th style="color: red"> 75 boîtes</th>
            <th style="color: blue">100 boîtes</th>
            </tr>
            <tr>
            <td>1</td>
            <td class="choice" data-row="1" data-choice="lottery" style="color: red">
            -12€
            <input type="radio" name="row1" value="lottery">
            </td>
            <td class="choice" data-row="1" style="color: red">0€</td>
            <td class="choice" data-row="1" data-choice="sure" style="color: blue">
            -3€
            <input type="radio" name="row1" value="sure">
            </td>
        </tr>
        </table>
        `;
const example3MPLSelected = `
    <div style="width: 50vw; margin: auto;">
    <table class="mpl">
        <tr>
        <th></th>
        <th colspan="2" style="color: red">Lot A</th>
        <th style="color: blue">Lot B</th>
        </tr>
        <tr>
        <th>Version</th>
        <th style="color: red"> 50 boîtes</th>
        <th style="color: red"> 50 boîtes</th>
        <th style="color: blue">100 boîtes</th>
        </tr>
        <tr>
        <td>1</td>
        <td class="choice" data-row="1" data-choice="lottery" style="color: red">
        -8€
        <input type="radio" name="row1" value="lottery">
        </td>
        <td class="choice" data-row="1" style="color: red">0€</td>
        <td class="choice selected" data-row="1" data-choice="sure" style="color: blue">
        -6€
        <input type="radio" name="row1" value="sure">
        </td>
    </tr>
    </table>
    `;

const example1MPLSelectedWithEndowment = `
        <div style="width: 50vw; margin: auto;">
        <ul>
        <li><span style="color: green">Vous serez payé 5€ plus la valeur d'une boîte tirée au hasard du lot choisi.</span></li><br>
        </ul></div>
        <table class="mpl">
            <tr>
            <th></th>
            <th colspan="2" style="color: red">Lot A</th>
            <th style="color: blue">Lot B</th>
            </tr>
            <tr>
            <th>Version</th>
            <th style="color: red"> 50 boîtes</th>
            <th style="color: red"> 50 boîtes</th>
            <th style="color: blue">100 boîtes</th>
            </tr>
            <tr>
            <td>1</td>
            <td class="choice selected" data-row="1" data-choice="lottery" style="color: red">
            16€
            <input type="radio" name="row1" value="lottery" checked>
            </td>
            <td class="choice selected" data-row="1" style="color: red">0€</td>
            <td class="choice" data-row="1" data-choice="sure" style="color: blue">
            4€
            <input type="radio" name="row1" value="sure">
            </td>
        </tr>
        </table>
        `;

const example3MPLSelectedWithEndowment = `
        <div style="width: 50vw; margin: auto;">
        <span style="color: green">Vous serez payé 20€ plus la valeur d'une boîte tirée au hasard du lot choisi.</span></li><br>
        </div>
        <table class="mpl">
            <tr>
            <th></th>
            <th colspan="2" style="color: red">Lot A</th>
            <th style="color: blue">Lot B</th>
            </tr>
            <tr>
            <th>Version</th>
            <th style="color: red"> 50 boîtes</th>
            <th style="color: red"> 50 boîtes</th>
            <th style="color: blue">100 boîtes</th>
            </tr>
            <tr>
            <td>1</td>
            <td class="choice selected" data-row="1" data-choice="lottery" style="color: red">
            -8€
            <input type="radio" name="row1" value="lottery" checked>
            </td>
            <td class="choice selected" data-row="1" style="color: red">0€</td>
            <td class="choice" data-row="1" data-choice="sure" style="color: blue">
            4€
            <input type="radio" name="row1" value="sure">
            </td>
        </tr>
        </table>
        `;

const example4MPLSelected = `
    <div style="width: 50vw; margin: auto;">
    <table class="mpl">
        <tr>
        <th></th>
        <th colspan="2" style="color: red">Lot A</th>
        <th style="color: blue">Lot B</th>
        </tr>
        <tr>
        <th>Version</th>
        <th style="color: red"> 50 boîtes</th>
        <th style="color: red"> 50 boîtes</th>
        <th style="color: blue">100 boîtes</th>
        </tr>
        <tr>
        <td>1</td>
        <td class="choice" data-row="1" data-choice="lottery" style="color: red">
        -8€
        <input type="radio" name="row1" value="lottery">
        </td>
        <td class="choice" data-row="1" style="color: red">0€</td>
        <td class="choice selected" data-row="1" data-choice="sure" style="color: blue">
        -6€
        <input type="radio" name="row1" value="sure">
        </td>
    </tr>
    </table>
    `;

    // ...existing code...
const example5MPL = `
        <div style="width: 50vw; margin: auto;">
        <table class="mpl">
            <tr>
            <th></th>
            <th colspan="2" style="color: red">Lot A</th>
            <th style="color: blue">Lot B</th>
            </tr>
            <tr>
            <th>Version</th>
            <th style="color: red"> 40 boîtes</th>
            <th style="color: red"> 60 boîtes</th>
            <th style="color: blue">100 boîtes</th>
            </tr>
            <tr>
            <td>1</td>
            <td class="choice" data-row="1" data-choice="lottery" style="color: red">
            10€
            <input type="radio" name="row1" value="lottery">
            </td>
            <td class="mirror" data-row="1" style="color: red">0€</td>
            <td class="choice" data-row="1" data-choice="sure" style="color: blue">
            1€
            <input type="radio" name="row1" value="sure">
            </td>
            </tr>
            <tr>
            <td>2</td>
            <td class="choice" data-row="2" data-choice="lottery" style="color: red">
            10€
            <input type="radio" name="row2" value="lottery">
            </td>
            <td class="mirror" data-row="2" style="color: red">0€</td>
            <td class="choice" data-row="2" data-choice="sure" style="color: blue">
            2€
            <input type="radio" name="row2" value="sure">
            </td>
            </tr>
            <tr>
            <td>3</td>
            <td class="choice" data-row="3" data-choice="lottery" style="color: red">
            10€
            <input type="radio" name="row3" value="lottery">
            </td>
            <td class="mirror" data-row="3" style="color: red">0€</td>
            <td class="choice" data-row="3" data-choice="sure" style="color: blue">
            3€
            <input type="radio" name="row3" value="sure">
            </td>
            </tr>
            <tr>
            <td>4</td>
            <td class="choice" data-row="4" data-choice="lottery" style="color: red">
            10€
            <input type="radio" name="row4" value="lottery">
            </td>
            <td class="mirror" data-row="4" style="color: red">0€</td>
            <td class="choice" data-row="4" data-choice="sure" style="color: blue">
            4€
            <input type="radio" name="row4" value="sure">
            </td>
            </tr>
            <tr>
            <td>5</td>
            <td class="choice" data-row="5" data-choice="lottery" style="color: red">
            10€
            <input type="radio" name="row5" value="lottery">
            </td>
            <td class="mirror" data-row="5" style="color: red">0€</td>
            <td class="choice" data-row="5" data-choice="sure" style="color: blue">
            5€
            <input type="radio" name="row5" value="sure">
            </td>
            </tr>
            <tr>
            <td>6</td>
            <td class="choice" data-row="6" data-choice="lottery" style="color: red">
            10€
            <input type="radio" name="row6" value="lottery">
            </td>
            <td class="mirror" data-row="6" style="color: red">0€</td>
            <td class="choice" data-row="6" data-choice="sure" style="color: blue">
            6€
            <input type="radio" name="row6" value="sure">
            </td>
            </tr>
            <tr>
            <td>7</td>
            <td class="choice" data-row="7" data-choice="lottery" style="color: red">
            10€
            <input type="radio" name="row7" value="lottery">
            </td>
            <td class="mirror" data-row="7" style="color: red">0€</td>
            <td class="choice" data-row="7" data-choice="sure" style="color: blue">
            7€
            <input type="radio" name="row7" value="sure">
            </td>
            </tr>
            <tr>
            <td>8</td>
            <td class="choice" data-row="8" data-choice="lottery" style="color: red">
            10€
            <input type="radio" name="row8" value="lottery">
            </td>
            <td class="mirror" data-row="8" style="color: red">0€</td>
            <td class="choice" data-row="8" data-choice="sure" style="color: blue">
            8€
            <input type="radio" name="row8" value="sure">
            </td>
            </tr>
            <tr>
            <td>9</td>
            <td class="choice" data-row="9" data-choice="lottery" style="color: red">
            10€
            <input type="radio" name="row9" value="lottery">
            </td>
            <td class="mirror" data-row="9" style="color: red">0€</td>
            <td class="choice" data-row="9" data-choice="sure" style="color: blue">
            9€
            <input type="radio" name="row9" value="sure">
            </td>
            </tr>
            <tr>
            <td>10</td>
            <td class="choice" data-row="10" data-choice="lottery" style="color: red">
            10€
            <input type="radio" name="row10" value="lottery">
            </td>
            <td class="mirror" data-row="10" style="color: red">0€</td>
            <td class="choice" data-row="10" data-choice="sure" style="color: blue">
            10€
            <input type="radio" name="row10" value="sure">
            </td>
            </tr>
        </table>
        `; 


const example5MPLSelected = `
        <div style="width: 50vw; margin: auto;">
        <table class="mpl">
            <tr>
            <th></th>
            <th colspan="2" style="color: red">Lot A</th>
            <th style="color: blue">Lot B</th>
            </tr>
            <tr>
            <th>Version</th>
            <th style="color: red"> 40 boîtes</th>
            <th style="color: red"> 60 boîtes</th>
            <th style="color: blue">100 boîtes</th>
            </tr>
            <tr>
            <td>1</td>
            <td class="choice selected" data-row="1" data-choice="lottery" style="color: red">
            10€
            <input type="radio" name="row1" value="lottery" checked>
            </td>
            <td class="choice selected" data-row="1" style="color: red">0€</td>
            <td class="choice" data-row="1" data-choice="sure" style="color: blue">
            1€
            <input type="radio" name="row1" value="sure">
            </td>
            </tr>
            <tr>
            <td>2</td>
            <td class="choice selected" data-row="2" data-choice="lottery" style="color: red">
            10€
            <input type="radio" name="row2" value="lottery" checked>
            </td>
            <td class="choice selected" data-row="2" style="color: red">0€</td>
            <td class="choice" data-row="2" data-choice="sure" style="color: blue">
            2€
            <input type="radio" name="row2" value="sure">
            </td>
            </tr>
            <tr>
            <td>3</td>
            <td class="choice selected" data-row="3" data-choice="lottery" style="color: red">
            10€
            <input type="radio" name="row3" value="lottery" checked>
            </td>
            <td class="choice selected" data-row="3" style="color: red">0€</td>
            <td class="choice" data-row="3" data-choice="sure" style="color: blue">
            3€
            <input type="radio" name="row3" value="sure">
            </td>
            </tr>
            <tr>
            <td>4</td>
            <td class="choice selected" data-row="4" data-choice="lottery" style="color: red">
            10€
            <input type="radio" name="row4" value="lottery" checked>
            </td>
            <td class="choice selected" data-row="4" style="color: red">0€</td>
            <td class="choice" data-row="4" data-choice="sure" style="color: blue">
            4€
            <input type="radio" name="row4" value="sure">
            </td>
            </tr>
            <tr>
            <td>5</td>
            <td class="choice selected" data-row="5" data-choice="lottery" style="color: red">
            10€
            <input type="radio" name="row5" value="lottery" checked>
            </td>
            <td class="choice selected" data-row="5" style="color: red">0€</td>
            <td class="choice" data-row="5" data-choice="sure" style="color: blue">
            5€
            <input type="radio" name="row5" value="sure">
            </td>
            </tr>
            <tr>
            <td>6</td>
            <td class="choice selected" data-row="6" data-choice="lottery" style="color: red">
            10€
            <input type="radio" name="row6" value="lottery" checked>
            </td>
            <td class="choice selected" data-row="6" style="color: red">0€</td>
            <td class="choice" data-row="6" data-choice="sure" style="color: blue">
            6€
            <input type="radio" name="row6" value="sure">
            </td>
            </tr>
            <tr>
            <td>7</td>
            <td class="choice selected" data-row="7" data-choice="lottery" style="color: red">
            10€
            <input type="radio" name="row7" value="lottery" checked>
            </td>
            <td class="choice selected" data-row="7" style="color: red">0€</td>
            <td class="choice" data-row="7" data-choice="sure" style="color: blue">
            7€
            <input type="radio" name="row7" value="sure">
            </td>
            </tr>
            <tr>
            <td>8</td>
            <td class="choice" data-row="8" data-choice="lottery" style="color: red">
            10€
            <input type="radio" name="row8" value="lottery">
            </td>
            <td class="choice" data-row="8" style="color: red">0€</td>
            <td class="choice selected" data-row="8" data-choice="sure" style="color: blue">
            8€
            <input type="radio" name="row8" value="sure" checked>
            </td>
            </tr>
            <tr>
            <td>9</td>
            <td class="choice" data-row="9" data-choice="lottery" style="color: red">
            10€
            <input type="radio" name="row9" value="lottery">
            </td>
            <td class="choice" data-row="9" style="color: red">0€</td>
            <td class="choice selected" data-row="9" data-choice="sure" style="color: blue">
            9€
            <input type="radio" name="row9" value="sure" checked>
            </td>
            </tr>
            <tr>
            <td>10</td>
            <td class="choice" data-row="10" data-choice="lottery" style="color: red">
            10€
            <input type="radio" name="row10" value="lottery">
            </td>
            <td class="choice" data-row="10" style="color: red">0€</td>
            <td class="choice selected" data-row="10" data-choice="sure" style="color: blue">
            10€
            <input type="radio" name="row10" value="sure" checked>
            </td>
            </tr>
        </table>
        `;


const example6MPLSelected = `
        <div style="width: 50vw; margin: auto;">
        <table class="mpl">
            <tr>
            <th></th>
            <th colspan="2" style="color: red">Lot A</th>
            <th style="color: blue">Lot B</th>
            </tr>
            <tr>
            <th>Version</th>
            <th style="color: red"> 50 boîtes</th>
            <th style="color: red"> 50 boîtes</th>
            <th style="color: blue">100 boîtes</th>
            </tr>
            <tr>
            <td>1</td>
            <td class="choice selected" data-row="1" data-choice="lottery" style="color: red">
            20€
            <input type="radio" name="row1" value="lottery" checked>
            </td>
            <td class="choice selected" data-row="1" style="color: red">0€</td>
            <td class="choice" data-row="1" data-choice="sure" style="color: blue">
            5€
            <input type="radio" name="row1" value="sure">
            </td>
        </tr>
        </table>
        `;

const example7MPLSelected = `
        <div style="width: 50vw; margin: auto;">
        <table class="mpl">
            <tr>
            <th></th>
            <th colspan="2" style="color: red">Lot A</th>
            <th style="color: blue">Lot B</th>
            </tr>
            <tr>
            <th>Version</th>
            <th style="color: red"> 50 boîtes</th>
            <th style="color: red"> 50 boîtes</th>
            <th style="color: blue">100 boîtes</th>
            </tr>
            <tr>
            <td>1</td>
            <td class="choice" data-row="1" data-choice="lottery" style="color: red">
            -12€
            <input type="radio" name="row1" value="lottery" checked>
            </td>
            <td class="choice" data-row="1" style="color: red">0€</td>
            <td class="choice selected" data-row="1" data-choice="sure" style="color: blue">
            -8€
            <input type="radio" name="row1" value="sure">
            </td>
        </tr>
        </table>
        `;


