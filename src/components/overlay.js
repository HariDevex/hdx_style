import { colorVariable } from '../generator/resolver.js';

/**
 * Overlay component definitions — drawer, popover, and lightbox layers.
 * Follows the dropdown contract: hidden by default (opacity/visibility) and
 * revealed by an accompanying `-open` modifier class the consumer toggles.
 *
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').ComponentDefinition[]}
 */
export function overlayComponents(config) {
  const prefix = config.prefix;
  const { fontSize, radius, shadows, zIndex } = config.theme;
  const cv = (key) => colorVariable(key, prefix);

  return [
    // ── Drawer ──────────────────────────────────────────────────────────
    // Left-anchored slide-in panel. Closed by default; slide in with
    // ui-drawer-open. z-index sits above the backdrop (overlay < modal).
    {
      name: 'ui-drawer',
      css: `position: fixed;
top: 0;
bottom: 0;
left: 0;
width: 20rem;
max-width: 85vw;
background-color: ${cv('surface')};
border-right: 1px solid ${cv('border')};
overflow-y: auto;
padding: 1.5rem;
transform: translateX(-100%);
transition: transform 300ms ease;
z-index: ${zIndex.modal};`,
      category: 'components',
    },

    // Right-anchored variant. Same pattern mirrored to the right edge.
    {
      name: 'ui-drawer-right',
      css: `right: 0;
left: auto;
border-right: none;
border-left: 1px solid ${cv('border')};
transform: translateX(100%);`,
      category: 'components',
    },

    // Reveal modifier — slide into view.
    {
      name: 'ui-drawer-open',
      css: `transform: translateX(0);`,
      category: 'components',
    },

    // Dim the page behind the drawer. Hidden by default, mirroring the
    // dropdown contract; needs ui-drawer-overlay-open to show.
    {
      name: 'ui-drawer-overlay',
      css: `position: fixed;
inset: 0;
background-color: rgba(0, 0, 0, 0.5);
opacity: 0;
visibility: hidden;
transition: opacity 300ms ease;
z-index: ${zIndex.overlay};`,
      category: 'components',
    },
    {
      name: 'ui-drawer-overlay-open',
      css: `opacity: 1;
visibility: visible;`,
      category: 'components',
    },

    // ── Popover ─────────────────────────────────────────────────────────
    // Anchored floating panel. Wrap the trigger in an element with
    // hdx-relative hdx-inline-block, then place this panel next to it.
    {
      name: 'ui-popover',
      css: `position: absolute;
bottom: calc(100% + 0.625rem);
left: 50%;
transform: translateX(-50%) translateY(0.5rem);
min-width: 12rem;
background-color: ${cv('surface')};
border: 1px solid ${cv('border')};
border-radius: ${radius.md};
box-shadow: ${shadows.lg};
padding: 0.75rem 1rem;
font-size: ${fontSize.sm};
opacity: 0;
visibility: hidden;
transition: opacity 150ms ease, transform 150ms ease;
z-index: ${zIndex.popover};`,
      category: 'components',
    },
    {
      name: 'ui-popover-open',
      css: `opacity: 1;
visibility: visible;
transform: translateX(-50%) translateY(0);`,
      category: 'components',
    },

    // Caret under the panel (rotated square sharing border/surface).
    {
      name: 'ui-popover-arrow',
      css: `position: absolute;
top: 100%;
left: 50%;
width: 0.5rem;
height: 0.5rem;
background-color: ${cv('surface')};
border-right: 1px solid ${cv('border')};
border-bottom: 1px solid ${cv('border')};
transform: translateX(-50%) rotate(45deg);`,
      category: 'components',
    },

    // ── Lightbox ────────────────────────────────────────────────────────
    // Full-screen media viewer. Closed by default; ui-lightbox-open shows it.
    {
      name: 'ui-lightbox',
      css: `position: fixed;
inset: 0;
display: flex;
align-items: center;
justify-content: center;
background-color: rgba(0, 0, 0, 0.7);
opacity: 0;
visibility: hidden;
transition: opacity 200ms ease;
padding: 1rem;
z-index: ${zIndex.modal};`,
      category: 'components',
    },
    {
      name: 'ui-lightbox-open',
      css: `opacity: 1;
visibility: visible;`,
      category: 'components',
    },

    // Framed media card centered inside the lightbox.
    {
      name: 'ui-lightbox-content',
      css: `position: relative;
max-width: 100%;
max-height: 90vh;
background-color: ${cv('surface')};
border-radius: ${radius.lg};
box-shadow: ${shadows.xl};
overflow: hidden;`,
      category: 'components',
    },

    // Close button pinned to the top-right of the content card.
    {
      name: 'ui-lightbox-close',
      css: `position: absolute;
top: 0.5rem;
right: 0.5rem;
display: inline-flex;
align-items: center;
justify-content: center;
width: 2rem;
height: 2rem;
border-radius: ${radius.full};
background-color: ${cv('surface')};
border: 1px solid ${cv('border')};
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

    // Caption strip under the media.
    {
      name: 'ui-lightbox-caption',
      css: `padding: 0.75rem 1rem;
font-size: ${fontSize.sm};
color: ${cv('text-secondary')};
text-align: center;`,
      category: 'components',
    },
  ];
}