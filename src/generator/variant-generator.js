import { getSelector } from '../core/prefix.js';

/**
 * Wrap a CSS rule in a state variant selector
 * @param {string} baseRule - CSS rule string
 * @param {import('../core/types.js').VariantDefinition} variant
 * @param {string} utilName - original utility name
 * @param {string} prefix
 * @returns {string} CSS rule with variant selector
 */
export function wrapInStateVariant(baseRule, variant, utilName, prefix = 'hdx_') {
  const variantSelector = variant.selector(utilName);
  const fullSelector = variant.prefix + utilName;
  const escaped = getSelector(fullSelector, prefix);

  // Handle & replacement (for group-hover, peer-hover, etc.)
  let selector;
  if (variantSelector.includes('&')) {
    selector = variantSelector.replace('&', `.${escaped}`);
  } else {
    selector = `.${escaped}${variantSelector}`;
  }

  // Replace the selector in the base rule
  return baseRule.replace(
    /^(\.\S+)(\s*\{)/,
    `${selector}$2`
  );
}

/**
 * Wrap a CSS rule in a responsive media query
 * @param {string} baseRule
 * @param {import('../core/types.js').VariantDefinition} variant
 * @param {string} utilName
 * @param {string} prefix
 * @returns {string}
 */
export function wrapInResponsive(baseRule, variant, utilName, prefix = 'hdx_') {
  const mediaQuery = variant.selector(utilName);
  const fullSelector = variant.prefix + utilName;
  const escaped = getSelector(fullSelector, prefix);

  // Replace the selector and wrap in media query
  const inner = baseRule.replace(
    /^(\.\S+)(\s*\{)/,
    `.${escaped}$2`
  );

  return `${mediaQuery} {\n${indent(inner)}\n}\n`;
}

/**
 * Wrap a CSS rule in a dark mode variant
 * @param {string} baseRule
 * @param {import('../core/types.js').VariantDefinition} variant
 * @param {string} utilName
 * @param {string} prefix
 * @param {'class'|'media'|'both'} strategy
 * @returns {string}
 */
export function wrapInDark(baseRule, variant, utilName, prefix = 'hdx_', strategy = 'class') {
  const fullSelector = variant.prefix + utilName;
  const escaped = getSelector(fullSelector, prefix);

  const inner = baseRule.replace(
    /^(\.\S+)(\s*\{)/,
    `.${escaped}$2`
  );

  if (strategy === 'class') {
    return `.dark ${inner}`;
  }
  if (strategy === 'media') {
    return `@media (prefers-color-scheme: dark) {\n${indent(inner)}\n}\n`;
  }
  // both
  return `.dark ${inner}\n@media (prefers-color-scheme: dark) {\n${indent(inner)}\n}\n`;
}

/**
 * Indent each line of a CSS string
 * @param {string} css
 * @param {string} [indentStr]
 * @returns {string}
 */
export function indent(css, indentStr = '  ') {
  return css.split('\n').map(l => indentStr + l).join('\n');
}

/**
 * Wrap in combined responsive + state variant (e.g., hdx_md_hover_flex)
 * @param {string} baseRule
 * @param {import('../core/types.js').VariantDefinition} responsive
 * @param {import('../core/types.js').VariantDefinition} state
 * @param {string} utilName
 * @param {string} prefix
 * @returns {string}
 */
export function wrapInCombinedVariant(baseRule, responsive, state, utilName, prefix = 'hdx_') {
  const mediaQuery = responsive.selector(utilName);
  const stateSelector = state.selector(utilName);
  const fullSelector = responsive.prefix + state.prefix + utilName;
  const escaped = getSelector(fullSelector, prefix);

  let selector;
  if (stateSelector.includes('&')) {
    selector = stateSelector.replace('&', `.${escaped}`);
  } else {
    selector = `.${escaped}${stateSelector}`;
  }

  const inner = baseRule.replace(
    /^(\.\S+)(\s*\{)/,
    `${selector}$2`
  );

  return `${mediaQuery} {\n${indent(inner)}\n}\n`;
}

/**
 * Wrap in combined responsive + dark variant (e.g., hdx_lg_dark_flex)
 * @param {string} baseRule
 * @param {import('../core/types.js').VariantDefinition} responsive
 * @param {import('../core/types.js').VariantDefinition} dark
 * @param {string} utilName
 * @param {string} prefix
 * @param {'class'|'media'|'both'} strategy
 * @returns {string}
 */
export function wrapInCombinedResponsiveDark(baseRule, responsive, dark, utilName, prefix = 'hdx_', strategy = 'class') {
  const mediaQuery = responsive.selector(utilName);
  const fullSelector = responsive.prefix + dark.prefix + utilName;
  const escaped = getSelector(fullSelector, prefix);

  const inner = baseRule.replace(
    /^(\.\S+)(\s*\{)/,
    `.${escaped}$2`
  );

  if (strategy === 'class' || strategy === 'both') {
    const classInner = '.dark ' + inner;
    const classRule = mediaQuery + ' {\n' + indent(classInner) + '\n}\n';
    if (strategy === 'both') {
      const mediaInner = mediaQuery + ' {\n' + indent(inner) + '\n}';
      const mediaRule = '@media (prefers-color-scheme: dark) {\n' + indent(mediaInner) + '\n}\n';
      return classRule + mediaRule;
    }
    return classRule;
  }
  const mediaInner = mediaQuery + ' {\n' + indent(inner) + '\n}';
  return '@media (prefers-color-scheme: dark) {\n' + indent(mediaInner) + '\n}\n';
}

/**
 * Wrap in combined dark + state variant (e.g., hdx_dark_hover_flex)
 * @param {string} baseRule
 * @param {import('../core/types.js').VariantDefinition} dark
 * @param {import('../core/types.js').VariantDefinition} state
 * @param {string} utilName
 * @param {string} prefix
 * @param {'class'|'media'|'both'} strategy
 * @returns {string}
 */
export function wrapInCombinedDarkState(baseRule, dark, state, utilName, prefix = 'hdx_', strategy = 'class') {
  const stateSelector = state.selector(utilName);
  const fullSelector = dark.prefix + state.prefix + utilName;
  const escaped = getSelector(fullSelector, prefix);

  let selector;
  if (stateSelector.includes('&')) {
    selector = stateSelector.replace('&', `.${escaped}`);
  } else {
    selector = `.${escaped}${stateSelector}`;
  }

  const inner = baseRule.replace(
    /^(\.\S+)(\s*\{)/,
    `${selector}$2`
  );

  if (strategy === 'class' || strategy === 'both') {
    const classRule = `.dark ${inner}`;
    if (strategy === 'both') {
      const mediaRule = `@media (prefers-color-scheme: dark) {\n${indent(inner)}\n}\n`;
      return classRule + '\n' + mediaRule;
    }
    return classRule;
  }
  return `@media (prefers-color-scheme: dark) {\n${indent(inner)}\n}\n`;
}
