/**
 * Responsive variants
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').VariantDefinition[]}
 */
export function responsiveVariants(config) {
  const { breakpoints } = config.theme;

  return Object.entries(breakpoints).map(([bp, width]) => ({
    name: bp,
    prefix: `${bp}_`,
    selector: () => `@media (min-width: ${width})`,
    type: 'responsive',
  }));
}
