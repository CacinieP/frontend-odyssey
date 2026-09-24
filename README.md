# 🚀 Frontend Odyssey

> A hands-on, bilingual learning journey: from HTML/CSS/JS to TypeScript, React, and AI Agents — built for modern full-stack web engineering.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-%3E%3D9.0.0-orange.svg)](https://pnpm.io/)
[![CI](https://img.shields.io/badge/CI-GitHub_Actions-2088FF.svg)](https://github.com/CacinieP/frontend-odyssey/actions)
[![Docs](https://img.shields.io/badge/docs-Astro_Starlight-FF5D01.svg)](https://caciniep.github.io/frontend-odyssey/)

---

📖 **Language / 语言**: [English](./README.md) | [中文版 README](./README.zh.md)

---

## 🧭 About The Project

Frontend development moves fast. In just a few years, the landscape evolved from static HTML documents to dynamic single-page applications, rigid type safety with TypeScript, and now intelligent interfaces powered by browser-integrated AI agents.

Yet most learning resources fall into one of two traps:
1. **API Cheatsheets**: Teaching *how* a method works without explaining *why* it was invented or when to avoid it.
2. **Disconnected Demos**: Toy snippets that break the moment you face real-world build tools, monorepos, or state machines.

**Frontend Odyssey** takes a different approach. Think of it as a senior engineer mentoring you 1-on-1:
- **Why Before How**: Every chapter begins with the problem that engineers faced before a technology existed. You'll understand the friction that gave birth to CSS Grid, Promises, TypeScript types, React components, and AI agents.
- **Code-First & Runnable**: No pseudo-code or slides. Every concept lives in a runnable, self-contained project inside this repository.
- **Challenge-Driven**: Solidify your mental models with coding challenges that include automated tests — your job is to write the code that turns red tests green.
- **Bilingual by Design**: Fully documented in English and Chinese with consistent terminology and parallel structures.

---

## 🗺️ The Learning Path

The curriculum is structured around seven progressive milestones. Each chapter answers the natural question that arises after mastering the previous one:

| # | Chapter | Core Question | Focus & What You'll Build |
|:---:|:---|:---|:---|
| **01** | **HTML** | *"What is a webpage?"* | Semantic markup, accessibility (`a11y`), forms and client validation, SEO metadata, and clean document outlines. |
| **02** | **CSS** | *"How do I make it look good?"* | Box model fundamentals, Flexbox, CSS Grid, responsive media queries, fluid typography, transitions, and CSS variables. |
| **03** | **JavaScript** | *"How do I make it interactive?"* | Core language mechanics, DOM manipulation, closures, prototypes, event bubbling, asynchronous JavaScript (Promises, `async`/`await`), and the Event Loop. |
| **04** | **TypeScript** | *"How do I catch errors before they run?"* | Static type system, type inference, interfaces, union types, type narrowing, generics, utility types, and strict compiler configs. |
| **05** | **React** | *"How do I build real applications?"* | Component thinking, JSX, reactive state (`useState`, `useReducer`), side effects (`useEffect`), custom hooks, context, and client-side routing. |
| **06** | **Engineering** | *"How do I work like a professional team?"* | pnpm monorepos, lightning-fast builds with Vite, code quality (ESLint, Prettier), automated unit testing with Vitest, and GitHub Actions CI/CD pipelines. |
| **07** | **AI Agents** | *"How do I build intelligent applications?"* | Integrating LLM APIs in the browser, streaming responses, function calling / tool calling, Model Context Protocol (MCP), client-side RAG, and autonomous agent loops. |

---

## ⚡ Quick Start

### Prerequisites

Make sure you have modern Node.js and pnpm installed on your machine:

- **Node.js**: `>= 18.0.0` (LTS recommended)
- **pnpm**: `>= 9.0.0`

If you don't have pnpm installed yet, enable it using Node's Corepack:

```bash
corepack enable
```

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/CacinieP/frontend-odyssey.git
   cd frontend-odyssey
   ```

2. **Install all workspace dependencies**:
   ```bash
   pnpm install
   ```

3. **Start the documentation website**:
   ```bash
   pnpm dev
   ```

Open [http://localhost:4321](http://localhost:4321) in your browser to read the interactive documentation.

### Exploring Examples & Running Challenges

Every chapter includes standalone runnable examples and test-driven challenges:

```bash
# 1. Run an example project
cd examples/01-html/semantic-tags
pnpm dev

# 2. Run a coding challenge (tests will fail until you complete the solution!)
cd challenges/01-html/challenge-01
pnpm test

# 3. Check out a capstone project
cd projects/personal-portfolio
pnpm dev
```

---

## 📂 Project Structure

This repository is organized as a unified monorepo powered by `pnpm workspaces`:

```text
frontend-odyssey/
├── .github/
│   └── workflows/
│       ├── ci.yml               # Automated CI for linting and build checks
│       └── deploy.yml           # Automated deployment of docs to GitHub Pages
├── website/                     # Bilingual documentation site (Astro Starlight)
│   ├── astro.config.mjs         # Starlight configuration & sidebar setup
│   └── src/content/docs/
│       ├── en/                  # English documentation & tutorials
│       └── zh/                  # Chinese documentation & tutorials
├── examples/                    # Runnable, standalone code examples
│   ├── 01-html/                 # Semantic layouts, forms, multimedia
│   ├── 02-css/                  # Flexbox, Grid, responsive layouts
│   ├── 03-javascript/           # DOM manipulation, async/await, event loop
│   ├── 04-typescript/           # Type definitions, generics, type narrowing
│   ├── 05-react/                # Components, hooks, state patterns
│   ├── 06-engineering/          # Monorepo setup, Vite, linting, CI/CD
│   └── 07-ai-agents/            # LLM streaming, function calling, MCP, agents
├── challenges/                  # Test-driven coding challenges
│   ├── 01-html/
│   ├── 02-css/
│   └── 03-javascript/
├── projects/                    # Full-featured capstone projects
│   ├── personal-portfolio/      # Semantic, accessible developer portfolio
│   └── todo-app-vanilla/        # State-driven reactive vanilla JS app
├── package.json                 # Monorepo root scripts & configurations
├── pnpm-workspace.yaml          # pnpm workspace configuration
├── LICENSE                      # MIT Open Source License
└── README.md                    # English project README
```

---

## 🤝 How to Contribute

Contributions make the open-source community a fantastic place to learn, inspire, and create. Any contributions you make are **greatly appreciated**!

Whether you want to:
- Fix typos or improve explanations
- Translate or refine bilingual content
- Add new runnable examples or edge-case demos
- Submit new interactive coding challenges with Vitest tests

### Contribution Workflow

1. **Fork the Project** (`https://github.com/CacinieP/frontend-odyssey/fork`)
2. **Create your Feature Branch**:
   ```bash
   git checkout -b feature/new-react-example
   ```
3. **Make your changes & verify code quality**:
   ```bash
   pnpm lint
   pnpm test
   ```
4. **Commit your Changes**:
   ```bash
   git commit -m "feat(examples): add custom hook example for debouncing"
   ```
5. **Push to the Branch**:
   ```bash
   git push origin feature/new-react-example
   ```
6. **Open a Pull Request** describing what was added or improved.

Please review existing issues and discussions before opening major pull requests!

---

## 📄 License

This project is open-source software licensed under the **MIT License**.  
See the [LICENSE](./LICENSE) file for details.

---

<p align="center">
  Crafted with care for developers worldwide. Happy coding on your Frontend Odyssey! 🌟
</p>
