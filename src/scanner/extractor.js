/**
 * Extract class names from file content (HTML/JSX/Vue/Svelte)
 * @param {string} content
 * @returns {Set<string>}
 */
export function extractClassNames(content) {
  const patterns = [
    /class="([^"]*?)"/g,
    /class='([^']*?)'/g,
    /className="([^"]*?)"/g,
    /className='([^']*?)'/g,
    /:class="([^"]*?)"/g,
    /:class='([^']*?)'/g,
    /ngClass="([^"]*?)"/g,
    /ngClass='([^']*?)'/g,
  ];

  const classes = new Set();

  for (const regex of patterns) {
    let match;
    while ((match = regex.exec(content)) !== null) {
      match[1]
        .split(/\s+/)
        .filter(Boolean)
        .forEach((c) => classes.add(c));
    }
  }

  return classes;
}
