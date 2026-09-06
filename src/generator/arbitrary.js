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
  // 'text' is disambiguated at resolve time (Task 2): a color-shaped value maps
  // to 'color: …', otherwise it behaves as 'font-size' length. 'bg'/'border'/
  // 'ring' (Task 7) accept color-shaped values (and only those), resolved to
  // their color property.
  'text': ['font-size', 'length'],
  'bg': ['background-color', 'raw'],
  'border': ['border-color', 'raw'],
  'ring': ['--ring-color', 'raw'],
  'leading': ['line-height', 'unitless-or-length'],
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
// Like NUMBER_RE but also accepts leading-dot decimals (`.5`).
const NUMERIC_RE = /^-?(?:\d+(?:\.\d+)?|\.\d+)$/;

// Value kinds that can hold a CSS color.
const COLOR_KIND = 'color';
// Value kind used only for 'leading': a bare number stays unitless, but
// explicit units / percentages pass through unchanged.
const UNITLESS_OR_LENGTH_KIND = 'unitless-or-length';

// Web color keywords (used by isColorValue for non-hex non-function colors).
const COLOR_KEYWORDS = new Set([
  'currentcolor', 'transparent', 'inherit', 'initial', 'revert', 'unset',
  'black', 'white', 'red', 'orange', 'yellow', 'green', 'blue', 'purple',
  'gray', 'grey', 'silver', 'maroon', 'olive', 'lime', 'aqua', 'teal',
  'navy', 'fuchsia', 'pink', 'brown', 'coral', 'crimson', 'gold', 'indigo',
  'ivory', 'khaki', 'lavender', 'magenta', 'orchid', 'plum', 'salmon',
  'sienna', 'tan', 'tomato', 'violet', 'wheat', 'cyan', 'beige', 'chocolate',
]);

// Color-shaped values: hex, rgb/rgba/hsl/hsla functions, var(), and known
// CSS color keywords.
function isColorValue(value) {
  const v = value.trim().toLowerCase();
  const first = v[0];
  return first === '#'
    || v.startsWith('rgb(') || v.startsWith('rgba(')
    || v.startsWith('hsl(') || v.startsWith('hsla(')
    || (v.startsWith('var(') && v.endsWith(')'))
    || COLOR_KEYWORDS.has(v);
}

// Properties that accept negative values (margins, offsets, translates).
const NEGATABLE = new Set([
  'm', 'mx', 'my', 'mt', 'mr', 'mb', 'ml',
  'top', 'right', 'bottom', 'left',
  'translate-x', 'translate-y',
]);

// Color-backed arbitrary tokens (Task 7) share the same value-shape detection
// as 'text'. Tokens NOT listed here — but present in ARBITRARY_UTILITIES —
// derive their value-kind from ARBITRARY_UTILITIES.
const COLOR_TOKENS = new Set(['text', 'bg', 'border', 'ring']);

// Token → color property. For most color tokens spec[0] already holds the
// color property (bg/border/ring); 'text' is the exception — its default
// property is font-size, so color-shaped values must switch to `color`.
const COLOR_PROPERTY = {
  text: 'color',
  bg: 'background-color',
  border: 'border-color',
  ring: '--ring-color',
};

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

  let token = match[1];
  const rawValue = match[2];

  // Negative form: `-mt-[13px]` negates the value and resolves to `mt`.
  const negative = token.startsWith('-');
  if (negative) token = token.slice(1);

  // Underscores inside arbitrary values stand for spaces (Tailwind semantics).
  const value = rawValue.replace(/_/g, ' ').trim();

  const spec = ARBITRARY_UTILITIES[token];
  if (!spec) return null;
  let [property, kind] = spec;

  // 'text' (and the color tokens from Task 7) are disambiguated by value
  // shape: a color-shaped value maps to the color property, otherwise it keeps
  // its default kind (font-size/length for 'text', etc.).
  if (COLOR_TOKENS.has(token)) {
    if (isColorValue(value)) {
      property = COLOR_PROPERTY[token];
      kind = COLOR_KIND;
    } else if (token !== 'text') {
      // bg/border/ring only accept color-shaped values. A non-color value is
      // genuinely unsupported and should resolve to null so it surfaces via
      // the "Unknown utility" warning path instead of emitting invalid CSS.
      return null;
    }
  }

  if (negative && (!NEGATABLE.has(token) || kind !== 'length')) return null;

  // Block characters that would leak out of a single CSS declaration.
  if (/[{}\n\r;]/.test(value)) return null;

  let out;
  switch (kind) {
    case 'length':
      out = NUMBER_RE.test(value) ? value + 'px' : value;
      break;
    case 'unitless-or-length':
      // Tailwind convention for line-height: a bare number stays unitless
      // (line-height: 1.4), while explicit units / percentages pass through
      // unchanged. Neither case appends px.
      out = value;
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
    case 'color':
      out = value;
      break;
    default:
      out = value;
  }

  if (negative) {
    if (NUMBER_RE.test(out)) out = '-' + out;
    else if (!out.startsWith('-')) out = '-' + out;
  }

  if (property === 'opacity' && NUMERIC_RE.test(out)) {
    const n = parseFloat(out);
    // Normalize to the built-in opacity scale (0–1). Values already expressed
    // as a 0–1 decimal stay as-is; integer/float values within 0–100 are
    // treated as a percentage and divided by 100 to match how the built-in
    // hdx_opacity-N utilities work (hdx_opacity-50 → 0.5).
    //
    // Ambiguous edge case: `opacity-[1]` could mean 1% or 100%. Mirroring
    // Tailwind's own convention, `1` is treated as already-normalized (1.0),
    // which is the safer default than silently collapsing it to 0.01.
    if (n >= 0 && n <= 1) {
      out = String(n);
    } else if (n > 1 && n <= 100) {
      out = String(n / 100);
    }
  }

  return {
    name: utility,
    property,
    value: out,
    category: 'arbitrary',
  };
}