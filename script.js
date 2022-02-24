const display = document.getElementById('display');

const clearAll = document.getElementById('clear-all');
const backspace = document.getElementById('backspace');

const numbers = document.getElementsByClassName('number');
const dot = document.getElementById('dot');
const operators = document.getElementsByClassName('operator');
const equal = document.getElementById('equal');

const expression = {
  num1: undefined,
  num2: undefined,
  operator: undefined,
  // used to clear display after getting operator
  numberEntered: false,

  operate() {
    switch (this.operator) {
      case '+':
        return +this.num1 + +this.num2;
      case '-':
        return this.num1 - this.num2;
      case '*':
        return this.num1 * this.num2;
      case '/':
        return this.num1 / this.num2;
    }
  },
};

clearAll.addEventListener('click', () => {
  display.textContent = '0';
  expression.numberEntered = false;
  expression.num1 = undefined;
  expression.num2 = undefined;
  expression.operator = undefined;
});

backspace.addEventListener('click', () => {
    display.textContent = display.textContent.slice(0,-1);
    if (display.textContent.length == 0) {
      display.textContent = '0';
      expression.numberEntered = false;
    }
});

[...numbers].forEach(number => number.addEventListener('click', () => {
  if (!expression.numberEntered) {
    display.textContent = '';
    expression.numberEntered = true;
  }
    display.textContent += number.dataset.key;
}));

[...operators].forEach(operator => operator.addEventListener('click', () => {
  if (expression.num1 == undefined && expression.numberEntered) {
    expression.num1 = display.textContent;
  } else if (expression.num2 == undefined && expression.numberEntered) {
    expression.num2 = display.textContent;
    display.textContent = expression.operate();

    expression.num1 = expression.operate();
    expression.num2 = undefined;
  }
  expression.operator = operator.dataset.key;
  expression.numberEntered = false;
}));

equal.addEventListener('click', () => {
  if (expression.num1 != undefined &&
      expression.operator != undefined) {
    expression.num2 = display.textContent;
    display.textContent = expression.operate();

    expression.num1 = expression.operate();
    expression.num2 = undefined;
    expression.operator = undefined;
    expression.numberEntered = false;
  }
});
