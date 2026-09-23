# Vanilla JS Todo App (JavaScript Capstone)

> Capstone project for **Chapter III (JavaScript)** of the [Frontend Odyssey](https://github.com/frontend-odyssey) learning journey.

A modern, fast, and feature-rich Todo Application built entirely with **vanilla HTML, CSS, and JavaScript** — without React, Vue, external libraries, or build bundlers.

[English](README.md) | [简体中文](README.zh.md)

---

## 🎯 What This Project Demonstrates

Before jumping into modern frontend libraries like React or Vue, every developer must master how browsers execute JavaScript, manage the DOM tree, and handle events. This project teaches professional design patterns applied to vanilla web development:

1. **State-Driven Architecture (Single Source of Truth)**:
   - Instead of reading and writing data directly to and from DOM text elements (a frequent source of synchronization bugs), the entire application revolves around an in-memory `state` object.
   - Any user action modifies `state` first, saves to `localStorage`, and triggers a centralized `render()` function.

2. **Event Delegation (High-Performance Event Handling)**:
   - Instead of registering hundreds of individual event listeners on every checkbox, label, and delete button (which wastes memory and leaks references upon deletion), a single listener is placed on the parent `<ul>` container.
   - Using `event.target.closest()`, the handler determines which element was activated dynamically.

3. **DOM Manipulation & Performance**:
   - Dynamic creation of DOM nodes via `document.createElement`.
   - Batch updating using `document.createDocumentFragment()` to minimize browser reflows and repaints.
   - Built-in XSS protection using `textContent` instead of dangerous `innerHTML` string interpolation for user-provided data.

4. **Web Storage API (`localStorage`) & Defensive Parsing**:
   - Todos and theme preferences persist across browser reloads.
   - Defensive error handling (`try...catch`) guards against corrupted JSON data and private browsing storage restrictions.

5. **Keyboard Accessibility & Micro-Interactions**:
   - Add tasks with the <kbd>Enter</kbd> key.
   - Double-click any task to enter inline edit mode.
   - Commit edits with <kbd>Enter</kbd> or discard changes with <kbd>Escape</kbd>.
   - Live ARIA region (`aria-live="polite"`) updates screen readers as items change.

6. **Dynamic Theming (Dark & Light Mode)**:
   - Synchronized with OS system preferences (`prefers-color-scheme`).
   - Manual override toggle persisted in `localStorage` and managed cleanly via the `data-theme` attribute and CSS custom properties.

---

## 📂 Project Structure

```text
todo-app-vanilla/
├── index.html       # Clean application markup & semantic layout
├── style.css        # Theming, responsive card styling, and animations
├── app.js           # State store, event delegation, and DOM rendering
├── package.json     # Project config and dev script
├── README.md        # English project documentation
└── README.zh.md     # Chinese project documentation
```

---

## 🚀 Getting Started

### Prerequisites

Node.js (v18+) and `pnpm` (or `npm`/`npx`).

### Running Locally

```bash
# In the project directory with pnpm
pnpm dev

# Or directly with npx
npx serve .
```

Open [http://localhost:3000](http://localhost:3000) (or the port displayed in your terminal).

Because this application has zero compilation dependencies, you can also double-click `index.html` to run it directly in any browser.

---

## 💡 Key Architectural Lessons (WHY before HOW)

### 1. State-Driven UI vs Direct DOM Scraping
Consider this comparison:

```javascript
// ❌ Fragile Approach: Storing state in the DOM
deleteBtn.addEventListener('click', (e) => {
  e.target.parentElement.remove();
  // Now how do we update localStorage?
  // We'd have to crawl the DOM, read innerText of all remaining LIs, and serialize.
});

// ✅ Professional Approach: State is the Single Source of Truth
function deleteTodo(id) {
  state.todos = state.todos.filter(t => t.id !== id);
  saveTodosToStorage();
  render();
}
```

When your state is the single source of truth, bugs become trivial to track down. The UI is simply a pure visual reflection of the data at any given moment: `UI = f(state)`.

### 2. Event Delegation in Practice
Attaching listeners to dynamic elements is cumbersome. If you have 50 todos, attaching individual click handlers creates 50+ event listeners. When an item is deleted, forgetting to remove the listener can cause memory leaks.

With **event delegation**, we attach one single listener to the parent container:

```javascript
elements.todoList.addEventListener('click', (event) => {
  const todoItem = event.target.closest('.todo-item');
  if (!todoItem) return;
  const id = todoItem.dataset.id;

  if (event.target.closest('.btn-delete')) {
    deleteTodo(id);
  }
});
```

Because browser events naturally bubble up the DOM tree, the parent handles everything cleanly, even for items created in the future.

### 3. XSS Defense (Cross-Site Scripting)
If a user enters `<img src=x onerror=alert(1)>` as a todo title:
- Using `li.innerHTML = `<span>${todo.text}</span>`` executes the malicious script.
- Using `span.textContent = todo.text` treats the input purely as plain text, neutralising the attack vector completely.

---

## 🛠️ Challenge Yourself (Next Steps)

Ready to expand this project further?
1. **Drag and Drop**: Implement reordering of tasks using the native HTML5 Drag and Drop API (`draggable="true"`).
2. **Due Dates & Priorities**: Add date pickers or priority badges (`Urgent`, `Normal`, `Low`) to your todo items.
3. **Search & Filter**: Add a live search input to instantly filter tasks by keywords.

Keep building and enjoy your journey through [Frontend Odyssey](https://github.com/frontend-odyssey)!
