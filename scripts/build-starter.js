#!/usr/bin/env node

/**
 * Build the curated starter stylesheet shipped under ./css — the default
 * import path (`@haridevx/hdx-style/css`).
 *
 * The full utility × variant matrix is ~32 MB, far too large to make the
 * default import. This script generates a hand-curated "core" stylesheet:
 * a representative subset of the most-used utilities across all 20 categories
 * plus the complete component layer. Demand-driven generation (generateCSS
 * with options.utilities + _requestedVariants) emits exactly the chosen
 * utilities × a curated variant set (base + responsive, plus hover/focus on
 * interactive utilities) instead of every combination.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadConfig } from '../src/core/config.js';
import { getAllUtilities } from '../src/utilities/index.js';
import { getAnimationKeyframes } from '../src/utilities/index.js';
import { generateCSS } from '../src/generator/index.js';

const root = path.dirname(fileURLToPath(import.meta.url));

const SIZE_LIMIT_KB = 120;

// Curated "core" utility names per category. Only these become rules; the rest
// of the framework is available through the build/purge/arbitrary paths.
const CURATED = {
  display: [
    'block', 'inline-block', 'inline', 'flex', 'inline-flex', 'grid',
    'inline-grid', 'table', 'table-row', 'table-cell', 'hidden',
  ],
  flexbox: [
    'flex-row', 'flex-col', 'flex-wrap', 'flex-nowrap', 'flex-1', 'flex-initial',
    'grow', 'shrink', 'shrink-0',
    'items-start', 'items-center', 'items-end', 'items-stretch',
    'justify-start', 'justify-center', 'justify-end', 'justify-between',
    'self-start', 'self-center', 'self-end',
    'gap-1', 'gap-2', 'gap-3', 'gap-4',
  ],
  grid: [
    'grid-cols-1', 'grid-cols-2', 'grid-cols-3', 'grid-cols-4', 'grid-cols-6', 'grid-cols-12',
    'col-span-1', 'col-span-2', 'col-span-3', 'col-span-4', 'col-span-6', 'col-span-full',
    'row-span-1', 'row-span-2', 'row-span-3',
    'grid-flow-row', 'grid-flow-col',
  ],
  positioning: [
    'static', 'relative', 'absolute', 'fixed', 'sticky',
    'inset-0', 'inset-x-0', 'inset-y-0',
    'top-0', 'top-auto', 'top-1/2',
    'right-0', 'bottom-0', 'left-0',
  ],
  spacing: [
    'p-0', 'p-1', 'p-2', 'p-3', 'p-4', 'p-6',
    'px-0', 'px-2', 'px-4', 'px-6', 'py-0', 'py-2', 'py-4',
    'pt-0', 'pt-4', 'pb-0', 'pb-4',
    'm-0', 'm-2', 'm-4', 'mx-0', 'mx-auto', 'my-0', 'my-4',
    'mt-0', 'mt-4', 'mt-8', 'mb-0', 'mb-4', 'mb-8',
    'ml-0', 'ml-4', 'mr-0', 'mr-4',
    'space-y-2', 'space-y-4', 'space-x-4',
  ],
  sizing: [
    'w-0', 'w-1', 'w-2', 'w-4', 'w-6', 'w-8', 'w-10', 'w-12', 'w-16', 'w-20',
    'w-full', 'w-screen', 'w-auto',
    'h-1', 'h-2', 'h-4', 'h-6', 'h-8', 'h-10', 'h-12', 'h-16', 'h-20',
    'h-full', 'h-screen', 'h-auto',
    'min-w-0', 'min-w-full', 'min-h-0', 'min-h-full',
    'max-w-xs', 'max-w-sm', 'max-w-md', 'max-w-lg', 'max-w-xl', 'max-w-2xl',
    'max-w-5xl', 'max-w-7xl', 'max-w-full',
  ],
  typography: [
    'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl',
    'font-normal', 'font-medium', 'font-semibold', 'font-bold', 'font-extrabold', 'font-black',
    'leading-none', 'leading-tight', 'leading-normal', 'leading-relaxed', 'leading-loose',
    'tracking-tight', 'tracking-normal', 'tracking-wide',
    'text-left', 'text-center', 'text-right',
    'uppercase', 'lowercase', 'capitalize',
    'italic', 'not-italic', 'underline', 'no-underline',
    'truncate',
    'whitespace-nowrap', 'whitespace-pre-wrap',
  ],
  colors: [
    'text-primary', 'text-secondary', 'text-success', 'text-danger', 'text-warning', 'text-info',
    'text-background', 'text-surface', 'text-surface-secondary', 'text-text', 'text-text-secondary', 'text-text-muted',
    'text-border', 'text-border-strong', 'text-white', 'text-black',
    'text-gray-100', 'text-gray-300', 'text-gray-500', 'text-gray-700', 'text-gray-900',
    'bg-primary', 'bg-secondary', 'bg-success', 'bg-danger', 'bg-warning', 'bg-info',
    'bg-background', 'bg-surface', 'bg-surface-secondary',
    'bg-white', 'bg-black', 'bg-gray-50', 'bg-gray-100', 'bg-gray-500', 'bg-gray-900',
    'border-primary', 'border-secondary', 'border-success', 'border-danger', 'border-warning', 'border-info',
    'border-border', 'border-border-strong', 'border-white', 'border-black',
    'border-gray-200', 'border-gray-300', 'border-gray-400', 'border-gray-600',
    'ring-primary', 'ring-secondary', 'ring-success',
  ],
  backgrounds: ['bg-cover', 'bg-center', 'bg-no-repeat'],
  borders: [
    'border', 'border-0', 'border-2', 'border-4',
    'border-t', 'border-b', 'border-solid', 'border-dashed',
  ],
  'border-radius': [
    'rounded-none', 'rounded-sm', 'rounded-md', 'rounded-lg', 'rounded-xl',
    'rounded-2xl', 'rounded-3xl', 'rounded-full', 'rounded',
  ],
  shadows: [
    'shadow-none', 'shadow-sm', 'shadow-md', 'shadow-lg', 'shadow-xl', 'shadow-2xl', 'shadow-inner',
  ],
  opacity: ['opacity-0', 'opacity-25', 'opacity-50', 'opacity-75', 'opacity-90', 'opacity-100'],
  overflow: ['overflow-auto', 'overflow-hidden', 'overflow-scroll', 'overflow-visible', 'overflow-x-auto', 'overflow-y-auto'],
  'z-index': ['z-0', 'z-10', 'z-20', 'z-30', 'z-40', 'z-50'],
  transforms: [
    'transform', 'scale-95', 'scale-100', 'scale-105', 'scale-110',
    'rotate-45', 'rotate-90', 'rotate-180',
    'translate-x-1/2', '-translate-x-1/2', 'translate-y-1/2', '-translate-y-1/2',
    'origin-center',
  ],
  transitions: [
    'transition', 'transition-colors', 'transition-opacity', 'transition-shadow',
    'transition-transform', 'transition-all',
    'duration-150', 'duration-300', 'duration-500', 'duration-700',
    'ease-linear', 'ease-ease-in-out',
  ],
  animations: ['animate-spin', 'animate-ping', 'animate-pulse', 'animate-bounce'],
  accessibility: ['sr-only', 'not-sr-only', 'focus-ring', 'focus-ring-2', 'focus-ring-primary'],
  interaction: ['cursor-pointer', 'cursor-default', 'cursor-not-allowed', 'select-none', 'select-text', 'appearance-none'],
};

// Categories that get the responsive variant set (sm/md/lg/xl/2xl). Colors,
// shadows, transforms, transitions, animations, accessibility, interaction are
// rarely responsive and stay base-only to keep the starter compact.
const RESPONSIVE_CATEGORIES = new Set([
  'display', 'flexbox', 'grid', 'positioning', 'spacing', 'sizing', 'typography',
  'border-radius',
]);

// Interactive utilities get hover + focus variants.
const STATEABLE = /^(bg|text|border|ring|shadow|transition|scale|rotate|translate|opacity|cursor|select|focus-ring)/;

const RESPONSIVE = ['sm', 'md', 'lg', 'xl', '2xl'];
const STATES = ['hover', 'focus'];

function build() {
  const config = loadConfig();
  const allUtilities = getAllUtilities(config);

  let kept = 0;
  const needed = [];
  for (const util of allUtilities) {
    const allowed = CURATED[util.category] || [];
    if (!allowed.includes(util.name)) continue;

    const combos = RESPONSIVE_CATEGORIES.has(util.category) ? [...RESPONSIVE] : [];
    if (STATEABLE.test(util.name)) combos.push(...STATES);
    needed.push({ ...util, _requestedVariants: combos.map((c) => [c]) });
    kept++;
  }

  // All 58 components ride along (base + their own `states` blocks).
  let css = '/**\n'
    + ' * HDX Style — curated starter stylesheet\n'
    + ' * Reset + design tokens + core utilities + components.\n'
    + ' * Generated from scripts/build-starter.js — do not edit by hand.\n'
    + ' * Full utility × variant matrix: see dist/hdx.css (opt-in).\n'
    + ' */\n\n';
  css += generateCSS(config, { utilities: needed });
  css += '\n/* HDX CSS — Keyframes */\n' + getAnimationKeyframes();

  const outDir = path.join(root, '..', 'css');
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, 'index.css');
  fs.writeFileSync(outFile, css, 'utf-8');

  const kb = (css.length / 1024).toFixed(1);
  console.log(`Starter stylesheet: ${kept} utilities + 58 components -> css/index.css (${kb} KB)`);
  if (css.length / 1024 > SIZE_LIMIT_KB) {
    console.error(`WARNING: starter exceeded ${SIZE_LIMIT_KB} KB gate (${kb} KB). Trim the CURATED list in scripts/build-starter.js.`);
    process.exitCode = 1;
  }
  return kb;
}

const isMain = process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href;
if (isMain) build();

export { build, CURATED, SIZE_LIMIT_KB };