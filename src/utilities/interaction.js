/**
 * Interaction utilities: cursor, user-select, appearance, resize
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').UtilityDefinition[]}
 */
export function interactionUtilities() {
  return [
    // Cursor
    { name: 'cursor-auto', property: 'cursor', value: 'auto', category: 'interaction' },
    { name: 'cursor-default', property: 'cursor', value: 'default', category: 'interaction' },
    { name: 'cursor-pointer', property: 'cursor', value: 'pointer', category: 'interaction' },
    { name: 'cursor-wait', property: 'cursor', value: 'wait', category: 'interaction' },
    { name: 'cursor-text', property: 'cursor', value: 'text', category: 'interaction' },
    { name: 'cursor-move', property: 'cursor', value: 'move', category: 'interaction' },
    { name: 'cursor-help', property: 'cursor', value: 'help', category: 'interaction' },
    { name: 'cursor-not-allowed', property: 'cursor', value: 'not-allowed', category: 'interaction' },
    { name: 'cursor-grab', property: 'cursor', value: 'grab', category: 'interaction' },
    { name: 'cursor-grabbing', property: 'cursor', value: 'grabbing', category: 'interaction' },
    { name: 'cursor-zoom-in', property: 'cursor', value: 'zoom-in', category: 'interaction' },
    { name: 'cursor-zoom-out', property: 'cursor', value: 'zoom-out', category: 'interaction' },
    { name: 'cursor-crosshair', property: 'cursor', value: 'crosshair', category: 'interaction' },
    { name: 'cursor-cell', property: 'cursor', value: 'cell', category: 'interaction' },
    { name: 'cursor-copy', property: 'cursor', value: 'copy', category: 'interaction' },
    { name: 'cursor-progress', property: 'cursor', value: 'progress', category: 'interaction' },
    { name: 'cursor-none', property: 'cursor', value: 'none', category: 'interaction' },

    // User select
    { name: 'select-none', property: 'user-select', value: 'none', category: 'interaction' },
    { name: 'select-text', property: 'user-select', value: 'text', category: 'interaction' },
    { name: 'select-all', property: 'user-select', value: 'all', category: 'interaction' },
    { name: 'select-auto', property: 'user-select', value: 'auto', category: 'interaction' },

    // Appearance
    { name: 'appearance-none', property: 'appearance', value: 'none', category: 'interaction' },
    { name: 'appearance-auto', property: 'appearance', value: 'auto', category: 'interaction' },

    // Resize
    { name: 'resize-none', property: 'resize', value: 'none', category: 'interaction' },
    { name: 'resize-y', property: 'resize', value: 'vertical', category: 'interaction' },
    { name: 'resize-x', property: 'resize', value: 'horizontal', category: 'interaction' },
    { name: 'resize', property: 'resize', value: 'both', category: 'interaction' },
  ];
}