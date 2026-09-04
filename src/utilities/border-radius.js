/**
 * Border radius utilities (dynamic from theme)
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').UtilityDefinition[]}
 */
export function borderRadiusUtilities(config) {
  const { radius } = config.theme;
  const utils = [];

  for (const [key, value] of Object.entries(radius)) {
    const name = key === 'none' ? 'rounded-none' : key === 'full' ? 'rounded-full' : `rounded-${key}`;
    utils.push({ name, property: 'border-radius', value, category: 'border-radius' });
  }

  // Base 'rounded' = md
  utils.push({ name: 'rounded', property: 'border-radius', value: radius.md, category: 'border-radius' });

  // Individual corners
  const corners = [
    ['t', 'border-top-left-radius', 'border-top-right-radius'],
    ['r', 'border-top-right-radius', 'border-bottom-right-radius'],
    ['b', 'border-bottom-right-radius', 'border-bottom-left-radius'],
    ['l', 'border-bottom-left-radius', 'border-top-left-radius'],
    ['tl', 'border-top-left-radius'],
    ['tr', 'border-top-right-radius'],
    ['br', 'border-bottom-right-radius'],
    ['bl', 'border-bottom-left-radius'],
  ];

  for (const [key, value] of Object.entries(radius)) {
    if (key === 'none' || key === 'full') continue;
    for (const [corner, ...props] of corners) {
      for (const prop of props) {
        utils.push({
          name: `rounded-${corner}-${key}`,
          property: prop,
          value,
          category: 'border-radius',
        });
      }
    }
  }

  return utils;
}
