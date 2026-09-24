---
title: 'Modern Monorepos & pnpm Workspaces in Practice'
description: 'Banishing phantom dependencies and disk waste: Enterprise multi-package workflows'
---

For small isolated projects, maintaining one Git repository per application (Polyrepo) is manageable. But when teams maintain documentation sites, design systems, client applications, and shared utilities simultaneously, the multi-repo model causes severe friction:
- **Version Fragmentation**: Updating a shared utility requires publishing to npm, followed by manual version bumps across multiple downstream repos.
- **Local Linking Fragility**: `npm link` often breaks due to conflicting module resolution semantics.
- **Configuration Sprawl**: Duplicating identical ESLint, Prettier, TypeScript, and CI setups across dozens of distinct repositories.

**A Monorepo co-locates multiple related packages within a single Git repository, solving synchronization overhead at the root.**

---

## 1. Why pnpm Is the Gold Standard for Monorepos

Early package managers (npm and Yarn v1) flattened dependencies via **Hoisting**. While hoisting bypassed Windows file path length limits, it introduced fatal architectural flaws:

1. **Phantom Dependencies**: If package A depends on package B, hoisting moves package B into top-level `node_modules`. Your code can import package B directly even if you never declared it in `package.json`! If package A removes package B in a patch release, your production build crashes without warning.
2. **Disk Space Inefficiency (NPM Doppelgängers)**: Every project duplicates thousands of identical dependency files, rapidly consuming dozens of gigabytes across your machine.

### pnpm's Breakthrough: Content-Addressable Storage & Symlinks

```text
Global Content-Addressable Store (~/.local/share/pnpm/store)
  └── Identical files exist exactly ONCE on physical storage across your whole system!
             │
             ├── [Hard Link] ──► projectA/node_modules/.pnpm/react@18.3.1/...
             └── [Hard Link] ──► projectB/node_modules/.pnpm/react@18.3.1/...
```

- **Non-Flat & Phantom-Proof**: Top-level `node_modules` only contains symlinks to packages declared explicitly in your `package.json`.
- **Blazing Fast Installation**: Packages are downloaded once over the network; subsequent projects hard-link directly from the global cache in milliseconds.

---

## 2. Configuring `pnpm-workspace.yaml`

In the root of this repository (`frontend-odyssey`), packages are declared using `pnpm-workspace.yaml`:

```yaml
packages:
  - 'website'           # Astro Starlight documentation site
  - 'examples/*'        # Runnable demo projects
  - 'examples/**/*'
  - 'challenges/*'      # Coding challenges with Vitest suites
  - 'challenges/**/*'
  - 'projects/*'        # Capstone applications
```

---

## 3. Cross-Package Referencing via `workspace:*`

Packages inside the monorepo reference siblings using the `workspace:` protocol, enabling instant live reloading during development while guaranteeing proper semantic version replacement upon publishing:

```json
{
  "name": "@frontend-odyssey/website",
  "dependencies": {
    "@frontend-odyssey/shared-ui": "workspace:*"
  }
}
```

- **Live Synchronization**: Modifications made inside `shared-ui` reflect immediately inside `website` without rebuilding or publishing npm packages.

---

## 4. Targeted Execution with `--filter`

Execute scripts precisely across sub-packages using the `--filter` (or `-F`) flag:

```bash
# 1. Start dev server only in website package
pnpm --filter website dev

# 2. Run unit tests across all challenge packages
pnpm --filter "./challenges/**" test

# 3. Recursively run linting across all workspace packages
pnpm -r run lint
```
