import { describe, it, expect } from 'vitest';
import { loadConfig } from '../../src/core/config.js';
import { getAllComponents } from '../../src/components/index.js';
import { generateCSS } from '../../src/generator/index.js';

const config = loadConfig();

describe('notification components', () => {
  const components = getAllComponents(config);

  it('ships the unread dot indicator', () => {
    const dot = components.find(c => c.name === 'ui-notification-dot');
    expect(dot).toBeDefined();
    expect(dot.category).toBe('components');
    expect(dot.css).toContain('position: absolute');
    expect(dot.css).toContain('border-radius: 9999px');
    // Colored via the danger token so theme overrides flow in.
    expect(dot.css).toContain('var(--hdx-color-danger)');
  });

  it('ships the count badge sized to hold text', () => {
    const badge = components.find(c => c.name === 'ui-notification-badge');
    expect(badge).toBeDefined();
    expect(badge.category).toBe('components');
    expect(badge.css).toContain('border-radius: 9999px');
    expect(badge.css).toContain('var(--hdx-color-danger)');
    expect(badge.css).toContain('font-weight: 600');
  });

  it('ships the notification list item with a :hover state', () => {
    const item = components.find(c => c.name === 'ui-notification-item');
    expect(item).toBeDefined();
    expect(item.category).toBe('components');
    expect(item.states).toBeDefined();
    expect(item.states[0].selector).toBe(':hover');
    expect(item.states[0].css).toContain('var(--hdx-color-surface-secondary)');
  });

  it('ships the unread item modifier', () => {
    const unread = components.find(c => c.name === 'ui-notification-item-unread');
    expect(unread).toBeDefined();
    expect(unread.css).toContain('var(--hdx-color-primary)');
  });

  it('ships the persistent notification panel container', () => {
    const panel = components.find(c => c.name === 'ui-notification-panel');
    expect(panel).toBeDefined();
    expect(panel.category).toBe('components');
    expect(panel.css).toContain('overflow-y: auto');
    expect(panel.css).toContain('var(--hdx-color-surface)');
  });

  it('emits prefixed hdx-ui-notification classes in generated CSS', () => {
    const css = generateCSS(config);
    expect(css).toContain('.hdx-ui-notification-badge');
    expect(css).toContain('.hdx-ui-notification-item:hover');
  });
});