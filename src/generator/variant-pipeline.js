/**
 * HDX CSS Variant Pipeline
 *
 * Applies an ordered list of variants to a base CSS rule.
 * Replaces the special-case combination functions with a general mechanism.
 *
 * Variant types:
 *   - state:     selector-based (e.g. :hover, :focus)
 *   - responsive: media query (e.g. @media (min-width: 768px))
 *   - dark:      class or media (e.g. .hdx_dark & or @media (prefers-color-scheme: dark))
 *   - ancestor:  ancestor selector (e.g. .hdx_group:hover &)
 *
 * @module generator/variant-pipeline
 */

import { getSelector } from '../core/prefix.js';

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
 * Apply a pipeline of variants to a base CSS rule.
 *
 * Variants are applied from outermost to innermost in CSS terms:
 * - The first variant in the array becomes the outermost wrapper
 * - The last variant in the array is closest to the rule
 *
 * Example: ['md', 'dark', 'hover'] for hdx_md_dark_hover_flex produces:
 *   @media (min-width: 768px) {
 *     .hdx_dark .hdx_md_dark_hover_flex:hover { display: flex; }
 *   }
 *
 * @param {string} baseCss - The base CSS rule (e.g. '.hdx_flex { display: flex; }')
 * @param {string[]} variantNames - Ordered variant names (e.g. ['md', 'hover'])
 * @param {Map<string, import('../core/types.js').VariantDefinition>} variantMap - Name→definition map
 * @param {string} utilityName - The utility name (e.g. 'flex')
 * @param {string} prefix - HDX prefix
 * @param {'class'|'media'|'both'} [darkStrategy='class']
 * @returns {string} Wrapped CSS
 */
export function applyVariantPipeline(baseCss, variantNames, variantMap, utilityName, prefix = 'hdx_', darkStrategy = 'class') {
  if (variantNames.length === 0) {
    return baseCss;
  }

  // Build full class name for selector generation
  const variantPrefix = variantNames.join('_') + '_';
  const fullClassName = variantPrefix + utilityName;
  const escaped = getSelector(fullClassName, prefix);

  // Apply variants from outermost (first) to innermost (last)
  // In CSS, outermost is the wrapper, innermost is closest to the rule
  let css = baseCss;

  for (let i = 0; i < variantNames.length; i++) {
    const vName = variantNames[i];
    const variant = variantMap.get(vName);
    if (!variant) continue;

    if (variant.type === 'responsive') {
      const mediaQuery = variant.selector(utilityName);
      css = mediaQuery + ' {\n' + indent(css) + '\n}\n';
    } else if (variant.type === 'dark') {
      const strategy = variant.strategy || darkStrategy;

      if (strategy === 'media') {
        css = '@media (prefers-color-scheme: dark) {\n' + indent(css) + '\n}\n';
      } else if (strategy === 'both') {
        css = '.hdx_dark ' + css + '\n@media (prefers-color-scheme: dark) {\n' + indent(css) + '\n}\n';
      } else {
        // class strategy: prepend .hdx_dark
        css = '.hdx_dark ' + css;
      }
    } else {
      // State or ancestor
      const variantSelector = variant.selector(fullClassName);
      let selector;
      if (variantSelector.includes('&')) {
        selector = variantSelector.replace('&', '.' + escaped);
      } else {
        selector = '.' + escaped + variantSelector;
      }
      css = css.replace(/^(\.\S+)(\s*\{)/, selector + '$2');
    }
  }

  return css;
}
