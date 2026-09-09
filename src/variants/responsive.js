/**
 * Responsive variants
 *
 * Beyond the mobile-first `min-width` breakpoints (sm/md/lg/xl/2xl), this
 * registers two derived media variants per breakpoint:
 *   - `max-{bp}`     → `(max-width: bp - 0.02px)` — styles below a breakpoint
 *   - `{bp}-only`    → `(min-width: bp) and (max-width: nextBp - 0.02px)` —
 *                      styles inside exactly one breakpoint range
 *
 * Breakpoint widths are expected to be `px` values. The 0.02px cap is the
 * standard trick to keep the range non-overlapping at integer breakpoints.
 *
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').VariantDefinition[]}
 */
export function responsiveVariants(config) {
  const { breakpoints } = config.theme;
  const entries = Object.entries(breakpoints);

  const toPx = (width) => {
    const n = parseFloat(width);
    return Number.isNaN(n) ? null : n;
  };

  const variants = entries.map(([bp, width]) => ({
    name: bp,
    prefix: `${bp}_`,
    selector: () => `@media (min-width: ${width})`,
    type: 'responsive',
  }));

  for (let i = 0; i < entries.length; i++) {
    const [bp, width] = entries[i];
    const n = toPx(width);
    if (n === null) continue;

    const next = entries[i + 1];
    const upper = next ? toPx(next[1]) : null;

    variants.push({
      name: `max-${bp}`,
      prefix: `max-${bp}_`,
      selector: () => `@media (max-width: ${(n - 0.02).toFixed(2)}px)`,
      type: 'responsive',
    });

    variants.push({
      name: `${bp}-only`,
      prefix: `${bp}-only_`,
      selector: () => upper === null
        ? `@media (min-width: ${n}px)`
        : `@media (min-width: ${n}px) and (max-width: ${(upper - 0.02).toFixed(2)}px)`,
      type: 'responsive',
    });
  }

  return variants;
}
