// First define the languages
const en = {
    welcomePage: {
        welcome: "Welcome!",
        clickNext: "Click on <strong>Next</strong> to continue!"
    },
    overviewPage: {
        purpose: "This experiment focuses on cognitive processes related to memory.",
        procedure: "It includes two memory tasks that you will alternate between.",
        anonimity: "All your results will remain anonymous.",
        credits: "This experiment is conducted by master's student Gildas Prévost under the supervision of Professor Dr. Bastien Blain, both at Université Paris 1 Panthéon-Sorbonne.",
        question: "If you have any questions or requests, please email gildas.prevost@etu.univ-paris1.fr.",
        withdrawal: "You are free to withdraw from the experiment at any time without penalty.",
        clickNext: "Click on <strong>Next</strong> to continue!"
    },    
    descriptionExperiment: {
        title: "Description of the experiment",
        twoGames: "You will have two different tasks to play: the visual n-back and the letter n-back.",
        instructionsAfter: "You will receive instructions for each task after this page.",
        subBlockExplanation: "The experiment consists of 12 subBlocks. One sub-block consists of a visual n-back task and then a letter n-back task.",
        paymentAfter: "So you understand how you will be paid, you will receive the payment instructions after the task guidelines.",
        clickNext: "Click on <strong>Next</strong> to continue!"
        
    },
    instructions0back: {
        letter: "In this task, <strong>letters</strong> will appear on the screen consecutively.",
        yourTask1: "Your task will be <strong>to press the key 'J' if you see the letter <strong style='color:red'>X</strong> on the screen.</strong>",
        yourTask2: "Otherwise, press the <strong>key 'F'</strong>.</p>",
        image: "<img src='static/images/instruction_0back_en.gif' />"
    },    
    instructions1back: {
        letter: "In this task, <strong>letters</strong> will appear on the screen consecutively.",
        changeN: "Now you will switch to a different n-back level.",
        grid: "In this task, <strong>a dot appears in one of the squares of a grid</strong> on each presentation.",
        yourTask1: "Your task will be <strong>to press the key 'J' if the letter on the screen is the same as the <strong style='color:red'>previous</strong> one</strong>.",
        yourTask1Grid: "Your task will be <strong>to press the key 'J' if the location of the dot on the screen is the same as the <strong style='color:red'>previous</strong> one</strong>.",
        firstGrids: "At the first point of a series of presentations, you must press 'F'.",
        yourTask2: "Otherwise, press the <strong>key 'F'</strong>.",
        image: "<img src='static/images/instruction_1back_en.gif' />",
        liveDemo: nbackDemoHTML('nback-demo'),
        firstGameVisual: "Let's explain the visual n-back.",
        firstGameLetter: "Let's explain the letter n-back task.",
        allGame: "These instructions apply to the entire experiment."
    },
    instructions2back: {
        changeN: "Now you will switch to a different n-back level.",
        letter: "In this task, <strong>letters</strong> will appear on the screen consecutively.",
        yourTask1: "Your task will be <strong>to press the key 'J' if the letter on the screen is the same as <strong style='color:red'>two</strong> letters earlier</strong>.",
        yourTask2: "Otherwise, press the <strong>key 'F'</strong>.",
        image: "<img src='static/images/instruction_2back_en.gif' />",
        firstGameLetter: "Let's explain the letter n-back task."
    },
    instructions3back: {
        changeN: "Now you will switch to a different n-back level.",
        letter: "In this task, <strong>letters</strong> will appear on the screen consecutively.",
        yourTask1: "Your task will be <strong>to press the key 'J' if the letter on the screen is the same as <strong style='color:red'>three</strong> letters earlier</strong>.",
        yourTask2: "Otherwise, press the <strong>key 'F'</strong>.",
        image: "<img src='static/images/instruction_3back_en.gif' />",
        firstGameLetter: "Let's explain the letter n-back task."
    },
    generalInstruction: {
        fastAndAccurate: "Try to be as fast and as accurate as possible!",
        clickNext: "If the instructions are clear, click on <strong>Next</strong>",
    },
    practice: {
        practice: "First, you can practice the task a little bit.",
        startPractice: "Press any key on the keyboard to start the practice!",
        end: "End of the practice."
    },
    betweenBlocks: {
        rest: "Now you can rest a little.",
        continue:"Press any key to continue the task!",
        pressKey:"If you are ready, press a key!"
    },
    end:  {
        end: "End of the task.",
        thankYou: "Thank you!",
    },
    button: {
        next: "Next",
        previous: "Previous",
    },
    fullscreen: {
        fullscreenText: "The experiment will switch to full screen mode when you press the button below.",
        fullscreenButton: "Continue"
    },
    feedback: {
        correct: "Correct!",
        wrong: "Wrong!",
        noResponse: "You did not respond!",
        accuracy: "You responded correctly on ",
        accuracy2: "% of the trials.",
        rt: "Your average response time was ",
        rt2: " ms."
    },
    task1back: {
        start: "The task start now. From now on, you won't receive any feedback.",
        remember1: "Remember: press the key <strong>'J'</strong> if the letter on the screen is the same as the <strong style='color:red'>previous</strong> one</strong>.",
        remember2: "Otherwise, press the key <strong>'F'</strong>.",
        press: "Press any key to start the task!",
    },
    task2back: {
        start: "The task start now. From now on, you won't receive any feedback.",
        remember1: "Remember: press the key <strong>'J'</strong> if the letter on the screen is the same as <strong style='color:red'>two</strong> letters earlier.",
        remember2: "Otherwise, press the key <strong>'F'</strong>.",
        press: "Press any key to start the task!",
    },
    task3back: {
        start: "The task start now. From now on, you won't receive any feedback.",
        remember1: "Remember: press the key <strong>'J'</strong> if the letter on the screen is the same as <strong style='color:red'>three</strong> letters earlier.",
        remember2: "Otherwise, press the key <strong>'F'</strong>.",
        press: "Press any key to start the task!",
    },
    parameters: {
        subject: "Subject Number:",
        session: "Session Number:"
    },
    startWarning: {
        startSubject: "You are about to start the game with<strong> Subject Number ",
        startSession: "</strong> and <strong>Session Number ",
        startButton: "Start the task!",
        goBackButton: "Change the parameters"
    },
    incentives: {
        selectedBlock: "The selected subBlock for payment was subBlock number ${subBlockInteger}:",
        accuracies: "Your accuracy in that subBlock was ${percentPostVisual}% for the trials following the visual n-back, ${percentVN}% for the visual n-back, ${percentN}% for the classic n-back.",
        visualDetails: "Visual N-back total trials: ${totalTrialsVN}, correct trials: ${corTrialsVN}.",
        letterDetails: "Letter N-back total trials: ${totalTrialsN}, correct trials: ${corTrialsN}.",
        postVisualDetails: "Post visual N-back total trials: ${postVisualTrials}, correct trials: ${corPostVisualTrials}.",
        paymentExplanation: "Your payment is based on your performance:\n- 50% on trials after visual n-back (${accuracyPostVisual})\n- 25% on visual n-back (${accuracyVN})\n- 25% on letter n-back (${accuracyN})",
        totalPayment: "Your total bonus payment will be: ${totalPayment}€",
        thankYou: "Thank you for participating in this experiment!",
        redirect: "We will now redirect you to the end page.",
        continue: "Press Enter to continue"
    },
    paymentExplanation1Back: {
        title: "Payment Information",
        mainText: "In addition to your base payment, you can earn a bonus of up to ${payment}€ based on your performance.",
        changeScore: `Attention! From now on, <span style="color:red;"><strong>50% of your bonus</strong></span> will depend on your performance with the <span style="color:red;"><strong>first letter</strong></span> after the visual n-back in the selected sub-block for payment.`,
        score: `
        <div class="payment-info">
            <div class="payment-illustration">
                <h3>How it works:</h3>
                <div class="nback-sequence" style="position: relative;">
                    <div class="nback-box">... K L <span class="highlight">M</span></div>
                    <div class="nback-box visual-nback-box" id="visual-nback-box">Visual N-back<br>(10 trials)</div>
                    <div class="nback-box" id="letter-nback-box"><span class="highlight">M</span> A U Q P B ...</div>
                    <!-- Horizontal accolade below visual n-back and letter n-back -->
                <div style="position: absolute; left: 50%; transform: translateX(-30%); top: 75px; width: 400px; pointer-events: none;">
                <svg width="400" height="70"> <!-- Hauteur augmentée pour accommoder le décalage -->
                    <path d="M20,30 Q20,55 60,55 L350,55 Q390,55 390,30" stroke="#333" fill="transparent" stroke-width="3"/>
                </svg>
                    <div style="text-align:center; font-size:1em; margin-top:5px;">a sub-block</div>
                </div>
                </div>
                <br><br>
                <p>At the end of the experiment, one sub-block will be randomly selected for your bonus payment.</p>
                <p>Your bonus will be calculated based on your accuracy in three parts:</p>
                
                <ol>
                    <li><strong>50% of your bonus</strong> depends on your accuracy in the crucial first trial after the visual n-back.
                    <br>In the example above, this means correctly identifying that the <span class="highlight">M</span> matches the last letter before the visual task.</li>
                    <li><strong>25% of your bonus</strong> depends on your accuracy in the visual n-back trials.</li>
                    <li><strong>25% of your bonus</strong> depends on your accuracy in the remaining letter n-back trials.</li>
                </ol>

                <div class="payment-formula">
                    Final bonus = __PAYMENT__€ × (0.5 × accuracy_after_visual + 0.25 × accuracy_visual + 0.25 × accuracy_letters)
                </div>
                
                <p><strong>Example:</strong> If you achieve:<br>
                - 100% accuracy in the trial after visual n-back<br>
                - 50% accuracy in visual n-back<br>
                - 50% accuracy in letter n-back<br>
                Your bonus would be: __PAYMENT__€ × (0.5 × 1.0 + 0.25 × 0.5 + 0.25 × 0.5) = __PAYMENT__€ × 0.75</p>
                
                <div class="important-note">
                    💡 Remember: The most important part for maximizing your bonus is to correctly identify matches immediately after the visual n-back section!
                </div>
            </div>
            
            <p><i>When you're ready to begin, press any key to continue.</i></p>
        </div>`,
    },
    paymentExplanation2Back: {
        title: "Payment Information",
        mainText: "In addition to your base payment, you can earn a bonus of up to ${payment}€ based on your performance.",
        changeScore: `Attention! From now on, <span style="color:red;"><strong>50% of your bonus</strong></span> will depend on your performance with the <span style="color:red;"><strong>two first letters</strong></span> after the visual n-back in the selected sub-block for payment.`,
        score: `
        <div class="payment-info">
            <div class="payment-illustration">
                <h3>How it works:</h3>
                <div class="nback-sequence" style="position: relative;">
                    <div class="nback-box">... K <span class="highlight">M P</span></div>
                    <div class="nback-box visual-nback-box" id="visual-nback-box">Visual N-back<br>(10 trials)</div>
                    <div class="nback-box" id="letter-nback-box"><span class="highlight">M B</span> U Q P B ...</div>
                    <!-- Horizontal accolade below visual n-back and letter n-back -->
                <div style="position: absolute; left: 50%; transform: translateX(-30%); top: 75px; width: 400px; pointer-events: none;">
                <svg width="400" height="70"> <!-- Hauteur augmentée pour accommoder le décalage -->
                    <path d="M20,30 Q20,55 60,55 L350,55 Q390,55 390,30" stroke="#333" fill="transparent" stroke-width="3"/>
                </svg>
                    <div style="text-align:center; font-size:1em; margin-top:5px;">a sub-block</div>
                </div>
                </div>
                <br><br>
                <p>At the end of the experiment, one sub-block will be randomly selected for your bonus payment.</p>
                <p>Your bonus will be calculated based on your accuracy in three parts:</p>
                
                <ol>
                    <li><strong>50% of your bonus</strong> depends on your accuracy in the crucial two first trials after the visual n-back.
                    <br>In the example above, this means correctly identifying that the <span class="highlight">M</span> but not the <span class="highlight">B</span> matches the <span class="highlight">M</span> before before the visual task.</li>
                    <li><strong>25% of your bonus</strong> depends on your accuracy in the visual n-back trials.</li>
                    <li><strong>25% of your bonus</strong> depends on your accuracy in the remaining letter n-back trials.</li>
                </ol>

                <div class="payment-formula">
                    Final bonus = __PAYMENT__€ × (0.5 × accuracy_after_visual + 0.25 × accuracy_visual + 0.25 × accuracy_letters)
                </div>
                
                <p><strong>Example:</strong> If you achieve:<br>
                - 100% accuracy in trials after visual n-back<br>
                - 50% accuracy in visual n-back<br>
                - 50% accuracy in letter n-back<br>
                Your bonus would be: __PAYMENT__€ × (0.5 × 1.0 + 0.25 × 0.5 + 0.25 × 0.5) = __PAYMENT__€ × 0.75</p>
                
                <div class="important-note">
                💡 Remember: The most important thing to maximize your bonus is to identify, after each visual n-back, whether the first letter of the letter n-back matches the last letter you saw before the visual n-back!
                </div>
            </div>
            
            <p><i>When you're ready to begin, press any key to continue.</i></p>
        </div>`,
    },
    paymentExplanation3Back: {
        title: "Payment Information",
        mainText: "In addition to your base payment, you can earn a bonus of up to ${payment}€ based on your performance.",
        changeScore: `Attention! From now on, <span style="color:red;"><strong>50% of your bonus</strong></span> will depend on your performance with the <span style="color:red;"><strong>three first letters</strong></span> after the visual n-back in the selected sub-block for payment.`,
        score: `
        <div class="payment-info">
            <div class="payment-illustration">
                <h3>How it works:</h3>
                <div class="nback-sequence" style="position: relative;">
                    <div class="nback-box">... A <span class="highlight">K M P</span></div>
                    <div class="nback-box visual-nback-box" id="visual-nback-box">Visual N-back<br>(10 trials)</div>
                    <div class="nback-box" id="letter-nback-box"><span class="highlight">Q M B</span> U P B Q...</div>
                    <!-- Horizontal accolade below visual n-back and letter n-back -->
                <div style="position: absolute; left: 50%; transform: translateX(-30%); top: 75px; width: 400px; pointer-events: none;">
                <svg width="400" height="70"> <!-- Hauteur augmentée pour accommoder le décalage -->
                    <path d="M20,30 Q20,55 60,55 L350,55 Q390,55 390,30" stroke="#333" fill="transparent" stroke-width="3"/>
                </svg>
                    <div style="text-align:center; font-size:1em; margin-top:5px;">a sub-block</div>
                </div>
                </div>
                <br><br>
                <p>At the end of the experiment, one sub-block will be randomly selected for your bonus payment.</p>
                <p>Your bonus will be calculated based on your accuracy in three parts:</p>
                
                <ol>
                    <li><strong>50% of your bonus</strong> depends on your accuracy in the crucial three first trials after the visual n-back.
                    <br>In the example above, this means correctly identifying that the <span class="highlight">M</span> but not the <span class="highlight">B</span> or <span class="highlight">Q</span> matches the <span class="highlight">M</span> before before the visual task.</li>
                    <li><strong>25% of your bonus</strong> depends on your accuracy in the visual n-back trials.</li>
                    <li><strong>25% of your bonus</strong> depends on your accuracy in the remaining letter n-back trials.</li>
                </ol>

                <div class="payment-formula">
                    Final bonus = __PAYMENT__€ × (0.5 × accuracy_after_visual + 0.25 × accuracy_visual + 0.25 × accuracy_letters)
                </div>
                
                <p><strong>Example:</strong> If you achieve:<br>
                - 100% accuracy in trials after visual n-back<br>
                - 50% accuracy in visual n-back<br>
                - 50% accuracy in letter n-back<br>
                Your bonus would be: __PAYMENT__€ × (0.5 × 1.0 + 0.25 × 0.5 + 0.25 × 0.5) = __PAYMENT__€ × 0.75</p>
                
                <div class="important-note">
                💡 Remember: The most important thing to maximize your bonus is to identify, after each visual n-back, whether the first three letters of the letter n-back respectively match the last three letters you saw before the visual n-back!
                </div>
            </div>
            
            <p><i>When you're ready to begin, press any key to continue.</i></p>
        </div>`,
    },
    overallTrainingIntro: {
        title: "Full Training",
        description: "Now you will practice how the real experiment works: alternating between the visual n-back task and the letter n-back task.",
        structure: "You will start with 10 trials of the letter n-back, then do a sub-block: one visual n-back task (10 trials), followed by one letter n-back task.",
        importance: "This training will help you understand the full structure of a sub-block and how the scoring system works.",
        feedback: "At the end, you will see feedback on your performance and how your bonus would be calculated if this were a real sub-block.",
        highlightEasy: "Pay particular attention to the letter immediately after the visual n-back — it is the most important for your bonus!",
        highlightHard: "Pay particular attention to the first {level} letters immediately after the visual n-back — they are the most important for your bonus!",
        ready: "When you are ready to begin the full training, press any key."
    },
    overallTrainingFeedback: {
        title: "Training Complete - Scoring Demonstration",
        performance: "Here's how your performance would be scored if this were a real sub-block:",
        beforeVisual: "Letters before visual n-back: {accuracy}% accuracy ({correct}/{total} trials)",
        visualNback: "Visual n-back: {accuracy}% accuracy ({correct}/{total} trials)", 
        afterVisual: "Letters after visual n-back: {accuracy}% accuracy ({correct}/{total} trials)",
        keyImportance: "💡 Key insight: The first {level} letters immediately after the visual n-back are worth 50% of your bonus!",
        calculation: "Bonus calculation: €{payment} × (0.5 × {afterVisualAcc} + 0.25 × {visualAcc} + 0.25 × {letterAcc}) = €{totalBonus}",
        remember: "Remember: Always keep the last few letters in mind during the visual task!",
        continue: "Press any key to continue to the main experiment."
    },

    // New: comprehension check (English)
    comprehensionIntro: "Before starting the experiment, you must answer a few comprehension questions correctly.",
    comprehension: {
        q1: {
            prompt: "Question 1: Please select the correct answer:",
            options: [
                "I am paid based on the average of my accuracy across all trials (100% of the bonus).",
                "I am paid independently of my accuracy (100% of the bonus).",
                "I am paid based on the letter n-back only for one sub-block of the experiment.",
                "I am paid based on my accuracy on the visual n-back (25% of the bonus), my accuracy on the following letter n-back (25% of the bonus) and my accuracy on the first three letters of the letter n-back in particular (50% of the bonus), for one sub-block randomly selected among the 12 sub-blocks of the experiment."
            ]
        },
        q2: {
            prompt: "Question 2: I start a visual n-back. The dot is in the same position as the last dot of the previous visual n-back. Which key should I press?",
            options: [
                "The 'F' key.",
                "The 'J' key.",
                "The Space key."
            ]
        },
        q3Hard: {
            prompt: "Question 3: I have just finished a visual n-back. Before it, the last three letters I saw were A O I. The letter A appears. Which key should I press?",
            options: [
                "The 'F' key.",
                "The 'J' key.",
                "The Space key."
            ]
        },
        q3Easy: {
            prompt: "Question 3: I have just finished a visual n-back. Before it, the last letter I saw was A. The letter A appears. Which key should I press?",
            options: [
                "The 'F' key.",
                "The 'J' key.",
                "The Space key."
            ]
        },
        // correct answers as option strings (used for checking)
        correct_answers: {
            q1: "I am paid based on the letter n-back only for one sub-block of the experiment.",
            q2: "The 'F' key.",
            q3: "The 'J' key."
        },
        tryAgain: "One or more answers are incorrect. Please review the instructions and try again.",
        success: "All answers are correct. Press any key to continue."
    },
    loopAgain: {
        failed: "You have responded incorrectly to at least one of the questions.",
        viewInstructions: "Next you are going to view the instructions again.",
        surveyAgain: "Then you will take the survey again.",
    }
}




const fr = {
    welcomePage: {
        welcome: "Bienvenue!",
        clickNext: "Cliquez sur <strong>Suivant</strong> pour continuer!"
    },
    overviewPage: {
        purpose: "Cette expérience porte sur les processus cognitifs liés à la mémoire.",
        procedure: "Elle comprend deux tâches de mémoire que vous alternerez.",
        anonimity: "Tous vos résultats resteront anonymes.",
        credits: "Cette expérience est menée par l'étudiant en master Gildas Prévost sous la supervision du professeur Dr. Bastien Blain, tous deux à l'Université Paris 1 Panthéon-Sorbonne.",
        question: "Si vous avez des questions ou des demandes, veuillez envoyer un email à gildas.prevost@etu.univ-paris1.fr.",
        withdrawal: "Vous êtes libre de quitter l'expérience à tout moment, sans aucune conséquence.",
        clickNext: "Cliquez sur <strong>Suivant</strong> pour continuer!"
    },
    descriptionExperiment: {
        title: "Description de l'expérience",
        twoGames: "Vous aurez deux tâches différentes à réaliser : le n-back visuel et le n-back lettres.",
        instructionsAfter: "Vous recevrez les consignes pour chaque tâche après cette page.",
        subBlockExplanation: "L'expérience se compose de 12 sous-blocs. Un sous-bloc comprend une tâche de n-back visuel suivie d'une tâche de n-back lettres.",
        paymentAfter: "Pour que vous compreniez comment vous serez payé, vous recevrez les explications du paiement après les consignes.",
        clickNext: "Cliquez sur <strong>Suivant</strong> pour continuer!"
    },
    instructions0back: {
        letter: "Dans cette tâche, des <strong>lettres</strong> apparaîtront à l'écran consécutivement.",
        yourTask1: "Votre tâche sera <strong>d'appuyer sur la touche 'J' si vous voyez la lettre <strong style='color:red'>X</strong> à l'écran.</strong>",
        yourTask2: "Sinon, appuyez sur la <strong>touche 'F'</strong>.</p>",
        image: "<img src='static/images/instruction_0back_en.gif' />"
    },
    instructions1back: {
        letter: "Dans cette tâche, des <strong>lettres</strong> apparaîtront à l'écran consécutivement.",
        changeN: "Maintenant, vous allez passer à un niveau n-back différent.",
        grid: "Dans cette tâche, un <strong>point apparaît dans l'une des cases d'une grille</strong> à chaque présentation.",
        yourTask1: "Votre tâche sera <strong>d'appuyer sur la touche 'J' si la lettre à l'écran est la même que la <strong style='color:red'>précédente</strong></strong>.",
        yourTask1Grid: "Votre tâche sera <strong>d'appuyer sur la touche 'J' si la position du point à l'écran est la même que la <strong style='color:red'>précédente</strong></strong>.",
        firstGrids: "Pour le premier point d'une série de présentations, vous devez appuyer sur 'F'.",
        yourTask2: "Sinon, appuyez sur la <strong>touche 'F'</strong>.",
        image: "<img src='static/images/instruction_1back_en.gif' />",
        liveDemo: nbackDemoHTML('nback-demo'),
        firstGameVisual: "Expliquons le n-back visuel.",
        firstGameLetter: "Expliquons la tâche de n-back lettres.",
        allGame: "Ces instructions s'appliquent à toute l'expérience."
    },
    instructions2back: {
        changeN: "Maintenant, vous allez passer à un niveau n-back différent.",
        letter: "Dans cette tâche, des <strong>lettres</strong> apparaîtront à l'écran consécutivement.",
        yourTask1: "Votre tâche sera <strong>d'appuyer sur la touche 'J' si la lettre à l'écran est la même que celle d'il y a <strong style='color:red'>deux</strong> lettres</strong>.",
        yourTask2: "Sinon, appuyez sur la <strong>touche 'F'</strong>.",
        image: "<img src='static/images/instruction_2back_en.gif' />",
        firstGameLetter: "Expliquons la tâche de n-back lettres."
    },
    instructions3back: {
        changeN: "Maintenant, vous allez passer à un niveau n-back différent.",
        letter: "Dans cette tâche, des <strong>lettres</strong> apparaîtront à l'écran consécutivement.",
        yourTask1: "Votre tâche sera <strong>d'appuyer sur la touche 'J' si la lettre à l'écran est la même que celle d'il y a <strong style='color:red'>trois</strong> lettres</strong>.",
        yourTask2: "Sinon, appuyez sur la <strong>touche 'F'</strong>.",
        image: "<img src='static/images/instruction_3back_en.gif' />",
        firstGameLetter: "Expliquons la tâche de n-back lettres."
    },
    generalInstruction: {
        fastAndAccurate: "Essayez d'être aussi rapide et précis que possible !",
        clickNext: "Si les instructions sont claires, cliquez sur <strong>Suivant</strong>",
    },
    practice: {
        practice: "D'abord, vous pouvez vous entraîner un peu à la tâche.",
        startPractice: "Appuyez sur n'importe quelle touche du clavier pour commencer l'entraînement !",
        end: "Fin de l'entraînement."
    },
    betweenBlocks: {
        rest: "Maintenant vous pouvez vous reposer un peu.",
        continue: "Appuyez sur n'importe quelle touche pour continuer la tâche !",
        pressKey: "Si vous êtes prêt(e), appuyez sur une touche !"
    },
    end: {
        end: "Fin de la tâche.",
        thankYou: "Merci !",
    },
    button: {
        next: "Suivant",
        previous: "Précédent",
    },
    fullscreen: {
        fullscreenText: "L'expérience passera en mode plein écran lorsque vous appuierez sur le bouton ci-dessous.",
        fullscreenButton: "Continuer"
    },
    feedback: {
        correct: "Correct !",
        wrong: "Incorrect !",
        noResponse: "Vous n'avez pas répondu !",
        accuracy: "Vous avez répondu correctement à ",
        accuracy2: "% des essais.",
        rt: "Votre temps de réponse moyen était de ",
        rt2: " ms."
    },
    task1back: {
        start: "La tâche commence maintenant. À partir de maintenant, vous ne recevrez plus de feedback.",
        remember1: "Rappelez-vous : appuyez sur la touche <strong>'J'</strong> si la lettre à l'écran est la même que la <strong style='color:red'>précédente</strong></strong>.",
        remember2: "Sinon, appuyez sur la touche <strong>'F'</strong>.",
        press: "Appuyez sur n'importe quelle touche pour continuer.",
    },
    task2back: {
        start: "La tâche commence maintenant. À partir de maintenant, vous ne recevrez plus de feedback.",
        remember1: "Rappelez-vous : appuyez sur la touche <strong>'J'</strong> si la lettre à l'écran est la même que celle d'il y a <strong style='color:red'>deux</strong> lettres.",
        remember2: "Sinon, appuyez sur la touche <strong>'F'</strong>.",
        press: "Appuyez sur n'importe quelle touche pour pour continuer.",
    },
    task3back: {
        start: "La tâche commence maintenant. À partir de maintenant, vous ne recevrez plus de feedback.",
        remember1: "Rappelez-vous : appuyez sur la touche <strong>'J'</strong> si la lettre à l'écran est la même que celle d'il y a <strong style='color:red'>trois</strong> lettres.",
        remember2: "Sinon, appuyez sur la touche <strong>'F'</strong>.",
        press: "Appuyez sur n'importe quelle touche pour pour continuer.",
    },
    parameters: {
        subject: "Numéro du Sujet :",
        session: "Numéro de Session :"
    },
    startWarning: {
        startSubject: "Vous êtes sur le point de commencer le jeu avec le <strong>Numéro de Sujet ",
        startSession: "</strong> et le <strong>Numéro de Session ",
        startButton: "Commencer la tâche !",
        goBackButton: "Modifier les paramètres"
    },
    incentives: {
        selectedBlock: "Le sous-bloc sélectionné pour le paiement était le sous-bloc numéro ${subBlockInteger} :",
        accuracies: "Votre précision dans ce sous-bloc était de ${percentPostVisual}% pour les essais suivant le n-back visuel, ${percentVN}% pour le n-back visuel, ${percentN}% pour le n-back classique.",
        visualDetails: "N-back visuel essais totaux : ${totalTrialsVN}, essais corrects : ${corTrialsVN}.",
        letterDetails: "N-back lettres essais totaux : ${totalTrialsN}, essais corrects : ${corTrialsN}.",
        postVisualDetails: "Post n-back visuel essais totaux : ${postVisualTrials}, essais corrects : ${corPostVisualTrials}.",
        paymentExplanation: "Votre paiement est basé sur votre performance :\n- 50% sur les essais après le n-back visuel (${accuracyPostVisual})\n- 25% sur le n-back visuel (${accuracyVN})\n- 25% sur le n-back lettres (${accuracyN})",
        totalPayment: "Votre bonus total sera de : ${totalPayment}€",
        thankYou: "Merci de votre participation à cette expérience !",
        redirect: "",
        continue: "Appuyez sur Entrée pour continuer"
    },
    paymentExplanation1Back: {
        title: "Informations sur le paiement",
        mainText: "En plus de votre paiement de base, vous pouvez gagner un bonus allant jusqu'à ${payment}€ en fonction de vos performances.",
        changeScore: `Attention ! À partir de maintenant, les 50% de votre bonus dépendront de votre résultat à la <span style="color:red;"><strong>première lettre</strong></span> après le n-back visuel du sous-bloc choisi pour le paiement.`,
        score: `
        <div class="payment-info">
                <div class="nback-sequence" style="position: relative;">
                    <div class="nback-box">... K L <span class="highlight">M</span></div>
                    <div class="nback-box visual-nback-box" id="visual-nback-box">n-back visuel<br>(10 trials)</div>
                    <div class="nback-box" id="letter-nback-box"><span class="highlight">M</span> A U Q P B ...</div>
                    <!-- Horizontal accolade below visual n-back and letter n-back -->
                <div style="position: absolute; left: 50%; transform: translateX(-30%); top: 75px; width: 400px; pointer-events: none;">
                <svg width="400" height="70"> <!-- Hauteur augmentée pour accommoder le décalage -->
                    <path d="M20,30 Q20,55 60,55 L350,55 Q390,55 390,30" stroke="#333" fill="transparent" stroke-width="3"/>
                </svg>
                    <div style="text-align:center; font-size:1em; margin-top:5px;">un sous-bloc</div>
                </div>
                </div>
                <br><br>
                <p>À la fin de l'expérience, un sous-bloc sera sélectionné aléatoirement pour le calcul de votre bonus.</p>
                <p>Votre bonus sera calculé en fonction de votre précision dans trois parties :</p>
                
                <ol>
                    <li><strong>50% de votre bonus</strong> dépend de votre précision lors de l'essai immédiatement après le n-back visuel.
                    <br>Dans l'exemple ci-dessus, cela signifie identifier correctement que le <span class="highlight">M</span> correspond à la dernière lettre avant la tâche visuelle.</li>
                    <li><strong>25% de votre bonus</strong> dépend de votre précision lors des essais du n-back visuel.</li>
                    <li><strong>25% de votre bonus</strong> dépend de votre précision lors des essais restants du n-back de lettres.</li>
                </ol>
    
                <div class="payment-formula">
                    Bonus final = __PAYMENT__€ × (0,5 × précision_après_visuel + 0,25 × précision_visuel + 0,25 × précision_lettres)
                </div>
                
                <p><strong>Exemple :</strong> Si vous obtenez :<br>
                - 100 % de précision dans les essais après le N-back visuel<br>
                - 50 % de précision dans le N-back visuel<br>
                - 50 % de précision dans le N-back de lettres<br>
                Votre bonus serait : __PAYMENT__€ × (0,5 × 1.0 + 0,25 × 0,5 + 0,25 × 0,5) = __PAYMENT__€ × 0,75</p>
                
                <div class="important-note">
                    💡 À retenir : l’élément le plus important pour maximiser votre bonus est d’identifier, après chaque n-back visuel, si la première lettre du n-back lettres correspond à la dernière lettre que vous avez vue avant le n-back visuel !
                </div>
            </div>
            
            <p><i>Lorsque vous êtes prêt à commencer, appuyez sur n’importe quelle touche pour continuer.</i></p>
        </div>`,
    },
    paymentExplanation2Back: {
        title: "Informations sur le paiement",
        mainText: "En plus de votre rémunération de base, vous pouvez gagner un bonus allant jusqu'à ${payment}€ en fonction de votre performance.",
        changeScore: `Attention ! À partir de maintenant, les 50% de votre bonus dépendront de votre résultat aux <span style="color:red;"><strong>deux premières lettres</strong></span> après le n-back visuel du sous-bloc choisi pour le paiement.`,
        score: `
        <div class="payment-info">
            <div class="payment-illustration">
                <h3>Fonctionnement :</h3>
                <div class="nback-sequence" style="position: relative;">
                    <div class="nback-box">... K <span class="highlight">M P</span></div>
                    <div class="nback-box visual-nback-box" id="visual-nback-box">n-back visuel<br>(10 essais)</div>
                    <div class="nback-box" id="letter-nback-box"><span class="highlight">M B</span> U Q P B ...</div>
                    <!-- Accolade horizontale sous les n-back -->
                <div style="position: absolute; left: 50%; transform: translateX(-30%); top: 75px; width: 400px; pointer-events: none;">
                <svg width="400" height="70"> <!-- Hauteur augmentée pour accommoder le décalage -->
                    <path d="M20,30 Q20,55 60,55 L350,55 Q390,55 390,30" stroke="#333" fill="transparent" stroke-width="3"/>
                </svg>
                    <div style="text-align:center; font-size:1em; margin-top:5px;">un sous-bloc</div>
                </div>
                </div>
                <br><br>
                <p>À la fin de l'expérience, un sous-bloc sera sélectionné aléatoirement pour le calcul de votre bonus.</p>
                <p>Votre bonus sera calculé en fonction de votre précision en trois parties :</p>
    
                <ol>
                    <li><strong>50 % de votre bonus</strong> dépend de votre précision dans les deux essais juste après le n-back visuel.
                    <br>Dans l'exemple ci-dessus, cela signifie identifier correctement que le <span class="highlight">M</span> mais pas le <span class="highlight">B</span> correspond au <span class="highlight">M</span> avant la tâche visuelle.</li>
                    <li><strong>25 % de votre bonus</strong> dépend de votre précision dans les essais du n-back visuel.</li>
                    <li><strong>25 % de votre bonus</strong> dépend de votre précision dans les essais restants du n-back lettres.</li>
                </ol>
                <div class="payment-formula">
                    Bonus final = __PAYMENT__€ × (0,5 × précision_après_visuel + 0,25 × précision_visuel + 0,25 × précision_lettres)
                </div>
    
                <p><strong>Exemple :</strong> Si vous obtenez :<br>
                - 100 % de précision dans les essais après le N-back visuel<br>
                - 50 % de précision dans le N-back visuel<br>
                - 50 % de précision dans le N-back de lettres<br>
                Votre bonus serait : __PAYMENT__€ × (0,5 × 1.0 + 0,25 × 0,5 + 0,25 × 0,5) = __PAYMENT__€ × 0,75</p>
    
                <div class="important-note">
                    💡 À retenir : l’élément le plus important pour maximiser votre bonus est d’identifier, après chaque n-back visuel, si les deux premières lettres du n-back lettres correspondent respectivement aux deux dernières lettres que vous avez vues avant le n-back visuel !
                </div>
            </div>
    
            <p><i>Lorsque vous êtes prêt à commencer, appuyez sur n'importe quelle touche pour continuer.</i></p>
        </div>`,
    },
    paymentExplanation3Back: {
        title: "Informations sur le paiement",
        mainText: "En plus de votre rémunération de base, vous pouvez gagner un bonus allant jusqu'à ${payment}€ en fonction de votre performance.",
        changeScore: `Attention ! À partir de maintenant, les 50% de votre bonus dépendront de votre résultat aux <span style="color:red;"><strong>trois premières lettres</strong></span> après le n-back visuel du sous-bloc choisi pour le paiement.`,
        score: `
        <div class="payment-info">
            <div class="payment-illustration">
                <h3>Fonctionnement :</h3>
                <div class="nback-sequence" style="position: relative;">
                    <div class="nback-box">... A <span class="highlight">K M P</span></div>
                    <div class="nback-box visual-nback-box" id="visual-nback-box">n-back visuel<br>(10 essais)</div>
                    <div class="nback-box" id="letter-nback-box"><span class="highlight">Q M B</span> U P B Q...</div>
                    <!-- Accolade horizontale sous les n-back -->
                <div style="position: absolute; left: 50%; transform: translateX(-30%); top: 75px; width: 400px; pointer-events: none;">
                <svg width="400" height="70"> <!-- Hauteur augmentée pour accommoder le décalage -->
                    <path d="M20,30 Q20,55 60,55 L350,55 Q390,55 390,30" stroke="#333" fill="transparent" stroke-width="3"/>
                </svg>
                    <div style="text-align:center; font-size:1em; margin-top:5px;">un sous-bloc</div>
                </div>
                </div>
                <br><br>
                <p>À la fin de l'expérience, un sous-bloc sera sélectionné aléatoirement pour le calcul de votre bonus.</p>
                <p>Votre bonus sera calculé en fonction de votre précision en trois parties :</p>
    
                <ol>j
                    <li><strong>50 % de votre bonus</strong> dépend de votre précision dans les trois essais juste après le n-back visuel.
                    <br>Dans l'exemple ci-dessus, cela signifie identifier correctement que le <span class="highlight">M</span> mais pas le <span class="highlight">B</span> ni le <span class="highlight">Q</span> correspond au <span class="highlight">M</span> avant la tâche visuelle.</li>
                    <li><strong>25 % de votre bonus</strong> dépend de votre précision dans les essais du n-back visuel.</li>
                    <li><strong>25 % de votre bonus</strong> dépend de votre précision dans les essais restants du n-back lettre.</li>
                </ol>
                <div class="payment-formula">
                    Bonus final = __PAYMENT__€ × (0,5 × précision_après_visuel + 0,25 × précision_visuel + 0,25 × précision_lettres)
                </div>
    
                <p><strong>Exemple :</strong> Si vous obtenez :<br>
                - 100 % de précision dans les essais après le N-back visuel<br>
                - 50 % de précision dans le N-back visuel<br>
                - 50 % de précision dans le N-back de lettres<br>
                Votre bonus serait : __PAYMENT__€ × (0,5 × 1.0 + 0,25 × 0,5 + 0,25 × 0,5) = __PAYMENT__€ × 0,75</p>
    
                <div class="important-note">
                    💡 À retenir : l’élément le plus important pour maximiser votre bonus est d’identifier, après chaque n-back visuel, si les trois premières lettre du n-back lettres correspondent respectivement aux trois dernières lettres que vous avez vues avant le n-back visuel !
                </div>
            </div>
    
            <p><i>Lorsque vous êtes prêt à commencer, appuyez sur n'importe quelle touche pour continuer.</i></p>
        </div>`,
    },
    overallTrainingIntro: {
        title: "Entraînement Complet",
        description: "Maintenant vous allez pratiquer le fonctionnement de l'expérience réelle : alterner entre les tâches de n-back visuel et de n-back lettres.",
        structure: "Vous commencerez par 10 essais de n-back lettres, puis ferez un sous-bloc: une tâche de n-back visuel (10 essais), et une tâche de n-back lettres.",
        importance: "Cet entraînement vous aidera à comprendre la structure complète d'un sous-bloc et le fonctionnement du système de notation.",
        feedback: "À la fin, vous verrez un retour sur votre performance et comment votre bonus serait calculé si c'était un vrai sous-bloc.",
        highlightEasy: "Portez une attention particulière à la lettre immédiatement après le n-back visuel - c'est la plus importante pour votre bonus !",
        highlightHard: "Portez une attention particulière aux {level} premières lettres immédiatement après le n-back visuel - elles sont les plus importantes pour votre bonus !",
        ready: "Quand vous êtes prêt à commencer l'entraînement complet, appuyez sur n'importe quelle touche."
    },
    overallTrainingFeedback: {
        title: "Entraînement Terminé - Démonstration du Système de Points",
        performance: "Voici comment votre performance serait notée si c'était un vrai sous-bloc et qu'il serait sélectionné pour le paiement (au hasard) :",
        nback: "N-back lettres après le n-back visuel : {accuracy}% de précision ({correct}/{total} essais)",
        visualNback: "N-back visuel : {accuracy}% de précision ({correct}/{total} essais)",
        afterVisual: "Lettres après le n-back visuel : {accuracy}% de précision ({correct}/{total} essais)",
        keyImportanceHard: "💡 Point clé : Les {level} premières lettres immédiatement après le n-back visuel valent 50% de votre bonus !",
        keyImportanceEasy: "💡 Point clé : La dernière lettre immédiatement après le n-back visuel vaut 50% de votre bonus !",
        calculation: "Calcul du bonus : €{payment} × (0.5 × {afterVisualAcc} + 0.25 × {visualAcc} + 0.25 × {letterAcc}) = €{totalBonus}",
        rememberHard: "À retenir : Gardez toujours en mémoire les {level} dernières lettres pendant le n-back visuel!",
        rememberEasy: "À retenir : Gardez toujours en mémoire la dernière lettre pendant le n-back visuel!",
        continue: "Appuyez sur n'importe quelle touche pour continuer vers l'expérience principale."
    },

    // New: comprehension check (French)
    comprehensionIntro: "Avant de commencer l’expérience, vous devez répondre correctement à quelques questions de compréhension.",
    comprehension: {
        q1Hard: {
            prompt: "Veuillez sélectionner la bonne réponse:",
            options: [
                "Je suis payé en fonction de la moyenne de ma précision sur tous les essais (100% de bonus).",
                "Je suis payé indépendamment de ma précision (100% du bonus).",
                "Je suis payé en fonction du n-back lettres uniquement pour un sous-bloc sélectionné au hasard parmi les 12 de l’expérience.",
                "Je suis payé en fonction de ma précision sur le n-back visuel (25% du bonus), ma précision sur le n-back lettres suivant (25% du bonus) et ma précision sur les trois premières lettres du n-back lettres en particulier (50% du bonus ), pour un sous-bloc sélectionné au hasard parmi les 12 de l’expérience."
            ]
        },
        q1Easy: {
            prompt: "Veuillez sélectionner la bonne réponse:",
            options: [
                "Je suis payé en fonction de la moyenne de ma précision sur tous les essais (100% de bonus).",
                "Je suis payé indépendamment de ma précision (100% du bonus).",
                "Je suis payé en fonction du n-back lettres uniquement pour un sous-bloc sélectionné au hasard parmi les 12 de l’expérience.",
                "Je suis payé en fonction de ma précision sur le n-back visuel (25% du bonus), ma précision sur le n-back lettres suivant (25% du bonus) et ma précision sur la première lettre du n-back lettres (50% du bonus ), pour un sous-bloc sélectionné au hasard parmi les 12 de l’expérience."
            ]
        },
        q2: {
            prompt: "Je commence un n-back visuel. Le point est à la même position que le dernier point du dernier n-back visuel. Sur quelle touche dois-je appuyer ?",
            options: [
                "La touche “F”.",
                "La touche “J”.",
                "La touche “espace”."
            ]
        },
        q3Hard: {
            prompt: "Je viens de terminer un n-back visuel. Avant lui, les trois dernières lettres que j’ai vues étaient A O I. La lettre A apparaît. Sur quelle touche dois-je appuyer ?",
            options: [
                "La touche “F”.",
                "La touche “J”.",
                "La touche “espace”."
            ]
        },
        q3Easy: {
            prompt: "Je viens de terminer un n-back visuel. Avant lui, la dernière lettre que j’ai vue était I. La lettre I apparaît. Sur quelle touche dois-je appuyer ?",
            options: [
                "La touche “F”.",
                "La touche “J”.",
                "La touche “espace”."
            ]
        },
        correct_answers: {
            q1: "Je suis payé en fonction du n-back lettres uniquement pour un sous-bloc de l’expérience.",
            q2: "La touche “F”.",
            q3: "La touche “J”."
        },
        tryAgain: "Une ou plusieurs réponses sont incorrectes. Veuillez relire les consignes et réessayer.",
        success: "Toutes les réponses sont correctes. Appuyez sur une touche pour continuer."
    },
    loopAgain: {
        failed: "Vous avez répondu incorrectement à au moins une des questions.",
        viewInstructions: "Vous allez revoir les instructions.",
        surveyAgain: "Puis vous allez de nouveau répondre aux questions.",
        press: "Appuyez sur <strong>Suivant</strong> pour continuer !",
    }
};


let language = fr;