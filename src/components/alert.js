import { colorVariable } from '../generator/resolver.js';

/**
 * Alert component definitions
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').ComponentDefinition[]}
 */
export function alertComponents(config) {
  const prefix = config.prefix;
  const { fontSize, radius } = config.theme;
  const cv = (key) => colorVariable(key, prefix);

  const baseAlert = `display: flex;
align-items: flex-start;
gap: 0.75rem;
padding: 1rem;
border-radius: ${radius.lg};
font-size: ${fontSize.sm};
line-height: 1.5;`;

  return [
    { name: 'alert', css: baseAlert + `\nbackground-color: ${cv('info')};\ncolor: ${cv('white')};`, category: 'components' },
    { name: 'alert-success', css: baseAlert + `\nbackground-color: ${cv('success')};\ncolor: ${cv('white')};`, category: 'components' },
    { name: 'alert-danger', css: baseAlert + `\nbackground-color: ${cv('danger')};\ncolor: ${cv('white')};`, category: 'components' },
    { name: 'alert-warning', css: baseAlert + `\nbackground-color: ${cv('warning')};\ncolor: ${cv('white')};`, category: 'components' },
    { name: 'alert-info', css: baseAlert + `\nbackground-color: ${cv('info')};\ncolor: ${cv('white')};`, category: 'components' },
  ];
}
