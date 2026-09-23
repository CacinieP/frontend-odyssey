# Challenge 01: Core JavaScript Utilities

Welcome to Chapter III's coding challenge! In this challenge, you will implement **5 essential utility functions** that every frontend engineer uses regularly.

## 🎯 Objectives

Open [`start.js`](./start.js) and implement the following functions:

### 1. `capitalize(str)`
- Capitalizes the first character of each word in the string.
- Words are separated by whitespace.
- If the input is empty or not a string, return `''`.
- **Examples:**
  - `capitalize('hello')` ➡️ `'Hello'`
  - `capitalize('frontend odyssey')` ➡️ `'Frontend Odyssey'`
  - `capitalize('')` ➡️ `''`

### 2. `sum(arr)`
- Calculates the sum of all numbers in an array.
- Returns `0` if the array is empty or input is invalid.
- Properly handles negative numbers and floating point numbers.
- **Examples:**
  - `sum([1, 2, 3, 4])` ➡️ `10`
  - `sum([-5, 5, 10])` ➡️ `10`
  - `sum([])` ➡️ `0`

### 3. `unique(arr)`
- Returns a new array with duplicate values removed.
- Preserves the original order of elements (first appearance).
- Should not mutate the input array.
- **Examples:**
  - `unique([1, 2, 2, 3, 1, 4])` ➡️ `[1, 2, 3, 4]`
  - `unique(['apple', 'banana', 'apple'])` ➡️ `['apple', 'banana']`
  - `unique([])` ➡️ `[]`

### 4. `debounce(fn, ms)`
- Returns a debounced version of `fn` that postpones its execution until after `ms` milliseconds have elapsed since the last time it was invoked.
- If invoked repeatedly within `ms`, previous scheduled executions should be canceled.
- Must preserve the function arguments and `this` context.
- **Example:**
  ```javascript
  const log = debounce(console.log, 100);
  log('a');
  log('b');
  log('c');
  // After 100ms, only 'c' is logged once.
  ```

### 5. `fetchJSON(url)`
- An asynchronous function that fetches data from `url` using the standard `fetch` API.
- If the response status is not OK (`!response.ok`), throws an Error with a descriptive message (e.g. `HTTP Error: 404`).
- Parses and returns the resulting JSON data.
- **Example:**
  ```javascript
  const user = await fetchJSON('https://api.example.com/user/1');
  console.log(user.name);
  ```

---

## 🧪 Testing Your Solution

Run the test suite using Node.js:

```bash
pnpm test
# or
node test.js
```

All 5 test suites will run against `start.js`. Initially, tests will fail. Your goal is to write the code until every test passes!

To inspect the reference solution, you can run:

```bash
pnpm test:solution
# or
node test.js solution
```
