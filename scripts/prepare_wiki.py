#!/usr/bin/env python3
"""
Generate GitHub Wiki pages from frontend-odyssey docs.
"""
from __future__ import annotations
import os
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOCS_DIR = ROOT / 'website' / 'src' / 'content' / 'docs'
ZH_DIR = DOCS_DIR / 'zh'
DEST = ROOT / '.wiki-docs'

CHAPTER_NAMES = {
    '01-html': '01-HTML',
    '02-css': '02-CSS',
    '03-javascript': '03-JavaScript',
    '04-typescript': '04-TypeScript',
    '05-react': '05-React',
    '06-engineering': '06-Engineering',
    '07-ai-agents': '07-AI-Agents',
    'guides': 'Guides',
}

CHAPTER_TITLES = {
    '01-HTML': 'I. HTML',
    '02-CSS': 'II. CSS',
    '03-JavaScript': 'III. JavaScript',
    '04-TypeScript': 'IV. TypeScript',
    '05-React': 'V. React & 现代化框架',
    '06-Engineering': 'VI. 前端工程化',
    '07-AI-Agents': 'VII. AI 时代与智能体',
    'Guides': '学习导引 (Guides)',
}


def clean_frontmatter(content: str) -> tuple[dict[str, str], str]:
    meta = {}
    body = content
    if content.startswith('---'):
        parts = content.split('---', 2)
        if len(parts) >= 3:
            raw_meta = parts[1]
            body = parts[2].lstrip()
            for line in raw_meta.splitlines():
                if ':' in line:
                    k, v = line.split(':', 1)
                    meta[k.strip()] = v.strip().strip("'\"")
    return meta, body


def main():
    if DEST.exists():
        shutil.rmtree(DEST)
    DEST.mkdir(parents=True)

    sidebar_sections: dict[str, list[tuple[str, str]]] = {
        'Guides': [],
        '01-HTML': [],
        '02-CSS': [],
        '03-JavaScript': [],
        '04-TypeScript': [],
        '05-React': [],
        '06-Engineering': [],
        '07-AI-Agents': [],
    }

    wiki_pages: list[tuple[str, str, str]] = []

    # Process all markdown files in zh directory
    for path in sorted(ZH_DIR.rglob('*.md')):
        rel = path.relative_to(ZH_DIR)
        chapter_dir = rel.parts[0]
        chapter_prefix = CHAPTER_NAMES.get(chapter_dir, chapter_dir)
        page_stem = rel.stem
        page_file_name = f"{chapter_prefix}--{page_stem}.md"

        content = path.read_text(encoding='utf-8')
        meta, body = clean_frontmatter(content)
        title = meta.get('title', page_stem)

        reading_url = f"https://caciniep.github.io/frontend-odyssey/zh/{rel.parent}/{rel.stem}/"
        header = (
            f"> 📖 [在线阅读版]({reading_url}) · "
            f"[💻 源码仓库](https://github.com/CacinieP/frontend-odyssey) · "
            f"[🏠 Wiki 首页](https://github.com/CacinieP/frontend-odyssey/wiki/Home)\n\n"
        )

        wiki_content = header + f"# {title}\n\n" + body
        (DEST / page_file_name).write_text(wiki_content, encoding='utf-8')

        sidebar_sections[chapter_prefix].append((title, f"{chapter_prefix}--{page_stem}"))
        wiki_pages.append((chapter_prefix, title, f"{chapter_prefix}--{page_stem}"))

    # Generate _Sidebar.md
    sidebar_lines = [
        "## 📖 学习导航\n",
        "- [🏠 Wiki 首页](Home)",
    ]

    for section, items in sidebar_sections.items():
        title = CHAPTER_TITLES.get(section, section)
        sidebar_lines.append(f"\n### {title}")
        for item_title, page_name in items:
            sidebar_lines.append(f"- [{item_title}]({page_name})")

    sidebar_lines.extend([
        "\n---",
        "- [🌐 在线文档 (GitHub Pages)](https://caciniep.github.io/frontend-odyssey/)",
        "- [💻 源码仓库 (GitHub)](https://github.com/CacinieP/frontend-odyssey)",
    ])
    (DEST / '_Sidebar.md').write_text('\n'.join(sidebar_lines) + '\n', encoding='utf-8')

    # Generate _Footer.md
    footer_text = (
        "---\n"
        "Frontend Odyssey 由 [CacinieP](https://github.com/CacinieP) 发起与维护，"
        "遵循 [MIT License](https://github.com/CacinieP/frontend-odyssey/blob/main/LICENSE) 开源。\n"
    )
    (DEST / '_Footer.md').write_text(footer_text, encoding='utf-8')

    # Generate Home.md
    home_content = f"""# 🚀 Frontend Odyssey Wiki

> 一场动手实践的双语前端进阶之旅：从 HTML/CSS/JS 到 TypeScript、React，再到 AI 智能体 (AI Agents) —— 为现代全栈 Web 工程打造。

- 🌐 **在线交互文档站 (GitHub Pages)**: [https://caciniep.github.io/frontend-odyssey/](https://caciniep.github.io/frontend-odyssey/)
- 💻 **GitHub 源码仓库**: [https://github.com/CacinieP/frontend-odyssey](https://github.com/CacinieP/frontend-odyssey)
- 📝 **许可证**: MIT Open Source License

---

## 🗺️ 课程学习目录

### 🧭 学习导引
- [项目导引与学习方法论](Guides--introduction)

### 01. HTML (网页的基石)
- [01. 什么是网页与 HTML](01-HTML--01-what-is-html)
- [02. 语义化标签实战](01-HTML--02-semantic-tags)
- [03. 表单与现代输入控件](01-HTML--03-forms-and-inputs)

### 02. CSS (视觉表现与布局艺术)
- [01. 盒模型与现代布局基础](02-CSS--01-css-basics)
- [02. Flexbox 与 Grid 实战](02-CSS--02-flexbox-and-grid)
- [03. 响应式设计与媒体查询](02-CSS--03-responsive-design)

### 03. JavaScript (交互、逻辑与运行时)
- [01. 现代 JS 核心机制与闭包](03-JavaScript--01-js-fundamentals)
- [02. DOM 交互与事件机制](03-JavaScript--02-dom-and-events)
- [03. 异步编程与模块化](03-JavaScript--03-async-and-modules)

### 04. TypeScript (类型系统与工业级可靠性)
- [01. TypeScript 核心类型与静态检查](04-TypeScript--01-ts-basics)
- [02. 接口、类型别名与面向对象设计](04-TypeScript--02-interfaces-and-types)
- [03. 泛型与高级类型体操](04-TypeScript--03-generics-and-utility-types)

### 05. React (组件化与现代状态驱动 UI)
- [01. React 核心心智模型与 JSX](05-React--01-react-fundamentals)
- [02. Hooks 深度剖析与状态驱动](05-React--02-hooks-and-state)
- [03. 现代全局状态管理与前端路由](05-React--03-state-management-and-routing)

### 06. 前端工程化 (构建、单体仓库与自动化流水线)
- [01. 现代 Monorepo 架构与 pnpm 工作区](06-Engineering--01-monorepo-and-pnpm)
- [02. 现代构建工具与 Vite 核心原理](06-Engineering--02-build-tools-and-vite)
- [03. CI/CD 流水线与自动化测试保障](06-Engineering--03-ci-cd-and-testing)

### 07. AI 时代与智能体 (LLM 前端交互与 MCP 生态)
- [01. 浏览器与 LLM 交互实战 (SSE/Streaming)](07-AI-Agents--01-browser-llm-integration)
- [02. 函数调用与模型上下文协议 (MCP)](07-AI-Agents--02-function-calling-and-mcp)
- [03. 自主智能体循环与检索增强生成 (Agent Loop & RAG)](07-AI-Agents--03-agent-loops-and-rag)

---

## ⚡ 本地开发与参与贡献

```bash
# 克隆仓库
git clone https://github.com/CacinieP/frontend-odyssey.git
cd frontend-odyssey

# 安装依赖
pnpm install

# 启动文档开发服务器
pnpm dev
```
"""
    (DEST / 'Home.md').write_text(home_content, encoding='utf-8')
    print(f"✅ Generated {len(list(DEST.glob('*.md')))} Wiki pages in {DEST}")


if __name__ == '__main__':
    main()
