# codeutil — frontend

A React + Vite client for the CodeUtil backend: register, log in, upload a `.py` codebase
for indexing (FAISS + BM25), ask it questions, and generate a graded viva.

## Stack

- React 19 + Vite, plain CSS (no UI framework) — kept deliberately lightweight
- No router: the six views are simple state-driven panels, matching the single-tab
  session model of the backend (token lives in memory only, never in storage)

## Getting started

```bash
npm install
npm run dev
```

The dev server runs on `http://localhost:5173` by default. Set the backend address from
the **api base** field in the top bar — it defaults to `http://localhost:8000` and is
sent with every request; nothing is hardcoded.

## Build

```bash
npm run build   # outputs to dist/
npm run preview # serve the production build locally
```

## Project structure

```
src/
  api/client.js          fetch wrapper for every backend route
  context/AppContext.jsx in-memory auth token + api client, shared via context
  components/            Panel (window chrome), Sidebar, TopBar, Footer,
                          IndexVisualizer (the chunk-grid signature element)
  views/                 Signup, Login, Upload, Ask, Viva, Status — one file each
  styles/                tokens.css (design system), global.css, ui.css (shared primitives)
```

## Design notes

The visual language treats the app like a terminal/IDE: each panel's header shows the
literal HTTP call it makes (`POST /codebase/ask`, etc.) so the UI stays legible about
what it's actually doing. The recurring grid motif in `IndexVisualizer` is a direct
stand-in for the real pipeline — each cell is a chunk moving through parse → embed →
index — and reappears in reduced form on the status view to represent the live index
size.

Auth token is held in memory (React state) only, by design — refreshing the page signs
you out, mirroring the original single-tab session behavior.
