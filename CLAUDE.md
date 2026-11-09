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

- `index.html` — the main single-page site. Sections linked by anchor: `#home`, `#about`, `#demo`, `#work` (case studies), `#experience`, `#projects`, `#certifications` (contains `#education`), `#skills`, `#contact`. Other pages link to these IDs, so keep them stable. Project details live in `.project-modal` dialogs opened via `openModal()`.
- `demos.html` — recorded solution demos (AeroWave Claims Concierge) with click-to-load video, architecture flow, and design decisions.
- `essays.html` — index of essay cards linking to individual `essay-*.html` files.
- `essay-*.html` — one file per essay (e.g. `essay-microsoft-ai-strategy.html`).
- `content.html` — the Reading List page (book cards backed by images in `books/`).

Shared `style.css` and `script.js` are linked by every page. Images live at the repo root, in `books/`, in `img/` (resized copies used by the homepage: headshot, case-study screenshots), and in `attached_assets/` (Replit-uploaded originals). `video.mp4`/`video1.mp4` are no longer referenced.

## Conventions that span multiple files

- **Navigation is duplicated, not shared.** Every page hardcodes the same header nav (About · Work · Demos · Experience · Writing · Reading List · Contact), a separate `#mobile-menu` block, and footer links. When changing nav links, labels, or order, update **all** HTML files and all three copies within each. `script.js` requires `#mobile-menu-button`, `#close-menu-button`, `#mobile-menu`, and a `header a.gradient-text` logo on every page.
- **Adding an essay** requires three edits: create the `essay-*.html` file, add its card to `essays.html`, and add a `<url>` entry to `sitemap.xml`. Keep `robots.txt` (points at the sitemap) in mind for SEO-affecting changes.
- **Styling** is Tailwind 2 utility classes inline in the HTML plus `style.css`. The homepage uses the "v2 design layer" at the bottom of `style.css`: CSS tokens on `:root` and components (`.wrap`, `.v2-section`, `.section-head`, `.eyebrow`, `.card`, `.chip`, `.btn-primary`/`.btn-ghost`, `.case`, `.role`, `.cred`). Fonts are Inter (text) and JetBrains Mono (eyebrows, stats), loaded on every page. Reuse these rather than introducing new patterns.
- **Content source of truth** is Parham's current resume: titles, bullets, and stats on the site should match it exactly. The site is role-neutral (solution engineering and implementation), so avoid "pivoting to pre-sales" language.

## `script.js` behaviors

All wired up on `DOMContentLoaded`:

- **Click-to-load video embeds**: a `<button class="video-facade" data-embed="URL">` is swapped for an `<iframe>` on click, so third-party players don't load until requested.
- **Modals** (`openModal`/`closeModal`) toggle `.active`/`.hidden`, lock body scroll, recompute scroll height for the content area, and close on Escape or backdrop click.
- Mobile menu toggle and book-card fade-in on scroll (Reading List).
