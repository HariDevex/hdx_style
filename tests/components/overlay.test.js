import { describe, it, expect } from 'vitest';
import { loadConfig } from '../../src/core/config.js';
import { getAllComponents } from '../../src/components/index.js';
import { generateCSS } from '../../src/generator/index.js';

const config = loadConfig();

describe('overlay components', () => {
  const components = getAllComponents(config);

  it('ships the drawer (panel + right variant + open state)', () => {
    const drawer = components.find(c => c.name === 'ui-drawer');
    expect(drawer).toBeDefined();
    expect(drawer.category).toBe('components');
    expect(drawer.css).toContain('position: fixed');
    expect(drawer.css).toContain('transform: translateX(-100%)');
    expect(drawer.css).toContain('var(--hdx-color-surface)');
    expect(components.find(c => c.name === 'ui-drawer-right')).toBeDefined();
    const open = components.find(c => c.name === 'ui-drawer-open');
    expect(open).toBeDefined();
    expect(open.css).toContain('translateX(0)');
  });

  it('ships the drawer backdrop that mirrors the dropdown reveal contract', () => {
    const overlay = components.find(c => c.name === 'ui-drawer-overlay');
    expect(overlay).toBeDefined();
    expect(overlay.css).toContain('background-color: rgba(0, 0, 0, 0.5)');
    expect(overlay.css).toContain('opacity: 0');
    const open = components.find(c => c.name === 'ui-drawer-overlay-open');
    expect(open).toBeDefined();
    expect(open.css).toContain('visibility: visible');
  });

  it('ships the popover (panel + open + arrow), anchored and token-styled', () => {
    const popover = components.find(c => c.name === 'ui-popover');
    expect(popover).toBeDefined();
    expect(popover.css).toContain('position: absolute');
    expect(popover.css).toContain('var(--hdx-color-surface)');
    expect(components.find(c => c.name === 'ui-popover-open')).toBeDefined();
    const arrow = components.find(c => c.name === 'ui-popover-arrow');
    expect(arrow).toBeDefined();
    expect(arrow.css).toContain('rotate(45deg)');
  });

  it('ships the lightbox (layer + open + content + close + caption)', () => {
    const lightbox = components.find(c => c.name === 'ui-lightbox');
    expect(lightbox).toBeDefined();
    expect(lightbox.category).toBe('components');
    expect(lightbox.css).toContain('position: fixed');
    expect(lightbox.css).toContain('rgba(0, 0, 0, 0.7)');
    expect(components.find(c => c.name === 'ui-lightbox-open')).toBeDefined();
    const content = components.find(c => c.name === 'ui-lightbox-content');
    expect(content).toBeDefined();
    expect(content.css).toContain('var(--hdx-color-surface)');
    const close = components.find(c => c.name === 'ui-lightbox-close');
    expect(close).toBeDefined();
    expect(close.states).toBeDefined();
    expect(close.states.some(s => s.selector === ':hover')).toBe(true);
    expect(components.find(c => c.name === 'ui-lightbox-caption')).toBeDefined();
  });

  it('lays the drawer below the popover in the z-index scale', () => {
    const drawer = components.find(c => c.name === 'ui-drawer').css;
    const overlay = components.find(c => c.name === 'ui-drawer-overlay').css;
    const popover = components.find(c => c.name === 'ui-popover').css;
    const z = (css) => Number(css.match(/z-index: (\d+);/)?.[1]);
    expect(z(drawer)).toBeGreaterThan(z(overlay));
    expect(z(popover)).toBeGreaterThan(z(drawer));
  });

  it('emits prefixed hdx-ui-* classes in generated CSS', () => {
    const css = generateCSS(config);
    expect(css).toContain('.hdx-ui-drawer');
    expect(css).toContain('.hdx-ui-drawer-open');
    expect(css).toContain('.hdx-ui-popover-open');
    expect(css).toContain('.hdx-ui-lightbox');
    expect(css).toContain('.hdx-ui-lightbox-caption');
  });
});