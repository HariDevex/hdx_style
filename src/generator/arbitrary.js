/**
 * Arbitrary value resolution
 *
 * Converts a safe subset of Tailwind-style arbitrary values into synthesized
 * utility definitions at purge time, e.g. `hdx_w-[260px]` → { width: 260px },
 * `hdx_rounded-[10px]`, `hdx_max-h-[70vh]`, `hdx_opacity-[0.5]`.
 *
 * Only a curated allow-list of property prefixes is supported, so this never
 * becomes a free-form CSS injection mechanism.
 *
 * @module generator/arbitrary
 */

// [property, valueKind]
// valueKind ∈ 'length' | 'number' | 'angle' | 'raw' | 'blur'
const ARBITRARY_UTILITIES = {
  // Sizing
  'w': ['width', 'length'],
  'h': ['height', 'length'],
  'min-w': ['min-width', 'length'],
  'min-h': ['min-height', 'length'],
  'max-w': ['max-width', 'length'],
  'max-h': ['max-height', 'length'],
  // Radius
  'rounded': ['border-radius', 'length'],
  // Typography
  'text': ['font-size', 'length'],
  'leading': ['line-height', 'length'],
  'tracking': ['letter-spacing', 'length'],
  // Spacing
  'p': ['padding', 'length'],
  'px': ['padding-inline', 'length'],
  'py': ['padding-block', 'length'],
  'pt': ['padding-top', 'length'],
  'pr': ['padding-right', 'length'],
  'pb': ['padding-bottom', 'length'],
  'pl': ['padding-left', 'length'],
  'm': ['margin', 'length'],
  'mx': ['margin-inline', 'length'],
  'my': ['margin-block', 'length'],
  'mt': ['margin-top', 'length'],
  'mr': ['margin-right', 'length'],
  'mb': ['margin-bottom', 'length'],
  'ml': ['margin-left', 'length'],
  'gap': ['gap', 'length'],
  'gap-x': ['column-gap', 'length'],
  'gap-y': ['row-gap', 'length'],
  // Positioning
  'top': ['top', 'length'],
  'right': ['right', 'length'],
  'bottom': ['bottom', 'length'],
  'left': ['left', 'length'],
  // Numbers / misc
  'opacity': ['opacity', 'number'],
  'z': ['z-index', 'number'],
  'delay': ['transition-delay', 'length'],
  'duration': ['transition-duration', 'length'],
  // Transforms (via the variable-based transform model)
  'rotate': ['--rotate', 'angle'],
  'translate-x': ['--translate-x', 'length'],
  'translate-y': ['--translate-y', 'length'],
  'scale-x': ['--scale-x', 'number'],
  'scale-y': ['--scale-y', 'number'],
  'blur': ['filter', 'blur'],
};

const NUMBER_RE = /^-?\d+(\.\d+)?$/;

/**
 * Resolve an arbitrary utility name like `w-[260px]` into a viable
 * UtilityDefinition, or null when it isn't a supported arbitrary value.
 *
 * @param {string} utility - The parsed utility token (e.g. 'w-[260px]')
 * @returns {import('../core/types.js').UtilityDefinition|null}
 */
export function resolveArbitraryUtility(utility) {
  const match = /^(.+)-\[(.+)\]$/.exec(utility);
  if (!match) return null;

  const token = match[1];
  const rawValue = match[2];

  // Underscores inside arbitrary values stand for spaces (Tailwind semantics).
  const value = rawValue.replace(/_/g, ' ').trim();

  const spec = ARBITRARY_UTILITIES[token];
  if (!spec) return null;
  const [property, kind] = spec;

  // Block characters that would leak out of a single CSS declaration.
  if (/[{}\n\r;]/.test(value)) return null;

  let out;
  switch (kind) {
    case 'length':
      out = NUMBER_RE.test(value) ? value + 'px' : value;
      break;
    case 'angle':
      out = NUMBER_RE.test(value) ? value + 'deg' : value;
      break;
    case 'number':
      out = value;
      break;
    case 'blur':
      out = 'blur(' + (NUMBER_RE.test(value) ? value + 'px' : value) + ')';
      break;
    default:
      out = value;
  }

  if (property === 'opacity' && NUMBER_RE.test(out)) {
    const n = parseFloat(out);
    if (n >= 0 && n <= 1) out = String(n);
  }

  return {
    name: utility,
    property,
    value: out,
    category: 'arbitrary',
  };
}