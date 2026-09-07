import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadConfig } from '../../src/core/config.js';
import { getAllVariants } from '../../src/variants/index.js';
import { parseClass, getVariantPrefixes } from '../../src/core/parser.js';
import { generateCSS } from '../../src/generator/index.js';
import { getAllUtilities } from '../../src/utilities/index.js';
import { generatePurgedBuildCss } from '../../src/scanner/scan.js';
import { isArbitraryMediaName, parseArbitraryMedia, synthesizeArbitraryMediaVariant } from '../../src/variants/arbitrary.js';

const config = loadConfig();

function variant(name) {
  return getAllVariants(config).find(v => v.name === name);
}

describe('max-{bp} / {bp}-only variants', () => {
  it('registers every derived variant', () => {
    const variants = getAllVariants(config);
    for (const bp of ['sm', 'md', 'lg', 'xl', '2xl']) {
      expect(variant(`max-${bp}`)).toBeDefined();
      expect(variant(`${bp}-only`)).toBeDefined();
    }
  });

  it('max-md is below the md breakpoint', () => {
    expect(variant('max-md').selector()).toBe('@media (max-width: 767.98px)');
  });

  it('sm-only spans just the sm range', () => {
    expect(variant('sm-only').selector()).toBe('@media (min-width: 640px) and (max-width: 767.98px)');
  });

  it('2xl-only has no upper cap (top of the scale)', () => {
    expect(variant('2xl-only').selector()).toBe('@media (min-width: 1536px)');
  });

  it('parses classes with the new prefixes', () => {
    const vps = getVariantPrefixes(config);
    expect(parseClass('hdx-max-md_hidden', 'hdx-', vps)).toMatchObject({ variants: ['max-md'], utility: 'hidden', valid: true });
    expect(parseClass('hdx-md-only_flex', 'hdx-', vps)).toMatchObject({ variants: ['md-only'], utility: 'flex', valid: true });
    expect(parseClass('hdx-max-lg_hover_bg-primary', 'hdx-', vps)).toMatchObject({ variants: ['max-lg', 'hover'], utility: 'bg-primary', valid: true });
  });

  it('generates the rules in a full build', () => {
    const all = getAllUtilities(config);
    const util = new Map(all.map(u => [u.name, u]));
    const css = generateCSS(config, {
      utilities: [
        { ...util.get('hidden'), _requestedVariants: [['max-md'], ['md-only']] },
      ],
    });
    expect(css).toContain('@media (max-width: 767.98px)');
    expect(css).toContain('.hdx-max-md_hidden');
    expect(css).toContain('.hdx-md-only_hidden');
  });
});

describe('max-{bp} / {bp}-only purge integration', () => {
  it('emits a used max-md class in a purged build', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hdx-maxmd-'));
    const html = '<div class="hdx-hidden hdx-max-md_hidden hdx-md_flex"></div>';
    const file = path.join(dir, 'index.html');
    fs.writeFileSync(file, html);
    try {
      const cfg = loadConfig({ content: [path.join(dir, 'index.html')] });
      const css = await generatePurgedBuildCss(cfg);
      expect(css).toContain('.hdx-hidden');
      expect(css).toContain('@media (max-width: 767.98px)');
      expect(css).toContain('.hdx-max-md_hidden');
      expect(css).toContain('@media (min-width: 768px)');
      expect(css).toContain('.hdx-md_flex');
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe('arbitrary breakpoint variants (min-[x]_ / max-[x]_)', () => {
  it('parses arbitrary media variants', () => {
    const vps = getVariantPrefixes(config);
    expect(parseClass('hdx-min-[900px]_flex', 'hdx-', vps)).toMatchObject({ variants: ['min-[900px]'], utility: 'flex', valid: true });
    expect(parseClass('hdx-max-[80vw]_flex', 'hdx-', vps)).toMatchObject({ variants: ['max-[80vw]'], utility: 'flex', valid: true });
    expect(parseClass('hdx-min-[900px]_hover_bg-primary', 'hdx-', vps)).toMatchObject({ variants: ['min-[900px]', 'hover'], utility: 'bg-primary', valid: true });
  });

  it('resolves the media query and synthesizes a variant', () => {
    expect(parseArbitraryMedia('min-[900px]')).toBe('@media (min-width: 900px)');
    expect(parseArbitraryMedia('max-[1200px]')).toBe('@media (max-width: 1200px)');
    expect(isArbitraryMediaName('max-md')).toBe(false);
    const def = synthesizeArbitraryMediaVariant('min-[42rem]');
    expect(def.type).toBe('responsive');
    expect(def.selector()).toBe('@media (min-width: 42rem)');
  });

  it('generates correctly escaped, media-wrapped rules in a purged build', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hdx-arb-'));
    const file = path.join(dir, 'index.html');
    fs.writeFileSync(file, '<div class="hdx-flex hdx-min-[900px]_flex hdx-max-[80vw]_flex hdx-min-[900px]_hover_bg-primary"></div>');
    try {
      const cfg = loadConfig({ content: [file] });
      const css = await generatePurgedBuildCss(cfg);
      expect(css).toContain('@media (min-width: 900px)');
      expect(css).toContain('.hdx-min-\\[900px\\]_flex');
      expect(css).toContain('@media (max-width: 80vw)');
      expect(css).toContain('.hdx-max-\\[80vw\\]_flex');
      expect(css).toContain('.hdx-min-\\[900px\\]_hover_bg-primary:hover');
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it('does not emit arbitrary-media CSS when the class is absent', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hdx-arb-none-'));
    const file = path.join(dir, 'index.html');
    fs.writeFileSync(file, '<div class="hdx-flex"></div>');
    try {
      const css = await generatePurgedBuildCss(loadConfig({ content: [file] }));
      expect(css).not.toContain('min-width: 900px');
      expect(css).not.toContain('hdx-min-\\[900px\\]');
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});