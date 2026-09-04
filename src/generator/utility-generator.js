import { getSelector } from '../core/prefix.js';

/**
 * Generate a CSS rule string from a utility definition
 * @param {import('../core/types.js').UtilityDefinition} def
 * @param {string} prefix
 * @returns {string} CSS rule
 */
export function generateRule(def, prefix = 'hdx_') {
  const selector = getSelector(def.name, prefix);
  return '.' + selector + ' { ' + def.property + ': ' + def.value + '; }\n';
}

/**
 * Generate a CSS rule from a multi-property utility (component-style)
 * Supports both `css` string format and `declarations` object format.
 * @param {import('../core/types.js').UtilityDefinition} def
 * @param {string} prefix
 * @returns {string} CSS rule
 */
export function generateMultiPropertyRule(def, prefix = 'hdx_') {
  const selector = getSelector(def.name, prefix);

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
  return '.' + selector + ' {\n' + lines + '\n}\n';
}
