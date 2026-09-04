import { colorVariable } from '../generator/resolver.js';

/**
 * Card component definitions
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').ComponentDefinition[]}
 */
export function cardComponents(config) {
  const prefix = config.prefix;
  const { radius, shadows } = config.theme;
  const cv = (key) => colorVariable(key, prefix);

  return [
    {
      name: 'card',
      css: `background-color: ${cv('surface')};
border: 1px solid ${cv('border')};
border-radius: ${radius.xl};
box-shadow: ${shadows.sm};
padding: 1.5rem;`,
      category: 'components',
    },
    {
      name: 'card-header',
      css: `padding-bottom: 1rem;
border-bottom: 1px solid ${cv('border')};
margin-bottom: 1rem;`,
      category: 'components',
    },
    {
      name: 'card-body',
      css: `flex: 1;
padding: 0;`,
      category: 'components',
    },
    {
      name: 'card-footer',
      css: `padding-top: 1rem;
border-top: 1px solid ${cv('border')};
margin-top: 1rem;`,
      category: 'components',
    },
  ];
}
