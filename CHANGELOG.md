# Changelog

All notable changes to HDX Style are documented in this file.

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