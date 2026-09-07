/**
 * Container query utilities.
 *
 * `hdx-cq` marks an element as a size containment container (`container-type:
 * inline-size`) so `cq-{bp}` variants on descendants match against its width
 * instead of the viewport.
 *
 * @returns {import('../core/types.js').UtilityDefinition[]}
 */
export function containerQueryUtilities() {
  return [
    {
      name: 'cq',
      property: 'container-type',
      value: 'inline-size',
      category: 'container-queries',
    },
  ];
}