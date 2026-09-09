import { getSelector } from '../core/prefix.js';
import { generateRule, generateMultiPropertyRule } from './utility-generator.js';
import { applyVariantPipeline, indent, markImportant } from './variant-pipeline.js';
import { getAllUtilities } from '../utilities/index.js';
import { getAllVariants } from '../variants/index.js';
import { getAllComponents } from '../components/index.js';
import { generateAllVariables } from '../theme/variables.js';
import { defaultFontFamily } from '../theme/defaults.js';
import { runPlugins } from '../plugins/index.js';
import { synthesizeArbitraryMediaVariant, isArbitraryMediaName } from '../variants/arbitrary.js';

/**
 * Generate complete CSS from config
 * @param {import('../core/types.js').HdxConfig} config
 * @param {import('../core/types.js').GenerateOptions} [options]
 * @returns {string}
 */
export function generateCSS(config, options = {}) {
  // If the caller (e.g. scan.js's generatePurgedBuildCss) already ran plugins
  // to purge-match plugin utilities/variants, reuse that registry instead of
  // running plugins again. This guarantees a plugin executes exactly once per
  // build, even when it has side effects.
  let processedConfig = config;
  let registry = options._registry;
  if (!registry) {
    const result = runPlugins(config);
    registry = result.registry;
    processedConfig = result.config;
  } else {
    processedConfig = config;
  }

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
  // Name → variant-def versions. Multiple defs may share a name (dark 'both'
  // registers a class + a media strategy), so values are arrays and the
  // pipeline expands them (one output rule per strategy).
  const variantMap = new Map();
  for (const v of variants) {
    const existing = variantMap.get(v.name);
    if (existing) existing.push(v);
    else variantMap.set(v.name, [v]);
  }

  // Check if we have purged utilities (demand-driven mode)
  const purgedUtilities = options.utilities || options._purgedUtilities || null;

  if (purgedUtilities) {
    // Arbitrary breakpoint classes (min-[900px]_, max-[900px]_) cannot be
    // enumerated up front; synthesize their variant definitions from the
    // demanded combos so the pipeline wraps them in the right @media query.
    synthesizeArbitraryMediaVariants(variantMap, purgedUtilities);

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
  //
  // options.components lets the purged-build path (scanner/scan.js) pass the
  // exact subset of components whose classes appear in content (or safelist)
  // instead of every built-in component — each definition carries its own
  // `states` blocks, so hover/active/etc. are included with the base.
  const components = processedConfig.components === false
    ? []
    : (options.components || [...allComponents, ...pluginComponents]);
  if (components.length > 0) {
    css += '\n/* HDX CSS — Components */\n';
    for (const comp of components) {
      const selector = '.' + getSelector(comp.name, prefix);
      const lines = comp.css.trim().split('\n');
      const formatted = lines.map(l => '  ' + l.trim()).join('\n');
      css += selector + ' {\n' + formatted + '\n}\n';
      for (const state of comp.states || []) {
        const stateLines = state.css.trim().split('\n');
        const stateFormatted = stateLines.map(l => '  ' + l.trim()).join('\n');
        css += selector + state.selector + ' {\n' + stateFormatted + '\n}\n';
      }
    }
  }

  return css;
}

/**
 * Generate CSS for all utilities × all variants (full mode)
 */
function generateFullCSS(allUtilities, pluginUtilities, variants, variantMap, prefix, darkStrategy) {
  const baseChunks = [];
  const variantChunks = [];
  const mediaBlocks = {};
  const utils = [...allUtilities, ...pluginUtilities];

  // Phase 1: emit ALL base rules first. This guarantees that every base
  // utility (e.g. `.hdx-hidden { display:none }`) precedes every responsive
  // `@media` block, so at equal specificity the responsive variant always wins
  // when its breakpoint matches. (Cascade ordering contract — see notes.)
  for (const util of utils) {
    baseChunks.push(util.css
      ? generateMultiPropertyRule(util, prefix)
      : generateRule(util, prefix));
  }

  // Non-media variant rules accumulate in a chunk array; every @media block is
  // buffered and appended at the end (grouped by breakpoint for inspection).
  // Chunk arrays keep generation O(n) — repeated `css += rule` on a growing
  // multi-MB string is O(n²) and dominates build time.

  // Responsive, state, and dark variant lists are fixed for this build — compute
  // once instead of re-filtering inside the per-utility loop (~1573 times each).
  // Combos are deduped by name: the variantMap expansion (not the list) emits
  // every registered strategy (e.g. dark class + dark media in 'both' mode), so
  // iterating each name once avoids duplicate rules.
  const dedupeByName = (defs) => [...new Map(defs.map(v => [v.name, v])).values()];
  const responsiveVariants = dedupeByName(variants.filter(v => v.type === 'responsive'));
  const stateVariants = dedupeByName(variants.filter(v => v.type === 'state' || v.type === 'ancestor'));
  const darkVariants = dedupeByName(variants.filter(v => v.type === 'dark'));

  // Phase 2: emit all variant rules (state, dark, important, and combos) and
  // single responsive variants.
  for (const util of utils) {
    const baseRule = util.css
      ? generateMultiPropertyRule(util, prefix)
      : generateRule(util, prefix);

    // Generate single variants
    for (const variant of variants) {
      const fullClass = variant.prefix + util.name;
      groupEmit(variantChunks, mediaBlocks, appendVariantCSS('', baseRule, variant, fullClass, util.name, prefix, darkStrategy, util.selector));
    }

    // Generate combined variants: responsive + state, responsive + dark, dark +
    // state. All combos reuse `baseRule` (only its declaration body is used),
    // avoiding re-generating and re-escaping the base rule per combo.

    // responsive + state
    for (const resp of responsiveVariants) {
      for (const state of stateVariants) {
        const variantCombo = [resp.name, state.name];
        for (const rule of applyVariantPipeline(baseRule, variantCombo, variantMap, util.name, prefix, darkStrategy, util.selector)) {
          groupEmit(variantChunks, mediaBlocks, rule);
        }
      }
    }

    // responsive + dark
    for (const resp of responsiveVariants) {
      for (const dark of darkVariants) {
        const variantCombo = [resp.name, dark.name];
        for (const rule of applyVariantPipeline(baseRule, variantCombo, variantMap, util.name, prefix, darkStrategy, util.selector)) {
          groupEmit(variantChunks, mediaBlocks, rule);
        }
      }
    }

    // dark + state
    for (const dark of darkVariants) {
      for (const state of stateVariants) {
        const variantCombo = [dark.name, state.name];
        for (const rule of applyVariantPipeline(baseRule, variantCombo, variantMap, util.name, prefix, darkStrategy, util.selector)) {
          groupEmit(variantChunks, mediaBlocks, rule);
        }
      }
    }
  }

  // Phase 3: all @media blocks, grouped by breakpoint, appended last.
  let css = '\n/* HDX CSS — Utilities */\n'
    + baseChunks.join('')
    + variantChunks.join('');
  for (const key of Object.keys(mediaBlocks)) {
    css += mediaBlocks[key].join('');
  }

  return css;
}

/**
 * Route a generated rule to either the inline chunks (non-media) or the media
 * buffer keyed by the first @media line of the rule so blocks group together by
 * breakpoint. Both are arrays so the final output is produced with a single
 * join (keeps generation O(n) instead of O(n²)).
 */
function groupEmit(chunks, mediaBlocks, rule) {
  // Fast path: the most common produced rules begin with '@media', so take the
  // leading @media line directly. Only rules that embed a second @media block
  // (rare: dark 'both' strategy) need a slower scan.
  if (rule.charCodeAt(0) === 64) { // '@'
    const brace = rule.indexOf('{');
    if (brace !== -1) {
      const mediaLine = rule.slice(0, brace + 1);
      mediaBlocks[mediaLine] = mediaBlocks[mediaLine] || [];
      mediaBlocks[mediaLine].push(rule);
      return;
    }
    chunks.push(rule);
    return;
  }

  const mediaIndex = rule.indexOf('@media');
  if (mediaIndex === -1) {
    chunks.push(rule);
    return;
  }
  const brace = rule.indexOf('{', mediaIndex);
  if (brace === -1) {
    chunks.push(rule);
    return;
  }
  const mediaLine = rule.slice(mediaIndex, brace + 1);
  mediaBlocks[mediaLine] = mediaBlocks[mediaLine] || [];
  mediaBlocks[mediaLine].push(rule);
}

/**
 * Generate CSS only for purged (requested) utilities and their variants.
 * This is the demand-driven generation path.
 */
function generatePurgedCSS(purgedUtilities, variants, variantMap, prefix, darkStrategy) {
  const baseChunks = [];
  const variantChunks = [];
  const mediaBlocks = {};

  // Phase 1: emit ALL base rules first (see generateFullCSS ordering contract).
  for (const util of purgedUtilities) {
    baseChunks.push(util.css
      ? generateMultiPropertyRule(util, prefix)
      : generateRule(util, prefix));
  }

  // Phase 2: emit all requested variant combos, buffering @media blocks so they
  // are grouped at the end (see generateFullCSS).
  for (const util of purgedUtilities) {
    if (!util._requestedVariants) continue;
    const baseRule = util.css
      ? generateMultiPropertyRule(util, prefix)
      : generateRule(util, prefix);
    for (const variantCombo of util._requestedVariants) {
      if (variantCombo.length === 0) continue;
      const rules = applyVariantPipeline(baseRule, variantCombo, variantMap, util.name, prefix, darkStrategy, util.selector);
      for (const rule of rules) groupEmit(variantChunks, mediaBlocks, rule);
    }
  }

  const css = '\n/* HDX CSS — Utilities */\n'
    + baseChunks.join('')
    + variantChunks.join('')
    + (Object.keys(mediaBlocks).length > 0 ? '\n/* HDX CSS — Responsive */\n' : '')
    + Object.keys(mediaBlocks).map(key => mediaBlocks[key].join('')).join('');

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

  if (variant.type === 'container') {
    const cq = variant.selector(utilityName);
    const inner = rule(withSuffix);
    return css + cq + ' {\n' + indent(inner) + '\n}\n';
  }

  if (variant.type === 'dark') {
    const strategy = variant.strategy || darkStrategy;
    const inner = rule(withSuffix);
    const marker = `.${prefix}dark`;

    if (strategy === 'media') {
      return css + '@media (prefers-color-scheme: dark) {\n' + indent(inner) + '\n}\n';
    }
    if (strategy === 'both') {
      return css + marker + ' ' + inner + '\n@media (prefers-color-scheme: dark) {\n' + indent(inner) + '\n}\n';
    }
    return css + marker + ' ' + inner;
  }

  // Important/override variant: keep the class selector but mark declarations
  // !important so they beat component-layer rules of equal specificity.
  if (variant.type === 'important') {
    return css + markImportant(rule(withSuffix));
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
  font-family: ${defaultFontFamily};
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

/**
 * Register synthesized arbitrary media variants (min-[900px]_, max-[900px]_)
 * into the variant map for the variants requested by purged utilities, so the
 * pipeline can wrap them. Inert for static variants (already present).
 * @param {Map<string, import('../core/types.js').VariantDefinition[]>} variantMap
 * @param {import('../core/types.js').UtilityDefinition[]} purgedUtilities
 */
function synthesizeArbitraryMediaVariants(variantMap, purgedUtilities) {
  for (const util of purgedUtilities) {
    for (const combo of util._requestedVariants || []) {
      for (const name of combo) {
        if (variantMap.has(name) || !isArbitraryMediaName(name)) continue;
        const def = synthesizeArbitraryMediaVariant(name);
        if (def) variantMap.set(name, [def]);
      }
    }
  }
}
