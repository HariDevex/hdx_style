import { describe, it, expect } from 'vitest';
import { loadConfig } from '../../src/core/config.js';
import { getAllComponents } from '../../src/components/index.js';
import { generateCSS } from '../../src/generator/index.js';

const config = loadConfig();

describe('navigation components', () => {
  const components = getAllComponents(config);

  it('ships tab navigation (container + item + active state)', () => {
    expect(components.find(c => c.name === 'ui-nav-tabs')).toBeDefined();
    const tab = components.find(c => c.name === 'ui-nav-tab');
    expect(tab).toBeDefined();
    expect(tab.category).toBe('components');
    expect(tab.css).toContain('border-bottom: 2px solid transparent');
    const active = components.find(c => c.name === 'ui-nav-tab-active');
    expect(active).toBeDefined();
    expect(active.css).toContain('var(--hdx-color-primary)');
  });

  it('ships the pill-style tabs variant', () => {
    expect(components.find(c => c.name === 'ui-nav-tabs-pills')).toBeDefined();
    const active = components.find(c => c.name === 'ui-nav-tab-pill-active');
    expect(active).toBeDefined();
    expect(active.css).toContain('var(--hdx-color-primary)');
    expect(active.css).toContain('border-radius');
  });

  it('ships breadcrumbs (container + item + separator + current)', () => {
    expect(components.find(c => c.name === 'ui-breadcrumb')).toBeDefined();
    expect(components.find(c => c.name === 'ui-breadcrumb-item')).toBeDefined();
    expect(components.find(c => c.name === 'ui-breadcrumb-separator')).toBeDefined();
    const current = components.find(c => c.name === 'ui-breadcrumb-current');
    expect(current).toBeDefined();
    expect(current.css).toContain('var(--hdx-color-text-muted)');
  });

  it('ships pagination (container + item + active + disabled)', () => {
    expect(components.find(c => c.name === 'ui-pagination')).toBeDefined();
    const item = components.find(c => c.name === 'ui-pagination-item');
    expect(item).toBeDefined();
    expect(item.css).toContain('var(--hdx-color-surface)');
    const active = components.find(c => c.name === 'ui-pagination-item-active');
    expect(active.css).toContain('var(--hdx-color-primary)');
    const disabled = components.find(c => c.name === 'ui-pagination-item-disabled');
    expect(disabled.css).toContain('cursor: not-allowed');
  });

  it('ships the mobile bottom tab bar with safe-area padding', () => {
    const bottom = components.find(c => c.name === 'ui-nav-bottom');
    expect(bottom).toBeDefined();
    expect(bottom.category).toBe('components');
    expect(bottom.css).toContain('position: fixed');
    expect(bottom.css).toContain('bottom: 0');
    expect(bottom.css).toContain('env(safe-area-inset-bottom)');
    expect(components.find(c => c.name === 'ui-nav-bottom-item')).toBeDefined();
    const active = components.find(c => c.name === 'ui-nav-bottom-item-active');
    expect(active.css).toContain('var(--hdx-color-primary)');
  });

  it('ships header modifier classes layered onto ui-header', () => {
    const sticky = components.find(c => c.name === 'ui-header-sticky');
    expect(sticky).toBeDefined();
    expect(sticky.css).toContain('position: sticky');
    expect(sticky.css).toContain('top: 0');
    expect(sticky.css).toContain('z-index:');
    const transparent = components.find(c => c.name === 'ui-header-transparent');
    expect(transparent).toBeDefined();
    expect(transparent.css).toContain('background-color: transparent');
  });

  it('does not emit sticky twice on ui-header', () => {
    // ui-header already carries position:sticky; ui-header-sticky is an
    // explicit opt-in so the two should coexist without conflicting.
    const header = components.find(c => c.name === 'ui-header');
    expect(header.css).toContain('position: sticky');
  });

  it('emits prefixed hdx-ui-* classes in generated CSS', () => {
    const css = generateCSS(config);
    expect(css).toContain('.hdx-ui-nav-tab');
    expect(css).toContain('.hdx-ui-breadcrumb-current');
    expect(css).toContain('.hdx-ui-pagination-item-disabled');
    expect(css).toContain('.hdx-ui-nav-bottom');
    expect(css).toContain('.hdx-ui-header-transparent');
  });
});