/**
 * Sizing utilities (dynamic from theme)
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').UtilityDefinition[]}
 */
export function sizingUtilities(config) {
  const { spacing } = config.theme;
  const utils = [];

  // Width from spacing
  for (const [key, value] of Object.entries(spacing)) {
    utils.push({ name: `w-${key}`, property: 'width', value, category: 'sizing' });
    utils.push({ name: `h-${key}`, property: 'height', value, category: 'sizing' });
    utils.push({ name: `min-w-${key}`, property: 'min-width', value, category: 'sizing' });
    utils.push({ name: `min-h-${key}`, property: 'min-height', value, category: 'sizing' });
    utils.push({ name: `max-w-${key}`, property: 'max-width', value, category: 'sizing' });
    utils.push({ name: `max-h-${key}`, property: 'max-height', value, category: 'sizing' });
  }

  // Width keywords
  const widthKeywords = [
    ['w-auto', 'auto'],
    ['w-px', '1px'],
    ['w-full', '100%'],
    ['w-screen', '100vw'],
    ['w-svw', '100svw'],
    ['w-lvw', '100lvw'],
    ['w-dvw', '100dvw'],
    ['w-min', 'min-content'],
    ['w-max', 'max-content'],
    ['w-fit', 'fit-content'],
  ];

  for (const [name, value] of widthKeywords) {
    utils.push({ name, property: 'width', value, category: 'sizing' });
  }

  // Height keywords
  const heightKeywords = [
    ['h-auto', 'auto'],
    ['h-px', '1px'],
    ['h-full', '100%'],
    ['h-screen', '100vh'],
    ['h-svh', '100svh'],
    ['h-lvh', '100lvh'],
    ['h-dvh', '100dvh'],
    ['h-min', 'min-content'],
    ['h-max', 'max-content'],
    ['h-fit', 'fit-content'],
  ];

  for (const [name, value] of heightKeywords) {
    utils.push({ name, property: 'height', value, category: 'sizing' });
  }

  // Min/Max width breakpoints
  const maxWidthBreakpoints = [
    ['max-w-none', 'none'],
    ['max-w-xs', '20rem'],
    ['max-w-sm', '24rem'],
    ['max-w-md', '28rem'],
    ['max-w-lg', '32rem'],
    ['max-w-xl', '36rem'],
    ['max-w-2xl', '42rem'],
    ['max-w-3xl', '48rem'],
    ['max-w-4xl', '56rem'],
    ['max-w-5xl', '64rem'],
    ['max-w-6xl', '72rem'],
    ['max-w-7xl', '80rem'],
    ['max-w-full', '100%'],
    ['max-w-min', 'min-content'],
    ['max-w-max', 'max-content'],
    ['max-w-fit', 'fit-content'],
    ['max-w-prose', '65ch'],
  ];

  for (const [name, value] of maxWidthBreakpoints) {
    utils.push({ name, property: 'max-width', value, category: 'sizing' });
  }

  return utils;
}
