/**
 * Extract class names from file content (HTML/JSX/Vue/Svelte)
 *
 * Supports:
 * - class="..." and class='...'
 * - className="..." and className='...'
 * - :class="..." (Vue)
 * - ngClass="..." (Angular)
 * - Template literals: `...`
 * - Multiline class attributes
 * - JSX expressions with string literals
 *
 * @param {string} content
 * @returns {Set<string>}
 */
export function extractClassNames(content) {
  const classes = new Set();

  // Patterns for quoted class attributes (handles multiline via [\s\S])
  const quotePatterns = [
    /class="([\s\S]*?)"/g,
    /class='([\s\S]*?)'/g,
    /className="([\s\S]*?)"/g,
    /className='([\s\S]*?)'/g,
    /:class="([\s\S]*?)"/g,
    /:class='([\s\S]*?)'/g,
    /ngClass="([\s\S]*?)"/g,
    /ngClass='([\s\S]*?)'/g,
  ];

  for (const regex of quotePatterns) {
    let match;
    while ((match = regex.exec(content)) !== null) {
      splitClasses(match[1]).forEach(c => classes.add(c));
    }
  }

  // Template literals: `hdx_flex hdx_p-4`
  const templatePattern = /`([^`]*?)`/g;
  let match;
  while ((match = templatePattern.exec(content)) !== null) {
    const inner = match[1];
    // Only extract if it looks like it contains HDX classes
    if (/hdx_\w/.test(inner)) {
      splitClasses(inner).forEach(c => classes.add(c));
    }
  }

  // String literals with HDX classes: "hdx_flex hdx_p-4" or 'hdx_flex hdx_p-4'
  // (already covered by quote patterns above, but also catch standalone strings)
  const stringPattern = /(["'])(hdx_[\w\s\-/\[\].:]+)\1/g;
  while ((match = stringPattern.exec(content)) !== null) {
    splitClasses(match[2]).forEach(c => classes.add(c));
  }

  // Array join patterns: [...].join(' ') containing HDX classes
  const joinPattern = /\.join\(\s*(['"])\s*(\S+)?\s*\1\s*\)/g;
  while ((match = joinPattern.exec(content)) !== null) {
    // Look backwards for the array content
    const before = content.slice(Math.max(0, match.index - 500), match.index);
    if (/hdx_\w/.test(before)) {
      splitClasses(before).forEach(c => classes.add(c));
    }
  }

  return classes;
}

/**
 * Split a class string on whitespace, filter empty strings
 * @param {string} str
 * @returns {string[]}
 */
function splitClasses(str) {
  return str.split(/\s+/).filter(Boolean);
}
