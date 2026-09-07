/**
 * Orientation variants
 * @returns {import('../core/types.js').VariantDefinition[]}
 */
export function orientationVariants() {
  return [
    { name: 'portrait', prefix: 'portrait_', selector: () => '@media (orientation: portrait)', type: 'responsive' },
    { name: 'landscape', prefix: 'landscape_', selector: () => '@media (orientation: landscape)', type: 'responsive' },
  ];
}