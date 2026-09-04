import { prefixClass } from '../core/prefix.js';

/**
 * Filter utilities to only those used in content (plus safelist)
 * @param {import('../core/types.js').UtilityDefinition[]} allUtilities
 * @param {Set<string>} usedClasses
 * @param {string} prefix
 * @param {string[]} [safelist]
 * @returns {import('../core/types.js').UtilityDefinition[]}
 */
export function purgeUnused(allUtilities, usedClasses, prefix = 'hdx_', safelist = []) {
  // Merge used classes with safelist
  const allUsed = new Set([...usedClasses, ...safelist]);

  const statePrefixes = [
    'hover', 'focus', 'focus-visible', 'active', 'visited',
    'disabled', 'checked', 'required', 'invalid', 'valid',
    'first', 'last', 'odd', 'even', 'empty', 'enabled',
    'read-only', 'placeholder', 'first-line', 'selection',
    'group-hover', 'peer-hover',
  ];
  const responsivePrefixes = ['sm', 'md', 'lg', 'xl', '2xl'];
  const darkPrefixes = ['dark'];

  return allUtilities.filter((util) => {
    const prefixed = prefixClass(util.name, prefix);

    // Direct match
    if (allUsed.has(prefixed)) return true;

    // Check variant forms
    for (const used of allUsed) {
      const stripped = used.startsWith(prefix) ? used.slice(prefix.length) : used;
      const parts = stripped.split('_');

      // Responsive: hdx_md_flex → parts = ['md', 'flex']
      for (const bp of responsivePrefixes) {
        if (parts[0] === bp && parts.slice(1).join('_') === util.name) return true;
        // Combined: hdx_md_hover_flex → parts = ['md', 'hover', 'flex']
        for (const state of statePrefixes) {
          if (parts[0] === bp && parts[1] === state && parts.slice(2).join('_') === util.name) return true;
        }
      }

      // State: hdx_hover_flex → parts = ['hover', 'flex']
      for (const state of statePrefixes) {
        if (parts[0] === state && parts.slice(1).join('_') === util.name) return true;
      }

      // Dark: hdx_dark_flex → parts = ['dark', 'flex']
      for (const dark of darkPrefixes) {
        if (parts[0] === dark && parts.slice(1).join('_') === util.name) return true;
        // Combined: hdx_dark_hover_flex → parts = ['dark', 'hover', 'flex']
        for (const state of statePrefixes) {
          if (parts[0] === dark && parts[1] === state && parts.slice(2).join('_') === util.name) return true;
        }
      }
    }

    return false;
  });
}
