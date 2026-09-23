# Personal Portfolio (HTML + CSS Capstone)

> Capstone project for **Chapters I (HTML) & II (CSS)** of the [Frontend Odyssey](https://github.com/frontend-odyssey) learning journey.

A modern, responsive, and fully accessible personal portfolio handcrafted with **pure HTML5 and modern CSS3** — without relying on JavaScript frameworks, CSS preprocessors, or external layout libraries.

[English](README.md) | [简体中文](README.zh.md)

---

## 🎯 What This Project Demonstrates

As a frontend developer, your superpower is mastering the foundational platform: the browser. This project puts into practice everything covered in Chapters I and II:

1. **Semantic HTML Architecture**:
   - Meaningful landmarks (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`) instead of generic `<div>` soup.
   - Logical heading hierarchy (`<h1>` through `<h3>`) for search engines and assistive screen readers.
   - Fully accessible contact form using `<label>`, `<input>`, `<select>`, `<textarea>`, and native validation attributes (`required`, `type="email"`).
   - Accessibility features like an accessible skip link (`.skip-link`) and ARIA labels.

2. **Modern CSS Layout Systems**:
   - **Flexbox**: Used for 1-dimensional layouts such as the sticky navigation bar, button groups, and card contents.
   - **CSS Grid**: Used for 2-dimensional layouts such as the auto-fitting responsive projects showcase (`repeat(auto-fit, minmax(320px, 1fr))`) and the skills grid.

3. **Design Tokens & CSS Custom Properties**:
   - Centralized palette, typography scale, spacing units, and border-radii defined on `:root`.
   - Built-in dark mode support via the `@media (prefers-color-scheme: dark)` media query.

4. **Mobile-First Responsive Design**:
   - Base styles designed for mobile viewports first, then progressively enhanced for tablets (`min-width: 640px` / `768px`) and desktops (`min-width: 1024px`).
   - Fluid typography and responsive media queries.

5. **Accessibility & Micro-Interactions**:
   - Keyboard navigation support with visible focus outlines (`:focus-visible`).
   - Smooth scrolling (`scroll-behavior: smooth`) paired with `scroll-margin-top` for clean section jumping.
   - Respect for user preferences through `@media (prefers-reduced-motion: reduce)`.
   - Subtle hover and active micro-interactions on cards, links, and buttons.

---

## 📂 Project Structure

```text
personal-portfolio/
├── index.html       # Semantic HTML5 document
├── style.css        # Pure CSS with design tokens, Grid, Flexbox, & Media Queries
├── package.json     # Project metadata and local dev script
├── README.md        # English project documentation
└── README.zh.md     # Chinese project documentation
```

---

## 🚀 Getting Started

### Prerequisites

Node.js (v18+) and `pnpm` (or `npm`/`npx`).

### Running Locally

From the project directory:

```bash
# Using pnpm (within the monorepo)
pnpm dev

# Or directly with npx
npx serve .
```

Open [http://localhost:3000](http://localhost:3000) (or the port indicated by serve) in your browser.

Alternatively, since this project requires no build step, you can simply open `index.html` directly in your web browser or use VS Code's "Live Server" extension.

---

## 💡 Key Architectural Decisions

### 1. Why HTML Semantics Matter First
A common beginner mistake is styling `<div>` and `<span>` elements to look like buttons and sections. Screen readers and search engine crawlers rely on semantic tags to interpret your content. Using `<article>` for self-contained project cards and `<aside>` for secondary stats ensures that the document tree communicates meaning inherently, even without CSS.

### 2. Auto-Fit CSS Grid for Zero-Breakpoint Cards
Instead of writing explicit media queries for every screen width, the projects section uses:

```css
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--space-8);
}
```

This declarative rule tells the browser: *"Create as many columns as will fit, as long as each column is at least 320px wide, and distribute remaining space equally."*

### 3. Accessible Motion and Preferences
Animations and transitions bring interfaces to life, but they can trigger vestibular disorders for sensitive users. By including a `prefers-reduced-motion` block:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

we respect the user's operating system preferences automatically.

---

## 🛠️ Customization Ideas

Ready to personalize this portfolio for yourself? Try:
1. Swapping `--primary-color` and `--accent-color` in `style.css` to match your personal brand.
2. Replacing the project cards with your own real-world creations.
3. Adding a downloadable PDF resume link using `<a href="resume.pdf" download>`.
4. Connecting the contact form to a serverless form provider like Formspree or Netlify Forms.

Happy coding! Keep building on your [Frontend Odyssey](https://github.com/frontend-odyssey).
