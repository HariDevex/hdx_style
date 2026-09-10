import { describe, it, expect } from 'vitest';
import { loadConfig } from '../../src/core/config.js';
import { getAllComponents } from '../../src/components/index.js';
import { generateCSS } from '../../src/generator/index.js';

const config = loadConfig();

describe('media components', () => {
  const components = getAllComponents(config);

  it('ships the carousel (rail + snap items + prev/next buttons)', () => {
    const rail = components.find(c => c.name === 'ui-carousel');
    expect(rail).toBeDefined();
    expect(rail.category).toBe('components');
    expect(rail.css).toContain('scroll-snap-type: x mandatory');
    const item = components.find(c => c.name === 'ui-carousel-item');
    expect(item).toBeDefined();
    expect(item.css).toContain('scroll-snap-align: start');
    const prev = components.find(c => c.name === 'ui-carousel-prev');
    const next = components.find(c => c.name === 'ui-carousel-next');
    expect(prev).toBeDefined();
    expect(next).toBeDefined();
    expect(prev.states.some(s => s.selector === ':hover')).toBe(true);
    expect(next.css).toContain('var(--hdx-color-surface)');
  });

  it('ships the thumbnail strip (row + item + active ring)', () => {
    expect(components.find(c => c.name === 'ui-thumbnails')).toBeDefined();
    const thumb = components.find(c => c.name === 'ui-thumbnail');
    expect(thumb).toBeDefined();
    expect(thumb.css).toContain('border: 2px solid transparent');
    expect(thumb.states.some(s => s.selector === ':hover')).toBe(true);
    const active = components.find(c => c.name === 'ui-thumbnail-active');
    expect(active).toBeDefined();
    expect(active.css).toContain('var(--hdx-color-primary)');
  });

  it('ships figure + caption wrappers', () => {
    const figure = components.find(c => c.name === 'ui-figure');
    expect(figure).toBeDefined();
    expect(figure.css).toContain('margin: 0');
    const caption = components.find(c => c.name === 'ui-figure-caption');
    expect(caption).toBeDefined();
    expect(caption.css).toContain('var(--hdx-color-text-muted)');
    expect(caption.css).toContain('text-align: center');
  });

  it('emits prefixed hdx-ui-* classes in generated CSS', () => {
    const css = generateCSS(config);
    expect(css).toContain('.hdx-ui-carousel');
    expect(css).toContain('.hdx-ui-carousel-next');
    expect(css).toContain('.hdx-ui-thumbnail-active');
    expect(css).toContain('.hdx-ui-figure-caption');
  });
});