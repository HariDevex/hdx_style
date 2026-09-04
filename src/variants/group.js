/**
 * Group hover variants
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').VariantDefinition[]}
 */
export function groupVariants(config) {
  return [
    {
      name: 'group-hover',
      prefix: 'group-hover_',
      selector: () => '.group:hover &',
      type: 'state',
    },
    {
      name: 'peer-hover',
      prefix: 'peer-hover_',
      selector: () => '.peer:hover ~ &',
      type: 'state',
    },
  ];
}
