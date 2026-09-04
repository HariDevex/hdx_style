/**
 * Z-index utilities (dynamic from theme)
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').UtilityDefinition[]}
 */
export function zIndexUtilities(config) {
  const { zIndex } = config.theme;
  const utils = [];

  for (const [key, value] of Object.entries(zIndex)) {
    utils.push({
      name: `z-${key}`,
      property: 'z-index',
      value,
      category: 'z-index',
    });
  }

  return utils;
}
