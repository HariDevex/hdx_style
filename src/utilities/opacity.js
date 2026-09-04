/**
 * Opacity utilities (dynamic from theme)
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').UtilityDefinition[]}
 */
export function opacityUtilities(config) {
  const { opacity } = config.theme;
  const utils = [];

  for (const [key, value] of Object.entries(opacity)) {
    utils.push({
      name: `opacity-${key}`,
      property: 'opacity',
      value,
      category: 'opacity',
    });
  }

  return utils;
}
