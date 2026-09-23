---
title: 'Async & Modules'
description: 'Fetching data and organizing code'
---

JavaScript in the browser runs on a **single main thread**. That means it can only execute one task at a time. If a function took three seconds to download data from a server synchronously, the entire browser tab would completely freeze: buttons wouldn't click, animations would halt, and users would leave.

Asynchronous programming and modular architecture solve this by allowing background operations and clear separation of concerns.

---

## 1. The Evolution of Asynchronous JavaScript

JavaScript handles operations that take time—such as timers, disk I/O, or network requests—non-blockingly. Over the years, the way we handle asynchronous flow has evolved through three distinct eras:

### 1. Callbacks (The "Pyramid of Doom")
```javascript
// Old style: nested callbacks
getUser(userId, (err, user) => {
  if (err) return handleError(err);
  getOrders(user.id, (err, orders) => {
    if (err) return handleError(err);
    getInvoice(orders[0].id, (err, invoice) => {
      // Callback Hell! Deeply nested and brittle error handling
    });
  });
});
```

### 2. Promises (ES6 / 2015)
A **Promise** represents a value that is pending now, but will resolve (succeed) or reject (fail) in the future:

```javascript
getUser(userId)
  .then((user) => getOrders(user.id))
  .then((orders) => getInvoice(orders[0].id))
  .then((invoice) => console.log('Invoice:', invoice))
  .catch((err) => console.error('An error occurred:', err));
```

### 3. `async / await` (ES2017 - Modern Standard)
`async/await` is syntactic sugar over Promises that allows asynchronous code to look and read like clean, synchronous code:

```javascript
async function loadUserInvoice(userId) {
  try {
    const user = await getUser(userId);
    const orders = await getOrders(user.id);
    const invoice = await getInvoice(orders[0].id);
    return invoice;
  } catch (err) {
    console.error('Failed to load invoice:', err.message);
  }
}
```

---

## 2. The Fetch API: Network Requests in Action

The browser's native `fetch()` function returns a Promise that resolves to an HTTP `Response` object.

### Making a GET Request
```javascript
async function fetchUserProfile(username) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    
    // Always check response.ok (HTTP status code 200–299)
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}
```

### Making a POST Request
```javascript
async function createPost(postData) {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    throw new Error(`Failed to create post: ${response.status}`);
  }

  const result = await response.json();
  return result;
}
```

---

## 3. ES Modules: Organizing Your Codebase

In early web development, all scripts shared a single global namespace. Today, **ES Modules (ESM)** are standard in browsers and Node.js. Each file is an isolated module that explicitly chooses what to share.

To use modules in HTML, add `type="module"` to the script tag:
```html
<script type="module" src="./main.js"></script>
```

### Named Exports and Imports
Use named exports when a file provides multiple helper utilities:

```javascript
// math.js
export const PI = 3.14159;

export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}
```

```javascript
// main.js
import { add, PI } from './math.js';
// Or rename during import:
import { subtract as minus } from './math.js';

console.log(add(10, 5)); // 15
```

### Default Exports and Imports
Use default export when a file's primary responsibility is a single class, function, or component:

```javascript
// UserService.js
export default class UserService {
  async getUser(id) {
    // ...
  }
}
```

```javascript
// app.js
import UserService from './UserService.js';
const users = new UserService();
```

> **Senior Dev Tip:** Prefer **named exports** for utilities and libraries. They enable better editor auto-completion, prevent accidental naming drift, and make dead-code elimination (tree-shaking) much more effective in modern bundlers.
