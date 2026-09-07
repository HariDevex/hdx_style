import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { loadConfig } from '../../src/core/config.js';
import { parseClass, getVariantPrefixes } from '../../src/core/parser.js';
import { getAllVariants } from '../../src/variants/index.js';
import { generatePurgedBuildCss } from '../../src/scanner/scan.js';

const config = loadConfig();
const vps = getVariantPrefixes(config);

async function expectPurgedCSS(className, mediaQuery, selector) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hdx-media-'));
  const file = path.join(dir, 'index.html');
  fs.writeFileSync(file, `<div class="${className}"></div>`);
  try {
    const css = await generatePurgedBuildCss(loadConfig({ content: [file] }));
    expect(css).toContain(mediaQuery);
    expect(css).toContain(selector);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

describe('static media-feature variants', () => {
  it('registers orientation, print and motion variants with correct selectors', () => {
    const defs = getAllVariants(config);
    const media = Object.fromEntries(
      defs.filter((d) => ['portrait', 'landscape', 'print', 'motion-safe', 'motion-reduce'].includes(d.name))
        .map((d) => [d.name, d.selector()]),
    );
    expect(media.portrait).toBe('@media (orientation: portrait)');
    expect(media.landscape).toBe('@media (orientation: landscape)');
    expect(media.print).toBe('@media print');
    expect(media['motion-safe']).toBe('@media (prefers-reduced-motion: no-preference)');
    expect(media['motion-reduce']).toBe('@media (prefers-reduced-motion: reduce)');
  });

  it('parses the variant prefixes', () => {
    expect(vps).toContain('portrait');
    expect(vps).toContain('landscape');
    expect(vps).toContain('print');
    expect(vps).toContain('motion-safe');
    expect(vps).toContain('motion-reduce');

    expect(parseClass('hdx-portrait_flex', 'hdx-', vps)).toMatchObject({ variants: ['portrait'], utility: 'flex', valid: true });
    expect(parseClass('hdx-landscape_bg-primary', 'hdx-', vps)).toMatchObject({ variants: ['landscape'], utility: 'bg-primary', valid: true });
    expect(parseClass('hdx-print_hidden', 'hdx-', vps)).toMatchObject({ variants: ['print'], utility: 'hidden', valid: true });
    expect(parseClass('hdx-motion-safe_flex', 'hdx-', vps)).toMatchObject({ variants: ['motion-safe'], utility: 'flex', valid: true });
    expect(parseClass('hdx-motion-reduce_hover_opacity-50', 'hdx-', vps)).toMatchObject({ variants: ['motion-reduce', 'hover'], utility: 'opacity-50', valid: true });
  });

  it('emits the portrait wrapper in a purged build', async () => {
    await expectPurgedCSS('hdx-portrait_flex', '@media (orientation: portrait)', '.hdx-portrait_flex');
  });

  it('emits the landscape wrapper in a purged build', async () => {
    await expectPurgedCSS('hdx-landscape_flex', '@media (orientation: landscape)', '.hdx-landscape_flex');
  });

  it('emits the print wrapper in a purged build', async () => {
    await expectPurgedCSS('hdx-print_hidden', '@media print', '.hdx-print_hidden');
  });

  it('emits the motion-safe wrapper in a purged build', async () => {
    await expectPurgedCSS('hdx-motion-safe_flex', '@media (prefers-reduced-motion: no-preference)', '.hdx-motion-safe_flex');
  });

  it('emits the motion-reduce wrapper in a purged build', async () => {
    await expectPurgedCSS('hdx-motion-reduce_flex', '@media (prefers-reduced-motion: reduce)', '.hdx-motion-reduce_flex');
  });

  it('composes motion-reduce with hover in a purged build', async () => {
    await expectPurgedCSS('hdx-motion-reduce_hover_opacity-50', '@media (prefers-reduced-motion: reduce)', '.hdx-motion-reduce_hover_opacity-50:hover');
  });

  it('does not emit the wrappers when the classes are unused', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hdx-media-none-'));
    const file = path.join(dir, 'index.html');
    fs.writeFileSync(file, '<div class="hdx-flex"></div>');
    try {
      const css = await generatePurgedBuildCss(loadConfig({ content: [file] }));
      expect(css).not.toContain('orientation: portrait');
      expect(css).not.toMatch(/\.hdx-motion-(safe|reduce)_/);
      expect(css).not.toContain('@media print');
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});