---
title: 'CSS 基础'
description: '为你的 HTML 赋予样式'
---

如果说 HTML 是网页的骨架，决定了页面的结构与语义，那么 **层叠样式表 (CSS, Cascading Style Sheets)** 就是网页的皮肤、服饰与仪态。没有 CSS，互联网上的每个网站都会像 1991 年未加排版的学术纯文本。CSS 负责将原始的语义标记转换为视觉优美、可读性高且适配各种设备的现代用户界面。

在本章中，我们将深入了解 CSS 如何引入 HTML、选择器如何定位元素、层叠与特异性如何裁决样式冲突，以及决定屏幕上一切元素排布的基石——**盒模型 (Box Model)**。

---

## 1. 将 CSS 引入 HTML 的三种方式

在 HTML 中引入 CSS 有三种常见方式。虽然它们都能改变样式，但在工程实践中其地位大不相同：

```html
<!-- 1. 内联样式 (Inline Styles) - 生产环境中应尽量避免 -->
<button style="background-color: #2563eb; color: #ffffff; padding: 8px 16px;">
  点击我
</button>

<!-- 2. 内部样式表 (Internal Stylesheet) - 适合独立原型或单文件演示 -->
<head>
  <style>
    .btn-primary {
      background-color: #2563eb;
      color: #ffffff;
      padding: 8px 16px;
    }
  </style>
</head>

<!-- 3. 外部样式表 (External Stylesheet) - 工业级开发的黄金标准 -->
<head>
  <link rel="stylesheet" href="styles.css" />
</head>
```

### 为什么外部样式表是行业标准？
- **关注点分离 (Separation of Concerns)**：HTML 专心定义内容和结构，CSS 专心负责视觉呈现。
- **可维护性与 DRY 原则 (Don't Repeat Yourself)**：只需在单个 `.css` 文件中修改一个主题色，即可同步更新成百上千个页面。
- **浏览器缓存机制 (Browser Caching)**：外部样式表下载后会被浏览器自动缓存，后续页面加载速度显著提升。

---

## 2. 选择器 (Selectors)：精准定位目标

一条 CSS 规则从 **选择器 (Selectors)** 开始，它用来选中 HTML 树中匹配的一个或多个元素：

```css
/* 元素选择器 (Element Selector)：选中所有 <h2> 标签 */
h2 {
  color: #1e293b;
  font-size: 1.5rem;
}

/* 类选择器 (Class Selector)：选中所有携带 class="badge" 的元素 */
.badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  background-color: #e2e8f0;
}

/* ID 选择器 (ID Selector)：选中唯一的 id="hero-banner" 元素 */
#hero-banner {
  background-image: linear-gradient(135deg, #6366f1, #a855f7);
  color: #ffffff;
}
```

### 组合器 (Combinators)：描述节点间的关系

当你想根据元素在 DOM 树中的层级或相邻关系应用样式时，可以使用组合器：

```css
/* 后代组合器 (Descendant Combinator, 空格)：<article> 内部的任意 <p> */
article p {
  line-height: 1.75;
}

/* 子代组合器 (Child Combinator, >)：<ul> 的直接子级 <li> */
ul > li {
  list-style-type: square;
}

/* 相邻兄弟组合器 (Adjacent Sibling Combinator, +)：紧随 <h2> 后面的那个 <p> */
h2 + p {
  margin-top: 0.5rem;
}

/* 通用兄弟组合器 (General Sibling Combinator, ~)：<h2> 之后同父级的所有 <p> */
h2 ~ p {
  color: #475569;
}
```

---

## 3. 层叠 (Cascade) 与特异度 (Specificity)

当多条 CSS 规则同时匹配同一个元素，且指定了冲突的属性时，浏览器该听谁的？浏览器会执行 **层叠算法 (Cascade Algorithm)** 来裁决胜负。

层叠裁决的核心依据包括：
1. **来源与重要性 (Origin & Importance)**：浏览器默认样式 vs 开发者样式 vs `!important`。
2. **特异度 (Specificity)**：选择器的精确权重。
3. **书写顺序 (Source Order)**：如果特异度完全一致，**后声明的规则**会覆盖先声明的规则。

### 特异度权重计算 (Specificity Hierarchy)

你可以把特异度看作一个四位数的计分板：`(内联样式, ID, 类/属性/伪类, 元素/伪元素)`。

| 选择器类型 | 示例 | 特异度计分 |
| :--- | :--- | :--- |
| **元素 / 伪元素 (Element / Pseudo-element)** | `p`, `::before` | `(0, 0, 0, 1)` |
| **类 / 属性 / 伪类 (Class / Attribute / Pseudo-class)** | `.card`, `[disabled]`, `:hover` | `(0, 0, 1, 0)` |
| **ID 选择器 (ID Selector)** | `#header` | `(0, 1, 0, 0)` |
| **内联样式 (Inline Style)** | `style="..."` | `(1, 0, 0, 0)` |

```css
/* 特异度：(0, 0, 0, 1) — 权重最低 */
p {
  color: gray;
}

/* 特异度：(0, 0, 1, 0) — 胜过元素选择器 */
.lead-text {
  color: blue;
}

/* 特异度：(0, 1, 1, 0) — 胜过单独的类选择器 */
#featured .lead-text {
  color: darkred;
}
```

> **老程序员心法**：尽量保持特异度扁平！多用单类名（如 `.card`、`.card-title`），少用深层嵌套和 ID。盲目提高特异度会导致后续不得不祭出 `!important`，引发恶性竞争，最终让样式变得脆弱不可维护。

---

## 4. 盒模型 (Box Model)：相框类比

在 CSS 的世界里，**每个 HTML 元素都是一个矩形盒子**。理解盒模型的尺寸计算，是搞懂页面布局的最关键一步。

想象一下美术馆墙上悬挂的一幅精美画作：

```
+-------------------------------------------------+
|               外边距 (MARGIN)                    |  <- 画框与墙壁上相邻画作之间的空隙
|  +-------------------------------------------+  |
|  |             边框 (BORDER)                 |  |  <- 真实的木质画框本身
|  |  +-------------------------------------+  |  |
|  |  |          内边距 (PADDING)            |  |  |  <- 画芯与画框之间的白色衬垫纸
|  |  |  +-------------------------------+  |  |  |
|  |  |  |                               |  |  |  |
|  |  |  |         内容区 (CONTENT)       |  |  |  |  <- 画作/照片本身的区域
|  |  |  |                               |  |  |  |
|  |  |  +-------------------------------+  |  |  |
|  |  +-------------------------------------+  |  |
|  +-------------------------------------------+  |
+-------------------------------------------------+
```

- **内容区 (Content)**：照片本身。放置文本、图片或视频的实际区域（由 `width` 和 `height` 控制）。
- **内边距 (Padding)**：衬垫纸。内容与边框之间的透明留白。内边距会吸收元素的 `background-color`。
- **边框 (Border)**：画框本身。包裹在内容和内边距外层的实线、虚线或边框线。
- **外边距 (Margin)**：画框外墙面的留白。用于隔开当前元素与相邻兄弟元素。外边距是完全透明的。

### 为什么现代开发必写 `box-sizing: border-box`？

在浏览器默认的盒模型模式（`content-box`）下，如果你给元素设置 `width: 300px`，这仅仅是 **内容区 (Content)** 的宽度。如果你接着加上 `padding: 20px` 和 `border: 5px`，该元素在屏幕上的实际总宽度会变成 `350px` (300 + 40 + 10)，极容易挤爆父容器导致布局崩溃！

而开启 `border-box` 之后，你设定的 `width` 将直接包含 Content + Padding + Border：

```css
/* 每个现代前端项目的必备重置样式 */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
```

这样一来，设定 `300px` 宽度的盒子在屏幕上就永远稳定是 `300px`，无论你后来加了多少内边距或边框。
