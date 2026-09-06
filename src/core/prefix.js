/**
 * Apply prefix to a utility class name
 * @param {string} name - utility name (e.g. "flex", "p-4")
 * @param {string} prefix - prefix (e.g. "hdx_")
 * @returns {string} prefixed class name
 */
export function prefixClass(name, prefix = 'hdx_') {
  return prefix + name;
}

const escapeCache = new Map();

/**
 * Escape special characters for CSS selectors
 * hdx_w-1/2 → hdx_w-1\/2
 * hdx_w-[100px] → hdx_w-\[100px\]
 * Results are memoized: full-mode generation re-escapes the same base class
 * for hundreds of variant combos, so caching turns ~200k repeated escapes into
 * one per distinct class name.
 * @param {string} name
 * @returns {string}
 */
export function escapeClassName(name) {
  const cached = escapeCache.get(name);
  if (cached !== undefined) return cached;
  const escaped = name
    .replace(/\//g, '\\/')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/\./g, '\\.')
    .replace(/:/g, '\\:');
  escapeCache.set(name, escaped);
  return escaped;
}

/**
 * Get the full CSS selector for a utility
 * @param {string} name - utility name
 * @param {string} prefix - prefix
 * @returns {string} escaped CSS selector (without leading dot)
 */
export function getSelector(name, prefix = 'hdx_') {
  return escapeClassName(prefixClass(name, prefix));
}

/**
 * Get the CSS selector with dot prefix
 * @param {string} name
 * @param {string} prefix
 * @returns {string}
 */
export function getSelectorWithDot(name, prefix = 'hdx_') {
  return '.' + getSelector(name, prefix);
}
