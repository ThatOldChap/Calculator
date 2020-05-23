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
let displayVal = "";
let displayHistory = "";
let total;

let isNum = false;
let btnNum = false;
let isDecimal = false;
let isOpn = false;
let isEquals = false;
let buttonID;

let currentNum1;
let currentNum2;
let currentOpn;

let num1Selected = false;
let opnSelected = false;

let numBuilder = false;

// Adds functionality to use the buttons
const buttons = document.querySelectorAll('.calc-btn');
buttons.forEach((button) => {
    
    button.addEventListener('click', (event) => {
        buttonID = event.target.id;
        console.log(`Button = ${buttonID}`);

        isNum = (buttonID.search("btn") != -1);
        if (isNum) btnNum = (buttonID.charAt(buttonID.length - 1));
        isDecimal = (buttonID.search("decimal") != -1);

        isOpn = (buttonID.search("opn") != -1);
        if (isOpn) (currentOpn = buttonID.slice(4));

        isEquals = (buttonID.search("equals") != -1);
        let clearDisplay = (buttonID.search("clear") != -1);

        if (isNum) {
            if (isDecimal) {
                (numBuilder) ? (displayVal += ".") : (displayVal += "0.", numBuilder = true);
            } else {
                (numBuilder) ? (displayVal += btnNum) : (displayVal = btnNum);
                numBuilder = true;
            }
            calcDisplay.textContent = displayVal;
        } else if (clearDisplay) {
            resetCalc();
        } else {
            numBuilder = false;
            if (isOpn) (opnSelected = true);

            // First number being entered into the calculator
            if (!num1Selected) {
                num1Selected = true;
                currentNum1 = Number(displayVal);
                displayHistory += (currentNum1 + getOpnVal(currentOpn));
                calcDisplayHistory.textContent = displayHistory;

            // An additional operator has been added to continue the calculation
            } else if (num1Selected && opnSelected && isOpn) {
                currentNum2 = Number(displayVal);
                total = operate(currentOpn, currentNum1, currentNum2);
                displayVal = total;
                currentNum1 = total;
                displayHistory += (currentNum2 + getOpnVal(currentOpn));
                calcDisplay.textContent = displayVal;
                calcDisplayHistory.textContent = displayHistory;

            // The equals button has been pressed to finish the calculation
            } else if (num1Selected && opnSelected && isEquals) {
                currentNum2 = Number(displayVal);
                console.log(`currentNum1 = ${currentNum1}, currentNum2 = ${currentNum2} and currentOpn = ${currentOpn}`);
                total = operate(currentOpn, currentNum1, currentNum2);
                console.log(`total = ${total}`);
                displayHistory += currentNum2;
                displayVal = total;
                calcDisplayHistory.textContent += `${displayHistory} =`;
                calcDisplay.textContent = displayVal;
            }
            // TODO: Create function like updateDisplay(display, history)
        }
    }) 
});

const updateDisplay = (displayVal, displayHistory) => {

}

const getOpnVal = (currentOpn) => {
    switch (currentOpn) {
        case "add":
            return ` + `;
        case "subtract":
            return ` - `;
        case "multiply":
            return ` x `;
        case "divide":
            return ` / `;
        default:
            console.log(`currentOpn = ${currentOpn}`);
            break;
    }
}

const resetCalc = () => {
    displayVal = " ";
    displayHistory = " ";
    calcDisplay.textContent = displayVal;
    calcDisplayHistory.textContent = displayHistory;
    currentNum1 = undefined, currentNum2 = undefined, currentOpn = undefined;
    num1Selected = false, opnSelected = false;
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


