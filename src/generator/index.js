import { getSelector } from '../core/prefix.js';
import { generateRule, generateMultiPropertyRule } from './utility-generator.js';
import { wrapInStateVariant, wrapInResponsive, wrapInDark } from './variant-generator.js';
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
  const processedConfig = runPlugins(config);
  let css = '';

  // 1. CSS Variables
  css += '/* HDX CSS — Design Tokens */\n';
  css += generateAllVariables(processedConfig.theme, processedConfig.prefix);

  // Reset
  css += '\n/* HDX CSS — Reset */\n';
  css += generateReset(processedConfig.prefix);

  // Reduced motion
  css += '\n/* HDX CSS — Accessibility */\n';
  css += generateReducedMotion();

  // 2. Utilities
  const utilities = getAllUtilities(processedConfig);
  const variants = getAllVariants(processedConfig);

  css += '\n/* HDX CSS — Utilities */\n';
  for (const util of utilities) {
    if (util.css) {
      css += generateMultiPropertyRule(util, processedConfig.prefix);
    } else {
      css += generateRule(util, processedConfig.prefix);
    }

    for (const variant of variants) {
      let baseRule;
      if (util.css) {
        baseRule = generateMultiPropertyRule(util, processedConfig.prefix);
      } else {
        baseRule = generateRule(util, processedConfig.prefix);
      }

      if (variant.type === 'state') {
        css += wrapInStateVariant(baseRule, variant, util.name, processedConfig.prefix);
      } else if (variant.type === 'responsive') {
        css += wrapInResponsive(baseRule, variant, util.name, processedConfig.prefix);
      } else if (variant.type === 'dark') {
        css += wrapInDark(baseRule, variant, util.name, processedConfig.prefix, processedConfig.darkMode);
      }
    }
  }

  // 3. Components
  const components = getAllComponents(processedConfig);
  if (components.length > 0) {
    css += '\n/* HDX CSS — Components */\n';
    for (const comp of components) {
      const selector = '.' + getSelector(comp.name, processedConfig.prefix);
      const lines = comp.css.trim().split('\n');
      const formatted = lines.map(l => `  ${l.trim()}`).join('\n');
      css += `${selector} {\n${formatted}\n}\n`;
    }
  }

  return css;
}

/**
 * Generate CSS reset
 * @param {string} prefix
 * @returns {string}
 */
function generateReset(prefix) {
  const v = (key) => {
    const varPrefix = prefix.replace(/_/g, '-').replace(/-$/, '');
    return `var(--${varPrefix}-color-${key})`;
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
