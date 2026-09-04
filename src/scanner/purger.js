import { mapUtilitiesToVariants, parseClass } from '../core/parser.js';

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
 * @returns {import('../core/types.js').UtilityDefinition[]}
 */
export function purgeUnused(allUtilities, usedClasses, prefix = 'hdx_', safelist = []) {
  const utilMap = new Map(allUtilities.map(u => [u.name, u]));
  const classToVariants = mapUtilitiesToVariants(usedClasses, prefix);

  const needed = [];
  const keptNames = new Set();

  for (const [utilName, variantCombos] of classToVariants) {
    const util = utilMap.get(utilName);
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
    const parsed = parseClass(safelistItem, prefix);
    if (!parsed.valid) continue;

    const util = utilMap.get(parsed.utility);
    if (!util || keptNames.has(util.name)) continue;

    needed.push({ ...util, _requestedVariants: [] });
    keptNames.add(util.name);
  }

  return needed;
}