import { colorVariable } from '../generator/resolver.js';

/**
 * Navigation component definitions — tabs, breadcrumbs, pagination,
 * mobile bottom nav bar.
 *
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').ComponentDefinition[]}
 */
export function navComponents(config) {
  const prefix = config.prefix;
  const { fontSize, radius, zIndex } = config.theme;
  const cv = (key) => colorVariable(key, prefix);

  return [
    // ── Tabs ────────────────────────────────────────────────────────────
    // Horizontal tab container (underline-style active indicator).
    {
      name: 'ui-nav-tabs',
      css: `display: flex;
align-items: center;
gap: 0;
border-bottom: 1px solid ${cv('border')};
list-style: none;
padding: 0;
margin: 0;`,
      category: 'components',
    },

    // Individual tab item.
    {
      name: 'ui-nav-tab',
      css: `display: inline-flex;
align-items: center;
padding: 0.625rem 1rem;
font-size: ${fontSize.sm};
font-weight: 500;
color: ${cv('text-secondary')};
text-decoration: none;
border-bottom: 2px solid transparent;
margin-bottom: -1px;
transition: color 150ms ease, border-color 150ms ease;
cursor: pointer;`,
      category: 'components',
    },

    // Active tab state — primary color underline + text.
    {
      name: 'ui-nav-tab-active',
      css: `color: ${cv('primary')};
border-bottom-color: ${cv('primary')};`,
      category: 'components',
    },

    // Pill-style tab variant — rounded background on active instead of underline.
    {
      name: 'ui-nav-tabs-pills',
      css: `border-bottom: none;
gap: 0.375rem;`,
      category: 'components',
    },
    {
      name: 'ui-nav-tab-pill-active',
      css: `color: ${cv('on-accent')};
background-color: ${cv('primary')};
border-radius: ${radius.md};
border-bottom: none;`,
      category: 'components',
    },

    // ── Breadcrumbs ─────────────────────────────────────────────────────
    // Breadcrumb container — horizontal flex row with gap.
    {
      name: 'ui-breadcrumb',
      css: `display: flex;
align-items: center;
flex-wrap: wrap;
gap: 0.375rem;
font-size: ${fontSize.sm};
list-style: none;
padding: 0;
margin: 0;`,
      category: 'components',
    },

    // Individual breadcrumb link/text item.
    {
      name: 'ui-breadcrumb-item',
      css: `color: ${cv('text-secondary')};
text-decoration: none;
transition: color 150ms ease;`,
      category: 'components',
    },

    // Separator between items (rendered via ::before pseudo-element).
    {
      name: 'ui-breadcrumb-separator',
      css: `color: ${cv('text-muted')};
user-select: none;`,
      category: 'components',
    },

    // Current (non-linked) breadcrumb — muted text.
    {
      name: 'ui-breadcrumb-current',
      css: `color: ${cv('text-muted')};
font-weight: 500;`,
      category: 'components',
    },

    // ── Pagination ──────────────────────────────────────────────────────
    // Pagination container.
    {
      name: 'ui-pagination',
      css: `display: flex;
align-items: center;
gap: 0.25rem;
list-style: none;
padding: 0;
margin: 0;`,
      category: 'components',
    },

    // Individual page button.
    {
      name: 'ui-pagination-item',
      css: `display: inline-flex;
align-items: center;
justify-content: center;
min-width: 2.25rem;
height: 2.25rem;
padding: 0 0.5rem;
font-size: ${fontSize.sm};
font-weight: 500;
color: ${cv('text')};
background-color: ${cv('surface')};
border: 1px solid ${cv('border')};
border-radius: ${radius.md};
text-decoration: none;
transition: background-color 150ms ease, border-color 150ms ease;
cursor: pointer;`,
      category: 'components',
    },

    // Active page.
    {
      name: 'ui-pagination-item-active',
      css: `background-color: ${cv('primary')};
color: ${cv('on-accent')};
border-color: ${cv('primary')};`,
      category: 'components',
    },

    // Disabled page.
    {
      name: 'ui-pagination-item-disabled',
      css: `opacity: 0.5;
cursor: not-allowed;
pointer-events: none;`,
      category: 'components',
    },

    // ── Mobile Bottom Tab Bar ───────────────────────────────────────────
    // Fixed bottom bar with safe-area padding for notched devices.
    {
      name: 'ui-nav-bottom',
      css: `position: fixed;
bottom: 0;
left: 0;
right: 0;
display: flex;
align-items: center;
justify-content: space-around;
background-color: ${cv('nav-bg')};
border-top: 1px solid ${cv('border')};
padding-bottom: env(safe-area-inset-bottom);
z-index: ${zIndex.sticky};`,
      category: 'components',
    },

    // Individual bottom tab — icon + label stacked vertically.
    {
      name: 'ui-nav-bottom-item',
      css: `display: flex;
flex-direction: column;
align-items: center;
gap: 0.125rem;
padding: 0.375rem 0.75rem;
font-size: ${fontSize.xs};
color: ${cv('text-muted')};
text-decoration: none;
transition: color 150ms ease;`,
      category: 'components',
    },

    // Active bottom tab.
    {
      name: 'ui-nav-bottom-item-active',
      css: `color: ${cv('primary')};`,
      category: 'components',
    },
  ];
}
