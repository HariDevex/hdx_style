import { colorVariable } from '../generator/resolver.js';

/**
 * Interactive component definitions
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').ComponentDefinition[]}
 */
export function interactiveComponents(config) {
  const prefix = config.prefix;
  const { radius, shadows } = config.theme;
  const cv = (key) => colorVariable(key, prefix);

  return [
    // --- Advanced Buttons ---
    {
      name: 'ui-btn-ghost',
      css: `background-color: transparent;
border: 1px solid ${cv('button-ghost-border')};
color: ${cv('button-ghost-text')};
padding: 0.5rem 1rem;
border-radius: ${radius['md']};
cursor: pointer;
transition: all 0.2s ease;`,
      category: 'components',
    },
    {
      name: 'ui-btn-ghost-hover',
      css: `background-color: ${cv('surface-secondary')};
border-color: ${cv('button-ghost-text')};`,
      category: 'components',
    },
    {
      name: 'ui-btn-pill',
      css: `border-radius: ${radius['full']};`,
      category: 'components',
    },
    {
      name: 'ui-btn-loading',
      css: `position: relative;
color: transparent !important;
pointer-events: none;`,
      category: 'components',
    },
    {
      name: 'ui-btn-spinner',
      css: `position: absolute;
left: 50%;
top: 50%;
transform: translate(-50%, -50%);
width: 1rem;
height: 1rem;
border: 2px solid currentColor;
border-right-color: transparent;
border-radius: 50%;
animation: hdx-spin 0.6s linear infinite;`,
      category: 'components',
    },
    // --- Dropdowns ---
    {
      name: 'ui-dropdown',
      css: `position: relative;
display: inline-block;`,
      category: 'components',
    },
    {
      name: 'ui-dropdown-menu',
      css: `position: absolute;
top: 100%;
left: 0;
min-width: 12rem;
background-color: ${cv('surface')};
border: 1px solid ${cv('border')};
border-radius: ${radius['md']};
box-shadow: ${shadows.md};
z-index: 100;
padding: 0.5rem 0;
opacity: 0;
visibility: hidden;
transform: translateY(-10px);
transition: all 0.2s ease;`,
      category: 'components',
    },
    {
      name: 'ui-dropdown-item',
      css: `display: block;
padding: 0.5rem 1rem;
color: ${cv('text')};
text-decoration: none;
cursor: pointer;
transition: background-color 0.2s ease;`,
      category: 'components',
    },
    {
      name: 'ui-dropdown-item-hover',
      css: `background-color: ${cv('surface-secondary')};`,
      category: 'components',
    },
    {
      name: 'ui-dropdown-open',
      css: `opacity: 1;
visibility: visible;
transform: translateY(0);`,
      category: 'components',
    },
    // --- Responsive Layouts ---
    {
      name: 'ui-grid-1col',
      css: `display: grid;
grid-template-columns: 1fr;
gap: 1rem;`,
      category: 'components',
    },
    {
      name: 'ui-grid-2col',
      css: `display: grid;
grid-template-columns: repeat(2, 1fr);
gap: 1rem;`,
      category: 'components',
    },
    {
      name: 'ui-grid-3col',
      css: `display: grid;
grid-template-columns: repeat(3, 1fr);
gap: 1rem;`,
      category: 'components',
    },
    {
      name: 'ui-grid-auto',
      css: `display: grid;
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
gap: 1rem;`,
      category: 'components',
    },
  ];
}
