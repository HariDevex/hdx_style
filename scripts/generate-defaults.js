/**
 * Generate default-values.txt — a readable dump of every default shipped in
 * src/theme/defaults.js. Run with `npm run defaults`.
 *
 * The output is intentionally deterministic: sections are emitted in a fixed
 * order and keys are aligned, so a regeneration only ever produces a real diff
 * when a default actually changes.
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { defaultConfig, defaultTheme, defaultFontFamily } from '../src/theme/defaults.js';

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'default-values.txt');
const DIVIDER = '----------------------------------------';

const lines = [
  '========================================',
  ' HDX STYLE — DEFAULT VALUES',
  ' Source: src/theme/defaults.js',
  '========================================',
  '',
];

const section = (title, body = []) => {
  lines.push(title, DIVIDER, ...body, '');
};
const pair = (key, value, pad) => '  ' + key.padEnd(pad) + ': ' + value;
const pairs = (obj, pad) => Object.entries(obj).map(([k, v]) => pair(k, v, pad));

const REM_TO_PX = (rem) => Math.round(parseFloat(rem.replace('rem', '')) * 16);

section('1. DEFAULT CONFIG', [
  pair('prefix', defaultConfig.prefix, 14),
  pair('content', JSON.stringify(defaultConfig.content), 14),
  pair('safelist', JSON.stringify(defaultConfig.safelist), 14),
  pair('darkMode', defaultConfig.darkMode + '   (class | media | both | none)', 14),
  pair('reset', String(defaultConfig.reset), 14),
  pair('components', String(defaultConfig.components), 14),
  pair('plugins', JSON.stringify(defaultConfig.plugins), 14),
  pair('theme', '(full set below, deep-merged with user values)', 14),
]);

// Wrap the font family so it reads as two short lines instead of one long one.
const atApple = defaultFontFamily.indexOf(', -apple-system,');
const fontFamilyLines = [
  defaultFontFamily.slice(0, atApple + ', -apple-system,'.length),
  defaultFontFamily.slice(atApple + ', -apple-system,'.length + 1),
];
section('2. DEFAULT FONT FAMILY (applied to body via the reset)', fontFamilyLines.map(l => '  ' + l));

const remSpacing = (obj) => Object.entries(obj).map(([k, v]) => {
  if (!v.endsWith('rem')) return `  ${k.padEnd(3)}: ${v}`;
  return `  ${k.padEnd(3)}: ${v.padEnd(7)}   (${REM_TO_PX(v)}px)`;
});

section('3. FONT SIZE', pairs(defaultTheme.fontSize, 5));
section('4. FONT WEIGHT', pairs(defaultTheme.fontWeight, 11));
section('5. LINE HEIGHT', pairs(defaultTheme.lineHeight, 7));
section('6. LETTER SPACING', pairs(defaultTheme.letterSpacing, 8));
section('7. COLORS (semantic)', pairs(defaultTheme.colors, 17));
section('8. DARK MODE COLORS (darkColors, used under .hdx_dark / prefers-color-scheme)', pairs(defaultTheme.darkColors, 18));
section('9. SPACING', remSpacing(defaultTheme.spacing));
section('10. BORDER RADIUS', pairs(defaultTheme.radius, 5));
section('11. SHADOWS', pairs(defaultTheme.shadows, 6));
section('12. BREAKPOINTS', pairs(defaultTheme.breakpoints, 4));
section('13. OPACITY', pairs(defaultTheme.opacity, 4));
section('14. Z-INDEX', pairs(defaultTheme.zIndex, 5));
section('15. TRANSITION DURATION', pairs(defaultTheme.transitionDuration, 5));
section('16. TRANSITION TIMING', pairs(defaultTheme.transitionTiming, 12));

writeFileSync(OUT, lines.join('\n').trimEnd() + '\n', 'utf-8');
console.log('Wrote default-values.txt');