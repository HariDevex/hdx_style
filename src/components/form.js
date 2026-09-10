import { colorVariable } from '../generator/resolver.js';

/**
 * Form component definitions — switches, chips/tags, field groups with
 * label/hint/error text, and a floating-label pair.
 *
 * Note: switches and floating labels keep the HDX contract of "no shipped
 * JS" — the checked/floated state is a class the consumer toggles.
 *
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').ComponentDefinition[]}
 */
export function formComponents(config) {
  const prefix = config.prefix;
  const { fontSize, radius, shadows } = config.theme;
  const cv = (key) => colorVariable(key, prefix);

  return [
    // ── Toggle switch ───────────────────────────────────────────────────
    // Track + separately-positioned thumb. Compose both with the checked
    // modifiers when toggled on.
    {
      name: 'ui-switch',
      css: `display: inline-block;
position: relative;
width: 2.75rem;
height: 1.5rem;
background-color: ${cv('surface-secondary')};
border: 1px solid ${cv('border-strong')};
border-radius: ${radius.full};
cursor: pointer;
vertical-align: middle;
flex-shrink: 0;
transition: background-color 150ms ease, border-color 150ms ease;`,
      category: 'components',
    },
    {
      name: 'ui-switch-thumb',
      css: `position: absolute;
top: 0.125rem;
left: 0.125rem;
width: 1rem;
height: 1rem;
border-radius: ${radius.full};
background-color: ${cv('white')};
box-shadow: ${shadows.sm};
pointer-events: none;
transition: transform 150ms ease;`,
      category: 'components',
    },
    {
      name: 'ui-switch-checked',
      css: `background-color: ${cv('primary')};
border-color: ${cv('primary')};`,
      category: 'components',
    },
    {
      name: 'ui-switch-thumb-checked',
      css: `transform: translateX(1.375rem);`,
      category: 'components',
    },

    // ── Chip / tag ───────────────────────────────────────────────────────
    {
      name: 'ui-chip',
      css: `display: inline-flex;
align-items: center;
gap: 0.375rem;
padding: 0.25rem 0.625rem;
font-size: ${fontSize.xs};
font-weight: 500;
color: ${cv('text-secondary')};
background-color: ${cv('surface-secondary')};
border: 1px solid ${cv('border')};
border-radius: ${radius.full};
transition: border-color 150ms ease, color 150ms ease;`,
      states: [
        {
          selector: ':hover',
          css: `border-color: ${cv('border-strong')};
color: ${cv('text')};`,
        },
      ],
      category: 'components',
    },
    {
      name: 'ui-chip-close',
      css: `display: inline-flex;
align-items: center;
justify-content: center;
width: 1rem;
height: 1rem;
border-radius: ${radius.full};
font-size: 0.75rem;
line-height: 1;
color: ${cv('text-muted')};
cursor: pointer;
transition: color 150ms ease, background-color 150ms ease;`,
      states: [
        {
          selector: ':hover',
          css: `color: ${cv('text')};
background-color: ${cv('gray-200')};`,
        },
      ],
      category: 'components',
    },

    // ── Field group (label + control + hint/error) ─────────────────────
    {
      name: 'ui-form-group',
      css: `display: flex;
flex-direction: column;
gap: 0.375rem;
margin-bottom: 1rem;`,
      category: 'components',
    },
    {
      name: 'ui-form-label',
      css: `font-size: ${fontSize.sm};
font-weight: 500;
color: ${cv('text-secondary')};`,
      category: 'components',
    },
    {
      name: 'ui-form-hint',
      css: `font-size: ${fontSize.xs};
color: ${cv('text-muted')};`,
      category: 'components',
    },
    {
      name: 'ui-form-error',
      css: `font-size: ${fontSize.xs};
color: ${cv('danger')};`,
      category: 'components',
    },

    // ── Floating label ───────────────────────────────────────────────────
    // Compose with hdx-input inside a hdx-relative wrapper; the label sits
    // inside the control and floats up with ui-floating-label-active.
    {
      name: 'ui-floating-input',
      css: `padding-top: 1.25rem;
padding-bottom: 0.375rem;`,
      category: 'components',
    },
    {
      name: 'ui-floating-label',
      css: `position: absolute;
top: 0.625rem;
left: 0.75rem;
font-size: ${fontSize.sm};
color: ${cv('text-muted')};
pointer-events: none;
transition: all 150ms ease;`,
      category: 'components',
    },
    {
      name: 'ui-floating-label-active',
      css: `transform: translateY(-0.625rem) scale(0.8);
color: ${cv('text-secondary')};`,
      category: 'components',
    },
  ];
}