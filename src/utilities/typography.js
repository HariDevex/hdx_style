import { defaultFontFamily } from '../theme/defaults.js';

/**
 * Typography utilities
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').UtilityDefinition[]}
 */
export function typographyUtilities(config) {
  const { fontSize, fontWeight, lineHeight, letterSpacing } = config.theme;
  const utils = [];

  // Font size
  for (const [key, value] of Object.entries(fontSize)) {
    utils.push({ name: `text-${key}`, property: 'font-size', value, category: 'typography' });
  }

  // Font weight
  for (const [key, value] of Object.entries(fontWeight)) {
    utils.push({ name: `font-${key}`, property: 'font-weight', value, category: 'typography' });
  }

  // Line height
  for (const [key, value] of Object.entries(lineHeight)) {
    utils.push({ name: `leading-${key}`, property: 'line-height', value, category: 'typography' });
  }

  // Letter spacing
  for (const [key, value] of Object.entries(letterSpacing)) {
    utils.push({ name: `tracking-${key}`, property: 'letter-spacing', value, category: 'typography' });
  }

  // Font families
  utils.push(
    { name: 'font-sans', property: 'font-family', value: defaultFontFamily, category: 'typography' },
    { name: 'font-serif', property: 'font-family', value: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif', category: 'typography' },
    { name: 'font-mono', property: 'font-family', value: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace', category: 'typography' },
  );

  // Text alignment
  utils.push(
    { name: 'text-left', property: 'text-align', value: 'left', category: 'typography' },
    { name: 'text-center', property: 'text-align', value: 'center', category: 'typography' },
    { name: 'text-right', property: 'text-align', value: 'right', category: 'typography' },
    { name: 'text-justify', property: 'text-align', value: 'justify', category: 'typography' },
    { name: 'text-start', property: 'text-align', value: 'start', category: 'typography' },
    { name: 'text-end', property: 'text-align', value: 'end', category: 'typography' },
  );

  // Text transform
  utils.push(
    { name: 'uppercase', property: 'text-transform', value: 'uppercase', category: 'typography' },
    { name: 'lowercase', property: 'text-transform', value: 'lowercase', category: 'typography' },
    { name: 'capitalize', property: 'text-transform', value: 'capitalize', category: 'typography' },
    { name: 'normal-case', property: 'text-transform', value: 'none', category: 'typography' },
  );

  // Font style
  utils.push(
    { name: 'italic', property: 'font-style', value: 'italic', category: 'typography' },
    { name: 'not-italic', property: 'font-style', value: 'normal', category: 'typography' },
  );

  // Text decoration
  utils.push(
    { name: 'underline', property: 'text-decoration-line', value: 'underline', category: 'typography' },
    { name: 'overline', property: 'text-decoration-line', value: 'overline', category: 'typography' },
    { name: 'line-through', property: 'text-decoration-line', value: 'line-through', category: 'typography' },
    { name: 'no-underline', property: 'text-decoration-line', value: 'none', category: 'typography' },
  );

  // Text overflow
  utils.push(
    { name: 'truncate', property: 'overflow', value: 'hidden', category: 'typography' },
    { name: 'text-ellipsis', property: 'text-overflow', value: 'ellipsis', category: 'typography' },
    { name: 'text-clip', property: 'text-overflow', value: 'clip', category: 'typography' },
  );

  // Whitespace
  utils.push(
    { name: 'whitespace-normal', property: 'white-space', value: 'normal', category: 'typography' },
    { name: 'whitespace-nowrap', property: 'white-space', value: 'nowrap', category: 'typography' },
    { name: 'whitespace-pre', property: 'white-space', value: 'pre', category: 'typography' },
    { name: 'whitespace-pre-line', property: 'white-space', value: 'pre-line', category: 'typography' },
    { name: 'whitespace-pre-wrap', property: 'white-space', value: 'pre-wrap', category: 'typography' },
    { name: 'break-normal', property: 'overflow-wrap', value: 'normal', category: 'typography' },
    { name: 'break-words', property: 'overflow-wrap', value: 'break-word', category: 'typography' },
    { name: 'break-all', property: 'word-break', value: 'break-all', category: 'typography' },
    { name: 'break-keep', property: 'word-break', value: 'keep-all', category: 'typography' },
  );

  // Leading (override for specific pixel/rem values)
  utils.push(
    { name: 'leading-3', property: 'line-height', value: '.75rem', category: 'typography' },
    { name: 'leading-4', property: 'line-height', value: '1rem', category: 'typography' },
    { name: 'leading-5', property: 'line-height', value: '1.25rem', category: 'typography' },
    { name: 'leading-6', property: 'line-height', value: '1.5rem', category: 'typography' },
    { name: 'leading-7', property: 'line-height', value: '1.75rem', category: 'typography' },
    { name: 'leading-8', property: 'line-height', value: '2rem', category: 'typography' },
    { name: 'leading-9', property: 'line-height', value: '2.25rem', category: 'typography' },
    { name: 'leading-10', property: 'line-height', value: '2.5rem', category: 'typography' },
  );

  return utils;
}
