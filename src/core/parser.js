/**
 * HDX CSS Class Parser
 *
 * Parses HDX class names into structured data:
 *   hdx_flex               → { prefix: 'hdx_', variants: [], utility: 'flex' }
 *   hdx_md_flex            → { prefix: 'hdx_', variants: ['md'], utility: 'flex' }
 *   hdx_md_hover_bg-primary → { prefix: 'hdx_', variants: ['md', 'hover'], utility: 'bg-primary' }
 *   hdx_lg_dark_hover_bg-primary → { prefix: 'hdx_', variants: ['lg', 'dark', 'hover'], utility: 'bg-primary' }
 *
 * @module core/parser
 */

/**
 * @typedef {Object} ParsedClass
 * @property {string} prefix - The prefix (e.g. 'hdx_')
 * @property {string[]} variants - Ordered variant list (e.g. ['md', 'hover'])
 * @property {string} utility - The utility name (e.g. 'bg-primary')
 * @property {boolean} valid - Whether parsing succeeded
 */

/**
 * Known variant prefixes in canonical order.
 * Order matters: responsive → dark → state (inside→out CSS specificity).
 * The parser checks longer prefixes first to avoid greedy matching.
 * @type {string[]}
 */
const VARIANT_PREFIXES = [
  // Responsive (must come before shorter matches)
  '2xl',
  // State (hyphenated first to avoid partial matches)
  'focus-visible',
  'read-only',
  'group-hover',
  'peer-hover',
  // Responsive single-char
  'sm', 'md', 'lg', 'xl',
  // Dark
  'dark',
  // State single-word
  'hover', 'focus', 'active', 'visited', 'disabled',
  'checked', 'required', 'invalid', 'valid',
  'first', 'last', 'odd', 'even', 'empty', 'enabled',
  'placeholder', 'first-line', 'selection',
];

/**
 * Set for O(1) lookup
 */
const VARIANT_SET = new Set(VARIANT_PREFIXES);

/**
 * Parse a full HDX class name into its components.
 *
 * @param {string} fullName - Full prefixed class name (e.g. 'hdx_md_hover_bg-primary')
 * @param {string} prefix - Expected prefix (default 'hdx_')
 * @returns {ParsedClass}
 */
export function parseClass(fullName, prefix = 'hdx_') {
  if (!fullName || typeof fullName !== 'string') {
    return { prefix, variants: [], utility: '', valid: false };
  }

  if (!fullName.startsWith(prefix)) {
    return { prefix, variants: [], utility: fullName, valid: false };
  }

  const rest = fullName.slice(prefix.length);
  if (!rest) {
    return { prefix, variants: [], utility: '', valid: false };
  }

  const segments = rest.split('_');
  const variants = [];
  let segIndex = 0;

  // Try to consume variant prefixes from the front.
  // We use a greedy approach: at each position, try the longest matching prefix first.
  while (segIndex < segments.length) {
    const remaining = segments.slice(segIndex).join('_');
    let matched = false;

    // Try progressively shorter prefixes (longest match first)
    for (const vp of VARIANT_PREFIXES) {
      if (remaining === vp || remaining.startsWith(vp + '_')) {
        variants.push(vp);
        // Calculate how many segments this prefix consumed
        const prefixSegments = vp.split('_').length;
        segIndex += prefixSegments;
        matched = true;
        break;
      }
    }

    if (!matched) break;
  }

  const utility = segments.slice(segIndex).join('_');

  return {
    prefix,
    variants,
    utility,
    valid: utility.length > 0,
  };
}

/**
 * Check if a class name is an HDX utility (starts with prefix).
 * @param {string} className
 * @param {string} prefix
 * @returns {boolean}
 */
export function isHdxClass(className, prefix = 'hdx_') {
  return className.startsWith(prefix) && className.length > prefix.length;
}

/**
 * Parse a full class name and return just the utility name.
 * @param {string} fullName
 * @param {string} prefix
 * @returns {string}
 */
export function getUtilityName(fullName, prefix = 'hdx_') {
  return parseClass(fullName, prefix).utility;
}

/**
 * Parse a full class name and return just the variant list.
 * @param {string} fullName
 * @param {string} prefix
 * @returns {string[]}
 */
export function getVariants(fullName, prefix = 'hdx_') {
  return parseClass(fullName, prefix).variants;
}

/**
 * Given a utility name, determine which variant combinations are requested
 * from a set of full class names.
 *
 * Returns a Map<utilityName, Set<string[]>> where each Set entry is a variant combo.
 *
 * @param {Set<string>|string[]} classNames - Full HDX class names
 * @param {string} prefix
 * @returns {Map<string, Set<string>>}
 */
export function mapUtilitiesToVariants(classNames, prefix = 'hdx_') {
  const map = new Map();

  for (const cls of classNames) {
    const parsed = parseClass(cls, prefix);
    if (!parsed.valid) continue;

    if (!map.has(parsed.utility)) {
      map.set(parsed.utility, new Set());
    }

    const variantKey = parsed.variants.length > 0
      ? parsed.variants.join('_')
      : '';

    map.get(parsed.utility).add(variantKey);
  }

  return map;
}
