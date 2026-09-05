import { colorVariable } from '../generator/resolver.js';

/**
 * Border utilities
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').UtilityDefinition[]}
 */
export function bordersUtilities(config) {
  const { colors } = config.theme;
  const prefix = config.prefix;
  const utils = [];

  // Border width
  utils.push(
    { name: 'border', css: 'border-width: 1px;\nborder-style: solid;', category: 'borders' },
    { name: 'border-0', property: 'border-width', value: '0px', category: 'borders' },
    { name: 'border-2', property: 'border-width', value: '2px', category: 'borders' },
    { name: 'border-4', property: 'border-width', value: '4px', category: 'borders' },
    { name: 'border-8', property: 'border-width', value: '8px', category: 'borders' },
  );

  // Individual side borders
  const sides = [
    ['t', 'border-top-width'],
    ['r', 'border-right-width'],
    ['b', 'border-bottom-width'],
    ['l', 'border-left-width'],
    ['x', 'border-inline-width'],
    ['y', 'border-block-width'],
  ];

  for (const [side, prop] of sides) {
    utils.push({ name: `border-${side}`, property: prop, value: '1px', category: 'borders' });
    utils.push({ name: `border-${side}-0`, property: prop, value: '0px', category: 'borders' });
    utils.push({ name: `border-${side}-2`, property: prop, value: '2px', category: 'borders' });
    utils.push({ name: `border-${side}-4`, property: prop, value: '4px', category: 'borders' });
    utils.push({ name: `border-${side}-8`, property: prop, value: '8px', category: 'borders' });
  }

  // Border style
  const styles = ['solid', 'dashed', 'dotted', 'double', 'hidden', 'none'];
  for (const style of styles) {
    utils.push({ name: `border-${style}`, property: 'border-style', value: style, category: 'borders' });
  }

  // Divide utilities (for child dividers).
  // The `selector` suffix emits the Tailwind child combinator so borders render
  // between adjacent children: `.hdx_divide-x > :not([hidden]) ~ :not([hidden])`.
  const childCombinator = ' > :not([hidden]) ~ :not([hidden])';
  utils.push(
    { name: 'divide-x', property: 'border-inline-start-width', value: '1px', category: 'borders', selector: childCombinator },
    { name: 'divide-y', property: 'border-block-start-width', value: '1px', category: 'borders', selector: childCombinator },
    { name: 'divide-x-0', property: 'border-inline-start-width', value: '0px', category: 'borders', selector: childCombinator },
    { name: 'divide-y-0', property: 'border-block-start-width', value: '0px', category: 'borders', selector: childCombinator },
    { name: 'divide-x-2', property: 'border-inline-start-width', value: '2px', category: 'borders', selector: childCombinator },
    { name: 'divide-y-2', property: 'border-block-start-width', value: '2px', category: 'borders', selector: childCombinator },
    { name: 'divide-x-4', property: 'border-inline-start-width', value: '4px', category: 'borders', selector: childCombinator },
    { name: 'divide-y-4', property: 'border-block-start-width', value: '4px', category: 'borders', selector: childCombinator },
    { name: 'divide-x-8', property: 'border-inline-start-width', value: '8px', category: 'borders', selector: childCombinator },
    { name: 'divide-y-8', property: 'border-block-start-width', value: '8px', category: 'borders', selector: childCombinator },
    { name: 'divide-solid', property: 'border-style', value: 'solid', category: 'borders', selector: childCombinator },
    { name: 'divide-dashed', property: 'border-style', value: 'dashed', category: 'borders', selector: childCombinator },
    { name: 'divide-dotted', property: 'border-style', value: 'dotted', category: 'borders', selector: childCombinator },
  );

  return utils;
}
