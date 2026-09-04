import { describe, it, expect } from 'vitest';
import { purgeUnused } from '../../src/scanner/purger.js';

describe('purger', () => {
  const allUtilities = [
    { name: 'flex', property: 'display', value: 'flex' },
    { name: 'p-4', property: 'padding', value: '1rem' },
    { name: 'text-center', property: 'text-align', value: 'center' },
    { name: 'bg-primary', property: 'background-color', value: 'var(--hdx-color-primary)' },
    { name: 'hidden', property: 'display', value: 'none' },
  ];

  it('keeps directly used utilities', () => {
    const used = new Set(['hdx_flex', 'hdx_p-4']);
    const result = purgeUnused(allUtilities, used);
    expect(result).toHaveLength(2);
    expect(result.map(u => u.name)).toContain('flex');
    expect(result.map(u => u.name)).toContain('p-4');
  });

  it('keeps utilities used in variant forms', () => {
    const used = new Set(['hdx_hover_bg-primary', 'hdx_md_flex']);
    const result = purgeUnused(allUtilities, used);
    expect(result.map(u => u.name)).toContain('flex');
    expect(result.map(u => u.name)).toContain('bg-primary');
  });

  it('keeps utilities used with dark variant', () => {
    const used = new Set(['hdx_dark_bg-primary']);
    const result = purgeUnused(allUtilities, used);
    expect(result.map(u => u.name)).toContain('bg-primary');
  });

  it('removes unused utilities', () => {
    const used = new Set(['hdx_flex']);
    const result = purgeUnused(allUtilities, used);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('flex');
  });

  it('keeps utilities used in deep variant combos (responsive + dark + state)', () => {
    const used = new Set(['hdx_lg_dark_hover_bg-primary']);
    const result = purgeUnused(allUtilities, used);
    expect(result.map(u => u.name)).toContain('bg-primary');
  });

  it('does not keep utilities for unknown (non-HDX) classes', () => {
    const used = new Set(['hdx_not-a-utility', 'navbar-brand']);
    const result = purgeUnused(allUtilities, used);
    expect(result).toHaveLength(0);
  });

  it('records exact requested variant combos per utility', () => {
    const used = new Set(['hdx_flex', 'hdx_md_hover_bg-primary', 'hdx_dark_bg-primary']);
    const result = purgeUnused(allUtilities, used);

    const flex = result.find(u => u.name === 'flex');
    expect(flex._requestedVariants).toEqual([]);

    const bg = result.find(u => u.name === 'bg-primary');
    expect(bg._requestedVariants).toContainEqual(['md', 'hover']);
    expect(bg._requestedVariants).toContainEqual(['dark']);
  });

  it('adds safelisted utilities with no variants', () => {
    const used = new Set(['hdx_flex']);
    const result = purgeUnused(allUtilities, used, 'hdx_', ['hdx_hidden', 'hdx_md_flex']);
    expect(result.map(u => u.name)).toContain('hidden');
    const hidden = result.find(u => u.name === 'hidden');
    expect(hidden._requestedVariants).toEqual([]);
  });

  it('does not duplicate utilities already kept from content', () => {
    const used = new Set(['hdx_flex']);
    const result = purgeUnused(allUtilities, used, 'hdx_', ['hdx_flex']);
    const flexes = result.filter(u => u.name === 'flex');
    expect(flexes).toHaveLength(1);
  });
});
