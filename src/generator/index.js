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

  // 3. Components
  const components = [...allComponents, ...pluginComponents];
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

  for (const util of utils) {
    const baseRule = util.css
      ? generateMultiPropertyRule(util, prefix)
      : generateRule(util, prefix);
    css += baseRule;

    // Generate single variants
    for (const variant of variants) {
      let rule = util.css
        ? generateMultiPropertyRule(util, prefix)
        : generateRule(util, prefix);

      const fullClass = variant.prefix + util.name;
      css = appendVariantCSS(css, rule, variant, fullClass, util.name, prefix, darkStrategy);
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
        css = applyVariantPipelineToCSS(css, rule, variantCombo, variantMap, util.name, prefix, darkStrategy);
      }
    }

    // responsive + dark
    for (const resp of responsiveVariants) {
      for (const dark of darkVariants) {
        const variantCombo = [resp.name, dark.name];
        let rule = util.css
          ? generateMultiPropertyRule(util, prefix)
          : generateRule(util, prefix);
        css = applyVariantPipelineToCSS(css, rule, variantCombo, variantMap, util.name, prefix, darkStrategy);
      }
    }

    // dark + state
    for (const dark of darkVariants) {
      for (const state of stateVariants) {
        const variantCombo = [dark.name, state.name];
        let rule = util.css
          ? generateMultiPropertyRule(util, prefix)
          : generateRule(util, prefix);
        css = applyVariantPipelineToCSS(css, rule, variantCombo, variantMap, util.name, prefix, darkStrategy);
      }
    }
  }

  return css;
}

/**
 * Generate CSS only for purged (requested) utilities and their variants.
 * This is the demand-driven generation path.
 */
function generatePurgedCSS(purgedUtilities, variants, variantMap, prefix, darkStrategy) {
  let css = '\n/* HDX CSS — Utilities */\n';

  for (const util of purgedUtilities) {
    const baseRule = util.css
      ? generateMultiPropertyRule(util, prefix)
      : generateRule(util, prefix);
    css += baseRule;

    // If the utility has requested variant combos, generate those too
    if (util._requestedVariants) {
      for (const variantCombo of util._requestedVariants) {
        if (variantCombo.length === 0) continue;
        let rule = util.css
          ? generateMultiPropertyRule(util, prefix)
          : generateRule(util, prefix);
        css = applyVariantPipelineToCSS(css, rule, variantCombo, variantMap, util.name, prefix, darkStrategy);
      }
    }
  }

  return css;
}

/**
 * Apply variant pipeline and append result to css string.
 */
function applyVariantPipelineToCSS(css, baseRule, variantNames, variantMap, utilityName, prefix, darkStrategy) {
  const wrapped = applyVariantPipeline(baseRule, variantNames, variantMap, utilityName, prefix, darkStrategy);
  return css + wrapped;
}

/**
 * Append a single variant CSS to the output string.
 */
function appendVariantCSS(css, baseRule, variant, fullClassName, utilityName, prefix, darkStrategy) {
  const escaped = getSelector(fullClassName, prefix);

  if (variant.type === 'responsive') {
    const mediaQuery = variant.selector(utilityName);
    const inner = baseRule.replace(/^(\.\S+)(\s*\{)/, '.' + escaped + '$2');
    return css + mediaQuery + ' {\n' + indent(inner) + '\n}\n';
  }

  if (variant.type === 'dark') {
    const strategy = variant.strategy || darkStrategy;
    const inner = baseRule.replace(/^(\.\S+)(\s*\{)/, '.' + escaped + '$2');

    if (strategy === 'media') {
      return css + '@media (prefers-color-scheme: dark) {\n' + indent(inner) + '\n}\n';
    }
    if (strategy === 'both') {
      return css + '.hdx_dark ' + inner + '\n@media (prefers-color-scheme: dark) {\n' + indent(inner) + '\n}\n';
    }
    return css + '.hdx_dark ' + inner;
  }

  // State or ancestor
  const variantSelector = variant.selector(fullClassName);
  let selector;
  if (variantSelector.includes('&')) {
    selector = variantSelector.replace('&', '.' + escaped);
  } else {
    selector = '.' + escaped + variantSelector;
  }
  const inner = baseRule.replace(/^(\.\S+)(\s*\{)/, selector + '$2');
  return css + inner;
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
