import { describe, it, expect } from 'vitest';
import { defaultTheme } from '../../src/theme/defaults.js';
import { generateAllVariables } from '../../src/theme/variables.js';

describe('theme defaults', () => {
  it('has all color categories', () => {
    expect(defaultTheme.colors.primary).toBe('#2563EB');
    expect(defaultTheme.colors.background).toBe('#F8FAFC');
    expect(defaultTheme.colors.surface).toBe('#FFFFFF');
    expect(defaultTheme.colors.text).toBe('#0F172A');
    expect(defaultTheme.colors.border).toBe('#E2E8F0');
  });

  it('has dark color overrides', () => {
    expect(defaultTheme.darkColors.background).toBe('#0F172A');
    expect(defaultTheme.darkColors.surface).toBe('#1E293B');
  });

  it('has spacing scale', () => {
    expect(defaultTheme.spacing['0']).toBe('0px');
    expect(defaultTheme.spacing['4']).toBe('1rem');
    expect(defaultTheme.spacing['8']).toBe('2rem');
  });

  it('has breakpoints', () => {
    expect(defaultTheme.breakpoints.sm).toBe('640px');
    expect(defaultTheme.breakpoints.md).toBe('768px');
    expect(defaultTheme.breakpoints.lg).toBe('1024px');
  });

  it('has border radius', () => {
    expect(defaultTheme.radius.lg).toBe('0.5rem');
    expect(defaultTheme.radius.full).toBe('9999px');
  });

  it('has shadows', () => {
    expect(defaultTheme.shadows.sm).toContain('rgba');
    expect(defaultTheme.shadows.none).toBe('none');
  });
});

describe('CSS variables generation', () => {
  it('generates :root variables', () => {
    const css = generateAllVariables(defaultTheme);
    expect(css).toContain(':root {');
    expect(css).toContain('--hdx-color-primary: #2563EB');
    expect(css).toContain('--hdx-color-background: #F8FAFC');
  });

  it('generates dark class variables', () => {
    const css = generateAllVariables(defaultTheme);
    expect(css).toContain('.dark {');
    expect(css).toContain('--hdx-color-background: #0F172A');
  });

  it('generates dark media query variables', () => {
    const css = generateAllVariables(defaultTheme);
    expect(css).toContain('@media (prefers-color-scheme: dark)');
    expect(css).toContain('.hdx_dark-media {');
  });

  it('custom prefix changes variable prefix', () => {
    const css = generateAllVariables(defaultTheme, 'my_');
    expect(css).toContain('--my-color-primary');
    expect(css).not.toContain('--hdx-color-primary');
  });
});
