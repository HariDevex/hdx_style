import { colorVariable } from '../generator/resolver.js';

/**
 * Layout component definitions
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').ComponentDefinition[]}
 */
export function layoutComponents(config) {
  const prefix = config.prefix;
  const { radius, shadows, zIndex } = config.theme;
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
  ];
}
