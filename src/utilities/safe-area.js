/**
 * Safe-area inset utilities.
 *
 * Values use `max(0px, env(safe-area-inset-*))` as a self-gating fallback:
 * on devices without a notch/inset the expression evaluates to `0px`, and on
 * browsers without `env()` support the declaration is invalid and dropped —
 * either way the element resolves to its natural padding, no separate
 * `@supports` block required.
 *
 * @returns {import('../core/types.js').UtilityDefinition[]}
 */
export function safeAreaUtilities() {
  const insets = {
    top: 'env(safe-area-inset-top)',
    right: 'env(safe-area-inset-right)',
    bottom: 'env(safe-area-inset-bottom)',
    left: 'env(safe-area-inset-left)',
  };
  const s = (side) => `max(0px, ${insets[side]})`;

  return [
    {
      name: 'p-safe',
      property: 'padding',
      value: [s('top'), s('right'), s('bottom'), s('left')].join(' '),
      category: 'spacing',
    },
    { name: 'px-safe', property: 'padding-inline', value: `${s('left')} ${s('right')}`, category: 'spacing' },
    { name: 'py-safe', property: 'padding-block', value: `${s('top')} ${s('bottom')}`, category: 'spacing' },
    { name: 'pt-safe', property: 'padding-top', value: s('top'), category: 'spacing' },
    { name: 'pr-safe', property: 'padding-right', value: s('right'), category: 'spacing' },
    { name: 'pb-safe', property: 'padding-bottom', value: s('bottom'), category: 'spacing' },
    { name: 'pl-safe', property: 'padding-left', value: s('left'), category: 'spacing' },
  ];
}