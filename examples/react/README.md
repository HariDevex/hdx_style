# React (JSX) example

A `Button` component plus a dashboard page written in JSX, scanned directly by HDX Style's content scanner for demand-driven purging.

## Run it

```bash
# from the repo root
node src/cli/index.js build -p -c examples/react/hdx.config.js
```

`dist/hdx.css` now contains only the classes used in `App.jsx`. Mount the component in a React project (Vite, Next.js, CRA) and import the built CSS once:

```jsx
import "@haridevx/hdx-style/css"; // published package
import "./dist/hdx.css";          // local build
```

## What it shows

- Component class maps resolved statically (no template-literal interpolation, which the scanner cannot resolve)
- Drop-in components (`hdx-btn`, `hdx-card`, `hdx-badge-*`) combining with state variants (`hdx-active_scale-95`, `hdx-hover_*`)
- Form states (`hdx-focus_border-primary`, `hdx-invalid_border-danger`)
- Responsive grids (`hdx-sm_grid-cols-2`, `hdx-lg_grid-cols-4`)