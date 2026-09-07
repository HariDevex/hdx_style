/**
 * Motion preference variants.
 *
 * Mirrors the global `prefers-reduced-motion` reset (generated defensively for
 * every build) but as opt-in, demand-driven utilities: `hdx-motion-reduce_flex`
 * only ships if that class appears in content, and combined with any utility.
 *
 * @returns {import('../core/types.js').VariantDefinition[]}
 */
export function motionVariants() {
  return [
    {
      name: 'motion-safe',
      prefix: 'motion-safe_',
      selector: () => '@media (prefers-reduced-motion: no-preference)',
      type: 'responsive',
    },
    {
      name: 'motion-reduce',
      prefix: 'motion-reduce_',
      selector: () => '@media (prefers-reduced-motion: reduce)',
      type: 'responsive',
    },
  ];
}