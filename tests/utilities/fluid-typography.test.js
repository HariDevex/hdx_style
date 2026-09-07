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

describe('fluid typography (text-fluid-*)', () => {
  it('registers a text-fluid utility per fluidFontSize entry', () => {
    const names = getAllUtilities(config).map((u) => u.name);
    expect(names).toEqual(expect.arrayContaining([
      'text-fluid-xs', 'text-fluid-sm', 'text-fluid-base', 'text-fluid-lg',
      'text-fluid-xl', 'text-fluid-2xl', 'text-fluid-3xl', 'text-fluid-4xl', 'text-fluid-5xl',
    ]));
  });

  it('emits a clamp() that interpolates min → max across the responsive range', () => {
    const defs = Object.fromEntries(getAllUtilities(config).filter((u) => u.name.startsWith('text-fluid-')).map((u) => [u.name, u]));
    expect(defs['text-fluid-base'].property).toBe('font-size');
    expect(defs['text-fluid-base'].value).toBe(
      'clamp(1rem, calc(1rem + (1.125rem - 1rem) * (100vw - 40rem) / (96rem - 40rem)), 1.125rem)',
    );
    expect(defs['text-fluid-5xl'].value).toBe(
      'clamp(3rem, calc(3rem + (4rem - 3rem) * (100vw - 40rem) / (96rem - 40rem)), 4rem)',
    );
  });

  it('parses and emits a used text-fluid class in a purged build', async () => {
    expect(parseClass('hdx-text-fluid-3xl', 'hdx-', vps)).toMatchObject({ variants: [], utility: 'text-fluid-3xl', valid: true });
    expect(parseClass('hdx-md_text-fluid-lg', 'hdx-', vps)).toMatchObject({ variants: ['md'], utility: 'text-fluid-lg', valid: true });

    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hdx-fluid-'));
    const file = path.join(dir, 'index.html');
    fs.writeFileSync(file, '<h1 class="hdx-text-fluid-3xl">Hello</h1>');
    try {
      const css = await generatePurgedBuildCss(loadConfig({ content: [file] }));
      expect(css).toContain('.hdx-text-fluid-3xl');
      expect(css).toContain('clamp(1.875rem, calc(1.875rem + (2.25rem - 1.875rem)');
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it('extends from a user theme (deepMerge)', () => {
    const extended = loadConfig({ theme: { fluidFontSize: { hero: { min: '2rem', max: '6rem' } } } });
    const util = getAllUtilities(extended).find((u) => u.name === 'text-fluid-hero');
    expect(util.value).toBe('clamp(2rem, calc(2rem + (6rem - 2rem) * (100vw - 40rem) / (96rem - 40rem)), 6rem)');
  });

  it('emits nothing when no fluid classes are used', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hdx-fluid-none-'));
    const file = path.join(dir, 'index.html');
    fs.writeFileSync(file, '<h1 class="hdx-text-3xl">Hello</h1>');
    try {
      const css = await generatePurgedBuildCss(loadConfig({ content: [file] }));
      expect(css).not.toContain('100vw - 40rem');
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});