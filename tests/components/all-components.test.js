import { describe, it, expect } from 'vitest';
import { loadConfig } from '../../src/core/config.js';
import { getAllComponents } from '../../src/components/index.js';

const config = loadConfig();

describe('components', () => {
  const components = getAllComponents(config);

  it('generates components', () => {
    expect(components.length).toBeGreaterThan(30);
  });

  it('has button base', () => {
    const btn = components.find(c => c.name === 'btn');
    expect(btn).toBeDefined();
    expect(btn.css).toContain('display: inline-flex');
    expect(btn.css).toContain('border-radius');
  });

  it('has button variants', () => {
    expect(components.find(c => c.name === 'btn-primary')).toBeDefined();
    expect(components.find(c => c.name === 'btn-secondary')).toBeDefined();
    expect(components.find(c => c.name === 'btn-danger')).toBeDefined();
    expect(components.find(c => c.name === 'btn-outline')).toBeDefined();
    expect(components.find(c => c.name === 'btn-ghost')).toBeDefined();
  });

  it('has button sizes', () => {
    expect(components.find(c => c.name === 'btn-sm')).toBeDefined();
    expect(components.find(c => c.name === 'btn-md')).toBeDefined();
    expect(components.find(c => c.name === 'btn-lg')).toBeDefined();
  });

  it('has input component', () => {
    expect(components.find(c => c.name === 'input')).toBeDefined();
    expect(components.find(c => c.name === 'select')).toBeDefined();
    expect(components.find(c => c.name === 'textarea')).toBeDefined();
  });

  it('has card component', () => {
    expect(components.find(c => c.name === 'card')).toBeDefined();
    expect(components.find(c => c.name === 'card-header')).toBeDefined();
    expect(components.find(c => c.name === 'card-body')).toBeDefined();
    expect(components.find(c => c.name === 'card-footer')).toBeDefined();
  });

  it('has badge component', () => {
    expect(components.find(c => c.name === 'badge')).toBeDefined();
    expect(components.find(c => c.name === 'badge-primary')).toBeDefined();
  });

  it('has alert component', () => {
    expect(components.find(c => c.name === 'alert')).toBeDefined();
    expect(components.find(c => c.name === 'alert-danger')).toBeDefined();
  });

  it('has avatar component', () => {
    expect(components.find(c => c.name === 'avatar')).toBeDefined();
  });

  it('has modal component', () => {
    expect(components.find(c => c.name === 'modal')).toBeDefined();
    expect(components.find(c => c.name === 'modal-overlay')).toBeDefined();
  });

  it('has table component', () => {
    expect(components.find(c => c.name === 'table')).toBeDefined();
  });

  it('has container component', () => {
    expect(components.find(c => c.name === 'container')).toBeDefined();
  });

  it('components have CSS variable references for semantic colors', () => {
    const btn = components.find(c => c.name === 'btn-primary');
    expect(btn.css).toContain('var(--hdx-color-primary)');
  });
});
