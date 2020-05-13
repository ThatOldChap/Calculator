/*
* Developed by Michael Chaplin
* As a part of the Odin Project Curriculumn Calculator project
* May XX, 2020
*/

// Basic math functions
const add = (num1, num2) => (num1 + num2);
const subtract = (num1, num2) => (num1 - num2);
const multipy = (num1, num2) => (num1 * num2);
const divide = (num1, num2) => (num1 / num2);

const operate = function (operation, num1, num2) {
    switch (operation) {
        case add:
            return add(num1, num2);    
        case subtract:
            return subtract(num1, num2);
        case multipy:
            return multipy(num1, num2);  
        case divide:
            return divide(num1, num2);      
        default:
            return "ERROR";
    }
}


