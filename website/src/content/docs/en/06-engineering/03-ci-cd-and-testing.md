---
title: 'Code Quality Guardians: Automated Testing & GitHub Actions CI/CD'
description: 'Building defense-in-depth: from static linting and Vitest suites to cloud continuous delivery'
---

The hallmark of professional software engineering over hobby projects is **automated quality verification**.

If an engineering team relies on manual QA checks before every release, regression bugs are inevitable. Modern frontend workflows weave **Static Analysis (Linting)**, **Formatting**, **Unit Testing**, and **CI/CD** into an unbroken chain that stops defects before they reach production.

---

## 1. Static Defense: The Division Between ESLint and Prettier

Many developers confuse ESLint and Prettier. Keep this clear distinction in mind:
- **Prettier Controls Formatting**: Line width, quotes, trailing commas, indentation. Formatting should be completely automated by tooling to eliminate stylistic debates.
- **ESLint Enforces Code Quality**: Unused variables, hook dependency rules, memory leaks, and anti-patterns.

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100
}
```

---

## 2. Next-Gen Unit Testing: Vitest

Historically, Jest was the industry standard, but running TypeScript and ESM through Jest required heavy Babel/ts-jest configurations and suffered from sluggish runtimes.

**Vitest** is built natively on top of Vite, sharing identical configuration, transform pipelines, and resolution algorithms:

```typescript
// utils.test.ts - Unit testing with Vitest
import { describe, it, expect } from 'vitest';

export function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timer: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

describe('debounce utility', () => {
  it('should coalesce rapid calls into a single invocation', async () => {
    let callCount = 0;
    const debouncedFn = debounce(() => callCount++, 50);

    debouncedFn();
    debouncedFn();
    debouncedFn();

    expect(callCount).toBe(0); // Not executed yet during debounce window

    await new Promise((r) => setTimeout(r, 60));
    expect(callCount).toBe(1); // Successfully invoked once!
  });
});
```

---

## 3. GitHub Actions: Cloud Continuous Integration

In this repository, every Pull Request and commit pushed to `main` automatically triggers automated verification inside isolated Ubuntu runners:

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch:

jobs:
  build:
    name: Build & Verify
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - run: pnpm install --no-frozen-lockfile
      - run: pnpm test:solutions
      - run: pnpm --filter @frontend-odyssey/website build
```

---

## 4. Continuous Deployment (CD): Pushing to GitHub Pages

Once CI validation succeeds on `main`, `deploy.yml` takes over:
1. Executes Astro to build the production output with search indexes.
2. Invokes `actions/upload-pages-artifact` to package `dist/`.
3. Invokes `actions/deploy-pages` to deploy the artifact across GitHub's global edge network at `https://caciniep.github.io/frontend-odyssey/`.

**The entire deployment lifecycle operates with zero manual overhead, achieving continuous delivery.**
