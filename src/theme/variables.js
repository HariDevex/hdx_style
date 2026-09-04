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
 * Generate dark mode CSS variables
 * @param {Object} theme
 * @param {string} prefix
 * @returns {string} CSS string with dark overrides
 */
export function generateDarkVariables(theme, prefix = 'hdx_') {
  const varPrefix = prefix.replace(/_/g, '-').replace(/-$/, '');
  let css = '';

  // Class-based dark mode
  css += `.dark {\n`;
  for (const [key, value] of Object.entries(theme.darkColors || {})) {
    const varName = `--${varPrefix}-color-${key}`;
    css += `  ${varName}: ${value};\n`;
  }
  css += '}\n';

  // Media query dark mode
  css += `@media (prefers-color-scheme: dark) {\n`;
  css += `  .hdx_dark-media {\n`;
  for (const [key, value] of Object.entries(theme.darkColors || {})) {
    const varName = `--${varPrefix}-color-${key}`;
    css += `    ${varName}: ${value};\n`;
  }
  css += `  }\n`;
  css += '}\n';

  return css;
}

/**
 * Generate all CSS variables (light + dark)
 * @param {Object} theme
 * @param {string} prefix
 * @returns {string}
 */
export function generateAllVariables(theme, prefix = 'hdx_') {
  return generateCSSVariables(theme, prefix) + '\n' + generateDarkVariables(theme, prefix);
}
