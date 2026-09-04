import fs from 'node:fs';
import path from 'node:path';
import { loadConfigFromFile } from '../../core/config.js';
import { generateCSS } from '../../generator/index.js';
import { getAnimationKeyframes } from '../../utilities/index.js';
import { extractClassNames } from '../../scanner/extractor.js';
import { purgeUnused } from '../../scanner/purger.js';
import { getAllUtilities } from '../../utilities/index.js';
import { success, info, step, error } from '../utils.js';

/**
 * Register the build command
 * @param {import('commander').Command} program
 */
export function buildCommand(program) {
  program
    .command('build')
    .description('Build production CSS')
    .option('-c, --config <path>', 'Config file path', 'hdx.config.js')
    .option('-o, --output <path>', 'Output file path', 'dist/hdx.css')
    .option('-p, --purge', 'Enable content purging', false)
    .action(async (opts) => {
      try {
        step('Loading configuration...');
        const config = await loadConfigFromFile(opts.config);

        step('Generating CSS...');
        let css = generateCSS(config);

        // Add keyframes
        css += '\n/* HDX CSS — Keyframes */\n' + getAnimationKeyframes();

        // Purge if requested
        if (opts.purge && config.content.length > 0) {
          step('Scanning content files...');
          const allUsedClasses = new Set();
          const fg = await import('fast-glob');

          for (const pattern of config.content) {
            const files = await fg.default(pattern, { cwd: process.cwd() });
            for (const file of files) {
              const filePath = path.resolve(process.cwd(), file);
              const content = fs.readFileSync(filePath, 'utf-8');
              const classes = extractClassNames(content);
              classes.forEach((c) => allUsedClasses.add(c));
            }
          }

          info(`Found ${allUsedClasses.size} unique class names in content`);

          // Filter CSS to only include used utilities
          const allUtilities = getAllUtilities(config);
          const usedUtils = purgeUnused(allUtilities, allUsedClasses, config.prefix, config.safelist || []);
          info(`Keeping ${usedUtils.length} of ${allUtilities.length} utilities`);

          // Re-generate with only used utilities
          const purgedConfig = { ...config, _purgedUtilities: usedUtils };
          css = generateCSS(purgedConfig);
          css += '\n/* HDX CSS — Keyframes */\n' + getAnimationKeyframes();
        }

        // Write output
        const outDir = path.dirname(path.resolve(process.cwd(), opts.output));
        fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(path.resolve(process.cwd(), opts.output), css, 'utf-8');

        success(`Built ${opts.output} (${(css.length / 1024).toFixed(1)} KB)`);
      } catch (err) {
        error(err.message);
        process.exit(1);
      }
    });
}
