const display = document.getElementById('display');

const clearAll = document.getElementById('clear-all');
const backspace = document.getElementById('backspace');
const parenthesis = document.getElementsByClassName('parenthesis');

const numbers = document.getElementsByClassName('number');
const dot = document.getElementById('dot');
const operators = document.getElementsByClassName('operator');
const equal = document.getElementById('equal');


let resultPrinted = false;
const clearDisplay = () => {
  display.textContent = '0';
  resultPrinted = false;
};

clearAll.addEventListener('click', () => {
  clearDisplay();
});

backspace.addEventListener('click', () => {
    display.textContent = display.textContent.slice(0,-1);
    if (display.textContent.length == 0 || resultPrinted) {
      clearDisplay();
    }
});

[...numbers, ...parenthesis].forEach(number => number.addEventListener('click', () => {
  if (resultPrinted)  clearDisplay();
  if (display.textContent == '0')  display.textContent = '';

  display.textContent += number.dataset.key;
}));

[...operators].forEach(operator => operator.addEventListener('click', () => {  
  resultPrinted = false;
  if(/[\+\-\×\÷]$/.test(display.textContent))
    display.textContent = display.textContent.slice(0,-1);
  display.textContent += operator.textContent;
}));

equal.addEventListener('click', () => {
  const expression = display.textContent;
  display.textContent = computeExp(expression);
});

dot.addEventListener('click', () => {
  //if expression doesn't has no operators 
  //then start search from the expression beginning 
  let lastOpIndex = [...display.textContent.matchAll(/[\+\-\×\÷]/g)].pop()?.index || 0;

  // if (!display.textContent.includes('.', lastOpIndex))
  if (/(?<![\+\-\×\÷])$/.test(display.textContent.slice(lastOpIndex))
      && !display.textContent.includes('.', lastOpIndex))
    display.textContent += '.';
});


function isValid(expression) {
  const regExps = {
    twoConsecutiveOps: /[\+\-\×\÷]{2,}/,
    startParenthWithOp: /[\+\×\÷]\)/,
    endParenthWithOp: /\([\+\×\÷]/,
    startExpWithOp: /^[\+\×\÷]/,
    emptyParenth: /\(\)/,
  }

  let parenthCounter = 0;
  for(let char of expression.split('')) {
    if (char  == '(')     parenthCounter++;
    else if (char == ')') parenthCounter--;

    if (parenthCounter < 0) return false;
  }

  if (parenthCounter !== 0) return false;

  for (const rule in regExps) {
    if (regExps[rule].test(expression)) return false;
  }


  return true;
}

function computeExp(expression) {

  if (!isValid(expression)) {
    resultPrinted = true;
    return 'ERROR';
  }

  //to process expression like `-4+3...' correctly
  //otherwise the first minus would be considered an operator between two operands
  if (expression[0] == '-') 
    expression = '0' + expression;

  //ignore the last operator
  if (/[\+\-\×\÷]/.test(expression[expression.length - 1]))
    expression = expression.slice(0,-1);

  const expArr = expression.match(/[^\d()]+|[\(\)]|[\d.]+/g);

  let expPriority = [];
  let parenthCounter = 0;
  for (const piece of expArr) {
      switch (piece) {
        case '(':
          parenthCounter++;
          break;
        case ')':
          parenthCounter--;
          break; 
        case String(+piece):
          expPriority.push(piece);
          break
        case '+':
        case '-':
        case '×':
        case '÷':
          const priority = ((piece == '+' || piece == '-')? 1 : 2) + parenthCounter * 3;
          let op = {
            operator: piece,
            priority: priority
          }
          expPriority.push(op);
      }
  }

  let j = 3
  while(expPriority.length > 1) {
    let operatorIndex;
    let maxPriority = 0;
    for (let i = 0; i < expPriority.length; i++) {
      if (expPriority[i].priority > maxPriority) {
        maxPriority = expPriority[i].priority;
        operatorIndex = i;
      }
    }
  
    //change the highest priority operation into result of that operation
    expPriority.splice(operatorIndex - 1, 3, 
      operate(expPriority[operatorIndex - 1],
        expPriority[operatorIndex + 1],
        expPriority[operatorIndex].operator)); 
  }
  resultPrinted = true;
  return expPriority[0];
}


function operate(num1, num2, operator) {
  switch (operator) {
    case '+': return +num1 + +num2;
    case '-': return num1 - num2;
    case '×': return num1 * num2;
    case '÷': return num1 / num2;
  }
}