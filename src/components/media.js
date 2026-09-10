import { colorVariable } from '../generator/resolver.js';

/**
 * Media component definitions — scroll-snap carousel, thumbnail strips,
 * and figure/caption wrappers.
 *
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').ComponentDefinition[]}
 */
export function mediaComponents(config) {
  const prefix = config.prefix;
  const { fontSize, radius, shadows } = config.theme;
  const cv = (key) => colorVariable(key, prefix);

  return [
    // ── Carousel ────────────────────────────────────────────────────────
    // Horizontal overflow rail with scroll-snap; add hdx-overflow-hidden
    // spacing utilities as needed. Prev/next buttons are optional anchors
    // into the rail via user scroll logic.
    {
      name: 'ui-carousel',
      css: `display: flex;
gap: 0.75rem;
overflow-x: auto;
scroll-snap-type: x mandatory;
padding: 0.25rem;
-webkit-overflow-scrolling: touch;`,
      category: 'components',
    },
    {
      name: 'ui-carousel-item',
      css: `flex: 0 0 auto;
scroll-snap-align: start;
border-radius: ${radius.md};
overflow: hidden;`,
      category: 'components',
    },
    {
      name: 'ui-carousel-prev',
      css: `display: inline-flex;
align-items: center;
justify-content: center;
width: 2.25rem;
height: 2.25rem;
border-radius: ${radius.full};
background-color: ${cv('surface')};
border: 1px solid ${cv('border')};
box-shadow: ${shadows.md};
color: ${cv('text')};
cursor: pointer;
transition: background-color 150ms ease;`,
      states: [
        {
          selector: ':hover',
          css: `background-color: ${cv('surface-secondary')};`,
        },
      ],
      category: 'components',
    },
    {
      name: 'ui-carousel-next',
      css: `display: inline-flex;
align-items: center;
justify-content: center;
width: 2.25rem;
height: 2.25rem;
border-radius: ${radius.full};
background-color: ${cv('surface')};
border: 1px solid ${cv('border')};
box-shadow: ${shadows.md};
color: ${cv('text')};
cursor: pointer;
transition: background-color 150ms ease;`,
      states: [
        {
          selector: ':hover',
          css: `background-color: ${cv('surface-secondary')};`,
        },
      ],
      category: 'components',
    },

    // ── Thumbnails ─────────────────────────────────────────────────────
    // Strip of small clickable previews; ui-thumbnail-active marks the
    // selected one with a primary ring.
    {
      name: 'ui-thumbnails',
      css: `display: flex;
flex-wrap: wrap;
gap: 0.5rem;`,
      category: 'components',
    },
    {
      name: 'ui-thumbnail',
      css: `width: 4rem;
height: 4rem;
border-radius: ${radius.md};
overflow: hidden;
border: 2px solid transparent;
cursor: pointer;
transition: border-color 150ms ease;`,
      states: [
        {
          selector: ':hover',
          css: `border-color: ${cv('border-strong')};`,
        },
      ],
      category: 'components',
    },
    {
      name: 'ui-thumbnail-active',
      css: `border-color: ${cv('primary')};`,
      category: 'components',
    },

    // ── Figure / caption ────────────────────────────────────────────────
    {
      name: 'ui-figure',
      css: `margin: 0;`,
      category: 'components',
    },
    {
      name: 'ui-figure-caption',
      css: `margin-top: 0.5rem;
font-size: ${fontSize.xs};
color: ${cv('text-muted')};
text-align: center;`,
      category: 'components',
    },
  ];
}