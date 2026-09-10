import { describe, it, expect } from 'vitest';
import { loadConfig } from '../../src/core/config.js';
import { getAllComponents } from '../../src/components/index.js';
import { generateCSS } from '../../src/generator/index.js';

const config = loadConfig();

describe('icon components', () => {
  const components = getAllComponents(config);

  it('ships the base icon wrapper with sizing/color contract', () => {
    const icon = components.find(c => c.name === 'ui-icon');
    expect(icon).toBeDefined();
    expect(icon.category).toBe('components');
    expect(icon.css).toContain('display: inline-flex');
    expect(icon.css).toContain('align-items: center');
    expect(icon.css).toContain('justify-content: center');
    expect(icon.css).toContain('flex-shrink: 0');
    // currentColor is the "modifiable from user's CSS" story for icons.
    expect(icon.css).toContain('color: currentColor');
  });

  it('has all size variants', () => {
    for (const size of ['xs', 'sm', 'lg', 'xl']) {
      const variant = components.find(c => c.name === `ui-icon-${size}`);
      expect(variant).toBeDefined();
      expect(variant.category).toBe('components');
      expect(variant.css).toContain('width:');
      expect(variant.css).toContain('height:');
    }
  });

  it('size variants are keyed off fontSize tokens, not magic numbers', () => {
    const { fontSize } = config.theme;
    expect(components.find(c => c.name === 'ui-icon-sm').css).toContain(`width: ${fontSize.sm}`);
    expect(components.find(c => c.name === 'ui-icon-xl').css).toContain(`height: ${fontSize['2xl']}`);
  });

  it('has a spin state for loading icons', () => {
    const spin = components.find(c => c.name === 'ui-icon-spin');
    expect(spin).toBeDefined();
    expect(spin.category).toBe('components');
    expect(spin.css).toContain('hdx-spin');
  });

  it('emits prefixed hdx-ui-icon classes in generated CSS', () => {
    const css = generateCSS(config);
    expect(css).toContain('.hdx-ui-icon');
    expect(css).toContain('.hdx-ui-icon-spin');
  });
});