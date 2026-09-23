---
title: 'DOM & Events'
description: 'Interacting with the page'
---

When a web browser downloads an HTML document, it does not just paint text directly to pixels. Instead, it parses the markup and constructs an interactive, object-oriented tree structure in memory called the **DOM (Document Object Model)**.

Through the DOM, JavaScript can read, inspect, modify, create, and delete any element on the page in real time.

---

## 1. What is the DOM?

Think of HTML source code as an **architectural blueprint**, while the DOM is the **actual physical building**. 

```html
<!-- HTML Source -->
<div id="card">
  <h2 class="title">Product</h2>
  <button class="btn">Buy</button>
</div>
```

The browser creates a tree of nodes: `document` → `div#card` → children (`h2.title`, `button.btn`). Each HTML tag becomes a JavaScript object with properties and methods you can manipulate.

---

## 2. Selecting Elements

To change something on screen, you must first locate it. Modern JavaScript provides fast and flexible selector methods:

```javascript
// 1. By ID (fastest, returns single Element or null)
const card = document.getElementById('card');

// 2. querySelector: uses standard CSS selector, returns FIRST match
const heading = document.querySelector('#card .title');
const buyBtn = document.querySelector('button.btn');

// 3. querySelectorAll: returns a NodeList of ALL matching elements
const allButtons = document.querySelectorAll('button');

// Iterate through a NodeList:
allButtons.forEach((btn, index) => {
  console.log(`Button #${index}:`, btn.textContent);
});
```

> **Senior Dev Tip:** Prefer `querySelector` and `querySelectorAll` for their flexibility. Remember that `querySelectorAll` returns a `NodeList`—you can iterate over it with `.forEach()`, but if you need array methods like `.map()` or `.filter()`, convert it first using `Array.from(allButtons)` or `[...allButtons]`.

---

## 3. Modifying Elements

Once selected, you can update text, HTML structure, classes, and styles:

```javascript
const heading = document.querySelector('.title');

// Change text safely (escapes HTML tags, preventing XSS vulnerabilities)
heading.textContent = 'Special Discount!';

// Change HTML (creates elements from HTML strings — use with caution!)
heading.innerHTML = 'Special <em>Discount</em>!';

// Modifying CSS Classes via classList (Best Practice)
heading.classList.add('highlight');
heading.classList.remove('hidden');
heading.classList.toggle('active');
const isHighlighted = heading.classList.contains('highlight');

// Direct inline styles (useful for dynamic positions or colors)
heading.style.color = '#2563eb';
heading.style.fontSize = '24px'; // Notice camelCase instead of font-size
```

> **Security Warning:** Avoid setting `innerHTML` with unsanitized user inputs, as it opens your application to **Cross-Site Scripting (XSS)** attacks. Always prefer `textContent` when dealing with plain text.

---

## 4. Handling Events

Webpages are reactive: when a user clicks, types, scrolls, or submits a form, the browser dispatches an **Event**. We listen to these events using `addEventListener`:

```javascript
const button = document.querySelector('.btn');
const searchInput = document.querySelector('#search');
const signupForm = document.querySelector('#signup-form');

// 1. Click event
button.addEventListener('click', (event) => {
  console.log('Button clicked!', event.target);
});

// 2. Input event (fires immediately on every keystroke)
searchInput.addEventListener('input', (event) => {
  console.log('Current search query:', event.target.value);
});

// 3. Form Submit event (always prevent default page reload!)
signupForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevents browser from refreshing the page
  console.log('Form submitted without reloading!');
});

// 4. Keyboard event
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    console.log('User pressed Escape — close modal dialog');
  }
});
```

---

## 5. Event Delegation: Writing Scalable Code

Imagine an interactive list with 1,000 items. Attaching 1,000 individual click listeners consumes excessive memory and fails when new items are added dynamically.

Because events in JavaScript **bubble up** through parent elements, you can attach **one single listener** to the parent container. This technique is called **Event Delegation**:

```html
<ul id="todo-list">
  <li data-id="1">Buy groceries <button class="delete-btn">×</button></li>
  <li data-id="2">Write JavaScript <button class="delete-btn">×</button></li>
</ul>
```

```javascript
const list = document.querySelector('#todo-list');

list.addEventListener('click', (event) => {
  // Check if clicked element or its ancestor is the delete button
  const deleteBtn = event.target.closest('.delete-btn');
  if (!deleteBtn) return;

  const item = deleteBtn.closest('li');
  console.log(`Deleting item ID: ${item.dataset.id}`);
  item.remove();
});
```

Event delegation gives you better performance, lower memory usage, and zero setup required when adding new dynamic items to the DOM.
