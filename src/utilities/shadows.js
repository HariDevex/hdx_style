/**
 * Shadow utilities (dynamic from theme)
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').UtilityDefinition[]}
 */
export function shadowsUtilities(config) {
  const { shadows } = config.theme;
  const utils = [];

  for (const [key, value] of Object.entries(shadows)) {
    const name = key === 'none' ? 'shadow-none' : `shadow-${key}`;
    utils.push({ name, property: 'box-shadow', value, category: 'shadows' });
  }

  // Base 'shadow' = sm (subtle default)
  utils.push({ name: 'shadow', property: 'box-shadow', value: shadows.sm, category: 'shadows' });

  // Ring utilities (for focus rings)
  utils.push(
    { name: 'ring-0', property: 'box-shadow', value: '0 0 0 0px var(--hdx-ring-color, #2563EB)', category: 'shadows' },
    { name: 'ring-1', property: 'box-shadow', value: '0 0 0 1px var(--hdx-ring-color, #2563EB)', category: 'shadows' },
    { name: 'ring-2', property: 'box-shadow', value: '0 0 0 2px var(--hdx-ring-color, #2563EB)', category: 'shadows' },
    { name: 'ring-4', property: 'box-shadow', value: '0 0 0 4px var(--hdx-ring-color, #2563EB)', category: 'shadows' },
    { name: 'ring-8', property: 'box-shadow', value: '0 0 0 8px var(--hdx-ring-color, #2563EB)', category: 'shadows' },
    { name: 'ring', property: 'box-shadow', value: '0 0 0 3px var(--hdx-ring-color, #2563EB)', category: 'shadows' },
  );

  return utils;
}
