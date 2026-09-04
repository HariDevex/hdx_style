/**
 * Transition utilities (dynamic from theme)
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').UtilityDefinition[]}
 */
export function transitionsUtilities(config) {
  const { transitionDuration, transitionTiming } = config.theme;
  const utils = [];

  // Base transition
  utils.push(
    {
      name: 'transition',
      property: 'transition-property',
      value: 'color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter',
      category: 'transitions',
    },
    { name: 'transition-none', property: 'transition-property', value: 'none', category: 'transitions' },
    { name: 'transition-all', property: 'transition-property', value: 'all', category: 'transitions' },
    { name: 'transition-colors', property: 'transition-property', value: 'color, background-color, border-color, text-decoration-color, fill, stroke', category: 'transitions' },
    { name: 'transition-opacity', property: 'transition-property', value: 'opacity', category: 'transitions' },
    { name: 'transition-shadow', property: 'transition-property', value: 'box-shadow', category: 'transitions' },
    { name: 'transition-transform', property: 'transition-property', value: 'transform', category: 'transitions' },
  );

  // Duration
  for (const [key, value] of Object.entries(transitionDuration)) {
    utils.push({
      name: `duration-${key}`,
      property: 'transition-duration',
      value,
      category: 'transitions',
    });
  }

  // Timing function
  for (const [key, value] of Object.entries(transitionTiming)) {
    utils.push({
      name: `ease-${key}`,
      property: 'transition-timing-function',
      value,
      category: 'transitions',
    });
  }

  // Delay
  for (const [key, value] of Object.entries(transitionDuration)) {
    utils.push({
      name: `delay-${key}`,
      property: 'transition-delay',
      value,
      category: 'transitions',
    });
  }

  return utils;
}
