import { colorVariable } from '../generator/resolver.js';

/**
 * Toast component definitions
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').ComponentDefinition[]}
 */
export function toastComponents(config) {
  const prefix = config.prefix;
  const { radius, shadows, zIndex } = config.theme;
  const cv = (key) => colorVariable(key, prefix);

  return [
    {
      name: 'toast-container',
      css: `position: fixed;
top: 1rem;
right: 1rem;
display: flex;
flex-direction: column;
gap: 0.5rem;
z-index: ${zIndex.overlay};`,
      category: 'components',
    },
    {
      name: 'toast',
      css: `background-color: ${cv('toast-bg')};
color: ${cv('toast-text')};
padding: 0.75rem 1rem;
border-radius: ${radius['md']};
box-shadow: ${shadows.md};
font-size: 0.875rem;
display: flex;
align-items: center;
gap: 0.5rem;
min-width: 200px;
max-width: 350px;
animation: hdx-slide-in 0.3s ease-out;`,
      category: 'components',
    },
    {
      name: 'toast-success',
      css: `border-left: 4px solid ${cv('success')};`,
      category: 'components',
    },
    {
      name: 'toast-danger',
      css: `border-left: 4px solid ${cv('danger')};`,
      category: 'components',
    },
    {
      name: 'toast-warning',
      css: `border-left: 4px solid ${cv('warning')};`,
      category: 'components',
    },
    {
      name: 'toast-info',
      css: `border-left: 4px solid ${cv('info')};`,
      category: 'components',
    },
  ];
}
