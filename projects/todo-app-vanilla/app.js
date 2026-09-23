/**
 * Odyssey Tasks - Vanilla JavaScript Application
 * Frontend Odyssey - Capstone Project (Chapter III: JavaScript)
 *
 * Senior Developer Mentoring Notes:
 * 1. Architecture: Single Source of Truth (State-Driven UI)
 *    Instead of directly creating and removing DOM nodes inside random click handlers
 *    (which inevitably causes out-of-sync bugs between the UI and localStorage),
 *    we maintain an in-memory `state` object. Any user action modifies the state first,
 *    persists to `localStorage`, and calls `render()`.
 *
 * 2. Event Delegation:
 *    Instead of attaching event listeners to every single new todo item (which wastes
 *    memory and requires manual re-binding), we attach a single listener to the parent
 *    `<ul>` and use `event.target.closest()` to identify which element triggered the event.
 *
 * 3. Security (XSS Prevention):
 *    User-generated text is never inserted via unescaped string concatenation into
 *    `innerHTML`. We use `document.createTextNode` or `element.textContent` to guarantee
 *    that malicious `<script>` or HTML payloads are rendered safely as raw text.
 */

'use strict';

// ---------------------------------------------------------------------------
// 1. Storage Keys & Constants
// ---------------------------------------------------------------------------
const STORAGE_KEYS = {
  TODOS: 'odyssey_todos_v1',
  THEME: 'odyssey_theme_preference'
};

const FILTERS = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed'
};

// ---------------------------------------------------------------------------
// 2. Initial State & State Store
// ---------------------------------------------------------------------------
const state = {
  // Array of todo objects: { id: string, text: string, completed: boolean, createdAt: number }
  todos: loadTodosFromStorage(),
  // Current active filter: 'all' | 'active' | 'completed'
  filter: FILTERS.ALL,
  // Current inline editing ID (or null if not editing)
  editingId: null,
  // Current theme: 'light' | 'dark'
  theme: loadThemeFromStorage()
};

// ---------------------------------------------------------------------------
// 3. DOM Element References (Cached once for performance)
// ---------------------------------------------------------------------------
const elements = {
  themeToggleBtn: document.getElementById('theme-toggle'),
  todoForm: document.getElementById('todo-form'),
  todoInput: document.getElementById('todo-input'),
  filterButtons: document.querySelectorAll('.filter-btn'),
  todoList: document.getElementById('todo-list'),
  emptyState: document.getElementById('empty-state'),
  itemsLeft: document.getElementById('items-left'),
  footerCount: document.getElementById('footer-count'),
  clearCompletedBtn: document.getElementById('clear-completed')
};

// ---------------------------------------------------------------------------
// 4. Persistence Helpers (localStorage + JSON)
// ---------------------------------------------------------------------------

/**
 * Loads and parses todos from browser localStorage.
 * Always wraps JSON.parse in a try/catch block to defend against corrupted data.
 * @returns {Array} Array of todo objects
 */
function loadTodosFromStorage() {
  try {
    const rawData = localStorage.getItem(STORAGE_KEYS.TODOS);
    if (!rawData) {
      // Default initial tasks for first-time visitors
      return [
        {
          id: generateUniqueId(),
          text: 'Explore Semantic HTML elements (Chapter I)',
          completed: true,
          createdAt: Date.now() - 3600000
        },
        {
          id: generateUniqueId(),
          text: 'Master Flexbox & CSS Grid layouts (Chapter II)',
          completed: true,
          createdAt: Date.now() - 1800000
        },
        {
          id: generateUniqueId(),
          text: 'Build an interactive Vanilla JS app (Chapter III)',
          completed: false,
          createdAt: Date.now()
        }
      ];
    }
    return JSON.parse(rawData);
  } catch (error) {
    console.warn('Failed to parse todos from localStorage:', error);
    return [];
  }
}

/**
 * Saves current todos state into localStorage as a JSON string.
 */
function saveTodosToStorage() {
  try {
    localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(state.todos));
  } catch (error) {
    console.error('Failed to save todos to localStorage:', error);
  }
}

/**
 * Resolves theme preference:
 * 1. Checks localStorage for explicit user selection
 * 2. Falls back to OS system preference via matchMedia
 * @returns {'light' | 'dark'}
 */
function loadThemeFromStorage() {
  const saved = localStorage.getItem(STORAGE_KEYS.THEME);
  if (saved === 'dark' || saved === 'light') {
    return saved;
  }
  // Detect OS system dark mode
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

/**
 * Persists theme preference to localStorage.
 * @param {'light' | 'dark'} theme
 */
function saveThemeToStorage(theme) {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (error) {
    console.error('Failed to save theme to localStorage:', error);
  }
}

/**
 * Generates a unique identifier for each todo item.
 * Uses crypto.randomUUID() when available, falling back to timestamp + random.
 * @returns {string}
 */
function generateUniqueId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'todo_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
}

// ---------------------------------------------------------------------------
// 5. State Mutation Functions
// ---------------------------------------------------------------------------

/**
 * Adds a new todo to the list.
 * @param {string} text - Cleaned task title
 */
function addTodo(text) {
  const trimmed = text.trim();
  if (!trimmed) return;

  const newTodo = {
    id: generateUniqueId(),
    text: trimmed,
    completed: false,
    createdAt: Date.now()
  };

  // Prepend new item to the top of the list
  state.todos.unshift(newTodo);
  saveTodosToStorage();
  render();
}

/**
 * Toggles a todo's completed status by its ID.
 * @param {string} id - Todo ID
 */
function toggleTodo(id) {
  const todo = state.todos.find(item => item.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    saveTodosToStorage();
    render();
  }
}

/**
 * Deletes a todo from the list.
 * @param {string} id - Todo ID
 */
function deleteTodo(id) {
  state.todos = state.todos.filter(item => item.id !== id);
  // If the deleted item was currently being edited, reset editingId
  if (state.editingId === id) {
    state.editingId = null;
  }
  saveTodosToStorage();
  render();
}

/**
 * Updates the title of an existing todo.
 * If new text is empty, deletes the todo instead (standard TodoMVC behavior).
 * @param {string} id - Todo ID
 * @param {string} newText - Updated text
 */
function updateTodoText(id, newText) {
  const trimmed = newText.trim();
  if (!trimmed) {
    deleteTodo(id);
    return;
  }

  const todo = state.todos.find(item => item.id === id);
  if (todo) {
    todo.text = trimmed;
    saveTodosToStorage();
  }
  state.editingId = null;
  render();
}

/**
 * Cancels editing mode without saving changes.
 */
function cancelEditing() {
  if (state.editingId !== null) {
    state.editingId = null;
    render();
  }
}

/**
 * Sets the active visibility filter ('all' | 'active' | 'completed').
 * @param {string} filter
 */
function setFilter(filter) {
  if (Object.values(FILTERS).includes(filter)) {
    state.filter = filter;
    render();
  }
}

/**
 * Removes all completed todos from state.
 */
function clearCompleted() {
  state.todos = state.todos.filter(item => !item.completed);
  saveTodosToStorage();
  render();
}

/**
 * Toggles between dark and light theme.
 */
function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  saveThemeToStorage(state.theme);
  applyTheme();
}

// ---------------------------------------------------------------------------
// 6. UI Rendering & DOM Updating
// ---------------------------------------------------------------------------

/**
 * Applies current theme to document root.
 */
function applyTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
}

/**
 * Filters the list of todos based on current state.filter.
 * @returns {Array} Filtered todos
 */
function getFilteredTodos() {
  switch (state.filter) {
    case FILTERS.ACTIVE:
      return state.todos.filter(todo => !todo.completed);
    case FILTERS.COMPLETED:
      return state.todos.filter(todo => todo.completed);
    case FILTERS.ALL:
    default:
      return state.todos;
  }
}

/**
 * Master render function.
 * Synchronizes the entire UI with the current in-memory state.
 */
function render() {
  const filteredTodos = getFilteredTodos();
  const activeCount = state.todos.filter(t => !t.completed).length;
  const completedCount = state.todos.length - activeCount;

  // 1. Update filter buttons active status & ARIA attributes
  elements.filterButtons.forEach(btn => {
    const filterType = btn.getAttribute('data-filter');
    const isActive = filterType === state.filter;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  // 2. Update stats and counters
  elements.itemsLeft.textContent = `${activeCount} ${activeCount === 1 ? 'item' : 'items'} left`;
  elements.footerCount.textContent = `Showing ${filteredTodos.length} of ${state.todos.length} tasks`;

  // 3. Update Clear Completed button state
  elements.clearCompletedBtn.disabled = completedCount === 0;

  // 4. Render Empty State or Todo List
  if (filteredTodos.length === 0) {
    elements.todoList.innerHTML = '';
    elements.emptyState.style.display = 'flex';

    const emptyTitle = elements.emptyState.querySelector('.empty-title');
    const emptyDesc = elements.emptyState.querySelector('.empty-desc');

    if (state.todos.length === 0) {
      emptyTitle.textContent = 'No tasks yet!';
      emptyDesc.textContent = 'Add your first task above to start your odyssey.';
    } else if (state.filter === FILTERS.ACTIVE) {
      emptyTitle.textContent = 'No active tasks!';
      emptyDesc.textContent = 'All your tasks are marked as completed.';
    } else if (state.filter === FILTERS.COMPLETED) {
      emptyTitle.textContent = 'No completed tasks!';
      emptyDesc.textContent = 'Finish a task to see it listed here.';
    }
  } else {
    elements.emptyState.style.display = 'none';
    renderTodoList(filteredTodos);
  }
}

/**
 * Renders the filtered todo list items into the DOM.
 * Uses secure DOM node creation and event delegation.
 * @param {Array} todos
 */
function renderTodoList(todos) {
  // Clear container
  elements.todoList.innerHTML = '';

  const fragment = document.createDocumentFragment();

  todos.forEach(todo => {
    const isEditing = state.editingId === todo.id;

    // Create <li> container
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    li.dataset.id = todo.id;

    if (isEditing) {
      // --- EDIT MODE ---
      const editInput = document.createElement('input');
      editInput.type = 'text';
      editInput.className = 'todo-edit-input';
      editInput.value = todo.text;
      editInput.maxLength = 120;
      editInput.setAttribute('aria-label', 'Edit task text');

      li.appendChild(editInput);

      // Auto-focus and place cursor at end after append
      setTimeout(() => {
        editInput.focus();
        editInput.setSelectionRange(editInput.value.length, editInput.value.length);
      }, 0);
    } else {
      // --- NORMAL DISPLAY MODE ---

      // Checkbox container
      const checkboxWrapper = document.createElement('div');
      checkboxWrapper.className = 'todo-checkbox-wrapper';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'todo-checkbox';
      checkbox.checked = todo.completed;
      checkbox.setAttribute('aria-label', `Mark "${todo.text}" as ${todo.completed ? 'active' : 'completed'}`);

      checkboxWrapper.appendChild(checkbox);

      // Text span (Safe XSS protection: textContent)
      const textSpan = document.createElement('span');
      textSpan.className = 'todo-text';
      textSpan.textContent = todo.text;
      textSpan.title = 'Double-click to edit';

      // Delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'btn-delete';
      deleteBtn.innerHTML = '&times;';
      deleteBtn.setAttribute('aria-label', `Delete task: "${todo.text}"`);

      li.appendChild(checkboxWrapper);
      li.appendChild(textSpan);
      li.appendChild(deleteBtn);
    }

    fragment.appendChild(li);
  });

  elements.todoList.appendChild(fragment);
}

// ---------------------------------------------------------------------------
// 7. Event Handlers & Event Delegation
// ---------------------------------------------------------------------------

/**
 * Handle new todo submission via Form submit event.
 */
elements.todoForm.addEventListener('submit', event => {
  event.preventDefault();
  const text = elements.todoInput.value;
  addTodo(text);
  elements.todoInput.value = '';
  elements.todoInput.focus();
});

/**
 * Event Delegation on the Filter bar.
 * Instead of 3 separate click listeners, handle all filters on parent container.
 */
document.querySelector('.filter-group').addEventListener('click', event => {
  const target = event.target.closest('.filter-btn');
  if (!target) return;
  const filter = target.getAttribute('data-filter');
  setFilter(filter);
});

/**
 * Event Delegation on Todo List Container.
 * Handles checkbox toggles and delete button clicks in a single listener!
 */
elements.todoList.addEventListener('click', event => {
  const todoItem = event.target.closest('.todo-item');
  if (!todoItem) return;
  const id = todoItem.dataset.id;

  // Case 1: Clicked Delete Button
  if (event.target.closest('.btn-delete')) {
    deleteTodo(id);
    return;
  }
});

/**
 * Handle checkbox change event via delegation (change bubbles up).
 */
elements.todoList.addEventListener('change', event => {
  const todoItem = event.target.closest('.todo-item');
  if (!todoItem) return;
  const id = todoItem.dataset.id;

  if (event.target.classList.contains('todo-checkbox')) {
    toggleTodo(id);
  }
});

/**
 * Handle Double Click to enter Edit Mode.
 */
elements.todoList.addEventListener('dblclick', event => {
  const textSpan = event.target.closest('.todo-text');
  if (!textSpan) return;

  const todoItem = textSpan.closest('.todo-item');
  if (!todoItem) return;

  state.editingId = todoItem.dataset.id;
  render();
});

/**
 * Handle keydown events inside the Todo List (for inline editing).
 */
elements.todoList.addEventListener('keydown', event => {
  const editInput = event.target.closest('.todo-edit-input');
  if (!editInput) return;

  const todoItem = editInput.closest('.todo-item');
  if (!todoItem) return;
  const id = todoItem.dataset.id;

  if (event.key === 'Enter') {
    // Commit edit on Enter
    event.preventDefault();
    updateTodoText(id, editInput.value);
  } else if (event.key === 'Escape') {
    // Cancel edit on Escape
    event.preventDefault();
    cancelEditing();
  }
});

/**
 * Handle blur (focus lost) on edit input to commit changes.
 */
elements.todoList.addEventListener('focusout', event => {
  const editInput = event.target.closest('.todo-edit-input');
  if (!editInput) return;

  const todoItem = editInput.closest('.todo-item');
  if (!todoItem) return;
  const id = todoItem.dataset.id;

  // Avoid firing if state was already cleared by Escape/Enter
  if (state.editingId === id) {
    updateTodoText(id, editInput.value);
  }
});

/**
 * Handle Clear Completed button click.
 */
elements.clearCompletedBtn.addEventListener('click', () => {
  clearCompleted();
});

/**
 * Handle Theme Toggle button click.
 */
elements.themeToggleBtn.addEventListener('click', () => {
  toggleTheme();
});

/**
 * Listen for OS system theme changes dynamically.
 */
if (window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    // Only apply if user hasn't explicitly set a preference in localStorage
    if (!localStorage.getItem(STORAGE_KEYS.THEME)) {
      state.theme = event.matches ? 'dark' : 'light';
      applyTheme();
    }
  });
}

// ---------------------------------------------------------------------------
// 8. Application Initialization
// ---------------------------------------------------------------------------
function initApp() {
  applyTheme();
  render();
}

// Run when the DOM content is ready
document.addEventListener('DOMContentLoaded', initApp);
