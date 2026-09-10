import { describe, it, expect } from 'vitest';
import { loadConfig } from '../../src/core/config.js';
import { getAllComponents } from '../../src/components/index.js';
import { generateCSS } from '../../src/generator/index.js';

const config = loadConfig();

describe('form components', () => {
  const components = getAllComponents(config);

  it('ships the toggle switch (track + thumb + checked states)', () => {
    const track = components.find(c => c.name === 'ui-switch');
    expect(track).toBeDefined();
    expect(track.category).toBe('components');
    expect(track.css).toContain('border-radius');
    expect(track.css).toContain('var(--hdx-color-surface-secondary)');
    const thumb = components.find(c => c.name === 'ui-switch-thumb');
    expect(thumb).toBeDefined();
    expect(thumb.css).toContain('var(--hdx-color-white)');
    const checked = components.find(c => c.name === 'ui-switch-checked');
    expect(checked).toBeDefined();
    expect(checked.css).toContain('var(--hdx-color-primary)');
    const thumbChecked = components.find(c => c.name === 'ui-switch-thumb-checked');
    expect(thumbChecked).toBeDefined();
    expect(thumbChecked.css).toContain('translateX(1.375rem)');
  });

  it('ships chips (tag + close button) with hover states', () => {
    const chip = components.find(c => c.name === 'ui-chip');
    expect(chip).toBeDefined();
    expect(chip.css).toContain('var(--hdx-color-surface-secondary)');
    expect(chip.states.some(s => s.selector === ':hover')).toBe(true);
    const close = components.find(c => c.name === 'ui-chip-close');
    expect(close).toBeDefined();
    expect(close.states.some(s => s.selector === ':hover')).toBe(true);
  });

  it('ships the field group (wrapper + label + hint + error)', () => {
    expect(components.find(c => c.name === 'ui-form-group')).toBeDefined();
    const label = components.find(c => c.name === 'ui-form-label');
    expect(label).toBeDefined();
    expect(label.css).toContain('var(--hdx-color-text-secondary)');
    const hint = components.find(c => c.name === 'ui-form-hint');
    expect(hint.css).toContain('var(--hdx-color-text-muted)');
    const error = components.find(c => c.name === 'ui-form-error');
    expect(error.css).toContain('var(--hdx-color-danger)');
  });

  it('ships the floating-label pair (input + label + active state)', () => {
    const input = components.find(c => c.name === 'ui-floating-input');
    expect(input).toBeDefined();
    expect(input.css).toContain('padding-top');
    const label = components.find(c => c.name === 'ui-floating-label');
    expect(label).toBeDefined();
    expect(label.css).toContain('position: absolute');
    const active = components.find(c => c.name === 'ui-floating-label-active');
    expect(active).toBeDefined();
    expect(active.css).toContain('scale(0.8)');
  });

  it('keeps field groups distinct from the existing input family', () => {
    expect(components.find(c => c.name === 'ui-form-label')).toBeDefined();
    // hdx-label (input.js) still ships, untouched.
    expect(components.find(c => c.name === 'label')).toBeDefined();
  });

  it('emits prefixed hdx-ui-* classes in generated CSS', () => {
    const css = generateCSS(config);
    expect(css).toContain('.hdx-ui-switch');
    expect(css).toContain('.hdx-ui-switch-thumb-checked');
    expect(css).toContain('.hdx-ui-chip-close');
    expect(css).toContain('.hdx-ui-form-error');
    expect(css).toContain('.hdx-ui-floating-label-active');
  });
});