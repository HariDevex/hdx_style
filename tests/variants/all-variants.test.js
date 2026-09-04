import { describe, it, expect } from 'vitest';
import { loadConfig } from '../../src/core/config.js';
import { getAllVariants } from '../../src/variants/index.js';

const config = loadConfig();

describe('variants', () => {
  const variants = getAllVariants(config);

  it('generates variants', () => {
    expect(variants.length).toBeGreaterThan(10);
  });

  it('has state variants', () => {
    expect(variants.find(v => v.name === 'hover')).toBeDefined();
    expect(variants.find(v => v.name === 'focus')).toBeDefined();
    expect(variants.find(v => v.name === 'active')).toBeDefined();
    expect(variants.find(v => v.name === 'disabled')).toBeDefined();
  });

  it('has responsive variants', () => {
    expect(variants.find(v => v.name === 'sm')).toBeDefined();
    expect(variants.find(v => v.name === 'md')).toBeDefined();
    expect(variants.find(v => v.name === 'lg')).toBeDefined();
    expect(variants.find(v => v.name === 'xl')).toBeDefined();
    expect(variants.find(v => v.name === '2xl')).toBeDefined();
  });

  it('has dark variant', () => {
    expect(variants.find(v => v.name === 'dark')).toBeDefined();
  });

  it('responsive variants have correct selectors', () => {
    const md = variants.find(v => v.name === 'md');
    expect(md.selector()).toBe('@media (min-width: 768px)');
    const lg = variants.find(v => v.name === 'lg');
    expect(lg.selector()).toBe('@media (min-width: 1024px)');
  });

  it('state variants have correct pseudo-classes', () => {
    expect(variants.find(v => v.name === 'hover').selector()).toBe(':hover');
    expect(variants.find(v => v.name === 'focus').selector()).toBe(':focus');
    expect(variants.find(v => v.name === 'active').selector()).toBe(':active');
  });

  it('dark variant has correct selector (class strategy)', () => {
    const dark = variants.find(v => v.name === 'dark' && v.strategy === 'class');
    expect(dark).toBeDefined();
    expect(dark.selector()).toBe('.dark');
  });

  it('group variants exist', () => {
    expect(variants.find(v => v.name === 'group-hover')).toBeDefined();
  });
});

describe('variants with media strategy', () => {
  it('dark variant uses media query', () => {
    const mediaConfig = loadConfig({ darkMode: 'media' });
    const variants = getAllVariants(mediaConfig);
    const dark = variants.find(v => v.name === 'dark');
    expect(dark.selector()).toContain('@media (prefers-color-scheme: dark)');
  });
});

describe('variants with both strategy', () => {
  it('dark variant generates both class and media', () => {
    const bothConfig = loadConfig({ darkMode: 'both' });
    const variants = getAllVariants(bothConfig);
    const darkVariants = variants.filter(v => v.name === 'dark');
    expect(darkVariants.length).toBe(2);
  });
});
