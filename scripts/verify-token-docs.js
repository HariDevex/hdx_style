#!/usr/bin/env node

/**
 * HDX Style — Verify every design-token key is documented in README.md.
 * Run with `npm run token-docs:verify` (also part of CI).
 *
 * The README documents color tokens in four places, all maintained by hand:
 *   1. "Colors (semantic)" reference table (Default Values section)
 *   2. "Dark Mode Colors (darkColors)" reference table (Default Values section)
 *   3. `colors: { ... }` code sample (Design Tokens → "Colors (Semantic System)")
 *   4. `darkColors: { ... }` code sample (same section)
 *
 * This script treats src/theme/defaults.js as the single source of truth and
 * fails (exit 1) listing every token missing from its table AND its code
 * sample, so a key added to the theme can never silently ship undocumented.
 * Presence is a token-name check (any spelling/format is acceptable), not a
 * hex-value match.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { defaultTheme } from '../src/theme/defaults.js';

const root = path.dirname(fileURLToPath(import.meta.url));
const README_PATH = path.join(root, '..', 'README.md');
const readme = readFileSync(README_PATH, 'utf-8');

/**
 * Slice the README from one heading to the next `## `/`### ` heading.
 * @param {string} heading
 * @returns {string}
 */
function sectionAfter(heading) {
  const start = readme.indexOf(heading);
  if (start === -1) return null;
  const rest = readme.slice(start + heading.length);
  const end = rest.search(/\n#{2,3} /);
  return end === -1 ? rest : rest.slice(0, end);
}

/**
 * Extract a `key: { ... }` object literal body from a section, starting at the
 * marker and ending at its closing line that is exactly `}`.
 * @param {string} text
 * @param {string} marker
 * @returns {string}
 */
function objectBody(text, marker) {
  const start = text.indexOf(marker);
  if (start === -1) return '';
  const after = text.slice(start + marker.length);
  const close = after.search(/\n}/);
  return close === -1 ? '' : after.slice(0, close);
}

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Does `text` mention this token by name? Matches the token as a backtick-
 * wrapped, quoted, or unquoted `key:` word — never as a substring of another
 * token (e.g. `primary-hover` cannot satisfy `primary`).
 * @param {string} text
 * @param {string} key
 */
function mentions(text, key) {
  const e = esc(key);
  return new RegExp('`' + e + '`|[\'"]' + e + '[\'"]|' + e + '\\s*:').test(text);
}

const colorsSection = sectionAfter('### Colors (semantic)');
const darkSection = sectionAfter('### Dark Mode Colors (');
const systemSection = sectionAfter('### Colors (Semantic System)');
const colorsSample = systemSection ? objectBody(systemSection, 'colors: {') : '';
const darkSample = systemSection ? objectBody(systemSection, 'darkColors: {') : '';

if (!colorsSection || !darkSection || !systemSection) {
  console.error('README color documentation sections not found.');
  process.exit(1);
}

const drift = [];

for (const key of Object.keys(defaultTheme.colors)) {
  if (colorsSection === null || !mentions(colorsSection, key)) {
    drift.push(`  colors.${key}: missing from the "Colors (semantic)" table`);
  }
  if (!mentions(colorsSample, key)) {
    drift.push(`  colors.${key}: missing from the "Colors (Semantic System)" code sample`);
  }
}

for (const key of Object.keys(defaultTheme.darkColors)) {
  if (darkSection === null || !mentions(darkSection, key)) {
    drift.push(`  darkColors.${key}: missing from the "Dark Mode Colors (darkColors)" table`);
  }
  if (!mentions(darkSample, key)) {
    drift.push(`  darkColors.${key}: missing from the darkColors code sample`);
  }
}

if (drift.length > 0) {
  console.error('README token documentation is out of date vs src/theme/defaults.js:');
  console.error(drift.join('\n'));
  console.error('\nAdd the missing tokens to README.md or remove them from defaults.js.');
  process.exit(1);
}

console.log(
  `README token documentation is up to date (${Object.keys(defaultTheme.colors).length} colors + `
  + `${Object.keys(defaultTheme.darkColors).length} darkColors keys verified in tables and samples).`
);