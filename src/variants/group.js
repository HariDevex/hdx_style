/**
 * Group and peer hover variants
 * Uses hdx-group and hdx-peer as the ancestor selector class.
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').VariantDefinition[]}
 */
export function groupVariants(config) {
  const prefix = config.prefix || 'hdx-';
  const groupClass = '.' + prefix + 'group';
  const peerClass = '.' + prefix + 'peer';

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
