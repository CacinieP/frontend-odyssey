---
title: '接口、类型别名与类型收窄'
description: '构建精准数据契约与掌控复杂的联合类型'
---

在掌握了基础类型后，前端开发面对的核心诉求是：**如何描述复杂的数据结构（如服务端响应的数据、组件 Props）以及处理多态场景？**

在 TypeScript 中，`interface`（接口）与 `type`（类型别名）是定义对象模型与契约的双子星，而**类型收窄 (Type Narrowing)** 则是驾驭联合类型的核心技术。

---

## 1. 接口 (Interface) vs 类型别名 (Type Alias)

### 基本用法定义

```typescript
// 使用 interface 定义对象形态
interface User {
  readonly id: string; // 只读属性，初始化后禁止修改
  name: string;
  email: string;
  avatarUrl?: string;  // 可选属性 (Optional)
}

// 使用 type 定义联合类型或复杂组合
type Role = 'admin' | 'editor' | 'viewer'; // 字面量联合类型

// 通过交叉类型 (Intersection) 组合
type AdminUser = User & {
  role: 'admin';
  permissions: string[];
};
```

### 两者的核心差异与选型指南

| 特性 | `interface` | `type` |
| :--- | :--- | :--- |
| **适用对象** | 专为对象 (`Object`) 与类 (`Class`) 结构设计 | 适用于任何类型（原始值、联合类型、元组、函数等） |
| **扩展方式** | `extends` 继承机制 | `&` 交叉类型合并 |
| **声明合并** | 支持（多次同名声明自动合并） | 不支持（同名重复声明抛出语法错误） |
| **最佳实践场景** | 定义公共 API、组件 Props 接口、库的对外契约 | 联合类型、元组、条件类型、高级映射类型 |

> [!TIP]
> **设计哲学**：如果是定义单纯的对象形状或公开库契约，优先使用 `interface`（具备更好的编译器缓存性能与可扩展性）；当需要字面量联合、元组或复杂计算类型时，使用 `type`。

---

## 2. 联合类型与可辨识联合 (Discriminated Unions)

实际业务中，数据经常具备多种可能的状态。例如网络请求：

```typescript
// 朴素写法（容易产生无效状态组合）
interface BadNetworkState {
  isLoading: boolean;
  data?: string[];
  error?: string;
}
// 思考：如果 isLoading 为 true，同时又有 error，这是什么状态？逻辑混乱！
```

### 最佳方案：可辨识联合 (Discriminated Unions)

利用一个共同的单例属性（通常命名为 `status`、`type` 或 `kind`）来精确建模互斥状态：

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

## 3. 类型收窄 (Type Narrowing)

有了联合类型后，如何安全地访问特定状态下的专属属性？TypeScript 提供了多种收窄守卫：

### 1. 字面量属性守卫 (针对可辨识联合)

```typescript
function renderUI(state: NetworkState) {
  switch (state.status) {
    case 'loading':
      // 此处 state 被收窄为 LoadingState
      return '<Spinner />';
    case 'success':
      // 此处 state 被收窄为 SuccessState，data 保证存在！
      return `Loaded ${state.data.length} items`;
    case 'error':
      // 此处 state 被收窄为 ErrorState，error 保证存在！
      return `Failed: ${state.error.message}`;
  }
}
```

### 2. `typeof` 与 `instanceof` 守卫

```typescript
function formatInput(input: string | number | Date): string {
  if (typeof input === 'number') {
    return input.toFixed(2);
  }
  if (input instanceof Date) {
    return input.toISOString();
  }
  return input.trim();
}
```

### 3. `in` 操作符守卫

```typescript
interface Fish { swim: () => void }
interface Bird { fly: () => void }

function move(animal: Fish | Bird) {
  if ('swim' in animal) {
    animal.swim(); // 收窄为 Fish
  } else {
    animal.fly();  // 收窄为 Bird
  }
}
```

### 4. 自定义类型谓词 (Type Predicates)

当你需要封装复杂的校验逻辑并在外部复用时：

```typescript
function isNonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

const mixedList: (string | null | undefined)[] = ['alpha', null, 'beta', undefined];
const validStrings: string[] = mixedList.filter(isNonNullable); // 精准收窄为 string[]
```
