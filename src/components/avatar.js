import { colorVariable } from '../generator/resolver.js';

/**
 * Avatar component definitions
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').ComponentDefinition[]}
 */
export function avatarComponents(config) {
  const prefix = config.prefix;
  const { radius } = config.theme;
  const cv = (key) => colorVariable(key, prefix);

  return [
    {
      name: 'avatar',
      css: `display: inline-flex;
align-items: center;
justify-content: center;
width: 2.5rem;
height: 2.5rem;
border-radius: ${radius.full};
background-color: ${cv('primary')};
color: ${cv('white')};
font-weight: 600;
font-size: 0.875rem;
overflow: hidden;`,
      category: 'components',
    },
    {
      name: 'avatar-sm',
      css: `width: 2rem;
height: 2rem;
font-size: 0.75rem;`,
      category: 'components',
    },
    {
      name: 'avatar-lg',
      css: `width: 3rem;
height: 3rem;
font-size: 1rem;`,
      category: 'components',
    },
    {
      name: 'avatar-xl',
      css: `width: 4rem;
height: 4rem;
font-size: 1.25rem;`,
      category: 'components',
    },
    {
      name: 'avatar-group',
      css: `display: flex;
flex-direction: row-reverse;
justify-content: flex-end;`,
      category: 'components',
    },
  ];
}
