# 个人作品集项目 (HTML + CSS 毕业设计)

> [Frontend Odyssey](https://github.com/frontend-odyssey) **第一章 (HTML) 与 第二章 (CSS)** 的综合实战毕业设计 (Capstone Project)。

这是一个现代、响应式且完全兼顾无障碍访问的个人作品集网站，完全采用**纯原生 HTML5 与现代 CSS3** 手工构建——无需任何 JavaScript 框架、CSS 预处理器或第三方 UI 库。

[English](README.md) | [简体中文](README.zh.md)

---

## 🎯 本项目展示的核心技能

作为前端开发者，你最核心的立身之本是掌握 Web 平台本身的能力。本项目全面融合并展示了前两章所学的所有关键技术点：

1. **语义化 HTML 架构 (Semantic HTML Architecture)**：
   - 彻底告别无意义的“div 汤” (`div` soup)，使用具有明确结构语义的地标元素 (`<header>`、`<nav>`、`<main>`、`<section>`、`<article>`、`<aside>`、`<footer>`)。
   - 严谨的标题层级 (`<h1>` 到 `<h3>`)，方便搜索引擎和屏幕阅读器精确解析文档大纲。
   - 完善的原生联系表单，合理搭配 `<label>`、`<input>`、`<select>`、`<textarea>` 以及原生校验属性 (`required`、`type="email"`)。
   - 针对键盘与辅助技术优化的跳跃导航链接 (`.skip-link`) 与 `aria-label`。

2. **现代 CSS 布局系统 (Modern CSS Layout Systems)**：
   - **弹性盒子 (Flexbox)**：用于一维布局，例如吸顶导航栏、按钮操作栏以及卡片内部的内容垂直排列。
   - **网格布局 (CSS Grid)**：用于二维布局，例如利用 `repeat(auto-fit, minmax(320px, 1fr))` 实现的自适应项目卡片列表以及技能类别展示区。

3. **设计令牌与自定义属性 (CSS Custom Properties)**：
   - 在 `:root` 中统一声明颜色变量、排版比例、间距体系与圆角阴影。
   - 通过 `@media (prefers-color-scheme: dark)` 媒体查询原生支持深色模式 (Dark Mode)。

4. **移动端优先的响应式设计 (Mobile-First Responsive Design)**：
   - 优先编写移动端视口的基础样式，再通过媒体查询逐步增强平板 (`min-width: 640px` / `768px`) 与桌面大屏 (`min-width: 1024px`)。
   - 流式排版与优雅的内容断点。

5. **无障碍交互与微动画 (Accessibility & Micro-Interactions)**：
   - 全面支持键盘导航，配备清晰的键盘聚焦环 (`:focus-visible`)。
   - 平滑滚动 (`scroll-behavior: smooth`) 与锚点顶部边距修正 (`scroll-margin-top`)。
   - 尊重用户系统动画偏好设置 (`@media (prefers-reduced-motion: reduce)`)。
   - 卡片悬停提升、按钮按下反馈以及细致的光影过渡。

---

## 📂 项目目录结构

```text
personal-portfolio/
├── index.html       # 语义化 HTML5 入口文档
├── style.css        # 包含设计令牌、Grid、Flexbox 与媒体查询的纯 CSS 文件
├── package.json     # 项目配置与本地运行脚本
├── README.md        # 英文项目说明文档
└── README.zh.md     # 中文项目说明文档
```

---

## 🚀 快速启动

### 前置环境

需要安装 Node.js (v18+) 与 `pnpm` (或 `npm`/`npx`)。

### 本地运行

在本项目目录下执行：

```bash
# 在 monorepo 环境中使用 pnpm 启动
pnpm dev

# 或者直接通过 npx 启动静态服务
npx serve .
```

启动后在浏览器中打开提示的本地地址（通常为 [http://localhost:3000](http://localhost:3000)）。

另外，因为本项目是纯粹的静态网页，没有任何打包构建步骤，你也可以直接双击 `index.html` 在浏览器中打开，或者使用 VS Code 的 "Live Server" 插件预览。

---

## 💡 资深工程师的设计思考 (WHY before HOW)

### 1. 为什么优先使用语义化标签？
很多初学者喜欢通过 `<div>` 加类名来模拟所有组件。但浏览器和屏幕阅读器并不知道一个 `<div class="btn">` 是个按钮，除非你费时费力地补齐所有的 `role` 与 `tabindex`。
使用原生语义标签（如用 `<article>` 表示独立的项目展示卡片，用 `<aside>` 表示侧边统计数据），不仅使文档树结构对搜索引擎友好，也让无障碍辅助设备能够直接快速跳转，代码本身也更具可读性与可维护性。

### 2. Auto-Fit CSS Grid：告别繁琐的断点
传统做法是为每种屏幕宽度写很多 `@media` 规则来改 `width: 50%` 或 `width: 33.33%`。而在现代 CSS 中，我们只需要一行：

```css
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--space-8);
}
```

这句声明告诉浏览器：“只要单个项目卡片宽度不小于 320px，就在当前行尽可能塞入更多列；剩余的空间由所有列平均瓜分。”这是一种真正声明式的自适应布局 (Fluid Layout)。

### 3. 尊重用户的前庭感官偏好 (Reduced Motion)
微动效可以让界面更具质感，但对于容易产生前庭眩晕感的用户来说，页面晃动会造成不适。通过加入：

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

网站会自动检测并尊重操作系统的减弱动态效果设置，这正是专业前端工程师在细节上的严谨追求。

---

## 🛠️ 个性化改造建议

学完之后，不妨将这个页面改造为你真正的个人主页：
1. 修改 `style.css` 顶部的 `--primary-color` 与 `--accent-color`，定义你专属的品牌主色调。
2. 将三个项目卡片的内容替换为你自己正在构思或已经完成的开源项目。
3. 添加简历下载按钮：`<a href="resume.pdf" download>下载简历</a>`。
4. 将联系表单对接无服务器表单服务（例如 Formspree 或 Netlify Forms）来实现真实的邮件收取。

继续前进，在 [Frontend Odyssey](https://github.com/frontend-odyssey) 的学习旅程中探索更多精彩！
