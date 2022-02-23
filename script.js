const display = document.getElementById('display');

const clearAll = document.getElementById('clear-all');
const backspace = document.getElementById('backspace');

const numbers = document.getElementsByClassName('number');
const dot = document.getElementById('dot');
const operators = document.getElementsByClassName('operator');
const equal = document.getElementById('equal');

clearAll.addEventListener('click', () => {
  display.textContent = '0';
});
backspace.addEventListener('click', () => {
    display.textContent = display.textContent.slice(0,-1);
    if (display.textContent.length == 0) {
      display.textContent = '0';
    }
});

[...numbers].forEach(number => number.addEventListener('click', () => {
  if (display.textContent == '0') {
    display.textContent = number.textContent;
  } else {
    display.textContent += number.textContent;
  }
}));


