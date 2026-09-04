/**
 * Flexbox utilities
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').UtilityDefinition[]}
 */
export function flexboxUtilities(config) {
  const utils = [];
  const props = {
    // Direction
    'flex-row': ['flex-direction', 'row'],
    'flex-row-reverse': ['flex-direction', 'row-reverse'],
    'flex-col': ['flex-direction', 'column'],
    'flex-col-reverse': ['flex-direction', 'column-reverse'],

    // Wrap
    'flex-wrap': ['flex-wrap', 'wrap'],
    'flex-wrap-reverse': ['flex-wrap', 'wrap-reverse'],
    'flex-nowrap': ['flex-wrap', 'nowrap'],

    // Flex grow/shrink
    'flex-1': ['flex', '1 1 0%'],
    'flex-auto': ['flex', '1 1 auto'],
    'flex-initial': ['flex', '0 1 auto'],
    'flex-none': ['flex', 'none'],
    grow: ['flex-grow', '1'],
    'grow-0': ['flex-grow', '0'],
    shrink: ['flex-shrink', '1'],
    'shrink-0': ['flex-shrink', '0'],

    // Align items
    'items-start': ['align-items', 'flex-start'],
    'items-end': ['align-items', 'flex-end'],
    'items-center': ['align-items', 'center'],
    'items-baseline': ['align-items', 'baseline'],
    'items-stretch': ['align-items', 'stretch'],

    // Align self
    'self-auto': ['align-self', 'auto'],
    'self-start': ['align-self', 'flex-start'],
    'self-end': ['align-self', 'flex-end'],
    'self-center': ['align-self', 'center'],
    'self-stretch': ['align-self', 'stretch'],
    'self-baseline': ['align-self', 'baseline'],

    // Justify content
    'justify-start': ['justify-content', 'flex-start'],
    'justify-end': ['justify-content', 'flex-end'],
    'justify-center': ['justify-content', 'center'],
    'justify-between': ['justify-content', 'space-between'],
    'justify-around': ['justify-content', 'space-around'],
    'justify-evenly': ['justify-content', 'space-evenly'],

    // Justify items
    'justify-items-start': ['justify-items', 'start'],
    'justify-items-end': ['justify-items', 'end'],
    'justify-items-center': ['justify-items', 'center'],
    'justify-items-stretch': ['justify-items', 'stretch'],

    // Place content
    'place-content-center': ['place-content', 'center'],
    'place-content-start': ['place-content', 'start'],
    'place-content-end': ['place-content', 'end'],
    'place-content-between': ['place-content', 'space-between'],

    // Place items
    'place-items-center': ['place-items', 'center'],
    'place-items-start': ['place-items', 'start'],
    'place-items-end': ['place-items', 'end'],
    'place-items-stretch': ['place-items', 'stretch'],

    // Gap
    'gap-x-0': ['column-gap', '0px'],
    'gap-y-0': ['row-gap', '0px'],
  };

  for (const [name, [property, value]] of Object.entries(props)) {
    utils.push({ name, property, value, category: 'flexbox' });
  }

  // Dynamic gap from spacing
  const { spacing } = config.theme;
  for (const [key, value] of Object.entries(spacing)) {
    if (key === '0') continue;
    utils.push({ name: `gap-${key}`, property: 'gap', value, category: 'flexbox' });
    utils.push({ name: `gap-x-${key}`, property: 'column-gap', value, category: 'flexbox' });
    utils.push({ name: `gap-y-${key}`, property: 'row-gap', value, category: 'flexbox' });
  }

  return utils;
}
