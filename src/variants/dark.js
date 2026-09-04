/**
 * Dark mode variants
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').VariantDefinition[]}
 */
export function darkVariants(config) {
  const strategy = config.darkMode;
  const variants = [];

  if (strategy === 'class' || strategy === 'both') {
    variants.push({
      name: 'dark',
      prefix: 'dark_',
      selector: () => '.dark',
      type: 'dark',
      strategy: 'class',
    });
  }

  if (strategy === 'media' || strategy === 'both') {
    variants.push({
      name: 'dark',
      prefix: 'dark_',
      selector: () => '@media (prefers-color-scheme: dark)',
      type: 'dark',
      strategy: 'media',
    });
  }

  return variants;
}
