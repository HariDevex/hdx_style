import { prefixClass } from '../core/prefix.js';

/**
 * Filter utilities to only those used in content
 * @param {import('../core/types.js').UtilityDefinition[]} allUtilities
 * @param {Set<string>} usedClasses
 * @param {string} prefix
 * @returns {import('../core/types.js').UtilityDefinition[]}
 */
export function purgeUnused(allUtilities, usedClasses, prefix = 'hdx_') {
  return allUtilities.filter((util) => {
    const prefixed = prefixClass(util.name, prefix);
    // Direct match
    if (usedClasses.has(prefixed)) return true;

    // Check variant forms: hdx_hover_{name}, hdx_md_{name}, hdx_dark_{name}
    for (const used of usedClasses) {
      // Remove prefix and check if it contains the utility name as a suffix
      const stripped = used.startsWith(prefix) ? used.slice(prefix.length) : used;
      const parts = stripped.split('_');

      // Handle responsive: md_util-name, 2xl_util-name
      const responsivePrefixes = ['sm', 'md', 'lg', 'xl', '2xl'];
      const statePrefixes = ['hover', 'focus', 'focus-visible', 'active', 'disabled'];
      const darkPrefixes = ['dark'];

      for (const bp of responsivePrefixes) {
        if (parts[0] === bp && parts.slice(1).join('_') === util.name) return true;
      }
      for (const state of statePrefixes) {
        if (parts[0] === state && parts.slice(1).join('_') === util.name) return true;
      }
      for (const dark of darkPrefixes) {
        if (parts[0] === dark && parts.slice(1).join('_') === util.name) return true;
      }
    }

    return false;
  });
}
