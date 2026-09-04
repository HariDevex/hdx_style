import { colorVariable } from '../generator/resolver.js';

/**
 * Modal component definitions
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').ComponentDefinition[]}
 */
export function modalComponents(config) {
  const prefix = config.prefix;
  const { radius, shadows } = config.theme;
  const cv = (key) => colorVariable(key, prefix);

  return [
    {
      name: 'modal-overlay',
      css: `position: fixed;
inset: 0;
background-color: rgba(0, 0, 0, 0.5);
display: flex;
align-items: center;
justify-content: center;
z-index: 50;
padding: 1rem;`,
      category: 'components',
    },
    {
      name: 'modal',
      css: `background-color: ${cv('surface')};
border-radius: ${radius['2xl']};
box-shadow: ${shadows.xl};
width: 100%;
max-width: 28rem;
max-height: calc(100vh - 2rem);
overflow: auto;
padding: 1.5rem;`,
      category: 'components',
    },
    {
      name: 'modal-header',
      css: `display: flex;
align-items: center;
justify-content: space-between;
margin-bottom: 1rem;
padding-bottom: 1rem;
border-bottom: 1px solid ${cv('border')};`,
      category: 'components',
    },
    {
      name: 'modal-body',
      css: `margin-bottom: 1.5rem;`,
      category: 'components',
    },
    {
      name: 'modal-footer',
      css: `display: flex;
align-items: center;
justify-content: flex-end;
gap: 0.75rem;
padding-top: 1rem;
border-top: 1px solid ${cv('border')};`,
      category: 'components',
    },
  ];
}
