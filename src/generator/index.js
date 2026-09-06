import { getSelector } from '../core/prefix.js';
import { parseClass, mapUtilitiesToVariants } from '../core/parser.js';
import { generateRule, generateMultiPropertyRule } from './utility-generator.js';
import { applyVariantPipeline } from './variant-pipeline.js';
import { getAllUtilities } from '../utilities/index.js';
import { getAllVariants } from '../variants/index.js';
import { getAllComponents } from '../components/index.js';
import { generateAllVariables } from '../theme/variables.js';
import { runPlugins } from '../plugins/index.js';

/**
 * Generate complete CSS from config
 * @param {import('../core/types.js').HdxConfig} config
 * @param {import('../core/types.js').GenerateOptions} [options]
 * @returns {string}
 */
export function generateCSS(config, options = {}) {
  const { registry, config: processedConfig } = runPlugins(config);

  const darkStrategy = processedConfig.darkMode || 'class';
  const reset = processedConfig.reset !== false;
  const prefix = processedConfig.prefix;

  let css = '';

  // 1. CSS Variables
  css += '/* HDX CSS — Design Tokens */\n';
  css += generateAllVariables(processedConfig.theme, prefix, darkStrategy);

  // Reset (configurable)
  if (reset) {
    css += '\n/* HDX CSS — Reset */\n';
    css += generateReset(prefix);
  }

  // Reduced motion
  css += '\n/* HDX CSS — Accessibility */\n';
  css += generateReducedMotion();

  // 2. Utilities
  const allUtilities = getAllUtilities(processedConfig);
  const pluginUtilities = registry.utilities;
  const allVariants = getAllVariants(processedConfig);
  const pluginVariants = registry.variants;
  const allComponents = getAllComponents(processedConfig);
  const pluginComponents = registry.components;

  const variants = [...allVariants, ...pluginVariants];
  const variantMap = new Map(variants.map(v => [v.name, v]));

  // Build variant lookup by prefix
  const variantPrefixMap = new Map();
  for (const v of variants) {
    variantPrefixMap.set(v.prefix.replace(/_$/, ''), v);
  }

  // Check if we have purged utilities (demand-driven mode)
  const purgedUtilities = options.utilities || options._purgedUtilities || null;

  if (purgedUtilities) {
    // Demand-driven: only generate CSS for requested utilities + their variants
    css += generatePurgedCSS(purgedUtilities, variants, variantMap, prefix, darkStrategy);
  } else {
    // Full generation mode
    css += generateFullCSS(allUtilities, pluginUtilities, variants, variantMap, prefix, darkStrategy);
  }

  // 3. Components (opt-out via config.components: false). The built-in component
  // layer is appended after utilities/variants and would otherwise override
  // component-level overrides a user writes in their own index.css. Disabling
  // it lets a migration keep its custom component rules without an unpurged
  // duplicate of every built-in component shipping on every build.
  const components = processedConfig.components === false ? [] : [...allComponents, ...pluginComponents];
  if (components.length > 0) {
    css += '\n/* HDX CSS — Components */\n';
    for (const comp of components) {
      const selector = '.' + getSelector(comp.name, prefix);
      const lines = comp.css.trim().split('\n');
      const formatted = lines.map(l => '  ' + l.trim()).join('\n');
      css += selector + ' {\n' + formatted + '\n}\n';
    }
  }

  return css;
}

/**
 * Generate CSS for all utilities × all variants (full mode)
 */
function generateFullCSS(allUtilities, pluginUtilities, variants, variantMap, prefix, darkStrategy) {
  let css = '\n/* HDX CSS — Utilities */\n';
  const utils = [...allUtilities, ...pluginUtilities];

  // Phase 1: emit ALL base rules first. This guarantees that every base
  // utility (e.g. `.hdx_hidden { display:none }`) precedes every responsive
  // `@media` block, so at equal specificity the responsive variant always wins
  // when its breakpoint matches. (Cascade ordering contract — see notes.)
  for (const util of utils) {
    css += util.css
      ? generateMultiPropertyRule(util, prefix)
      : generateRule(util, prefix);
  }

  // Non-media variant rules accumulate inline; every @media block is buffered
  // and appended at the end (grouped by breakpoint for inspection).
  const mediaBlocks = {};

  // Phase 2: emit all variant rules (state, dark, important, and combos) and
  // single responsive variants.
  for (const util of utils) {
    const baseRule = util.css
      ? generateMultiPropertyRule(util, prefix)
      : generateRule(util, prefix);

    // Generate single variants
    for (const variant of variants) {
      const fullClass = variant.prefix + util.name;
      const rule = appendVariantCSS('', baseRule, variant, fullClass, util.name, prefix, darkStrategy, util.selector);
      css = groupEmit(css, mediaBlocks, rule);
    }

    // Generate combined variants: responsive + state
    const responsiveVariants = variants.filter(v => v.type === 'responsive');
    const stateVariants = variants.filter(v => v.type === 'state' || v.type === 'ancestor');
    const darkVariants = variants.filter(v => v.type === 'dark');

    // responsive + state
    for (const resp of responsiveVariants) {
      for (const state of stateVariants) {
        const variantCombo = [resp.name, state.name];
        let rule = util.css
          ? generateMultiPropertyRule(util, prefix)
          : generateRule(util, prefix);
        rule = applyVariantPipeline(rule, variantCombo, variantMap, util.name, prefix, darkStrategy, util.selector);
        css = groupEmit(css, mediaBlocks, rule);
      }
    }

    // responsive + dark
    for (const resp of responsiveVariants) {
      for (const dark of darkVariants) {
        const variantCombo = [resp.name, dark.name];
        let rule = util.css
          ? generateMultiPropertyRule(util, prefix)
          : generateRule(util, prefix);
        rule = applyVariantPipeline(rule, variantCombo, variantMap, util.name, prefix, darkStrategy, util.selector);
        css = groupEmit(css, mediaBlocks, rule);
      }
    }

    // dark + state
    for (const dark of darkVariants) {
      for (const state of stateVariants) {
        const variantCombo = [dark.name, state.name];
        let rule = util.css
          ? generateMultiPropertyRule(util, prefix)
          : generateRule(util, prefix);
        rule = applyVariantPipeline(rule, variantCombo, variantMap, util.name, prefix, darkStrategy, util.selector);
        css = groupEmit(css, mediaBlocks, rule);
      }
    }
  }

  // Phase 3: all @media blocks, grouped by breakpoint, appended last.
  for (const key of Object.keys(mediaBlocks)) {
    css += mediaBlocks[key];
  }

  return css;
}

/**
 * Append `rule` to either the inline css (non-media) or the media buffer keyed
 * by the first @media line of the rule so blocks group together by breakpoint.
 */
function groupEmit(css, mediaBlocks, rule) {
  const mediaLine = (rule.trimStart().startsWith('@media') ? rule.trimStart().split('\n')[0] : null)
    || (/\n\s*@media/.test(rule) ? rule.trim().split('\n').find(l => l.trim().startsWith('@media')).trim() : null);

  if (mediaLine) {
    mediaBlocks[mediaLine] = (mediaBlocks[mediaLine] || '') + rule;
  } else {
    css += rule;
  }
  return css;
}

/**
 * Generate CSS only for purged (requested) utilities and their variants.
 * This is the demand-driven generation path.
 */
function generatePurgedCSS(purgedUtilities, variants, variantMap, prefix, darkStrategy) {
  let css = '\n/* HDX CSS — Utilities */\n';

  // Phase 1: emit ALL base rules first (see generateFullCSS ordering contract).
  for (const util of purgedUtilities) {
    css += util.css
      ? generateMultiPropertyRule(util, prefix)
      : generateRule(util, prefix);
  }

  // Phase 2: emit all requested variant combos, buffering @media blocks so they
  // are grouped at the end (see generateFullCSS).
  const mediaBlocks = {};
  for (const util of purgedUtilities) {
    if (!util._requestedVariants) continue;
    const baseRule = util.css
      ? generateMultiPropertyRule(util, prefix)
      : generateRule(util, prefix);
    for (const variantCombo of util._requestedVariants) {
      if (variantCombo.length === 0) continue;
      const rule = applyVariantPipeline(baseRule, variantCombo, variantMap, util.name, prefix, darkStrategy, util.selector);
      css = groupEmit(css, mediaBlocks, rule);
    }
  }

  if (Object.keys(mediaBlocks).length > 0) {
    css += '\n/* HDX CSS — Responsive */\n';
  }
  for (const key of Object.keys(mediaBlocks)) {
    css += mediaBlocks[key];
  }

  return css;
}

/**
 * Append a single variant CSS to the output string.
 */
function appendVariantCSS(css, baseRule, variant, fullClassName, utilityName, prefix, darkStrategy, suffix) {
  const escaped = getSelector(fullClassName, prefix);
  const classSel = '.' + escaped;
  const withSuffix = classSel + (suffix || '');

  // Rebuild a rule whose selector is `selector` (keeping the declaration body).
  const rule = (selector) => selector + ' ' + baseRule.slice(baseRule.indexOf('{'));

  if (variant.type === 'responsive') {
    const mediaQuery = variant.selector(utilityName);
    const inner = rule(withSuffix);
    return css + mediaQuery + ' {\n' + indent(inner) + '\n}\n';
  }

  if (variant.type === 'dark') {
    const strategy = variant.strategy || darkStrategy;
    const inner = rule(withSuffix);

    if (strategy === 'media') {
      return css + '@media (prefers-color-scheme: dark) {\n' + indent(inner) + '\n}\n';
    }
    if (strategy === 'both') {
      return css + '.hdx_dark ' + inner + '\n@media (prefers-color-scheme: dark) {\n' + indent(inner) + '\n}\n';
    }
    return css + '.hdx_dark ' + inner;
  }

  // Important/override variant: keep the class selector but mark declarations
  // !important so they beat component-layer rules of equal specificity.
  if (variant.type === 'important') {
    return css + rule(withSuffix).replace(/;/g, ' !important;');
  }

  // State or ancestor
  const variantSelector = variant.selector(fullClassName);
  let selector;
  if (variantSelector.includes('&')) {
    selector = variantSelector.replace('&', classSel);
  } else {
    selector = classSel + variantSelector;
  }
  selector += suffix || '';
  return css + rule(selector);
}

/**
 * Indent CSS
 */
function indent(css, indentStr = '  ') {
  return css.split('\n').map(l => indentStr + l).join('\n');
}

/**
 * Generate CSS reset
 * @param {string} prefix
 * @returns {string}
 */
function generateReset(prefix) {
  const v = (key) => {
    const varPrefix = prefix.replace(/_/g, '-').replace(/-$/, '');
    return 'var(--' + varPrefix + '-color-' + key + ')';
  };

  return `*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: ${v('text')};
  background-color: ${v('background')};
  line-height: 1.5;
}

img, video {
  max-width: 100%;
  height: auto;
}

a {
  color: inherit;
  text-decoration: none;
}

button, input, select, textarea {
  font: inherit;
  color: inherit;
}

table {
  border-collapse: collapse;
}
`;
}

/**
 * Generate reduced motion styles
 * @returns {string}
 */
function generateReducedMotion() {
  return `@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
`;
}
