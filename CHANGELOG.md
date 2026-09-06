# Changelog

All notable changes to HDX Style are documented in this file.

## [0.2.0] — 2026-09-06

### Fixed
- **col-span-N / row-span-N emitted a start-pinned `N / span N`** instead of
  the Tailwind/reference `span N / span N`. The old form anchored the grid
  item at column N, reversing visual card order (right/left dashboards) and
  creating a phantom 5th column on 4-col layouts whenever a card used
  `col-span-1` next to `col-span-3`. Both are now emitted span-first with no
  implicit line pinning; `-full` still spans the whole grid (`1 / -1`). A
  regression test asserts no emitted rule ever contains the pinning form.
- **Variant prefixes were hardcoded**, so a custom breakpoint (e.g. `xs`) or
  a plugin `addVariant()` name could never be parsed from a class name and
  silently generated nothing. The parser now derives prefixes from the
  resolved config (`theme.breakpoints` + built-in variants) via
  `getVariantPrefixes()`, threaded through `parseClass`,
  `mapUtilitiesToVariants`, `purgeUnused`, and `findUnknownClasses`.
- **`watch` could not purge.** `hdx_style watch` now content-scans and
  generates only the used utilities (the same path as `build -p`), dropping
  a full `utility × variant` matrix (hundreds of KB — 25 MB in the audit) to
  a purged stylesheet. Add `--no-purge` to opt out.
- **Version bumped to 0.2.0** (0.1.1's rewrite was never published as such).

### Added
- `config.components: false` opt-out for the built-in component layer, so
  projects that carry their own component CSS (or later-occurring overrides)
  are not shipped an unpurged duplicate of every built-in component on every
  build.
- `min-h-screen`, `min-h-full`, `min-w-*` keyword utilities (used across the
  docs and examples but previously missing).
- `hdx_group` / `hdx_peer` are now recognized as bare ancestor-marker classes
  (activators for `group-hover` / `peer-hover`), not reported as unknown.
- `findUnknownClasses` now treats component-class names (`.hdx_btn`, …) and
  standalone variant markers (`hdx_dark`, `hdx_group`, `hdx_peer`) as known,
  eliminating false "unknown utility" warnings on real apps and examples.

### Fixed
- **`examples/vanilla` did not work** — three blockers removed:
  - The stylesheet link pointed at the old package name
    (`./node_modules/@haridevx/hdx-css/…`) with no local build; it now
    references the repo build at `../../dist/hdx.css` with a build note.
  - Responsive classes used Tailwind colon syntax (`md:hdx_grid-cols-2`,
    `lg:hdx_grid-cols-3`, `md:hdx_col-span-2`), which the HDX parser and
    scanner never match — they silently did nothing. Converted to the HDX
    underscore form (`hdx_sm_grid-cols-2`, `hdx_lg_grid-cols-3`,
    `hdx_sm_col-span-2`) so the grid actually reflows at each breakpoint.
  - Replaced non-existent utilities `hdx_bg-outline` / `hdx_bg-ghost` with
    valid ones (`hdx_bg-surface` / transparent default).

### Changed
- Shared purge/generation logic between `build -p` and `watch` lives in
  `src/scanner/scan.js` (`generatePurgedBuildCss`).
- **`build` now purges by default** whenever `content` is configured (the
  `init` config always sets it), so an app never needs `-p` for a small
  output. `build --no-purge` (or an empty `content` array) produces the full
  utility × variant matrix for CDN/stylesheet distribution.
- **Faster full-matrix generation (~2.5×).** Full-mode output is byte-identical
  but builds in ~0.7s instead of ~1.9s:
  - Chunk-array emission with a single join (avoids O(n²) string concat).
  - Memoized `escapeClassName`; variant combos escape only the (cached)
    utility name instead of the full class per combination.
  - Hoisted variant filtering out of the per-utility loop; combo rules reuse
    the already-generated base rule instead of regenerating it (~200k fewer
    rule generations).
  - Cheaper media detection in `groupEmit` and a single-replace `indent`.

### Fixed
- **Corner radius collapsed during purge.** Individual corners
  (`hdx_rounded-t-md`, `hdx_rounded-l-lg`, …) were defined as `{border-top-radius,
  border-top-left-radius}` and the purger's name→definition map kept only the
  last property, silently dropping the paired corner. Each corner is now emitted
  as one multi-property rule, so `hdx_rounded-t-md` reliably sets both top-left
  and top-right. Regression test included.
- **`scale-*` scaled only one axis.** `hdx_scale-150` emitted just `--scale-x`,
  so non-uniform transforms (`transform-gpu`) stretched content horizontally and
  `hover:scale-105` wobbled. `scale-*` now sets both `--scale-x` and `--scale-y`,
  and dedicated single-axis `scale-x-*` / `scale-y-*` utilities were added.
- **Dead `translate-*` names + missing fractions.** Fixed typo names
  (`translate-x--full`, `translate-y--1/2`, …) that could never match a class,
  completed the negative y-axis fraction set (`-translate-y-1/4`, …), and kept
  the theme-driven negative spacing translates (`-translate-x-4`, …).
- **`gap-0` / `gap-x-0` / `gap-y-0` were missing** (barely-used `0` was skipped
  in the spacing-driven gap generator); `min-w-0` / `min-h-0` were duplicated
  by a `keywords` list and the spacing scale.
- **`divide-{color}` did nothing.** It only wrote an unused `--hdx-divide-color`
  variable. It now emits a real `border-color` rule scoped with the same child
  combinator (`> :not([hidden]) ~ :not([hidden])`) used by `divide-x`/`divide-y`.
- **The dark-mode marker was hardcoded to `.hdx_dark`**, so a custom prefix
  (`prefix: 'my_'`) produced `.my_dark_bg-primary` rules that nothing activated.
  The marker is now prefix-aware (`.${prefix}dark`) across the dark variant, dark
  variables, and the variant pipeline; ring/placeholder/gradient stop variables
  are likewise prefix-scoped (`--my-ring-color`, `--my-gradient-stops`, …).
- **Plugin utilities/variants were invisible to the purger.** `scan.js` now runs
  plugins and merges their utilities into the purge set; plugin `addVariant()`
  prefixes are threaded through `purgeUnused`/`findUnknownClasses` so
  `hdx_swipe_bg-primary` parses instead of floating away ungenerated.
- **`darkMode: 'none'` still produced dark variants** (dead ternary). It now
  excludes `dark` from all variant prefixes.
- **Negative arbitrary values were ignored.** `-mt-[13px]`, `-translate-x-[4px]`
  are now resolved (negated margin/offset/translate lengths); non-negatable keys
  like `-text-[13px]` are rejected.
- **`extractClassNames` ignored a custom prefix** for template literals, string
  literals, and array-join patterns. It now takes the prefix and builds its
  regexes from it; a broken string-literal capture group was fixed too.
- **`watch` used a stale config after edits.** ESM config imports are now
  cache-busted, so `hdx_style watch` picks up `theme`/`content` changes.
- **`container-{breakpoint}` used hardcoded widths.** It now derives each
  `hdx_container-{breakpoint}` max-width from `theme.breakpoints`, so a custom
  `3xl` breakpoint automatically gets `hdx_container-3xl`.
- CLI output/fully-static imports in `generate.js` (dynamic `await import` of
  node built-ins removed); dead `variantPrefixMap` deleted from the generator.

### Added
- Full regression suite `tests/regression/audit-fixes.test.js` (28 tests)
  locking in every fix above — suite now **244 passing**.
- README **Default Values** section (complete shipped theme: colors, darkColors,
  spacing, typography, radius, shadows, breakpoints, opacity, z-index,
  transitions, default config) and corrected statistics/badges; extended
  `examples/vanilla/index.html` + `examples/vanilla/hdx.config.js`.

### Changed
- **Dark-mode strategy variants are now arrays in the generator.** When a name
  has several registered strategies (dark mode `both`), the variant pipeline
  emits one rule per strategy instead of dropping one; combos dedupe by name so
  nothing double-emits.
- `darkMode` type widened to include `'none'` (`HdxConfig.darkMode`).

## [0.1.1] — 2026-09-05

### Fixed (P1 release blocker)
- **Cascade ordering contract.** Base utilities are now emitted before every
  responsive `@media` block, so `hdx_hidden hdx_lg_flex` (the idiomatic
  "hidden on mobile, shown at lg" pattern) resolves correctly: `display:none`
  applies below `lg`, `display:flex` at `>= lg`. Previously the base rule
  could be emitted after the media block and silently hide whole layouts at
  every viewport. A regression test asserts `.hdx_hidden` precedes every
  responsive display rule in both full and purged output.

### Added
- Structural utilities: `space-y-*` / `space-x-*` and `divide-*` now emit the
  Tailwind child combinator `> :not([hidden]) ~ :not([hidden])`, so spacing
  between stacked children and dividers render with no manual CSS. Support
  for custom `selector` suffixes on utility definitions (also applied to
  their responsive/state variants).
- Interaction utilities: `cursor-*`, `select-*` (user-select),
  `appearance-*`, `resize-*`.
- Gradient utilities: `bg-gradient-to-{t,tr,r,br,b,bl,l,tl}` plus `from-*`,
  `via-*`, `to-*` stops that compose a `--hdx-gradient-stops` variable.
- `!important` override variant with a clean class-name syntax:
  `hdx_important_bg-primary` (instead of escaped `.\!bg-primary`). Works
  standalone and in variant combos (`hdx_md_important_flex`).
- Safe arbitrary values on purge: `hdx_w-[260px]`, `hdx_max-h-[70vh]`,
  `hdx_rounded-[10px]`, `hdx_opacity-[0.5]`, `hdx_rotate-[90deg]` and a
  curated allow-list of property prefixes are converted to generated
  utilities (instead of being silently dropped). Underscores → spaces.
- Negative values: `-m-*` / `-mx-*` / `-my-*`, negative insets
  (`-top-4`, `-left-1/2`, `-bottom-full`), and negative transforms
  (`-translate-x-*`, `-translate-y-*`, `-rotate-*`).
- Unknown-utility warnings with `file:line:column` in purged builds, so
  classes that resolve to nothing (e.g. typos during migration) are reported
  instead of silently omitted.

### Changed
- Responsive `@media` blocks are grouped contiguously at the end of the
  utilities section (ordered by breakpoint) for easy manual inspection,
  instead of being interleaved between base utility rules.

## [0.1.0] — 2026-09-04

### Added
- Class parser (`src/core/parser.js`) that parses arbitrary variant chains
  like `hdx_lg_dark_hover_bg-primary` into `{ variants, utility }`.
- Variant pipeline (`src/generator/variant-pipeline.js`) replacing the old
  special-case combination wrappers with ordered composition
  (state → dark → responsive → ancestor).
- Demand-driven production generation: `hdx_style build -p` / `--production`
  scans content files and emits only the utilities (and exact variant combos)
  actually used.
- Config file resolution for `hdx.config.js`, `hdx.config.mjs`, and
  `hdx.config.cjs`, preferring the extension that matches the project's
  module type. `hdx_style init` now writes `hdx.config.cjs` (CommonJS) for
  CommonJS projects.
- Configurable reset styles (`reset: false` disables them).
- Plugin registry with validation errors (no more config mutation).
- More robust scanner for multiline class attributes, template literals,
  JSX `:class`, and `ngClass`.
- TypeScript definitions (`index.d.ts`) and a GitHub Actions CI workflow.

### Changed
- Package renamed from `@haridevx/hdx-css` to `@haridevx/hdx-style`.
- CLI command renamed from `hdx_css` to `hdx_style`; version is now read from
  `package.json` instead of being hardcoded.
- Dark mode namespace standardized to `.hdx_dark` (was `.dark`); dark color
  variables respect the `class` / `media` / `both` strategy.
- Group and peer variants use `hdx_group` / `hdx_peer` ancestor classes.
- `border` and `truncate` utilities now emit all their intended properties;
  `inset-0` writes all inset positions; dead `_inset-0-right` /
  `_inset-0-bottom` utilities removed.
- Config loading now performs a single deep merge when applying the theme.

### Fixed
- Purging previously calculated unused utilities but never removed them from
  the output; purged builds now actually shrink the stylesheet.
- Dark variable generation previously ignored the configured strategy.
- The CSS output no longer explodes into every utility × variant combination
  in production mode.
- Node 24 `MODULE_TYPELESS_PACKAGE_JSON` warning when loading ESM config files
  in projects without `"type": "module"` is suppressed.

### Removed
- Dead `src/generator/variant-generator.js` and its obsolete test
  (superseded by the variant pipeline).