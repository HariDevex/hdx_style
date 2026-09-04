import { loadConfigFromFile, resolveConfigPath } from '../../core/config.js';
import { generateCSS } from '../../generator/index.js';
import { getAnimationKeyframes } from '../../utilities/index.js';
import { success, info } from '../utils.js';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Register the watch command
 * @param {import('commander').Command} program
 */
export function watchCommand(program) {
  program
    .command('watch')
    .description('Watch for changes and rebuild CSS')
    .option('-c, --config <path>', 'Config file path (hdx.config.js / .mjs / .cjs)')
    .option('-o, --output <path>', 'Output file path', 'dist/hdx.css')
    .action(async (opts) => {
      const chokidar = await import('chokidar');

      let buildTimeout = null;

      async function rebuild() {
        try {
          const config = await loadConfigFromFile(opts.config);
          let css = generateCSS(config);
          css += '\n/* HDX CSS — Keyframes */\n' + getAnimationKeyframes();

          const outDir = path.dirname(path.resolve(process.cwd(), opts.output));
          fs.mkdirSync(outDir, { recursive: true });
          fs.writeFileSync(path.resolve(process.cwd(), opts.output), css, 'utf-8');

          success(`Rebuilt ${opts.output}`);
        } catch (err) {
          console.error(err.message);
        }
      }

      function debounce() {
        if (buildTimeout) clearTimeout(buildTimeout);
        buildTimeout = setTimeout(rebuild, 300);
      }

      // Initial build
      await rebuild();

      // Watch config
      const configPath = await resolveConfigPath(opts.config);
      if (configPath) {
        chokidar.default.watch(configPath).on('change', () => {
          info('Config changed, rebuilding...');
          debounce();
        });
      }

      // Watch content files
      const config = await loadConfigFromFile(opts.config);
      if (config.content.length > 0) {
        chokidar.default.watch(config.content, { cwd: process.cwd() }).on('change', () => {
          info('Content changed, rebuilding...');
          debounce();
        });
      }

      info('Watching for changes...');
    });
}
