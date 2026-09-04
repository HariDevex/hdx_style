/**
 * Positioning utilities
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').UtilityDefinition[]}
 */
export function positioningUtilities(config) {
  const utils = [
    { name: 'static', property: 'position', value: 'static', category: 'positioning' },
    { name: 'relative', property: 'position', value: 'relative', category: 'positioning' },
    { name: 'absolute', property: 'position', value: 'absolute', category: 'positioning' },
    { name: 'fixed', property: 'position', value: 'fixed', category: 'positioning' },
    { name: 'sticky', property: 'position', value: 'sticky', category: 'positioning' },
  ];

  const positions = [
    ['top', 'top'],
    ['right', 'right'],
    ['bottom', 'bottom'],
    ['left', 'left'],
  ];

  // Static values
  for (const [name, prop] of positions) {
    utils.push({ name: `${name}-0`, property: prop, value: '0px', category: 'positioning' });
    utils.push({ name: `${name}-auto`, property: prop, value: 'auto', category: 'positioning' });
    utils.push({ name: `${name}-1/2`, property: prop, value: '50%', category: 'positioning' });
    utils.push({ name: `${name}-full`, property: prop, value: '100%', category: 'positioning' });
  }

  // Inset utilities
  const insets = [
    ['inset-auto', 'inset', 'auto'],
    ['inset-x-0', 'left', '0px'],
    ['inset-x-auto', 'left', 'auto'],
    ['inset-y-0', 'top', '0px'],
    ['inset-y-auto', 'top', 'auto'],
    ['inset-x-1/2', 'left', '50%'],
    ['inset-y-1/2', 'top', '50%'],
  ];

  for (const [name, prop, value] of insets) {
    utils.push({ name, property: prop, value, category: 'positioning' });
  }

  // inset-0 covers all four sides via shorthand
  utils.push({ name: 'inset-0', css: 'top: 0px;\nright: 0px;\nbottom: 0px;\nleft: 0px;', category: 'positioning' });

  return utils;
}
