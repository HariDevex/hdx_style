import { describe, expect, it } from 'vitest';

import { defineConfig, loadConfig } from '../../src/index.js';

describe('defineConfig', () => {
  it('returns its argument unchanged (identity)', () => {
    const cfg = { prefix: 'tw_', theme: { breakpoints: { xs: '480px' } } };
    expect(defineConfig(cfg)).toBe(cfg);
  });

  it('merges over defaults when passed through loadConfig', () => {
    const merged = loadConfig(defineConfig({ prefix: 'acme_', theme: { breakpoints: { xs: '480px' } }, content: ['src/**/*.js'] }));
    expect(merged.prefix).toBe('acme_');
    expect(merged.content).toEqual(['src/**/*.js']);
    expect(merged.darkMode).toBe('class');
    expect(merged.theme.breakpoints.sm).toBe('640px');
    expect(merged.theme.breakpoints.xs).toBe('480px');
  });

  it('accepts a falsy-trimmed config without crashing', () => {
    expect(loadConfig(defineConfig({}))).toHaveProperty('theme');
  });
});