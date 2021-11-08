'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2021-10-22T17:01:17.194Z',
    '2021-11-01T23:36:17.929Z',
    '2021-11-06T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
const checkbox = document.querySelector('#checkbox');
const body = document.querySelector('body');
const logo = document.querySelector('.logo');
const display = document.querySelector('.display-mode');

const updateContent = function () {
  document.querySelector('.mode-type').textContent = document.querySelector(
    '.checkbox'
  ).checked
    ? 'Dark mode'
    : `Light mode`;
  logo.src = document.querySelector('.checkbox').checked
    ? '/icon.png'
    : 'logo.png';
  document.querySelector('.movements').style.backgroundColor =
    document.querySelector('.checkbox').checked ? 'rgb(37, 37, 37)' : 'white';
  document.querySelector('.movements').style.color = document.querySelector(
    '.checkbox'
  ).checked
    ? 'white'
    : 'black';
  document.querySelector('.login__btn').style.color = document.querySelector(
    '.checkbox'
  ).checked
    ? 'white'
    : 'black';
  btnSort.style.color = document.querySelector('.checkbox').checked
    ? 'white'
    : 'black';
  if (window.matchMedia('(max-width:380px)').matches) {
    document.querySelector('.summary').style.backgroundColor =
      document.querySelector('.checkbox').checked ? 'rgb(37, 37, 37)' : 'white';
  }
};
checkbox.addEventListener('change', function (e) {
  e.preventDefault();
  //Change the theme of the website
  body.classList.toggle('dark');
  body.classList.toggle('white');
  document.querySelector('.login').style.color = 'black';

  updateContent();
});
///Functions
const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return `Yesterday`;
  // if (daysPassed <= 7) return `${daysPassed} days ago`;
  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // return `${day}/${month}/${date.getFullYear()}`;
  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = (value, locale, currency) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  ///VERY IMPORTANT LINE OF CODE////////////
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  ///VERY IMPORTANT LINE OF CODE///////////

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);
    const formattedMov = formatCur(mov, acc.locale, acc.currency);
    const html = `
   <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type} </div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formattedMov}</div>
          </div>
  `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);
  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(
    Math.abs(outcomes),
    acc.locale,
    acc.currency
  );
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .filter(mov => mov >= 1)

    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);
const updateUI = function (acc) {
  //Display movements
  displayMovements(acc);

  //Display balance
  calcDisplayBalance(acc);

  //Display summary
  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  const tick = function () {
    //In each call,print the remaining time to the user interface
    const min = String(Math.round(time / 60)).padStart(2, 0);
    const sec = String(Math.round(time % 60)).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;

    //When time is at 0seconds,stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      document.querySelector('.display-mode').classList.add('no-display');

      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }
    //Decrease 1s
    time--;
  };
  //Set time to 5 minutes
  let time = 240;
  //Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

//Event Handlers
let currentAccount, timer;
///Fake Always logged In
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

btnLogin.addEventListener('click', function (e) {
  //Prevent from submitting
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  if (currentAccount?.pin === +inputLoginPin.value) {
    //To display modes
    document.querySelector('.display-mode').classList.remove('no-display');

    //Display UI and message
    labelWelcome.textContent = `Welcome back,${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    // display.classList.remove('no-display');
    //Create date and time
    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const hours = `${now.getHours()}`.padStart(2, 0);
    // const minutes = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${now.getFullYear()}, ${hours}:${now.getMinutes(
    //   minutes
    // )}`;
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };
    // const locale = navigator.language;
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    //TO REMOVE THE LOGIN FORM FIELD
    // document.querySelector('.login').style.display = 'none';

    //Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    //Timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    //Update UI
    updateUI(currentAccount);
  } else if (currentAccount?.pin !== +inputLoginPin.value || !currentAccount) {
    alert(`Incorrect Pin or Username!`);
  }
});
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  console.log(amount, receiverAcc);
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    //Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(+amount);

    //Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    //Update UI
    updateUI(currentAccount);
  }
  inputTransferAmount.value = '';
  inputTransferTo.value = '';
  inputTransferAmount.blur();
  inputTransferTo.blur();

  //Reset timer
  clearInterval(timer);
  timer = startLogOutTimer();
});
//Request For A Loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      //Add movement
      currentAccount.movements.push(amount);

      //Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      //Update UI
      updateUI(currentAccount);
    }, 2500);
  }
  inputLoanAmount.value = '';
  clearInterval(timer);
  timer = startLogOutTimer();
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    //Delete Account
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    accounts.splice(index, 1);

    //Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = '';
  clearInterval(timer);
  timer = startLogOutTimer();
});
let sorted = false;

//Experimenting

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// labelBalance.addEventListener('click', function (e) {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     mov => Number(mov.textContent.replace('€', ''))
//   );
//   // console.log(movementsUI);
// });
// ////NUmbers
// console.log(23 === 23.0);
// console.log(0.1 + 0.2);
// //CONVERSION OF STRINGS TO NUMBERS
// // console.log(Number('23'));
// // console.log(+'23');

// //PARSING
// console.log(Number.parseInt('30px', 10));
// console.log(Number.parseInt('e32', 10));

// //Important
// console.log(Number.parseFloat('2.5rem'));
// console.log(Number.parseInt('2.5rem'));
// // console.log(parseFloat('30.6rem'));

// //IsNan
// console.log(Number.isNaN(20));
// console.log(Number.isNaN(23 / 0));

// ////FINITE -> Best Method
// console.log(Number.isFinite(20));
// console.log(Number.isFinite('20'));
// ///Important

// console.log(Math.sqrt(25));
// console.log(25 ** (1 / 2));

// console.log(Math.max(5, 18, 23, 11, 2));
// console.log(Math.min(5, 18, 23, 11, 2));
// console.log(Math.PI * Number.parseFloat('10px') ** 2);

// //Getting Random Numbers
// console.log(Math.trunc(Math.random() * 6) + 1);
// const randomInt = (min, max) => Math.trunc(Math.random() * (max - min) + min);
// console.log(randomInt(10, 20));

//Rounding Integers
// console.log(Math.trunc(23.3));
// console.log(Math.round(23.9));
// console.log(Math.ceil(23.9));
// console.log(Math.floor(23.9));
// console.log(Math.round(23.9));
// console.log(Math.round(23.9));

// //Rounding Decimals
// console.log((2.7).toFixed(0));

//The reminder operator
// console.log(5 % 2);
// console.log(8 % 3);
// console.log(6 % 2);
// const isEven = n => n % 2 === 0;
// console.log(isEven(8));
// console.log(isEven(23));
// console.log(isEven(514));

// labelBalance.addEventListener('click', function (x) {
//   x.preventDefault();
//   [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
//     if (i % 2 === 0) {
//       row.style.backgroundColor = 'orangered';
//     }
//     if (i % 3 === 0) {
//       row.style.backgroundColor = 'blue';
//     }
//   });
// });

// console.log(2 ** 53 - 1);
// console.log(Number.MAX_SAFE_INTEGER);
// console.log(4882838240237503217512509327505109512095n);
// console.log(BigInt(4882838240237503217512509327505109512095));
// console.log(20n > 15);
// console.log(typeof 20n);
// console.log(10 / 3n);

// Create a date
/*const now = new Date();
console.log(now);
console.log(new Date('Thu Nov 04 2021 13:12:00'));
console.log(new Date('December 25,2021'));
console.log(new Date(account1.movementsDates[0]));
console.log(new Date(2037, 10, 19, 15, 23, 5));
console.log(new Date(0));
console.log(new Date(3 * 24 * 60 * 60 * 1000));*/
//Working with dates
// const future = new Date(2037, 10, 19, 15, 23);
// console.log(future.getFullYear());
// console.log(future.getMonth());
// console.log(future.getDate());
// console.log(future.getDay());
// console.log(future.getHours());
// console.log(future.getSeconds());
// console.log(future.toISOString());
// console.log(future.getTime());
// console.log(new Date(2142256980000));
// console.log(Date.now());
// future.setFullYear
// const calcDaysPassed = (date1, date2) =>
//   Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);

// console.log(calcDaysPassed(new Date(2037, 3, 14), new Date(2037, 3, 24)));

// const num = 3999887.456;

// const options = {
//   style: 'currency',
//   unit: 'mile-per-hour',
//   currency: 'EUR',
//   // useGrouping: false,
// };

// console.log('US:  ', new Intl.NumberFormat('en-US', options).format(num));
// console.log('Germany:  ', new Intl.NumberFormat('de-DE', options).format(num));
// console.log('Syria:  ', new Intl.NumberFormat('ar-SY', options).format(num));
const ingredients = ['olives', 'sausage'];
const pizzaTimer = setTimeout(
  (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2} 🍕`),
  3000,
  ...ingredients
);
console.log('Waiting...');

if (ingredients.includes('spinach')) clearTimeout(pizzaTimer);
//setInterval
