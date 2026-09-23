---
title: '什么是 HTML？'
description: '理解构建 Web 的基石'
---

当你在浏览器中打开任何一个网站时，浏览器最先请求并下载的就是一份 **HTML** 文档。但 HTML 究竟是什么？

我们可以把网页比作一个人的身体：
- **HTML** 是**骨骼 (Skeleton)** —— 它定义了页面的结构、骨架与最根本的层级关系。
- **CSS** 是**皮肤与服饰 (Skin & Clothes)** —— 它决定了视觉外观、颜色搭配与排版布局。
- **JavaScript** 是**肌肉与神经系统 (Muscular & Nervous System)** —— 它通过交互和动效让网页真正“活”过来。

没有骨骼，其他一切元素都无处依附。

## 标记语言，而非编程语言

初学者常犯的一个误区，是把 HTML 称为“编程语言”。

> [!NOTE]
> **HTML 不是编程语言，而是一种标记语言 (Markup Language)。**
> HTML 的全称是**超文本标记语言 (HyperText Markup Language)**。它没有变量、循环、条件分支或算法逻辑。相反，它使用**标签 (Tags)**来标注（即“标记”）纯文本，从而告诉浏览器该如何组织并呈现这些内容。

## 浏览器究竟在做什么？

浏览器本质上是高度复杂的**渲染引擎 (Rendering Engine)**。当浏览器接收到一个 HTML 文件时：
1. **网络请求 (Network Request)**：通过 HTTP/HTTPS 协议拉取原始字节流。
2. **解析与词法分析 (Parsing & Tokenizing)**：将字节转换为字符，识别标签（如 `<p>`、`<h1>`、`<div>`），并解析为结构化的 Token。
3. **DOM 树构建 (DOM Tree Construction)**：在内存中建立**文档对象模型 (Document Object Model / DOM)** 树形结构。
4. **页面渲染 (Rendering)**：结合 CSS 计算每个元素的几何位置（布局 Layout），并将像素真正绘制 (Painting) 到屏幕上。

如果你的 HTML 结构不规范或标签未闭合，浏览器虽然会尽最大努力进行“容错纠错 (Error Tolerance)”，但这往往会导致意料之外的布局 Bug 和性能损耗。

## HTML 文档的基本结构

每一个现代 HTML 文档都遵循严格的标准模板：

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>我的第一个网页</title>
  </head>
  <body>
    <h1>你好，世界！</h1>
    <p>这是我开启 Web 开发之旅的第一步。</p>
  </body>
</html>
```

我们来逐一拆解这些核心元素：

- `<!DOCTYPE html>`：文档类型声明，告诉浏览器以符合现代 HTML5 规范的**标准模式 (Standards Mode)**来渲染页面，避免退回兼容旧浏览器的怪异模式 (Quirks Mode)。
- `<html lang="zh-CN">`：包裹整个页面所有内容的**根元素 (Root Element)**。`lang` 属性告知搜索引擎和屏幕阅读器当前文档的主语言。
- `<head>`：文档的**元数据容器 (Metadata Container)**。`<head>` 内的内容不会直接绘制在视口内（除 `<title>` 显示在浏览器标签页外）。它声明字符编码 (`UTF-8`)、响应式视口配置 (Viewport)、CSS 样式表链接以及 SEO 元信息。
- `<body>`：包含用户能在屏幕上看到的所有可视内容 —— 标题、段落、图片、链接、表单与按钮。

## 你的第一个 HTML 文件

构建一个网页不需要任何花哨的软件 —— 只要一个文本编辑器和一个浏览器即可。

将上面的代码保存为电脑上的 `index.html`，双击在 Chrome、Firefox 或 Safari 中打开。恭喜你！你已经向浏览器成功交付了你的第一份网页文档。

接下来，我们将学习如何挑选恰当的标签：[语义化 HTML →](/frontend-odyssey/zh/01-html/02-semantic-tags/)。
