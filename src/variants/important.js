/**
 * Important (override) variant.
 * Generates a declaration-marked `!important` rule from a clean class name
 * like `hdx_important_bg-primary` (instead of Tailwind's escaped `.\!bg-primary`).
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').VariantDefinition[]}
 */
export function importantVariants() {
  return [
    {
      name: 'important',
      prefix: 'important_',
      selector: () => '',
      type: 'important',
    },
  ];
}