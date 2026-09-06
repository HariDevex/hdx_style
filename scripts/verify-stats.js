#!/usr/bin/env node

/**
 * HDX Style — Verify the "Verified Statistics" table in the README matches the
 * numbers actually computed from source. Run with `npm run stats:verify`.
 *
 * Fails (exit 1) listing every row that drifted and its computed value, so CI
 * catches outdated docs the moment a utility, component, variant, test, or
 * dependency changes.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { collectStats } from '../stats.js';

const root = path.dirname(fileURLToPath(import.meta.url));
const README_PATH = path.join(root, '..', 'README.md');
const readme = readFileSync(README_PATH, 'utf-8');

// Scope lookups to the Verified Statistics table so metric names elsewhere in
// the README can't produce false matches.
const heading = '### 📊 Verified Statistics';
const sectionStart = readme.indexOf(heading);
if (sectionStart === -1) {
  console.error('README "### 📊 Verified Statistics" heading not found.');
  process.exit(1);
}
const rest = readme.slice(sectionStart);
const sectionEnd = rest.search(/\n---\n/);
const section = sectionEnd === -1 ? rest : rest.slice(0, sectionEnd);

const rowFor = (metric) => {
  const esc = metric.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const m = section.match(new RegExp('\\|\\s*' + esc + '\\s*\\|\\s*([^|]+)\\|'));
  return m ? m[1].trim() : null;
};

// Strip markdown bold markers, commas, and surrounding spaces from a cell so
// "**1,576**" compares to the plain "1576" the source computes.
const norm = (s) => String(s).replace(/[*,\s]/g, '');

const stats = collectStats();
const pkg = JSON.parse(readFileSync(path.join(root, '..', 'package.json'), 'utf-8'));

const expected = {
  '📦 Utilities': stats.utilities.length,
  '🗂️ Utility categories': stats.utilCategories.length,
  '🧩 Components': stats.components.length,
  '🎛️ Variants': stats.variants.length,
  '📐 Responsive breakpoints': stats.breakpoints,
  '✅ Tests': stats.tests,
  '📄 Source files': stats.srcFiles,
  '⚙️ Runtime dependencies': stats.deps,
};

// Rows whose stated value is a fixed fact checkable from package.json.
const depRows = {
  '🚫 PostCSS dependency': 'postcss',
  '🚫 Tailwind dependency': 'tailwindcss',
};

const drift = [];

for (const [metric, value] of Object.entries(expected)) {
  const cell = rowFor(metric);
  if (cell === null) {
    drift.push(`  ${metric}: row not found in the Verified Statistics table`);
  } else if (norm(cell) !== String(value)) {
    drift.push(`  ${metric}: README says "${cell}" but source computes ${value}`);
  }
}

for (const [metric, dep] of Object.entries(depRows)) {
  const cell = rowFor(metric);
  const present = Object.keys(pkg.dependencies || {}).includes(dep);
  if (cell === null) {
    drift.push(`  ${metric}: row not found in the Verified Statistics table`);
  } else if (norm(cell) !== (present ? 'Yes' : 'No')) {
    drift.push(`  ${metric}: README says "${cell}" but ${dep} is ${present ? 'a dependency' : 'not a dependency'}`);
  }
}

if (drift.length > 0) {
  console.error('README "Verified Statistics" table is out of date:');
  console.error(drift.join('\n'));
  console.error('\nRun `node stats.js` and update README.md.');
  process.exit(1);
}

console.log('README "Verified Statistics" table is up to date.');