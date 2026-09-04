import { describe, it, expect } from 'vitest';
import { loadConfig, getDefaultConfig } from '../../src/core/config.js';
import { deepMerge } from '../../src/theme/merge.js';

describe('config', () => {
  it('getDefaultConfig returns valid config', () => {
    const config = getDefaultConfig();
    expect(config.prefix).toBe('hdx_');
    expect(config.darkMode).toBe('class');
    expect(config.theme).toBeDefined();
    expect(config.theme.colors).toBeDefined();
    expect(config.theme.spacing).toBeDefined();
    expect(config.theme.breakpoints).toBeDefined();
  });

  it('loadConfig merges with defaults', () => {
    const config = loadConfig({});
    expect(config.prefix).toBe('hdx_');
    expect(config.theme.colors.primary).toBe('#2563EB');
  });

  it('loadConfig overrides prefix', () => {
    const config = loadConfig({ prefix: 'my_' });
    expect(config.prefix).toBe('my_');
  });

  it('loadConfig overrides theme colors deeply', () => {
    const config = loadConfig({
      theme: {
        colors: {
          primary: '#7C3AED',
        },
      },
    });
    expect(config.theme.colors.primary).toBe('#7C3AED');
    // Other colors preserved
    expect(config.theme.colors.secondary).toBe('#64748B');
  });

  it('loadConfig overrides spacing', () => {
    const config = loadConfig({
      theme: {
        spacing: {
          4: '2rem',
        },
      },
    });
    expect(config.theme.spacing['4']).toBe('2rem');
    expect(config.theme.spacing['1']).toBe('0.25rem');
  });
});

describe('deepMerge', () => {
  it('merges flat objects', () => {
    const result = deepMerge({ a: 1, b: 2 }, { b: 3, c: 4 });
    expect(result).toEqual({ a: 1, b: 3, c: 4 });
  });

  it('merges nested objects', () => {
    const result = deepMerge(
      { a: { x: 1, y: 2 } },
      { a: { y: 3, z: 4 } }
    );
    expect(result).toEqual({ a: { x: 1, y: 3, z: 4 } });
  });

  it('does not mutate originals', () => {
    const target = { a: { x: 1 } };
    const source = { a: { y: 2 } };
    deepMerge(target, source);
    expect(target.a).toEqual({ x: 1 });
    expect(source.a).toEqual({ y: 2 });
  });
});
