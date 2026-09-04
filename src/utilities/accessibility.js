import { colorVariable } from '../generator/resolver.js';

/**
 * Accessibility utilities
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').UtilityDefinition[]}
 */
export function accessibilityUtilities(config) {
  const prefix = config.prefix;
  const utils = [];

  // Screen reader only
  utils.push({
    name: 'sr-only',
    css: `position: absolute;
width: 1px;
height: 1px;
padding: 0;
margin: -1px;
overflow: hidden;
clip: rect(0, 0, 0, 0);
white-space: nowrap;
border-width: 0;`,
    category: 'accessibility',
  });

  utils.push({
    name: 'not-sr-only',
    css: `position: static;
width: auto;
height: auto;
padding: 0;
margin: 0;
overflow: visible;
clip: auto;
white-space: normal;`,
    category: 'accessibility',
  });

  // Focus ring
  utils.push({
    name: 'focus-ring',
    css: `outline: 2px solid ${colorVariable('primary', prefix)};
outline-offset: 2px;`,
    category: 'accessibility',
  });

  utils.push({
    name: 'focus-ring-0',
    css: `outline: 2px solid transparent;
outline-offset: 0px;`,
    category: 'accessibility',
  });

  utils.push({
    name: 'focus-ring-2',
    css: `outline: 2px solid ${colorVariable('primary', prefix)};
outline-offset: 2px;`,
    category: 'accessibility',
  });

  utils.push({
    name: 'focus-ring-4',
    css: `outline: 4px solid ${colorVariable('primary', prefix)};
outline-offset: 4px;`,
    category: 'accessibility',
  });

  // Focus ring with specific colors
  const { colors } = config.theme;
  for (const [key] of Object.entries(colors)) {
    utils.push({
      name: `focus-ring-${key}`,
      css: `outline: 2px solid ${colorVariable(key, prefix)};
outline-offset: 2px;`,
      category: 'accessibility',
    });
  }

  return utils;
}
