import fs from 'node:fs';
import path from 'node:path';
import { loadConfigFromFile } from '../../core/config.js';
import { generateCSS } from '../../generator/index.js';
import { getAnimationKeyframes } from '../../utilities/index.js';
import { success, info, step, error, warn } from '../utils.js';
import { generatePurgedBuildCss } from '../../scanner/scan.js';

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
          css = await generatePurgedBuildCss(config, info, warn);
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
