/**
 * Print variant
 * @returns {import('../core/types.js').VariantDefinition[]}
 */
export function printVariants() {
  return [
    { name: 'print', prefix: 'print_', selector: () => '@media print', type: 'responsive' },
  ];
}