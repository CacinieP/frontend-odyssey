---
title: '状态管理生态与客户端路由'
description: '从状态提升、Context 到轻量级全局状态与单页路由架构'
---

随着应用程序规模不断扩大，单纯依靠组件内部的 `useState` 将面临经典难题：**深层嵌套组件需要共享数据时，不得不通过每一层中间组件手动透传 Props（称为 Props Drilling 痛点）**。

如何科学管理状态层级？现代前端架构给出了清晰的分层范式：从状态提升、React Context 到现代原子化状态库（如 Zustand），再到将 URL 视为最核心的全局状态。

---

## 1. 状态管理的三层金字塔

```text
       ▲
      / \     [3. 全局共享状态]  (用户登录态 / 购物车 / 全局主题)
     /   \    ─── Zustand, Redux Toolkit
    /     \   [2. 跨层级上下文]  (多语言 / 局部模块共享)
   /       \  ─── React.createContext
  /         \ [1. 本地组件状态]  (表单输入 / Modal 开闭 / Tab 切换)
 ───────────── ─── useState, useReducer
```

### 原则一：优先状态提升 (Lifting State Up)
如果两个兄弟组件需要共享同一份数据，最简单的做法是将状态提升到它们共同的父组件中，并通过 props 下发。

### 原则二：React Context 处理低频全局变更
对于主题（Dark/Light Mode）、当前语言（i18n）等在整个应用广泛需要、但变动频率较低的数据，使用 `createContext`：

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
      <div className={`app-root theme-${theme}`}>{children}</div>
    </ThemeContext.Provider>
  );
}

// 封装自定义 Hook，避免每次使用都写判空逻辑
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
```

---

## 2. 现代轻量级全局状态：Zustand

在过去，Redux 曾是事实标准，但其样板代码（Actions, Reducers, Dispatchers, Middleware）极其沉重。现代 React 社区普遍拥抱以 **Zustand** 为代表的轻量级状态库：

```typescript
// store.ts - 极其精简的全局 Store
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

// 组件中按需订阅，无多余渲染
function CartBadge() {
  const itemCount = useCartStore((state) => state.items.length);
  return <span>Cart: {itemCount}</span>;
}
```

---

## 3. 客户端路由与“将 URL 作为状态源”

单页应用（SPA）通过 HTML5 `History API`（`pushState`, `replaceState`）在不重新向服务器请求整个页面的前提下，动态拦截 URL 改变并重新渲染匹配的组件树：

```tsx
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';

function CoursePage() {
  const { chapterId } = useParams(); // 从 URL 中解析动态参数
  return <h2>当前章节: {chapterId}</h2>;
}

export function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/courses/01-html">HTML 课程</Link>
        <Link to="/courses/02-css">CSS 课程</Link>
      </nav>

      <Routes>
        <Route path="/courses/:chapterId" element={<CoursePage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

> [!TIP]
> **架构箴言：把 URL 视为最权威的状态**
> 能放在 URL 中的状态（如搜索关键词 `?q=react`、分页码 `?page=2`、筛选标签 `?filter=active`），坚决不要存放在本地组件 state 中。把状态保存在 URL 里，用户才能自由复制链接、刷新页面、分享给朋友并使用浏览器的前进/后退按钮。
