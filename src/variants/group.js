/**
 * Group and peer hover variants
 * Uses hdx_group and hdx_peer as the ancestor selector class.
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').VariantDefinition[]}
 */
export function groupVariants(config) {
  const prefix = config.prefix || 'hdx_';
  const groupClass = '.' + prefix.replace(/_/g, '-').replace(/-$/, '') + '_group';
  const peerClass = '.' + prefix.replace(/_/g, '-').replace(/-$/, '') + '_peer';

  return [
    {
      name: 'group-hover',
      prefix: 'group-hover_',
      selector: () => `${groupClass}:hover &`,
      type: 'ancestor',
    },
    {
      name: 'peer-hover',
      prefix: 'peer-hover_',
      selector: () => `${peerClass}:hover ~ &`,
      type: 'ancestor',
    },
  ];
}
