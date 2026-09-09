import { colorVariable } from '../generator/resolver.js';

/**
 * Button component definitions
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').ComponentDefinition[]}
 */
export function buttonComponents(config) {
  const prefix = config.prefix;
  const { fontSize, radius } = config.theme;

  const cv = (key) => colorVariable(key, prefix);

  // Solid variants are interactive: each gets :hover and :active states that
  // resolve the matching -hover/-active tokens from the theme (so user color
  // overrides flow through the CSS variable, not baked-in hex values).
  const solid = (name, key) => ({
    name: `btn-${name}`,
    css: `background-color: ${cv(key)};
color: ${cv('on-accent')};
border-color: ${cv(key)};`,
    states: [
      {
        selector: ':hover',
        css: `background-color: ${cv(`${key}-hover`)};
color: ${cv('on-accent')};
border-color: ${cv(`${key}-hover`)};`,
      },
      {
        selector: ':active',
        css: `background-color: ${cv(`${key}-active`)};
color: ${cv('on-accent')};
border-color: ${cv(`${key}-active`)};`,
      },
    ],
    category: 'components',
  });

  return [
    // Base button
    {
      name: 'btn',
      css: `display: inline-flex;
align-items: center;
justify-content: center;
gap: 0.5rem;
white-space: nowrap;
border-radius: ${radius.lg};
font-weight: 500;
font-size: ${fontSize.sm};
line-height: 1.5;
padding: 0.5rem 1rem;
transition: color 150ms ease, background-color 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
cursor: pointer;
user-select: none;
border: 1px solid transparent;
outline: none;`,
      category: 'components',
    },

    // Variants (solid variants carry :hover/:active states)
    solid('primary', 'primary'),
    solid('secondary', 'secondary'),
    solid('success', 'success'),
    solid('danger', 'danger'),
    solid('warning', 'warning'),
    solid('info', 'info'),
    {
      name: 'btn-outline',
      css: `background-color: transparent;
color: ${cv('text')};
border-color: ${cv('border-strong')};`,
      category: 'components',
    },
    {
      name: 'btn-ghost',
      css: `background-color: transparent;
color: ${cv('text')};
border-color: transparent;`,
      category: 'components',
    },

    // Sizes
    {
      name: 'btn-sm',
      css: `padding: 0.375rem 0.75rem;
font-size: ${fontSize.xs};
border-radius: ${radius.md};`,
      category: 'components',
    },
    {
      name: 'btn-md',
      css: `padding: 0.5rem 1rem;
font-size: ${fontSize.sm};
border-radius: ${radius.lg};`,
      category: 'components',
    },
    {
      name: 'btn-lg',
      css: `padding: 0.625rem 1.25rem;
font-size: ${fontSize.base};
border-radius: ${radius.lg};`,
      category: 'components',
    },

    // Icon button
    {
      name: 'btn-icon',
      css: `padding: 0.5rem;
aspect-ratio: 1;`,
      category: 'components',
    },
  ];
}
