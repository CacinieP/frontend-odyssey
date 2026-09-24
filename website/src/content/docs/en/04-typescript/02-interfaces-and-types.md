---
title: 'Interfaces, Types & Type Narrowing'
description: 'Defining precise data contracts and mastering complex union states'
---

Once primitive types are understood, modern frontend development demands answers to key structural questions: **How do we describe complex data shapes (such as backend API payloads or component Props) and reliably handle polymorphic states?**

In TypeScript, `interface` and `type` form the twin pillars of data modeling, while **Type Narrowing** is the foundational technique for safely manipulating union types.

---

## 1. Interface vs. Type Alias

### Core Syntax Comparison

```typescript
// Declaring object shapes with interface
interface User {
  readonly id: string; // Immutable property after initialization
  name: string;
  email: string;
  avatarUrl?: string;  // Optional property
}

// Declaring union types with type alias
type Role = 'admin' | 'editor' | 'viewer'; // Literal union

// Combining contracts with intersection (&)
type AdminUser = User & {
  role: 'admin';
  permissions: string[];
};
```

### Feature Comparison Matrix

| Feature | `interface` | `type` |
| :--- | :--- | :--- |
| **Primary Target** | Object and class structures | Any valid type (primitives, unions, tuples, functions) |
| **Extension Syntax** | `extends` clause | `&` intersection operator |
| **Declaration Merging** | Supported (duplicate names merge automatically) | Not supported (duplicate identifiers throw compile error) |
| **Recommended Use** | Public APIs, UI Component Props, OOP models | Unions, tuples, conditional types, mapped types |

> [!TIP]
> **Architectural Guidance**: Use `interface` when defining standard object shapes and component contracts because it provides better compiler caching and extension ergonomics. Use `type` when declaring unions, tuples, or complex mapped types.

---

## 2. Union Types & Discriminated Unions

Real-world applications frequently encounter mutually exclusive states, such as asynchronous network requests:

```typescript
// Suboptimal pattern (leads to impossible state combinations)
interface FlawedNetworkState {
  isLoading: boolean;
  data?: string[];
  error?: string;
}
// Problem: What if isLoading is true AND error exists? The state becomes ambiguous!
```

### The Solution: Discriminated Unions

By introducing a shared discriminant literal property (typically `status` or `kind`), you model invalid states out of existence:

```typescript
interface LoadingState {
  status: 'loading';
}

interface SuccessState {
  status: 'success';
  data: string[];
}

interface ErrorState {
  status: 'error';
  error: Error;
}

type NetworkState = LoadingState | SuccessState | ErrorState;
```

---

## 3. Type Narrowing

Once you define a union, TypeScript provides multiple guards to safely narrow values down to a specific branch:

### 1. Literal Discriminant Checks

```typescript
function renderUI(state: NetworkState) {
  switch (state.status) {
    case 'loading':
      return '<Spinner />';
    case 'success':
      // state is narrowed to SuccessState; state.data is guaranteed!
      return `Loaded ${state.data.length} records`;
    case 'error':
      // state is narrowed to ErrorState; state.error is guaranteed!
      return `Error: ${state.error.message}`;
  }
}
```

### 2. `typeof` and `instanceof` Guards

```typescript
function formatValue(value: string | number | Date): string {
  if (typeof value === 'number') {
    return value.toFixed(2);
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  return value.trim();
}
```

### 3. The `in` Operator Guard

```typescript
interface Fish { swim: () => void }
interface Bird { fly: () => void }

function navigate(creature: Fish | Bird) {
  if ('swim' in creature) {
    creature.swim(); // Narrowed to Fish
  } else {
    creature.fly();  // Narrowed to Bird
  }
}
```

### 4. Custom Type Predicates (`value is T`)

For encapsulating custom validation logic:

```typescript
function isNonNullable<T>(item: T): item is NonNullable<T> {
  return item !== null && item !== undefined;
}

const rawList: (string | null | undefined)[] = ['alpha', null, 'beta', undefined];
const cleanList: string[] = rawList.filter(isNonNullable); // Accurately typed as string[]
```
