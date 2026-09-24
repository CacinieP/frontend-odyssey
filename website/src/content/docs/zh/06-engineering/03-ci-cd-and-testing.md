---
title: '代码质量守门员：自动化测试与 GitHub Actions CI/CD'
description: '构建从本地静态检查、Vitest 单元测试到云端全自动持续集成的防御工事'
---

专业软件工程与“玩具项目”最大的区别，在于**质量保障的自动化程度**。

如果一个团队依赖人工在合并代码前手动“点一遍所有页面”，那么引入回归 Bug 只是时间问题。现代化前端工程通过将**静态代码检查 (Linting)**、**格式化 (Formatting)**、**单元测试 (Unit Testing)** 与 **持续集成/持续部署 (CI/CD)** 串联成一条自动化流水线，在代码合入主干前彻底拦截所有潜在缺陷。

---

## 1. 静态代码卫士：ESLint 与 Prettier 的分工

很多人混淆 ESLint 与 Prettier 的定位，记住以下核心法则：
- **Prettier 管“长相”（格式 Code Formatting）**：最大行宽、单双引号、尾随逗号、缩进空格。格式问题由机器全自动格式化，团队内部不再有代码风格口水战。
- **ESLint 管“品质”（代码质量 Code Quality）**：检测未使用的变量、禁止在循环中调用 Hook、防范可能的逻辑空指针与类型隐患。

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

## 2. 现代极速单元测试：Vitest

在过去，Jest 是测试标准，但它在处理 TypeScript 和 ESM 时需要大量 Babel/ts-jest 繁琐转换，执行缓慢。

**Vitest** 是由 Vite 团队打造的新一代测试框架，与 Vite 共享完全相同的配置文件、转换插件与模块解析策略：

```typescript
// utils.test.ts - 使用 Vitest 编写测试
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

    expect(callCount).toBe(0); // 延迟未到，尚未执行

    await new Promise((r) => setTimeout(r, 60));
    expect(callCount).toBe(1); // 仅执行最后一次，防抖成功！
  });
});
```

---

## 3. GitHub Actions：云端持续集成与自动化流水线

在本仓库中，每一次向 `main` 分支发起 Pull Request 或提交代码，GitHub Actions 都会在干净的 Ubuntu 容器中全自动拉起验证：

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

## 4. 持续部署 (CD)：自动上线 GitHub Pages

当 CI 验证通过且代码合入 `main` 后，`deploy.yml` 自动接管：
1. 调用 Astro 构建出包含完整搜索索引的生产静态产物 `dist`。
2. 调用官方安全认证的 `actions/upload-pages-artifact` 上传产物。
3. 调用 `actions/deploy-pages` 部署到全球 CDN 节点 `https://caciniep.github.io/frontend-odyssey/`。

**整个流程无需任何人工手动介入，实现了真正的持续交付（Continuous Delivery）。**
