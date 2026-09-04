import { describe, it, expect } from 'vitest';
import { parseClass, isHdxClass, getUtilityName, getVariants, mapUtilitiesToVariants } from '../../src/core/parser.js';

describe('HDX Class Parser', () => {
  it('parses simple utility', () => {
    const result = parseClass('hdx_flex');
    expect(result).toEqual({
      prefix: 'hdx_',
      variants: [],
      utility: 'flex',
      valid: true,
    });
  });

  it('parses utility with one variant', () => {
    const result = parseClass('hdx_md_flex');
    expect(result).toEqual({
      prefix: 'hdx_',
      variants: ['md'],
      utility: 'flex',
      valid: true,
    });
  });

  it('parses utility with two variants', () => {
    const result = parseClass('hdx_md_hover_bg-primary');
    expect(result).toEqual({
      prefix: 'hdx_',
      variants: ['md', 'hover'],
      utility: 'bg-primary',
      valid: true,
    });
  });

  it('parses utility with three variants', () => {
    const result = parseClass('hdx_lg_dark_hover_bg-primary');
    expect(result).toEqual({
      prefix: 'hdx_',
      variants: ['lg', 'dark', 'hover'],
      utility: 'bg-primary',
      valid: true,
    });
  });

  it('parses dark + state variant', () => {
    const result = parseClass('hdx_dark_hover_flex');
    expect(result).toEqual({
      prefix: 'hdx_',
      variants: ['dark', 'hover'],
      utility: 'flex',
      valid: true,
    });
  });

  it('parses 2xl responsive', () => {
    const result = parseClass('hdx_2xl_flex');
    expect(result).toEqual({
      prefix: 'hdx_',
      variants: ['2xl'],
      utility: 'flex',
      valid: true,
    });
  });

  it('parses focus-visible variant', () => {
    const result = parseClass('hdx_focus-visible_ring');
    expect(result).toEqual({
      prefix: 'hdx_',
      variants: ['focus-visible'],
      utility: 'ring',
      valid: true,
    });
  });

  it('parses group-hover variant', () => {
    const result = parseClass('hdx_group-hover_text-primary');
    expect(result).toEqual({
      prefix: 'hdx_',
      variants: ['group-hover'],
      utility: 'text-primary',
      valid: true,
    });
  });

  it('parses read-only variant', () => {
    const result = parseClass('hdx_read-only_bg-gray');
    expect(result).toEqual({
      prefix: 'hdx_',
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
    const result = parseClass('hdx_');
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
    expect(isHdxClass('hdx_flex')).toBe(true);
    expect(isHdxClass('hdx_p-4')).toBe(true);
  });

  it('returns false for non-HDX classes', () => {
    expect(isHdxClass('flex')).toBe(false);
    expect(isHdxClass('p-4')).toBe(false);
  });
});

describe('getUtilityName', () => {
  it('extracts utility name from simple class', () => {
    expect(getUtilityName('hdx_flex')).toBe('flex');
  });

  it('extracts utility name from variant class', () => {
    expect(getUtilityName('hdx_md_hover_bg-primary')).toBe('bg-primary');
  });
});

describe('getVariants', () => {
  it('returns empty for simple utility', () => {
    expect(getVariants('hdx_flex')).toEqual([]);
  });

  it('returns variants in order', () => {
    expect(getVariants('hdx_lg_dark_hover_flex')).toEqual(['lg', 'dark', 'hover']);
  });
});

describe('mapUtilitiesToVariants', () => {
  it('maps utility names to their variant combos', () => {
    const classes = new Set([
      'hdx_flex',
      'hdx_md_flex',
      'hdx_hover_bg-primary',
      'hdx_dark_bg-primary',
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
