import { getSelector } from '../core/prefix.js';

/**
 * Build the full CSS selector for a utility, applying an optional selector
 * suffix (e.g. ` > :not([hidden]) ~ :not([hidden])` for space/divide combinators).
 * @param {import('../core/types.js').UtilityDefinition} def
 * @param {string} prefix
 * @returns {string}
 */
function selectorFor(def, prefix) {
  const base = '.' + getSelector(def.name, prefix);
  return def.selector ? base + def.selector : base;
}

/**
 * Generate a CSS rule string from a utility definition
 * @param {import('../core/types.js').UtilityDefinition} def
 * @param {string} prefix
 * @returns {string} CSS rule
 */
export function generateRule(def, prefix = 'hdx-') {
  const selector = selectorFor(def, prefix);
  return selector + ' { ' + def.property + ': ' + def.value + '; }\n';
}

/**
 * Generate a CSS rule from a multi-property utility (component-style)
 * Supports both `css` string format and `declarations` object format.
 * @param {import('../core/types.js').UtilityDefinition} def
 * @param {string} prefix
 * @returns {string} CSS rule
 */
export function generateMultiPropertyRule(def, prefix = 'hdx-') {
  const selector = selectorFor(def, prefix);

  let cssBody;
  if (def.css) {
    cssBody = def.css.trim();
  } else if (def.declarations) {
    cssBody = Object.entries(def.declarations)
      .map(([prop, val]) => prop + ': ' + val + ';')
      .join('\n');
  } else {
    return generateRule(def, prefix);
  }

  const lines = cssBody.split('\n').map(l => '  ' + l.trim()).join('\n');
  return selector + ' {\n' + lines + '\n}\n';
}
