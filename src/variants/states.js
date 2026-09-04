/**
 * State variants (hover, focus, active, disabled)
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').VariantDefinition[]}
 */
export function stateVariants(config) {
  return [
    {
      name: 'hover',
      prefix: 'hover_',
      selector: () => ':hover',
      type: 'state',
    },
    {
      name: 'focus',
      prefix: 'focus_',
      selector: () => ':focus',
      type: 'state',
    },
    {
      name: 'focus-visible',
      prefix: 'focus-visible_',
      selector: () => ':focus-visible',
      type: 'state',
    },
    {
      name: 'active',
      prefix: 'active_',
      selector: () => ':active',
      type: 'state',
    },
    {
      name: 'disabled',
      prefix: 'disabled_',
      selector: () => ':disabled',
      type: 'state',
    },
  ];
}
