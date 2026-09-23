---
title: 'CSS Basics'
description: 'Adding style to your HTML'
---

If HTML is the skeleton that gives a webpage its structure, **CSS (Cascading Style Sheets)** is the skin, clothing, and posture. Without CSS, every website would look like an unformatted academic paper from 1991. CSS transforms raw semantic markup into visually engaging, readable, and responsive user experiences.

In this chapter, we'll explore how CSS connects to HTML, how selectors identify targets, how the cascade resolves styling conflicts, and how the fundamental **Box Model** shapes everything you see on screen.

---

## 1. Connecting CSS to HTML

There are three ways to apply CSS to HTML documents. Each has its place, but one stands above the rest for professional development:

```html
<!-- 1. Inline Style (Avoid for production) -->
<button style="background-color: #2563eb; color: #ffffff; padding: 8px 16px;">
  Click me
</button>

<!-- 2. Internal Stylesheet (Good for isolated prototypes) -->
<head>
  <style>
    .btn-primary {
      background-color: #2563eb;
      color: #ffffff;
      padding: 8px 16px;
    }
  </style>
</head>

<!-- 3. External Stylesheet (The industry standard) -->
<head>
  <link rel="stylesheet" href="styles.css" />
</head>
```

### Why External Stylesheets Win
- **Separation of Concerns**: HTML handles content and meaning; CSS handles presentation.
- **Maintainability & DRY**: Changing a brand color in one `.css` file updates hundreds of pages instantly.
- **Browser Caching**: Once downloaded, browsers cache the external stylesheet. Subsequent page visits load significantly faster.

---

## 2. Selectors: Finding What to Style

A CSS rule begins with a **selector** that points to one or more elements in the HTML tree:

```css
/* Element Selector: Targets all <h2> elements */
h2 {
  color: #1e293b;
  font-size: 1.5rem;
}

/* Class Selector: Targets elements with class="badge" */
.badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  background-color: #e2e8f0;
}

/* ID Selector: Targets unique element with id="hero-banner" */
#hero-banner {
  background-image: linear-gradient(135deg, #6366f1, #a855f7);
  color: #ffffff;
}
```

### Combinators: Expressing Relationships

Combinators let you target elements based on how they sit relative to others in the DOM:

```css
/* Descendant Combinator (space): ANY <p> inside an <article> */
article p {
  line-height: 1.75;
}

/* Child Combinator (>): DIRECT child <li> of a <ul> */
ul > li {
  list-style-type: square;
}

/* Adjacent Sibling (+): The <p> immediately following an <h2> */
h2 + p {
  margin-top: 0.5rem;
}

/* General Sibling (~): All <p> elements that share a parent with <h2> and follow it */
h2 ~ p {
  color: #475569;
}
```

---

## 3. The Cascade & Specificity

What happens when multiple rules target the exact same element with conflicting properties? CSS resolves this using the **Cascade Algorithm**.

The cascade considers:
1. **Origin & Importance**: User agent defaults vs. author styles vs. `!important`.
2. **Specificity**: How precise the selector is.
3. **Source Order**: If specificity is identical, the **last rule declared** in the stylesheet wins.

### Specificity Hierarchy

Think of specificity as a four-column score: `(Inline, ID, Class, Element)`.

| Selector | Example | Specificity Score |
| :--- | :--- | :--- |
| **Element / Pseudo-element** | `p`, `::before` | `(0, 0, 0, 1)` |
| **Class / Attribute / Pseudo-class** | `.card`, `[disabled]`, `:hover` | `(0, 0, 1, 0)` |
| **ID Selector** | `#header` | `(0, 1, 0, 0)` |
| **Inline Style** | `style="..."` | `(1, 0, 0, 0)` |

```css
/* Specificity: (0, 0, 0, 1) — Lowest */
p {
  color: gray;
}

/* Specificity: (0, 0, 1, 0) — Wins over element selector */
.lead-text {
  color: blue;
}

/* Specificity: (0, 1, 1, 0) — Wins over class alone */
#featured .lead-text {
  color: darkred;
}
```

> **Senior Dev Advice**: Keep specificity low and flat! Rely on classes (`.card`, `.card__title`) rather than deep nesting or IDs. High specificity leads to `!important` wars that make CSS fragile and difficult to maintain.

---

## 4. The Box Model: The Picture Frame Analogy

In CSS, **every single element is a rectangular box**. Understanding how that box is calculated is crucial to mastering layout.

Picture a framed artwork hanging on a museum wall:

```
+-------------------------------------------------+
|                    MARGIN                       |  <- Wall space around the frame
|  +-------------------------------------------+  |
|  |                 BORDER                    |  |  <- The physical wooden frame
|  |  +-------------------------------------+  |  |
|  |  |              PADDING                |  |  |  <- The white mat board cushion
|  |  |  +-------------------------------+  |  |  |
|  |  |  |                               |  |  |  |
|  |  |  |            CONTENT            |  |  |  |  <- The photo/artwork itself
|  |  |  |                               |  |  |  |
|  |  |  +-------------------------------+  |  |  |
|  |  +-------------------------------------+  |  |
|  +-------------------------------------------+  |
+-------------------------------------------------+
```

- **Content**: The photograph. This contains your text, image, or video (`width` and `height`).
- **Padding**: The white mat board. Space between the content and the border. Padding absorbs the element's `background-color`.
- **Border**: The wooden frame wrapping around the padding and content.
- **Margin**: The empty wall space separating this frame from neighboring frames. Margins are transparent.

### The `box-sizing: border-box` Secret

By default (`box-sizing: content-box`), setting `width: 300px` sets *only* the Content width. Adding `padding: 20px` and `border: 5px` makes the visible element `350px` wide (300 + 40 + 10), often breaking layouts!

With `box-sizing: border-box`, `width` encompasses Content + Padding + Border:

```css
/* Add this to the top of every modern project */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
```

Now, a `300px` wide element stays exactly `300px` wide, no matter how much padding or border you add.
