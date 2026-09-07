# Vue (SFC) example

A Vue single-file component (`App.vue`) demonstrating HDX Style components, a live dark-mode toggle, and the scanner's Vue support.

## Run it

```bash
# from the repo root
node src/cli/index.js build -p -c examples/vue/hdx.config.js
```

`dist/hdx.css` now contains only the classes used in `App.vue`. Mount it in a Vite Vue project and import the built CSS once:

```js
import "@haridevx/hdx-style/css"; // published package
import "./dist/hdx.css";          // local build
```

## What it shows

- Vue template + script scanning (`<template>`, `:class`, string literals in `<script setup>`)
- Components with hover state rows (`hdx_table`, `hdx_alert-*`, `hdx_badge-*`)
- A live dark-mode toggle driven by a ref (`:class="dark ? 'hdx_dark' : ''"`)
- Responsive reflow (`hdx_flex-col hdx_md_flex-row`) and arbitrary values (`hdx_w-[180px]`, `hdx_rounded-[14px]`)