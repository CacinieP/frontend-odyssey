---
title: '泛型编程与高级工具类型'
description: '构建高度复用、类型安全的通用组件与数据抽象'
---

在软件工程中，构建灵活可复用的组件不仅要支持已知的数据类型，还必须能支持未来可能传入的任意类型。

如果使用 `any`，我们不仅失去了类型检查，还丢弃了返回值与入参之间的关联信息。**泛型 (Generics)** 正是 TypeScript 赋予我们“编写类型参数化代码”的终极武器。

---

## 1. 为什么需要泛型？

观察以下恒等函数：

```typescript
// 朴素做法 1：为每种类型写一个函数（代码冗余爆炸）
function identityNumber(val: number): number { return val; }
function identityString(val: string): string { return val; }

// 朴素做法 2：使用 any（彻底失去类型关联）
function identityAny(val: any): any { return val; }
const result = identityAny("hello"); // result 的类型是 any，失去了 string 的所有代码补全！

// 现代化解法：泛型参数 T (Type Variable)
function identity<T>(val: T): T {
  return val;
}

const num = identity(42);       // 自动推导出 num: number
const str = identity("Odyssey"); // 自动推导出 str: string
```

---

## 2. 泛型约束 (Generic Constraints)

很多时候，我们既希望保持通用性，又需要对传入的类型提出基本要求。此时可以使用 `extends` 进行约束：

```typescript
// 约束 T 必须具备 length 属性
interface HasLength {
  length: number;
}

function logAndReturn<T extends HasLength>(item: T): T {
  console.log(`Length is: ${item.length}`); // 编译器保证 item.length 一定安全合法
  return item;
}

logAndReturn("hello"); // ✅ string 有 length 属性
logAndReturn([1, 2]);  // ✅ Array 有 length 属性
logAndReturn({ length: 10, value: 'custom' }); // ✅ 合法
// logAndReturn(123);  // ❌ Error: Argument of type 'number' is not assignable to 'HasLength'
```

### 结合 `keyof` 约束对象键名

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: 101, username: 'Alex', active: true };
const nameVal = getProperty(user, 'username'); // 精确推导类型为 string
// getProperty(user, 'nonExistentKey'); // ❌ 编译期直接拦截拼写错误！
```

---

## 3. 官方内置的高级工具类型 (Utility Types)

TypeScript 标准库自带了一系列基于映射类型（Mapped Types）构建的高效工具，日常开发不可或缺：

### 1. `Partial<T>` 与 `Required<T>`
将对象的所有属性转为可选（或全部转为必填）：

```typescript
interface Article {
  title: string;
  content: string;
  tags: string[];
}

// 常见于更新接口 (PATCH 请求只需传待修改字段)
function updateArticle(id: string, updates: Partial<Article>) {
  // updates 的 title, content, tags 全为可选
}
```

### 2. `Readonly<T>`
使所有属性只读，防止意外原地修改：

```typescript
const frozenConfig: Readonly<{ apiEndpoint: string }> = {
  apiEndpoint: 'https://api.example.com'
};
// frozenConfig.apiEndpoint = '...'; // ❌ Error: Cannot assign to read-only property
```

### 3. `Pick<T, Keys>` 与 `Omit<T, Keys>`
从已有类型中精选（或剔除）指定属性：

```typescript
// 仅挑选展示所需字段
type ArticlePreview = Pick<Article, 'title' | 'tags'>;

// 剔除高敏感或服务端自动生成字段
type ArticleCreationPayload = Omit<Article, 'tags'>;
```

### 4. `Record<Keys, Type>`
构造键值对映射，非常适合字典和缓存结构：

```typescript
type PageId = 'home' | 'about' | 'contact';
const pageViewCounts: Record<PageId, number> = {
  home: 1200,
  about: 450,
  contact: 120,
};
```

### 5. `ReturnType<T>`
提取函数的实际返回值类型，在抽象封装第三方库函数时极其有用：

```typescript
function createAgentSession() {
  return {
    sessionId: 'session_123',
    model: 'gpt-4o',
    connectedAt: new Date()
  };
}

// 自动获得函数的返回结构类型，避免重复声明 interface
type AgentSession = ReturnType<typeof createAgentSession>;
```
