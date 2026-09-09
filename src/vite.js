import fs from 'node:fs';
import path from 'node:path';
import { loadConfigFromFile } from './core/config.js';
import { generatePurgedBuildCss } from './scanner/scan.js';

/**
 * Resolve the project's HDX config path relative to a root directory.
 * @param {string} root
 * @param {string|null} explicit
 * @returns {string|null}
 */
function resolveConfig(root, explicit) {
  if (explicit) {
    const full = path.resolve(root, explicit);
    return fs.existsSync(full) ? full : null;
  }
  for (const name of ['hdx.config.mjs', 'hdx.config.js', 'hdx.config.cjs']) {
    const full = path.join(root, name);
    if (fs.existsSync(full)) return full;
  }
  return null;
}

/**
 * Whether a changed file path is covered by any of the config's content globs.
 * @param {string} file - absolute path of the changed file
 * @param {string[]} patterns - content glob patterns
 * @param {string} root
 * @returns {Promise<boolean>}
 */
async function matchesContent(file, patterns, root) {
  if (patterns.length === 0) return false;
  const { default: fg } = await import('fast-glob');
  for (const pattern of patterns) {
    const abs = pattern.startsWith('/') || /^[A-Za-z]:[\\/]/.test(pattern)
      ? path.resolve(pattern)
      : path.resolve(root, pattern);
    const matched = await fg(abs, { onlyFiles: true });
    if (matched.some((m) => path.resolve(m) === file)) return true;
  }
  return false;
}

/**
 * Native HDX Style Vite plugin (zero dependencies).
 *
 * Regenerates the purged stylesheet by reusing `generatePurgedBuildCss` and
 * writes it to `options.output` (default `dist/hdx.css`). Content files are
 * watched through Vite's own file watcher:
 *  - in `vite build --watch` / `viteServer.watcher`, `watchChange` rebuilds;
 *  - in the dev server, `handleHotUpdate` rebuilds and full-reloads so the
 *    freshly written CSS is picked up.
 *
 * No build-time import is required — link the output directly in your HTML:
 *   <link rel="stylesheet" href="/dist/hdx.css" />
 * For a Vite-served dev pipeline import it from the virtual module instead:
 *   import 'virtual:hdx-style'; // transformed with Vite's CSS pipeline + HMR
 *
 * @param {{ config?: string, output?: string }} [options]
 * @returns {import('vite').Plugin}
 */
export function hdxVitePlugin(options = {}) {
  let root = process.cwd();
  let configPath = null;
  let patterns = [];
  let lastWrite = '';

  async function writeStyles() {
    // bustCache ensures config edits on disk are re-read instead of the stale
    // loaded config from the first call, and cwd is the Vite root so content
    // globs resolve relative to the project (not the process CWD).
    const cfg = await loadConfigFromFile(configPath, { bustCache: true });
    patterns = cfg.content || [];
    const css = await generatePurgedBuildCss(cfg, () => {}, () => {}, {}, root);
    const out = path.resolve(root, options.output || 'dist/hdx.css');
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, css, 'utf-8');
    lastWrite = out;
    return out;
  }

  let virtualServing = false;

  return {
    name: 'hdx-style',
    enforce: 'pre',

    configResolved(config) {
      if (config.root) root = config.root;
      configPath = resolveConfig(root, options.config || null);
    },

    async buildStart() {
      await writeStyles();
    },

    async watchChange(id) {
      if (await matchesContent(id, patterns, root)) {
        await writeStyles();
      }
    },

    async handleHotUpdate(ctx) {
      if (await matchesContent(ctx.file, patterns, root)) {
        await writeStyles();
        ctx.server.ws.send({ type: 'full-reload', path: '*' });
        return [];
      }
      return undefined;
    },

    resolveId(source) {
      if (source === 'virtual:hdx-style') return '\0virtual:hdx-style.css';
      return null;
    },

    async load(id) {
      if (id === '\0virtual:hdx-style.css') {
        virtualServing = true;
        if (!lastWrite) await writeStyles();
        const css = fs.readFileSync(lastWrite, 'utf-8');
        this.addWatchFile(lastWrite);
        return css;
      }
      return null;
    },
  };
}

export default hdxVitePlugin;