/**
 * Spacing utilities (dynamic from theme)
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').UtilityDefinition[]}
 */
export function spacingUtilities(config) {
  const { spacing } = config.theme;
  const utils = [];

  const paddingProps = [
    ['p', 'padding'],
    ['px', 'padding-inline'],
    ['py', 'padding-block'],
    ['pt', 'padding-top'],
    ['pr', 'padding-right'],
    ['pb', 'padding-bottom'],
    ['pl', 'padding-left'],
    ['ps', 'padding-inline-start'],
    ['pe', 'padding-inline-end'],
  ];

  const marginProps = [
    ['m', 'margin'],
    ['mx', 'margin-inline'],
    ['my', 'margin-block'],
    ['mt', 'margin-top'],
    ['mr', 'margin-right'],
    ['mb', 'margin-bottom'],
    ['ml', 'margin-left'],
    ['ms', 'margin-inline-start'],
    ['me', 'margin-inline-end'],
  ];

  for (const [prefix, prop] of [...paddingProps, ...marginProps]) {
    for (const [key, value] of Object.entries(spacing)) {
      utils.push({
        name: `${prefix}-${key}`,
        property: prop,
        value,
        category: 'spacing',
      });
    }
  }

  // Auto margins
  for (const prefix of ['m', 'mx', 'my', 'mt', 'mr', 'mb', 'ml']) {
    utils.push({
      name: `${prefix}-auto`,
      property: marginProps.find(([p]) => p === prefix)[1],
      value: 'auto',
      category: 'spacing',
    });
  }

  return utils;
}
