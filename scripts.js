/*
* Developed by Michael Chaplin
* As a part of the Odin Project Curriculumn Calculator project
* May XX, 2020
*/

// Defines all the calculator numbers
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

// Defines the display
const calcDisplay = document.querySelector('#calc-display');
const calcDisplayHistory = document.querySelector('#calc-display-history');

// TODO: Create an init() or reset() function to define all these
let displayVal = " ";
let displayHistory = " ";
let total;

let isNum = false;
let btnNum = false;
let isDecimal = false;
let decimalSelected = false;
let isOpn = false;
let isEquals = false;
let calcFinished = false;
let buttonID;
let clearDisplay = false;
let numLimit = 0;

let currentNum1;
let currentNum2;
let currentOpn;
let prevOpn;

let num1Selected = false;
let opnSelected = false;
let divZeroCheck = false;

let numBuilder = false;

/* TODO List:
*   - If doing any calc with a negative number, add it to the history in ()
*   - Allow ability to change operator before the next calculation
*   - Add backspace button functionality
*   - Don't allow operators to be pressed without any input numbers
*   - Don't allow a divide by 0 case
*   - Fix functionality to calculate BEDMAS strings like online-calculator
*   - Add keyboard number functionality
*/

// Adds functionality to use the buttons
const buttons = document.querySelectorAll('.calc-btn');
buttons.forEach((button) => {
    
    button.addEventListener('click', (event) => {
        buttonID = event.target.id;
        console.log(`Button = ${buttonID}`);

        isNum = (buttonID.search("btn") != -1);
        isDecimal = (buttonID.search("decimal") != -1);
        isOpn = (buttonID.search("opn") != -1);
        isEquals = (buttonID.search("equals") != -1);
        clearDisplay = (buttonID.search("clear") != -1);

        if (isOpn) currentOpn = buttonID.slice(4), opnSelected = true;
        if (isNum) btnNum = (buttonID.charAt(buttonID.length - 1));

        if (divZeroCheck) {
            divZeroCheck = false;
            resetCalc();
            return;
        }

        // Number is being constructed
        if (isNum && numLimit < 9) {
            if (decimalSelected && isDecimal) {
                return; // Only allow for 1 decimal place to be used
            } else if (isDecimal && !decimalSelected) {
                (numBuilder) ? (displayVal += ".") : (displayVal = "0.", numBuilder = true);
                decimalSelected = true;
                calcDisplay.textContent = displayVal;
            } else {
                (numBuilder) ? (displayVal += btnNum) : (displayVal = btnNum);
                numBuilder = true;
                numLimit++;
                calcDisplay.textContent = displayVal;
            }
        } else if (isNum && numLimit >= 9) {
            console.log(`numLimit >= 9`);
            return; // Don't allow for more than 9 digits to be entered 
        } else if (clearDisplay) {
            resetCalc();
        } else {
            numBuilder = false;
            decimalSelected = false;
            isDecimal = false;
            numLimit = 0;

            // Prepares the calculator for a new calculation on an old total
            if (calcFinished) {
                currentNum1 = Number(displayVal);
                displayHistory = (displayVal + getOpnVal(currentOpn));
                updateDisplay(displayVal, displayHistory);
                calcFinished = false;
                return; // Erase history and start new calculation with the current total
            } else if (currentOpn == "divide" && (Number(displayVal) == 0)) {
                divZeroCheck = true;
                updateDisplay("Nice try", "Press any key...");
                console.log("User tried to divide by 0");
                return;
            }

            // First number being entered into the calculator
            if (!num1Selected) {
                console.log(`First number selected`);
                num1Selected = true;
                currentNum1 = Number(displayVal);
                displayHistory += (formatTotal(currentNum1) + getOpnVal(currentOpn));

            // An additional operator has been added to continue the calculation
            } else if (num1Selected && opnSelected && isOpn) {
                currentNum2 = Number(displayVal);
                total = operate(prevOpn, currentNum1, currentNum2);
                displayVal = formatTotal(total, 9);
                currentNum1 = total;
                displayHistory += (formatTotal(currentNum2, 7) + getOpnVal(currentOpn));

            // The equals button has been pressed to finish the calculation
            } else if (num1Selected && opnSelected && isEquals) {
                currentNum2 = Number(displayVal);
                console.log(`currentNum1 = ${currentNum1}, currentNum2 = ${currentNum2} and currentOpn = ${currentOpn}`);
                total = operate(currentOpn, currentNum1, currentNum2);
                console.log(`total = ${total} and length = ${getNumDigits(total)}`);

                displayVal = formatTotal(total, 9);
                displayHistory += (formatTotal(currentNum2, 7) + " =");
                calcFinished = true;
                opnSelected = false;
            }

            updateDisplay(displayVal, displayHistory);
            prevOpn = currentOpn;
        }
    }) 
});

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

const getNumDigits = (num) => {
    return String(num).replace('.','').length;
}

const updateDisplay = (displayVal, displayHistory) => {
    calcDisplay.textContent = displayVal;
    calcDisplayHistory.textContent = displayHistory;
}

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

const resetCalc = () => {
    displayVal = " ";
    displayHistory = " ";
    updateDisplay(displayVal, displayHistory);
    currentNum1 = undefined, currentNum2 = undefined, currentOpn = undefined, total = undefined;
    numLimit = 0;
    num1Selected = false, opnSelected = false, calcFinished = false; decimalSelected = false;
    console.log(`Calculator is being reset`);
}

// Basic math functions
const add = (num1, num2) => (num1 + num2);
const subtract = (num1, num2) => (num1 - num2);
const multiply = (num1, num2) => (num1 * num2);
const divide = (num1, num2) => (num1 / num2);

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


