# @haridevx/hdx-css

**HDX CSS** — A modern, independent utility-first CSS framework and design system built from scratch around the `hdx_` namespace.

> HDX CSS is an independent utility-first CSS framework and design system. It is inspired by the usability of utility-first CSS, but its implementation, utilities, tokens, components, generator, CLI, and plugin API are independently developed. It is not a fork, wrapper, derivative implementation, or modified version of Tailwind CSS.

Every utility class starts with `hdx_`. Built for SaaS, dashboards, and enterprise applications.

### Verified Statistics

Run `node stats.js` to generate from source:

| Metric | Count |
|---|---|
| Utilities | **1,187** |
| Utility categories | **19** |
| Components | **58** |
| Variants | **28** |
| State variants | **20** |
| Responsive breakpoints | **5** |
| Tests | **100** |
| Source files | **55** |
| Runtime dependencies | **4** |
| PostCSS dependency | **No** |
| Tailwind dependency | **No** |

---

## Table of Contents
- [Table of Contents](#Table-of-Contents)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [CLI Commands](#cli-commands)
- [Configuration](#configuration)
- [Design Tokens](#design-tokens)
- [CSS Variables](#css-variables)
- [Utilities](#utilities)
  - [Display](#display)
  - [Flexbox](#flexbox)
  - [Grid](#grid)
  - [Spacing](#spacing)
  - [Sizing](#sizing)
  - [Typography](#typography)
  - [Colors](#colors)
  - [Backgrounds](#backgrounds)
  - [Borders](#borders)
  - [Border Radius](#border-radius)
  - [Shadows](#shadows)
  - [Opacity](#opacity)
  - [Overflow](#overflow)
  - [Positioning](#positioning)
  - [Z-Index](#z-index)
  - [Transforms](#transforms)
  - [Transitions](#transitions)
  - [Animations](#animations)
- [Responsive Design](#responsive-design)
- [State Variants](#state-variants)
- [Dark Mode](#dark-mode)
- [Components](#components)
  - [Buttons](#buttons)
  - [Inputs](#inputs)
  - [Cards](#cards)
  - [Badges](#badges)
  - [Alerts](#alerts)
  - [Avatars](#avatars)
  - [Modals](#modals)
  - [Tables](#tables)
  - [Container](#container)
- [Accessibility](#accessibility)
- [Plugin System](#plugin-system)
- [Content Purging](#content-purging)
- [Framework Integration](#framework-integration)
- [Complete Page Example](#complete-page-example)
- [License](#license)

---
## Table of Contents
## Installation 

```bash
npm install @haridevx/hdx-css
```
## Table of Contents
### CDN

```html
<link rel="stylesheet" href="https://unpkg.com/@haridevx/hdx-css/dist/hdx.css">
```

### CSS Import # Table of Contents

```css
@import "@haridevx/hdx-css/css";
```

### JavaScript Import

```js
import "@haridevx/hdx-css/css";
```

---

## Quick Start

### 1. Install

```bash
npm install @haridevx/hdx-css
npx hdx_css init
```

### 2. Configure `hdx.config.js`

```js
export default {
  prefix: 'hdx_',
  content: ['./src/**/*.{html,js,jsx,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {},
  plugins: [],
};
```

### 3. Build

```bash
npx hdx_css build
```

### 4. Use

```html
<link rel="stylesheet" href="./dist/hdx.css">

<div class="hdx_min-h-screen hdx_bg-background hdx_p-6">
  <div class="hdx_container hdx_mx-auto">
    <h1 class="hdx_text-3xl hdx_font-bold hdx_text-text">Hello HDX</h1>
  </div>
</div>
```

---

## CLI Commands

```bash
npx hdx_css init              # Create hdx.config.js
npx hdx_css build             # Build dist/hdx.css
npx hdx_css build -p          # Build with content purging
npx hdx_css build -o out.css  # Custom output path
npx hdx_css build -c my.config.js  # Custom config path
npx hdx_css watch             # Watch files and rebuild
npx hdx_css generate          # Alias for build
npx hdx_css --version         # Print version
npx hdx_css --help            # Print help
```

---

## Configuration

Create `hdx.config.js` in your project root:

```js
export default {
  // Prefix for all utility classes
  prefix: 'hdx_',

  // Files to scan for used classes (for purging)
  content: [
    './src/**/*.{html,js,jsx,ts,tsx,vue,svelte}',
  ],

  // Dark mode strategy: 'class' | 'media' | 'both'
  darkMode: 'class',

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

### Safelist

Force classes to always be included in the CSS output, even if not detected in content files:

```js
export default {
  safelist: [
    'hdx_flex',
    'hdx_hidden',
    'hdx_bg-primary',
    'hdx_text-white',
    // Dynamic class patterns
    'hdx_opacity-',
  ],
};
```

This is useful for:
- Classes built dynamically via string concatenation
- Classes used in JavaScript logic not scanned by the content scanner
- Ensuring critical utility classes are never purged

### Custom Prefix

```js
export default {
  prefix: 'my_',  // All classes become my_flex, my_p-4, etc.
};
```

### Custom Colors

```js
export default {
  theme: {
    colors: {
      primary: '#7C3AED',
      'primary-hover': '#6D28D9',
      brand: '#FF6B35',
    },
  },
};
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

## Design Tokens

### Colors (Semantic System)

```js
colors: {
  primary: '#2563EB',
  'primary-hover': '#1D4ED8',
  'primary-active': '#1E40AF',

  secondary: '#64748B',
  'secondary-hover': '#475569',

  success: '#16A34A',
  'success-hover': '#15803D',

  danger: '#DC2626',
  'danger-hover': '#B91C1C',

  warning: '#D97706',
  'warning-hover': '#B45309',

  info: '#0284C7',
  'info-hover': '#0369A1',

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
}
```

### Spacing (4px base)

```js
spacing: {
  0: '0px',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  32: '8rem',     // 128px
}
```

### Typography

```js
fontSize: {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem',
  '5xl': '3rem',
}

fontWeight: {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
}
```

### Border Radius

```js
radius: {
  none: '0px',
  sm: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  full: '9999px',
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
}
```

### Breakpoints

```js
breakpoints: {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
}
```

---

## CSS Variables

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

.dark {
  --hdx-color-background: #0F172A;
  --hdx-color-surface: #1E293B;
  --hdx-color-text: #F8FAFC;
  --hdx-color-border: #334155;
}
```

Utilities reference these variables:

```css
.hdx_bg-primary { background-color: var(--hdx-color-primary); }
.hdx_text-text { color: var(--hdx-color-text); }
.hdx_bg-surface { background-color: var(--hdx-color-surface); }
```

---

## Utilities

### Display

```html
<div class="hdx_block">Block</div>
<div class="hdx_inline-block">Inline Block</div>
<span class="hdx_inline">Inline</span>
<div class="hdx_flex">Flex</div>
<div class="hdx_inline-flex">Inline Flex</div>
<div class="hdx_grid">Grid</div>
<div class="hdx_hidden">Hidden</div>
```

### Flexbox

```html
<!-- Direction -->
<div class="hdx_flex hdx_flex-row">Row</div>
<div class="hdx_flex hdx_flex-col">Column</div>
<div class="hdx_flex hdx_flex-row-reverse">Row Reverse</div>

<!-- Wrap -->
<div class="hdx_flex hdx_flex-wrap">Wrap</div>
<div class="hdx_flex hdx_flex-nowrap">No Wrap</div>

<!-- Items -->
<div class="hdx_flex hdx_items-start">Items Start</div>
<div class="hdx_flex hdx_items-center">Items Center</div>
<div class="hdx_flex hdx_items-end">Items End</div>
<div class="hdx_flex hdx_items-stretch">Items Stretch</div>

<!-- Justify -->
<div class="hdx_flex hdx_justify-start">Justify Start</div>
<div class="hdx_flex hdx_justify-center">Justify Center</div>
<div class="hdx_flex hdx_justify-end">Justify End</div>
<div class="hdx_flex hdx_justify-between">Justify Between</div>
<div class="hdx_flex hdx_justify-around">Justify Around</div>
<div class="hdx_flex hdx_justify-evenly">Justify Evenly</div>

<!-- Grow / Shrink -->
<div class="hdx_flex hdx_grow">Grow</div>
<div class="hdx_flex hdx_shrink">Shrink</div>
<div class="hdx_flex hdx_flex-1">Flex 1</div>

<!-- Gap -->
<div class="hdx_flex hdx_gap-2">Gap 2</div>
<div class="hdx_flex hdx_gap-4">Gap 4</div>
<div class="hdx_flex hdx_gap-6">Gap 6</div>
<div class="hdx_flex hdx_gap-x-4 hdx_gap-y-2">Gap X/Y</div>
```

### Grid

```html
<div class="hdx_grid hdx_grid-cols-3 hdx_gap-6">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>

<!-- Column span -->
<div class="hdx_grid hdx_grid-cols-12 hdx_gap-4">
  <div class="hdx_col-span-4">Span 4</div>
  <div class="hdx_col-span-8">Span 8</div>
</div>

<!-- Grid flow -->
<div class="hdx_grid hdx_grid-flow-col hdx_grid-rows-3">
  <div>Auto flow</div>
</div>
```

### Spacing

```html
<!-- Padding -->
<div class="hdx_p-4">Padding 1rem</div>
<div class="hdx_px-4">Padding X</div>
<div class="hdx_py-2">Padding Y</div>
<div class="hdx_pt-4">Padding Top</div>
<div class="hdx_pr-4">Padding Right</div>
<div class="hdx_pb-4">Padding Bottom</div>
<div class="hdx_pl-4">Padding Left</div>

<!-- Margin -->
<div class="hdx_m-4">Margin 1rem</div>
<div class="hdx_mx-auto">Margin Auto X</div>
<div class="hdx_mt-6">Margin Top</div>
<div class="hdx_mb-8">Margin Bottom</div>

<!-- Gap -->
<div class="hdx_flex hdx_gap-4">Gap 4</div>
<div class="hdx_grid hdx_gap-6">Gap 6</div>
```

### Sizing

```html
<!-- Width -->
<div class="hdx_w-full">Width 100%</div>
<div class="hdx_w-screen">Width 100vw</div>
<div class="hdx_w-auto">Width Auto</div>
<div class="hdx_w-fit">Width Fit</div>
<div class="hdx_w-4">Width 1rem</div>
<div class="hdx_w-1/2">Width 50%</div>

<!-- Height -->
<div class="hdx_h-full">Height 100%</div>
<div class="hdx_h-screen">Height 100vh</div>
<div class="hdx_h-auto">Height Auto</div>
<div class="hdx_h-4">Height 1rem</div>

<!-- Min/Max -->
<div class="hdx_min-w-0">Min Width</div>
<div class="hdx_max-w-prose">Max Width Prose</div>
<div class="hdx_min-h-screen">Min Height Screen</div>
<div class="hdx_max-h-64">Max Height</div>
```

### Typography

```html
<!-- Font Size -->
<h1 class="hdx_text-5xl">Heading 5xl</h1>
<h2 class="hdx_text-4xl">Heading 4xl</h2>
<h3 class="hdx_text-3xl">Heading 3xl</h3>
<h4 class="hdx_text-2xl">Heading 2xl</h4>
<h5 class="hdx_text-xl">Heading xl</h5>
<p class="hdx_text-lg">Large text</p>
<p class="hdx_text-base">Base text</p>
<p class="hdx_text-sm">Small text</p>
<p class="hdx_text-xs">Extra small</p>

<!-- Font Weight -->
<p class="hdx_font-normal">Normal</p>
<p class="hdx_font-medium">Medium</p>
<p class="hdx_font-semibold">Semibold</p>
<p class="hdx_font-bold">Bold</p>
<p class="hdx_font-extrabold">Extrabold</p>

<!-- Text Alignment -->
<p class="hdx_text-left">Left</p>
<p class="hdx_text-center">Center</p>
<p class="hdx_text-right">Right</p>
<p class="hdx_text-justify">Justify</p>

<!-- Text Transform -->
<p class="hdx_uppercase">Uppercase</p>
<p class="hdx_lowercase">Lowercase</p>
<p class="hdx_capitalize">Capitalize</p>

<!-- Font Style -->
<p class="hdx_italic">Italic</p>
<p class="hdx_not-italic">Not Italic</p>

<!-- Text Decoration -->
<p class="hdx_underline">Underline</p>
<p class="hdx_line-through">Strikethrough</p>
<p class="hdx_no-underline">No Underline</p>

<!-- Font Family -->
<p class="hdx_font-sans">Sans Serif</p>
<p class="hdx_font-serif">Serif</p>
<p class="hdx_font-mono">Monospace</p>

<!-- Line Height -->
<p class="hdx_leading-tight">Tight</p>
<p class="hdx_leading-normal">Normal</p>
<p class="hdx_leading-loose">Loose</p>

<!-- Letter Spacing -->
<p class="hdx_tracking-tight">Tight</p>
<p class="hdx_tracking-normal">Normal</p>
<p class="hdx_tracking-wide">Wide</p>
```

### Colors

```html
<!-- Background Colors -->
<div class="hdx_bg-primary">Primary</div>
<div class="hdx_bg-secondary">Secondary</div>
<div class="hdx_bg-success">Success</div>
<div class="hdx_bg-danger">Danger</div>
<div class="hdx_bg-warning">Warning</div>
<div class="hdx_bg-info">Info</div>
<div class="hdx_bg-background">Background</div>
<div class="hdx_bg-surface">Surface</div>

<!-- Text Colors -->
<p class="hdx_text-primary">Primary Text</p>
<p class="hdx_text-text">Default Text</p>
<p class="hdx_text-text-secondary">Secondary Text</p>
<p class="hdx_text-text-muted">Muted Text</p>
<p class="hdx_text-white">White Text</p>
<p class="hdx_text-black">Black Text</p>

<!-- Border Colors -->
<div class="hdx_border hdx_border-primary">Primary Border</div>
<div class="hdx_border hdx_border-danger">Danger Border</div>
```

### Backgrounds

```html
<div class="hdx_bg-cover">Cover</div>
<div class="hdx_bg-contain">Contain</div>
<div class="hdx_bg-center">Center</div>
<div class="hdx_bg-no-repeat">No Repeat</div>
<div class="hdx_bg-fixed">Fixed</div>
<div class="hdx_bg-clip-text">Clip Text</div>
```

### Borders

```html
<!-- Border Width -->
<div class="hdx_border">1px Border</div>
<div class="hdx_border-2">2px Border</div>
<div class="hdx_border-4">4px Border</div>
<div class="hdx_border-0">No Border</div>

<!-- Individual Sides -->
<div class="hdx_border-t">Top Border</div>
<div class="hdx_border-r">Right Border</div>
<div class="hdx_border-b">Bottom Border</div>
<div class="hdx_border-l">Left Border</div>
<div class="hdx_border-x">X Border</div>
<div class="hdx_border-y">Y Border</div>

<!-- Border Style -->
<div class="hdx_border hdx_border-dashed">Dashed</div>
<div class="hdx_border hdx_border-dotted">Dotted</div>
<div class="hdx_border hdx_border-double">Double</div>

<!-- Divide (child borders) -->
<div class="hdx_divide-y hdx_divide-solid">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### Border Radius

```html
<div class="hdx_rounded">Default (md)</div>
<div class="hdx_rounded-sm">Small</div>
<div class="hdx_rounded-md">Medium</div>
<div class="hdx_rounded-lg">Large</div>
<div class="hdx_rounded-xl">Extra Large</div>
<div class="hdx_rounded-2xl">2XL</div>
<div class="hdx_rounded-full">Full (Pill)</div>
<div class="hdx_rounded-none">None</div>

<!-- Individual Corners -->
<div class="hdx_rounded-tl-lg">Top Left</div>
<div class="hdx_rounded-tr-lg">Top Right</div>
<div class="hdx_rounded-br-lg">Bottom Right</div>
<div class="hdx_rounded-bl-lg">Bottom Left</div>
```

### Shadows

```html
<div class="hdx_shadow-sm">Small Shadow</div>
<div class="hdx_shadow">Default Shadow</div>
<div class="hdx_shadow-md">Medium Shadow</div>
<div class="hdx_shadow-lg">Large Shadow</div>
<div class="hdx_shadow-xl">XL Shadow</div>
<div class="hdx_shadow-none">No Shadow</div>
<div class="hdx_shadow-inner">Inner Shadow</div>
```

### Opacity

```html
<div class="hdx_opacity-0">0%</div>
<div class="hdx_opacity-25">25%</div>
<div class="hdx_opacity-50">50%</div>
<div class="hdx_opacity-75">75%</div>
<div class="hdx_opacity-100">100%</div>
```

### Overflow

```html
<div class="hdx_overflow-hidden">Hidden</div>
<div class="hdx_overflow-auto">Auto</div>
<div class="hdx_overflow-scroll">Scroll</div>
<div class="hdx_overflow-visible">Visible</div>
<div class="hdx_overflow-x-auto">Overflow X Auto</div>
<div class="hdx_overflow-y-scroll">Overflow Y Scroll</div>
```

### Positioning

```html
<div class="hdx_relative">Relative</div>
<div class="hdx_absolute">Absolute</div>
<div class="hdx_fixed">Fixed</div>
<div class="hdx_sticky">Sticky</div>

<!-- Position Values -->
<div class="hdx_top-0">Top 0</div>
<div class="hdx_right-0">Right 0</div>
<div class="hdx_bottom-0">Bottom 0</div>
<div class="hdx_left-0">Left 0</div>
<div class="hdx_inset-0">Inset 0</div>
<div class="hdx_top-1/2 hdx_left-1/2 hdx_-translate-x-1/2 hdx_-translate-y-1/2">
  Centered
</div>
```

### Z-Index

```html
<div class="hdx_z-0">Z-0</div>
<div class="hdx_z-10">Z-10</div>
<div class="hdx_z-20">Z-20</div>
<div class="hdx_z-30">Z-30</div>
<div class="hdx_z-40">Z-40</div>
<div class="hdx_z-50">Z-50</div>
<div class="hdx_z-auto">Z-Auto</div>
```

### Transforms

```html
<div class="hdx_scale-95">Scale 95%</div>
<div class="hdx_scale-100">Scale 100%</div>
<div class="hdx_scale-105">Scale 105%</div>
<div class="hdx_scale-110">Scale 110%</div>

<div class="hdx_rotate-3">Rotate 3deg</div>
<div class="hdx_rotate-45">Rotate 45deg</div>
<div class="hdx_rotate-90">Rotate 90deg</div>

<div class="hdx_translate-x-1/2">Translate X 50%</div>
<div class="hdx_translate-y-1/4">Translate Y 25%</div>

<div class="hdx_skew-x-3">Skew X 3deg</div>
<div class="hdx_skew-y-6">Skew Y 6deg</div>

<div class="hdx_origin-center">Origin Center</div>
<div class="hdx_origin-top-left">Origin Top Left</div>
```

### Transitions

```html
<div class="hdx_transition">Default Transition</div>
<div class="hdx_transition-all">All Properties</div>
<div class="hdx_transition-colors">Colors Only</div>
<div class="hdx_transition-opacity">Opacity Only</div>
<div class="hdx_transition-shadow">Shadow Only</div>
<div class="hdx_transition-transform">Transform Only</div>
<div class="hdx_transition-none">No Transition</div>

<!-- Duration -->
<div class="hdx_duration-150">150ms</div>
<div class="hdx_duration-200">200ms</div>
<div class="hdx_duration-300">300ms</div>
<div class="hdx_duration-500">500ms</div>

<!-- Timing -->
<div class="hdx_ease">Default Ease</div>
<div class="hdx_ease-in">Ease In</div>
<div class="hdx_ease-out">Ease Out</div>
<div class="hdx_ease-linear">Linear</div>
```

### Animations

```html
<div class="hdx_animate-spin">Spinning</div>
<div class="hdx_animate-pulse">Pulsing</div>
<div class="hdx_animate-bounce">Bouncing</div>
<div class="hdx_animate-ping">Pinging</div>
<div class="hdx_animate-none">No Animation</div>
```

---

## Responsive Design

All utilities support responsive prefixes:

```html
<div class="
  hdx_w-full
  hdx_sm_w-1/2
  hdx_md_w-1/3
  hdx_lg_w-1/4
  hdx_xl_w-1/6
  hdx_2xl_w-1/12
">
  Responsive Width
</div>

<!-- Responsive Grid -->
<div class="
  hdx_grid
  hdx_grid-cols-1
  hdx_sm_grid-cols-2
  hdx_md_grid-cols-3
  hdx_lg_grid-cols-4
  hdx_xl_grid-cols-6
">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>

<!-- Responsive Flex Direction -->
<div class="
  hdx_flex
  hdx_flex-col
  hdx_md_flex-row
">
  <div>Stack on mobile</div>
  <div>Row on desktop</div>
</div>

<!-- Responsive Padding -->
<div class="
  hdx_p-4
  hdx_sm_p-6
  hdx_md_p-8
  hdx_lg_p-12
">
  Responsive Padding
</div>

<!-- Responsive Text -->
<h1 class="
  hdx_text-2xl
  hdx_sm_text-3xl
  hdx_md_text-4xl
  hdx_lg_text-5xl
">
  Responsive Heading
</h1>
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

## State Variants

HDX CSS supports 20 state variants:

| Variant | Pseudo-class |
|---|---|
| `hover` | `:hover` |
| `focus` | `:focus` |
| `focus-visible` | `:focus-visible` |
| `active` | `:active` |
| `visited` | `:visited` |
| `disabled` | `:disabled` |
| `checked` | `:checked` |
| `required` | `:required` |
| `invalid` | `:invalid` |
| `valid` | `:valid` |
| `first` | `:first-child` |
| `last` | `:last-child` |
| `odd` | `:nth-child(odd)` |
| `even` | `:nth-child(even)` |
| `empty` | `:empty` |
| `enabled` | `:enabled` |
| `read-only` | `:read-only` |
| `placeholder` | `::placeholder` |
| `first-line` | `::first-line` |
| `selection` | `::selection` |

### Hover

```html
<button class="
  hdx_bg-primary
  hdx_text-white
  hdx_px-4 hdx_py-2
  hdx_rounded-lg
  hdx_transition
  hdx_hover_bg-primary-hover
  hdx_hover_shadow-md
">
  Hover Me
</button>

<div class="
  hdx_bg-surface
  hdx_p-4
  hdx_transition
  hdx_hover_bg-surface-secondary
  hdx_hover_shadow-lg
">
  Hover Card
</div>
```

### Focus

```html
<input class="
  hdx_input
  hdx_focus_ring
  hdx_focus_border-primary
" />

<button class="
  hdx_btn hdx_btn-primary
  hdx_focus_ring-2
">
  Focus Ring
</button>
```

### Focus Visible

```html
<button class="
  hdx_btn hdx_btn-primary
  hdx_focus-visible_ring
">
  Focus Visible Only
</button>
```

### Active

```html
<button class="
  hdx_btn hdx_btn-primary
  hdx_active_scale-95
  hdx_active_bg-primary-active
">
  Click Me
</button>
```

### Disabled

```html
<button class="
  hdx_btn hdx_btn-primary
  hdx_disabled_opacity-50
  hdx_disabled_cursor-not-allowed
" disabled>
  Disabled Button
</button>

<input class="
  hdx_input
  hdx_disabled_bg-surface-secondary
  hdx_disabled_cursor-not-allowed
" disabled />
```

### Checked / Required / Invalid

```html
<input type="checkbox" class="hdx_checkbox hdx_checked_bg-primary hdx_checked_border-primary">
<input type="text" class="hdx_input hdx_required_border-danger">
<input type="email" class="hdx_input hdx_invalid_border-danger hdx_invalid_text-danger">
```

### First / Last / Odd / Even

```html
<div class="hdx_flex hdx_flex-col">
  <div class="hdx_p-4 hdx_first_rounded-t-lg hdx_last_rounded-b-lg hdx_odd_bg-surface hdx_even_bg-surface-secondary">
    Item
  </div>
</div>
```

### Placeholder

```html
<input class="hdx_input hdx_placeholder_text-text-muted" placeholder="Enter text...">
```

### Selection

```html
<p class="hdx_selection_bg-primary hdx_selection_text-white">Selected text</p>
```

### Group Hover

```html
<div class="hdx_group">
  <div class="
    hdx_bg-surface
    hdx_group-hover_bg-surface-secondary
    hdx_group-hover_shadow-md
    hdx_transition
    hdx_p-4
    hdx_rounded-xl
  ">
    <h3 class="hdx_text-lg hdx_font-semibold">Group Card</h3>
    <p class="hdx_mt-2 hdx_text-sm hdx_text-text-secondary
      hdx_group-hover_text-text
      hdx_transition
    ">
      Hover the parent to see changes
    </p>
  </div>
</div>
```

### Combined Variants

Combine responsive + state, responsive + dark, or dark + state:

```html
<!-- Responsive + State: hdx_md_hover_bg-primary-hover -->
<button class="hdx_btn hdx_btn-primary hdx_md_hover_bg-primary-hover">
  Hover on md+
</button>

<!-- Responsive + Dark: hdx_lg_dark_bg-surface-secondary -->
<div class="hdx_bg-surface hdx_lg_dark_bg-surface-secondary">
  Dark on lg+
</div>

<!-- Dark + State: hdx_dark_hover_bg-primary-hover -->
<button class="hdx_btn hdx_btn-primary hdx_dark_hover_bg-primary-hover">
  Hover in dark mode
</button>
```

---

## Dark Mode

### Class Strategy (Default)

Add `hdx_dark` class to `<html>`:

```html
<html class="hdx_dark">
<body class="hdx_bg-background hdx_text-text">
  <!-- Dark mode active -->
</body>
</html>
```

```html
<!-- Dark mode specific -->
<div class="
  hdx_bg-surface
  hdx_text-text
  hdx_border-border
  hdx_dark_bg-surface-secondary
  hdx_dark_text-text-secondary
  hdx_dark_border-border-strong
">
  Adapts to dark mode
</div>
```

### Media Strategy

```js
// hdx.config.js
export default {
  darkMode: 'media',
  // ...
};
```

Uses `@media (prefers-color-scheme: dark)` — no class toggle needed.

### Both Strategies

```js
// hdx.config.js
export default {
  darkMode: 'both',
  // ...
};
```

### Dark Mode Color Variables

```css
:root {
  --hdx-color-background: #F8FAFC;
  --hdx-color-surface: #FFFFFF;
  --hdx-color-text: #0F172A;
  --hdx-color-border: #E2E8F0;
}

.dark {
  --hdx-color-background: #0F172A;
  --hdx-color-surface: #1E293B;
  --hdx-color-text: #F8FAFC;
  --hdx-color-border: #334155;
}
```

### Complete Dark Mode Example

```html
<html class="hdx_dark">
<body class="hdx_min-h-screen hdx_bg-background hdx_text-text">

  <!-- Navigation -->
  <nav class="hdx_bg-surface hdx_border-b hdx_border-border hdx_dark_bg-surface-secondary hdx_dark_border-border-strong">
    <div class="hdx_container hdx_mx-auto hdx_px-4 hdx_py-3 hdx_flex hdx_items-center hdx_justify-between">
      <span class="hdx_text-lg hdx_font-bold">Dashboard</span>
      <div class="hdx_flex hdx_gap-4">
        <a href="#" class="hdx_text-sm hdx_text-text-secondary hover:hdx_text-primary">Home</a>
        <a href="#" class="hdx_text-sm hdx_text-text-secondary hover:hdx_text-primary">Settings</a>
      </div>
    </div>
  </nav>

  <!-- Content -->
  <main class="hdx_container hdx_mx-auto hdx_p-6">
    <div class="hdx_grid hdx_grid-cols-1 md:hdx_grid-cols-3 hdx_gap-6">
      <div class="hdx_bg-surface hdx_border hdx_border-border hdx_rounded-xl hdx_shadow-sm hdx_p-6
                  hdx_dark_bg-surface-secondary hdx_dark_border-border-strong">
        <h2 class="hdx_text-lg hdx_font-semibold hdx_text-text">Card 1</h2>
        <p class="hdx_mt-2 hdx_text-sm hdx_text-text-secondary">Content here</p>
      </div>
    </div>
  </main>

</body>
</html>
```

---

## Components

### Buttons

```html
<!-- Base Button -->
<button class="hdx_btn hdx_btn-primary">Primary</button>
<button class="hdx_btn hdx_btn-secondary">Secondary</button>
<button class="hdx_btn hdx_btn-success">Success</button>
<button class="hdx_btn hdx_btn-danger">Danger</button>
<button class="hdx_btn hdx_btn-warning">Warning</button>
<button class="hdx_btn hdx_btn-info">Info</button>
<button class="hdx_btn hdx_btn-outline">Outline</button>
<button class="hdx_btn hdx_btn-ghost">Ghost</button>

<!-- Button Sizes -->
<button class="hdx_btn hdx_btn-primary hdx_btn-sm">Small</button>
<button class="hdx_btn hdx_btn-primary hdx_btn-md">Medium</button>
<button class="hdx_btn hdx_btn-primary hdx_btn-lg">Large</button>
<button class="hdx_btn hdx_btn-primary hdx_btn-icon">Icon</button>

<!-- Button with Icon -->
<button class="hdx_btn hdx_btn-primary">
  <svg>...</svg>
  Click Me
</button>

<!-- Disabled -->
<button class="hdx_btn hdx_btn-primary hdx_disabled_opacity-50" disabled>Disabled</button>

<!-- Full Width -->
<button class="hdx_btn hdx_btn-primary hdx_w-full">Full Width</button>
```

### Inputs

```html
<!-- Text Input -->
<input type="text" class="hdx_input" placeholder="Enter text...">

<!-- Input with Focus Ring -->
<input type="text" class="hdx_input hdx_focus-ring" placeholder="With focus ring">

<!-- Input Error State -->
<input type="email" class="hdx_input hdx_input-error" placeholder="Invalid email">

<!-- Select -->
<select class="hdx_select">
  <option>Option 1</option>
  <option>Option 2</option>
</select>

<!-- Textarea -->
<textarea class="hdx_textarea" rows="4" placeholder="Write a message..."></textarea>

<!-- Label -->
<label class="hdx_label">Email Address</label>
<input type="email" class="hdx_input" placeholder="you@example.com">

<!-- Checkbox -->
<input type="checkbox" class="hdx_checkbox">

<!-- Radio -->
<input type="radio" class="hdx_radio" name="option">
<input type="radio" class="hdx_radio" name="option">

<!-- Complete Form -->
<div class="hdx_flex hdx_flex-col hdx_gap-4">
  <div>
    <label class="hdx_label">Full Name</label>
    <input type="text" class="hdx_input" placeholder="John Doe">
  </div>
  <div>
    <label class="hdx_label">Email</label>
    <input type="email" class="hdx_input" placeholder="john@example.com">
  </div>
  <div>
    <label class="hdx_label">Message</label>
    <textarea class="hdx_textarea" rows="3" placeholder="Your message..."></textarea>
  </div>
  <button class="hdx_btn hdx_btn-primary hdx_w-fit">Submit</button>
</div>
```

### Cards

```html
<!-- Basic Card -->
<div class="hdx_card">
  <h3 class="hdx_text-lg hdx_font-semibold">Card Title</h3>
  <p class="hdx_mt-2 hdx_text-sm hdx_text-text-secondary">Card content goes here.</p>
</div>

<!-- Card with Header/Footer -->
<div class="hdx_card">
  <div class="hdx_card-header">
    <h3 class="hdx_text-lg hdx_font-semibold">Header</h3>
  </div>
  <div class="hdx_card-body">
    <p class="hdx_text-sm hdx_text-text-secondary">Body content.</p>
  </div>
  <div class="hdx_card-footer">
    <button class="hdx_btn hdx_btn-primary hdx_btn-sm">Action</button>
  </div>
</div>

<!-- Card Grid -->
<div class="hdx_grid hdx_grid-cols-1 md:hdx_grid-cols-3 hdx_gap-6">
  <div class="hdx_card">
    <h3 class="hdx_text-lg hdx_font-semibold">Card 1</h3>
    <p class="hdx_mt-2 hdx_text-sm hdx_text-text-secondary">Content</p>
  </div>
  <div class="hdx_card">
    <h3 class="hdx_text-lg hdx_font-semibold">Card 2</h3>
    <p class="hdx_mt-2 hdx_text-sm hdx_text-text-secondary">Content</p>
  </div>
  <div class="hdx_card">
    <h3 class="hdx_text-lg hdx_font-semibold">Card 3</h3>
    <p class="hdx_mt-2 hdx_text-sm hdx_text-text-secondary">Content</p>
  </div>
</div>
```

### Badges

```html
<span class="hdx_badge">Default</span>
<span class="hdx_badge-primary">Primary</span>
<span class="hdx_badge-success">Success</span>
<span class="hdx_badge-danger">Danger</span>
<span class="hdx_badge-warning">Warning</span>
<span class="hdx_badge-info">Info</span>
<span class="hdx_badge-outline">Outline</span>

<!-- Badge in Context -->
<div class="hdx_flex hdx_items-center hdx_gap-2">
  <h3 class="hdx_text-lg hdx_font-semibold">Dashboard</h3>
  <span class="hdx_badge-primary">New</span>
</div>
```

### Alerts

```html
<div class="hdx_alert">Default Alert</div>
<div class="hdx_alert-success">Success Alert</div>
<div class="hdx_alert-danger">Danger Alert</div>
<div class="hdx_alert-warning">Warning Alert</div>
<div class="hdx_alert-info">Info Alert</div>
```

### Avatars

```html
<div class="hdx_avatar">JD</div>
<div class="hdx_avatar hdx_avatar-sm">SM</div>
<div class="hdx_avatar hdx_avatar-lg">LG</div>
<div class="hdx_avatar hdx_avatar-xl">XL</div>

<!-- Avatar with Image -->
<div class="hdx_avatar">
  <img src="avatar.jpg" alt="User" class="hdx_w-full hdx_h-full hdx_object-cover">
</div>

<!-- Avatar Group -->
<div class="hdx_avatar-group">
  <div class="hdx_avatar">A</div>
  <div class="hdx_avatar">B</div>
  <div class="hdx_avatar">C</div>
</div>
```

### Modals

```html
<!-- Modal Overlay -->
<div class="hdx_modal-overlay">
  <div class="hdx_modal">
    <div class="hdx_modal-header">
      <h3 class="hdx_text-lg hdx_font-semibold">Modal Title</h3>
    </div>
    <div class="hdx_modal-body">
      <p class="hdx_text-sm hdx_text-text-secondary">Modal content goes here.</p>
    </div>
    <div class="hdx_modal-footer">
      <button class="hdx_btn hdx_btn-ghost">Cancel</button>
      <button class="hdx_btn hdx_btn-primary">Confirm</button>
    </div>
  </div>
</div>
```

### Tables

```html
<div class="hdx_table-container">
  <table class="hdx_table">
    <thead class="hdx_table-header">
      <tr>
        <th class="hdx_table-cell">Name</th>
        <th class="hdx_table-cell">Email</th>
        <th class="hdx_table-cell">Role</th>
      </tr>
    </thead>
    <tbody>
      <tr class="hdx_table-row">
        <td class="hdx_table-cell">John Doe</td>
        <td class="hdx_table-cell">john@example.com</td>
        <td class="hdx_table-cell">Admin</td>
      </tr>
      <tr class="hdx_table-row">
        <td class="hdx_table-cell">Jane Smith</td>
        <td class="hdx_table-cell">jane@example.com</td>
        <td class="hdx_table-cell">User</td>
      </tr>
    </tbody>
  </table>
</div>
```

### Container

```html
<div class="hdx_container">Default Container</div>
<div class="hdx_container hdx_container-sm">Small (640px)</div>
<div class="hdx_container hdx_container-md">Medium (768px)</div>
<div class="hdx_container hdx_container-lg">Large (1024px)</div>
<div class="hdx_container hdx_container-xl">XL (1280px)</div>
<div class="hdx_container hdx_container-2xl">2XL (1536px)</div>
```

---

## Accessibility

### Focus Ring

```html
<!-- Default focus ring (primary color) -->
<button class="hdx_btn hdx_btn-primary hdx_focus-ring">Focus Ring</button>

<!-- Custom focus ring color -->
<button class="hdx_btn hdx_btn-primary hdx_focus-ring-danger">Danger Ring</button>

<!-- No focus ring -->
<button class="hdx_btn hdx_btn-primary hdx_focus-ring-0">No Ring</button>
```

### Screen Reader Only

```html
<span class="hdx_sr-only">Visible only to screen readers</span>
<span class="hdx_not-sr-only">Visible to everyone</span>
```

### Reduced Motion

HDX CSS automatically reduces animations for users who prefer reduced motion:

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

## Plugin System

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

### Built-in Plugins

```js
// Container plugin (included by default)
export default function containerPlugin({ addComponent }) {
  addComponent({
    name: 'container',
    css: `width: 100%;
margin-inline: auto;
padding-inline: 1rem;`,
  });
}
```

---

## Content Purging

Remove unused CSS in production:

```bash
npx hdx_css build -p
```

This scans your content files and only includes utilities that are actually used:

```html
<!-- These classes will be kept -->
<div class="hdx_flex hdx_p-4 hdx_bg-primary">

<!-- These classes will be removed (not in content) -->
<!-- .hdx_grid, .hdx_text-center, etc. -->
```

### Configuration

```js
// hdx.config.js
export default {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx,vue,svelte}',
    './pages/**/*.{html,js,jsx,ts,tsx}',
  ],
};
```

### Supported File Types

- HTML
- JavaScript (JS)
- JSX (React)
- TypeScript (TS)
- TSX (React)
- Vue (SFC)
- Svelte

---

## Framework Integration

### Vanilla HTML

```html
<!DOCTYPE html>
<html class="hdx_dark">
<head>
  <link rel="stylesheet" href="./node_modules/@haridevx/hdx-css/dist/hdx.css">
</head>
<body class="hdx_min-h-screen hdx_bg-background hdx_text-text">
  <div class="hdx_container hdx_mx-auto hdx_p-6">
    <h1 class="hdx_text-3xl hdx_font-bold">Hello HDX</h1>
  </div>
</body>
</html>
```

### React

```jsx
import "@haridevx/hdx-css/css";

export default function App() {
  return (
    <div className="hdx_min-h-screen hdx_bg-background hdx_p-6">
      <div className="hdx_container hdx_mx-auto">
        <h1 className="hdx_text-3xl hdx_font-bold hdx_text-text">
          Hello HDX
        </h1>
        <button className="hdx_mt-4 hdx_btn hdx_btn-primary">
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
  <div class="hdx_min-h-screen hdx_bg-background hdx_p-6">
    <div class="hdx_container hdx_mx-auto">
      <h1 class="hdx_text-3xl hdx_font-bold hdx_text-text">
        Hello HDX
      </h1>
      <button class="hdx_mt-4 hdx_btn hdx_btn-primary">
        Get Started
      </button>
    </div>
  </div>
</template>

<script setup>
import "@haridevx/hdx-css/css";
</script>
```

### Vite

```js
// vite.config.js
export default {
  css: {
    // HDX CSS works with Vite out of the box
  },
};
```

```html
<!-- index.html -->
<link rel="stylesheet" href="./node_modules/@haridevx/hdx-css/dist/hdx.css">
```

### Next.js

```js
// next.config.js
module.exports = {
  // Add HDX CSS to your Next.js app
};
```

```jsx
// pages/_app.js
import "@haridevx/hdx-css/css";

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
```

---

## Complete Page Example

```html
<!DOCTYPE html>
<html lang="en" class="hdx_dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HDX Dashboard</title>
  <link rel="stylesheet" href="./dist/hdx.css">
</head>
<body class="hdx_min-h-screen hdx_bg-background hdx_text-text">

  <!-- Header -->
  <header class="hdx_bg-surface hdx_border-b hdx_border-border hdx_dark_bg-surface-secondary hdx_dark_border-border-strong">
    <div class="hdx_container hdx_mx-auto hdx_px-4 hdx_py-3 hdx_flex hdx_items-center hdx_justify-between">
      <div class="hdx_flex hdx_items-center hdx_gap-3">
        <div class="hdx_w-8 hdx_h-8 hdx_rounded-lg hdx_bg-primary hdx_flex hdx_items-center hdx_justify-center hdx_text-white hdx_text-sm hdx_font-bold">H</div>
        <span class="hdx_text-lg hdx_font-bold hdx_text-text">HDX Dashboard</span>
      </div>
      <nav class="hdx_flex hdx_items-center hdx_gap-4">
        <a href="#" class="hdx_text-sm hdx_font-medium hdx_text-text-secondary hdx_hover_text-primary hdx_transition">Dashboard</a>
        <a href="#" class="hdx_text-sm hdx_font-medium hdx_text-text-secondary hdx_hover_text-primary hdx_transition">Settings</a>
        <div class="hdx_avatar hdx_avatar-sm">JD</div>
      </nav>
    </div>
  </header>

  <!-- Main Content -->
  <main class="hdx_container hdx_mx-auto hdx_p-6">

    <!-- Page Title -->
    <div class="hdx_mb-8">
      <h1 class="hdx_text-3xl hdx_font-bold hdx_text-text">Dashboard</h1>
      <p class="hdx_mt-2 hdx_text-text-secondary">Welcome back, John.</p>
    </div>

    <!-- Stats Grid -->
    <div class="hdx_grid hdx_grid-cols-1 sm:hdx_grid-cols-2 lg:hdx_grid-cols-4 hdx_gap-6 hdx_mb-8">
      <div class="hdx_card">
        <p class="hdx_text-sm hdx_text-text-muted">Total Users</p>
        <p class="hdx_text-2xl hdx_font-bold hdx_text-text hdx_mt-1">12,345</p>
        <p class="hdx_text-xs hdx_text-success hdx_mt-2">+12% from last month</p>
      </div>
      <div class="hdx_card">
        <p class="hdx_text-sm hdx_text-text-muted">Revenue</p>
        <p class="hdx_text-2xl hdx_font-bold hdx_text-text hdx_mt-1">$45,678</p>
        <p class="hdx_text-xs hdx_text-success hdx_mt-2">+8% from last month</p>
      </div>
      <div class="hdx_card">
        <p class="hdx_text-sm hdx_text-text-muted">Orders</p>
        <p class="hdx_text-2xl hdx_font-bold hdx_text-text hdx_mt-1">1,234</p>
        <p class="hdx_text-xs hdx_text-danger hdx_mt-2">-3% from last month</p>
      </div>
      <div class="hdx_card">
        <p class="hdx_text-sm hdx_text-text-muted">Conversion</p>
        <p class="hdx_text-2xl hdx_font-bold hdx_text-text hdx_mt-1">3.2%</p>
        <p class="hdx_text-xs hdx_text-success hdx_mt-2">+0.5% from last month</p>
      </div>
    </div>

    <!-- Content Grid -->
    <div class="hdx_grid hdx_grid-cols-1 lg:hdx_grid-cols-3 hdx_gap-6">

      <!-- Recent Activity -->
      <div class="lg:hdx_col-span-2 hdx_card">
        <div class="hdx_card-header hdx_flex hdx_items-center hdx_justify-between">
          <h2 class="hdx_text-lg hdx_font-semibold hdx_text-text">Recent Activity</h2>
          <button class="hdx_btn hdx_btn-ghost hdx_btn-sm">View All</button>
        </div>
        <div class="hdx_card-body">
          <div class="hdx_flex hdx_flex-col hdx_gap-4">
            <div class="hdx_flex hdx_items-center hdx_gap-3 hdx_p-3 hdx_rounded-lg hdx_hover_bg-surface-secondary hdx_transition">
              <div class="hdx_w-10 hdx_h-10 hdx_rounded-full hdx_bg-primary hdx_flex hdx_items-center hdx_justify-center hdx_text-white hdx_text-sm hdx_font-medium">JD</div>
              <div class="hdx_flex-1">
                <p class="hdx_text-sm hdx_font-medium hdx_text-text">John Doe created a new project</p>
                <p class="hdx_text-xs hdx_text-text-muted">2 minutes ago</p>
              </div>
              <span class="hdx_badge-primary">New</span>
            </div>
            <div class="hdx_flex hdx_items-center hdx_gap-3 hdx_p-3 hdx_rounded-lg hdx_hover_bg-surface-secondary hdx_transition">
              <div class="hdx_w-10 hdx_h-10 hdx_rounded-full hdx_bg-success hdx_flex hdx_items-center hdx_justify-center hdx_text-white hdx_text-sm hdx_font-medium">JS</div>
              <div class="hdx_flex-1">
                <p class="hdx_text-sm hdx_font-medium hdx_text-text">Jane Smith completed a task</p>
                <p class="hdx_text-xs hdx_text-text-muted">15 minutes ago</p>
              </div>
              <span class="hdx_badge-success">Done</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="hdx_card">
        <div class="hdx_card-header">
          <h2 class="hdx_text-lg hdx_font-semibold hdx_text-text">Quick Actions</h2>
        </div>
        <div class="hdx_card-body hdx_flex hdx_flex-col hdx_gap-3">
          <button class="hdx_btn hdx_btn-primary hdx_w-full">New Project</button>
          <button class="hdx_btn hdx_btn-outline hdx_w-full">Invite User</button>
          <button class="hdx_btn hdx_btn-ghost hdx_w-full">View Reports</button>
        </div>
      </div>

    </div>

  </main>

</body>
</html>
```

---

## License

Licensed By HariDevX
--------------------
MIT
