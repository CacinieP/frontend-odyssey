---
title: 'React Fundamentals, Component Thinking & JSX'
description: 'From imperative DOM manipulation to declarative, component-driven UI architecture'
---

In early JavaScript development, building interactive web apps required endless manual DOM operations:

```javascript
// Imperative Code: Manually scripting every low-level DOM operation
const button = document.createElement('button');
button.textContent = `Clicks: ${count}`;
button.onclick = () => {
  count++;
  button.textContent = `Clicks: ${count}`; // Manual synchronization required
};
document.body.appendChild(button);
```

As applications grew to hundreds of interconnected widgets, imperative manipulation inevitably led to **state-UI desynchronization** (e.g. data mutated in memory while a forgotten DOM node still displayed stale values).

**React fundamentally changed frontend architecture by introducing declarative UI and component thinking: `UI = f(State)`.**

---

## 1. Declarative vs. Imperative

- **Imperative (How)**: Instructing the browser step-by-step: "Find node A, append child B, if failure occurs hide element C".
- **Declarative (What)**: Directly declaring what the UI should look like for any given snapshot of application state. The reconciliation engine handles applying the minimum set of DOM mutations needed.

---

## 2. Virtual DOM & Reconciliation

Real browser DOM nodes are heavy objects with hundreds of properties and prototype chains. Frequent read-writes force the browser into expensive layout recalculations (reflows) and repaints.

React maintains an in-memory tree of lightweight JavaScript descriptors known as the **Virtual DOM**:
1. **Render Cycle**: When component state changes, React executes the component function to generate a new Virtual DOM tree.
2. **Diffing Algorithm**: React compares the new tree with the previous snapshot to identify exact points of divergence.
3. **Batched Mutation**: Required mutations are batched and applied to the real browser DOM in a single cohesive pass.

---

## 3. JSX: Blending JavaScript and Markup

JSX is neither HTML nor a template string. It is a **syntax extension for JavaScript**:

```tsx
interface ProfileCardProps {
  username: string;
  avatarUrl: string;
  isOnline: boolean;
}

// Modern functional component
export function ProfileCard({ username, avatarUrl, isOnline }: ProfileCardProps) {
  return (
    <div className="profile-card">
      <img src={avatarUrl} alt={`${username}'s avatar`} className="avatar" />
      <div className="info">
        <h3>{username}</h3>
        {/* Conditional rendering using JavaScript expressions */}
        {isOnline ? (
          <span className="badge online">Active</span>
        ) : (
          <span className="badge offline">Offline</span>
        )}
      </div>
    </div>
  );
}
```

> [!NOTE]
> **Under the Hood**
> Compilers transform JSX into `jsx('div', ...)` runtime calls. Inside curly braces `{}`, you can execute any valid JavaScript expression, including ternaries, variables, and `.map()` iterations.

---

## 4. Props: Unidirectional Data Flow

In React architectures, information moves down the component hierarchy via **Unidirectional Data Flow**:

1. **Top-Down**: Parents supply configurations to children through attributes called `props`.
2. **Immutability**: Components must treat received props as strictly read-only.
3. **Pure Function Contract**: Components should act like pure functions with respect to their props—given identical inputs, they must predictably render identical UI trees.
