/**
 * HDX CSS Variant Pipeline
 *
 * Applies an ordered list of variants to a base CSS rule.
 * Replaces the special-case combination functions with a general mechanism.
 *
 * Variant types:
 *   - state:     selector-based (e.g. :hover, :focus)
 *   - responsive: media query (e.g. @media (min-width: 768px))
 *   - dark:      class or media (e.g. .hdx-dark & or @media (prefers-color-scheme: dark))
 *   - ancestor:  ancestor selector (e.g. .hdx-group:hover &)
 *
 * @module generator/variant-pipeline
 */

import { escapeClassName } from '../core/prefix.js';

/**
 * Indent each line of a CSS string
 * @param {string} css
 * @param {string} [indentStr]
 * @returns {string}
 */
export function indent(css, indentStr = '  ') {
  // Fast path: single-line rules (the common case) avoid split/map/join.
  return css.includes('\n')
    ? indentStr + css.replace(/\n/g, '\n' + indentStr)
    : indentStr + css;
}

/**
 * Mark every declaration in a rule `!important`, leaving declarations that
 * already carry an `!important` flag untouched.
 *
 * A naive `css.replace(/;/g, ' !important;')` has two flaws corrected here:
 * - It double-marks declarations that already end in `!important` (reached via
 *   a plugin utility `css` body or an arbitrary value such as
 *   `w-[auto_!important]`), producing invalid `!important !important` CSS that
 *   browsers drop entirely.
 * - It injects the flag into `;` characters inside quoted string literals
 *   (e.g. `content: 'a;b'`), silently corrupting the value.
 *
 * This implementation does a single pass, tracking `'...'`/`"..."` quote state
 * (honoring backslash escapes) and only marking `;` that terminate a
 * declaration outside of a string.
 * @param {string} css - A CSS rule (selector + declaration block)
 * @returns {string} The rule with each unmarked declaration made !important
 */
export function markImportant(css) {
  let out = '';
  let quote = null;
  for (let i = 0; i < css.length; i++) {
    const ch = css[i];
    if (quote) {
      out += ch;
      if (ch === '\\') {
        i++;
        if (i < css.length) out += css[i];
      } else if (ch === quote) {
        quote = null;
      }
      continue;
    }
    if (ch === "'" || ch === '"') {
      quote = ch;
      out += ch;
      continue;
    }
    if (ch === ';') {
      if (!/!\s*important\s*$/i.test(out)) out += ' !important';
      out += ';';
      continue;
    }
    out += ch;
  }
  return out;
}

/**
 * Apply a pipeline of variants to a base CSS rule.
 *
 * Variants are applied from outermost to innermost in CSS terms:
 * - The first variant in the array becomes the outermost wrapper
 * - The last variant in the array is closest to the rule
 *
 * Example: ['md', 'dark', 'hover'] for hdx-md_dark_hover_flex produces:
 *   @media (min-width: 768px) {
 *     .hdx-dark .hdx-md_dark_hover_flex:hover { display: flex; }
 *   }
 *
 * The variantMap maps a name to ALL registered definitions (usually one).
 * When a name has several (dark mode 'both' registers a class strategy and a
 * media strategy under the same name), each combination is emitted as its own
 * rule — so a `dark_` class produces both the `.hdx-dark` ancestor rule and
 * the `@media (prefers-color-scheme: dark)` rule.
 *
 * @param {string} baseCss - The base CSS rule (e.g. '.hdx-flex { display: flex; }')
 * @param {string[]} variantNames - Ordered variant names (e.g. ['md', 'hover'])
 * @param {Map<string, import('../core/types.js').VariantDefinition[]>} variantMap - Name→definitions map
 * @param {string} utilityName - The utility name (e.g. 'flex')
 * @param {string} prefix - HDX prefix
 * @param {'class'|'media'|'both'} [darkStrategy='class']
 * @param {string} [suffix=''] - Optional selector suffix (e.g. ' > :not([hidden]) ~ :not([hidden])')
 * @returns {string[]} Wrapped CSS rules (one per registered strategy)
 */
export function applyVariantPipeline(baseCss, variantNames, variantMap, utilityName, prefix = 'hdx-', darkStrategy = 'class', suffix = '') {
  if (variantNames.length === 0) {
    return [baseCss];
  }

  // Build full class name for selector generation
  const variantPrefix = variantNames.join('_') + '_';
  const fullClassName = variantPrefix + utilityName;

  // Escape only the utility name (memoized) and prepend the variant prefix:
  // variant names are alphanumeric/hyphenated so they never need escaping, and
  // escaping is per-character so escape(a+b) === escape(a)+escape(b). Arbitrary
  // media variants (min-[900px]_) break that invariant, so escape the whole
  // prefix when it contains bracket characters.
  const escapedVariantPrefix = /[\[\]]/.test(variantPrefix)
    ? escapeClassName(variantPrefix)
    : variantPrefix;
  const escaped = prefix + escapedVariantPrefix + escapeClassName(utilityName);

  // Resolve variant groups once up-front. Each name may map to several defs
  // (e.g. dark 'both'); take the cartesian product so every strategy is emitted.
  const resolvedGroups = [];
  for (const name of variantNames) {
    const defs = variantMap.get(name);
    if (defs && defs.length > 0) resolvedGroups.push(defs);
  }
  if (resolvedGroups.length === 0) {
    return ['.' + escaped + (suffix || '') + ' ' + baseCss.slice(baseCss.indexOf('{'))];
  }

  let combinations = [[]];
  for (const group of resolvedGroups) {
    const next = [];
    for (const combination of combinations) {
      for (const def of group) next.push([...combination, def]);
    }
    combinations = next;
  }

  const rules = [];

  for (const resolved of combinations) {
    // 1. Compose the inner selector. State/ancestor variants mutate the selector
    //    closest to the rule, so walk variants innermost (last) → outermost
    //    (first) and only rewrite the selector of the bare rule, never the
    //    wrappers.
    let selector = '.' + escaped;
    for (let i = resolved.length - 1; i >= 0; i--) {
      const variant = resolved[i];
      if (variant.type === 'state' || variant.type === 'ancestor') {
        const variantSelector = variant.selector(fullClassName);
        selector = variantSelector.includes('&')
          ? variantSelector.replace('&', selector)
          : selector + variantSelector;
      }
    }

    // Append the selector suffix after the composed class selector so that
    // combinators (space/divide) follow regardless of the variant.
    const fullSelector = selector + (suffix || '');

    // Replace the base rule's selector by rebuilding from its declaration body.
    let css = fullSelector + ' ' + baseCss.slice(baseCss.indexOf('{'));

    // Apply !important when any variant in the combo is an important modifier.
    if (resolved.some(v => v.type === 'important')) {
      css = markImportant(css);
    }

    // 2. Apply wrappers (responsive, dark) from innermost to outermost so that
    //    responsive ends up outermost and dark sits between it and the rule.
    for (let i = resolved.length - 1; i >= 0; i--) {
      const variant = resolved[i];
      if (variant.type === 'responsive') {
        const mediaQuery = variant.selector(utilityName);
        css = mediaQuery + ' {\n' + indent(css) + '\n}\n';
      } else if (variant.type === 'container') {
        const cq = variant.selector(utilityName);
        css = cq + ' {\n' + indent(css) + '\n}\n';
      } else if (variant.type === 'dark') {
        const strategy = variant.strategy || darkStrategy;

        if (strategy === 'media') {
          css = '@media (prefers-color-scheme: dark) {\n' + indent(css) + '\n}\n';
        } else if (strategy === 'both') {
          const marker = `.${prefix}dark`;
          css = marker + ' ' + css + '\n@media (prefers-color-scheme: dark) {\n' + indent(css) + '\n}\n';
        } else {
          // class strategy: prepend .hdx-dark (prefix-aware marker)
          css = `.${prefix}dark ` + css;
        }
      }
    }

    rules.push(css);
  }

  return rules;
}
