# HDX Style — Layout Demo

A composed single-screen example that assembles pre-designed UI components into a
real layout — the way a library consumer actually uses them. Every component here
is also documented individually in the root [README](../../README.md#-components).

## What it shows

- `ui-header` + `ui-header-sticky`
- `ui-nav-tabs` / `ui-nav-tab` / `ui-nav-tab-active`
- `ui-search-box` + `ui-search-input`
- `ui-icon` (with `-xs`/`-sm`/`-lg`/`-spin` variants) as the sizing/color wrapper
  for inline SVGs
- `ui-notification-badge` positioned on an icon
- `ui-breadcrumb` / `-item` / `-separator` / `-current`
- `ui-grid-3col` content grid
- `ui-profile-card`
- `ui-notification-panel` with `ui-notification-item`(s) plus the
  `-unread` modifier
- `ui-pagination` / `-item` / `-item-active` / `-item-disabled`
- `ui-notification-dot` on a `hdx-relative` button
- `ui-nav-bottom` mobile tab bar with `ui-nav-bottom-item(-active)`
- `ui-footer`

## Build

```bash
node src/cli/index.js build -p -c examples/layout-demo/hdx.config.js
```

Then open `../../dist/hdx.css` + this page in a browser. The output is purged —
only the classes used above are generated.