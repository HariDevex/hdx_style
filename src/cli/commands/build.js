import fs from 'node:fs';
import path from 'node:path';
import { loadConfigFromFile } from '../../core/config.js';
import { generateCSS } from '../../generator/index.js';
import { getAnimationKeyframes } from '../../utilities/index.js';
import { extractClassNames } from '../../scanner/extractor.js';
import { purgeUnused, findUnknownClasses } from '../../scanner/purger.js';
import { getAllUtilities } from '../../utilities/index.js';
import { success, info, step, error, warn } from '../utils.js';

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
 * Register the build command
 * @param {import('commander').Command} program
 */
export function buildCommand(program) {
  program
    .command('build')
    .description('Build production CSS')
    .option('-c, --config <path>', 'Config file path (hdx.config.js / .mjs / .cjs)')
    .option('-o, --output <path>', 'Output file path', 'dist/hdx.css')
    .option('-p, --purge', 'Enable content purging', false)
    .option('--production', 'Production mode (purge + minify hints)', false)
    .action(async (opts) => {
      try {
        step('Loading configuration...');
        const config = await loadConfigFromFile(opts.config);

        const isProduction = opts.production || opts.purge;

        step('Generating CSS...');
        let css;

        if (isProduction && config.content.length > 0) {
          // Production: scan content, resolve needed utilities, generate only those
          step('Scanning content files...');
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

              // Remember the first file:line for every class in this file so
              // unknown utilities can be reported precisely instead of silently
              // dropped during migration.
              const positions = locateClasses(content, classes);
              for (const [cls, pos] of positions) {
                if (!unknownLocs.has(cls)) {
                  unknownLocs.set(cls, { file, ...pos });
                }
              }
            }
          }

          info('Found ' + allUsedClasses.size + ' unique class names in content');

          // Resolve needed utilities (with exact variant combos) via the purger
          const allUtilities = getAllUtilities(config);
          const prefix = config.prefix || 'hdx_';
          const neededUtils = purgeUnused(allUtilities, allUsedClasses, prefix, config.safelist || []);

          // Warn about classes that resolve to no utility, with file:line.
          const unknownUtils = findUnknownClasses(allUtilities, allUsedClasses, prefix);
          for (const u of unknownUtils) {
            const loc = unknownLocs.get(u.className);
            const where = loc ? ' (' + loc.file + ':' + loc.line + ':' + loc.column + ')' : '';
            warn('Unknown utility "' + u.className + '"' + where + ' — no CSS generated (did you forget to define it? consider safelist or an arbitrary value).');
          }

          info('Keeping ' + neededUtils.length + ' of ' + allUtilities.length + ' utilities');

          css = generateCSS(config, { utilities: neededUtils });
        } else {
          if (config.content.length > 0) {
            warn('Full build — generating every utility × variant combination. Pass -p/--purge or --production for a much smaller production build.');
          }
          css = generateCSS(config);
        }

        // Add keyframes
        css += '\n/* HDX CSS — Keyframes */\n' + getAnimationKeyframes();

        // Write output
        const outDir = path.dirname(path.resolve(process.cwd(), opts.output));
        fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(path.resolve(process.cwd(), opts.output), css, 'utf-8');

        success('Built ' + opts.output + ' (' + (css.length / 1024).toFixed(1) + ' KB)');
      } catch (err) {
        error(err.message);
        process.exit(1);
      }
    });
}
