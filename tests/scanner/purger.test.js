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
});
