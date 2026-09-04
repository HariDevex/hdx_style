/**
 * Background utilities
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').UtilityDefinition[]}
 */
export function backgroundsUtilities(config) {
  return [
    { name: 'bg-auto', property: 'background-size', value: 'auto', category: 'backgrounds' },
    { name: 'bg-cover', property: 'background-size', value: 'cover', category: 'backgrounds' },
    { name: 'bg-contain', property: 'background-size', value: 'contain', category: 'backgrounds' },

    { name: 'bg-bottom', property: 'background-position', value: 'bottom', category: 'backgrounds' },
    { name: 'bg-center', property: 'background-position', value: 'center', category: 'backgrounds' },
    { name: 'bg-left', property: 'background-position', value: 'left', category: 'backgrounds' },
    { name: 'bg-left-bottom', property: 'background-position', value: 'left bottom', category: 'backgrounds' },
    { name: 'bg-left-top', property: 'background-position', value: 'left top', category: 'backgrounds' },
    { name: 'bg-right', property: 'background-position', value: 'right', category: 'backgrounds' },
    { name: 'bg-right-bottom', property: 'background-position', value: 'right bottom', category: 'backgrounds' },
    { name: 'bg-right-top', property: 'background-position', value: 'right top', category: 'backgrounds' },
    { name: 'bg-top', property: 'background-position', value: 'top', category: 'backgrounds' },

    { name: 'bg-no-repeat', property: 'background-repeat', value: 'no-repeat', category: 'backgrounds' },
    { name: 'bg-repeat', property: 'background-repeat', value: 'repeat', category: 'backgrounds' },
    { name: 'bg-repeat-x', property: 'background-repeat', value: 'repeat-x', category: 'backgrounds' },
    { name: 'bg-repeat-y', property: 'background-repeat', value: 'repeat-y', category: 'backgrounds' },
    { name: 'bg-repeat-round', property: 'background-repeat', value: 'round', category: 'backgrounds' },
    { name: 'bg-repeat-space', property: 'background-repeat', value: 'space', category: 'backgrounds' },

    { name: 'bg-fixed', property: 'background-attachment', value: 'fixed', category: 'backgrounds' },
    { name: 'bg-local', property: 'background-attachment', value: 'local', category: 'backgrounds' },
    { name: 'bg-scroll', property: 'background-attachment', value: 'scroll', category: 'backgrounds' },

    { name: 'bg-clip-border', property: 'background-clip', value: 'border-box', category: 'backgrounds' },
    { name: 'bg-clip-padding', property: 'background-clip', value: 'padding-box', category: 'backgrounds' },
    { name: 'bg-clip-content', property: 'background-clip', value: 'content-box', category: 'backgrounds' },
    { name: 'bg-clip-text', property: 'background-clip', value: 'text', category: 'backgrounds' },
  ];
}
