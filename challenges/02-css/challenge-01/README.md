# CSS Challenge 01: Responsive Card Grid

Welcome to your first CSS layout challenge! In this exercise, you will put CSS Grid and Media Queries into practice by building a responsive card grid that looks great across mobile, tablet, and desktop devices.

---

## 🎯 Objective

Create a responsive card grid layout that automatically adjusts column count based on viewport width:
- **Mobile (default / mobile-first)**: **1 column**
- **Tablet (e.g., width &ge; 600px / 768px)**: **2 columns**
- **Desktop (e.g., width &ge; 992px / 1024px)**: **3 columns**

---

## 📁 Files Provided

- **`index.html`**: Contains the semantic HTML structure (3 cards inside `.card-grid`). Do not modify the HTML structure.
- **`start.css`**: The starter CSS file where you will write your solution.
- **`solution.css`**: A reference solution for comparison.
- **`test.js`**: Automated validation test suite.

---

## 📋 Requirements

1. **Use CSS Grid**: Target `.card-grid` and set its display mode to `display: grid`.
2. **Define Column Tracks**: Use `grid-template-columns` to configure the columns.
   - Base/Mobile: 1 column (e.g. `1fr`).
   - Tablet: 2 columns (e.g. `repeat(2, 1fr)` or `1fr 1fr`).
   - Desktop: 3 columns (e.g. `repeat(3, 1fr)` or `1fr 1fr 1fr`).
3. **Use Media Queries**: Use `@media` queries with `min-width` to progressively enhance from mobile to tablet and desktop.
4. **Spacing**: Include a clean gutter between cards using `gap` (e.g. `1rem` to `1.5rem`).

---

## 🧪 Testing Your Solution

Run the automated test runner in this directory:

```bash
# Test your start.css file:
npm test
# or
pnpm test
```

To test against the reference solution:
```bash
node test.js solution.css
```

Open `index.html` in your browser to inspect and preview your responsive layout as you resize the window!
