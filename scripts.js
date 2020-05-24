/*
* Developed by Michael Chaplin
* As a part of the Odin Project Curriculumn Calculator project
* Created in my spare time while working some 60 hour weeks
* May 10 through May 24, 2020
*
* Features:
*   - Has a display history of the current string of calculations
*   - Allows for continuing a calculation after the current string of calculations has ceased (ie. equals was pressed)
*   - Ability to change the chosen operator before a new value is selected
*   - Formats floating point numbers to always have a leading zero (ie 0.)
*   - Adds parentheses around negative numbers in the display History 
*   - Prevents users from breaking the calculator by dividing by zero
*   - Converts large numbers to scientific notation on the display
*
* Future TODO List:
*   - Add quality bitwise check for all flags
*   - Mix in some arrays and .reduce for BEDMAS calculations and display values
*   - Make some array maps for each of the eventIDs
*   - Trim the leading or trailing zeros of a built number
*   - Adjust the size of the calculator display to not be affected by the numbers within (ie. don't disfigure image)
*
* Known bugs to fix:
*   - When pressing buttons in order of: changeSign -> Backspace, restarts the number building
*   - When pressing changeSign as the first number, it displays a "0"
*   - When the first displayHistory value is written, it tweaks the size of the displayVal and displayHistory
*/

// Defines all the calculator button numbers
const num0 = document.querySelector('#btn-0');
const num1 = document.querySelector('#btn-1');
const num2 = document.querySelector('#btn-2');
const num3 = document.querySelector('#btn-3');
const num4 = document.querySelector('#btn-4');
const num5 = document.querySelector('#btn-5');
const num6 = document.querySelector('#btn-6');
const num7 = document.querySelector('#btn-7');
const num8 = document.querySelector('#btn-8');
const num9 = document.querySelector('#btn-9');
const numDecimal = document.querySelector('#btn-decimal');

// Defines all the calculator operations
const opnAdd = document.querySelector('#opn-add');
const opnSub = document.querySelector('#opn-subtract');
const opnMultiply = document.querySelector('#opn-multiply');
const opnDivide = document.querySelector('#opn-divide');

// Defines all the calculator functions
const funcBackspace = document.querySelector('#func-backspace');
const funcClear = document.querySelector('#func-clear');
const funcSign = document.querySelector('#func-sign');
const funcEquals = document.querySelector('#func-equals');

// Defines the calculator display fields 
const calcDisplay = document.querySelector('#calc-display');
const calcDisplayHistory = document.querySelector('#calc-display-history');

// Flags
let isNum = false;
let isOpn = false;
let isEquals = false;
let isDecimal = false;
let calcStarted = false;
let calcFinished = false;
let clearDisplay = false;
let prevBtnIsOpn = false;
let num1Selected = false;
let opnSelected = false;
let decimalSelected = false;
let divZeroCheck = false;
let needPostDecimalVal = false;
let btnNum = false;
let numBuilder = false;
let keyAllowed = false;

// Values
let currentNum1;
let currentNum2;
let currentOpn;
let prevOpn = -1;
let numLimit = 0;
let clickID;
let keyID;
let displayVal = " ";
let displayHistory = " ";
let total;

// Adds functionality to click the buttons
const buttons = document.querySelectorAll('.calc-btn');
buttons.forEach((button) => {
    
    button.addEventListener('click', (event) => {
        clickID = event.target.id;
        console.log(`clickID = ${clickID}`);
        calculate(clickID, "click");
    });
});

// Sets up keyboard support for the calculator
document.addEventListener('keypress', (event) => {
    keyID = event.key;

    switch (keyID) {
        case "Enter":
            keyID = "func-equals";
            keyAllowed = true;
            break;
        case "+":
            keyID = "opn-add";
            keyAllowed = true;
            break;
        case "-":
            keyID = "opn-subtract";
            keyAllowed = true;
            break;
        case "*":
            keyID = "opn-multiply";
            keyAllowed = true;
            break;
        case "/":
            keyID = "opn-divide";
            keyAllowed = true;
            break;
        case "c":
            keyID = "func-clear";
            keyAllowed = true;
            break;
        default:
            console.log(`key not a keyboard function = ${keyID}`)
            break;
    }
    // Dis-allowed keys for keyboard events:
    // Backspace/Del, numpad decimal and changeSign
    ((keyID >= 0 && keyID <= 9) || keyAllowed) ? keyAllowed = true : keyAllowed = false;
    (keyAllowed) ? calculate(keyID, "kbd") : console.log(`keyID = ${keyID} is being ignored`);
    keyAllowed = false; // Resets the flag  
});

/* Performs the functions of an online calculator   
*
*   @params eventID     The representative ID of either a click or keyboard event
*   @params inputType   The passed in type of input: Mouse click or Keyboard button press
*   @return None
*/
const calculate = (eventID, inputType) => {

    switch (inputType) {
        case "click":
            isNum = (eventID.search("btn") != -1);
            if (isNum) (btnNum = (eventID.charAt(eventID.length - 1))), calcStarted = true;
            break;
        case "kbd":
            isNum = (eventID >= 0 && eventID <= 9);
            if (isNum) ((btnNum = eventID), calcStarted = true);
            break;
        default:
            console.log(`inputType error = ${inputType}`);
            break;
    }
    // Checks on the key/button that has been pressed
    isOpn = (eventID.search("opn") != -1);
    isEquals = (eventID.search("equals") != -1);
    isDecimal = (eventID.search("decimal") != -1);
    clearDisplay = (eventID.search("clear") != -1);
    isBackspace = (eventID.search("backspace") != -1);
    changeSign = (eventID.search("sign") != -1);
    if (isOpn) currentOpn = eventID.slice(4), opnSelected = true;

    // Resets the calculator with any button press after a divideByZero attempt
    if (divZeroCheck && calcStarted) {
        divZeroCheck = false;
        console.log("Resetting from a divide by zero");
        resetCalc();
        return;
    }

    // Checks on the building of each number to input
    if (isNum && numLimit < 9) {
        if (decimalSelected && isDecimal) {
            needPostDecimalVal = true;
            console.log("Decimal already selected");
            return; // Only allow for 1 decimal place to be used

        } else if (isDecimal && !decimalSelected) {
            (numBuilder) ? (displayVal += ".") : (displayVal = "0.", numBuilder = true);
            decimalSelected = true;
            needPostDecimalVal = true;
            console.log("Initial decimal place selected");
            calcDisplay.textContent = displayVal;

        } else {
            (numBuilder) ? (displayVal += btnNum) : (displayVal = btnNum);
            console.log(`Number selected = ${btnNum}`);
            numBuilder = true;
            needPostDecimalVal = false; // Resetting flag
            numLimit++;
            calcDisplay.textContent = displayVal;
        }
        prevBtnIsOpn = false; // Resetting flag

    } else if (isNum && numLimit >= 9) {
        console.log(`numLimit >= 9`);
        return; // Don't allow for more than 9 digits to be entered 

    } else if (clearDisplay) {
        resetCalc();

    } else if (isBackspace && (displayVal.length > 0) && !calcFinished) {
        // FYI, !calcFinished only allows for the backspace to work during numBuilding
        console.log("Removing the last entered digit");
        displayVal = displayVal.slice(0, (displayVal.length - 1));
        updateDisplay(displayVal, displayHistory);

        numLimit--;
        isBackspace = false; // Resetting flag

    } else if (changeSign) {
        console.log("Changing sign of number");
        displayVal = (Number(displayVal) * (-1));
        updateDisplay(displayVal, displayHistory);
        changeSign = false; // Resetting flag

    } else {
        console.log(`Operation or function has been selected`);
        numBuilder = false;
        decimalSelected = false;
        isDecimal = false;
        numLimit = 0;

        // All pre-calc checks to prepare for the next calculation
        // All of these checks return void
        if (calcFinished && !isBackspace) {
            currentNum1 = Number(displayVal);
            if (currentNum1 >= 0) {
                displayHistory = `${displayVal}${getOpnVal(currentOpn)}`;
            } else {
                displayHistory = `(${displayVal})${getOpnVal(currentOpn)}`;
            }
            updateDisplay(displayVal, displayHistory);
            calcFinished = false; // Resetting flag
            prevBtnIsOpn = true; // Resetting flag
            prevOpn = currentOpn;
            console.log("Current calculation has finished");
            return;

        } else if (needPostDecimalVal) {
            // Forces the user to finish entering a floating point number
            console.log(`Number needs a digit after the decimal place`);
            return;

        } else if (!calcStarted) {
            console.log(`Calculation needs a number to start with`);
            return;

        } else if (currentOpn == "divide" && (Number(displayVal) == 0)) {
            divZeroCheck = true;
            updateDisplay("Nice try", "Press any key...");
            console.log("The clever user tried to divide by 0");
            return;

        } else if (isOpn && prevBtnIsOpn) {
            // Allows the user to change operators before a new number is chosen
            if (prevOpn != currentOpn) {
                displayHistory = displayHistory.slice(0, displayHistory.length - 3);
                displayHistory += getOpnVal(currentOpn);
                updateDisplay(displayVal, displayHistory)
                console.log(`Chosen operation is being changed from ${prevOpn} to ${currentOpn}`);
            } else {
                console.log("Same operations has been selected. No change required");
            }
            prevOpn = currentOpn;
            return; 
        }

        // First number being entered into the calculator
        if (!num1Selected && !isBackspace) {
            console.log(`First number in the operation has been selected`);
            num1Selected = true;
            currentNum1 = Number(displayVal);
            if (isEquals) {
                console.log("Operation selected was an '='");
                displayHistory += (currentNum1 + " =");
                calcFinished = true;
            } else {
                console.log(`Operation selected = ${currentOpn}`);
                if (currentNum1 >= 0) {
                    displayHistory += (formatTotal(currentNum1, 7) + getOpnVal(currentOpn));
                } else {
                    // Formats any negative numbers to be in parentheses
                    displayHistory += (`(${formatTotal(currentNum1, 6)})` + getOpnVal(currentOpn));
                }
            }
        } else if (num1Selected && opnSelected && isOpn && !prevBtnIsOpn) {
            console.log("An additional operator has been added to continue the calculation");
            currentNum2 = Number(displayVal);
            total = operate(prevOpn, currentNum1, currentNum2);
            displayVal = formatTotal(total, 9);
            currentNum1 = total;
            if (currentNum2 >= 0) {
                displayHistory += (formatTotal(currentNum2, 7) + getOpnVal(currentOpn));
            } else {
                // Formats any negative numbers to be in parentheses
                displayHistory += (`(${formatTotal(currentNum2, 6)})` + getOpnVal(currentOpn));
            }
        } else if (num1Selected && opnSelected && isEquals) {
            console.log("The equals button has been pressed to finish the current calculation");
            currentNum2 = Number(displayVal);
            total = operate(currentOpn, currentNum1, currentNum2);
            displayVal = formatTotal(total, 9);
            if (currentNum2 >= 0) {
                displayHistory += (formatTotal(currentNum2, 7) + " =");
            } else {
                // Formats any negative numbers to be in parentheses
                displayHistory += `(${formatTotal(currentNum2, 7)}) =`;
            }
            calcFinished = true;
            opnSelected = false;
        }
        console.log("Updating the display");
        updateDisplay(displayVal, displayHistory);
        prevOpn = currentOpn;
        prevBtnIsOpn = isOpn;
    }
}

/* Formats and returns number to fit it within the calculator display on the webpage  
*
*   @params     total       A floating point or integer that needs to be formatted
*   @params     numDigits   An integer that specifies the number of digits to format the number to
*   @return                 Returns a formatted string tailored to the display size
*/
const formatTotal = (total, numDigits) => {
    
    if(getNumDigits(total) > numDigits) {
        let numString = String(total);
        let decimalIndex = numString.indexOf(".", 0);

        if (decimalIndex == -1) {
            return total.toExponential(4); // Changes to exponential for large integers
        } else {
            let preDecimal = numString.slice(0, decimalIndex);
            let newDecimalLength = numDigits - (preDecimal.length);
            if (newDecimalLength >= 19) newDecimalLength = 19;
            console.log(`preDecimal = ${preDecimal}`);
            console.log(`newDecimalLength = ${newDecimalLength}`);
            console.log(`preDecimal.length - 1 = ${preDecimal.length - 1}`);
            return total.toFixed(newDecimalLength); // Format totals to 9 digits (decimal inclusive)
        }
    } else {
        return total; 
    }
}

/*  Calculates the number of digits excluding the decimal place of a given number  
*
*   @params num     A floating point or integer to calculate the number of digits contained within
*   @return         A string representation of the input number with a stripped out decimal place
*/
const getNumDigits = (num) => {
    return String(num).replace('.','').length;
}

/*  Updates the display lines of the Calculator 
*
*   @params displayVal      A string to update the main display line of the calculator 
*   @params displayHistory  A string to update the history calculation line of the calculator    
*   @return None
*/
const updateDisplay = (displayVal, displayHistory) => {
    calcDisplay.textContent = displayVal;
    calcDisplayHistory.textContent = displayHistory;
}

/*  Given an operation, returns the symbol to add to the calculator's display 
*
*   @params currentOpn  A mathematical operation to get the equivalent symbol
*   @return             Returns a string equivalent of the passed in operation for the display screen
*/
const getOpnVal = (currentOpn) => {
    switch (currentOpn) {
        case "add":
            return ` + `;
        case "subtract":
            return ` \u2013 `;
        case "multiply":
            return ` \xD7 `;
        case "divide":
            return ` \xF7 `;
        default:
            console.log(`currentOpn = ${currentOpn}`);
            break;
    }
}

/*  Resets the calculator's display and values  
*
*   @params None  
*   @return None
*/
const resetCalc = () => {
    displayVal = " ";
    displayHistory = " ";
    updateDisplay(displayVal, displayHistory);
    calcStarted = false, calcFinished = false;
    currentNum1 = undefined, currentNum2 = undefined, currentOpn = undefined, total = undefined;
    numLimit = 0;
    num1Selected = false, opnSelected = false, decimalSelected = false, prevOpn = undefined;
    prevBtnIsOpn = false, needPostDecimalVal = false, numBuilder = false;

    console.log(`Calculator is being reset`);
}

// Basic math functions
const add = (num1, num2) => (num1 + num2);
const subtract = (num1, num2) => (num1 - num2);
const multiply = (num1, num2) => (num1 * num2);
const divide = (num1, num2) => (num1 / num2);

/*  Performs one of the calculator's basic math operations  
*
*   @params operation   One of the basic math functions to equate
*   @params num1        An integer or floating point value as the first number to use
*   @params num2        An integer or floating point value as the second number to use
*   @return             Equates the passed in operation with the given numbers
*/
const operate = function (operation, num1, num2) {
    switch (operation) {
        case "add":
            return add(num1, num2);    
        case "subtract":
            return subtract(num1, num2);
        case "multiply":
            return multiply(num1, num2);  
        case "divide":
            return divide(num1, num2);      
        default:
            console.log(`operation = ${operation}, num1 = ${num1}, num2 = ${num2}`);
            console.log(`operate = ${operate(operation, num1, num2)}`);
            return "ERROR";
    }
}


