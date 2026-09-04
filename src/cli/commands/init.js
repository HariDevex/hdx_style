import fs from 'node:fs';
import path from 'node:path';
import { getProjectModuleType, resolveConfigPath } from '../../core/config.js';
import { success, info } from '../utils.js';

const esmConfigContent = `export default {
  // HDX CSS Configuration
  prefix: 'hdx_',

  // Content files to scan for used classes
  content: [
    './src/**/*.{html,js,jsx,ts,tsx,vue,svelte}',
  ],

  // Dark mode strategy: 'class' | 'media' | 'both'
  darkMode: 'class',

  // Theme customization (override defaults)
  theme: {
    colors: {
      // primary: '#7C3AED',
      // 'primary-hover': '#6D28D9',
    },
    spacing: {},
    fontSize: {},
    breakpoints: {},
    radius: {},
    shadows: {},
  },

  // Plugins
  plugins: [],
};
`;

const cjsConfigContent = `module.exports = {
  // HDX CSS Configuration
  prefix: 'hdx_',

  // Content files to scan for used classes
  content: [
    './src/**/*.{html,js,jsx,ts,tsx,vue,svelte}',
  ],

  // Dark mode strategy: 'class' | 'media' | 'both'
  darkMode: 'class',

  // Theme customization (override defaults)
  theme: {
    colors: {
      // primary: '#7C3AED',
      // 'primary-hover': '#6D28D9',
    },
    spacing: {},
    fontSize: {},
    breakpoints: {},
    radius: {},
    shadows: {},
  },

  // Plugins
  plugins: [],
};
`;

/**
 * Register the init command
 * @param {import('commander').Command} program
 */
export function initCommand(program) {
  program
    .command('init')
    .description('Initialize HDX config in current directory')
    .action(async () => {
      const existing = await resolveConfigPath();
      if (existing) {
        info(path.basename(existing) + ' already exists. Skipping.');
        return;
      }

      const type = await getProjectModuleType(process.cwd());
      const isEsm = type === 'module';
      const filename = isEsm ? 'hdx.config.js' : 'hdx.config.cjs';
      const configPath = path.resolve(process.cwd(), filename);

      fs.writeFileSync(configPath, isEsm ? esmConfigContent : cjsConfigContent, 'utf-8');
      success('Created ' + filename + (isEsm ? '' : ' (CommonJS)'));
    });
}