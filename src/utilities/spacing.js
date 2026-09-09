/**
 * Spacing utilities (dynamic from theme)
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').UtilityDefinition[]}
 */
export function spacingUtilities(config) {
  const { spacing } = config.theme;
  const utils = [];

  // Negate a theme spacing value (dimension strings like '1rem' or '50%').
  const negate = (value) => {
    if (/^0(px|rem|%)$/.test(value) || value === '0') return '0';
    return value.startsWith('-') ? value : '-' + value;
  };

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

  // Negative margins (Tailwind-compatible: -m-4, -mx-2, …)
  for (const [prefix, prop] of marginProps) {
    for (const [key, value] of Object.entries(spacing)) {
      utils.push({
        name: `-${prefix}-${key}`,
        property: prop,
        value: negate(value),
        category: 'spacing',
      });
    }
  }
  for (const prefix of ['m', 'mx', 'my', 'mt', 'mr', 'mb', 'ml']) {
    utils.push({
      name: `-${prefix}-px`,
      property: marginProps.find(([p]) => p === prefix)[1],
      value: '-1px',
      category: 'spacing',
    });
  }

  // Space between stacked children (space-y / space-x) using the Tailwind
  // child combinator. The `selector` suffix lets the generator emit the
  // combinator rule and keeps it applied to variants (e.g. hdx-md_space-y-4).
  const childCombinator = ' > :not([hidden]) ~ :not([hidden])';
  const spaceProps = {
    y: 'margin-block-start',
    x: 'margin-inline-start',
  };

  for (const [axis, prop] of Object.entries(spaceProps)) {
    for (const [key, value] of Object.entries(spacing)) {
      utils.push({
        name: `space-${axis}-${key}`,
        property: prop,
        value,
        category: 'spacing',
        selector: childCombinator,
      });
    }
  }

  return utils;
}
