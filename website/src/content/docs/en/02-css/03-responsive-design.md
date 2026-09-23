---
title: 'Responsive Design'
description: 'Building for every screen size'
---

Users access the web from a dizzying spectrum of screens: a 390px smartphone, an 820px tablet, a 1440px laptop, or a 4K ultrawide monitor. **Responsive Web Design (RWD)** is the practice of crafting layouts that fluidly adapt to any screen size and orientation without duplicating code.

Here is how modern developers achieve true responsiveness.

---

## 1. The Starting Point: The Viewport Meta Tag

Before writing any responsive CSS, your HTML `<head>` must include this line:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

### Why It's Crucial
Early smartphones assumed web pages were designed for 980px desktop screens. By default, they render the page at 980px and zoom out, producing microscopic, unreadable text.

The `viewport` meta tag tells mobile browsers: *"Set the viewport width to the device's physical screen width, and keep the initial zoom ratio at 1:1."*

---

## 2. The Mobile-First Approach

In a mobile-first workflow, you write your default styles for the smallest screens first (single-column, touch-friendly tap targets, readable font sizes). Then, you use `@media (min-width: ...)` queries to layer on multi-column layouts as screen estate grows.

### Why Mobile-First Wins Over Desktop-First
- **Additive, Not Destructive**: With `min-width`, you add layout complexity as space permits. With `max-width` (desktop-first), you spend hours overriding and undoing complex desktop rules.
- **Performance**: Mobile devices receive the leanest baseline CSS by default.

---

## 3. Media Queries

Media queries inspect the client device's capabilities and screen dimensions:

```css
/* Base styles (Mobile default: 1 column) */
.card-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

/* Tablet (Screens 768px and wider: 2 columns) */
@media (min-width: 768px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

/* Desktop (Screens 1024px and wider: 3 columns) */
@media (min-width: 1024px) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
}
```

---

## 4. Modern Responsive CSS: Fluid & Modular

Modern CSS gives us tools that reduce or even eliminate the need for media queries.

### Fluid Typography with `clamp()`

Instead of stepping font sizes abruptly at media query breakpoints, `clamp(min, preferred, max)` scales typography fluidly according to the viewport width:

```css
h1 {
  /* Minimum: 1.75rem, Scales with viewport: 4vw, Maximum: 3.5rem */
  font-size: clamp(1.75rem, 4vw, 3.5rem);
}
```

### Container Queries: Component-Driven Responsiveness

Media queries check the **browser viewport**. But what if a card component is placed inside a narrow sidebar on desktop? A viewport media query will think it is on desktop and break the layout!

**Container Queries** fix this by letting an element respond to its **parent container's width**:

```css
/* 1. Define the parent as a container context */
.card-wrapper {
  container-type: inline-size;
}

/* 2. Style the child based on its container's size */
@container (min-width: 480px) {
  .card {
    display: flex;
    flex-direction: row;
  }
}
```

Now your components are truly modular and responsive anywhere they are placed.
