/**
 * Overflow utilities
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').UtilityDefinition[]}
 */
export function overflowUtilities(config) {
  return [
    { name: 'overflow-auto', property: 'overflow', value: 'auto', category: 'overflow' },
    { name: 'overflow-hidden', property: 'overflow', value: 'hidden', category: 'overflow' },
    { name: 'overflow-clip', property: 'overflow', value: 'clip', category: 'overflow' },
    { name: 'overflow-visible', property: 'overflow', value: 'visible', category: 'overflow' },
    { name: 'overflow-scroll', property: 'overflow', value: 'scroll', category: 'overflow' },
    { name: 'overflow-x-auto', property: 'overflow-x', value: 'auto', category: 'overflow' },
    { name: 'overflow-x-hidden', property: 'overflow-x', value: 'hidden', category: 'overflow' },
    { name: 'overflow-x-clip', property: 'overflow-x', value: 'clip', category: 'overflow' },
    { name: 'overflow-x-visible', property: 'overflow-x', value: 'visible', category: 'overflow' },
    { name: 'overflow-x-scroll', property: 'overflow-x', value: 'scroll', category: 'overflow' },
    { name: 'overflow-y-auto', property: 'overflow-y', value: 'auto', category: 'overflow' },
    { name: 'overflow-y-hidden', property: 'overflow-y', value: 'hidden', category: 'overflow' },
    { name: 'overflow-y-clip', property: 'overflow-y', value: 'clip', category: 'overflow' },
    { name: 'overflow-y-visible', property: 'overflow-y', value: 'visible', category: 'overflow' },
    { name: 'overflow-y-scroll', property: 'overflow-y', value: 'scroll', category: 'overflow' },
  ];
}
