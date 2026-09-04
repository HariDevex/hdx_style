import { describe, it, expect } from 'vitest';
import { wrapInStateVariant, wrapInResponsive, wrapInDark } from '../../src/generator/variant-generator.js';

describe('variant-generator', () => {
  const baseRule = '.hdx_flex { display: flex; }\n';

  const hoverVariant = {
    name: 'hover',
    prefix: 'hover_',
    selector: () => ':hover',
    type: 'state',
  };

  const mdVariant = {
    name: 'md',
    prefix: 'md_',
    selector: () => '@media (min-width: 768px)',
    type: 'responsive',
  };

  const darkVariant = {
    name: 'dark',
    prefix: 'dark_',
    selector: () => '.dark',
    type: 'dark',
  };

  it('wraps in hover variant', () => {
    const result = wrapInStateVariant(baseRule, hoverVariant, 'flex');
    expect(result).toContain('.hdx_hover_flex:hover');
    expect(result).toContain('display: flex');
  });

  it('wraps in responsive variant', () => {
    const result = wrapInResponsive(baseRule, mdVariant, 'flex');
    expect(result).toContain('@media (min-width: 768px)');
    expect(result).toContain('.hdx_md_flex');
  });

  it('wraps in dark variant (class strategy)', () => {
    const result = wrapInDark(baseRule, darkVariant, 'flex', 'hdx_', 'class');
    expect(result).toContain('.dark .hdx_dark_flex');
  });

  it('wraps in dark variant (media strategy)', () => {
    const result = wrapInDark(baseRule, darkVariant, 'flex', 'hdx_', 'media');
    expect(result).toContain('@media (prefers-color-scheme: dark)');
  });

  it('wraps in dark variant (both strategy)', () => {
    const result = wrapInDark(baseRule, darkVariant, 'flex', 'hdx_', 'both');
    expect(result).toContain('.dark .hdx_dark_flex');
    expect(result).toContain('@media (prefers-color-scheme: dark)');
  });
});
