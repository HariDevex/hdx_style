import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { loadConfig } from '../../src/core/config.js';
import { getAllUtilities } from '../../src/utilities/index.js';
import { parseClass, getVariantPrefixes } from '../../src/core/parser.js';
import { generatePurgedBuildCss } from '../../src/scanner/scan.js';

const config = loadConfig();
const vps = getVariantPrefixes(config);

describe('safe-area utilities', () => {
  it('registers the full -safe set', () => {
    const names = getAllUtilities(config).map((u) => u.name);
    expect(names).toEqual(expect.arrayContaining([
      'p-safe', 'px-safe', 'py-safe', 'pt-safe', 'pr-safe', 'pb-safe', 'pl-safe',
    ]));
  });

  it('uses self-gating max(0px, env(...)) fallbacks', () => {
    const defs = Object.fromEntries(getAllUtilities(config).filter((u) => u.name.endsWith('-safe')).map((u) => [u.name, u]));
    expect(defs['pt-safe'].value).toBe('max(0px, env(safe-area-inset-top))');
    expect(defs['pl-safe'].value).toBe('max(0px, env(safe-area-inset-left))');
    expect(defs['pb-safe'].value).toBe('max(0px, env(safe-area-inset-bottom))');
    expect(defs['pr-safe'].value).toBe('max(0px, env(safe-area-inset-right))');
    expect(defs['px-safe'].value).toBe('max(0px, env(safe-area-inset-left)) max(0px, env(safe-area-inset-right))');
    expect(defs['p-safe'].value).toContain('max(0px, env(safe-area-inset-top))');
  });

  it('are purge-driven and compose with responsive variants', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hdx-safe-'));
    const file = path.join(dir, 'index.html');
    fs.writeFileSync(file, '<div class="hdx-pt-safe hdx-md_px-safe"></div>');
    try {
      const css = await generatePurgedBuildCss(loadConfig({ content: [file] }));
      expect(css).toContain('.hdx-pt-safe { padding-top: max(0px, env(safe-area-inset-top)); }');
      expect(css).toContain('@media (min-width: 768px)');
      expect(css).toContain('.hdx-md_px-safe');
      expect(parseClass('hdx-pb-safe', 'hdx-', vps)).toMatchObject({ variants: [], utility: 'pb-safe', valid: true });
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it('emits nothing when unused', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hdx-safe-none-'));
    const file = path.join(dir, 'index.html');
    fs.writeFileSync(file, '<div class="hdx-flex"></div>');
    try {
      const css = await generatePurgedBuildCss(loadConfig({ content: [file] }));
      expect(css).not.toContain('safe-area-inset');
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});