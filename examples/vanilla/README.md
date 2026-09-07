# Vanilla HTML example

A single-page demo of HDX Style covering utilities, components, responsive prefixes, dark mode, arbitrary values, the `important` variant, and negative/numeric modifiers.

## Run it

```bash
# from the repo root
node src/cli/index.js build -p -c examples/vanilla/hdx.config.js
# then open examples/vanilla/index.html in a browser
```

## What it shows

- Utility classes (`hdx_flex`, `hdx_grid-cols-*`, `hdx_p-*`, `hdx_rounded-*`, …)
- Components (`hdx_btn`, `hdx_input`, `hdx_textarea`, `hdx_label`, `hdx_badge-*`)
- Responsive prefixes (`hdx_sm_grid-cols-2`, `hdx_lg_grid-cols-3`, `hdx_sm_col-span-2`)
- Dark mode via `class="hdx_dark"` on `<html>`
- Arbitrary values (`hdx_w-[180px]`, `hdx_bg-[#6366F1]`)
- `hdx_important_*` overrides and negative utilities (`hdx_-mt-2`)