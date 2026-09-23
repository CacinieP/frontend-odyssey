# 原生 JavaScript 待办事项应用 (JS 毕业设计)

> [Frontend Odyssey](https://github.com/frontend-odyssey) **第三章 (JavaScript)** 的综合实战毕业设计 (Capstone Project)。

这是一个现代、轻快且功能齐备的待办事项管理应用 (Todo App)，完全使用**原生 HTML、CSS 与 JavaScript (Vanilla JS)** 构建——无需 React、Vue、第三方库或打包工具。

[English](README.md) | [简体中文](README.zh.md)

---

## 🎯 本项目展示的核心技能

在过早投入 React 或 Vue 等现代框架之前，每一位优秀的前端工程师都必须深刻理解浏览器如何执行 JavaScript、如何操作文档对象模型 (DOM) 以及如何处理事件流。本项目将专业级的设计模式贯彻在原生开发中：

1. **状态驱动架构 (State-Driven Architecture) 与单一数据源 (Single Source of Truth)**：
   - 彻底摒弃从 DOM 节点直接读取和修改文本的低级做法（这种做法极易导致界面和数据不同步）。
   - 内存中维护统一的 `state` 对象。所有用户操作优先修改状态，持久化到 `localStorage`，最后通过统一的 `render()` 函数更新视图 (`UI = f(state)`)。

2. **事件委托机制 (Event Delegation)**：
   - 不在每个动态生成的复选框、文本和删除按钮上分别绑定监听器（既耗费内存，又容易引起内存泄漏），而是将监听器挂载在父级 `<ul>` 容器上。
   - 结合 `event.target.closest()` 优雅判断触发目标，利用事件冒泡 (Event Bubbling) 实现高性能事件调度。

3. **DOM 节点操作与渲染优化**：
   - 使用原生的 `document.createElement` 安全创建节点。
   - 采用 `document.createDocumentFragment()` 进行批量节点挂载，大幅降低浏览器的重排 (Reflow) 与重绘 (Repaint)。
   - 严格使用 `textContent` 处理用户输入，防止跨站脚本攻击 (XSS Prevention)。

4. **Web 存储 API (`localStorage`) 与防御性解析**：
   - 待办任务与主题偏好在页面刷新后持久保留。
   - 针对 `JSON.parse` 编写严谨的 `try...catch` 错误处理，防御数据污染或隐身模式下的存储异常。

5. **全键盘无障碍交互 (Keyboard Accessibility)**：
   - 按 <kbd>Enter</kbd> 快速提交新任务。
   - 双击已有任务文本即可进入行内编辑状态 (Inline Editing)。
   - 编辑状态下按 <kbd>Enter</kbd> 保存修改，按 <kbd>Escape</kbd> 撤销放弃。
   - 通过 ARIA 实时区域 (`aria-live="polite"`) 向屏幕阅读器动态播报数量变化。

6. **深色 / 浅色主题切换 (Dark & Light Theme)**：
   - 自动检测并匹配操作系统的系统级外观偏好 (`prefers-color-scheme`)。
   - 支持用户手动切换，偏好保存在 `localStorage` 中，并通过 `[data-theme]` 属性与 CSS 自定义属性无缝联动。

---

## 📂 项目目录结构

```text
todo-app-vanilla/
├── index.html       # 结构清晰的语义化页面结构
├── style.css        # 主题变量、卡片布局与动画过渡样式
├── app.js           # 状态存储、事件委托与 DOM 渲染逻辑
├── package.json     # 项目配置与本地运行脚本
├── README.md        # 英文项目说明文档
└── README.zh.md     # 中文项目说明文档
```

---

## 🚀 快速启动

### 前置环境

需要安装 Node.js (v18+) 与 `pnpm` (或 `npm`/`npx`)。

### 本地运行

在当前目录下执行：

```bash
# 在 monorepo 环境中使用 pnpm 启动
pnpm dev

# 或者直接通过 npx 启动静态服务
npx serve .
```

启动后在浏览器中打开提示的本地地址（通常为 [http://localhost:3000](http://localhost:3000)）。

由于这是一个完全不依赖构建工具的纯前端项目，你也可以直接双击 `index.html` 在任何现代浏览器中运行。

---

## 💡 资深工程师的设计思考 (WHY before HOW)

### 1. 为什么“状态驱动”优于“直接扒拉 DOM”？
很多初学者的写法是这样的：

```javascript
// ❌ 脆弱的直接操作 DOM：
deleteBtn.addEventListener('click', (e) => {
  e.target.parentElement.remove(); // DOM 删掉了，但数据呢？
  // 如果要存 localStorage，你得遍历所有 <li> 重新拼接数组...
});

// ✅ 专业的状态驱动模式 (State-Driven)：
function deleteTodo(id) {
  state.todos = state.todos.filter(t => t.id !== id); // 1. 改状态
  saveTodosToStorage();                                // 2. 存本地
  render();                                            // 3. 刷界面
}
```

当数据成为唯一真相时，你再也不需要担心“界面删除了但本地缓存还在”的幽灵 Bug。这正是 React、Vue 等现代框架底层核心思想的原生写照！

### 2. 事件委托 (Event Delegation) 的本质优势
如果列表里有 100 个待办项，为每个元素分别绑定 `addEventListener` 会创建数百个函数闭包，并在节点被删除时可能残留引用引发内存泄漏。
利用浏览器天然的事件冒泡机制，我们在父容器上监听一次即可：

```javascript
elements.todoList.addEventListener('click', (event) => {
  const todoItem = event.target.closest('.todo-item');
  if (!todoItem) return;
  const id = todoItem.dataset.id;

  if (event.target.closest('.btn-delete')) {
    deleteTodo(id);
  }
});
```

无论未来动态增删多少个任务，事件监听都能稳定生效，干净利落。

### 3. 防范 XSS (Cross-Site Scripting) 攻击
如果恶意用户把待办事项的名字设为 `<img src=x onerror=alert('hacked')>`：
- 如果使用 `innerHTML = `<span>${todo.text}</span>``，浏览器会执行其中的脚本！
- 而使用 `element.textContent = todo.text`，浏览器会纯粹把文本作为字符串对待，从源头杜绝了脚本注入。

---

## 🛠️ 进阶挑战 (挑战你的极限)

当你熟练掌握了基础版本后，不妨尝试为它添加以下特性：
1. **拖拽重排 (Drag and Drop)**：使用 HTML5 原生拖放 API (`draggable="true"`) 实现任务卡片的自由拖拽排序。
2. **截止日期与优先级 (Priority & Due Dates)**：增加日期选择器和“紧急/普通/低”优先级标签。
3. **实时关键字搜索 (Live Search)**：增加搜索输入框，根据用户输入即时过滤任务。

继续加油，享受在 [Frontend Odyssey](https://github.com/frontend-odyssey) 中的成长之旅！
