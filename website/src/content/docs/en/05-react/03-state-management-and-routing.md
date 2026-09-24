---
title: 'State Management & Client-Side Routing'
description: 'From lifting state up to Context, lightweight stores, and URL-driven single-page routing'
---

As user interfaces grow in scope and depth, relying exclusively on component-local `useState` leads to a classic architectural challenge: **components deeply nested in the tree require access to data held by distant ancestors, forcing intermediate components to pass values through unused levels (known as Props Drilling)**.

Mastering modern state management requires understanding the appropriate tier for each category of application data.

---

## 1. The Three Tiers of State Architecture

```text
       ▲
      / \     [Tier 3: App-Wide Shared Store] (Auth token, Shopping cart, Themes)
     /   \    ─── Zustand, Redux Toolkit
    /     \   [Tier 2: Subtree Context]        (Localization, Compound components)
   /       \  ─── React.createContext
  /         \ [Tier 1: Local Component State] (Form input, Modal toggle, Tab index)
 ───────────── ─── useState, useReducer
```

### Principle 1: Lift State Up First
When two sibling components must synchronize, lift the state up to their nearest common ancestor and pass it down via props before reaching for external state libraries.

### Principle 2: Use React Context for Low-Frequency App-Wide Data
For configurations consumed across broad subtrees that update infrequently (such as Dark/Light modes or active language locales), use `createContext`:

```tsx
import { createContext, useContext, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
} | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`theme-${theme}`}>{children}</div>
    </ThemeContext.Provider>
  );
}

// Custom hook to consume context with built-in null-check
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
```

---

## 2. Modern Lightweight Global State: Zustand

While Redux was historically the standard, its boilerplate overhead (action creators, reducers, dispatchers) prompted modern frontend developers to embrace lightweight, hook-based stores like **Zustand**:

```typescript
// store.ts - Zero-boilerplate global store
import { create } from 'zustand';

interface CartStore {
  items: string[];
  addItem: (item: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  clearCart: () => set({ items: [] }),
}));

// Selective subscription avoids wasteful re-renders
function CartBadge() {
  const count = useCartStore((state) => state.items.length);
  return <span>Items: {count}</span>;
}
```

---

## 3. Client-Side Routing: Treating the URL as the Source of Truth

Single Page Applications (SPAs) intercept browser navigation using the HTML5 `History API` (`pushState`, `replaceState`), dynamically mounting components without requesting full HTML pages from the server:

```tsx
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';

function CourseView() {
  const { chapterId } = useParams();
  return <h2>Current Chapter: {chapterId}</h2>;
}

export function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/courses/01-html">HTML Chapter</Link>
        <Link to="/courses/02-css">CSS Chapter</Link>
      </nav>

      <Routes>
        <Route path="/courses/:chapterId" element={<CourseView />} />
      </Routes>
    </BrowserRouter>
  );
}
```

> [!TIP]
> **Architectural Law: The URL Is the Single Source of Truth**
> Any state that determines page context (search parameters `?q=react`, pagination `?page=2`, active filters `?status=open`) belongs in the URL, not in private component state. Storing state in the URL ensures users can bookmark, refresh, share, and utilize browser history controls seamlessly.
