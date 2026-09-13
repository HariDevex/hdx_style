<div align="center">

# 🎨 HDX Style

### Modern Utility-First CSS Framework with a Complete Design System

[![npm version](https://img.shields.io/npm/v/@haridevx/hdx-style?style=for-the-badge&logo=npm&logoColor=white&color=blue)](https://www.npmjs.com/package/@haridevx/hdx-style)
[![license](https://img.shields.io/npm/l/@haridevx/hdx-style?style=for-the-badge&color=green)](LICENSE)
[![node](https://img.shields.io/node/v/@haridevx/hdx-style?style=for-the-badge&logo=node.js&logoColor=white&color=orange)](package.json)
[![CI](https://img.shields.io/github/actions/workflow/status/HariDevex/hdx_style/ci.yml?style=for-the-badge&logo=github-actions&logoColor=white&label=CI)](.github/workflows/ci.yml)

---

**⚡ Demand-driven** · **🔬 Class Parser** · **🎨 Design Tokens** · **🌙 Dark Mode** · **📐 Responsive** · **🔌 Plugin API** · **🧱 Components** · **♿ Accessible**

---

</div>

> **`@haridevx/hdx-style`** is an independent, modular CSS framework with **2,035 utilities**, **221 components**, and **49 variants** — shipping zero PostCSS runtime dependency with official Tailwind CSS integration.

### 📊 Verified Statistics

Run `node stats.js` to generate from source; `npm run stats:verify` (also part of CI) fails if this table drifts from the source:

| Metric | Count |
|---|---|
| 📦 Utilities | **2,035** |
| 🗂️ Utility categories | **21** |
| 🧩 Components | **221** |
| 🎛️ Variants | **49** |
| 📐 Responsive breakpoints | **5** |
| ✅ Tests | **383** |
| 📄 Source files | **80** |
| ⚙️ Runtime dependencies | **5** |
| 🚫 PostCSS dependency | **No** |
| 🚫 Tailwind dependency | **Yes** |

---

## ✨ Why HDX Style?

<table>
<tr>
<td><b>⚡ Demand-driven builds</b></td>
<td>Production output ~1,000× smaller — only the classes you actually use</td>
</tr>
<tr>
<td><b>🔬 Class parser</b></td>
<td><code>hdx-md_hover_bg-primary</code> → <code>{ variants: [md, hover], utility: bg-primary }</code></td>
</tr>
<tr>
<td><b>🎨 Design tokens</b></td>
<td>Semantic colors, spacing, shadows, breakpoints → CSS variables</td>
</tr>
<tr>
<td><b>🌙 Dark mode</b></td>
<td><code>class</code>, <code>media</code>, or <code>both</code> strategies, namespaced as <code>hdx-dark</code></td>
</tr>
<tr>
<td><b>📐 Responsive prefixes</b></td>
<td><code>sm</code> <code>md</code> <code>lg</code> <code>xl</code> <code>2xl</code> on every single utility</td>
</tr>
<tr>
<td><b>🔌 Plugin API</b></td>
<td>Registry-based: add utilities, variants, and components</td>
</tr>
<tr>
<td><b>🧱 Components</b></td>
<td>221 drop-in components — buttons, cards, modals, tables, and more</td>
</tr>
<tr>
<td><b>🧹 Auto purging</b></td>
<td>Scans HTML/JS/JSX/TS/Vue/Svelte and keeps only the utilities <i>and components</i> you use</td>
</tr>
<tr>
<td><b>♿ Accessible</b></td>
<td>Focus rings, <code>sr-only</code>, and reduced-motion support built in</td>
</tr>
<tr>
<td><b>🔒 Deterministic</b></td>
<td>Identical input → identical CSS. No timestamps, no surprises</td>
</tr>
</table>

---

## 📑 Table of Contents

| | Section |
|---|---|
| 🏗️ | [Architecture](#-architecture) |
| 📥 | [Installation](#-installation) |
| 🚀 | [Quick Start](#-quick-start) |
| 💻 | [CLI Commands](#-cli-commands) |
| ⚙️ | [Configuration](#%EF%B8%8F-configuration) |
| 📋 | [Default Values](#-default-values) |
| 🎨 | [Design Tokens](#-design-tokens) |
| 🧬 | [CSS Variables](#-css-variables) |
| 🛠️ | [Utilities](#%EF%B8%8F-utilities) |
| 🔬 | [Class Parser](#-class-parser) |
| 🔀 | [Variant Pipeline](#-variant-pipeline) |
| 📐 | [Responsive Design](#-responsive-design) |
| 🎚️ | [State Variants](#%EF%B8%8F-state-variants) |
| 🌙 | [Dark Mode](#-dark-mode) |
| 🧱 | [Components](#-components) |
| ♿ | [Accessibility](#%E2%8C%83-accessibility) |
| 🔌 | [Plugin System](#-plugin-system) |
| 🧹 | [Content Purging](#-content-purging) |
| 🧩 | [Framework Integration](#-framework-integration) |
| 🖼️ | [Complete Page Example](#-complete-page-example) |
| 🔀 | [Git Workflow](#-git-workflow) |
| 📜 | [License](#-license) |

---

## 🏗️ Architecture

HDX Style is an independent, modular CSS framework. Its pipeline:

```
┌─────────────────────┐
│  Configuration      │  hdx.config.js
│  (hdx.config.js)    │
└─────────┬───────────┘
          ▼
┌─────────────────────┐
│  Design Tokens      │  Colors, spacing, radius, shadows
│  (theme)            │
└─────────┬───────────┘
          ▼
┌─────────────────────┐
│  Content Scanner    │  Extract HDX classes from
│  (HTML/JS/JSX/Vue)  │  HTML, JS, JSX, TS, Vue, Svelte
└─────────┬───────────┘
          ▼
┌─────────────────────┐
│  Class Parser       │  hdx-md_hover_bg-primary
│                     │  → { variants: [md, hover], utility: bg-primary }
└─────────┬───────────┘
          ▼
┌─────────────────────┐
│  Variant Pipeline   │  state → dark → responsive
│                     │  (ordered composition)
└─────────┬───────────┘
          ▼
┌─────────────────────┐
│  CSS Generator      │  Demand-driven in production
│                     │
└─────────┬───────────┘
          ▼
┌─────────────────────┐
│  dist/hdx.css       │
└─────────────────────┘
```

### Layered Design

| Layer | Responsibility |
|---|---|
| **Tokens** | Colors, spacing, radius, shadows, breakpoints, transitions |
| **Utilities** | 21 categories, 2,035 utilities across display, flexbox, grid, spacing, etc. |
| **Components** | Base + variant + size classes for buttons, cards, modals, etc. |
| **Variants** | State, responsive, dark, ancestor — compose via the variant pipeline |
| **Generator** | Produces deterministic CSS. Demand-driven in production mode |

### Key Design Decisions

- **Demand-driven generation**: In production (`--purge`, the default when `content` is set), only utilities *and components* actually used in your content are generated. The full ≈25 MB development stylesheet becomes a minimal production file.
- **Class parser**: Any class like `hdx-md_hover_bg-primary` is decomposed into `variants: ['md', 'hover']` + `utility: 'bg-primary'` without assuming a fixed number of variants.
- **Variant pipeline**: Variants compose in ordered layers — responsive wraps media queries, dark adds the `hdx-dark` ancestor, state adds pseudo-classes. The pipeline is extensible.
- **Registry-based plugins**: Plugins write to an isolated registry instead of mutating the original config.
- **Configurable reset**: Set `reset: false` to use HDX Style as a pure utility layer.
- **Deterministic output**: Identical input always produces identical CSS. No timestamps, no random ordering.

---

## 📥 Installation

> **Published on npm.** `@haridevx/hdx-style` is on the public npm registry.

### 📦 npm

```bash
npm install @haridevx/hdx-style
```

### 🌐 CDN

```html
<link rel="stylesheet" href="https://unpkg.com/@haridevx/hdx-style/dist/hdx.css">
```

### 🎨 CSS Import

```css
@import "@haridevx/hdx-style/css";
```

### 📜 JavaScript Import

```js
import "@haridevx/hdx-style/css";
```

### 🔧 Node API

```js
import { generateCSS, loadConfig } from "@haridevx/hdx-style";

const css = generateCSS(loadConfig());
```

The package ships TypeScript definitions (`.d.ts`) for the full public API.

---

## 🚀 Quick Start

### 1. Install

```bash
npm install @haridevx/hdx-style
npx hdx-style init
```

### 2. Configure `hdx.config.js`

`hdx-style init` creates the config with the correct module syntax for your project:

```js
export default {
  prefix: 'hdx-',
  content: ['./src/**/*.{html,js,jsx,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {},
  plugins: [],
};
```

### 3. Build

```bash
npx hdx-style build
```

### 4. Use

```html
<link rel="stylesheet" href="./dist/hdx.css">

<div class="hdx-min-h-screen hdx-bg-background hdx-p-6">
  <div class="hdx-container hdx-mx-auto">
    <h1 class="hdx-text-3xl hdx-font-bold hdx-text-text">Hello HDX</h1>
  </div>
</div>
```

---

## 💻 CLI Commands

```bash
npx hdx-style init              # Create hdx.config.js / .cjs / .mjs
npx hdx-style build             # Build dist/hdx.css — purges unused CSS when content is configured
npx hdx-style build -p          # Production build (explicit purge)
npx hdx-style build --production  # Same as -p
npx hdx-style build --no-purge  # Full utility × variant matrix (CDN distribution)
npx hdx-style build -o out.css  # Custom output path
npx hdx-style build -c my.config.js  # Custom config path
npx hdx-style watch             # Watch and rebuild (purges by default)
npx hdx-style watch --no-purge  # Watch with full rebuild
npx hdx-style generate          # Full stylesheet — always non-purged
npx hdx-style --version         # Print version
npx hdx-style --help            # Print help
```

---

## ⚙️ Configuration

Create `hdx.config.js` (or `hdx.config.cjs` / `hdx.config.mjs`) in your project root:

```js
export default {
  // Prefix for all utility classes
  prefix: 'hdx-',

  // Files to scan for used classes (for production purging)
  content: [
    './src/**/*.{html,js,jsx,ts,tsx,vue,svelte}',
  ],

  // Force classes to always be included
  safelist: [],

  // Dark mode strategy: 'class' | 'media' | 'both' | 'none'
  darkMode: 'class',

  // Include the global reset/base styles? (default true)
  reset: true,

  // Emit the built-in component layer? (default true)
  components: true,

  // Theme customization (deep-merged with defaults)
  theme: {
    colors: {
      primary: '#7C3AED',
      'primary-hover': '#6D28D9',
    },
    spacing: {},
    fontSize: {},
    breakpoints: {},
    radius: {},
    shadows: {},
  },

  // Plugins
  plugins: [],
};
```

### Dark Mode Strategy

| Strategy | When styles apply | Generated CSS |
|---|---|---|
| `class` (default) | `.hdx-dark` on an ancestor | `.hdx-dark .hdx-dark_bg-primary { ... }` |
| `media` | OS-level `prefers-color-scheme: dark` | `@media (prefers-color-scheme: dark) { ... }` |
| `both` | Both mechanisms; class overrides take precedence | Both rules emitted |
| `none` | Dark styles disabled entirely | No `dark` variants |

### Custom Reset

```js
export default { reset: false };  // Use HDX Style purely as a utility layer
```

### Safelist

Force classes to always be included, even if not detected in content files:

```js
export default {
  safelist: [
    'hdx-flex',
    'hdx-hidden',
    'hdx-bg-primary',
    'hdx-text-white',
    'hdx-opacity-50',
  ],
};
```

> **No prefix patterns**: safelist entries must be complete class names. `'hdx-opacity-'` is not treated as "keep every `hdx-opacity-*`" — list each full class.

### Custom Prefix

```js
export default { prefix: 'my_' };  // All classes become my_flex, my_p-4, etc.
```

### Custom Breakpoints

```js
export default {
  theme: {
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      '3xl': '1920px',  // Custom
    },
  },
};
```

---

## 📋 Default Values

Everything below is generated from `src/theme/defaults.js`. Override any key in `hdx.config.js`; user values are deep-merged over these defaults.

### Default Config

| Key | Default | Notes |
|---|---|---|
| `prefix` | `hdx-` | All utility/variant/component classes get this prefix |
| `content` | `[]` | Empty → full (unpurged) build; set globs to enable purging |
| `safelist` | `[]` | Complete class names always emitted |
| `darkMode` | `'class'` | `class` \| `media` \| `both` \| `none` |
| `reset` | `true` | Global reset + base styles |
| `components` | `true` | Built-in component layer |
| `plugins` | `[]` | Plugin functions |

Base font stack: `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`

### Colors (semantic)

<table>
<tr>
<td>

| Token | Value |
|---|---|
| `primary` | `#2563EB` |
| `primary-hover` | `#1D4ED8` |
| `primary-active` | `#1E40AF` |
| `secondary` | `#64748B` |
| `secondary-hover` | `#475569` |
| `secondary-active` | `#334155` |
| `success` | `#16A34A` |
| `success-hover` | `#15803D` |
| `success-active` | `#166534` |
| `danger` | `#DC2626` |
| `danger-hover` | `#B91C1C` |
| `danger-active` | `#991B1B` |

</td>
<td>

| Token | Value |
|---|---|
| `warning` | `#D97706` |
| `warning-hover` | `#B45309` |
| `warning-active` | `#92400E` |
| `info` | `#0284C7` |
| `info-hover` | `#0369A1` |
| `info-active` | `#075985` |
| `background` | `#F8FAFC` |
| `surface` | `#FFFFFF` |
| `surface-secondary` | `#F1F5F9` |
| `text` | `#0F172A` |
| `text-secondary` | `#475569` |
| `text-muted` | `#64748B` |

</td>
<td>

| Token | Value |
|---|---|
| `border` | `#E2E8F0` |
| `border-strong` | `#CBD5E1` |
| `white` | `#FFFFFF` |
| `black` | `#000000` |
| `gray-50` | `#F8FAFC` |
| `gray-100` | `#F1F5F9` |
| `gray-200` | `#E2E8F0` |
| `gray-300` | `#CBD5E1` |
| `gray-400` | `#94A3B8` |
| `gray-500` | `#64748B` |
| `gray-600` | `#475569` |
| `gray-700` | `#334155` |
| `gray-800` | `#1E293B` |
| `gray-900` | `#0F172A` |

</td>
<td>

| Token | Value |
|---|---|
| `on-accent` | `#FFFFFF` |
| `toast-bg` | `#1E293B` |
| `toast-text` | `#F8FAFC` |
| `modal-bg` | `#FFFFFF` |
| `modal-border` | `#E2E8F0` |
| `modal-text` | `#0F172A` |
| `nav-bg` | `#FFFFFF` |
| `nav-text` | `#0F172A` |
| `nav-accent` | `#2563EB` |
| `button-ghost-border` | `#E2E8F0` |
| `button-ghost-text` | `#475569` |
| `input-bg` | `#FFFFFF` |
| `input-border` | `#CBD5E1` |
| `input-text` | `#0F172A` |

</td>
</tr>
</table>

### Dark Mode Colors (darkColors)

Applied under `.hdx-dark` (or the media query when `darkMode: 'media'`).

| Token | Value | Token | Value |
|---|---|---|---|
| `background` | `#0F172A` | `surface` | `#1E293B` |
| `surface-secondary` | `#334155` | `text` | `#F8FAFC` |
| `text-secondary` | `#CBD5E1` | `text-muted` | `#94A3B8` |
| `border` | `#334155` | `border-strong` | `#475569` |
| `primary` | `#60A5FA` | `success` | `#22C55E` |
| `danger` | `#F87171` | `warning` | `#FBBF24` |
| `info` | `#0EA5E9` | `on-accent` | `#0F172A` |
| `toast-bg` | `#0F172A` | `toast-text` | `#F8FAFC` |
| `modal-bg` | `#1E293B` | `modal-border` | `#334155` |
| `modal-text` | `#F8FAFC` | `nav-bg` | `#0F172A` |
| `nav-text` | `#F8FAFC` | `nav-accent` | `#60A5FA` |
| `button-ghost-border` | `#334155` | `button-ghost-text` | `#CBD5E1` |
| `input-bg` | `#1E293B` | `input-border` | `#475569` |
| `input-text` | `#F8FAFC` | | |

### 📏 Spacing (4px base)

| Key | Value | Key | Value |
|---|---|---|---|
| `0` | `0px` | `0.5` | `0.125rem` (2px) |
| `1` | `0.25rem` (4px) | `1.5` | `0.375rem` (6px) |
| `2` | `0.5rem` (8px) | `3` | `0.75rem` (12px) |
| `4` | `1rem` (16px) | `5` | `1.25rem` (20px) |
| `6` | `1.5rem` (24px) | `8` | `2rem` (32px) |
| `10` | `2.5rem` (40px) | `12` | `3rem` (48px) |
| `16` | `4rem` (64px) | `20` | `5rem` (80px) |
| `24` | `6rem` (96px) | `32` | `8rem` (128px) |

### 🔤 Typography

**Font Size**

| Key | Value | Key | Value |
|---|---|---|---|
| `xs` | `0.75rem` | `sm` | `0.875rem` |
| `base` | `1rem` | `lg` | `1.125rem` |
| `xl` | `1.25rem` | `2xl` | `1.5rem` |
| `3xl` | `1.875rem` | `4xl` | `2.25rem` |
| `5xl` | `3rem` | | |

**Font Weight:** `thin` (100), `extralight` (200), `light` (300), `normal` (400), `medium` (500), `semibold` (600), `bold` (700), `extrabold` (800), `black` (900)

**Line Height:** `none` (1), `tight` (1.25), `snug` (1.375), `normal` (1.5), `relaxed` (1.625), `loose` (2)

**Letter Spacing:** `tighter` (-0.05em), `tight` (-0.025em), `normal` (0em), `wide` (0.025em), `wider` (0.05em), `widest` (0.1em)

### 🔲 Border Radius

| Key | Value | Key | Value |
|---|---|---|---|
| `none` | `0px` | `sm` | `0.25rem` |
| `md` | `0.375rem` | `lg` | `0.5rem` |
| `xl` | `0.75rem` | `2xl` | `1rem` |
| `3xl` | `1.5rem` | `full` | `9999px` |

### 🌫️ Shadows

| Key | Value |
|---|---|
| `none` | `none` |
| `sm` | `0 1px 2px rgba(15, 23, 42, 0.05)` |
| `md` | `0 4px 6px rgba(15, 23, 42, 0.08)` |
| `lg` | `0 10px 15px rgba(15, 23, 42, 0.10)` |
| `xl` | `0 20px 25px rgba(15, 23, 42, 0.12)` |
| `2xl` | `0 25px 50px rgba(15, 23, 42, 0.15)` |
| `inner` | `inset 0 2px 4px rgba(15, 23, 42, 0.06)` |

### 📐 Breakpoints

| Key | Value | Key | Value |
|---|---|---|---|
| `sm` | `640px` | `md` | `768px` |
| `lg` | `1024px` | `xl` | `1280px` |
| `2xl` | `1536px` | | |

### 🎚️ Opacity

`0`→`0`, `5`→`0.05`, `10`→`0.1`, `15`→`0.15`, `20`→`0.2`, `25`→`0.25`, `30`→`0.3`, `40`→`0.4`, `50`→`0.5`, `60`→`0.6`, `70`→`0.7`, `75`→`0.75`, `80`→`0.8`, `90`→`0.9`, `95`→`0.95`, `100`→`1`

### 📊 Z-Index

Numeric: `0`→`0`, `10`→`10`, `20`→`20`, `30`→`30`, `40`→`40`, `50`→`50`, `auto`→`auto`

Semantic layers: `dropdown`→`1000`, `sticky`→`1100`, `overlay`→`1200`, `modal`→`1300`, `popover`→`1400`, `toast`→`1500`

### ⏱️ Transitions

**Duration:** `75`→`75ms`, `100`→`100ms`, `150`→`150ms`, `200`→`200ms`, `300`→`300ms`, `500`→`500ms`, `700`→`700ms`, `1000`→`1000ms`

**Timing:** `linear`, `ease`, `ease-in`, `ease-out`, `ease-in-out`

---

## 🎨 Design Tokens

### Colors (Semantic System)

```js
colors: {
  primary: '#2563EB',
  'primary-hover': '#1D4ED8',
  'primary-active': '#1E40AF',

  secondary: '#64748B',
  'secondary-hover': '#475569',
  'secondary-active': '#334155',

  success: '#16A34A',
  'success-hover': '#15803D',
  'success-active': '#166534',

  danger: '#DC2626',
  'danger-hover': '#B91C1C',
  'danger-active': '#991B1B',

  warning: '#D97706',
  'warning-hover': '#B45309',
  'warning-active': '#92400E',

  info: '#0284C7',
  'info-hover': '#0369A1',
  'info-active': '#075985',

  background: '#F8FAFC',
  surface: '#FFFFFF',
  'surface-secondary': '#F1F5F9',

  text: '#0F172A',
  'text-secondary': '#475569',
  'text-muted': '#64748B',

  border: '#E2E8F0',
  'border-strong': '#CBD5E1',

  white: '#FFFFFF',
  black: '#000000',
  'on-accent': '#FFFFFF',

  'gray-50': '#F8FAFC',  'gray-100': '#F1F5F9',
  'gray-200': '#E2E8F0', 'gray-300': '#CBD5E1',
  'gray-400': '#94A3B8', 'gray-500': '#64748B',
  'gray-600': '#475569', 'gray-700': '#334155',
  'gray-800': '#1E293B', 'gray-900': '#0F172A',

  // Component tokens
  'toast-bg': '#1E293B',
  'toast-text': '#F8FAFC',
  'modal-bg': '#FFFFFF',
  'modal-border': '#E2E8F0',
  'modal-text': '#0F172A',
  'nav-bg': '#FFFFFF',
  'nav-text': '#0F172A',
  'nav-accent': '#2563EB',
  'button-ghost-border': '#E2E8F0',
  'button-ghost-text': '#475569',
  'input-bg': '#FFFFFF',
  'input-border': '#CBD5E1',
  'input-text': '#0F172A',
}

darkColors: {
  background: '#0F172A',
  surface: '#1E293B',
  'surface-secondary': '#334155',
  text: '#F8FAFC',
  'text-secondary': '#CBD5E1',
  'text-muted': '#94A3B8',
  border: '#334155',
  'border-strong': '#475569',
  primary: '#60A5FA',
  success: '#22C55E',
  danger: '#F87171',
  warning: '#FBBF24',
  info: '#0EA5E9',
  'on-accent': '#0F172A',

  // Component tokens (Dark)
  'toast-bg': '#0F172A',
  'toast-text': '#F8FAFC',
  'modal-bg': '#1E293B',
  'modal-border': '#334155',
  'modal-text': '#F8FAFC',
  'nav-bg': '#0F172A',
  'nav-text': '#F8FAFC',
  'nav-accent': '#60A5FA',
  'button-ghost-border': '#334155',
  'button-ghost-text': '#CBD5E1',
  'input-bg': '#1E293B',
  'input-border': '#475569',
  'input-text': '#F8FAFC',
}
```

### Spacing (4px base)

```js
spacing: {
  0: '0px',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  3: '0.75rem',     // 12px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  8: '2rem',        // 32px
  10: '2.5rem',     // 40px
  12: '3rem',       // 48px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  32: '8rem',       // 128px
}
```

### Border Radius

```js
radius: {
  none: '0px',  sm: '0.25rem',  md: '0.375rem',
  lg: '0.5rem', xl: '0.75rem', '2xl': '1rem',
  '3xl': '1.5rem', full: '9999px',
}
```

### Shadows (Subtle SaaS-style)

```js
shadows: {
  none: 'none',
  sm: '0 1px 2px rgba(15, 23, 42, 0.05)',
  md: '0 4px 6px rgba(15, 23, 42, 0.08)',
  lg: '0 10px 15px rgba(15, 23, 42, 0.10)',
  xl: '0 20px 25px rgba(15, 23, 42, 0.12)',
  '2xl': '0 25px 50px rgba(15, 23, 42, 0.15)',
  inner: 'inset 0 2px 4px rgba(15, 23, 42, 0.06)',
}
```

---

## 🧬 CSS Variables

All semantic colors generate CSS custom properties:

```css
:root {
  --hdx-color-primary: #2563EB;
  --hdx-color-primary-hover: #1D4ED8;
  --hdx-color-background: #F8FAFC;
  --hdx-color-surface: #FFFFFF;
  --hdx-color-text: #0F172A;
  --hdx-color-text-secondary: #475569;
  --hdx-color-border: #E2E8F0;
}

.hdx-dark {
  --hdx-color-background: #0F172A;
  --hdx-color-surface: #1E293B;
  --hdx-color-text: #F8FAFC;
  --hdx-color-border: #334155;
}
```

Utilities reference these variables:

```css
.hdx-bg-primary { background-color: var(--hdx-color-primary); }
.hdx-text-text { color: var(--hdx-color-text); }
.hdx-bg-surface { background-color: var(--hdx-color-surface); }
```

---

## 🛠️ Utilities

### Display

```html
<div class="hdx-block">Block</div>
<div class="hdx-inline-block">Inline Block</div>
<span class="hdx-inline">Inline</span>
<div class="hdx-flex">Flex</div>
<div class="hdx-inline-flex">Inline Flex</div>
<div class="hdx-grid">Grid</div>
<div class="hdx-hidden">Hidden</div>
```

### Flexbox

```html
<!-- Direction -->
<div class="hdx-flex hdx-flex-row">Row</div>
<div class="hdx-flex hdx-flex-col">Column</div>
<div class="hdx-flex hdx-flex-row-reverse">Row Reverse</div>

<!-- Wrap -->
<div class="hdx-flex hdx-flex-wrap">Wrap</div>
<div class="hdx-flex hdx-flex-nowrap">No Wrap</div>

<!-- Items -->
<div class="hdx-flex hdx-items-start">Items Start</div>
<div class="hdx-flex hdx-items-center">Items Center</div>
<div class="hdx-flex hdx-items-end">Items End</div>
<div class="hdx-flex hdx-items-stretch">Items Stretch</div>

<!-- Justify -->
<div class="hdx-flex hdx-justify-start">Justify Start</div>
<div class="hdx-flex hdx-justify-center">Justify Center</div>
<div class="hdx-flex hdx-justify-end">Justify End</div>
<div class="hdx-flex hdx-justify-between">Justify Between</div>
<div class="hdx-flex hdx-justify-around">Justify Around</div>
<div class="hdx-flex hdx-justify-evenly">Justify Evenly</div>

<!-- Grow / Shrink -->
<div class="hdx-flex hdx-grow">Grow</div>
<div class="hdx-flex hdx-shrink">Shrink</div>
<div class="hdx-flex hdx-flex-1">Flex 1</div>

<!-- Gap -->
<div class="hdx-flex hdx-gap-2">Gap 2</div>
<div class="hdx-flex hdx-gap-4">Gap 4</div>
<div class="hdx-flex hdx-gap-6">Gap 6</div>
<div class="hdx-flex hdx-gap-x-4 hdx-gap-y-2">Gap X/Y</div>
```

### Grid

```html
<div class="hdx-grid hdx-grid-cols-3 hdx-gap-6">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>

<!-- Column span -->
<div class="hdx-grid hdx-grid-cols-12 hdx-gap-4">
  <div class="hdx-col-span-4">Span 4</div>
  <div class="hdx-col-span-8">Span 8</div>
</div>

<!-- Grid flow -->
<div class="hdx-grid hdx-grid-flow-col hdx-grid-rows-3">
  <div>Auto flow</div>
</div>
```

### Spacing

```html
<!-- Padding -->
<div class="hdx-p-4">Padding 1rem</div>
<div class="hdx-px-4">Padding X</div>
<div class="hdx-py-2">Padding Y</div>
<div class="hdx-pt-4">Padding Top</div>

<!-- Margin -->
<div class="hdx-m-4">Margin 1rem</div>
<div class="hdx-mx-auto">Margin Auto X</div>
<div class="hdx-mt-6">Margin Top</div>

<!-- Negative Margins -->
<div class="hdx--mt-4">Negative Top Margin</div>
<div class="hdx--mx-2">Negative X Margin</div>

<!-- Space Between Children -->
<div class="hdx-space-y-4 hdx-flex hdx-flex-col">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

<!-- Gap -->
<div class="hdx-flex hdx-gap-4">Gap 4</div>
<div class="hdx-grid hdx-gap-6">Gap 6</div>
```

### Sizing

```html
<div class="hdx-w-full">Width 100%</div>
<div class="hdx-w-screen">Width 100vw</div>
<div class="hdx-w-auto">Width Auto</div>
<div class="hdx-w-fit">Width Fit</div>
<div class="hdx-w-1/2">Width 50%</div>
<div class="hdx-h-full">Height 100%</div>
<div class="hdx-h-screen">Height 100vh</div>
<div class="hdx-min-h-screen">Min Height Screen</div>
<div class="hdx-max-w-prose">Max Width Prose</div>
```

### Typography

```html
<h1 class="hdx-text-5xl">Heading 5xl</h1>
<h2 class="hdx-text-4xl">Heading 4xl</h2>
<h3 class="hdx-text-3xl">Heading 3xl</h3>
<p class="hdx-text-lg">Large text</p>
<p class="hdx-text-sm">Small text</p>
<p class="hdx-text-xs">Extra small</p>

<p class="hdx-font-bold">Bold</p>
<p class="hdx-font-semibold">Semibold</p>
<p class="hdx-text-center">Centered</p>
<p class="hdx-uppercase">UPPERCASE</p>
<p class="hdx-italic">Italic</p>
<p class="hdx-underline">Underlined</p>
<p class="hdx-font-mono">Monospace</p>
<p class="hdx-leading-tight">Tight Line Height</p>
<p class="hdx-tracking-wide">Wide Letter Spacing</p>
```

### Colors

```html
<div class="hdx-bg-primary">Primary</div>
<div class="hdx-bg-success">Success</div>
<div class="hdx-bg-danger">Danger</div>
<div class="hdx-bg-warning">Warning</div>
<div class="hdx-bg-info">Info</div>

<p class="hdx-text-primary">Primary Text</p>
<p class="hdx-text-text">Default Text</p>
<p class="hdx-text-text-secondary">Secondary Text</p>
<p class="hdx-text-white">White Text</p>

<div class="hdx-border hdx-border-primary">Primary Border</div>
```

### Backgrounds

```html
<div class="hdx-bg-cover">Cover</div>
<div class="hdx-bg-center">Center</div>
<div class="hdx-bg-no-repeat">No Repeat</div>

<!-- Gradients -->
<div class="hdx-bg-gradient-to-r hdx-from-primary hdx-to-info">
  Linear Gradient (primary → info)
</div>
<div class="hdx-bg-gradient-to-br hdx-from-danger hdx-via-warning hdx-to-success">
  Three-Stop Gradient
</div>
```

### Interaction

```html
<button class="hdx-cursor-pointer">Pointer</button>
<button class="hdx-cursor-not-allowed" disabled>Disabled</button>
<input class="hdx-select-none">No Selection</input>
<textarea class="hdx-resize-none">Fixed Size</textarea>
```

### Borders

```html
<div class="hdx-border">1px Border</div>
<div class="hdx-border-2">2px Border</div>
<div class="hdx-border-dashed">Dashed</div>
<div class="hdx-border-dotted">Dotted</div>
<div class="hdx-divide-y hdx-divide-solid">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### Border Radius

```html
<div class="hdx-rounded">Default (md)</div>
<div class="hdx-rounded-lg">Large</div>
<div class="hdx-rounded-xl">XL</div>
<div class="hdx-rounded-full">Full (Pill)</div>
<div class="hdx-rounded-tl-lg">Top Left</div>
```

### Shadows

```html
<div class="hdx-shadow-sm">Small</div>
<div class="hdx-shadow">Default</div>
<div class="hdx-shadow-md">Medium</div>
<div class="hdx-shadow-lg">Large</div>
<div class="hdx-shadow-xl">XL</div>
<div class="hdx-shadow-inner">Inner</div>
```

### Opacity

```html
<div class="hdx-opacity-0">0%</div>
<div class="hdx-opacity-25">25%</div>
<div class="hdx-opacity-50">50%</div>
<div class="hdx-opacity-75">75%</div>
<div class="hdx-opacity-100">100%</div>
```

### Overflow

```html
<div class="hdx-overflow-hidden">Hidden</div>
<div class="hdx-overflow-auto">Auto</div>
<div class="hdx-overflow-scroll">Scroll</div>
<div class="hdx-overflow-x-auto">Overflow X Auto</div>
```

### Positioning

```html
<div class="hdx-relative">Relative</div>
<div class="hdx-absolute">Absolute</div>
<div class="hdx-fixed">Fixed</div>
<div class="hdx-sticky">Sticky</div>
<div class="hdx-top-0">Top 0</div>
<div class="hdx-inset-0">Inset 0</div>
<div class="hdx-top-1/2 hdx-left-1/2 hdx--translate-x-1/2 hdx--translate-y-1/2">
  Centered
</div>
```

### Z-Index

```html
<div class="hdx-z-0">Z-0</div>
<div class="hdx-z-10">Z-10</div>
<div class="hdx-z-modal">Modal (1300)</div>
<div class="hdx-z-toast">Toast (1500)</div>
```

### Transforms

```html
<div class="hdx-scale-95">Scale 95%</div>
<div class="hdx-scale-105">Scale 105%</div>
<div class="hdx-rotate-45">Rotate 45deg</div>
<div class="hdx-translate-x-1/2">Translate X 50%</div>
<div class="hdx-skew-x-3">Skew X 3deg</div>
<div class="hdx-origin-center">Origin Center</div>
```

### Transitions

```html
<div class="hdx-transition">Default</div>
<div class="hdx-transition-colors">Colors Only</div>
<div class="hdx-transition-transform">Transform Only</div>
<div class="hdx-duration-150">150ms</div>
<div class="hdx-ease-in-out">Ease In Out</div>
```

### Animations

```html
<div class="hdx-animate-spin">Spinning</div>
<div class="hdx-animate-pulse">Pulsing</div>
<div class="hdx-animate-bounce">Bouncing</div>
<div class="hdx-animate-ping">Pinging</div>
<div class="hdx-animate-none">No Animation</div>
```

---

## 🔬 Class Parser

The class parser decomposes any HDX class into its components. It does **not** assume a fixed number of variants:

| Class | Parsed |
|---|---|
| `hdx-flex` | `{ variants: [], utility: 'flex' }` |
| `hdx-md_flex` | `{ variants: ['md'], utility: 'flex' }` |
| `hdx-md_hover_bg-primary` | `{ variants: ['md', 'hover'], utility: 'bg-primary' }` |
| `hdx-lg_dark_hover_bg-primary` | `{ variants: ['lg', 'dark', 'hover'], utility: 'bg-primary' }` |
| `hdx-2xl_focus-visible_ring` | `{ variants: ['2xl', 'focus-visible'], utility: 'ring' }` |

---

## 🔀 Variant Pipeline

Variants compose in ordered layers instead of special-cased combinations:

```
hdx-md_hover_bg-primary
  → variants: ['md', 'hover']
  → pipeline: hover (:hover) wrapped by md (@media (min-width: 768px))
  → @media (min-width: 768px) { .hdx-md_hover_bg-primary:hover { ... } }

hdx-lg_dark_hover_bg-primary
  → variants: ['lg', 'dark', 'hover']
  → pipeline: hover wrapped by dark (.hdx-dark ancestor) wrapped by lg
  → @media (min-width: 1024px) { .hdx-dark .hdx-lg_dark_hover_bg-primary:hover { ... } }
```

### Variant Types

| Type | Behavior | Examples |
|---|---|---|
| `state` | Pseudo-class suffix | `hover`, `focus`, `disabled`, `checked` |
| `responsive` | Media query wrapper | `sm`, `md`, `lg`, `xl`, `2xl` |
| `dark` | `hdx-dark` ancestor or media query | `dark` |
| `ancestor` | Ancestor selector | `group-hover`, `peer-hover` |
| `important` | `!important` override | `hdx-important_bg-primary` |

**Ordering guarantee:** All base utility rules are emitted before every responsive `@media` block, so the idiomatic "hidden on mobile, shown at `lg`" pattern is safe:

```html
<aside class="hdx-hidden hdx-lg_flex">Sidebar — shown from lg up</aside>
```

---

## 📐 Responsive Design

All utilities support responsive prefixes:

```html
<div class="
  hdx-w-full
  hdx-sm_w-1/2
  hdx-md_w-1/3
  hdx-lg_w-1/4
  hdx-xl_w-1/6
  hdx-2xl_w-1/12
">
  Responsive Width
</div>

<div class="
  hdx-grid
  hdx-grid-cols-1
  hdx-sm_grid-cols-2
  hdx-md_grid-cols-3
  hdx-lg_grid-cols-4
">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>

<div class="hdx-flex hdx-flex-col hdx-md_flex-row">
  <div>Stack on mobile</div>
  <div>Row on desktop</div>
</div>
```

### Breakpoints

| Prefix | Min Width |
|--------|-----------|
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1536px |

---

## 🎚️ State Variants

HDX Style supports 20 state variants:

| Variant | Pseudo-class | Variant | Pseudo-class |
|---|---|---|---|
| `hover` | `:hover` | `active` | `:active` |
| `focus` | `:focus` | `visited` | `:visited` |
| `focus-visible` | `:focus-visible` | `disabled` | `:disabled` |
| `checked` | `:checked` | `first` | `:first-child` |
| `required` | `:required` | `last` | `:last-child` |
| `invalid` | `:invalid` | `odd` | `:nth-child(odd)` |
| `valid` | `:valid` | `even` | `:nth-child(even)` |
| `empty` | `:empty` | `enabled` | `:enabled` |
| `read-only` | `:read-only` | `placeholder` | `::placeholder` |
| `first-line` | `::first-line` | `selection` | `::selection` |

### Hover

```html
<button class="
  hdx-bg-primary hdx-text-white
  hdx-px-4 hdx-py-2 hdx-rounded-lg
  hdx-transition
  hdx-hover_bg-primary-hover hdx-hover_shadow-md
">
  Hover Me
</button>
```

### Focus

```html
<input class="hdx-input hdx-focus_ring hdx-focus_border-primary" />
<button class="hdx-btn hdx-btn-primary hdx-focus_ring-2">Focus Ring</button>
```

### Disabled

```html
<button class="
  hdx-btn hdx-btn-primary
  hdx-disabled_opacity-50 hdx-disabled_cursor-not-allowed
" disabled>
  Disabled Button
</button>
```

### Group Hover

```html
<div class="hdx-group">
  <div class="
    hdx-bg-surface hdx-p-4 hdx-rounded-xl
    hdx-group-hover_bg-surface-secondary hdx-group-hover_shadow-md hdx-transition
  ">
    <h3 class="hdx-text-lg hdx-font-semibold">Group Card</h3>
    <p class="hdx-mt-2 hdx-text-sm hdx-text-text-secondary
      hdx-group-hover_text-text hdx-transition
    ">
      Hover the parent to see changes
    </p>
  </div>
</div>
```

### Combined Variants

```html
<button class="hdx-btn hdx-btn-primary hdx-md_hover_bg-primary-hover">
  Hover on md+
</button>

<div class="hdx-bg-surface hdx-lg_dark_bg-surface-secondary">
  Dark on lg+
</div>
```

---

## 🚨 Important Variant

Use `important` as a variant to override component-layer CSS with equal specificity:

```html
<input class="hdx-input hdx-important_border-error hdx-important_h-9">
```

Combines with other variants: `hdx-md_important_flex`, `hdx-hover_important_text-primary`.

---

## 🔧 Arbitrary Values & Negative Utilities

### Arbitrary Values

A safe subset of Tailwind-style arbitrary values resolves at build time:

```html
<img class="hdx-w-[260px] hdx-max-h-[70vh] hdx-rounded-[10px]">
<div class="hdx-w-[45%] hdx-opacity-[0.5] hdx-blur-[2px]">Overlay</div>
<div class="hdx-rotate-[90deg] hdx-md_translate-x-[-50%]">Badge</div>
```

**Color-aware prefixes:** `bg`, `border`, `ring`, and `text` disambiguate by value shape:

```html
<div class="hdx-bg-[#123456] hdx-text-[red] hdx-text-[14px] hdx-ring-[#ff0000]"></div>
```

**Underscores are spaces:** Inside brackets, every `_` becomes a space:

```html
<div class="hdx-blur-[1_rem]"></div>
<!-- → filter: blur(1 rem); -->
```

### Negative Values

```html
<div class="hdx--mt-4 hdx--mx-2">Pulled left/up</div>
<div class="hdx--top-1/2 hdx--translate-y-1/2">Lifted</div>
<div class="hdx--rotate-45">Counter-rotated</div>
```

---

## 🌙 Dark Mode

### Class Strategy (Default)

Add `hdx-dark` class to `<html>`:

```html
<html class="hdx-dark">
<body class="hdx-bg-background hdx-text-text">
  <!-- Dark mode active -->
</body>
</html>
```

```html
<div class="
  hdx-bg-surface hdx-text-text hdx-border-border
  hdx-dark_bg-surface-secondary hdx-dark_text-text-secondary hdx-dark_border-border-strong
">
  Adapts to dark mode
</div>
```

### Media Strategy

```js
export default { darkMode: 'media' };  // Uses @media (prefers-color-scheme: dark)
```

### Dark Mode Color Variables

```css
:root {
  --hdx-color-background: #F8FAFC;
  --hdx-color-surface: #FFFFFF;
  --hdx-color-text: #0F172A;
  --hdx-color-border: #E2E8F0;
}

.hdx-dark {
  --hdx-color-background: #0F172A;
  --hdx-color-surface: #1E293B;
  --hdx-color-text: #F8FAFC;
  --hdx-color-border: #334155;
}
```

---

## 🧱 Components

### Buttons

Full suite of buttons with solid colorways, color-specific outlines, subtle link styles, responsive sizes, pill shapes, and button groups:

```html
<!-- Solid Colors (with automatic on-accent text contrast) -->
<button class="hdx-btn hdx-btn-primary">Primary</button>
<button class="hdx-btn hdx-btn-secondary">Secondary</button>
<button class="hdx-btn hdx-btn-success">Success</button>
<button class="hdx-btn hdx-btn-danger">Danger</button>
<button class="hdx-btn hdx-btn-warning">Warning</button>
<button class="hdx-btn hdx-btn-info">Info</button>

<!-- Outline Variants -->
<button class="hdx-btn hdx-btn-outline-primary">Outline Primary</button>
<button class="hdx-btn hdx-btn-outline-success">Outline Success</button>
<button class="hdx-btn hdx-btn-outline-danger">Outline Danger</button>

<!-- Ghost, Link & Pill -->
<button class="hdx-btn hdx-btn-ghost">Ghost</button>
<button class="hdx-btn hdx-btn-link">Text Link</button>
<button class="hdx-btn hdx-btn-primary hdx-btn-pill">Pill Button</button>

<!-- Responsive Sizes (xs -> xl) -->
<button class="hdx-btn hdx-btn-primary hdx-btn-xs">Extra Small</button>
<button class="hdx-btn hdx-btn-primary hdx-btn-sm">Small</button>
<button class="hdx-btn hdx-btn-primary hdx-btn-md">Medium</button>
<button class="hdx-btn hdx-btn-primary hdx-btn-lg">Large</button>
<button class="hdx-btn hdx-btn-primary hdx-btn-xl">Extra Large</button>

<!-- Button Groups -->
<div class="hdx-btn-group">
  <button class="hdx-btn hdx-btn-primary">Left</button>
  <button class="hdx-btn hdx-btn-primary">Center</button>
  <button class="hdx-btn hdx-btn-primary">Right</button>
</div>

<!-- Accessible States -->
<button class="hdx-btn hdx-btn-primary" disabled>Disabled</button>
<button class="hdx-btn hdx-btn-primary" aria-disabled="true">Aria Disabled</button>
```

### Inputs

```html
<input type="text" class="hdx-input" placeholder="Enter text...">
<input type="text" class="hdx-input hdx-focus-ring" placeholder="With focus ring">
<input type="email" class="hdx-input hdx-input-error" placeholder="Invalid email">

<select class="hdx-select">
  <option>Option 1</option>
  <option>Option 2</option>
</select>

<textarea class="hdx-textarea" rows="4" placeholder="Write a message..."></textarea>

<label class="hdx-label">Email Address</label>
<input type="email" class="hdx-input" placeholder="you@example.com">

<input type="checkbox" class="hdx-checkbox">
<input type="radio" class="hdx-radio" name="option">
```

### Cards

```html
<!-- Basic Card -->
<div class="hdx-card">
  <h3 class="hdx-text-lg hdx-font-semibold">Card Title</h3>
  <p class="hdx-mt-2 hdx-text-sm hdx-text-text-secondary">Card content goes here.</p>
</div>

<!-- Card with Header/Footer -->
<div class="hdx-card">
  <div class="hdx-card-header">
    <h3 class="hdx-text-lg hdx-font-semibold">Header</h3>
  </div>
  <div class="hdx-card-body">
    <p class="hdx-text-sm hdx-text-text-secondary">Body content.</p>
  </div>
  <div class="hdx-card-footer">
    <button class="hdx-btn hdx-btn-primary hdx-btn-sm">Action</button>
  </div>
</div>

<!-- Card Grid -->
<div class="hdx-grid hdx-grid-cols-1 hdx-md_grid-cols-3 hdx-gap-6">
  <div class="hdx-card">
    <h3 class="hdx-text-lg hdx-font-semibold">Card 1</h3>
  </div>
  <div class="hdx-card">
    <h3 class="hdx-text-lg hdx-font-semibold">Card 2</h3>
  </div>
  <div class="hdx-card">
    <h3 class="hdx-text-lg hdx-font-semibold">Card 3</h3>
  </div>
</div>
```

### Skeletons (Shimmer Loaders)

Pre-built animated skeleton loaders with pulse animation for cards, avatars, and text:

```html
<div class="hdx-card hdx-p-6 hdx-flex hdx-flex-col hdx-gap-4">
  <div class="hdx-flex hdx-items-center hdx-gap-4">
    <div class="hdx-skeleton-avatar"></div>
    <div class="hdx-flex-1">
      <div class="hdx-skeleton-text hdx-w-3/4"></div>
      <div class="hdx-skeleton-text hdx-w-1/2"></div>
    </div>
  </div>
  <div class="hdx-skeleton-card"></div>
  <div class="hdx-skeleton-button"></div>
</div>
```

### Badges

Badges in solid, outline, soft tinted palettes, indicator dots, and counters:

```html
<!-- Solid Badges -->
<span class="hdx-badge-primary">Primary</span>
<span class="hdx-badge-secondary">Secondary</span>
<span class="hdx-badge-success">Success</span>
<span class="hdx-badge-danger">Danger</span>
<span class="hdx-badge-warning">Warning</span>
<span class="hdx-badge-info">Info</span>

<!-- Soft / Subtle Tinted Badges -->
<span class="hdx-badge-soft-primary">Active Feature</span>
<span class="hdx-badge-soft-success">Operational</span>
<span class="hdx-badge-soft-danger">Critical Alert</span>
<span class="hdx-badge-soft-warning">Pending Review</span>

<!-- Outline Badges -->
<span class="hdx-badge-outline-primary">Primary</span>
<span class="hdx-badge-outline-success">Verified</span>

<!-- Status Dot & Count Badges -->
<span class="hdx-badge hdx-badge-dot">
  <span class="hdx-w-2 hdx-h-2 hdx-rounded-full hdx-bg-success"></span> Online
</span>
<span class="hdx-badge-danger hdx-badge-count">9+</span>

<!-- Sizes & Rounded Shapes -->
<span class="hdx-badge-primary hdx-badge-xs">XS</span>
<span class="hdx-badge-primary hdx-badge-lg">Large Badge</span>
<span class="hdx-badge-secondary hdx-badge-rounded">Rectangular Badge</span>
```

### Alerts

```html
<div class="hdx-alert">Default Alert</div>
<div class="hdx-alert-success">Success Alert</div>
<div class="hdx-alert-danger">Danger Alert</div>
<div class="hdx-alert-warning">Warning Alert</div>
<div class="hdx-alert-info">Info Alert</div>
```

### Avatars

```html
<div class="hdx-avatar">JD</div>
<div class="hdx-avatar hdx-avatar-sm">SM</div>
<div class="hdx-avatar hdx-avatar-lg">LG</div>
<div class="hdx-avatar hdx-avatar-xl">XL</div>

<div class="hdx-avatar">
  <img src="avatar.jpg" alt="User" class="hdx-w-full hdx-h-full hdx-object-cover">
</div>

<div class="hdx-avatar-group">
  <div class="hdx-avatar">A</div>
  <div class="hdx-avatar">B</div>
  <div class="hdx-avatar">C</div>
</div>
```

### Modals

```html
<div class="hdx-modal-overlay">
  <div class="hdx-modal">
    <div class="hdx-modal-header">
      <h3 class="hdx-text-lg hdx-font-semibold">Modal Title</h3>
    </div>
    <div class="hdx-modal-body">
      <p class="hdx-text-sm hdx-text-text-secondary">Modal content goes here.</p>
    </div>
    <div class="hdx-modal-footer">
      <button class="hdx-btn hdx-btn-ghost">Cancel</button>
      <button class="hdx-btn hdx-btn-primary">Confirm</button>
    </div>
  </div>
</div>
```

### Tables

```html
<div class="hdx-table-container">
  <table class="hdx-table">
    <thead class="hdx-table-header">
      <tr>
        <th class="hdx-table-cell">Name</th>
        <th class="hdx-table-cell">Email</th>
        <th class="hdx-table-cell">Role</th>
      </tr>
    </thead>
    <tbody>
      <tr class="hdx-table-row">
        <td class="hdx-table-cell">John Doe</td>
        <td class="hdx-table-cell">john@example.com</td>
        <td class="hdx-table-cell">Admin</td>
      </tr>
    </tbody>
  </table>
</div>
```

### Container

```html
<div class="hdx-container">Default Container</div>
<div class="hdx-container hdx-container-sm">Small (640px)</div>
<div class="hdx-container hdx-container-md">Medium (768px)</div>
<div class="hdx-container hdx-container-lg">Large (1024px)</div>
<div class="hdx-container hdx-container-xl">XL (1280px)</div>
<div class="hdx-container hdx-container-2xl">2XL (1536px)</div>
```

### Toasts

Transient, auto-dismissing feedback messages — see [Notifications](#notifications) for the persistent variants.

```html
<div class="hdx-toast-container">
  <div class="hdx-toast hdx-toast-success">Saved successfully</div>
  <div class="hdx-toast hdx-toast-danger">Something went wrong</div>
</div>
```

Theme: `toast-bg`, `toast-text` drive the toast surface; `success`, `danger`, `warning`, `info` drive the left-accent border.

### Tooltips

```html
<div class="hdx-tooltip-container">
  Hover me
  <div class="hdx-tooltip">
    Tooltip text
    <div class="hdx-tooltip-arrow"></div>
  </div>
</div>
```

Add `hdx-tooltip-visible` to show the tip. Theme: `toast-bg` / `toast-text` drive the tooltip surface.

### Interactive

Composed dropdowns, accordions, tabs, and responsive content grids:

```html
<!-- Dropdown -->
<div class="hdx-ui-dropdown">
  <button class="hdx-btn hdx-btn-outline">Options ▾</button>
  <div class="hdx-ui-dropdown-menu hdx-ui-dropdown-open">
    <a class="hdx-ui-dropdown-item">Account Settings</a>
    <a class="hdx-ui-dropdown-item">Team Members</a>
    <a class="hdx-ui-dropdown-item hdx-text-danger">Sign Out</a>
  </div>
</div>

<!-- Accordion -->
<div class="hdx-ui-accordion">
  <div class="hdx-ui-accordion-item">
    <button class="hdx-ui-accordion-header">
      <span>How does HDX Style demand-driven purging work?</span>
      <span>▾</span>
    </button>
    <div class="hdx-ui-accordion-content">
      HDX scans all template and script source files, extracting used class names and synthesizing only the exact utilities and components required.
    </div>
  </div>
</div>

<!-- Tabs -->
<div class="hdx-ui-tabs">
  <a href="#overview" class="hdx-ui-tab hdx-ui-tab-active">Overview</a>
  <a href="#deployments" class="hdx-ui-tab">Deployments</a>
  <a href="#settings" class="hdx-ui-tab">Settings</a>
  <span class="hdx-ui-tab hdx-ui-tab-disabled">Billing (Locked)</span>
</div>

<!-- Responsive grid -->
<div class="hdx-ui-grid-3col">…</div>
```

### Layout & Real-World Primitives

Complete layout shells, sidebar rails, KPI analytics cards, empty state placeholders, dividers, and navigation headers:

```html
<!-- Full Dashboard Application Shell -->
<div class="hdx-ui-page-shell">

  <!-- Mini Sidebar Rail -->
  <aside class="hdx-ui-sidebar-rail">
    <div class="hdx-w-8 hdx-h-8 hdx-rounded-lg hdx-bg-primary hdx-text-white hdx-flex hdx-items-center hdx-justify-center hdx-font-bold">H</div>
  </aside>

  <!-- Main View Area -->
  <div class="hdx-ui-page-main hdx-pl-18">

    <!-- Page Header with Action Slot -->
    <header class="hdx-ui-page-header">
      <div>
        <h1 class="hdx-ui-page-title">Executive Overview</h1>
        <p class="hdx-ui-page-subtitle">Real-time health, KPIs, and infrastructure status.</p>
      </div>
      <div class="hdx-ui-page-actions">
        <div class="hdx-btn-group">
          <button class="hdx-btn hdx-btn-outline hdx-btn-sm">Day</button>
          <button class="hdx-btn hdx-btn-primary hdx-btn-sm">Month</button>
          <button class="hdx-btn hdx-btn-outline hdx-btn-sm">Year</button>
        </div>
        <button class="hdx-btn hdx-btn-primary hdx-btn-sm">Download Report</button>
      </div>
    </header>

    <!-- Padded Content Container -->
    <main class="hdx-ui-page-content">

      <!-- KPI Metrics Grid -->
      <div class="hdx-ui-kpi-grid">
        <div class="hdx-ui-kpi-card">
          <span class="hdx-ui-kpi-label">Active Users</span>
          <span class="hdx-ui-kpi-value">42,891</span>
          <span class="hdx-ui-kpi-trend hdx-text-success">↑ +18.4% this week</span>
        </div>
        <div class="hdx-ui-kpi-card">
          <span class="hdx-ui-kpi-label">API Latency</span>
          <span class="hdx-ui-kpi-value">28ms</span>
          <span class="hdx-ui-kpi-trend hdx-text-success">↓ -4ms vs SLA</span>
        </div>
        <div class="hdx-ui-kpi-card">
          <span class="hdx-ui-kpi-label">Error Rate</span>
          <span class="hdx-ui-kpi-value">0.01%</span>
          <span class="hdx-ui-kpi-trend hdx-text-success">Nominal</span>
        </div>
      </div>

      <hr class="hdx-ui-divider">

      <!-- Zero-Data Empty State -->
      <div class="hdx-ui-empty-state">
        <div class="hdx-ui-empty-state-icon">⚡</div>
        <h3 class="hdx-ui-empty-state-title">No pending security incidents</h3>
        <p class="hdx-ui-empty-state-desc">All system microservices are functioning smoothly within compliance parameters.</p>
        <button class="hdx-btn hdx-btn-primary hdx-btn-sm">Run Security Audit</button>
      </div>

    </main>
  </div>
</div>
```

### Icons

HDX does **not** bundle an icon set. `hdx-ui-icon` is the sizing/coloring/wrapping contract any icon source plugs into — import your own SVGs `<svg class="hdx-ui-icon">…</svg>` or icon-font glyphs `<i class="hdx-ui-icon icon-name-from-their-library">`. The wrapper uses `currentColor`, so change `color` on the wrapper or any parent and the icon follows.

```html
<svg class="hdx-ui-icon hdx-ui-icon-sm hdx-text-primary" viewBox="0 0 20 20" fill="currentColor">
  <!-- your SVG paths -->
</svg>

<!-- Loading indicator -->
<svg class="hdx-ui-icon hdx-ui-icon-spin hdx-text-success" viewBox="0 0 20 20" fill="currentColor">…</svg>
```

Sizes: `hdx-ui-icon` (1em) · `hdx-ui-icon-xs` · `hdx-ui-icon-sm` · `hdx-ui-icon-lg` · `hdx-ui-icon-xl`. Theme: color inherits via `currentColor`; sizes derive from `fontSize` tokens.

### Notifications

Persistent indicators and list items — distinct from [Toasts](#toasts), which are transient/auto-dismissing.

```html
<!-- Unread dot / count badge on a relative-positioned icon -->
<div class="hdx-relative">
  <svg class="hdx-ui-icon hdx-ui-icon-lg">…</svg>
  <span class="hdx-ui-notification-dot"></span>
  <!-- or: <span class="hdx-ui-notification-badge">4</span> -->
</div>

<!-- Persistent list panel -->
<div class="hdx-ui-notification-panel">
  <div class="hdx-ui-notification-item hdx-ui-notification-item-unread">
    <div class="hdx-avatar hdx-avatar-sm">JD</div>
    <div>
      <p class="hdx-text-sm hdx-font-medium">John commented</p>
      <p class="hdx-text-xs hdx-text-text-muted">2 minutes ago</p>
    </div>
  </div>
</div>
```

Theme: `danger` drives dot/badge color; `on-accent` the badge text; `primary` the unread accent border; `surface`, `surface-secondary`, `border` the panel/items. Override dot/badge color by setting `--hdx-color-danger` (or a custom color on the element).

### Overlays

Drawers, popovers, and lightboxes. All three follow the dropdown contract — hidden by default (`opacity: 0; visibility: hidden`) and revealed by an `-open` modifier class you toggle. The dim backdrops use the same fixed `rgba(0, 0, 0, …)` treatment as `hdx-modal-overlay`.

```html
<!-- Drawer (left) -->
<div class="hdx-ui-drawer-overlay hdx-ui-drawer-overlay-open"></div>
<aside class="hdx-ui-drawer hdx-ui-drawer-open">
  <h3 class="hdx-text-lg hdx-font-semibold">Filters</h3>
</aside>

<!-- Popover: wrap trigger in hdx-relative hdx-inline-block -->
<div class="hdx-relative hdx-inline-block">
  <button class="hdx-ui-btn-ghost">Help ?</button>
  <div class="hdx-ui-popover hdx-ui-popover-open">
    Keyboard shortcuts…<div class="hdx-ui-popover-arrow"></div>
  </div>
</div>

<!-- Lightbox -->
<div class="hdx-ui-lightbox hdx-ui-lightbox-open">
  <div class="hdx-ui-lightbox-content">
    <button class="hdx-ui-lightbox-close">&times;</button>
    <img src="photo.jpg" alt="…">
    <div class="hdx-ui-lightbox-caption">Caption</div>
  </div>
</div>
```

Use `hdx-ui-drawer-right` for a right-side drawer. Theme: `surface`/`border` panel surfaces, `shadows.lg`/`shadows.xl` depth, `text`/`text-secondary` content, `surface-secondary` hover states, `zIndex.overlay` → `zIndex.modal` → `zIndex.popover` stacking.

### Forms

Switches, chips, field groups, and a floating-label pair — complements the existing `hdx-input` family.

```html
<!-- Toggle switch -->
<label class="hdx-ui-switch hdx-ui-switch-checked">
  <span class="hdx-ui-switch-thumb hdx-ui-switch-thumb-checked"></span>
</label>

<!-- Chip -->
<span class="hdx-ui-chip">React <button class="hdx-ui-chip-close">&times;</button></span>

<!-- Field group -->
<div class="hdx-ui-form-group">
  <label class="hdx-ui-form-label" for="email">Email</label>
  <input id="email" class="hdx-input" type="email">
  <p class="hdx-ui-form-hint">We never share it.</p>
  <!-- <p class="hdx-ui-form-error">Required field</p> -->
</div>

<!-- Floating label (wrap in hdx-relative) -->
<div class="hdx-relative">
  <input class="hdx-input hdx-ui-floating-input" placeholder=" " />
  <label class="hdx-ui-floating-label hdx-ui-floating-label-active">Search</label>
</div>
```

As with the rest of the kit, HDX ships no JS — toggle `-checked`/`-open`/`-active` classes from your own script. Theme: `primary`/`on-accent`/`white` (switch), `surface-secondary`/`gray-200` (chips), `danger` (error text), `text-muted`/`text-secondary` (labels/hints).

### Media

A scroll-snap carousel, thumbnail strip, and figure wrappers.

```html
<!-- Carousel -->
<div class="hdx-ui-carousel">
  <div class="hdx-ui-carousel-item">…1…</div>
  <div class="hdx-ui-carousel-item">…2…</div>
</div>
<button class="hdx-ui-carousel-prev">‹</button>
<button class="hdx-ui-carousel-next">›</button>

<!-- Thumbnails -->
<div class="hdx-ui-thumbnails">
  <img class="hdx-ui-thumbnail" src="t1.jpg" alt="">
  <img class="hdx-ui-thumbnail hdx-ui-thumbnail-active" src="t2.jpg" alt="">
</div>

<!-- Figure -->
<figure class="hdx-ui-figure">
  <img src="hero.jpg" alt="…">
  <figcaption class="hdx-ui-figure-caption">Field notes</figcaption>
</figure>
```

Theme: `surface`/`border`/`shadows.md` (nav buttons), `primary` (active thumbnail ring), `text-muted` (captions), `border-strong` (hover rings).

### Component Theme Overrides

Every component reads its colors from CSS variables, so overriding a single token re-themes every component that uses it — no per-component code:

| CSS variable | Drives |
|---|---|
| `--hdx-color-primary` | Buttons (solid), badges, nav accent, tabs active, pagination active, unread accent, switch checked, thumbnail active |
| `--hdx-color-danger` | Alert/danger, toast danger, notification dot + badge, form error text |
| `--hdx-color-on-accent` | Text placed on colored surfaces (solid buttons, badges, dot) |
| `--hdx-color-surface` / `--hdx-color-surface-secondary` | Cards, inputs, dropdowns, notification items, drawer/popover/lightbox panels, chips, carousel buttons, switch track |
| `--hdx-color-white` | Switch thumb, icon-dot border |
| `--hdx-color-border` / `--hdx-color-border-strong` | Outlines, dividers, table/breadcrumb rules, thumbnail hover ring |
| `--hdx-color-text-muted` / `--hdx-color-text-secondary` | Hints, captions, breadcrumb current, pagination placeholder text |
| `--hdx-color-toast-bg` / `--hdx-color-toast-text` | Toast + tooltip surfaces |
| `--hdx-color-modal-bg` / `--hdx-color-modal-border` / `--hdx-color-modal-text` | Modal panel |
| `--hdx-color-nav-bg` / `--hdx-color-nav-text` / `--hdx-color-nav-accent` | Header/footer/sidebar/bottom nav |
| `--hdx-color-input-bg` / `--hdx-color-input-border` / `--hdx-color-input-text` | Search box, inputs |

---

## ♿ Accessibility

### Focus Ring

```html
<button class="hdx-btn hdx-btn-primary hdx-focus-ring">Focus Ring</button>
<button class="hdx-btn hdx-btn-primary hdx-focus-ring-danger">Danger Ring</button>
<button class="hdx-btn hdx-btn-primary hdx-focus-ring-0">No Ring</button>
```

### Screen Reader Only

```html
<span class="hdx-sr-only">Visible only to screen readers</span>
<span class="hdx-not-sr-only">Visible to everyone</span>
```

### Reduced Motion

HDX Style automatically reduces animations for users who prefer reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 🔌 Plugin System

### Creating a Plugin

```js
// my-plugin.js
export default function myPlugin({ addUtility, addVariant, addComponent, config }) {
  // Add a custom utility
  addUtility({
    name: 'gradient',
    property: 'background',
    value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    category: 'custom',
  });

  // Add a custom variant
  addVariant({
    name: 'print',
    prefix: 'print_',
    selector: () => '@media print',
    type: 'responsive',
  });

  // Add a custom component
  addComponent({
    name: 'tooltip',
    css: `position: relative;
display: inline-block;`,
    category: 'custom',
  });
}
```

### Using a Plugin

```js
// hdx.config.js
import myPlugin from './my-plugin.js';

export default {
  plugins: [myPlugin],
};
```

---

## 🧹 Content Purging

Remove unused CSS in production:

```bash
npx hdx-style build          # Purges unused CSS by default when content is configured
npx hdx-style build -p       # Explicit purge (same as default with content set)
npx hdx-style build --no-purge  # Full stylesheet (CDN distribution)
```

### How It Works

Production builds use **demand-driven generation**:

```
Content files
    ↓
Scanner (extracts HDX class names)
    ↓
Class Parser (hdx-md_hover_bg-primary → { variants: [md, hover], utility: bg-primary })
    ↓
Registry lookup (resolve needed utilities + their variant combos)
    ↓
Component registry lookup (resolve needed components by base class)
    ↓
Generator (produces ONLY the requested rules)
```

If your content contains only `<div class="hdx-flex hdx-p-4 hdx-text-primary"></div>`, the production output contains `.hdx-flex`, `.hdx-p-4`, `.hdx-text-primary` — and **not** `.hdx-grid`, `.hdx-shadow-xl`, or any unrelated utilities.

### Supported File Types

HTML · JavaScript (JS) · JSX · TypeScript (TS) · TSX · Vue (SFC) · Svelte

### Build Modes

| Mode | Command | Output |
|---|---|---|
| Default (`content` set) | `npx hdx-style build` | **Purges** — only utilities your content uses |
| Default (no `content`) | `npx hdx-style build` | Complete stylesheet (all utilities × all variants) |
| Production | `npx hdx-style build -p` | Explicit purge |
| Full stylesheet | `npx hdx-style build --no-purge` | Unpurged utility × variant matrix |
| Full stylesheet | `npx hdx-style generate` | Always complete — ignores `-p`/`--production` |

---

## 🧩 Framework Integration

Framework variants live in the [`examples/`](examples/) folder:

| Example | Content scanned | Build command |
|---|---|---|
| [Vanilla](examples/vanilla/) | `examples/vanilla/**/*.html` | `node src/cli/index.js build -p -c examples/vanilla/hdx.config.js` |
| [React/JSX](examples/react/) | `examples/react/**/*.{html,jsx,tsx}` | `node src/cli/index.js build -p -c examples/react/hdx.config.js` |
| [Vue](examples/vue/) | `examples/vue/**/*.{vue,html}` | `node src/cli/index.js build -p -c examples/vue/hdx.config.js` |

### Vanilla HTML

```html
<!DOCTYPE html>
<html class="hdx-dark">
<head>
  <link rel="stylesheet" href="./node_modules/@haridevx/hdx-style/dist/hdx.css">
</head>
<body class="hdx-min-h-screen hdx-bg-background hdx-text-text">
  <div class="hdx-container hdx-mx-auto hdx-p-6">
    <h1 class="hdx-text-3xl hdx-font-bold">Hello HDX</h1>
  </div>
</body>
</html>
```

### React

```jsx
import "@haridevx/hdx-style/css";

export default function App() {
  return (
    <div className="hdx-min-h-screen hdx-bg-background hdx-p-6">
      <div className="hdx-container hdx-mx-auto">
        <h1 className="hdx-text-3xl hdx-font-bold hdx-text-text">
          Hello HDX
        </h1>
        <button className="hdx-mt-4 hdx-btn hdx-btn-primary">
          Get Started
        </button>
      </div>
    </div>
  );
}
```

### Vue

```vue
<template>
  <div class="hdx-min-h-screen hdx-bg-background hdx-p-6">
    <div class="hdx-container hdx-mx-auto">
      <h1 class="hdx-text-3xl hdx-font-bold hdx-text-text">
        Hello HDX
      </h1>
      <button class="hdx-mt-4 hdx-btn hdx-btn-primary">
        Get Started
      </button>
    </div>
  </div>
</template>

<script setup>
import "@haridevx/hdx-style/css";
</script>
```

### Next.js

```jsx
// pages/_app.js
import "@haridevx/hdx-style/css";

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
```

### Tailwind CSS

HDX Style exports an official Tailwind CSS preset and plugin powered directly by the default design tokens (`default-values.txt` / `src/theme/defaults.js`):

#### 1. Tailwind Config (Preset & Plugin)

```javascript
// tailwind.config.js
import { hdxTailwindPreset, hdxTailwindPlugin } from '@haridevx/hdx-style/tailwind';

export default {
  presets: [hdxTailwindPreset],
  plugins: [hdxTailwindPlugin],
};
```

This extends Tailwind with:
- **Colors**: All HDX semantic tokens (`primary`, `secondary`, `success`, `danger`, `surface`, `border`, `gray-*`, etc.)
- **Dark Mode**: Complete `darkColors` palette and design token variables
- **Typography**: HDX `fontSize`, `fontWeight`, `lineHeight`, `letterSpacing`, and fluid `.text-fluid-*` clamp utilities
- **Tokens**: Spacing, `borderRadius`, `boxShadow`, `screens`, `opacity`, `zIndex`, and transitions

#### 2. Tailwind v4 `@theme` Import

```css
@import "tailwindcss";
@import "@haridevx/hdx-style/tailwind.css";
```

#### 3. Direct Token Import

```javascript
import {
  hdxColors,
  hdxDarkColors,
  hdxSpacing,
  hdxFontSize,
  hdxScreens,
} from '@haridevx/hdx-style/tailwind';
```

---

## 🖼️ Complete Page Example

```html
<!DOCTYPE html>
<html lang="en" class="hdx-dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HDX SaaS Dashboard</title>
  <link rel="stylesheet" href="./dist/hdx.css">
</head>
<body class="hdx-min-h-screen hdx-bg-background hdx-text-text">

  <!-- Full Application Shell -->
  <div class="hdx-ui-page-shell">

    <!-- Mini Navigation Rail -->
    <aside class="hdx-ui-sidebar-rail">
      <div class="hdx-w-10 hdx-h-10 hdx-rounded-xl hdx-bg-primary hdx-text-white hdx-flex hdx-items-center hdx-justify-center hdx-font-bold hdx-shadow-md">
        H
      </div>
      <nav class="hdx-flex hdx-flex-col hdx-gap-4 hdx-mt-6">
        <a href="#" class="hdx-w-10 hdx-h-10 hdx-rounded-lg hdx-flex hdx-items-center hdx-justify-center hdx-bg-surface-secondary hdx-text-primary hdx-transition" title="Overview">📊</a>
        <a href="#" class="hdx-w-10 hdx-h-10 hdx-rounded-lg hdx-flex hdx-items-center hdx-justify-center hdx-text-text-muted hdx-hover_text-text hdx-transition" title="Deployments">🚀</a>
        <a href="#" class="hdx-w-10 hdx-h-10 hdx-rounded-lg hdx-flex hdx-items-center hdx-justify-center hdx-text-text-muted hdx-hover_text-text hdx-transition" title="Settings">⚙️</a>
      </nav>
      <div class="hdx-mt-auto">
        <div class="hdx-avatar hdx-avatar-sm">JD</div>
      </div>
    </aside>

    <!-- Main Content Column -->
    <div class="hdx-ui-page-main hdx-pl-18">

      <!-- Sticky Page Header -->
      <header class="hdx-ui-page-header">
        <div>
          <div class="hdx-flex hdx-items-center hdx-gap-3">
            <h1 class="hdx-ui-page-title">Executive Dashboard</h1>
            <span class="hdx-badge-soft-success hdx-badge-dot">
              <span class="hdx-w-2 hdx-h-2 hdx-rounded-full hdx-bg-success"></span> Live Production
            </span>
          </div>
          <p class="hdx-ui-page-subtitle">Real-time metrics, infrastructure health, and recent operations.</p>
        </div>

        <div class="hdx-ui-page-actions">
          <div class="hdx-btn-group">
            <button class="hdx-btn hdx-btn-outline hdx-btn-sm">24h</button>
            <button class="hdx-btn hdx-btn-primary hdx-btn-sm">7d</button>
            <button class="hdx-btn hdx-btn-outline hdx-btn-sm">30d</button>
          </div>
          <button class="hdx-btn hdx-btn-primary hdx-btn-sm hdx-btn-pill">
            + New Deployment
          </button>
        </div>
      </header>

      <!-- Padded Content Container -->
      <main class="hdx-ui-page-content">

        <!-- KPI Metrics Grid -->
        <div class="hdx-ui-kpi-grid">
          <div class="hdx-ui-kpi-card">
            <span class="hdx-ui-kpi-label">Monthly Recurring Revenue</span>
            <span class="hdx-ui-kpi-value">$142,850</span>
            <span class="hdx-ui-kpi-trend hdx-text-success">↑ +14.2% from last month</span>
          </div>
          <div class="hdx-ui-kpi-card">
            <span class="hdx-ui-kpi-label">Active Subscriptions</span>
            <span class="hdx-ui-kpi-value">3,420</span>
            <span class="hdx-ui-kpi-trend hdx-text-success">↑ +8.1% net new</span>
          </div>
          <div class="hdx-ui-kpi-card">
            <span class="hdx-ui-kpi-label">Avg P99 Latency</span>
            <span class="hdx-ui-kpi-value">24ms</span>
            <span class="hdx-ui-kpi-trend hdx-text-success">↓ -6ms optimization</span>
          </div>
          <div class="hdx-ui-kpi-card">
            <span class="hdx-ui-kpi-label">System Uptime</span>
            <span class="hdx-ui-kpi-value">99.98%</span>
            <span class="hdx-ui-kpi-trend hdx-text-primary">SLA Guaranteed</span>
          </div>
        </div>

        <!-- 2-Column Responsive Split -->
        <div class="hdx-grid hdx-grid-cols-1 hdx-lg_grid-cols-3 hdx-gap-6">

          <!-- Activity Stream -->
          <div class="hdx-lg_col-span-2 hdx-card">
            <div class="hdx-card-header hdx-flex hdx-items-center hdx-justify-between">
              <h2 class="hdx-text-lg hdx-font-semibold hdx-text-text">Live Operations</h2>
              <span class="hdx-badge-primary hdx-badge-xs">Real-Time</span>
            </div>
            <div class="hdx-card-body hdx-flex hdx-flex-col hdx-gap-4">
              <div class="hdx-flex hdx-items-center hdx-gap-3 hdx-p-3 hdx-rounded-lg hdx-hover_bg-surface-secondary hdx-transition">
                <div class="hdx-w-10 hdx-h-10 hdx-rounded-full hdx-bg-primary hdx-flex hdx-items-center hdx-justify-center hdx-text-white hdx-font-medium">JD</div>
                <div class="hdx-flex-1">
                  <p class="hdx-text-sm hdx-font-medium hdx-text-text">Cluster US-East-1 Auto-scaled to 12 pods</p>
                  <p class="hdx-text-xs hdx-text-text-muted">2 minutes ago</p>
                </div>
                <span class="hdx-badge-soft-success">Scaled</span>
              </div>

              <div class="hdx-flex hdx-items-center hdx-gap-3 hdx-p-3 hdx-rounded-lg hdx-hover_bg-surface-secondary hdx-transition">
                <div class="hdx-w-10 hdx-h-10 hdx-rounded-full hdx-bg-success hdx-flex hdx-items-center hdx-justify-center hdx-text-white hdx-font-medium">GH</div>
                <div class="hdx-flex-1">
                  <p class="hdx-text-sm hdx-font-medium hdx-text-text">GitHub CI Workflow passed (commit #81e2e22)</p>
                  <p class="hdx-text-xs hdx-text-text-muted">12 minutes ago</p>
                </div>
                <span class="hdx-badge-soft-primary">CI/CD</span>
              </div>

              <!-- Loading Skeleton State Preview -->
              <div class="hdx-p-3 hdx-rounded-lg hdx-flex hdx-items-center hdx-gap-3">
                <div class="hdx-skeleton-avatar"></div>
                <div class="hdx-flex-1">
                  <div class="hdx-skeleton-text hdx-w-3/4"></div>
                  <div class="hdx-skeleton-text hdx-w-1/3"></div>
                </div>
                <div class="hdx-skeleton-button"></div>
              </div>
            </div>
          </div>

          <!-- Quick Controls Card -->
          <div class="hdx-card hdx-flex hdx-flex-col hdx-gap-4">
            <div class="hdx-card-header">
              <h2 class="hdx-text-lg hdx-font-semibold hdx-text-text">Cluster Health</h2>
            </div>
            <div class="hdx-card-body hdx-flex hdx-flex-col hdx-gap-3">
              <div class="hdx-flex hdx-items-center hdx-justify-between hdx-text-sm">
                <span class="hdx-text-text-secondary">API Gateway</span>
                <span class="hdx-badge-soft-success">Operational</span>
              </div>
              <div class="hdx-flex hdx-items-center hdx-justify-between hdx-text-sm">
                <span class="hdx-text-text-secondary">PostgreSQL Primary</span>
                <span class="hdx-badge-soft-success">Healthy</span>
              </div>
              <div class="hdx-flex hdx-items-center hdx-justify-between hdx-text-sm">
                <span class="hdx-text-text-secondary">Edge CDN Cache</span>
                <span class="hdx-badge-soft-primary">99.4% Hit</span>
              </div>

              <hr class="hdx-ui-divider">

              <button class="hdx-btn hdx-btn-primary hdx-w-full">Manage Infrastructure</button>
              <button class="hdx-btn hdx-btn-outline hdx-w-full">View System Logs</button>
            </div>
          </div>

        </div>

      </main>
    </div>
  </div>

</body>
</html>
```

Build it with:

```bash
node src/cli/index.js build -p -c examples/vanilla/hdx.config.js
```

React and Vue variants are in [`examples/react/`](examples/react/) and [`examples/vue/`](examples/vue/).

---

## 🔀 Git Workflow

HDX Style uses **Trunk-Based Development** — optimized for NPM library distribution.

### Branching Model

| Branch | Purpose | Lifetime |
|---|---|---|
| `main` | Stable, always-shippable source | Permanent |
| `next` | Pre-release testing (optional) | Until stable |
| `release/*` | Backport patches to older majors | Until EOL |
| `feat/*` / `fix/*` | Short-lived feature or bugfix | Deleted after merge |
| `hotfix/*` | Urgent production fixes | Deleted after release |

### Conventional Commits

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

| Type | When to Use | Version Bump |
|---|---|---|
| `feat` | New utility, component, variant, or API | `minor` |
| `fix` | Bug fix in generator, parser, scanner, etc. | `patch` |
| `docs` | README, JSDoc, inline comments only | None |
| `refactor` | Code restructuring without behavior change | None |
| `perf` | Performance improvement | None |
| `test` | Adding or updating tests | None |
| `ci` | CI/CD workflow changes | None |
| `chore` | Build scripts, deps, tooling | None |
| `BREAKING CHANGE` | Any breaking API or class-prefix change | `major` |

### Release Process

```bash
# 1. Ensure main is up to date and CI passes
git checkout main && git pull

# 2. Run the full verification suite
npm test && npm run build && npm run stats:verify && npm run defaults && npm run token-docs:verify

# 3. Bump version
npm version patch   # or: minor / major

# 4. Update CHANGELOG.md
# 5. Regenerate default-values.txt
npm run defaults

# 6. Commit the release
git add -A
git commit -m "chore: release <version>"
git tag v<version>

# 7. Push with tags
git push && git push --tags

# 8. Publish to npm
npm publish --access public
```

### Branch Naming Convention

```
feat/add-fluid-typography
fix/scanner-template-literal-capture
chore/bump-vitest
docs/add-vite-plugin-section
hotfix/critical-purge-regression
release/0.2.x-backport
```

---

## 📜 License

Licensed by **HariDevX** · [MIT](LICENSE)

---

<div align="center">

**Built with care by [HariDevX](https://github.com/HariDevex)**

</div>
