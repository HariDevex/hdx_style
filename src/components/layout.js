import { colorVariable } from '../generator/resolver.js';

/**
 * Layout component definitions
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').ComponentDefinition[]}
 */
export function layoutComponents(config) {
  const prefix = config.prefix;
  const { radius, zIndex, shadows } = config.theme;
  const cv = (key) => colorVariable(key, prefix);

  return [
    // --- Header & Footer ---
    {
      name: 'ui-header',
      css: `display: flex;
align-items: center;
justify-content: space-between;
padding: 1rem 2rem;
background-color: ${cv('nav-bg')};
color: ${cv('nav-text')};
border-bottom: 1px solid ${cv('border')};
position: sticky;
top: 0;
z-index: ${zIndex.sticky};`,
      category: 'components',
    },
    {
      name: 'ui-footer',
      css: `display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
padding: 2rem;
background-color: ${cv('nav-bg')};
color: ${cv('nav-text')};
border-top: 1px solid ${cv('border')};
margin-top: auto;`,
      category: 'components',
    },
    // --- Navigation Bars ---
    {
      name: 'ui-nav-top',
      css: `display: flex;
align-items: center;
gap: 1.5rem;
list-style: none;
padding: 0;
margin: 0;`,
      category: 'components',
    },
    {
      name: 'ui-nav-item',
      css: `text-decoration: none;
color: ${cv('nav-text')};
font-weight: 500;
transition: color 0.2s ease;
cursor: pointer;`,
      category: 'components',
    },
    {
      name: 'ui-nav-item-active',
      css: `color: ${cv('nav-accent')};`,
      category: 'components',
    },
    {
      name: 'ui-nav-sidebar',
      css: `display: flex;
flex-direction: column;
width: 260px;
height: 100vh;
position: fixed;
left: 0;
top: 0;
background-color: ${cv('nav-bg')};
border-right: 1px solid ${cv('border')};
padding: 1.5rem;
z-index: ${zIndex.sticky};`,
      category: 'components',
    },
    {
      name: 'ui-sidebar-rail',
      css: `width: 4.5rem;
height: 100vh;
position: fixed;
left: 0;
top: 0;
display: flex;
flex-direction: column;
align-items: center;
padding: 1.25rem 0.5rem;
gap: 1rem;
background-color: ${cv('nav-bg')};
border-right: 1px solid ${cv('border')};
z-index: ${zIndex.sticky};`,
      category: 'components',
    },

    // --- Page Shell & Layout Primitives ---
    {
      name: 'ui-page-shell',
      css: `display: flex;
min-height: 100vh;
background-color: ${cv('background')};
color: ${cv('text')};`,
      category: 'components',
    },
    {
      name: 'ui-page-main',
      css: `flex: 1;
display: flex;
flex-direction: column;
min-width: 0;
min-height: 100vh;
overflow-y: auto;`,
      category: 'components',
    },
    {
      name: 'ui-page-header',
      css: `display: flex;
align-items: center;
justify-content: space-between;
flex-wrap: wrap;
gap: 1rem;
padding: 1.5rem 2rem;
border-bottom: 1px solid ${cv('border')};
background-color: ${cv('surface')};`,
      category: 'components',
    },
    {
      name: 'ui-page-title',
      css: `font-size: 1.5rem;
font-weight: 700;
color: ${cv('text')};
margin: 0;
line-height: 1.25;`,
      category: 'components',
    },
    {
      name: 'ui-page-subtitle',
      css: `font-size: 0.875rem;
color: ${cv('text-muted')};
margin-top: 0.25rem;`,
      category: 'components',
    },
    {
      name: 'ui-page-actions',
      css: `display: flex;
align-items: center;
gap: 0.75rem;`,
      category: 'components',
    },
    {
      name: 'ui-page-content',
      css: `flex: 1;
padding: 2rem;
display: flex;
flex-direction: column;
gap: 1.5rem;`,
      category: 'components',
    },

    // --- Analytics & KPI Dashboard Primitives ---
    {
      name: 'ui-kpi-grid',
      css: `display: grid;
grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
gap: 1.25rem;
width: 100%;`,
      category: 'components',
    },
    {
      name: 'ui-kpi-card',
      css: `background-color: ${cv('surface')};
border: 1px solid ${cv('border')};
border-radius: ${radius['xl']};
padding: 1.25rem;
box-shadow: ${shadows.sm};
display: flex;
flex-direction: column;
gap: 0.375rem;`,
      category: 'components',
    },
    {
      name: 'ui-kpi-value',
      css: `font-size: 1.875rem;
font-weight: 700;
color: ${cv('text')};
line-height: 1.2;`,
      category: 'components',
    },
    {
      name: 'ui-kpi-label',
      css: `font-size: 0.875rem;
font-weight: 500;
color: ${cv('text-muted')};`,
      category: 'components',
    },
    {
      name: 'ui-kpi-trend',
      css: `display: inline-flex;
align-items: center;
gap: 0.25rem;
font-size: 0.75rem;
font-weight: 600;`,
      category: 'components',
    },

    // --- Empty State ---
    {
      name: 'ui-empty-state',
      css: `display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
text-align: center;
padding: 3.5rem 1.5rem;
border: 2px dashed ${cv('border-strong')};
border-radius: ${radius['xl']};
background-color: ${cv('surface')};`,
      category: 'components',
    },
    {
      name: 'ui-empty-state-icon',
      css: `font-size: 2.5rem;
margin-bottom: 1rem;
color: ${cv('text-muted')};
display: flex;
align-items: center;
justify-content: center;`,
      category: 'components',
    },
    {
      name: 'ui-empty-state-title',
      css: `font-size: 1.125rem;
font-weight: 600;
color: ${cv('text')};
margin: 0 0 0.5rem 0;`,
      category: 'components',
    },
    {
      name: 'ui-empty-state-desc',
      css: `font-size: 0.875rem;
color: ${cv('text-muted')};
max-width: 24rem;
margin: 0 0 1.5rem 0;
line-height: 1.5;`,
      category: 'components',
    },

    // --- Dividers ---
    {
      name: 'ui-divider',
      css: `height: 1px;
width: 100%;
background-color: ${cv('border')};
margin: 1.5rem 0;
border: none;`,
      category: 'components',
    },
    {
      name: 'ui-divider-vertical',
      css: `width: 1px;
height: 100%;
min-height: 1.5rem;
background-color: ${cv('border')};
margin: 0 1rem;
border: none;`,
      category: 'components',
    },
    {
      name: 'ui-section-header',
      css: `display: flex;
align-items: center;
justify-content: space-between;
padding-bottom: 0.75rem;
margin-bottom: 1rem;
border-bottom: 1px solid ${cv('border')};`,
      category: 'components',
    },

    // --- UI Elements ---
    {
      name: 'ui-search-box',
      css: `display: flex;
align-items: center;
background-color: ${cv('input-bg')};
border: 1px solid ${cv('input-border')};
border-radius: ${radius['md']};
padding: 0.25rem 0.75rem;
gap: 0.5rem;
transition: border-color 0.2s ease;`,
      category: 'components',
    },
    {
      name: 'ui-search-input',
      css: `border: none;
background: transparent;
outline: none;
color: ${cv('input-text')};
font-size: 0.875rem;
width: 100%;`,
      category: 'components',
    },
    {
      name: 'ui-status-bar',
      css: `position: fixed;
bottom: 0;
left: 0;
right: 0;
height: 2rem;
background-color: ${cv('nav-bg')};
border-top: 1px solid ${cv('border')};
display: flex;
align-items: center;
padding: 0 1rem;
font-size: 0.75rem;
color: ${cv('text-muted')};
z-index: ${zIndex.sticky};`,
      category: 'components',
    },
    {
      name: 'ui-profile-card',
      css: `display: flex;
align-items: center;
gap: 0.75rem;
padding: 0.5rem;
border-radius: ${radius['md']};
transition: background-color 0.2s ease;
cursor: pointer;`,
      category: 'components',
    },

    // --- Header Modifiers ---
    {
      name: 'ui-header-sticky',
      css: `position: sticky;
top: 0;
z-index: ${zIndex.sticky};`,
      category: 'components',
    },
    {
      name: 'ui-header-transparent',
      css: `background-color: transparent;
border-bottom: none;`,
      category: 'components',
    },
  ];
}
