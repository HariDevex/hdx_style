/**
 * Grid utilities
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').UtilityDefinition[]}
 */
export function gridUtilities(config) {
  const utils = [];

  // Grid template columns (static)
  const cols = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  for (const n of cols) {
    utils.push({
      name: `grid-cols-${n}`,
      property: 'grid-template-columns',
      value: `repeat(${n}, minmax(0, 1fr))`,
      category: 'grid',
    });
  }

  // Grid template rows (static)
  const rows = [1, 2, 3, 4, 5, 6];
  for (const n of rows) {
    utils.push({
      name: `grid-rows-${n}`,
      property: 'grid-template-rows',
      value: `repeat(${n}, minmax(0, 1fr))`,
      category: 'grid',
    });
  }

  // Col span
  for (const n of [...cols, 'full']) {
    const value = n === 'full' ? '1 / -1' : `${n} / span ${n}`;
    utils.push({
      name: `col-span-${n}`,
      property: 'grid-column',
      value,
      category: 'grid',
    });
  }

  // Col start/end
  for (const n of [...cols, 'auto']) {
    utils.push({
      name: `col-start-${n}`,
      property: 'grid-column-start',
      value: String(n),
      category: 'grid',
    });
    utils.push({
      name: `col-end-${n}`,
      property: 'grid-column-end',
      value: String(n),
      category: 'grid',
    });
  }

  // Row span
  for (const n of [...rows, 'full']) {
    const value = n === 'full' ? '1 / -1' : `${n} / span ${n}`;
    utils.push({
      name: `row-span-${n}`,
      property: 'grid-row',
      value,
      category: 'grid',
    });
  }

  // Row start/end
  for (const n of [...rows, 'auto']) {
    utils.push({
      name: `row-start-${n}`,
      property: 'grid-row-start',
      value: String(n),
      category: 'grid',
    });
    utils.push({
      name: `row-end-${n}`,
      property: 'grid-row-end',
      value: String(n),
      category: 'grid',
    });
  }

  // Grid flow
  utils.push(
    { name: 'grid-flow-row', property: 'grid-auto-flow', value: 'row', category: 'grid' },
    { name: 'grid-flow-col', property: 'grid-auto-flow', value: 'column', category: 'grid' },
    { name: 'grid-flow-dense', property: 'grid-auto-flow', value: 'dense', category: 'grid' },
    { name: 'grid-flow-row-dense', property: 'grid-auto-flow', value: 'row dense', category: 'grid' },
    { name: 'grid-flow-col-dense', property: 'grid-auto-flow', value: 'column dense', category: 'grid' },
  );

  // Auto columns
  utils.push(
    { name: 'auto-cols-auto', property: 'grid-auto-columns', value: 'auto', category: 'grid' },
    { name: 'auto-cols-min', property: 'grid-auto-columns', value: 'min-content', category: 'grid' },
    { name: 'auto-cols-max', property: 'grid-auto-columns', value: 'max-content', category: 'grid' },
    { name: 'auto-cols-fr', property: 'grid-auto-columns', value: 'minmax(0, 1fr)', category: 'grid' },
  );

  // Auto rows
  utils.push(
    { name: 'auto-rows-auto', property: 'grid-auto-rows', value: 'auto', category: 'grid' },
    { name: 'auto-rows-min', property: 'grid-auto-rows', value: 'min-content', category: 'grid' },
    { name: 'auto-rows-max', property: 'grid-auto-rows', value: 'max-content', category: 'grid' },
    { name: 'auto-rows-fr', property: 'grid-auto-rows', value: 'minmax(0, 1fr)', category: 'grid' },
  );

  return utils;
}
