import { colorVariable } from '../generator/resolver.js';

/**
 * Badge component definitions
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').ComponentDefinition[]}
 */
export function badgeComponents(config) {
  const prefix = config.prefix;
  const { fontSize, radius } = config.theme;
  const cv = (key) => colorVariable(key, prefix);

  const baseBadge = `display: inline-flex;
align-items: center;
gap: 0.25rem;
white-space: nowrap;
border-radius: ${radius.full};
font-weight: 500;
font-size: ${fontSize.xs};
line-height: 1;
padding: 0.25rem 0.625rem;`;

  const solid = (name, key) => ({
    name: `badge-${name}`,
    css: baseBadge + `\nbackground-color: ${cv(key)};\ncolor: ${cv('on-accent')};`,
    category: 'components',
  });

  const outline = (name, key) => ({
    name: `badge-outline-${name}`,
    css: baseBadge + `\nbackground-color: transparent;\nborder: 1px solid ${cv(key)};\ncolor: ${cv(key)};`,
    category: 'components',
  });

  const soft = (name, key) => ({
    name: `badge-soft-${name}`,
    css: baseBadge + `\nbackground-color: ${cv('surface-secondary')};\nborder: 1px solid ${cv('border')};\ncolor: ${cv(key)};`,
    category: 'components',
  });

  return [
    // Base & Default
    { name: 'badge', css: baseBadge + `\nbackground-color: ${cv('surface-secondary')};\ncolor: ${cv('text-secondary')};`, category: 'components' },

    // Solid variants
    solid('primary', 'primary'),
    solid('secondary', 'secondary'),
    solid('success', 'success'),
    solid('danger', 'danger'),
    solid('warning', 'warning'),
    solid('info', 'info'),

    // Outline variants
    { name: 'badge-outline', css: baseBadge + `\nbackground-color: transparent;\nborder: 1px solid ${cv('border-strong')};\ncolor: ${cv('text')};`, category: 'components' },
    outline('primary', 'primary'),
    outline('secondary', 'secondary'),
    outline('success', 'success'),
    outline('danger', 'danger'),
    outline('warning', 'warning'),
    outline('info', 'info'),

    // Soft / Subtle variants
    soft('primary', 'primary'),
    soft('secondary', 'secondary'),
    soft('success', 'success'),
    soft('danger', 'danger'),
    soft('warning', 'warning'),
    soft('info', 'info'),

    // Sizes
    { name: 'badge-xs', css: `padding: 0.125rem 0.375rem;\nfont-size: 0.625rem;`, category: 'components' },
    { name: 'badge-sm', css: `padding: 0.1875rem 0.5rem;\nfont-size: 0.6875rem;`, category: 'components' },
    { name: 'badge-md', css: `padding: 0.25rem 0.625rem;\nfont-size: ${fontSize.xs};`, category: 'components' },
    { name: 'badge-lg', css: `padding: 0.35rem 0.75rem;\nfont-size: ${fontSize.sm};`, category: 'components' },

    // Shapes & Special Types
    { name: 'badge-rounded', css: `border-radius: ${radius.md};`, category: 'components' },
    {
      name: 'badge-dot',
      css: `display: inline-flex;
align-items: center;
gap: 0.375rem;`,
      category: 'components',
    },
    {
      name: 'badge-count',
      css: `display: inline-flex;
align-items: center;
justify-content: center;
min-width: 1.25rem;
height: 1.25rem;
padding: 0 0.375rem;
border-radius: ${radius.full};
font-size: 0.6875rem;
line-height: 1;`,
      category: 'components',
    },
  ];
}
