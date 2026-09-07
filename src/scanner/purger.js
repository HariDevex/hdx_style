import { mapUtilitiesToVariants, parseClass, getVariantPrefixes, DEFAULT_VARIANT_PREFIXES } from '../core/parser.js';
import { resolveArbitraryUtility } from '../generator/arbitrary.js';

/**
 * Compute the utilities (and their variant combos) referenced by content,
 * plus safelisted classes.
 *
 * Uses the class parser so variant combos of any depth (e.g.
 * `hdx_lg_dark_hover_bg-primary`) resolve to the right utility. The returned
 * utilities carry a `_requestedVariants` array that drives demand-driven
 * generation: each entry is the exact ordered variant combo to emit.
 *
 * @param {import('../core/types.js').UtilityDefinition[]} allUtilities
 * @param {Set<string>|string[]} usedClasses - HDX class names found in content
 * @param {string} prefix
 * @param {string[]} [safelist]
 * @param {import('../core/types.js').HdxConfig|null} [config]
 * @param {string[]} [extraVariantPrefixes] - plugin addVariant() prefixes, so
 *   purged builds can parse variant combos that only exist via plugins.
 * @returns {import('../core/types.js').UtilityDefinition[]}
 */
export function purgeUnused(allUtilities, usedClasses, prefix = 'hdx_', safelist = [], config = null, extraVariantPrefixes = []) {
  const utilMap = new Map(allUtilities.map(u => [u.name, u]));
  const basePrefixes = config ? getVariantPrefixes(config) : DEFAULT_VARIANT_PREFIXES;
  const variantPrefixes = [...basePrefixes, ...extraVariantPrefixes];
  const classToVariants = mapUtilitiesToVariants(usedClasses, prefix, variantPrefixes);

  const needed = [];
  const keptNames = new Set();

  for (const [utilName, variantCombos] of classToVariants) {
    let util = utilMap.get(utilName);

    // Unknown utility alias? Try a safe arbitrary value (w-[260px], …).
    if (!util) {
      util = resolveArbitraryUtility(utilName);
      if (util) util._arbitrary = true;
    }
    if (!util) continue;

    needed.push({
      ...util,
      _requestedVariants: [...variantCombos]
        .filter(combo => combo.length > 0)
        .map(combo => combo.split('_')),
    });
    keptNames.add(utilName);
  }

  for (const safelistItem of safelist) {
    const parsed = parseClass(safelistItem, prefix, variantPrefixes);
    if (!parsed.valid) continue;

    let util = utilMap.get(parsed.utility);
    if (!util) {
      util = resolveArbitraryUtility(parsed.utility);
      if (util) util._arbitrary = true;
    }
    if (!util || keptNames.has(parsed.utility)) continue;

    needed.push({ ...util, _requestedVariants: [] });
    keptNames.add(parsed.utility);
  }

  return needed;
}

/**
 * Compute the components (base definition + their `states` blocks) referenced
 * by content, plus safelisted component classes.
 *
 * Composed usage resolves naturally: `hdx_btn hdx_btn-primary` parses to the
 * independent `btn` and `btn-primary` component names, so each is kept if (and
 * only if) its own class appears in content. Variant-prefixed forms (e.g.
 * `hdx_hover_btn`) resolve to their base component name too.
 *
 * @param {import('../core/types.js').ComponentDefinition[]} allComponents
 * @param {Set<string>|string[]} usedClasses - HDX class names found in content
 * @param {string} prefix
 * @param {string[]} [safelist]
 * @param {import('../core/types.js').HdxConfig|null} [config]
 * @param {string[]} [extraVariantPrefixes] - plugin addVariant() prefixes.
 * @returns {import('../core/types.js').ComponentDefinition[]}
 */
export function purgeComponents(allComponents, usedClasses, prefix = 'hdx_', safelist = [], config = null, extraVariantPrefixes = []) {
  const nameToComp = new Map(allComponents.map(c => [c.name, c]));
  const basePrefixes = config ? getVariantPrefixes(config) : DEFAULT_VARIANT_PREFIXES;
  const variantPrefixes = [...basePrefixes, ...extraVariantPrefixes];
  const usedNames = new Set();

  const collect = (cls) => {
    if (!cls.startsWith(prefix)) return;
    const parsed = parseClass(cls, prefix, variantPrefixes);
    if (parsed.valid && nameToComp.has(parsed.utility)) {
      usedNames.add(parsed.utility);
    }
  };

  for (const cls of usedClasses) collect(cls);
  for (const item of safelist) collect(item);

  return allComponents.filter(c => usedNames.has(c.name));
}

/**
 * Identify classes that start with the HDX prefix but do NOT resolve to any
 * known utility (or arbitrary value or component), so builds can warn with
 * file:line instead of silently dropping them (a common footgun during
 * Tailwind→HDX migration).
 *
 * Three things are intentionally NOT reported as unknown:
 * - Standalone variant-marker classes (`hdx_dark`, `hdx_group`, `hdx_peer`)
 *   that parse entirely into variants with an empty utility — they activate
 *   dark mode / group / peer and are never generated as a rule.
 * - Component classes (`.hdx_btn`, `.hdx_input`, …) — component classes found
 *   in content resolve to real (purged) CSS, so they are never "unknown".
 * - Unknown-but-plain CSS classes are ignored (they are not HDX-prefixed).
 *
 * @param {import('../core/types.js').UtilityDefinition[]} allUtilities
 * @param {Set<string>|string[]} usedClasses - HDX class names found in content
 * @param {string} prefix
 * @param {import('../core/types.js').HdxConfig|null} [config]
 * @param {Set<string>} [componentNames] - names of the component layer (so
 *   component classes are not reported as unknown).
 * @param {string[]} [extraVariantPrefixes] - plugin addVariant() prefixes, so
 *   plugin-variant classes are not reported as unknown.
 * @returns {Array<{className: string, utility: string, valid: boolean}>}
 */
export function findUnknownClasses(allUtilities, usedClasses, prefix = 'hdx_', config = null, componentNames = null, extraVariantPrefixes = []) {
  const utilSet = new Set(allUtilities.map(u => u.name));
  const basePrefixes = config ? getVariantPrefixes(config) : DEFAULT_VARIANT_PREFIXES;
  const variantPrefixes = [...basePrefixes, ...extraVariantPrefixes];
  const knownComponents = componentNames || new Set();
  const unknown = [];

  for (const cls of usedClasses) {
    if (!cls.startsWith(prefix)) continue;
    const parsed = parseClass(cls, prefix, variantPrefixes);

    // Variant-marker classes (e.g. hdx_dark, hdx_group, hdx_peer) never need
    // a rule — the variants consume the whole class name and the utility is
    // empty. Treat them as known.
    const isMarker = !parsed.utility && parsed.variants.length > 0;

    const known = isMarker
      || (parsed.valid && (
        utilSet.has(parsed.utility)
        || resolveArbitraryUtility(parsed.utility)
        || knownComponents.has(parsed.utility)
      ));

    if (!known) {
      unknown.push({ className: cls, utility: parsed.utility, valid: parsed.valid });
    }
  }

  return unknown;
}