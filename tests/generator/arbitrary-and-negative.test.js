import { describe, it, expect } from 'vitest';
import { loadConfig } from '../../src/core/config.js';
import { generateCSS } from '../../src/generator/index.js';
import { getAllUtilities } from '../../src/utilities/index.js';
import { purgeUnused, findUnknownClasses } from '../../src/scanner/purger.js';
import { resolveArbitraryUtility } from '../../src/generator/arbitrary.js';

const config = loadConfig();

describe('P3: arbitrary values', () => {
  it('resolves safe length arbitrary values with px augmentation', () => {
    expect(resolveArbitraryUtility('w-[260px]')).toEqual({ name: 'w-[260px]', property: 'width', value: '260px', category: 'arbitrary' });
    expect(resolveArbitraryUtility('w-[260]')).toEqual({ name: 'w-[260]', property: 'width', value: '260px', category: 'arbitrary' });
    expect(resolveArbitraryUtility('max-h-[70vh]')).toEqual({ name: 'max-h-[70vh]', property: 'max-height', value: '70vh', category: 'arbitrary' });
    expect(resolveArbitraryUtility('rounded-[10px]')).toEqual({ name: 'rounded-[10px]', property: 'border-radius', value: '10px', category: 'arbitrary' });
  });

  it('resolves percentages and typography values', () => {
    expect(resolveArbitraryUtility('w-[45%]').value).toBe('45%');
    expect(resolveArbitraryUtility('text-[1.5rem]').value).toBe('1.5rem');
  });

  it('resolves numbers, angles and blur', () => {
    expect(resolveArbitraryUtility('opacity-[0.5]').value).toBe('0.5');
    expect(resolveArbitraryUtility('rotate-[90deg]').value).toBe('90deg');
    expect(resolveArbitraryUtility('rotate-[90]').value).toBe('90deg');
    expect(resolveArbitraryUtility('blur-[2px]').value).toBe('blur(2px)');
    expect(resolveArbitraryUtility('z-[999]').value).toBe('999');
  });

  it('rejects unsupported tokens and unsafe values', () => {
    expect(resolveArbitraryUtility('bg-[url(x)]')).toBeNull();
    expect(resolveArbitraryUtility('w-[260px};color:red')).toBeNull();
    expect(resolveArbitraryUtility('text-[10px')).toBeNull();
  });

  it('turns underscores into spaces inside arbitrary values', () => {
    expect(resolveArbitraryUtility('font-[var(--x)]')).toBeNull();
    expect(resolveArbitraryUtility('blur-[1_rem]').value).toBe('blur(1 rem)');
  });

  it('purges arbitrary classes into generated utilities', () => {
    const all = getAllUtilities(config);
    const purged = purgeUnused(all, new Set(['hdx_w-[260px]', 'hdx_md_max-h-[70vh]']), 'hdx_');
    const css = generateCSS(config, { utilities: purged });

    expect(css).toContain('.hdx_w-\\[260px\\] { width: 260px; }');
    expect(css).toContain('@media (min-width: 768px) {');
    expect(css).toMatch(/\.hdx_md_max-h-\\\[70vh\\\] \{\s*max-height: 70vh;/);
  });

  it('does not flag arbitrary classes as unknown', () => {
    const all = getAllUtilities(config);
    const unknown = findUnknownClasses(all, new Set(['hdx_w-[260px]', 'hdx_total-yolo']), 'hdx_');
    expect(unknown.map(u => u.className)).toEqual(['hdx_total-yolo']);
  });

  it('disambiguates text-[...] between color and font-size (Task 2)', () => {
    expect(resolveArbitraryUtility('text-[#ff0000]')).toEqual({ name: 'text-[#ff0000]', property: 'color', value: '#ff0000', category: 'arbitrary' });
    expect(resolveArbitraryUtility('text-[#ABC]')).toEqual({ name: 'text-[#ABC]', property: 'color', value: '#ABC', category: 'arbitrary' });
    expect(resolveArbitraryUtility('text-[14px]')).toEqual({ name: 'text-[14px]', property: 'font-size', value: '14px', category: 'arbitrary' });
    expect(resolveArbitraryUtility('text-[1.5rem]').property).toBe('font-size');
    expect(resolveArbitraryUtility('text-[var(--brand)]')).toEqual({ name: 'text-[var(--brand)]', property: 'color', value: 'var(--brand)', category: 'arbitrary' });
    expect(resolveArbitraryUtility('text-[rgb(255,0,0)]').property).toBe('color');
    expect(resolveArbitraryUtility('text-[red]').property).toBe('color');
  });

  it('keeps leading-[...] unitless for bare numbers (Task 3)', () => {
    expect(resolveArbitraryUtility('leading-[1.2]')).toEqual({ name: 'leading-[1.2]', property: 'line-height', value: '1.2', category: 'arbitrary' });
    expect(resolveArbitraryUtility('leading-[150%]')).toEqual({ name: 'leading-[150%]', property: 'line-height', value: '150%', category: 'arbitrary' });
  });

  it('normalizes opacity-[...] against the built-in 0–100 scale (Task 4)', () => {
    expect(resolveArbitraryUtility('opacity-[50]')).toEqual({ name: 'opacity-[50]', property: 'opacity', value: '0.5', category: 'arbitrary' });
    expect(resolveArbitraryUtility('opacity-[.5]')).toEqual({ name: 'opacity-[.5]', property: 'opacity', value: '0.5', category: 'arbitrary' });
    expect(resolveArbitraryUtility('opacity-[0.5]').value).toBe('0.5');
    // `1` is treated as already-normalized (matching Tailwind's convention).
    expect(resolveArbitraryUtility('opacity-[1]')).toEqual({ name: 'opacity-[1]', property: 'opacity', value: '1', category: 'arbitrary' });
  });

  it('supports arbitrary colors for bg/border/ring (Task 7)', () => {
    expect(resolveArbitraryUtility('bg-[#123456]')).toEqual({ name: 'bg-[#123456]', property: 'background-color', value: '#123456', category: 'arbitrary' });
    expect(resolveArbitraryUtility('border-[#123456]')).toEqual({ name: 'border-[#123456]', property: 'border-color', value: '#123456', category: 'arbitrary' });
    expect(resolveArbitraryUtility('ring-[#123456]')).toEqual({ name: 'ring-[#123456]', property: '--ring-color', value: '#123456', category: 'arbitrary' });
  });

  it('flags genuinely unsupported arbitrary values as unknown (Task 7)', () => {
    // Non-color values for color-only tokens resolve to null so they surface
    // via the "Unknown utility" warning path instead of emitting invalid CSS.
    expect(resolveArbitraryUtility('bg-[14px]')).toBeNull();
    expect(resolveArbitraryUtility('xyz-[123]')).toBeNull();

    const all = getAllUtilities(config);
    const unknown = findUnknownClasses(all, new Set(['hdx_xyz-[123]', 'hdx_bg-[14px]']), 'hdx_');
    expect(unknown.map(u => u.className).sort()).toEqual(['hdx_bg-[14px]', 'hdx_xyz-[123]']);

    // Color-shaped arbitrary values are NOT reported as unknown.
    const knownSet = findUnknownClasses(all, new Set(['hdx_bg-[#123456]', 'hdx_ring-[red]']), 'hdx_');
    expect(knownSet.map(u => u.className)).toEqual([]);
  });
});

describe('P3: negative values', () => {
  it('generates negative margins from the theme spacing scale', () => {
    const all = getAllUtilities(config);
    const purged = purgeUnused(all, new Set(['hdx_-mx-5', 'hdx_-mt-2']), 'hdx_');
    const css = generateCSS(config, { utilities: purged });
    expect(css).toContain('.hdx_-mx-5 { margin-inline: -1.25rem; }');
    expect(css).toContain('.hdx_-mt-2 { margin-top: -0.5rem; }');
  });

  it('generates negative positioning offsets', () => {
    const all = getAllUtilities(config);
    const purged = purgeUnused(all, new Set(['hdx_-top-4', 'hdx_-left-1/2', 'hdx_-bottom-full', 'hdx_-right-px']), 'hdx_');
    const css = generateCSS(config, { utilities: purged });
    expect(css).toContain('.hdx_-top-4 { top: -1rem; }');
    expect(css).toContain('.hdx_-left-1\\/2 { left: -50%; }');
    expect(css).toContain('.hdx_-bottom-full { bottom: -100%; }');
    expect(css).toContain('.hdx_-right-px { right: -1px; }');
  });

  it('generates negative transforms', () => {
    const all = getAllUtilities(config);
    const purged = purgeUnused(all, new Set(['hdx_-translate-y-1/2', 'hdx_-rotate-45']), 'hdx_');
    const css = generateCSS(config, { utilities: purged });
    expect(css).toContain('.hdx_-translate-y-1\\/2 { --translate-y: -50%; }');
    expect(css).toContain('.hdx_-rotate-45 { --rotate: -45deg; }');
  });

  it('parser resolves the negative token as the plain utility name', () => {
    const all = getAllUtilities(config);
    const byName = new Map(all.map(u => [u.name, u]));
    expect(byName.has('-mx-5')).toBe(true);
    expect(byName.get('-mx-5').property).toBe('margin-inline');
  });
});