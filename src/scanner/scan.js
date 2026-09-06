import fs from 'node:fs';
import path from 'node:path';
import { generateCSS } from '../generator/index.js';
import { getAnimationKeyframes } from '../utilities/index.js';
import { extractClassNames } from './extractor.js';
import { purgeUnused, findUnknownClasses } from './purger.js';
import { getAllUtilities } from '../utilities/index.js';

/**
 * Escape a string for use inside a RegExp.
 * @param {string} str
 * @returns {string}
 */
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Locate the first occurrence (line, column) of each class name in content.
 * @param {string} content
 * @param {Set<string>} classNames
 * @returns {Map<string, {line: number, column: number}>}
 */
function locateClasses(content, classNames) {
  const positions = new Map();
  const lines = content.split('\n');

  for (const cls of classNames) {
    if (positions.has(cls)) continue;
    for (let i = 0; i < lines.length; i++) {
      const col = lines[i].indexOf(cls);
      if (col !== -1) {
        positions.set(cls, { line: i + 1, column: col + 1 });
        break;
      }
    }
  }
  return positions;
}

/**
 * Scan configured content, resolve the demanded utilities, and generate the
 * production (purged) CSS. Shared by the `build -p` and `watch` commands so the
 * watch output stays as small and correct as a purged build.
 *
 * @param {import('../core/types.js').HdxConfig} config
 * @param {(msg: string) => void} info - logging helper
 * @param {(msg: string) => void} warn - logging helper
 * @returns {Promise<string>} the generated CSS (utilities + components + keyframes)
 */
export async function generatePurgedBuildCss(config, info = () => {}, warn = () => {}) {
  const allUsedClasses = new Set();
  const unknownLocs = new Map();
  const fg = await import('fast-glob');

  for (const pattern of config.content) {
    const files = await fg.default(pattern, { cwd: process.cwd() });
    for (const file of files) {
      const filePath = path.resolve(process.cwd(), file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const classes = extractClassNames(content);
      classes.forEach((c) => allUsedClasses.add(c));

      const positions = locateClasses(content, classes);
      for (const [cls, pos] of positions) {
        if (!unknownLocs.has(cls)) {
          unknownLocs.set(cls, { file, ...pos });
        }
      }
    }
  }

  info(`Found ${allUsedClasses.size} unique class names in content`);

  const allUtilities = getAllUtilities(config);
  const prefix = config.prefix || 'hdx_';
  const neededUtils = purgeUnused(allUtilities, allUsedClasses, prefix, config.safelist || [], config);

  const unknownUtils = findUnknownClasses(allUtilities, allUsedClasses, prefix, config);
  for (const u of unknownUtils) {
    const loc = unknownLocs.get(u.className);
    const where = loc ? ` (${loc.file}:${loc.line}:${loc.column})` : '';
    warn(`Unknown utility "${u.className}"${where} — no CSS generated (did you forget to define it? consider safelist or an arbitrary value).`);
  }

  info(`Keeping ${neededUtils.length} of ${allUtilities.length} utilities`);

  let css = generateCSS(config, { utilities: neededUtils });
  css += '\n/* HDX CSS — Keyframes */\n' + getAnimationKeyframes();

  return css;
}

export { escapeRegExp, locateClasses };
