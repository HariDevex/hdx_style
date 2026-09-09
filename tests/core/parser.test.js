import { describe, it, expect } from 'vitest';
import { parseClass, isHdxClass, getUtilityName, getVariants, mapUtilitiesToVariants, getVariantPrefixes, DEFAULT_VARIANT_PREFIXES } from '../../src/core/parser.js';
import { loadConfig } from '../../src/core/config.js';

describe('HDX Class Parser', () => {
  it('parses simple utility', () => {
    const result = parseClass('hdx-flex');
    expect(result).toEqual({
      prefix: 'hdx-',
      variants: [],
      utility: 'flex',
      valid: true,
    });
  });

  it('parses utility with one variant', () => {
    const result = parseClass('hdx-md_flex');
    expect(result).toEqual({
      prefix: 'hdx-',
      variants: ['md'],
      utility: 'flex',
      valid: true,
    });
  });

  it('parses utility with two variants', () => {
    const result = parseClass('hdx-md_hover_bg-primary');
    expect(result).toEqual({
      prefix: 'hdx-',
      variants: ['md', 'hover'],
      utility: 'bg-primary',
      valid: true,
    });
  });

  it('parses utility with three variants', () => {
    const result = parseClass('hdx-lg_dark_hover_bg-primary');
    expect(result).toEqual({
      prefix: 'hdx-',
      variants: ['lg', 'dark', 'hover'],
      utility: 'bg-primary',
      valid: true,
    });
  });

  it('parses dark + state variant', () => {
    const result = parseClass('hdx-dark_hover_flex');
    expect(result).toEqual({
      prefix: 'hdx-',
      variants: ['dark', 'hover'],
      utility: 'flex',
      valid: true,
    });
  });

  it('parses 2xl responsive', () => {
    const result = parseClass('hdx-2xl_flex');
    expect(result).toEqual({
      prefix: 'hdx-',
      variants: ['2xl'],
      utility: 'flex',
      valid: true,
    });
  });

  it('parses focus-visible variant', () => {
    const result = parseClass('hdx-focus-visible_ring');
    expect(result).toEqual({
      prefix: 'hdx-',
      variants: ['focus-visible'],
      utility: 'ring',
      valid: true,
    });
  });

  it('parses group-hover variant', () => {
    const result = parseClass('hdx-group-hover_text-primary');
    expect(result).toEqual({
      prefix: 'hdx-',
      variants: ['group-hover'],
      utility: 'text-primary',
      valid: true,
    });
  });

  it('parses read-only variant', () => {
    const result = parseClass('hdx-read-only_bg-gray');
    expect(result).toEqual({
      prefix: 'hdx-',
      variants: ['read-only'],
      utility: 'bg-gray',
      valid: true,
    });
  });

  it('returns invalid for non-prefixed class', () => {
    const result = parseClass('flex');
    expect(result.valid).toBe(false);
  });

  it('returns invalid for empty string', () => {
    const result = parseClass('');
    expect(result.valid).toBe(false);
  });

  it('returns invalid for null', () => {
    const result = parseClass(null);
    expect(result.valid).toBe(false);
  });

  it('returns invalid for prefix-only string', () => {
    const result = parseClass('hdx-');
    expect(result.valid).toBe(false);
  });

  it('custom prefix works', () => {
    const result = parseClass('my_flex', 'my_');
    expect(result).toEqual({
      prefix: 'my_',
      variants: [],
      utility: 'flex',
      valid: true,
    });
  });
});

describe('isHdxClass', () => {
  it('returns true for HDX classes', () => {
    expect(isHdxClass('hdx-flex')).toBe(true);
    expect(isHdxClass('hdx-p-4')).toBe(true);
  });

  it('returns false for non-HDX classes', () => {
    expect(isHdxClass('flex')).toBe(false);
    expect(isHdxClass('p-4')).toBe(false);
  });
});

describe('getUtilityName', () => {
  it('extracts utility name from simple class', () => {
    expect(getUtilityName('hdx-flex')).toBe('flex');
  });

  it('extracts utility name from variant class', () => {
    expect(getUtilityName('hdx-md_hover_bg-primary')).toBe('bg-primary');
  });
});

describe('getVariants', () => {
  it('returns empty for simple utility', () => {
    expect(getVariants('hdx-flex')).toEqual([]);
  });

  it('returns variants in order', () => {
    expect(getVariants('hdx-lg_dark_hover_flex')).toEqual(['lg', 'dark', 'hover']);
  });
});

describe('mapUtilitiesToVariants', () => {
  it('maps utility names to their variant combos', () => {
    const classes = new Set([
      'hdx-flex',
      'hdx-md_flex',
      'hdx-hover_bg-primary',
      'hdx-dark_bg-primary',
    ]);
    const map = mapUtilitiesToVariants(classes);
    expect(map.has('flex')).toBe(true);
    expect(map.has('bg-primary')).toBe(true);
    expect(map.get('flex').has('')).toBe(true);
    expect(map.get('flex').has('md')).toBe(true);
    expect(map.get('bg-primary').has('hover')).toBe(true);
    expect(map.get('bg-primary').has('dark')).toBe(true);
  });
});

describe('getVariantPrefixes (config-derived variants, P2/1.6 regression)', () => {
  it('includes all built-in breakpoints, dark and important for the default config', () => {
    const config = loadConfig();
    const prefixes = getVariantPrefixes(config);
    for (const bp of ['sm', 'md', 'lg', 'xl', '2xl']) {
      expect(prefixes).toContain(bp);
    }
    expect(prefixes).toContain('dark');
    expect(prefixes).toContain('important');
    expect(prefixes).toContain('group-hover');
    expect(prefixes).toContain('hover');
  });

  it('derives a custom theme breakpoint so it parses as a variant, not a utility', () => {
    const config = loadConfig();
    config.theme.breakpoints.xs = '480px';
    const prefixes = getVariantPrefixes(config);
    expect(prefixes).toContain('xs');

    // Without the config-derived list, 'xs' is treated as part of the utility.
    expect(parseClass('hdx-xs_flex', 'hdx-').utility).toBe('xs_flex');
    // With the config-derived list, 'xs' is consumed as a variant.
    const parsed = parseClass('hdx-xs_flex', 'hdx-', prefixes);
    expect(parsed.valid).toBe(true);
    expect(parsed.variants).toEqual(['xs']);
    expect(parsed.utility).toBe('flex');
  });

  it('threads config-derived prefixes through mapUtilitiesToVariants', () => {
    const config = loadConfig();
    config.theme.breakpoints.xs = '480px';
    const map = mapUtilitiesToVariants(new Set(['hdx-xs_flex']), 'hdx-', getVariantPrefixes(config));
    expect(map.get('flex').has('xs')).toBe(true);
  });

  it('exposes a non-empty default set used when no config is supplied', () => {
    expect(DEFAULT_VARIANT_PREFIXES.length).toBeGreaterThan(0);
  });
});
