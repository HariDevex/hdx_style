/**
 * HDX Style — Tailwind CSS Integration
 * Exports a Tailwind CSS preset and plugin utilizing HDX Style's default design tokens.
 *
 * Source values: src/theme/defaults.js & default-values.txt
 */

import plugin from 'tailwindcss/plugin.js';
import { defaultTheme, defaultFontFamily } from './theme/defaults.js';

/**
 * HDX default font family stacks for Tailwind.
 */
export const hdxFontFamily = {
  sans: [
    'Inter',
    'ui-sans-serif',
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'sans-serif',
  ],
  serif: ['ui-serif', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
  mono: ['ui-monospace', 'SFMono-Regular', '"SF Mono"', 'Menlo', 'Consolas', '"Liberation Mono"', 'monospace'],
};

/**
 * HDX semantic & UI kit colors (light mode).
 */
export const hdxColors = { ...defaultTheme.colors };

/**
 * HDX dark mode theme colors.
 */
export const hdxDarkColors = { ...defaultTheme.darkColors };

/**
 * HDX spacing scale tokens.
 */
export const hdxSpacing = { ...defaultTheme.spacing };

/**
 * HDX font size tokens.
 */
export const hdxFontSize = { ...defaultTheme.fontSize };

/**
 * HDX font weight tokens.
 */
export const hdxFontWeight = { ...defaultTheme.fontWeight };

/**
 * HDX line height tokens.
 */
export const hdxLineHeight = { ...defaultTheme.lineHeight };

/**
 * HDX letter spacing tokens.
 */
export const hdxLetterSpacing = { ...defaultTheme.letterSpacing };

/**
 * HDX border radius tokens (mapped to Tailwind borderRadius).
 */
export const hdxBorderRadius = { ...defaultTheme.radius };

/**
 * HDX shadow tokens (mapped to Tailwind boxShadow).
 */
export const hdxBoxShadow = { ...defaultTheme.shadows };

/**
 * HDX responsive breakpoint tokens (mapped to Tailwind screens).
 */
export const hdxScreens = { ...defaultTheme.breakpoints };

/**
 * HDX opacity scale tokens.
 */
export const hdxOpacity = { ...defaultTheme.opacity };

/**
 * HDX z-index tokens.
 */
export const hdxZIndex = { ...defaultTheme.zIndex };

/**
 * HDX transition duration tokens.
 */
export const hdxTransitionDuration = { ...defaultTheme.transitionDuration };

/**
 * HDX transition timing tokens (mapped to Tailwind transitionTimingFunction).
 */
export const hdxTransitionTimingFunction = { ...defaultTheme.transitionTiming };

/**
 * Creates a Tailwind preset configuration extending Tailwind's default theme
 * with HDX Style's default design tokens.
 *
 * @param {object} [overrides={}] Custom overrides to extend or modify default HDX values
 * @returns {object} Tailwind preset configuration object
 */
export function createTailwindPreset(overrides = {}) {
  const customTheme = overrides.theme || overrides;
  const extend = customTheme.extend || customTheme;

  return {
    theme: {
      extend: {
        colors: { ...hdxColors, ...(extend.colors || {}) },
        spacing: { ...hdxSpacing, ...(extend.spacing || {}) },
        fontSize: { ...hdxFontSize, ...(extend.fontSize || {}) },
        fontWeight: { ...hdxFontWeight, ...(extend.fontWeight || {}) },
        lineHeight: { ...hdxLineHeight, ...(extend.lineHeight || {}) },
        letterSpacing: { ...hdxLetterSpacing, ...(extend.letterSpacing || {}) },
        borderRadius: { ...hdxBorderRadius, ...(extend.radius || extend.borderRadius || {}) },
        boxShadow: { ...hdxBoxShadow, ...(extend.shadows || extend.boxShadow || {}) },
        screens: { ...hdxScreens, ...(extend.breakpoints || extend.screens || {}) },
        opacity: { ...hdxOpacity, ...(extend.opacity || {}) },
        zIndex: { ...hdxZIndex, ...(extend.zIndex || {}) },
        transitionDuration: { ...hdxTransitionDuration, ...(extend.transitionDuration || {}) },
        transitionTimingFunction: {
          ...hdxTransitionTimingFunction,
          ...(extend.transitionTiming || extend.transitionTimingFunction || {}),
        },
        fontFamily: {
          ...hdxFontFamily,
          ...(extend.fontFamily || {}),
        },
      },
    },
  };
}

/**
 * Default Tailwind preset with HDX Style design tokens.
 */
export const hdxTailwindPreset = createTailwindPreset();

/**
 * Creates a Tailwind plugin that injects HDX fluid typography and CSS variables.
 *
 * @param {object} [options={}] Plugin options
 * @param {object} [options.fluidFontSize] Custom fluid typography configurations
 * @param {boolean} [options.injectVariables=true] Whether to inject CSS variables (:root, .dark)
 * @returns {object} Tailwind plugin object
 */
export function createTailwindPlugin(options = {}) {
  const fluidTheme = options.fluidFontSize || defaultTheme.fluidFontSize || {};
  const injectVars = options.injectVariables !== false;
  const preset = createTailwindPreset(options);

  return plugin(function ({ addUtilities, addBase }) {
    // 1. Fluid Typography Utilities
    const fluidUtilities = {};
    for (const [key, val] of Object.entries(fluidTheme)) {
      const { min, max } = val;
      fluidUtilities[`.text-fluid-${key}`] = {
        fontSize: `clamp(${min}, calc(${min} + (${max} - ${min}) * (100vw - 40rem) / (96rem - 40rem)), ${max})`,
      };
    }
    addUtilities(fluidUtilities);

    // 2. HDX Design System CSS Variables
    if (injectVars) {
      const rootVars = {};
      for (const [k, v] of Object.entries(hdxColors)) {
        rootVars[`--hdx-${k}`] = v;
      }
      const darkVars = {};
      for (const [k, v] of Object.entries(hdxDarkColors)) {
        darkVars[`--hdx-${k}`] = v;
      }

      addBase({
        ':root': rootVars,
        '.dark': darkVars,
        '[data-theme="dark"]': darkVars,
      });
    }
  }, preset);
}

/**
 * Default Tailwind plugin instance with HDX Style design tokens.
 */
export const hdxTailwindPlugin = createTailwindPlugin();

/**
 * Generates Tailwind CSS v4 `@theme` block CSS string.
 *
 * @param {object} [customTheme=defaultTheme]
 * @returns {string}
 */
export function generateTailwindThemeCSS(customTheme = defaultTheme) {
  const lines = ['@theme {'];

  const colors = customTheme.colors || hdxColors;
  for (const [k, v] of Object.entries(colors)) {
    lines.push(`  --color-${k}: ${v};`);
  }

  const spacing = customTheme.spacing || hdxSpacing;
  for (const [k, v] of Object.entries(spacing)) {
    lines.push(`  --spacing-${k}: ${v};`);
  }

  const fontSize = customTheme.fontSize || hdxFontSize;
  for (const [k, v] of Object.entries(fontSize)) {
    lines.push(`  --font-size-${k}: ${v};`);
  }

  lines.push(`  --font-sans: ${defaultFontFamily};`);

  const radius = customTheme.radius || hdxBorderRadius;
  for (const [k, v] of Object.entries(radius)) {
    lines.push(`  --radius-${k}: ${v};`);
  }

  const shadows = customTheme.shadows || hdxBoxShadow;
  for (const [k, v] of Object.entries(shadows)) {
    lines.push(`  --shadow-${k}: ${v};`);
  }

  const breakpoints = customTheme.breakpoints || hdxScreens;
  for (const [k, v] of Object.entries(breakpoints)) {
    lines.push(`  --breakpoint-${k}: ${v};`);
  }

  lines.push('}');
  return lines.join('\n');
}

export default hdxTailwindPreset;
