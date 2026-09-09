import { describe, it, expect } from 'vitest';
import { purgeUnused, purgeComponents, findUnknownClasses } from '../../src/scanner/purger.js';
import { loadConfig } from '../../src/core/config.js';

describe('purger', () => {
  const allUtilities = [
    { name: 'flex', property: 'display', value: 'flex' },
    { name: 'p-4', property: 'padding', value: '1rem' },
    { name: 'text-center', property: 'text-align', value: 'center' },
    { name: 'bg-primary', property: 'background-color', value: 'var(--hdx-color-primary)' },
    { name: 'hidden', property: 'display', value: 'none' },
  ];

  it('keeps directly used utilities', () => {
    const used = new Set(['hdx-flex', 'hdx-p-4']);
    const result = purgeUnused(allUtilities, used);
    expect(result).toHaveLength(2);
    expect(result.map(u => u.name)).toContain('flex');
    expect(result.map(u => u.name)).toContain('p-4');
  });

  it('keeps utilities used in variant forms', () => {
    const used = new Set(['hdx-hover_bg-primary', 'hdx-md_flex']);
    const result = purgeUnused(allUtilities, used);
    expect(result.map(u => u.name)).toContain('flex');
    expect(result.map(u => u.name)).toContain('bg-primary');
  });

  it('keeps utilities used with dark variant', () => {
    const used = new Set(['hdx-dark_bg-primary']);
    const result = purgeUnused(allUtilities, used);
    expect(result.map(u => u.name)).toContain('bg-primary');
  });

  it('removes unused utilities', () => {
    const used = new Set(['hdx-flex']);
    const result = purgeUnused(allUtilities, used);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('flex');
  });

  it('keeps utilities used in deep variant combos (responsive + dark + state)', () => {
    const used = new Set(['hdx-lg_dark_hover_bg-primary']);
    const result = purgeUnused(allUtilities, used);
    expect(result.map(u => u.name)).toContain('bg-primary');
  });

  it('does not keep utilities for unknown (non-HDX) classes', () => {
    const used = new Set(['hdx-not-a-utility', 'navbar-brand']);
    const result = purgeUnused(allUtilities, used);
    expect(result).toHaveLength(0);
  });

  it('records exact requested variant combos per utility', () => {
    const used = new Set(['hdx-flex', 'hdx-md_hover_bg-primary', 'hdx-dark_bg-primary']);
    const result = purgeUnused(allUtilities, used);

    const flex = result.find(u => u.name === 'flex');
    expect(flex._requestedVariants).toEqual([]);

    const bg = result.find(u => u.name === 'bg-primary');
    expect(bg._requestedVariants).toContainEqual(['md', 'hover']);
    expect(bg._requestedVariants).toContainEqual(['dark']);
  });

  it('adds safelisted utilities with no variants', () => {
    const used = new Set(['hdx-flex']);
    const result = purgeUnused(allUtilities, used, 'hdx-', ['hdx-hidden', 'hdx-md_flex']);
    expect(result.map(u => u.name)).toContain('hidden');
    const hidden = result.find(u => u.name === 'hidden');
    expect(hidden._requestedVariants).toEqual([]);
  });

  it('does not duplicate utilities already kept from content', () => {
    const used = new Set(['hdx-flex']);
    const result = purgeUnused(allUtilities, used, 'hdx-', ['hdx-flex']);
    const flexes = result.filter(u => u.name === 'flex');
    expect(flexes).toHaveLength(1);
  });

  it('resolves custom breakpoint variants when the config is supplied (P2/1.6 regression)', () => {
    const config = loadConfig();
    config.theme.breakpoints.xs = '480px';

    const used = new Set(['hdx-xs_flex']);
    const result = purgeUnused(allUtilities, used, 'hdx-', [], config);

    const flex = result.find(u => u.name === 'flex');
    expect(flex).toBeDefined();
    expect(flex._requestedVariants).toContainEqual(['xs']);
  });

  it('does not resolve custom breakpoint variants without the config (default parser)', () => {
    const config = loadConfig();
    config.theme.breakpoints.xs = '480px';

    const used = new Set(['hdx-xs_flex']);
    const result = purgeUnused(allUtilities, used, 'hdx-', []);

    // Without config-derived prefixes, 'xs_flex' is an unknown utility.
    expect(result).toHaveLength(0);
  });
});

describe('findUnknownClasses', () => {
  const allUtilities = [
    { name: 'flex', property: 'display', value: 'flex' },
    { name: 'bg-primary', property: 'background-color', value: 'var(--hdx-color-primary)' },
  ];

  it('returns nothing for fully-resolvable classes', () => {
    const unknown = findUnknownClasses(allUtilities, new Set(['hdx-flex', 'hdx-md_bg-primary']));
    expect(unknown).toHaveLength(0);
  });

  it('flags classes that use an unknown utility name', () => {
    const unknown = findUnknownClasses(allUtilities, new Set(['hdx-grid', 'hdx-hover_grid']));
    expect(unknown.length).toBeGreaterThan(0);
    expect(unknown.find(u => u.className === 'hdx-grid')).toBeDefined();
    expect(unknown.find(u => u.className === 'hdx-hover_grid').utility).toBe('grid');
  });

  it('ignores non-HDX classes', () => {
    const unknown = findUnknownClasses(allUtilities, new Set(['navbar-brand', 'flex']));
    expect(unknown).toHaveLength(0);
  });

  it('flags syntactically-invalid classes', () => {
    const unknown = findUnknownClasses(allUtilities, new Set(['hdx-_weird__name']));
    expect(unknown.length).toBeGreaterThan(0);
  });

  it('does not flag variant-marker classes like hdx-dark / hdx-group / hdx-peer', () => {
    const unknown = findUnknownClasses(
      allUtilities,
      new Set(['hdx-dark', 'hdx-group', 'hdx-peer', 'hdx-flex']),
      'hdx-',
      loadConfig()
    );
    expect(unknown).toHaveLength(0);
  });

  it('does not flag component classes when component names are supplied', () => {
    const unknown = findUnknownClasses(
      allUtilities,
      new Set(['hdx-btn-primary', 'hdx-input', 'hdx-flex']),
      'hdx-',
      loadConfig(),
      new Set(['btn-primary', 'input', 'label'])
    );
    expect(unknown).toHaveLength(0);
  });
});

describe('purgeComponents', () => {
  const allComponents = [
    { name: 'btn', css: 'display: inline-flex;' },
    { name: 'btn-primary', states: [{ selector: ':hover', css: 'color: white;' }] },
    { name: 'input', css: 'border-radius: 0.5rem;' },
    { name: 'modal-overlay', css: 'z-index: 1200;' },
    { name: 'modal', css: 'max-width: 28rem;' },
  ];

  it('keeps only components whose base class appears in content', () => {
    const used = new Set(['hdx-btn', 'hdx-btn-primary', 'hdx-flex']);
    const result = purgeComponents(allComponents, used);
    expect(result.map(c => c.name)).toEqual(['btn', 'btn-primary']);
  });

  it('removes unused components (e.g. modal when no hdx-modal* is present)', () => {
    const used = new Set(['hdx-btn']);
    const result = purgeComponents(allComponents, used);
    expect(result.map(c => c.name)).not.toContain('modal');
    expect(result.map(c => c.name)).not.toContain('modal-overlay');
  });

  it('resolves composed component usage independently (btn + btn-primary)', () => {
    const used = new Set(['hdx-btn', 'hdx-btn-primary']);
    const result = purgeComponents(allComponents, used);
    expect(result.map(c => c.name)).toEqual(['btn', 'btn-primary']);
  });

  it('keeps components referenced by a variant-prefixed class', () => {
    const used = new Set(['hdx-hover_btn', 'hdx-dark_input']);
    const result = purgeComponents(allComponents, used, 'hdx-', [], loadConfig());
    expect(result.map(c => c.name)).toEqual(['btn', 'input']);
  });

  it('keeps safelisted component classes even when absent from content', () => {
    const used = new Set(['hdx-flex']);
    const result = purgeComponents(allComponents, used, 'hdx-', ['hdx-modal']);
    expect(result.map(c => c.name)).toContain('modal');
    expect(result.map(c => c.name)).not.toContain('btn');
  });

  it('returns an empty list when no components are used', () => {
    const used = new Set(['hdx-flex', 'navbar-brand']);
    const result = purgeComponents(allComponents, used);
    expect(result).toHaveLength(0);
  });
});
