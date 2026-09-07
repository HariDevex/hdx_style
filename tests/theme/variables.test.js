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

  // WCAG 2.x relative luminance → contrast ratio.
  const luminance = (hex) => {
    const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(c =>
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const ratio = (a, b) => {
    const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (l1 + 0.05) / (l2 + 0.05);
  };

  it('dark action colors hit WCAG AA (~4.5:1) against dark surfaces', () => {
    const actions = {
      primary: '#60A5FA',
      success: '#22C55E',
      danger: '#F87171',
      warning: '#FBBF24',
      info: '#0EA5E9',
    };
    for (const [key, hex] of Object.entries(actions)) {
      expect(defaultTheme.darkColors[key]).toBe(hex);
      for (const bg of ['#0F172A', '#1E293B']) {
        expect(ratio(hex, bg))
          .toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  it('dark action colors emit under .hdx_dark', () => {
    const css = generateAllVariables(defaultTheme, 'hdx_', 'class');
    for (const key of ['primary', 'success', 'danger', 'warning', 'info']) {
      expect(css).toContain(`--hdx-color-${key}: ${defaultTheme.darkColors[key]}`);
    }
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

  it('has a full 3-stage state shape for all six action colors', () => {
    for (const base of ['primary', 'secondary', 'success', 'danger', 'warning', 'info']) {
      expect(defaultTheme.colors[base]).toBeTruthy();
      expect(defaultTheme.colors[`${base}-hover`]).toBeTruthy();
      expect(defaultTheme.colors[`${base}-active`]).toBeTruthy();
    }
  });
});

describe('CSS variables generation', () => {
  it('generates :root variables', () => {
    const css = generateAllVariables(defaultTheme, 'hdx_', 'class');
    expect(css).toContain(':root {');
    expect(css).toContain('--hdx-color-primary: #2563EB');
    expect(css).toContain('--hdx-color-background: #F8FAFC');
  });

  it('generates .hdx_dark class variables', () => {
    const css = generateAllVariables(defaultTheme, 'hdx_', 'class');
    expect(css).toContain('.hdx_dark {');
    expect(css).toContain('--hdx-color-background: #0F172A');
  });

  it('generates dark media query variables with media strategy', () => {
    const css = generateAllVariables(defaultTheme, 'hdx_', 'media');
    expect(css).toContain('@media (prefers-color-scheme: dark)');
    expect(css).toContain(':root {');
    expect(css).not.toContain('.hdx_dark {');
  });

  it('generates both class and media variables with both strategy', () => {
    const css = generateAllVariables(defaultTheme, 'hdx_', 'both');
    expect(css).toContain('.hdx_dark {');
    expect(css).toContain('@media (prefers-color-scheme: dark)');
  });

  it('custom prefix changes variable prefix', () => {
    const css = generateAllVariables(defaultTheme, 'my_', 'class');
    expect(css).toContain('--my-color-primary');
    expect(css).not.toContain('--hdx-color-primary');
  });
});
