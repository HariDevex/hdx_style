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

  const outline = (name, key) => ({
    name: `btn-outline-${name}`,
    css: `background-color: transparent;
color: ${cv(key)};
border-color: ${cv(key)};`,
    states: [
      {
        selector: ':hover',
        css: `background-color: ${cv(key)};
color: ${cv('on-accent')};`,
      },
      {
        selector: ':active',
        css: `background-color: ${cv(`${key}-active`)};
color: ${cv('on-accent')};`,
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
      states: [
        {
          selector: ':focus-visible',
          css: `outline: 2px solid ${cv('primary')};
outline-offset: 2px;`,
        },
        {
          selector: ':disabled',
          css: `opacity: 0.5;
pointer-events: none;
cursor: not-allowed;
box-shadow: none;`,
        },
        {
          selector: '[aria-disabled="true"]',
          css: `opacity: 0.5;
pointer-events: none;
cursor: not-allowed;
box-shadow: none;`,
        },
      ],
      category: 'components',
    },

    // Variants (solid variants carry :hover/:active states)
    solid('primary', 'primary'),
    solid('secondary', 'secondary'),
    solid('success', 'success'),
    solid('danger', 'danger'),
    solid('warning', 'warning'),
    solid('info', 'info'),

    // Outline variants
    {
      name: 'btn-outline',
      css: `background-color: transparent;
color: ${cv('text')};
border-color: ${cv('border-strong')};`,
      states: [
        {
          selector: ':hover',
          css: `background-color: ${cv('surface-secondary')};`,
        },
      ],
      category: 'components',
    },
    outline('primary', 'primary'),
    outline('secondary', 'secondary'),
    outline('success', 'success'),
    outline('danger', 'danger'),
    outline('warning', 'warning'),
    outline('info', 'info'),

    // Ghost & Link
    {
      name: 'btn-ghost',
      css: `background-color: transparent;
color: ${cv('text')};
border-color: transparent;`,
      states: [
        {
          selector: ':hover',
          css: `background-color: ${cv('surface-secondary')};`,
        },
      ],
      category: 'components',
    },
    {
      name: 'btn-link',
      css: `background-color: transparent;
border-color: transparent;
color: ${cv('primary')};
text-decoration: underline;
text-underline-offset: 4px;
padding: 0;`,
      states: [
        {
          selector: ':hover',
          css: `color: ${cv('primary-hover')};`,
        },
      ],
      category: 'components',
    },
    {
      name: 'btn-pill',
      css: `border-radius: ${radius.full};`,
      category: 'components',
    },

    // Sizes
    {
      name: 'btn-xs',
      css: `padding: 0.25rem 0.5rem;
font-size: ${fontSize.xs};
border-radius: ${radius.sm};`,
      category: 'components',
    },
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
    {
      name: 'btn-xl',
      css: `padding: 0.75rem 1.75rem;
font-size: ${fontSize.lg};
border-radius: ${radius.xl};`,
      category: 'components',
    },

    // Icon button
    {
      name: 'btn-icon',
      css: `padding: 0.5rem;
aspect-ratio: 1;`,
      category: 'components',
    },

    // Button Groups
    {
      name: 'btn-group',
      css: `display: inline-flex;
vertical-align: middle;
border-radius: ${radius.lg};`,
      category: 'components',
    },
    {
      name: 'btn-group-vertical',
      css: `display: inline-flex;
flex-direction: column;
vertical-align: middle;
border-radius: ${radius.lg};`,
      category: 'components',
    },
  ];
}
