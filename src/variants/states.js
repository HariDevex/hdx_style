/**
 * State variants
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
      name: 'visited',
      prefix: 'visited_',
      selector: () => ':visited',
      type: 'state',
    },
    {
      name: 'disabled',
      prefix: 'disabled_',
      selector: () => ':disabled',
      type: 'state',
    },
    {
      name: 'checked',
      prefix: 'checked_',
      selector: () => ':checked',
      type: 'state',
    },
    {
      name: 'required',
      prefix: 'required_',
      selector: () => ':required',
      type: 'state',
    },
    {
      name: 'invalid',
      prefix: 'invalid_',
      selector: () => ':invalid',
      type: 'state',
    },
    {
      name: 'valid',
      prefix: 'valid_',
      selector: () => ':valid',
      type: 'state',
    },
    {
      name: 'first',
      prefix: 'first_',
      selector: () => ':first-child',
      type: 'state',
    },
    {
      name: 'last',
      prefix: 'last_',
      selector: () => ':last-child',
      type: 'state',
    },
    {
      name: 'odd',
      prefix: 'odd_',
      selector: () => ':nth-child(odd)',
      type: 'state',
    },
    {
      name: 'even',
      prefix: 'even_',
      selector: () => ':nth-child(even)',
      type: 'state',
    },
    {
      name: 'empty',
      prefix: 'empty_',
      selector: () => ':empty',
      type: 'state',
    },
    {
      name: 'enabled',
      prefix: 'enabled_',
      selector: () => ':enabled',
      type: 'state',
    },
    {
      name: 'read-only',
      prefix: 'read-only_',
      selector: () => ':read-only',
      type: 'state',
    },
    {
      name: 'placeholder',
      prefix: 'placeholder_',
      selector: () => '::placeholder',
      type: 'state',
    },
    {
      name: 'first-line',
      prefix: 'first-line_',
      selector: () => '::first-line',
      type: 'state',
    },
    {
      name: 'selection',
      prefix: 'selection_',
      selector: () => '::selection',
      type: 'state',
    },
  ];
}
