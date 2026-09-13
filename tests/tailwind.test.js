import { describe, it, expect } from 'vitest';
import { compile } from 'tailwindcss';
import {
  hdxTailwindPreset,
  createTailwindPreset,
  hdxTailwindPlugin,
  createTailwindPlugin,
  generateTailwindThemeCSS,
  hdxColors,
  hdxDarkColors,
  hdxSpacing,
  hdxFontSize,
  hdxFontWeight,
  hdxLineHeight,
  hdxLetterSpacing,
  hdxBorderRadius,
  hdxBoxShadow,
  hdxScreens,
  hdxOpacity,
  hdxZIndex,
  hdxTransitionDuration,
  hdxTransitionTimingFunction,
  hdxFontFamily,
} from '../src/tailwind.js';
import { defaultTheme } from '../src/theme/defaults.js';

describe('Tailwind CSS Integration', () => {
  describe('hdxTailwindPreset', () => {
    it('provides complete theme extension with all HDX default values', () => {
      const extend = hdxTailwindPreset.theme.extend;

      expect(extend.colors).toEqual(defaultTheme.colors);
      expect(extend.spacing).toEqual(defaultTheme.spacing);
      expect(extend.fontSize).toEqual(defaultTheme.fontSize);
      expect(extend.fontWeight).toEqual(defaultTheme.fontWeight);
      expect(extend.lineHeight).toEqual(defaultTheme.lineHeight);
      expect(extend.letterSpacing).toEqual(defaultTheme.letterSpacing);
      expect(extend.borderRadius).toEqual(defaultTheme.radius);
      expect(extend.boxShadow).toEqual(defaultTheme.shadows);
      expect(extend.screens).toEqual(defaultTheme.breakpoints);
      expect(extend.opacity).toEqual(defaultTheme.opacity);
      expect(extend.zIndex).toEqual(defaultTheme.zIndex);
      expect(extend.transitionDuration).toEqual(defaultTheme.transitionDuration);
      expect(extend.transitionTimingFunction).toEqual(defaultTheme.transitionTiming);
      expect(extend.fontFamily.sans).toContain('Inter');
    });

    it('exports dedicated token collections matching default-values.txt', () => {
      expect(hdxColors.primary).toBe('#2563EB');
      expect(hdxDarkColors.primary).toBe('#60A5FA');
      expect(hdxSpacing['4']).toBe('1rem');
      expect(hdxFontSize.base).toBe('1rem');
      expect(hdxFontWeight.bold).toBe('700');
      expect(hdxLineHeight.normal).toBe('1.5');
      expect(hdxLetterSpacing.tight).toBe('-0.025em');
      expect(hdxBorderRadius.md).toBe('0.375rem');
      expect(hdxBoxShadow.md).toContain('rgba(15, 23, 42, 0.08)');
      expect(hdxScreens.md).toBe('768px');
      expect(hdxOpacity['50']).toBe('0.5');
      expect(hdxZIndex.modal).toBe('1300');
      expect(hdxTransitionDuration['200']).toBe('200ms');
      expect(hdxTransitionTimingFunction.ease).toBe('ease');
      expect(hdxFontFamily.sans).toContain('ui-sans-serif');
    });

    it('allows overriding and extending theme via createTailwindPreset', () => {
      const customPreset = createTailwindPreset({
        theme: {
          extend: {
            colors: {
              brand: '#ff00aa',
            },
            screens: {
              '3xl': '1920px',
            },
          },
        },
      });

      expect(customPreset.theme.extend.colors.brand).toBe('#ff00aa');
      expect(customPreset.theme.extend.colors.primary).toBe('#2563EB');
      expect(customPreset.theme.extend.screens['3xl']).toBe('1920px');
      expect(customPreset.theme.extend.screens.md).toBe('768px');
    });
  });

  describe('hdxTailwindPlugin', () => {
    it('is a valid Tailwind plugin object with handler and config', () => {
      expect(typeof hdxTailwindPlugin.handler).toBe('function');
      expect(hdxTailwindPlugin.config.theme.extend.colors).toEqual(defaultTheme.colors);
    });

    it('registers fluid font sizes and CSS variables when handler is executed', () => {
      const registeredUtilities = [];
      const registeredBase = [];

      const mockContext = {
        addUtilities: (utils) => registeredUtilities.push(utils),
        addBase: (base) => registeredBase.push(base),
      };

      hdxTailwindPlugin.handler(mockContext);

      expect(registeredUtilities.length).toBeGreaterThan(0);
      const fluidUtils = registeredUtilities[0];
      expect(fluidUtils['.text-fluid-base']).toBeDefined();
      expect(fluidUtils['.text-fluid-base'].fontSize).toContain('clamp');

      expect(registeredBase.length).toBeGreaterThan(0);
      const baseVars = registeredBase[0];
      expect(baseVars[':root']['--hdx-primary']).toBe('#2563EB');
      expect(baseVars['.dark']['--hdx-primary']).toBe('#60A5FA');
    });

    it('supports disabling CSS variable injection via options', () => {
      const customPlugin = createTailwindPlugin({ injectVariables: false });
      const registeredBase = [];
      customPlugin.handler({
        addUtilities: () => {},
        addBase: (base) => registeredBase.push(base),
      });

      expect(registeredBase.length).toBe(0);
    });
  });

  describe('generateTailwindThemeCSS', () => {
    it('generates a valid Tailwind v4 @theme CSS block', () => {
      const css = generateTailwindThemeCSS();

      expect(css).toContain('@theme {');
      expect(css).toContain('--color-primary: #2563EB;');
      expect(css).toContain('--spacing-4: 1rem;');
      expect(css).toContain('--font-size-base: 1rem;');
      expect(css).toContain('--radius-md: 0.375rem;');
      expect(css).toContain('--breakpoint-md: 768px;');
      expect(css.endsWith('}')).toBe(true);
    });

    it('can be compiled by Tailwind CSS compiler without error', async () => {
      const themeCss = generateTailwindThemeCSS();
      const compiled = await compile(themeCss);
      expect(compiled).toBeDefined();
      expect(typeof compiled.build).toBe('function');
    });
  });
});
