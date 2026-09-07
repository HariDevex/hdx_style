/**
 * Container query variants.
 *
 * `cq-{bp}_` wraps a rule in `@container (min-width: <bp>)` — it applies when
 * the nearest ancestor with `container-type` (the `hdx-cq` utility) is wide
 * enough, decoupling from the viewport. Breakpoints are derived from
 * `theme.breakpoints` like the responsive variants.
 *
 * Type is 'container' (not 'responsive') so these never join the full-matrix
 * responsive × state/dark combinations; they are emitted through the same
 * pipeline wrapper and are purge-driven.
 *
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').VariantDefinition[]}
 */
export function containerQueryVariants(config) {
  return Object.entries(config.theme.breakpoints || {}).map(([key, width]) => ({
    name: `cq-${key}`,
    prefix: `cq-${key}_`,
    selector: () => `@container (min-width: ${width})`,
    type: 'container',
  }));
}