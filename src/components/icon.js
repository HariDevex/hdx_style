/**
 * Icon component definitions — sizing, coloring, and alignment wrapper
 * that any icon source (SVG, icon font, React icon library) plugs into.
 * Does NOT bundle artwork; only supplies the sizing/color contract.
 *
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').ComponentDefinition[]}
 */
export function iconComponents(config) {
  const { fontSize } = config.theme;

  return [
    // Base icon wrapper — inline-flex container for SVGs or icon-font glyphs.
    // Uses currentColor so the icon inherits text color from a parent.
    {
      name: 'ui-icon',
      css: `display: inline-flex;
align-items: center;
justify-content: center;
width: 1em;
height: 1em;
flex-shrink: 0;
color: currentColor;
vertical-align: middle;`,
      category: 'components',
    },

    // Size variants — keyed off spacing/fontSize tokens for theme consistency.
    {
      name: 'ui-icon-xs',
      css: `width: ${fontSize.xs};
height: ${fontSize.xs};`,
      category: 'components',
    },
    {
      name: 'ui-icon-sm',
      css: `width: ${fontSize.sm};
height: ${fontSize.sm};`,
      category: 'components',
    },
    {
      name: 'ui-icon-lg',
      css: `width: ${fontSize.xl};
height: ${fontSize.xl};`,
      category: 'components',
    },
    {
      name: 'ui-icon-xl',
      css: `width: ${fontSize['2xl']};
height: ${fontSize['2xl']};`,
      category: 'components',
    },

    // Spinning icon for loading indicators.
    // 600ms matches the existing ui-btn-spinner animation duration.
    {
      name: 'ui-icon-spin',
      css: `animation: hdx-spin 600ms linear infinite;`,
      category: 'components',
    },
  ];
}
