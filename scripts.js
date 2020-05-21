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

// Defines all the calculator operations
const opnAdd = document.querySelector('#opn-add');
const opnSub = document.querySelector('#opn-subtract');
const opnMultiply = document.querySelector('#opn-multiply');
const opnDivide = document.querySelector('#opn-divide');
const opnEquals = document.querySelector('#opn-equals');

// Defines all the calculator functions
const funcBackspace = document.querySelector('#func-backspace');
const funcClear = document.querySelector('#func-clear');
const funcSign = document.querySelector('#func-sign');
const funcDecimal = document.querySelector('#func-decimal');

// Defines the display
const calcDisplay = document.querySelector('#calc-display');
const calcDisplayHistory = document.querySelector('#calc-display-history');

let currentNum1;
let currentNum2;
let currentOpn;

let num1Selected = false;
let num2Selected = false;
let opnSelected = false;

// Adds functionality to use the buttons
const buttons = document.querySelectorAll('.calc-btn');
buttons.forEach((button) => {
    
    button.addEventListener('click', (event) => {
        let buttonID = event.target.id;
        console.log(`Button = ${buttonID}`);

        let isNum = (buttonID.search("btn") != -1);
        let isOpn = (buttonID.search("opn") != -1);
        let isEquals = (buttonID.search("equals") != -1);
        let clearDisplay = (buttonID.search("clear") != -1);

        // Inital selection of the 1st number
        if (!num1Selected && !num2Selected && !opnSelected && isNum) {
            calcDisplay.textContent += `${buttonID.charAt(buttonID.length - 1)}`;
            calcDisplayHistory.textContent += `${buttonID.charAt(buttonID.length - 1)}`;
            currentNum1 = Number(calcDisplay.textContent);
            console.log(currentNum1);
            num1Selected = true;
        // Selection of the 1st operation
        } else if (num1Selected && !num2Selected && isOpn) {
            currentOpn = `${buttonID.slice(4)}`;
            calcDisplayHistory.textContent += ` ${currentOpn} `;
            console.log(currentOpn);
            opnSelected = true;
        // Selection of the 2nd number
        } else if (num1Selected && !num2Selected && opnSelected && isNum) {
            calcDisplay.textContent = `${buttonID.charAt(buttonID.length - 1)}`;
            calcDisplayHistory.textContent += `${buttonID.charAt(buttonID.length - 1)}`;
            currentNum2 = Number(calcDisplay.textContent);
            console.log(currentNum2);
            num2Selected = true;
        // Selection when the equals button is pressed
        } else if (num1Selected && num2Selected && opnSelected && isEquals) {
            currentNum1 = operate(currentOpn, currentNum1, currentNum2);
            console.log(currentNum1);
            calcDisplay.textContent = currentNum1;
            calcDisplayHistory.textContent += ` ${currentOpn} `;
            num2Selected = false;
            opnSelected = false; 
        // Selection when the an operator button is pressed instead of an equals to generate a new total
        } else if (num1Selected && num2Selected && opnSelected && isOpn) {
            currentNum1 = operate(currentOpn, currentNum1, currentNum2);
            console.log(currentNum1);
            calcDisplay.textContent = currentNum1;
            calcDisplayHistory.textContent += ` ${currentOpn} `;
            num2Selected = false;
            currentOpn = `${buttonID.slice(4)}`;
        // Clears the display
        } else if (clearDisplay) {
            console.log(`Clear display`);
            currentNum1 = undefined;
            currentNum2 = undefined;
            currentOpn = undefined;
            num1Selected = false;
            num2Selected = false;
            opnSelected = false;
            clearDisplay = false;
            calcDisplay.textContent = ` `;
            calcDisplayHistory.textContent = ` `;
        }
    }) 
});


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


