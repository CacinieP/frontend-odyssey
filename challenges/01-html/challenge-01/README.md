# Challenge 01: Fix the Div Soup

## Objective

Fix the div soup: convert all generic `<div>` elements to appropriate semantic HTML tags.

## The Problem

Take a look at `start.html`. It describes a blog article with navigation, a sidebar, and footer information — but whoever built it used `<div>` elements for **everything**.

This creates what the web development world calls **"Div Soup"**:
- Screen readers cannot locate landmarks like navigation or main content.
- Search engine crawlers have to guess which part is the article and which part is the footer.
- Future maintainers have to dig through nested classes to understand page layout.

## Your Task

Open [`start.html`](file:///Users/caciniep/.gemini/antigravity/scratch/frontend-odyssey/challenges/01-html/challenge-01/start.html) and refactor the markup:

1. Replace the top banner `<div class="header">` with `<header>`.
2. Replace the navigation container `<div class="nav">` with `<nav>`.
3. Wrap the central content in `<main>`.
4. Replace `<div class="article">` with `<article>`.
5. Replace `<div class="sidebar">` with `<aside>`.
6. Replace `<div class="footer">` with `<footer>`.
7. Remember to update both opening and closing tags!

## Testing Your Solution

Run the automated test suite in this directory:

```bash
node test.js
# or
pnpm test
```

Initially, the tests will fail with a checklist of missing semantic elements. Once you've converted the elements properly, all tests will pass!

> [!TIP]
> If you get stuck or want to compare approaches, check out `solution.html`.
