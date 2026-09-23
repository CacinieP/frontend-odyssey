---
title: 'What is HTML?'
description: 'Understanding the building blocks of the web'
---

When you open a browser and visit any website, the first thing your browser requests and downloads is an **HTML** document. But what actually is HTML?

Think of a webpage like a human body:
- **HTML** is the **skeleton** — it defines the structure, bones, and raw hierarchy.
- **CSS** is the **skin, clothes, and aesthetics** — it dictates how things look, colors, and layouts.
- **JavaScript** is the **muscular and nervous system** — it brings the page alive with interactivity and motion.

Without the skeleton, nothing else has anything to attach to.

## Markup, Not Programming

A common misconception among beginners is calling HTML a "programming language." 

> [!NOTE]
> **HTML is NOT a programming language — it is a markup language.**
> HTML stands for **HyperText Markup Language**. It does not have variables, loops, conditionals, or algorithms. Instead, it uses **tags** to annotate (or "mark up") plain text so browsers know how to structure and present the content.

## What Browsers Actually Do

Browsers are specialized rendering engines. When a browser receives an HTML file:
1. **Network request**: It fetches raw bytes over HTTP/HTTPS.
2. **Parsing & Tokenizing**: It converts bytes into characters, identifies tags (`<p>`, `<h1>`, `<div>`), and turns them into structural tokens.
3. **DOM Tree Construction**: It builds the **Document Object Model (DOM)** — an in-memory tree representation of the elements.
4. **Rendering**: Together with CSS, the browser calculates geometry (layout) and paints pixels onto your screen.

If your HTML structure is broken or malformed, the browser tries its best to guess your intent through "error tolerance," but this often causes unexpected layout bugs and performance hiccups.

## The Anatomy of an HTML Document

Every modern HTML document follows a strict, standardized foundation:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My First Webpage</title>
  </head>
  <body>
    <h1>Hello, World!</h1>
    <p>This is my first journey into the web.</p>
  </body>
</html>
```

Let's break down the essential pieces:

- `<!DOCTYPE html>`: Tells the browser to render the page in **standards mode** using modern HTML5 specifications rather than backwards-compatibility "quirks mode".
- `<html lang="en">`: The root element wrapping everything on the page. The `lang` attribute tells search engines and screen readers the document's primary language.
- `<head>`: The metadata brain of the document. None of the content inside `<head>` is painted directly to the viewport (except indirectly via `<title>`). It holds character encoding (`UTF-8`), responsive viewport settings, CSS links, and SEO metadata.
- `<body>`: Contains all visible content — headings, paragraphs, images, links, forms, and buttons.

## Your First HTML File

Creating a webpage requires no special software — just a text editor and a browser.

Save the snippet above as `index.html` on your computer and double-click to open it in Chrome, Firefox, or Safari. Congratulations! You've just served your first document to a web browser. Next, let's learn how to choose the right tags for the job: [Semantic HTML →](/frontend-odyssey/en/01-html/02-semantic-tags/).
