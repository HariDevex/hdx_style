import { defaultConfig } from '../theme/defaults.js';
import { deepMerge } from '../theme/merge.js';

/**
 * Get default configuration
 * @returns {HdxConfig}
 */
export function getDefaultConfig() {
  return structuredClone(defaultConfig);
}

/**
 * Load and merge configuration
 * @param {Partial<HdxConfig>} [userConfig]
 * @returns {HdxConfig}
 */
export function loadConfig(userConfig = {}) {
  const defaults = getDefaultConfig();
  const merged = deepMerge(defaults, userConfig);

  // Merge theme deeply
  if (userConfig.theme) {
    merged.theme = deepMerge(defaults.theme, userConfig.theme);
  }

  return merged;
}

/**
 * Load config from file path
 * @param {string} [configPath]
 * @returns {Promise<HdxConfig>}
 */
export async function loadConfigFromFile(configPath = 'hdx.config.js') {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const { pathToFileURL } = await import('node:url');

  const fullPath = path.resolve(process.cwd(), configPath);

  if (!fs.existsSync(fullPath)) {
    return getDefaultConfig();
  }

  const fileUrl = pathToFileURL(fullPath).href;
  const mod = await import(fileUrl);
  const userConfig = mod.default || mod;

  return loadConfig(userConfig);
}
