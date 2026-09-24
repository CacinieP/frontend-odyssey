---
title: '响应式状态与 Hooks 深度机制'
description: '深入掌握 useState、useEffect 以及自定义 Hook 的封装复用'
---

在早期的 React 中，拥有独立状态的组件必须使用 ES6 `class` 语法。类组件带来了繁琐的 `this` 绑定、割裂的生命周期钩子（如在 `componentDidMount` 与 `componentDidUpdate` 中重复编写数据获取逻辑）以及难以跨组件复用状态逻辑的痛点。

React 16.8 引入的 **Hooks** 彻底改变了这一格局，使得函数式组件不仅能持有响应式状态，还能以细粒度的方式组合副作用。

---

## 1. `useState`：驱动 UI 重绘的响应式状态

`useState` 是最核心的 Hook，用于声明组件内的响应式记忆单元：

```tsx
import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState<number>(0);

  const increment = () => {
    // 推荐写法：使用函数式更新 (Updater Function)，确保基于最新快照计算
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
> **不可变更新准则 (Immutability)**
> 绝不能直接修改对象或数组状态（如 `user.name = 'Bob'` 或 `list.push(item)`），因为 React 依赖引用地址比较（Object.is）来检测变化。必须通过解构展开生成新引用：
> `setUser(prev => ({ ...prev, name: 'Bob' }))`
> `setList(prev => [...prev, newItem])`

---

## 2. `useEffect`：与外部世界同步与副作用清理

组件的主要工作是基于当前 props 和 state 计算 UI。而任何不直接参与 UI 计算的操作（如网络请求、监听浏览器事件、设置定时器、直接操作第三方图表库）都被称为**副作用 (Side Effects)**。

```tsx
import { useState, useEffect } from 'react';

export function WindowWidthTracker() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    // 1. 订阅事件
    window.addEventListener('resize', handleResize);

    // 2. 清理函数 (Cleanup Function)
    // 当组件卸载，或下一次 effect 执行前调用，防止内存泄漏！
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // 依赖项数组为空 []，代表仅在挂载时执行一次订阅，并在卸载时取消

  return <p>当前视口宽度: {width}px</p>;
}
```

### 依赖项数组 (Dependencies Array) 的三种形态

- `useEffect(fn)`：不传依赖项，每次组件渲染完毕后都会执行。
- `useEffect(fn, [])`：传空数组，仅在组件首次挂载 (Mount) 时执行一次。
- `useEffect(fn, [id, query])`：仅当 `id` 或 `query` 的值发生改变时才重新执行。

---

## 3. 自定义 Hooks (Custom Hooks)：状态逻辑的高阶复用

在 React 中，你可以将任何包含内置 Hook 的通用逻辑抽取成以 `use` 开头的函数：

```tsx
// 封装通用的防抖 Hook (useDebounce)
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delayMs: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debouncedValue;
}

// 在任何组件中像使用原生 Hook 一样优雅调用：
// const debouncedSearchTerm = useDebounce(searchTerm, 300);
```

---

## 4. Hooks 使用的两大铁律 (Rules of Hooks)

1. **只在最顶层调用 Hook**：禁止在循环（loops）、条件分支（conditions）或嵌套函数中调用 Hook。这保证了在每一次渲染中，Hooks 的执行顺序永远保持一致。
2. **只在 React 函数中调用 Hook**：仅在 React 函数组件或自定义 Hook（Custom Hook）中调用，不要在常规的 JavaScript 工具函数中调用。
