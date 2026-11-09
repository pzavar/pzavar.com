# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static personal portfolio website for Parham Hajzavar, served at **pzavar.com**. Plain HTML/CSS/JS — no framework, no build step, no package manager, no tests. All dependencies (Tailwind CSS 2.2.19, Font Awesome 6.5.1, Google Fonts) load from CDNs at runtime.

## Running locally

There is nothing to build. Preview by opening `index.html` directly, or serve the directory so relative paths and CDN assets behave correctly:

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## Deployment

- **GitHub Pages** is the live host — `CNAME` pins the custom domain `pzavar.com`. Pushing to `main` deploys.
- `.replit` configures an alternate Replit static deployment (`entrypoint=index.html`, `publicDir=/`, `deploymentTarget=static`). Edits to one host don't affect the other.

## Page structure

Each page is a standalone, fully-formed HTML document (no templating/includes):

- `index.html` — the main single-page site. Sections linked by anchor: `#about`, `#experience`, `#projects`, `#education`, `#skills`, `#contact`. Project details live in `.project-modal` dialogs opened via `openModal()`.
- `essays.html` — index of essay cards linking to individual `essay-*.html` files.
- `essay-*.html` — one file per essay (e.g. `essay-microsoft-ai-strategy.html`).
- `content.html` — the Reading List page (book cards backed by images in `books/`).

Shared `style.css` and `script.js` are linked by every page. Images live at the repo root, in `books/`, and in `attached_assets/` (Replit-uploaded originals).

## Conventions that span multiple files

- **Navigation is duplicated, not shared.** Every page hardcodes the same header nav *and* a separate `#mobile-menu` block. When changing nav links, labels, or order, update **all** HTML files and **both** the desktop and mobile copies within each.
- **Adding an essay** requires three edits: create the `essay-*.html` file, add its card to `essays.html`, and add a `<url>` entry to `sitemap.xml`. Keep `robots.txt` (points at the sitemap) in mind for SEO-affecting changes.
- **Styling** is Tailwind utility classes inline in the HTML, plus a shared visual language defined once: gradient text/buttons use `.gradient-text` / `from-blue-400 to-indigo-500`, cards use `.card-hover`, the dark theme uses slate/blue tones. Reuse these rather than introducing new patterns.

## `script.js` behaviors

All wired up on `DOMContentLoaded`:

- **Videos are lazy-loaded** to keep first paint fast — the hero `video.mp4` is attached ~200ms after load; the education `video1.mp4` only when its section scrolls near (IntersectionObserver). Both `<video>` elements start with no `<source>`; the script injects it. `play()` rejections are swallowed (autoplay policies).
- **Modals** (`openModal`/`closeModal`) toggle `.active`/`.hidden`, lock body scroll, recompute scroll height for the content area, and close on Escape or backdrop click.
- Mobile menu toggle, book-card fade-in on scroll, and a scroll-driven parallax on the education video.
