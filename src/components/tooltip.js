import { colorVariable } from '../generator/resolver.js';

/**
 * Tooltip component definitions
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').ComponentDefinition[]}
 */
export function tooltipComponents(config) {
  const prefix = config.prefix;
  const { radius, shadows, zIndex } = config.theme;
  const cv = (key) => colorVariable(key, prefix);

  return [
    {
      name: 'tooltip-container',
      css: `position: relative;
display: inline-block;`,
      category: 'components',
    },
    {
      name: 'tooltip',
      css: `position: absolute;
bottom: 125%;
left: 50%;
transform: translateX(-50%);
background-color: ${cv('toast-bg')};
color: ${cv('toast-text')};
padding: 0.25rem 0.5rem;
border-radius: ${radius['sm']};
font-size: 0.75rem;
white-space: nowrap;
z-index: ${zIndex.overlay};
opacity: 0;
pointer-events: none;
transition: opacity 0.2s ease;
box-shadow: ${shadows.sm};`,
      category: 'components',
    },
    {
      name: 'tooltip-visible',
      css: `opacity: 1;`,
      category: 'components',
    },
    {
      name: 'tooltip-arrow',
      css: `position: absolute;
top: 100%;
left: 50%;
transform: translateX(-50%);
border-width: 5px;
border-style: solid;
border-color: ${cv('toast-bg')} transparent transparent transparent;`,
      category: 'components',
    },
  ];
}
