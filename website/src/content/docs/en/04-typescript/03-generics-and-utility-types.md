---
title: 'Generics & Advanced Utility Types'
description: 'Constructing flexible, reusable abstractions and type-safe data pipelines'
---

In software engineering, building adaptable and reusable components means designing interfaces capable of working with current data models as well as unknown future types.

Relying on `any` sacrifices type safety and severs the link between input parameters and return values. **Generics** provide TypeScript's ultimate mechanism for parameterizing types without sacrificing precision.

---

## 1. Why Generics?

Consider a standard identity function:

```typescript
// Suboptimal Pattern 1: Writing repetitive functions per type
function identityNum(val: number): number { return val; }
function identityStr(val: string): string { return val; }

// Suboptimal Pattern 2: Using any (erases all safety)
function identityAny(val: any): any { return val; }
const res = identityAny("hello"); // res is 'any', losing all string method autocompletion!

// The Modern Solution: Generic Type Variable (T)
function identity<T>(val: T): T {
  return val;
}

const num = identity(42);       // Inferred as number
const str = identity("Odyssey"); // Inferred as string
```

---

## 2. Generic Constraints

Often, a function needs to remain generic while still requiring certain structural guarantees. You can enforce boundaries using the `extends` keyword:

```typescript
interface HasLength {
  length: number;
}

function printLength<T extends HasLength>(item: T): T {
  console.log(`Length: ${item.length}`); // Guaranteed valid by compiler
  return item;
}

printLength("hello"); // ✅ String has length
printLength([1, 2]);  // ✅ Array has length
printLength({ length: 4, label: 'box' }); // ✅ Object satisfies constraint
// printLength(42);   // ❌ Error: Argument of type 'number' lacks 'length'
```

### Key Constraints with `keyof`

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: 101, username: 'Alex', active: true };
const val = getProperty(user, 'username'); // Inferred as string
// getProperty(user, 'missingField'); // ❌ Caught at compile time!
```

---

## 3. Essential Built-in Utility Types

TypeScript provides indispensable higher-order utility types built upon mapped types:

### 1. `Partial<T>` & `Required<T>`
Makes all properties of an object optional (or required):

```typescript
interface Article {
  title: string;
  content: string;
  tags: string[];
}

// Typical in PATCH APIs where only updated fields are transmitted
function updateArticle(id: string, fields: Partial<Article>) {
  // All fields in Article become optional
}
```

### 2. `Readonly<T>`
Freezes properties against in-place mutations:

```typescript
const appConfig: Readonly<{ endpoint: string }> = {
  endpoint: 'https://api.example.com'
};
// appConfig.endpoint = '...'; // ❌ Error: Cannot assign to read-only property
```

### 3. `Pick<T, Keys>` & `Omit<T, Keys>`
Extracts or excludes subsets of properties:

```typescript
// Pick only necessary presentation fields
type ArticleCard = Pick<Article, 'title' | 'tags'>;

// Omit internal or sensitive properties
type ArticleSubmission = Omit<Article, 'tags'>;
```

### 4. `Record<Keys, Type>`
Maps property keys to designated value types:

```typescript
type RouteName = 'home' | 'about' | 'settings';
const hitCounts: Record<RouteName, number> = {
  home: 1200,
  about: 450,
  settings: 300,
};
```

### 5. `ReturnType<T>`
Extracts the return type of any function expression:

```typescript
function initAgent() {
  return {
    agentId: 'agent_007',
    model: 'claude-3-5-sonnet',
    uptime: 3600
  };
}

// Seamlessly infer return type without maintaining duplicate interfaces
type AgentInstance = ReturnType<typeof initAgent>;
```
