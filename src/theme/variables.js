/**
 * Generate CSS custom properties from theme colors
 * @param {Object} theme
 * @param {string} prefix
 * @returns {string} CSS string with :root variables
 */
export function generateCSSVariables(theme, prefix = 'hdx_') {
  const varPrefix = prefix.replace(/_/g, '-').replace(/-$/, '');
  let css = ':root {\n';

  for (const [key, value] of Object.entries(theme.colors)) {
    const varName = `--${varPrefix}-color-${key}`;
    css += `  ${varName}: ${value};\n`;
  }

  css += '}\n';
  return css;
}

/**
 * Generate dark mode CSS variables respecting the configured strategy.
 * @param {Object} theme
 * @param {string} prefix
 * @param {'class'|'media'|'both'} [strategy='class']
 * @returns {string} CSS string with dark overrides
 */
export function generateDarkVariables(theme, prefix = 'hdx_', strategy = 'class') {
  const varPrefix = prefix.replace(/_/g, '-').replace(/-$/, '');
  let css = '';

  if (strategy === 'class' || strategy === 'both') {
    css += '.hdx_dark {\n';
    for (const [key, value] of Object.entries(theme.darkColors || {})) {
      const varName = `--${varPrefix}-color-${key}`;
      css += `  ${varName}: ${value};\n`;
    }
    css += '}\n';
  }

  if (strategy === 'media' || strategy === 'both') {
    css += '@media (prefers-color-scheme: dark) {\n';
    css += '  :root {\n';
    for (const [key, value] of Object.entries(theme.darkColors || {})) {
      const varName = `--${varPrefix}-color-${key}`;
      css += `    ${varName}: ${value};\n`;
    }
    css += '  }\n';
    css += '}\n';
  }

  return css;
}

/**
 * Generate all CSS variables (light + dark)
 * @param {Object} theme
 * @param {string} prefix
 * @param {'class'|'media'|'both'} [strategy='class']
 * @returns {string}
 */
export function generateAllVariables(theme, prefix = 'hdx_', strategy = 'class') {
  return generateCSSVariables(theme, prefix) + '\n' + generateDarkVariables(theme, prefix, strategy);
}
