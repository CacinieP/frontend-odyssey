---
title: 'Flexbox 与 Grid'
description: '现代布局体系'
---

在 2012 年之前，网页布局曾是前端开发者的噩梦。我们被迫使用 HTML 表格排版、或者借助各种奇形怪状的浮动清除黑魔法（Clearfix hacks），以及僵硬的绝对定位。今天，现代 CSS 为我们提供了两套专为布局而生的强大引擎：**弹性布局 (Flexbox)** 与 **网格布局 (Grid)**。

彻底搞懂它们，将彻底改变你构建现代用户界面的思维方式。

---

## 1. 弹性布局 (Flexbox)：一维布局利器

弹性布局（Flexible Box Layout，简称 Flexbox）专门用于在 **单一维度（一维）** 上排列元素——要么水平横向排成一行，要么垂直纵向排成一列。

### 核心概念

当你为父元素指定 `display: flex;` 时，它就会变成一个 **弹性容器 (Flex Container)**，其所有的直接子元素则自动转变为 **弹性项目 (Flex Item)**。

- **主轴 (Main Axis)**：元素排列的主要方向，由 `flex-direction` 控制（默认为水平行 `row`，或可设为纵向列 `column`）。
- **交叉轴 (Cross Axis)**：与主轴垂直相交的辅轴方向。

```
flex-direction: row
主轴 (Main Axis) ------>
+-------------------------------------------------------+
|  +--------+       +--------+       +--------+         |
|  | 项目 1 |       | 项目 2 |       | 项目 3 |         |  交叉轴 (Cross Axis)
|  +--------+       +--------+       +--------+         |          |
+-------------------------------------------------------+          v
```

### 核心属性一览

- **`justify-content`**：沿 **主轴 (Main Axis)** 对齐项目（`flex-start`、`center`、`flex-end`、`space-between`、`space-around`、`space-evenly`）。
- **`align-items`**：沿 **交叉轴 (Cross Axis)** 对齐项目（`stretch`、`center`、`flex-start`、`flex-end`）。
- **`flex-wrap`**：默认情况下所有弹性项目会被挤在单行（`nowrap`）。开启 `wrap` 可让项目在空间不足时自动折行。
- **`gap`**：在项目之间创建均匀的间距，无需繁琐的负外边距技巧（例如 `gap: 1rem;`）。

### 弹性项目的伸缩控制

作用在子项目上的 `flex` 简写属性控制着元素的伸缩能力：

```css
/* flex: <flex-grow> <flex-shrink> <flex-basis> */
.item-expand {
  flex: 1; /* 自动吸收主轴上所有剩余可用空间 */
}
```

### 实战示例：现代导航栏

```html
<nav class="navbar">
  <div class="brand">Odyssey</div>
  <ul class="nav-links">
    <li><a href="#features">特性</a></li>
    <li><a href="#pricing">价格</a></li>
    <li><a href="#about">关于</a></li>
  </ul>
  <button class="cta-button">立即体验</button>
</nav>
```

```css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #0f172a;
  color: #ffffff;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 1.5rem;
  margin: 0;
  padding: 0;
}
```

---

## 2. 网格布局 (Grid)：二维布局中枢

如果说 Flexbox 擅长线性缎带式排列，那么 **网格布局 (Grid)** 则专注于 **同时掌控行与列的二维空间 (2D Layout)**。

### 核心概念

- **`grid-template-columns` / `grid-template-rows`**：显式定义列宽和行高网格轨道。
- **比例单位 (Fractional Unit, fr)**：代表网格容器内剩余可用空间的一份比例（例如 `1fr 2fr 1fr`）。
- **`gap`**：行与列之间的间距（如 `gap: 20px` 或 `row-gap: 10px; column-gap: 20px;`）。

### 响应式神器：`minmax()` 与 `auto-fit`

无需编写一行媒体查询，即可打造完美自适应的响应式卡片网格：

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}
```

- **自适应适配 (auto-fit)**：让容器尽可能多地容纳列，并自动拉伸填满可用空间。
- **`minmax(250px, 1fr)`**：每列最小宽度不低于 `250px`，若空间充裕则自动均分扩大到 `1fr`。

### 具名网格区域 (Template Areas)：所见即所得的语义化排版

你可以使用 `grid-template-areas` 为网格划分具名区域，代码可读性极高：

```css
.dashboard {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: 60px 1fr 50px;
  grid-template-areas:
    "header  header"
    "sidebar main"
    "footer  footer";
  height: 100vh;
  gap: 1rem;
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }
```

---

## 3. 该选哪一个？（黄金法则）

| 维度对比 | 弹性布局 (Flexbox) | 网格布局 (Grid) |
| :--- | :--- | :--- |
| **空间维度** | 一维（行 *或* 列） | 二维（行 *与* 列兼顾） |
| **设计思维** | **内容驱动 (Content-first)**：先有内容大小，再由弹性容器分配对齐 | **布局驱动 (Layout-first)**：先规划严密的网格架构，再将内容填入格子 |
| **适用场景** | 导航栏、按钮组、表单项、垂直水平居中单个元素 | 页面整体框架、后台仪表板、图片瀑布流、复杂矩阵 |

> **高手进阶策略**：Flexbox 与 Grid 绝非非此即彼的竞争对手，而是珠联璧合的搭档！在实际工程中，资深工程师通常用 **Grid 负责宏观页面骨架 (Macro Layout)**，而在每个网格单元内部，用 **Flexbox 负责微观组件对齐 (Micro Layout)**（如按钮内部的图标与文案对齐）。
