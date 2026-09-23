/**
 * DOM Playground - Frontend Odyssey Chapter III
 * Demonstrates:
 * 1. Element selection (querySelector, getElementById)
 * 2. Event listeners (click, input, submit, change)
 * 3. Event delegation (handling events on dynamic children via a parent listener)
 * 4. DOM modification (textContent, classList, style)
 * 5. Data persistence with localStorage
 */

// =============================================================================
// SECTION 1: INTERACTIVE COUNTER
// =============================================================================

// --- 1.1 Selecting DOM Elements ---
// querySelector and getElementById find matching elements in the DOM tree.
const counterDisplay = document.getElementById('counter-value');
const counterStatus = document.getElementById('counter-status');
const btnDecrement = document.getElementById('btn-decrement');
const btnReset = document.getElementById('btn-reset');
const btnIncrement = document.getElementById('btn-increment');
const counterStepInput = document.getElementById('counter-step');

// --- 1.2 State Management ---
// State is the single source of truth for your UI.
let currentCount = 0;

/**
 * Updates the counter display, CSS classes, and status badge based on state.
 * Keeping DOM updates in a dedicated render function prevents code duplication.
 */
function renderCounter() {
  // Update text content
  counterDisplay.textContent = currentCount;

  // Update classes and badge based on sign
  counterDisplay.classList.remove('positive', 'negative');
  counterStatus.classList.remove('positive', 'negative');

  if (currentCount > 0) {
    counterDisplay.classList.add('positive');
    counterStatus.classList.add('positive');
    counterStatus.textContent = 'Positive';
  } else if (currentCount < 0) {
    counterDisplay.classList.add('negative');
    counterStatus.classList.add('negative');
    counterStatus.textContent = 'Negative';
  } else {
    counterStatus.textContent = 'Zero';
  }
}

/**
 * Helper to safely read and parse the step size from the input field.
 */
function getStepSize() {
  const value = parseInt(counterStepInput.value, 10);
  return Number.isNaN(value) || value < 1 ? 1 : value;
}

// --- 1.3 Event Listeners ---
// addEventListener attaches a callback that runs whenever the specified event fires.

btnIncrement.addEventListener('click', () => {
  currentCount += getStepSize();
  renderCounter();
});

btnDecrement.addEventListener('click', () => {
  currentCount -= getStepSize();
  renderCounter();
});

btnReset.addEventListener('click', () => {
  currentCount = 0;
  renderCounter();
});

// =============================================================================
// SECTION 2: COLOR CHANGER
// =============================================================================

const colorPreview = document.getElementById('color-preview');
const colorValueDisplay = document.getElementById('color-value');
const btnRandomColor = document.getElementById('btn-random-color');
const btnCopyColor = document.getElementById('btn-copy-color');
const presetColorsContainer = document.getElementById('preset-colors');

/**
 * Generates a random 6-character hex color code (e.g. #3B82F6).
 */
function generateRandomHex() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

/**
 * Applies the selected color to the DOM element styles.
 * Notice the use of element.style to modify inline CSS.
 */
function applyColor(hex) {
  colorPreview.style.backgroundColor = hex;
  colorValueDisplay.textContent = hex.toUpperCase();
}

// Generate random color on button click
btnRandomColor.addEventListener('click', () => {
  const newColor = generateRandomHex();
  applyColor(newColor);
});

// Copy color hex to user's clipboard using the modern Clipboard API
btnCopyColor.addEventListener('click', async () => {
  const hex = colorValueDisplay.textContent;
  try {
    await navigator.clipboard.writeText(hex);
    // Provide temporary visual feedback
    const originalText = btnCopyColor.textContent;
    btnCopyColor.textContent = 'Copied! ✓';
    btnCopyColor.classList.add('btn-primary');
    btnCopyColor.classList.remove('btn-outline');

    setTimeout(() => {
      btnCopyColor.textContent = originalText;
      btnCopyColor.classList.remove('btn-primary');
      btnCopyColor.classList.add('btn-outline');
    }, 1500);
  } catch (err) {
    console.error('Failed to copy color to clipboard:', err);
  }
});

// --- Event Delegation Example for Preset Swatches ---
// Instead of attaching 6 separate click listeners to 6 chip buttons,
// we attach ONE listener to the parent container #preset-colors.
presetColorsContainer.addEventListener('click', (event) => {
  // event.target is the actual element that was clicked
  const chip = event.target.closest('.color-chip');
  if (!chip) return; // Ignore clicks on the label or empty space

  // Read data-* attributes using the dataset property (data-color -> dataset.color)
  const color = chip.dataset.color;
  if (color) {
    applyColor(color);
  }
});

// =============================================================================
// SECTION 3: PERSISTENT TODO LIST WITH LOCALSTORAGE
// =============================================================================

const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const todoCountBadge = document.getElementById('todo-count');
const todoFiltersContainer = document.getElementById('todo-filters');
const btnClearCompleted = document.getElementById('btn-clear-completed');

const STORAGE_KEY = 'frontend_odyssey_todos';

// --- 3.1 State: Todos and Current Filter ---
let currentFilter = 'all'; // 'all' | 'active' | 'completed'

/**
 * Loads todos from browser localStorage.
 * localStorage only stores strings, so we parse JSON.
 */
function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to parse todos from localStorage:', err);
    return [];
  }
}

let todos = loadTodos();

/**
 * Saves current todos array to localStorage serialized as JSON.
 */
function saveTodos() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (err) {
    console.error('Failed to save todos to localStorage:', err);
  }
}

/**
 * Renders the todo list based on the active filter.
 * Demonstrates safe DOM construction using document.createElement
 * rather than dangerous innerHTML string concatenation.
 */
function renderTodos() {
  // Filter the list based on current filter state
  const filteredTodos = todos.filter((todo) => {
    if (currentFilter === 'active') return !todo.completed;
    if (currentFilter === 'completed') return todo.completed;
    return true; // 'all'
  });

  // Clear existing list items
  todoList.innerHTML = '';

  // Empty state handling
  if (filteredTodos.length === 0) {
    const emptyMsg = document.createElement('li');
    emptyMsg.className = 'empty-state';
    emptyMsg.textContent =
      todos.length === 0
        ? 'No tasks yet. Add one above!'
        : `No ${currentFilter} tasks found.`;
    todoList.appendChild(emptyMsg);
  } else {
    // Build list items
    filteredTodos.forEach((todo) => {
      const li = document.createElement('li');
      li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
      li.dataset.id = todo.id;

      // Checkbox
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'todo-checkbox';
      checkbox.checked = todo.completed;
      checkbox.setAttribute('aria-label', `Mark "${todo.text}" as completed`);

      // Text span (using textContent prevents XSS injection!)
      const textSpan = document.createElement('span');
      textSpan.className = 'todo-text';
      textSpan.textContent = todo.text;

      // Delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'todo-delete';
      deleteBtn.innerHTML = '&times;';
      deleteBtn.setAttribute('aria-label', `Delete "${todo.text}"`);
      deleteBtn.title = 'Delete task';

      li.append(checkbox, textSpan, deleteBtn);
      todoList.appendChild(li);
    });
  }

  // Update remaining count badge
  const activeCount = todos.filter((t) => !t.completed).length;
  todoCountBadge.textContent = `${activeCount} ${activeCount === 1 ? 'item' : 'items'} left`;
}

// --- 3.2 Form Submission Handling ---
// We listen for the 'submit' event on the form rather than 'click' on the button.
// This allows submission both by clicking the button AND by pressing Enter on the keyboard.
todoForm.addEventListener('submit', (event) => {
  // event.preventDefault() stops the browser's default behavior of reloading the page
  event.preventDefault();

  const text = todoInput.value.trim();
  if (!text) return;

  const newTodo = {
    id: Date.now().toString(), // Simple unique ID based on timestamp
    text: text,
    completed: false,
  };

  todos.push(newTodo);
  saveTodos();
  renderTodos();

  // Reset input field and refocus
  todoInput.value = '';
  todoInput.focus();
});

// --- 3.3 Event Delegation on Todo List ---
// One listener handles both checkbox changes and delete clicks for all items.
todoList.addEventListener('click', (event) => {
  const target = event.target;
  const itemElement = target.closest('.todo-item');
  if (!itemElement) return;

  const todoId = itemElement.dataset.id;

  // Handle delete button click
  if (target.classList.contains('todo-delete')) {
    todos = todos.filter((t) => t.id !== todoId);
    saveTodos();
    renderTodos();
    return;
  }
});

// Handle checkbox toggle via 'change' event on the list (delegated)
todoList.addEventListener('change', (event) => {
  const target = event.target;
  if (!target.classList.contains('todo-checkbox')) return;

  const itemElement = target.closest('.todo-item');
  const todoId = itemElement?.dataset.id;

  const todo = todos.find((t) => t.id === todoId);
  if (todo) {
    todo.completed = target.checked;
    saveTodos();
    renderTodos();
  }
});

// --- 3.4 Filter Buttons Handling (Delegated) ---
todoFiltersContainer.addEventListener('click', (event) => {
  const filterBtn = event.target.closest('.filter-btn');
  if (!filterBtn) return;

  // Update active style on filter buttons
  document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.classList.remove('active');
  });
  filterBtn.classList.add('active');

  // Update state and re-render
  currentFilter = filterBtn.dataset.filter;
  renderTodos();
});

// --- 3.5 Clear Completed Tasks ---
btnClearCompleted.addEventListener('click', () => {
  const initialLength = todos.length;
  todos = todos.filter((t) => !t.completed);

  if (todos.length !== initialLength) {
    saveTodos();
    renderTodos();
  }
});

// =============================================================================
// INITIALIZATION
// =============================================================================
// Initial render calls when the script loads
renderCounter();
applyColor('#3B82F6');
renderTodos();
