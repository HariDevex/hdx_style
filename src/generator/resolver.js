/**
 * Resolve a token value from a theme category
 * @param {string} token - e.g. "primary", "4", "lg"
 * @param {Object} category - e.g. config.theme.colors
 * @returns {string|null}
 */
export function resolve(token, category) {
  if (!category) return null;
  return category[token] ?? null;
}

/**
 * Check if a color key is a semantic color (uses CSS variable)
 * @param {string} key
 * @param {Object} colors
 * @returns {boolean}
 */
export function isSemanticColor(key, colors) {
  return key in colors;
}

/**
 * Get CSS variable reference for a semantic color
 * @param {string} key - color name (e.g. "primary", "text")
 * @param {string} prefix - variable prefix (default "hdx_")
 * @returns {string} CSS variable reference
 */
export function colorVariable(key, prefix = 'hdx_') {
  const varPrefix = prefix.replace(/_/g, '-').replace(/-$/, '');
  return `var(--${varPrefix}-color-${key})`;
}

/**
 * Resolve a color value - returns CSS variable if semantic, raw value otherwise
 * @param {string} key
 * @param {Object} colors
 * @param {string} prefix
 * @returns {string|null}
 */
export function resolveColor(key, colors, prefix = 'hdx_') {
  if (!colors || !(key in colors)) return null;
  return colorVariable(key, prefix);
}

/**
 * Resolve a spacing/radius/shadow/opacity value - returns raw value
 * @param {string} key
 * @param {Object} category
 * @returns {string|null}
 */
export function resolveRaw(key, category) {
  if (!category || !(key in category)) return null;
  return category[key];
}
