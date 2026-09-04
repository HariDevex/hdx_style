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
white-space: nowrap;
border-radius: ${radius.full};
font-weight: 500;
font-size: ${fontSize.xs};
line-height: 1;
padding: 0.25rem 0.625rem;`;

  return [
    { name: 'badge', css: baseBadge + `\nbackground-color: ${cv('surface-secondary')};\ncolor: ${cv('text-secondary')};`, category: 'components' },
    { name: 'badge-primary', css: baseBadge + `\nbackground-color: ${cv('primary')};\ncolor: ${cv('white')};`, category: 'components' },
    { name: 'badge-success', css: baseBadge + `\nbackground-color: ${cv('success')};\ncolor: ${cv('white')};`, category: 'components' },
    { name: 'badge-danger', css: baseBadge + `\nbackground-color: ${cv('danger')};\ncolor: ${cv('white')};`, category: 'components' },
    { name: 'badge-warning', css: baseBadge + `\nbackground-color: ${cv('warning')};\ncolor: ${cv('white')};`, category: 'components' },
    { name: 'badge-info', css: baseBadge + `\nbackground-color: ${cv('info')};\ncolor: ${cv('white')};`, category: 'components' },
    { name: 'badge-outline', css: baseBadge + `\nbackground-color: transparent;\nborder: 1px solid ${cv('border-strong')};\ncolor: ${cv('text')};`, category: 'components' },
  ];
}
