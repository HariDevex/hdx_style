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

### Changed
- Shared purge/generation logic between `build -p` and `watch` lives in
  `src/scanner/scan.js` (`generatePurgedBuildCss`).

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