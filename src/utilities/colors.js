import { colorVariable } from '../generator/resolver.js';

/**
 * Color utilities (bg-{color}, text-{color})
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').UtilityDefinition[]}
 */
export function colorsUtilities(config) {
  const { colors } = config.theme;
  const prefix = config.prefix;
  const utils = [];

  for (const [key] of Object.entries(colors)) {
    const cssVar = colorVariable(key, prefix);

    // Background color
    utils.push({
      name: `bg-${key}`,
      property: 'background-color',
      value: cssVar,
      category: 'colors',
    });

    // Text color
    utils.push({
      name: `text-${key}`,
      property: 'color',
      value: cssVar,
      category: 'colors',
    });

    // Border color
    utils.push({
      name: `border-${key}`,
      property: 'border-color',
      value: cssVar,
      category: 'colors',
    });

    // Ring color (for focus rings)
    utils.push({
      name: `ring-${key}`,
      property: '--hdx-ring-color',
      value: cssVar,
      category: 'colors',
    });

    // Divide color (for dividers)
    utils.push({
      name: `divide-${key}`,
      property: '--hdx-divide-color',
      value: cssVar,
      category: 'colors',
    });

    // Placeholder color
    utils.push({
      name: `placeholder-${key}`,
      property: '--hdx-placeholder-color',
      value: cssVar,
      category: 'colors',
    });

    // Accent color
    utils.push({
      name: `accent-${key}`,
      property: 'accent-color',
      value: cssVar,
      category: 'colors',
    });

    // Caret color
    utils.push({
      name: `caret-${key}`,
      property: 'caret-color',
      value: cssVar,
      category: 'colors',
    });
  }

  return utils;
}
