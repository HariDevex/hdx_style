# HDX Style — Examples

Run any example by building its stylesheet from the repo root, then opening it in a browser (or mounting it in the matching framework's dev server):

| Example | Folder | Build command |
|---|---|---|
| Vanilla HTML | [`vanilla/`](./vanilla/) | `node src/cli/index.js build -p -c examples/vanilla/hdx.config.js` |
| React (JSX) | [`react/`](./react/) | `node src/cli/index.js build -p -c examples/react/hdx.config.js` |
| Vue (SFC) | [`vue/`](./vue/) | `node src/cli/index.js build -p -c examples/vue/hdx.config.js` |
| Layout demo | [`layout-demo/`](./layout-demo/) | `node src/cli/index.js build -p -c examples/layout-demo/hdx.config.js` |

Each folder carries its own `hdx.config.js` scoped to its own content files, demonstrating demand-driven purging for that file type:

| Example | Scanned content |
|---|---|
| Vanilla | `examples/vanilla/**/*.html` |
| React | `examples/react/**/*.{html,jsx,tsx}` |
| Vue | `examples/vue/**/*.{vue,html}` |
| Layout demo | `examples/layout-demo/**/*.html` |

The build output always lands in `dist/hdx.css` at the repo root.