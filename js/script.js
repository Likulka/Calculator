"use strict";

const numbers = document.querySelectorAll("[data-num]");
const dot = document.querySelectorAll("[data-dot]");
const operations = document.querySelectorAll("[data-operation]");
const equals = document.querySelectorAll("[data-equals]");
const del = document.querySelectorAll("[data-del]");
const minus = document.querySelectorAll("[data-minus]");

const expressionText = document.querySelector(".expression");
const input = document.querySelector("input");

let currentNumber = ""; // текущий операнд
let previousNumber = ""; // предыдущий операнд
let result = ""; // результат
let operationSign = ""; // операция
let expression = ""; // выражение
let toContinue = true;

const errors = [
  "ОШИБКА! Длина числа не больше 8 знаков",
  "ОШИБКА! Введите цифру",
  "ОШИБКА! Вы уже ввели операнд",
  "ОШИБКА! В числе не может быть двух запятых",
  "ОШИБКА! Ведите операцию, а затем второй операнд",
  "ОШИБКА! Деление на ноль невозможно",
  "ОШИБКА! Нечего удалять",
  "ОШИБКА! Не хватает места для дробной части. Максимально число символов - 8",
  "ОШИБКА! Переполнение результата. Нажмите ОК для сброса данных",
];

function AddEvent(arr, foo) {
  for (let i = 0; i < arr.length; i++) {
    arr[i].addEventListener("click", (event) => {
      event.preventDefault();
      foo(arr[i].innerText);
    });
  }
}

function ClearAll() {
  // очищает переменные
  currentNumber = previousNumber = result = operationSign = expression = "";
  input.value = "0";
  expressionText.innerText = expression;
}

function SetNumber(digit) {
  // устанавливает число
  switch (true) {
    case result != "" && currentNumber != "":
      ClearAll();
    case input.value == "0" || input.value == "-0":
      currentNumber = input.value;
      currentNumber = currentNumber.replace("0", digit);
      break;
    case currentNumber.length == 8:
      alert(errors[0]);
      return;
    default:
      currentNumber += digit;
  }

  input.value = currentNumber;
}

function SetDot(dot) {
  // устанавливает точку в число

  switch (true) {
    case result != "":
      ClearAll();
      currentNumber = "0.";
      break;
    case currentNumber == "" || currentNumber == "-":
      currentNumber += "0.";
      break;
    case currentNumber.includes(dot):
      alert(errors[3]);
      return;
    case currentNumber.length == 7 || currentNumber.length == 8:
      alert(errors[7]);
      break;
    default:
      currentNumber += dot;
      break;
  }
  input.value = currentNumber;
}

function SetOperation(operation) {
  // устанавливает операцию в выражение
  if (result != "") {
    operationSign = "";
    result = "";
  }

  switch (true) {
    case currentNumber[currentNumber.length - 1] == ".":
      alert(errors[1]);
      break;
    case currentNumber == "-":
      alert(errors[1]);
      break;
    case operationSign != "" && currentNumber == "":
      alert(errors[2]);
      return;
    case currentNumber == "":
      currentNumber = "0";
      operationSign = operation;
      ShowExpression(operation);
      previousNumber = currentNumber;
      currentNumber = "";
      return;
    case previousNumber == "":
      operationSign = operation;
      ShowExpression(operation);
      previousNumber = currentNumber;
      currentNumber = "";
      break;
    default:
      Calculate();
      SetOperation(operation);
  }
}

function Calculate() {
  //подсчет результата
  switch (true) {
    case previousNumber == "":
      alert(errors[4]);
      return;
    case currentNumber == "":
      currentNumber = input.value;
      break;
    case operationSign == "/" && currentNumber == 0:
      alert(errors[5]);
      return;
    case currentNumber == "-":
      alert(errors[1]);
      return;
  }

  previousNumber = parseFloat(previousNumber);
  currentNumber = parseFloat(currentNumber);

  switch (operationSign) {
    case "+":
      result = previousNumber + currentNumber;
      break;
    case "-":
      result = previousNumber - currentNumber;
      break;
    case "*":
      result = previousNumber * currentNumber;
      break;
    case "/":
      result = previousNumber / currentNumber;
      break;
  }

  ShowExpression("=");
  if (result > Number.MAX_SAFE_INTEGER || result < Number.MIN_SAFE_INTEGER) {
    toContinue = false;
    while (!toContinue) {
      toContinue = confirm(errors[8]);
    }
    location.reload();
  } else {
    result = Round();
    input.value = result;
    currentNumber = result;
    expression = "";
    previousNumber = "";
    operationSign = "";
  }
}

function NegativeNumber(operation) {
  //является ли минус знаком числа
  switch (true) {
    case currentNumber == "":
      currentNumber = operation;
      input.value = currentNumber;
      break;
    default:
      SetOperation(operation);
  }
}

function ShowExpression(symb) {
  // вывод выражения
  expression += ` ${currentNumber}  ${symb}`;
  expressionText.innerHTML = expression;
}

function DeleteSymbol() {
  // удаление символа

  if (result != "") {
    expressionText.innerHTML = "";
  }

  switch (true) {
    case currentNumber.length == 1:
      currentNumber = "";
      input.value = 0;
      break;
    case !(currentNumber == ""):
      currentNumber = currentNumber.slice(0, -1);
      input.value = currentNumber;
      break;
    case operationSign == "":
      alert(errors[6]);
      break;
    default:
      operationSign = "";
      currentNumber = previousNumber;
      previousNumber = "";
      input.value = currentNumber;
      expression = "";
      expressionText.innerText = expression;
  }
}

function Round() {
  // округляем число
  result = result.toString();
  let dotIndex = result.indexOf(".");
  if (dotIndex > 15 || (dotIndex > 0 && Number(result).toFixed(14) == 0)) {
    toContinue = false;
    while (!toContinue) {
      toContinue = confirm(errors[8]);
    }
    location.reload();
  } else if (dotIndex > 0 && dotIndex < 15) {
    let symbAfterDot = 16 - dotIndex - 1;
    result = Number(result).toFixed(symbAfterDot);
    result = result.toString().replace(/0*$/, "");
  }
  return result;
}

ClearAll();
AddEvent(numbers, SetNumber);
AddEvent(dot, SetDot);
AddEvent(operations, SetOperation);
AddEvent(equals, Calculate);
AddEvent(del, DeleteSymbol);
AddEvent(minus, NegativeNumber);
