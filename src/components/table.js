import { colorVariable } from '../generator/resolver.js';

/**
 * Table component definitions
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').ComponentDefinition[]}
 */
export function tableComponents(config) {
  const prefix = config.prefix;
  const { fontSize, radius } = config.theme;
  const cv = (key) => colorVariable(key, prefix);

  return [
    {
      name: 'table',
      css: `width: 100%;
border-collapse: collapse;
font-size: ${fontSize.sm};
text-align: left;`,
      category: 'components',
    },
    {
      name: 'table-header',
      css: `background-color: ${cv('surface-secondary')};
border-bottom: 1px solid ${cv('border')};
font-weight: 600;
color: ${cv('text-secondary')};`,
      category: 'components',
    },
    {
      name: 'table-cell',
      css: `padding: 0.75rem 1rem;
border-bottom: 1px solid ${cv('border')};`,
      category: 'components',
    },
    {
      name: 'table-row',
      css: `transition: background-color 150ms ease;`,
      category: 'components',
    },
    {
      name: 'table-container',
      css: `overflow-x: auto;
border: 1px solid ${cv('border')};
border-radius: ${radius.lg};`,
      category: 'components',
    },
  ];
}
