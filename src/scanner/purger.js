import { mapUtilitiesToVariants, parseClass } from '../core/parser.js';
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
 * @returns {import('../core/types.js').UtilityDefinition[]}
 */
export function purgeUnused(allUtilities, usedClasses, prefix = 'hdx_', safelist = []) {
  const utilMap = new Map(allUtilities.map(u => [u.name, u]));
  const classToVariants = mapUtilitiesToVariants(usedClasses, prefix);

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
    const parsed = parseClass(safelistItem, prefix);
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
 * Identify classes that start with the HDX prefix but do NOT resolve to any
 * known utility (or arbitrary value), so builds can warn with file:line instead
 * of silently dropping them (a common footgun during Tailwind→HDX migration).
 *
 * @param {import('../core/types.js').UtilityDefinition[]} allUtilities
 * @param {Set<string>|string[]} usedClasses - HDX class names found in content
 * @param {string} prefix
 * @returns {Array<{className: string, utility: string, valid: boolean}>}
 */
export function findUnknownClasses(allUtilities, usedClasses, prefix = 'hdx_') {
  const utilSet = new Set(allUtilities.map(u => u.name));
  const unknown = [];

  for (const cls of usedClasses) {
    if (!cls.startsWith(prefix)) continue;
    const parsed = parseClass(cls, prefix);
    const known = parsed.valid && (utilSet.has(parsed.utility) || resolveArbitraryUtility(parsed.utility));
    if (!known) {
      unknown.push({ className: cls, utility: parsed.utility, valid: parsed.valid });
    }
  }

  return unknown;
}