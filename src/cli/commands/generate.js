import fs from 'node:fs';
import path from 'node:path';
import { loadConfigFromFile } from '../../core/config.js';
import { generateCSS } from '../../generator/index.js';
import { getAnimationKeyframes } from '../../utilities/index.js';
import { success, step } from '../utils.js';

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

      const outDir = path.dirname(path.resolve(process.cwd(), opts.output));
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.resolve(process.cwd(), opts.output), css, 'utf-8');

      success(`Generated ${opts.output}`);
    });
}
