# Vanilla HTML example

A single-page demo of HDX Style covering utilities, components, responsive prefixes, dark mode, arbitrary values, the `important` variant, and negative/numeric modifiers.

## Run it

```bash
# from the repo root
node src/cli/index.js build -p -c examples/vanilla/hdx.config.js
# then open examples/vanilla/index.html in a browser
```

## What it shows

- Utility classes (`hdx-flex`, `hdx-grid-cols-*`, `hdx-p-*`, `hdx-rounded-*`, …)
- Components (`hdx-btn`, `hdx-input`, `hdx-textarea`, `hdx-label`, `hdx-badge-*`)
- Responsive prefixes (`hdx-sm_grid-cols-2`, `hdx-lg_grid-cols-3`, `hdx-sm_col-span-2`)
- Dark mode via `class="hdx-dark"` on `<html>`
- Arbitrary values (`hdx-w-[180px]`, `hdx-bg-[#6366F1]`)
- `hdx-important_*` overrides and negative utilities (`hdx--mt-2`)