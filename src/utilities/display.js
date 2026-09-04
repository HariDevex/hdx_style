/**
 * Display utilities
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').UtilityDefinition[]}
 */
export function displayUtilities(config) {
  return [
    { name: 'block', property: 'display', value: 'block', category: 'display' },
    { name: 'inline-block', property: 'display', value: 'inline-block', category: 'display' },
    { name: 'inline', property: 'display', value: 'inline', category: 'display' },
    { name: 'flex', property: 'display', value: 'flex', category: 'display' },
    { name: 'inline-flex', property: 'display', value: 'inline-flex', category: 'display' },
    { name: 'grid', property: 'display', value: 'grid', category: 'display' },
    { name: 'inline-grid', property: 'display', value: 'inline-grid', category: 'display' },
    { name: 'table', property: 'display', value: 'table', category: 'display' },
    { name: 'table-row', property: 'display', value: 'table-row', category: 'display' },
    { name: 'table-cell', property: 'display', value: 'table-cell', category: 'display' },
    { name: 'hidden', property: 'display', value: 'none', category: 'display' },
  ];
}
