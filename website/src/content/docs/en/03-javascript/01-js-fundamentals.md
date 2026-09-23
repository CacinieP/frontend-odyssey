---
title: 'JavaScript Fundamentals'
description: 'Making the web come alive'
---

If HTML is the skeleton of a webpage and CSS is the skin and clothing, **JavaScript is the nervous system and muscles**. It is the engine that transforms static documents into responsive, dynamic applications that react to user input.

Here is the single most important fact to understand about JavaScript: **it is the only programming language that web browsers execute natively**. Whether you write TypeScript, CoffeeScript, or Dart, everything eventually compiles or translates down to JavaScript so the browser can run it.

Let's explore the core fundamentals every frontend engineer must master.

---

## 1. Variables: Storing Information

In JavaScript, variables are containers for values. Historically, JavaScript had only one keyword to declare variables: `var`. Modern JavaScript (ES6+) introduced `let` and `const`.

### Why You Should Never Use `var`

```javascript
// The problem with var: function-scoped and hoisted
if (true) {
  var role = 'admin';
}
console.log(role); // 'admin' — leaked outside the block!

// Re-declaration without warning
var count = 1;
var count = 2; // Silent overwrite, bug waiting to happen!
```

`var` does not respect block scope `{ ... }` and gets hoisted (lifted to the top of its scope) in confusing ways.

### Modern Declarations: `const` by Default, `let` When Reassigning

```javascript
// Use const for values that won't be reassigned (90% of your code)
const maxRetries = 3;
// maxRetries = 4; // TypeError: Assignment to constant variable.

// Note: const objects and arrays are still mutable internally!
const user = { name: 'Alex' };
user.name = 'Taylor'; // Valid! The binding is constant, the object is mutable.

// Use let ONLY when you explicitly plan to reassign the variable
let currentScore = 0;
currentScore += 10; // Valid
```

> **Senior Dev Tip:** Default to `const`. Only reach for `let` when you know the value must change over time (such as counters in loops or toggles). Never use `var` in modern projects.

---

## 2. Data Types

JavaScript has **7 primitive data types** (passed by value) and **1 reference type** (Object, passed by reference).

```javascript
// Primitives
const username = 'DevOdyssey';     // String
const age = 25;                    // Number (both integers and floats)
const isOnline = true;             // Boolean
let unassigned;                    // Undefined (variable declared, but no value given)
const emptyValue = null;           // Null (intentional absence of any value)
const uniqueId = Symbol('id');     // Symbol (unique identifier)
const largeNumber = 9007199254740991n; // BigInt (arbitrary-precision integer)

// Reference Types (Objects)
const profile = {
  name: 'Alex',
  skills: ['HTML', 'CSS', 'JavaScript'],
}; // Object

const scores = [95, 88, 100];      // Array (special kind of object)

console.log(typeof username);      // 'string'
console.log(typeof age);           // 'number'
console.log(typeof profile);       // 'object'
console.log(Array.isArray(scores)); // true
```

> **Watch Out:** `typeof null` returns `'object'`! This is a famous legacy bug from the very first version of JavaScript in 1995 that cannot be fixed without breaking existing websites.

---

## 3. Operators: Working with Values

### Arithmetic & Assignment
```javascript
const sum = 10 + 5;       // 15
const product = 4 * 2;    // 8
const remainder = 10 % 3; // 1 (modulus)
let balance = 100;
balance += 50;            // 150 (shorthand for balance = balance + 50)
```

### Strict vs. Loose Equality (`===` vs `==`)
Always use strict equality (`===`). Loose equality (`==`) performs unpredictable type coercion behind your back:

```javascript
5 == '5';   // true — dangerous automatic type coercion!
0 == false; // true — confusing!
null == undefined; // true

5 === '5';  // false — different types, safe and predictable
0 === false; // false
```

### Logical Operators
```javascript
const isLoggedIn = true;
const hasPremium = false;

// AND (&&), OR (||), NOT (!)
const canWatchMovie = isLoggedIn && hasPremium; // false
const canBrowse = isLoggedIn || hasPremium;     // true
const isGuest = !isLoggedIn;                   // false

// Nullish Coalescing (??): checks for null or undefined ONLY
const customTimeout = 0;
const timeout = customTimeout ?? 5000; // 0 (with ||, 0 would be treated as falsy and become 5000)
```

---

## 4. Conditionals & Control Flow

Conditionals direct the execution path of your code based on state.

```javascript
const status = 404;

// if / else if / else
if (status === 200) {
  console.log('Success');
} else if (status === 404) {
  console.log('Page Not Found');
} else {
  console.log('Server Error');
}

// Ternary Operator: inline concise conditional
const message = status === 200 ? 'All good' : 'Something went wrong';

// Switch: ideal when matching against many discrete values
switch (status) {
  case 200:
    console.log('OK');
    break;
  case 401:
  case 403:
    console.log('Unauthorized');
    break;
  default:
    console.log('Unhandled status');
}
```

---

## 5. Loops: Repeating Logic

Loops let you iterate over sequences and collections:

```javascript
const tools = ['Git', 'Vite', 'VSCode'];

// 1. Classic for-loop (when index is needed)
for (let i = 0; i < tools.length; i++) {
  console.log(`Tool #${i + 1}: ${tools[i]}`);
}

// 2. for...of loop (cleanest for arrays and iterables)
for (const tool of tools) {
  console.log(tool);
}

// 3. while loop (runs while condition is truthy)
let countdown = 3;
while (countdown > 0) {
  console.log(countdown);
  countdown--;
}
```

---

## 6. Functions: Building Blocks of Code

Functions encapsulate reusable logic. JavaScript offers three common ways to define functions:

```javascript
// 1. Function Declaration (Hoisted: can be called before declaration)
function greet(name = 'Developer') {
  return `Hello, ${name}!`;
}

// 2. Function Expression (Not hoisted)
const formatPrice = function (amount) {
  return `$${amount.toFixed(2)}`;
};

// 3. Arrow Function (ES6: concise syntax, lexical 'this' binding)
const multiply = (a, b) => a * b;

// Arrow function with block body
const calculateTax = (subtotal, rate) => {
  const tax = subtotal * rate;
  return subtotal + tax;
};

console.log(greet('Sam'));        // 'Hello, Sam!'
console.log(formatPrice(19.99));  // '$19.99'
console.log(multiply(6, 7));      // 42
```

### Which Function Syntax Should You Use?
- Use **function declarations** for top-level utility functions where hoisting improves readability.
- Use **arrow functions** for callbacks, array methods (`.map()`, `.filter()`), and short inline operations.

Now that you know the syntax and runtime primitives of JavaScript, let's connect it to the browser's live page: the **DOM**.
