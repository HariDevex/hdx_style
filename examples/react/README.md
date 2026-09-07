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
- Drop-in components (`hdx_btn`, `hdx_card`, `hdx_badge-*`) combining with state variants (`hdx_active_scale-95`, `hdx_hover_*`)
- Form states (`hdx_focus_border-primary`, `hdx_invalid_border-danger`)
- Responsive grids (`hdx_sm_grid-cols-2`, `hdx_lg_grid-cols-4`)