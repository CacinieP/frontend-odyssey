---
title: 'DOM 与事件'
description: '与网页元素实时交互'
---

当浏览器加载 HTML 文档时，并不会直接将这些字符绘制在屏幕上。相反，浏览器会解析这些标记语言，并在内存中构建一个树状的对象模型，这便是 **文档对象模型 (DOM, Document Object Model)**。

借助 DOM，JavaScript 可以实时读取、遍历、修改、创建乃至销毁网页上的任何元素。

---

## 1. 什么是文档对象模型 (DOM)？

不妨把 HTML 源码当做一张**建筑设计图纸**，而 DOM 则是依据图纸建造出来的**实体建筑**。

```html
<!-- HTML 源代码 -->
<div id="card">
  <h2 class="title">商品介绍</h2>
  <button class="btn">立即购买</button>
</div>
```

浏览器会将上述代码解析为一棵由节点构成的对象树：`document` → `div#card` → 子节点 (`h2.title`, `button.btn`)。每一个 HTML 标签都会被映射为一个拥有独立属性和方法的 JavaScript 对象。

---

## 2. 选取页面元素 (Selecting Elements)

要想修改界面内容，第一步是定位对应的元素节点。现代 JavaScript 提供了高效灵活的查找方法：

```javascript
// 1. 通过 ID 选取（速度最快，返回单一元素或 null）
const card = document.getElementById('card');

// 2. querySelector：使用标准的 CSS 选择器语法，返回匹配到的首个元素
const heading = document.querySelector('#card .title');
const buyBtn = document.querySelector('button.btn');

// 3. querySelectorAll：返回匹配该选择器的所有元素集合（NodeList）
const allButtons = document.querySelectorAll('button');

// 遍历 NodeList：
allButtons.forEach((btn, index) => {
  console.log(`按钮 #${index}:`, btn.textContent);
});
```

> **资深开发者建议：** 推荐优先使用 `querySelector` 与 `querySelectorAll`。需要注意的是，`querySelectorAll` 返回的是 `节点列表 (NodeList)` 而非原生数组；它虽然原生支持 `.forEach()`，但如果你需要使用 `.map()` 或 `.filter()`，请先通过 `Array.from()` 或展开语法 `[...allButtons]` 将其转换为标准数组。

---

## 3. 修改元素内容与样式 (Modifying Elements)

定位元素后，你可以动态更新文本、HTML 结构、样式类和行内样式：

```javascript
const heading = document.querySelector('.title');

// 安全修改纯文本（自动转义 HTML 实体，杜绝 XSS 漏洞）
heading.textContent = '限时特惠！';

// 渲染 HTML 片段（解析 HTML 标签 —— 谨慎使用！）
heading.innerHTML = '限时 <em>特惠</em>！';

// 通过 classList 管理 CSS 类名（最佳实践）
heading.classList.add('highlight');
heading.classList.remove('hidden');
heading.classList.toggle('active');
const isHighlighted = heading.classList.contains('highlight');

// 直接修改行内样式 (style)
heading.style.color = '#2563eb';
heading.style.fontSize = '24px'; // 注意属性名采用驼峰命名法 (camelCase)
```

> **安全预警：** 绝不要把未经安全过滤的用户输入直接赋值给 `innerHTML`，否则会引发致命的`跨站脚本攻击 (XSS, Cross-Site Scripting)`。展示普通文本时，始终优先采用 `textContent`。

---

## 4. 事件监听 (Event Listeners)：赋予页面交互能力

网页的核心在于响应用户行为。当用户点击、输入、提交或滚动时，浏览器会派发一个`事件 (Event)`。我们通过 `addEventListener` 注册监听：

```javascript
const button = document.querySelector('.btn');
const searchInput = document.querySelector('#search');
const signupForm = document.querySelector('#signup-form');

// 1. 点击事件 (click)
button.addEventListener('click', (event) => {
  console.log('按钮被点击：', event.target);
});

// 2. 输入事件 (input，在用户每次键入时即时触发)
searchInput.addEventListener('input', (event) => {
  console.log('当前搜索关键字：', event.target.value);
});

// 3. 表单提交事件 (submit，务必阻止默认刷新行为)
signupForm.addEventListener('submit', (event) => {
  event.preventDefault(); // 阻止浏览器重新加载页面
  console.log('表单以无刷新方式提交完成');
});

// 4. 键盘事件 (keydown)
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    console.log('用户按下了 Esc 键 —— 关闭模态弹窗');
  }
});
```

---

## 5. 事件委托 (Event Delegation)：编写高可伸缩代码

假设你有一个动态生成的列表，包含 1000 个子项。如果为每个子项单独绑定点击事件，不仅极其消耗内存，而且后续动态添加的新元素也不会具有该事件。

利用 JavaScript 中事件由内向外层层向上传递的`事件冒泡 (Event Bubbling)`机制，我们可以将事件监听器统一绑定在父级容器上，这种设计范式被称为 **事件委托 (Event Delegation)**：

```html
<ul id="todo-list">
  <li data-id="1">买生活用品 <button class="delete-btn">×</button></li>
  <li data-id="2">写 JavaScript 代码 <button class="delete-btn">×</button></li>
</ul>
```

```javascript
const list = document.querySelector('#todo-list');

list.addEventListener('click', (event) => {
  // 判断点击的目标元素或其祖先是否包含删除按钮类名
  const deleteBtn = event.target.closest('.delete-btn');
  if (!deleteBtn) return;

  const item = deleteBtn.closest('li');
  console.log(`删除待办项 ID: ${item.dataset.id}`);
  item.remove();
});
```

通过事件委托，你的代码兼具高性能与低内存消耗，并且能够自然支持所有未来动态插入的 DOM 元素。
