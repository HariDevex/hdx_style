/**
 * Apply prefix to a utility class name
 * @param {string} name - utility name (e.g. "flex", "p-4")
 * @param {string} prefix - prefix (e.g. "hdx_")
 * @returns {string} prefixed class name
 */
export function prefixClass(name, prefix = 'hdx_') {
  return prefix + name;
}

/**
 * Escape special characters for CSS selectors
 * hdx_w-1/2 → hdx_w-1\/2
 * hdx_w-[100px] → hdx_w-\[100px\]
 * @param {string} name
 * @returns {string}
 */
export function escapeClassName(name) {
  return name
    .replace(/\//g, '\\/')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/\./g, '\\.')
    .replace(/:/g, '\\:');
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
