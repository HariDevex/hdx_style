import { describe, it, expect } from 'vitest';
import { loadConfig } from '../../src/core/config.js';
import { getAllComponents } from '../../src/components/index.js';
import { generateCSS } from '../../src/generator/index.js';

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

  it('solid button variants carry :hover/:active state rules', () => {
    for (const base of ['primary', 'secondary', 'success', 'danger', 'warning', 'info']) {
      const variant = components.find(c => c.name === `btn-${base}`);
      expect(variant.states).toBeDefined();
      expect(variant.states.map(s => s.selector)).toEqual([':hover', ':active']);
      expect(variant.states[0].css).toContain(`var(--hdx-color-${base}-hover)`);
      expect(variant.states[1].css).toContain(`var(--hdx-color-${base}-active)`);
    }
  });

  it('emits :hover/:active rules resolving -hover/-active variables', () => {
    const css = generateCSS(config);
    for (const base of ['danger', 'info', 'success', 'primary']) {
      expect(css).toContain(`.hdx-btn-${base}:hover`);
      expect(css).toContain(`var(--hdx-color-${base}-hover)`);
      expect(css).toContain(`.hdx-btn-${base}:active`);
      expect(css).toContain(`var(--hdx-color-${base}-active)`);
    }
  });

  it('modal overlay reads its z-index from theme.zIndex.overlay', () => {
    const overlay = components.find(c => c.name === 'modal-overlay');
    expect(overlay.css).toContain('z-index: 1200');
  });

  it('modal overlay z-index follows a user theme overrides', () => {
    const overridden = loadConfig({ theme: { zIndex: { overlay: '777' } } });
    const overlay = getAllComponents(overridden).find(c => c.name === 'modal-overlay');
    expect(overlay.css).toContain('z-index: 777');
  });

  it('other overlay layers keep their hardcoded z-indexes', () => {
    // Modal panel (content) intentionally rides at the overlay layer so it is not
    // stacked independently; dropdown/sticky/etc. stay theme-driven utilities.
    const modal = components.find(c => c.name === 'modal');
    expect(modal.css).not.toContain('z-index');
  });

  it('has expanded button variants, sizes, and accessibility states', () => {
    expect(components.find(c => c.name === 'btn-xs')).toBeDefined();
    expect(components.find(c => c.name === 'btn-xl')).toBeDefined();
    expect(components.find(c => c.name === 'btn-pill')).toBeDefined();
    expect(components.find(c => c.name === 'btn-link')).toBeDefined();
    expect(components.find(c => c.name === 'btn-outline-primary')).toBeDefined();
    expect(components.find(c => c.name === 'btn-outline-danger')).toBeDefined();
    expect(components.find(c => c.name === 'btn-group')).toBeDefined();
    expect(components.find(c => c.name === 'btn-group-vertical')).toBeDefined();

    const btn = components.find(c => c.name === 'btn');
    const stateSelectors = btn.states.map(s => s.selector);
    expect(stateSelectors).toContain(':focus-visible');
    expect(stateSelectors).toContain(':disabled');
    expect(stateSelectors).toContain('[aria-disabled="true"]');
  });

  it('has expanded badge variants, sizes, and indicator shapes', () => {
    expect(components.find(c => c.name === 'badge-secondary')).toBeDefined();
    expect(components.find(c => c.name === 'badge-outline-primary')).toBeDefined();
    expect(components.find(c => c.name === 'badge-soft-primary')).toBeDefined();
    expect(components.find(c => c.name === 'badge-soft-success')).toBeDefined();
    expect(components.find(c => c.name === 'badge-xs')).toBeDefined();
    expect(components.find(c => c.name === 'badge-lg')).toBeDefined();
    expect(components.find(c => c.name === 'badge-rounded')).toBeDefined();
    expect(components.find(c => c.name === 'badge-dot')).toBeDefined();
    expect(components.find(c => c.name === 'badge-count')).toBeDefined();
  });

  it('has skeleton loader components with pulse animation', () => {
    const skeleton = components.find(c => c.name === 'skeleton');
    expect(skeleton).toBeDefined();
    expect(skeleton.css).toContain('animation:');
    expect(components.find(c => c.name === 'skeleton-text')).toBeDefined();
    expect(components.find(c => c.name === 'skeleton-avatar')).toBeDefined();
    expect(components.find(c => c.name === 'skeleton-button')).toBeDefined();
    expect(components.find(c => c.name === 'skeleton-card')).toBeDefined();
  });

  it('has real-world layout primitives for dashboards and pages', () => {
    expect(components.find(c => c.name === 'ui-page-shell')).toBeDefined();
    expect(components.find(c => c.name === 'ui-page-main')).toBeDefined();
    expect(components.find(c => c.name === 'ui-page-header')).toBeDefined();
    expect(components.find(c => c.name === 'ui-page-title')).toBeDefined();
    expect(components.find(c => c.name === 'ui-page-content')).toBeDefined();
    expect(components.find(c => c.name === 'ui-sidebar-rail')).toBeDefined();
    expect(components.find(c => c.name === 'ui-kpi-grid')).toBeDefined();
    expect(components.find(c => c.name === 'ui-kpi-card')).toBeDefined();
    expect(components.find(c => c.name === 'ui-kpi-value')).toBeDefined();
    expect(components.find(c => c.name === 'ui-empty-state')).toBeDefined();
    expect(components.find(c => c.name === 'ui-divider')).toBeDefined();
  });

  it('has interactive accordion and tab primitives', () => {
    expect(components.find(c => c.name === 'ui-accordion')).toBeDefined();
    expect(components.find(c => c.name === 'ui-accordion-header')).toBeDefined();
    expect(components.find(c => c.name === 'ui-accordion-content')).toBeDefined();
    expect(components.find(c => c.name === 'ui-tabs')).toBeDefined();
    expect(components.find(c => c.name === 'ui-tab')).toBeDefined();
    expect(components.find(c => c.name === 'ui-tab-active')).toBeDefined();
  });
});
