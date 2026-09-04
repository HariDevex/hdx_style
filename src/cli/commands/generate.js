import { loadConfigFromFile } from '../../core/config.js';
import { generateCSS } from '../../generator/index.js';
import { getAnimationKeyframes } from '../../utilities/index.js';
import { success, step, info } from '../utils.js';

/**
 * Register the generate command — simpler, always-full-output build
 * @param {import('commander').Command} program
 */
export function generateCommand(program) {
  program
    .command('generate')
    .description('Generate the full stylesheet (all utilities and variants)')
    .option('-c, --config <path>', 'Config file path (hdx.config.js / .mjs / .cjs)')
    .option('-o, --output <path>', 'Output file path', 'dist/hdx.css')
    .action(async (opts) => {
      step('Generating CSS...');
      const config = await loadConfigFromFile(opts.config);
      let css = generateCSS(config);
      css += '\n/* HDX CSS — Keyframes */\n' + getAnimationKeyframes();

      const fs = await import('node:fs');
      const path = await import('node:path');

      const outDir = path.default.dirname(path.default.resolve(process.cwd(), opts.output));
      fs.default.mkdirSync(outDir, { recursive: true });
      fs.default.writeFileSync(path.default.resolve(process.cwd(), opts.output), css, 'utf-8');

      success(`Generated ${opts.output}`);
    });
}
