---
title: 'React 核心哲学、组件思维与 JSX'
description: '从命令式操作 DOM 跨越至声明式组件化架构'
---

在原生 JavaScript 时代，构建复杂界面需要大量直接的 DOM 操作：

```javascript
// 命令式代码 (Imperative Code)：手动指定每一步操作
const button = document.createElement('button');
button.textContent = `Clicks: ${count}`;
button.onclick = () => {
  count++;
  button.textContent = `Clicks: ${count}`; // 必须手动同步数据与视图
};
document.body.appendChild(button);
```

当界面中存在上百个可交互元素，且它们之间存在状态联动时，命令式代码极易出现**状态与视图脱节**（比如修改了变量却忘记更新某处的 DOM 节点）。

**React 的诞生彻底颠覆了这一切。它引入了声明式 UI 范式与组件化思维：`UI = f(State)`。**

---

## 1. 声明式编程 (Declarative) vs 命令式编程 (Imperative)

- **命令式 (How)**：告诉计算机“先找节点 A，再修改文本，如果出错就隐藏节点 B”。
- **声明式 (What)**：直接描述“在当前状态数据下，界面应当呈现出什么样子”。至于如何高效地把变化应用到真实浏览器 DOM 上，由 React 框架的协调算法（Reconciliation）全权负责。

---

## 2. 虚拟 DOM (Virtual DOM) 与协调机制

浏览器真实 DOM 是极其沉重的对象，频繁的直接读写会触发浏览器反复进行重排（Reflow）与重绘（Repaint），带来巨大的性能开销。

React 在内存中维护了一棵轻量级的纯 JavaScript 对象树，称为**虚拟 DOM (Virtual DOM)**：
1. **状态更新**：当组件状态发生改变，React 重新执行渲染函数生成新的 Virtual DOM 树。
2. **Diffing 算法**：React 将新树与旧树进行高效对比，精确找出发生变化的最小节点。
3. **批量更新 (Batching)**：将所有必要的变动一次性提交到真实 DOM，将页面渲染性能最大化。

---

## 3. JSX 语法：JavaScript 与标记语言的融合

JSX 既不是 HTML，也不是单纯的字符串，而是 **JavaScript 的语法扩展 (Syntax Extension)**：

```tsx
interface ProfileCardProps {
  username: string;
  avatarUrl: string;
  isOnline: boolean;
}

// 现代函数式组件 (Functional Component)
export function ProfileCard({ username, avatarUrl, isOnline }: ProfileCardProps) {
  return (
    <div className="profile-card">
      <img src={avatarUrl} alt={`${username}'s avatar`} className="avatar" />
      <div className="info">
        <h3>{username}</h3>
        {/* 条件渲染 (Conditional Rendering) */}
        {isOnline ? (
          <span className="badge online">在线</span>
        ) : (
          <span className="badge offline">离线</span>
        )}
      </div>
    </div>
  );
}
```

> [!NOTE]
> **JSX 的本质**
> 构建工具会将 JSX 转换为 `React.createElement()` 或新的 JSX Runtime 调用（`jsx('div', ...)`）。因此，花括号 `{}` 内部可以书写任何合法的 JavaScript 表达式（如变量、三元运算、`.map()` 列表渲染）。

---

## 4. Props：单向数据流与不可变契约

在 React 架构中，数据沿着组件树自顶向下单向流动，称为**单向数据流 (One-way Data Flow)**：

1. **父传子**：父组件通过属性向子组件传递数据。
2. **只读性 (Read-only)**：子组件绝对不能直接修改自身接收到的 `props`。
3. **纯函数准则**：React 要求所有组件函数在对待自身入参时必须表现得像纯函数一样，传入相同的 props 必然返回相同的 UI 结构。
