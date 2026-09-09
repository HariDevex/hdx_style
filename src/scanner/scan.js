import fs from 'node:fs';
import path from 'node:path';
import { generateCSS } from '../generator/index.js';
import { getAnimationKeyframes } from '../utilities/index.js';
import { extractClassNames } from './extractor.js';
import { purgeUnused, purgeComponents, findUnknownClasses } from './purger.js';
import { parseClass, getVariantPrefixes } from '../core/parser.js';
import { getAllUtilities } from '../utilities/index.js';
import { getAllComponents } from '../components/index.js';
import { runPlugins } from '../plugins/index.js';

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
 * Matches must sit on token boundaries so `hdx-flex` isn't reported inside
 * `hdx-flexbox` or `hdx-flex-1`.
 * @param {string} content
 * @param {Set<string>} classNames
 * @returns {Map<string, {line: number, column: number}>}
 */
function locateClasses(content, classNames) {
  const positions = new Map();

  for (const cls of classNames) {
    if (positions.has(cls)) continue;
    const pos = findClassIndex(content, cls);
    if (pos === -1) continue;
    const lineStart = content.lastIndexOf('\n', pos) + 1;
    positions.set(cls, {
      line: content.slice(0, pos).split('\n').length,
      column: pos - lineStart + 1,
    });
  }
  return positions;
}

/**
 * Create an empty scanning state for watch-mode incremental rebuilds.
 *
 * `fileCache` maps absolute file paths to their extracted class names and
 * unknown-class locations. `changedFiles` is a Set of absolute paths that must
 * be re-read on the next build (or null to force a full re-scan, e.g. after a
 * config change or on the first build).
 * @returns {{ fileCache: Map<string, { classes: Set<string>, locs: Map<string, object> }>, changedFiles: Set<string>|null }}
 */
export function createScanState() {
  return { fileCache: new Map(), changedFiles: null };
}

/**
 * Scan the configured content patterns and collect used class names plus their
 * first-known locations. Shared by the purged-build pipeline and the `--explain`
 * report so both describe exactly the same demand set.
 *
 * When `state` is provided, only files listed in `state.changedFiles` are
 * re-read (see `createScanState`); otherwise every content file is read.
 *
 * @param {import('../core/types.js').HdxConfig} config
 * @param {{ fileCache?: Map<string, { classes: Set<string>, locs: Map<string, object> }>, changedFiles?: Set<string>|null }} [state]
 * @param {string} [cwd] - Base directory for the content globs (defaults to
 *   process.cwd(); the Vite plugin passes the resolved Vite root).
 * @returns {Promise<{ allUsedClasses: Set<string>, unknownLocs: Map<string, { file: string, line: number, column: number }> }>}
 */
export async function scanContent(config, state = {}, cwd = process.cwd()) {
  const fileCache = state.fileCache || new Map();
  const changedFiles = state.changedFiles || null;
  const allUsedClasses = new Set();
  const unknownLocs = new Map();
  const fg = await import('fast-glob');
  const prefix = config.prefix || 'hdx-';

  for (const pattern of config.content) {
    const files = await fg.default(pattern, { cwd });
    for (const rel of files) {
      const filePath = path.resolve(cwd, rel);

      // Incremental path: reuse cached classes for untouched files, re-reading
      // only the files that actually changed.
      if (changedFiles && fileCache.has(filePath) && !changedFiles.has(filePath)) {
        const cached = fileCache.get(filePath);
        cached.classes.forEach((c) => allUsedClasses.add(c));
        for (const [cls, entry] of cached.locs) {
          if (!unknownLocs.has(cls)) unknownLocs.set(cls, entry);
        }
        continue;
      }

      const content = fs.readFileSync(filePath, 'utf-8');
      const classes = extractClassNames(content, prefix);
      classes.forEach((c) => allUsedClasses.add(c));

      const positions = locateClasses(content, classes);
      const locs = new Map();
      for (const [cls, pos] of positions) {
        const entry = { file: rel, ...pos };
        locs.set(cls, entry);
        if (!unknownLocs.has(cls)) {
          unknownLocs.set(cls, entry);
        }
      }

      if (fileCache === state.fileCache) fileCache.set(filePath, { classes, locs });
    }
  }

  // Prune cache entries for files that disappeared from the content patterns.
  if (changedFiles && fileCache.size > 0) {
    const current = new Set((await fg.default(config.content, { cwd })).map((f) => path.resolve(cwd, f)));
    for (const cachedPath of fileCache.keys()) {
      if (!current.has(cachedPath)) fileCache.delete(cachedPath);
    }
  }

  return { allUsedClasses, unknownLocs };
}

/**
 * Scan configured content, resolve the demanded utilities, and generate the
 * production (purged) CSS. Shared by the `build -p` and `watch` commands so the
 * watch output stays as small and correct as a purged build.
 *
 * When `state` is provided, only files listed in `state.changedFiles` are
 * re-read on subsequent calls; the class names (and unknown-class locations) of
 * every other file are reused from `state.fileCache`, skipping the disk read
 * entirely.
 *
 * @param {import('../core/types.js').HdxConfig} config
 * @param {(msg: string) => void} info - logging helper
 * @param {(msg: string) => void} warn - logging helper
 * @param {{ fileCache?: Map<string, { classes: Set<string>, locs: Map<string, object> }>, changedFiles?: Set<string>|null }} [state]
 * @param {string} [cwd] - Base directory for content globs (defaults to
 *   process.cwd(); the Vite plugin passes the resolved Vite root).
 * @returns {Promise<string>} the generated CSS (utilities + components + keyframes)
 */
export async function generatePurgedBuildCss(config, info = () => {}, warn = () => {}, state = {}, cwd = process.cwd()) {
  const { allUsedClasses, unknownLocs } = await scanContent(config, state, cwd);
  const prefix = config.prefix || 'hdx-';

  info(`Found ${allUsedClasses.size} unique class names in content`);

  // Run plugins once so plugin utilities are purge-resolvable and plugin
  // variant prefixes parse correctly (e.g. hdx-swipe_bg-primary).
  const { registry } = runPlugins(config);
  const pluginUtilities = registry.utilities;
  const extraVariantPrefixes = registry.variants.map(v => v.prefix.replace(/_$/, ''));

  const allUtilities = [...getAllUtilities(config), ...pluginUtilities];
  const allComponents = config.components === false
    ? []
    : [...getAllComponents(config), ...registry.components];
  const componentNames = new Set(allComponents.map(c => c.name));
  const safelist = config.safelist || [];
  const neededUtils = purgeUnused(allUtilities, allUsedClasses, prefix, safelist, config, extraVariantPrefixes);
  // Components ride the same demand-driven path as utilities: a component (and
  // its `states` blocks) is emitted only when its base class appears in content
  // or the safelist. Composed usage like `hdx-btn hdx-btn-primary` keeps both
  // `btn` and `btn-primary` independently (each is its own definition).
  const neededComponents = purgeComponents(allComponents, allUsedClasses, prefix, safelist, config, extraVariantPrefixes);

  const unknownUtils = findUnknownClasses(allUtilities, allUsedClasses, prefix, config, componentNames, extraVariantPrefixes);
  for (const u of unknownUtils) {
    const loc = unknownLocs.get(u.className);
    const where = loc ? ` (${loc.file}:${loc.line}:${loc.column})` : '';
    warn(`Unknown utility "${u.className}"${where} — no CSS generated (did you forget to define it? consider safelist or an arbitrary value).`);
  }

  info(`Keeping ${neededUtils.length} of ${allUtilities.length} utilities`);
  info(`Keeping ${neededComponents.length} of ${allComponents.length} components`);

  let css = generateCSS(config, { utilities: neededUtils, components: neededComponents, _registry: registry });
  css += '\n/* HDX CSS — Keyframes */\n' + getAnimationKeyframes(prefix);

  return css;
}

export { escapeRegExp, locateClasses };

// Characters that can appear inside an HDX class token: word chars plus the
// prefix/variant/arbitrary punctuation. A match must be surrounded by
// non-token characters (whitespace, quotes, tag delimiters, …) so `hdx-flex`
// isn't counted inside `hdx-flexbox`, `hdx-flex-1`, `hdx-md_flexed`, etc.
const TOKEN_CHAR = /[\w\-/\\[\]\\.:%#(),*+]/;

/**
 * Find all boundary-clean occurrences of a class name in content.
 * @param {string} content
 * @param {string} className
 * @returns {number[]} Match start indices
 */
function findClassIndices(content, className) {
  const out = [];
  let index = 0;
  while ((index = content.indexOf(className, index)) !== -1) {
    const before = content[index - 1];
    const after = content[index + className.length];
    const okBefore = before === undefined || !TOKEN_CHAR.test(before);
    const okAfter = after === undefined || !TOKEN_CHAR.test(after);
    if (okBefore && okAfter) out.push(index);
    index += className.length;
  }
  return out;
}

/**
 * First boundary-clean index of a class name, or -1.
 * @param {string} content
 * @param {string} className
 * @returns {number}
 */
function findClassIndex(content, className) {
  const [first] = findClassIndices(content, className);
  return first === undefined ? -1 : first;
}

/**
 * Count non-overlapping boundary-clean occurrences of a class name inside
 * content.
 * @param {string} content
 * @param {string} className
 * @returns {number}
 */
export function countClassOccurrences(content, className) {
  if (!className) return 0;
  return findClassIndices(content, className).length;
}

/**
 * Produce a structured debug report of a purged build: every kept class with
 * its usage count and first location, plus all unknowns. Variant classes are
 * aggregated onto their base utility (matching purged output), so
 * `hdx-md_flex` is reported as the kept `hdx-flex`. This backs the
 * `build --explain` flag (no CSS is generated).
 *
 * @param {import('../core/types.js').HdxConfig} config
 * @param {(msg: string) => void} warn
 * @returns {Promise<{
 *   classes: { className: string, kind: 'utility'|'component', count: number, location: string }[],
 *   unknown: { className: string, location: string }[],
 *   totals: { classes: number, utilities: number, components: number, unknown: number },
 * }>}
 */
export async function explainBuild(config, warn = () => {}) {
  const { allUsedClasses, unknownLocs } = await scanContent(config);
  const fg = await import('fast-glob');
  const prefix = config.prefix || 'hdx-';

  // Count occurrences and remember the first location of every used class.
  const counts = new Map();
  const locations = new Map();
  for (const pattern of config.content) {
    const files = await fg.default(pattern, { cwd: process.cwd() });
    for (const rel of files) {
      const filePath = path.resolve(process.cwd(), rel);
      const content = fs.readFileSync(filePath, 'utf-8');
      for (const cls of allUsedClasses) {
        const n = countClassOccurrences(content, cls);
        if (n > 0) counts.set(cls, (counts.get(cls) || 0) + n);
        if (n > 0 && !locations.has(cls)) {
          const line = content.slice(0, content.indexOf(cls)).split('\n').length;
          const column = content.slice(content.lastIndexOf('\n', content.indexOf(cls)) + 1, content.indexOf(cls)).length + 1;
          locations.set(cls, { file: rel, line, column });
        }
      }
    }
  }

  const { registry } = runPlugins(config);
  const extraVariantPrefixes = registry.variants.map(v => v.prefix.replace(/_$/, ''));
  // Aggregate with the same variant prefixes the purge actually uses (custom
  // breakpoints, plugin addVariant(), …), so the report matches the build.
  const variantPrefixes = [...getVariantPrefixes(config), ...extraVariantPrefixes];
  const allUtilities = [...getAllUtilities(config), ...registry.utilities];
  const allComponents = allComponentsOf(config, registry);
  const componentNames = new Set(allComponents.map(c => c.name));
  const neededUtils = new Set(purgeUnused(allUtilities, allUsedClasses, prefix, config.safelist || [], config, extraVariantPrefixes).map(u => prefix + u.name));
  const neededComponents = new Set(purgeComponents(allComponents, allUsedClasses, prefix, config.safelist || [], config, extraVariantPrefixes).map(c => prefix + c.name));
  const unknown = findUnknownClasses(allUtilities, allUsedClasses, prefix, config, componentNames, extraVariantPrefixes);

  // Aggregate every used class onto its base utility/component so the table
  // matches what the generator actually keeps.
  const agg = new Map();
  for (const cls of allUsedClasses) {
    const parsed = parseClass(cls, prefix, variantPrefixes);
    if (!parsed.valid) continue;
    const base = prefix + parsed.utility;
    const kind = neededUtils.has(base) ? 'utility' : neededComponents.has(base) ? 'component' : null;
    if (!kind) continue;

    const loc = locations.get(cls) || unknownLocs.get(cls);
    const row = agg.get(base) || { className: base, kind, count: 0, location: '—' };
    row.count += counts.get(cls) || 0;
    if (loc && row.location === '—') row.location = `${loc.file}:${loc.line}:${loc.column}`;
    agg.set(base, row);
  }
  const classes = [...agg.values()].sort((a, b) => b.count - a.count || a.className.localeCompare(b.className));

  const unknownRows = unknown.map((u) => {
    const loc = unknownLocs.get(u.className);
    return { className: u.className, location: loc ? `${loc.file}:${loc.line}:${loc.column}` : '—' };
  });

  return {
    classes,
    unknown: unknownRows,
    totals: {
      classes: classes.length,
      utilities: classes.filter((c) => c.kind === 'utility').length,
      components: classes.filter((c) => c.kind === 'component').length,
      unknown: unknownRows.length,
    },
  };
}

function allComponentsOf(config, registry) {
  return config.components === false ? [] : [...getAllComponents(config), ...registry.components];
}
