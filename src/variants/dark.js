/**
 * Dark mode variants
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').VariantDefinition[]}
 */
export function darkVariants(config) {
  const strategy = config.darkMode;
  const variants = [];

  // The dark marker class follows the configured prefix (e.g. `hdx_dark`,
  // or `my_dark` with prefix: 'my_'), so the ancestor selector is derived
  // from config.prefix rather than hardcoded.
  const marker = `.${config.prefix || 'hdx_'}dark`;

  if (strategy === 'class' || strategy === 'both') {
    variants.push({
      name: 'dark',
      prefix: 'dark_',
      selector: () => marker,
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
