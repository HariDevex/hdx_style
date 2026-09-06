import { loadConfigFromFile, resolveConfigPath } from '../../core/config.js';
import { generateCSS } from '../../generator/index.js';
import { getAnimationKeyframes } from '../../utilities/index.js';
import { generatePurgedBuildCss } from '../../scanner/scan.js';
import { success, info, warn } from '../utils.js';
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
    .option('--no-purge', 'Disable content purging in watch mode (full build)')
    .action(async (opts) => {
      const chokidar = await import('chokidar');

      let buildTimeout = null;

      async function rebuild() {
        try {
          // Fresh config on every rebuild so config edits are picked up in
          // watch mode. bustCache is scoped to this path: the ESM cache-bust
          // accumulates module-map entries, so it must not be used by the
          // one-shot build/generate commands.
          const config = await loadConfigFromFile(opts.config, { bustCache: true });

          let css;
          const purge = opts.purge !== false;
          if (purge && config.content.length > 0) {
            // Watch mirrors the `build -p` path: scan content and generate only
            // the demanded utilities + variants so the dev output stays small.
            css = await generatePurgedBuildCss(config, info, warn);
          } else {
            if (config.content.length > 0) {
              warn('Full rebuild (watch --no-purge) — generating every utility × variant combination.');
            }
            css = generateCSS(config);
            css += '\n/* HDX CSS — Keyframes */\n' + getAnimationKeyframes();
          }

          const outDir = path.dirname(path.resolve(process.cwd(), opts.output));
          fs.mkdirSync(outDir, { recursive: true });
          fs.writeFileSync(path.resolve(process.cwd(), opts.output), css, 'utf-8');

          success(`Rebuilt ${opts.output} (${(css.length / 1024).toFixed(1)} KB)`);
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
