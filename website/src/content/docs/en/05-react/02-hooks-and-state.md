---
title: 'Reactive State & Modern Hooks Architecture'
description: 'Mastering useState, useEffect lifecycle semantics, and composable custom hooks'
---

In earlier editions of React, stateful components required ES6 class syntax. Class components introduced cumbersome `this` binding boilerplate, fragmented lifecycle methods (e.g. duplicating data-fetching logic between `componentDidMount` and `componentDidUpdate`), and severe friction when sharing stateful logic.

The introduction of **Hooks** in React 16.8 transformed modern frontend engineering, allowing function components to retain reactive state and elegantly compose side effects.

---

## 1. `useState`: Driving Reactive UI Updates

`useState` is the fundamental hook for registering state cells within a component's render loop:

```tsx
import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState<number>(0);

  const increment = () => {
    // Best practice: Use an updater function to ensure calculations use the latest snapshot
    setCount((prev) => prev + 1);
  };

  return (
    <button onClick={increment} className="btn-primary">
      Clicked {count} times
    </button>
  );
}
```

> [!WARNING]
> **Immutability Contract**
> Never mutate objects or arrays in-place (`list.push(item)` or `user.name = 'Bob'`). React relies on shallow reference equality (`Object.is`) to detect modifications. Always produce new references using spread operators:
> `setList(prev => [...prev, newItem])`
> `setUser(prev => ({ ...prev, name: 'Bob' }))`

---

## 2. `useEffect`: Synchronizing with the Outside World

The primary duty of a component is computing its render output from props and state. Any operation that interacts outside this loop (network calls, event listeners, timer ticks, direct DOM measurements) is classified as a **Side Effect**.

```tsx
import { useState, useEffect } from 'react';

export function WindowWidthTracker() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    // 1. Subscribe to external event
    window.addEventListener('resize', handleResize);

    // 2. Cleanup Function
    // Called when the component unmounts or before re-executing the effect
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty dependency array: runs setup on mount and cleanup on unmount

  return <p>Current Window Width: {width}px</p>;
}
```

### The Three Modes of Dependencies

- `useEffect(fn)`: Executes after every completed render pass.
- `useEffect(fn, [])`: Runs once when the component mounts and cleans up on unmount.
- `useEffect(fn, [id, query])`: Re-runs exclusively when `id` or `query` changes reference.

---

## 3. Custom Hooks: Composable Stateful Logic

You can encapsulate any reusable logic that consumes built-in hooks into a dedicated function prefixed with `use`:

```tsx
// Reusable debounce hook
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delayMs: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => clearTimeout(handler);
  }, [value, delayMs]);

  return debouncedValue;
}

// In any component:
// const debouncedQuery = useDebounce(query, 300);
```

---

## 4. The Two Golden Rules of Hooks

1. **Only Call Hooks at the Top Level**: Do not call hooks inside loops, conditional statements, or nested closures. This guarantees that hooks execute in the exact same index order on every render pass.
2. **Only Call Hooks from React Functions**: Invoke hooks exclusively within React functional components or inside custom hooks.
