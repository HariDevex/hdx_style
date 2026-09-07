/**
 * Arbitrary media (breakpoint) variants.
 *
 * `min-[900px]_` / `max-[900px]_` target an exact custom width without a
 * theme breakpoint:
 *
 *   hdx-min-[900px]_flex  → @media (min-width: 900px) { .hdx-min-\[900px\]_flex { ... } }
 *   hdx-max-[900px]_flex  → @media (max-width: 900px)  { .hdx-max-\[900px\]_flex { ... } }
 *
 * They are demand-driven: the value space is unbounded, so a full (no-purge)
 * build cannot enumerate them. Instead they are synthesized from the classes
 * the scanner actually sees — parseClass recognizes the segment, the purger
 * records it in the requested variant combo, and the generator adds the
 * VariantDefinition on the fly before applying the pipeline.
 *
 * Values must not contain `_` (the class-name separator) and are emitted
 * verbatim inside the media query (e.g. `900px`, `80vw`, `calc(100vw - 4rem)`).
 *
 * @module variants/arbitrary
 */

const ARBITRARY_MEDIA_RE = /^(min|max)-\[([^\]]+)\]$/;

/**
 * @param {string} name - variant name without prefix, e.g. 'min-[900px]'
 * @returns {boolean}
 */
export function isArbitraryMediaName(name) {
  return ARBITRARY_MEDIA_RE.test(name);
}

/**
 * @param {string} prefix - variant prefix with trailing underscore, e.g. 'min-[900px]_'
 * @returns {boolean}
 */
export function isArbitraryMediaPrefix(prefix) {
  return ARBITRARY_MEDIA_RE.test(prefix.replace(/_$/, ''));
}

/**
 * Resolve an arbitrary media variant name to its media query.
 * @param {string} name
 * @returns {string|null} e.g. '@media (min-width: 900px)'
 */
export function parseArbitraryMedia(name) {
  const m = ARBITRARY_MEDIA_RE.exec(name);
  if (!m) return null;
  const [, kind, value] = m;
  return kind === 'min'
    ? `@media (min-width: ${value})`
    : `@media (max-width: ${value})`;
}

/**
 * Synthesize a VariantDefinition from an arbitrary media variant name.
 * @param {string} name
 * @returns {import('../core/types.js').VariantDefinition|null}
 */
export function synthesizeArbitraryMediaVariant(name) {
  const query = parseArbitraryMedia(name);
  if (!query) return null;
  return {
    name,
    prefix: `${name}_`,
    selector: () => query,
    type: 'responsive',
  };
}

/**
 * Match the leading segment of a remaining class string (rest after the
 * prefix) as an arbitrary media variant, e.g. `min-[900px]_flex` → 'min-[900px]'.
 * @param {string} remaining
 * @returns {string|null}
 */
export function matchArbitraryMediaSegment(remaining) {
  const m = /^(min|max)-\[[^\]]+\]_/.exec(remaining);
  return m ? m[0].slice(0, -1) : null;
}