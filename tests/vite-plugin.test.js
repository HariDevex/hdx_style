import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import hdxVitePlugin from '../src/vite.js';

function makeProject() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hdx-vite-'));
  const content = path.join(dir, 'src');
  fs.mkdirSync(content, { recursive: true });
  fs.writeFileSync(path.join(dir, 'hdx.config.mjs'), '');
  fs.writeFileSync(
    path.join(content, 'index.html'),
    '<div class="hdx-flex hdx-p-4"></div>',
  );
  const configPath = path.join(dir, 'hdx.config.mjs');
  fs.writeFileSync(
    configPath,
    `export default { content: ['${content.replace(/\\/g, '/')}/**/*.{html,js,ts}'] }`,
  );
  return { dir, content, configPath };
}

describe('hdxVitePlugin', () => {
  it('writes the purged stylesheet on buildStart', async () => {
    const { dir, configPath } = makeProject();
    try {
      const plugin = hdxVitePlugin({ config: configPath });
      plugin.configResolved({ root: dir });
      await plugin.buildStart();

      const out = path.join(dir, 'dist', 'hdx.css');
      expect(fs.existsSync(out)).toBe(true);
      const css = fs.readFileSync(out, 'utf-8');
      expect(css).toContain('.hdx-flex');
      expect(css).toContain('.hdx-p-4');
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it('serves virtual:hdx-style as CSS through the Vite pipeline', async () => {
    const { dir, configPath } = makeProject();
    try {
      const plugin = hdxVitePlugin({ config: configPath });
      plugin.configResolved({ root: dir });
      const id = plugin.resolveId('virtual:hdx-style');
      expect(id).toBe('\0virtual:hdx-style.css');

      const loaded = await plugin.load.call({ addWatchFile() {} }, id);
      expect(loaded).toContain('.hdx-flex');
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it('re-writes on content changes via watchChange and handleHotUpdate', async () => {
    const { dir, content, configPath } = makeProject();
    try {
      const plugin = hdxVitePlugin({ config: configPath });
      plugin.configResolved({ root: dir });
      await plugin.buildStart();

      const html = path.join(content, 'index.html');
      fs.writeFileSync(html, '<div class="hdx-hidden hdx-md_flex"></div>');

      await plugin.watchChange(html);
      const css = fs.readFileSync(path.join(dir, 'dist', 'hdx.css'), 'utf-8');
      expect(css).toContain('.hdx-hidden');
      expect(css).toContain('.hdx-md_flex');
      // hdx-p-4 was removed from content, so its rule must be gone — while the
      // base `.hdx-flex` rule stays (it is the base of the demanded hdx-md_flex).
      expect(css).not.toContain('.hdx-p-4');

      const ctx = { file: html, server: { ws: { send() {} } } };
      const result = await plugin.handleHotUpdate(ctx);
      expect(result).toEqual([]);
      const css2 = fs.readFileSync(path.join(dir, 'dist', 'hdx.css'), 'utf-8');
      expect(css2).toContain('.hdx-hidden');
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it('ignores changes outside the content patterns', async () => {
    const { dir, configPath } = makeProject();
    try {
      const plugin = hdxVitePlugin({ config: configPath });
      plugin.configResolved({ root: dir });
      await plugin.buildStart();

      const unrelated = path.join(dir, 'README.md');
      fs.writeFileSync(unrelated, '# hi');
      await plugin.watchChange(unrelated);
      const ctx = { file: unrelated, server: { ws: { send() {} } } };
      expect(await plugin.handleHotUpdate(ctx)).toBeUndefined();
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});