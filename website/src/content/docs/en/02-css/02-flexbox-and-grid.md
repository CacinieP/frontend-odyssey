---
title: 'Flexbox & Grid'
description: 'Modern layout systems'
---

Before 2012, building web layouts was an exercise in frustration. Developers relied on HTML tables, float hacks with "clearfixes", or absolute positioning. Today, CSS gives us two dedicated, native layout engines: **Flexbox** and **CSS Grid**.

Understanding both will transform how you build user interfaces.

---

## 1. Flexbox: One-Dimensional Layout

Flexbox (Flexible Box Layout) is designed to arrange items along **a single axis** — either horizontally across a row, or vertically down a column.

### Core Concepts

When you declare `display: flex;`, the parent element becomes a **flex container**, and its immediate children become **flex items**.

- **Main Axis**: The primary direction items flow, controlled by `flex-direction` (`row` by default, or `column`).
- **Cross Axis**: The perpendicular direction to the main axis.

```
flex-direction: row
Main Axis ------>
+-------------------------------------------------------+
|  +--------+       +--------+       +--------+         |
|  | Item 1 |       | Item 2 |       | Item 3 |         |  Cross Axis
|  +--------+       +--------+       +--------+         |      |
+-------------------------------------------------------+      v
```

### Essential Properties

- **`justify-content`**: Aligns items along the **main axis** (`flex-start`, `center`, `flex-end`, `space-between`, `space-around`, `space-evenly`).
- **`align-items`**: Aligns items along the **cross axis** (`stretch`, `center`, `flex-start`, `flex-end`).
- **`flex-wrap`**: By default, flex items squeeze onto one line (`nowrap`). Use `wrap` to let items wrap onto new lines when space runs out.
- **`gap`**: Sets uniform space between items without messy margin math (`gap: 1rem;`).

### Flex Items: Growing and Shrinking

On individual children, the `flex` shorthand controls flexibility:

```css
/* flex: <flex-grow> <flex-shrink> <flex-basis> */
.item-expand {
  flex: 1; /* Takes all remaining available space */
}
```

### Practical Example: Modern Navigation Bar

```html
<nav class="navbar">
  <div class="brand">Odyssey</div>
  <ul class="nav-links">
    <li><a href="#features">Features</a></li>
    <li><a href="#pricing">Pricing</a></li>
    <li><a href="#about">About</a></li>
  </ul>
  <button class="cta-button">Get Started</button>
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

## 2. CSS Grid: Two-Dimensional Layout

While Flexbox excels at linear ribbons of content, **CSS Grid** excels at full two-dimensional layouts, simultaneously controlling **rows and columns**.

### Core Concepts

- **`grid-template-columns` / `grid-template-rows`**: Define column widths and row heights.
- **`fr` (Fractional Unit)**: Represents a fraction of the remaining free space in the grid container.
- **`gap`**: Gutter between rows and columns (`gap: 20px` or `row-gap: 10px; column-gap: 20px;`).

### The Responsive Powerline: `minmax()` and `auto-fit`

You can build a fully responsive grid without writing a single media query:

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}
```

- **`auto-fit`**: Fits as many columns as possible into the container.
- **`minmax(250px, 1fr)`**: Each column must be at least `250px` wide, but can stretch up to `1fr` to fill leftover space.

### Template Areas: Expressive Semantic Layouts

You can name regions on your grid with `grid-template-areas`:

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

## 3. When to Use Which? (The Golden Rule)

| Consideration | Flexbox | CSS Grid |
| :--- | :--- | :--- |
| **Dimensions** | 1D (row *or* column) | 2D (rows *and* columns) |
| **Approach** | **Content-first**: Let content size items, then distribute them | **Layout-first**: Define strict columns/rows, then place items |
| **Best For** | Navbars, button rows, form controls, centering an item | Page shells, dashboards, image galleries, complex card matrices |

> **Pro Tip**: Flexbox and Grid are teammates, not rivals! Senior developers use **Grid for the macro layout** (page shell and major sections) and **Flexbox for micro layout** (aligning icons, badges, and labels inside individual components).
