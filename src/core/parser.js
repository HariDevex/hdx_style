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
 * Default variant prefixes used when no resolved config is available. These
 * match the built-in variant set (responsive → dark → state/ancestor →
 * important), ordered longest-first so greedy matching never splits a longer
 * prefix into an unrelated shorter one.
 * @type {string[]}
 */
export const DEFAULT_VARIANT_PREFIXES = [
  // Responsive (must come before shorter matches)
  '2xl',
  // State (hyphenated first to avoid partial matches)
  'focus-visible',
  'read-only',
  'group-hover',
  'peer-hover',
  // Bare ancestor markers (activate group/peer/dark; never emitted as rules)
  'group',
  'peer',
  // Responsive single-char
  'sm', 'md', 'lg', 'xl',
  // Dark
  'dark',
  // Important/override modifier
  'important',
  // State single-word
  'hover', 'focus', 'active', 'visited', 'disabled',
  'checked', 'required', 'invalid', 'valid',
  'first', 'last', 'odd', 'even', 'empty', 'enabled',
  'placeholder', 'first-line', 'selection',
];

/**
 * Derive the ordered variant-prefix list from a resolved config. Variant
 * prefixes are NOT meant to be a hardcoded constant: a custom breakpoint added
 * to theme.breakpoints (e.g. `xs`) or a plugin addVariant() naming must be
 * parseable from a class name, otherwise it silently generates nothing.
 *
 * Order is responsive -> dark -> state/ancestor -> important, matching CSS
 * specificity (inside→out). Longer prefixes are listed first so greedy
 * matching consumes the whole prefix, never a partial match.
 *
 * @param {import('./types.js').HdxConfig} config
 * @returns {string[]}
 */
export function getVariantPrefixes(config) {
  const themeBps = config?.theme?.breakpoints || {};
  const states = [
    'hover', 'focus', 'active', 'visited', 'disabled',
    'checked', 'required', 'invalid', 'valid',
    'first', 'last', 'odd', 'even', 'empty', 'enabled',
    'placeholder', 'focus-visible', 'read-only', 'selection', 'first-line',
  ];

  return [
    // Responsive breakpoints (from resolved config, longest first)
    ...Object.keys(themeBps).sort((a, b) => b.length - a.length),
    // Dark (only when a dark strategy is configured; 'none' disables it)
    ...(config?.darkMode === 'none' ? [] : ['dark']),
    // Important
    'important',
    // Group/peer ancestors
    'group-hover', 'peer-hover',
    // Bare ancestor markers (activate group/peer; never emitted as rules)
    'group', 'peer',
    // State
    ...states,
  ];
}

/**
 * Parse a full HDX class name into its components.
 *
 * @param {string} fullName - Full prefixed class name (e.g. 'hdx_md_hover_bg-primary')
 * @param {string} prefix - Expected prefix (default 'hdx_')
 * @param {string[]} [variantPrefixes] - Ordered variant prefixes to match against
 *   (defaults to DEFAULT_VARIANT_PREFIXES). Pass the result of getVariantPrefixes(config)
 *   so custom breakpoints and plugin variants parse correctly.
 * @returns {ParsedClass}
 */
export function parseClass(fullName, prefix = 'hdx_', variantPrefixes = DEFAULT_VARIANT_PREFIXES) {
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
    for (const vp of variantPrefixes) {
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
 * @param {string[]} [variantPrefixes]
 * @returns {string}
 */
export function getUtilityName(fullName, prefix = 'hdx_', variantPrefixes = DEFAULT_VARIANT_PREFIXES) {
  return parseClass(fullName, prefix, variantPrefixes).utility;
}

/**
 * Parse a full class name and return just the variant list.
 * @param {string} fullName
 * @param {string} prefix
 * @param {string[]} [variantPrefixes]
 * @returns {string[]}
 */
export function getVariants(fullName, prefix = 'hdx_', variantPrefixes = DEFAULT_VARIANT_PREFIXES) {
  return parseClass(fullName, prefix, variantPrefixes).variants;
}

/**
 * Given a utility name, determine which variant combinations are requested
 * from a set of full class names.
 *
 * Returns a Map<utilityName, Set<string[]>> where each Set entry is a variant combo.
 *
 * @param {Set<string>|string[]} classNames - Full HDX class names
 * @param {string} prefix
 * @param {string[]} [variantPrefixes] - Ordered variant prefixes (defaults to the
 *   built-in set). Pass getVariantPrefixes(config) so custom breakpoints and
 *   plugin variants resolve.
 * @returns {Map<string, Set<string>>}
 */
export function mapUtilitiesToVariants(classNames, prefix = 'hdx_', variantPrefixes = DEFAULT_VARIANT_PREFIXES) {
  const map = new Map();

  for (const cls of classNames) {
    const parsed = parseClass(cls, prefix, variantPrefixes);
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
