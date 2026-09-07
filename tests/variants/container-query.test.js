import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { loadConfig } from '../../src/core/config.js';
import { getAllUtilities } from '../../src/utilities/index.js';
import { getAllVariants } from '../../src/variants/index.js';
import { parseClass, getVariantPrefixes } from '../../src/core/parser.js';
import { generatePurgedBuildCss } from '../../src/scanner/scan.js';

const config = loadConfig();

describe('container queries', () => {
  it('registers cq-{bp} variants with @container selectors', () => {
    const defs = getAllVariants(config);
    const cqs = Object.fromEntries(
      defs.filter((d) => d.name.startsWith('cq-')).map((d) => [d.name, d.selector()]),
    );
    expect(cqs['cq-sm']).toBe('@container (min-width: 640px)');
    expect(cqs['cq-md']).toBe('@container (min-width: 768px)');
    expect(cqs['cq-lg']).toBe('@container (min-width: 1024px)');
    expect(cqs['cq-xl']).toBe('@container (min-width: 1280px)');
    expect(cqs['cq-2xl']).toBe('@container (min-width: 1536px)');
  });

  it('ships the hdx-cq container-type utility', () => {
    const util = getAllUtilities(config).find((u) => u.name === 'cq');
    expect(util).toMatchObject({ property: 'container-type', value: 'inline-size' });
  });

  it('parses cq-{bp} prefixes', () => {
    const vps = getVariantPrefixes(config);
    expect(parseClass('hdx-cq-md_flex', 'hdx-', vps)).toMatchObject({ variants: ['cq-md'], utility: 'flex', valid: true });
    expect(parseClass('hdx-cq-lg_hover_bg-primary', 'hdx-', vps)).toMatchObject({ variants: ['cq-lg', 'hover'], utility: 'bg-primary', valid: true });
  });

  it('wraps utilities in @container blocks in a purged build', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hdx-cq-'));
    const file = path.join(dir, 'index.html');
    fs.writeFileSync(file, '<div class="hdx-cq"><div class="hdx-cq-md_flex hdx-cq-lg_hover_bg-primary"></div></div>');
    try {
      const css = await generatePurgedBuildCss(loadConfig({ content: [file] }));
      expect(css).toContain('.hdx-cq { container-type: inline-size; }');
      expect(css).toContain('@container (min-width: 768px)');
      expect(css).toContain('.hdx-cq-md_flex');
      expect(css).toContain('@container (min-width: 1024px)');
      expect(css).toContain('.hdx-cq-lg_hover_bg-primary:hover');
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it('emits nothing when no container utilities are used', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hdx-cq-none-'));
    const file = path.join(dir, 'index.html');
    fs.writeFileSync(file, '<div class="hdx-flex"></div>');
    try {
      const css = await generatePurgedBuildCss(loadConfig({ content: [file] }));
      expect(css).not.toContain('@container');
      expect(css).not.toContain('container-type');
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});