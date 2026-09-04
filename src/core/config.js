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
  return deepMerge(defaults, userConfig);
}

/**
 * Detect the module type of the nearest package.json
 * @param {string} [cwd]
 * @returns {Promise<'module'|'commonjs'>}
 */
export async function getProjectModuleType(cwd = process.cwd()) {
  const fs = await import('node:fs');
  const path = await import('node:path');
  let dir = path.resolve(cwd);

  while (true) {
    const pkgPath = path.join(dir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        return pkg.type === 'module' ? 'module' : 'commonjs';
      } catch {
        return 'commonjs';
      }
    }
    const parent = path.dirname(dir);
    if (parent === dir) return 'commonjs';
    dir = parent;
  }
}

/**
 * Locate an existing HDX config file.
 * Supports hdx.config.mjs / hdx.config.cjs / hdx.config.js, preferring the
 * extension that matches the project's module type.
 * @param {string} [explicitPath] Config path passed via CLI flags
 * @returns {Promise<string|null>}
 */
export async function resolveConfigPath(explicitPath) {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const cwd = process.cwd();

  if (explicitPath) {
    const full = path.resolve(cwd, explicitPath);
    return fs.existsSync(full) ? full : null;
  }

  const type = await getProjectModuleType(cwd);
  const preferred = type === 'module'
    ? ['hdx.config.mjs', 'hdx.config.js', 'hdx.config.cjs']
    : ['hdx.config.cjs', 'hdx.config.js', 'hdx.config.mjs'];

  for (const name of preferred) {
    const full = path.resolve(cwd, name);
    if (fs.existsSync(full)) return full;
  }

  return null;
}

let typelessWarningFilterInstalled = false;
const warningDelegates = [];

/**
 * Route Node's 'warning' events through the original handlers, swallowing the
 * MODULE_TYPELESS_PACKAGE_JSON warning. Node emits that warning via a queued
 * nextTick that can fire after a config import settles, so the filter stays
 * installed for the lifetime of the CLI process (it is a thin, idempotent
 * proxy over the original listeners).
 */
function installTypelessWarningFilter() {
  if (typelessWarningFilterInstalled) return;

  const handlers = process.listeners('warning');
  warningDelegates.push(...handlers);
  for (const handler of handlers) {
    process.removeListener('warning', handler);
  }

  const filtered = (warning) => {
    if (warning && warning.code === 'MODULE_TYPELESS_PACKAGE_JSON') {
      return;
    }
    for (const handler of warningDelegates) {
      handler.call(process, warning);
    }
  };

  process.on('warning', filtered);
  typelessWarningFilterInstalled = true;
}

/**
 * Load config from file path
 * @param {string} [configPath]
 * @returns {Promise<HdxConfig>}
 */
export async function loadConfigFromFile(configPath) {
  const { pathToFileURL } = await import('node:url');

  const fullPath = await resolveConfigPath(configPath);
  if (!fullPath) {
    return getDefaultConfig();
  }

  const fileUrl = pathToFileURL(fullPath).href;
  installTypelessWarningFilter();
  const mod = await import(fileUrl);
  const userConfig = mod.default || mod;

  return loadConfig(userConfig);
}