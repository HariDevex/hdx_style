import { colorVariable } from '../generator/resolver.js';

/**
 * Skeleton loader component definitions
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').ComponentDefinition[]}
 */
export function skeletonComponents(config) {
  const prefix = config.prefix;
  const { radius } = config.theme;
  const cv = (key) => colorVariable(key, prefix);
  const animPrefix = prefix.replace(/_/g, '-').replace(/-$/, '');

  return [
    {
      name: 'skeleton',
      css: `display: block;
background-color: ${cv('surface-secondary')};
border-radius: ${radius.md};
animation: ${animPrefix}-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;`,
      category: 'components',
    },
    {
      name: 'skeleton-text',
      css: `display: block;
height: 1rem;
width: 100%;
margin-bottom: 0.5rem;
background-color: ${cv('surface-secondary')};
border-radius: ${radius.sm};
animation: ${animPrefix}-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;`,
      category: 'components',
    },
    {
      name: 'skeleton-avatar',
      css: `display: inline-block;
width: 2.5rem;
height: 2.5rem;
border-radius: ${radius.full};
flex-shrink: 0;
background-color: ${cv('surface-secondary')};
animation: ${animPrefix}-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;`,
      category: 'components',
    },
    {
      name: 'skeleton-button',
      css: `display: inline-block;
height: 2.25rem;
width: 6rem;
border-radius: ${radius.lg};
background-color: ${cv('surface-secondary')};
animation: ${animPrefix}-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;`,
      category: 'components',
    },
    {
      name: 'skeleton-card',
      css: `display: block;
height: 12rem;
width: 100%;
border-radius: ${radius.xl};
background-color: ${cv('surface-secondary')};
animation: ${animPrefix}-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;`,
      category: 'components',
    },
  ];
}
