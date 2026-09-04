import { getSelector } from '../core/prefix.js';

/**
 * Generate a CSS rule string from a utility definition
 * @param {import('../core/types.js').UtilityDefinition} def
 * @param {string} prefix
 * @returns {string} CSS rule
 */
export function generateRule(def, prefix = 'hdx_') {
  const selector = getSelector(def.name, prefix);
  return `.${selector} { ${def.property}: ${def.value}; }\n`;
}

/**
 * Generate a CSS rule from a multi-property utility (component-style)
 * @param {import('../core/types.js').UtilityDefinition} def
 * @param {string} prefix
 * @returns {string} CSS rule
 */
export function generateMultiPropertyRule(def, prefix = 'hdx_') {
  const selector = getSelector(def.name, prefix);
  const css = def.css.trim();
  // Ensure the CSS ends with }
  const formatted = css.endsWith('}') ? css : `${css}`;
  return `.${selector} {\n${formatted.split('\n').map(l => `  ${l.trim()}`).join('\n')}\n}\n`;
}
