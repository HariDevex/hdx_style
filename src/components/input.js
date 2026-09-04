import { colorVariable } from '../generator/resolver.js';

/**
 * Input component definitions
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').ComponentDefinition[]}
 */
export function inputComponents(config) {
  const prefix = config.prefix;
  const { fontSize, radius } = config.theme;
  const cv = (key) => colorVariable(key, prefix);

  const baseInput = `display: block;
width: 100%;
padding: 0.5rem 0.75rem;
font-size: ${fontSize.sm};
line-height: 1.5;
color: ${cv('text')};
background-color: ${cv('surface')};
border: 1px solid ${cv('border')};
border-radius: ${radius.lg};
transition: border-color 150ms ease, box-shadow 150ms ease;
outline: none;`;

  return [
    {
      name: 'input',
      css: baseInput,
      category: 'components',
    },
    {
      name: 'input-focus',
      css: baseInput + `\nborder-color: ${cv('primary')};
box-shadow: 0 0 0 3px ${cv('primary')};`,
      category: 'components',
    },
    {
      name: 'input-error',
      css: baseInput + `\nborder-color: ${cv('danger')};
box-shadow: 0 0 0 3px ${cv('danger')};`,
      category: 'components',
    },
    {
      name: 'select',
      css: baseInput + `\nappearance: none;
background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
background-position: right 0.5rem center;
background-repeat: no-repeat;
background-size: 1.5em 1.5em;
padding-right: 2.5rem;`,
      category: 'components',
    },
    {
      name: 'textarea',
      css: baseInput + `\nmin-height: 5rem;
resize: vertical;`,
      category: 'components',
    },
    {
      name: 'checkbox',
      css: `display: inline-flex;
align-items: center;
justify-content: center;
width: 1rem;
height: 1rem;
border: 1px solid ${cv('border-strong')};
border-radius: ${radius.sm};
background-color: ${cv('surface')};
transition: background-color 150ms ease, border-color 150ms ease;
cursor: pointer;`,
      category: 'components',
    },
    {
      name: 'radio',
      css: `display: inline-flex;
align-items: center;
justify-content: center;
width: 1rem;
height: 1rem;
border: 1px solid ${cv('border-strong')};
border-radius: 9999px;
background-color: ${cv('surface')};
transition: background-color 150ms ease, border-color 150ms ease;
cursor: pointer;`,
      category: 'components',
    },
    {
      name: 'label',
      css: `display: block;
font-size: ${fontSize.sm};
font-weight: 500;
color: ${cv('text')};
margin-bottom: 0.25rem;`,
      category: 'components',
    },
  ];
}
