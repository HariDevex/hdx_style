/**
 * Escape a string for use inside a RegExp.
 * @param {string} str
 * @returns {string}
 */
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

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
 * @param {string} [prefix='hdx-'] - class prefix used to tag template/string
 *   literals (quoted class attributes extract every token regardless).
 * @returns {Set<string>}
 */
export function extractClassNames(content, prefix = 'hdx-') {
  const classes = new Set();
  const prefixRe = escapeRegExp(prefix);
  const prefixClassRe = new RegExp(prefixRe + '[\\w]');

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
      let value = match[1];
      // Vue/Angular bindings may wrap a plain string in a second quote layer
      // (`:class="'hdx-flex hdx-p-4'"`, `ngClass="'hdx-btn'"`). Strip it so we
      // don't get `'hdx-flex` / `` hdx-p-4' `` tokens.
      const first = value[0];
      if ((first === '"' || first === "'") && value[value.length - 1] === first) {
        value = value.slice(1, -1);
      }
      splitClasses(value).forEach(c => classes.add(c));
    }
  }

  // Template literals: `hdx-flex hdx-p-4`
  const templatePattern = /`([^`]*?)`/g;
  let match;
  while ((match = templatePattern.exec(content)) !== null) {
    const inner = match[1];
    // Only extract if it looks like it contains HDX classes
    if (prefixClassRe.test(inner)) {
      splitClasses(inner).forEach(c => classes.add(c));
    }
  }

  // String literals with HDX classes: "hdx-flex hdx-p-4" or 'hdx-flex hdx-p-4'
  // We match any string literal and then filter for tokens starting with the prefix.
  const stringPattern = /(['"])(.*?)\1/g;
  while ((match = stringPattern.exec(content)) !== null) {
    const value = match[2];
    if (prefixClassRe.test(value)) {
      splitClasses(value).forEach(c => {
        if (c.startsWith(prefix)) classes.add(c);
      });
    }
  }

  // Array join patterns: ['hdx-flex', 'hdx-p-4'].join(' ') containing HDX
  // classes. We look for the preceding array literal [ ... ] and extract all quoted strings.
  const joinPattern = /\.join\(\s*(['"])\s*(\S+)?\s*\1\s*\)/g;
  while ((match = joinPattern.exec(content)) !== null) {
    // Find the start of the array [
    let start = match.index - 1;
    let brackets = 0;
    while (start >= 0) {
      if (content[start] === ']') brackets++;
      if (content[start] === '[') brackets--;
      if (brackets === 0) break;
      start--;
    }
    const arrayContent = content.slice(Math.max(0, start), match.index);
    const itemRe = /(['"])([^'"]*?)\1/g;
    let item;
    while ((item = itemRe.exec(arrayContent)) !== null) {
      if (prefixClassRe.test(item[2])) {
        splitClasses(item[2]).forEach(c => classes.add(c));
      }
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
