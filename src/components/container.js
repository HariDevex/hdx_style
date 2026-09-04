/**
 * Container component definition
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').ComponentDefinition[]}
 */
export function containerComponent(config) {
  return [
    {
      name: 'container',
      css: `width: 100%;
margin-inline: auto;
padding-inline: 1rem;`,
      category: 'components',
    },
    {
      name: 'container-sm',
      css: `max-width: 640px;`,
      category: 'components',
    },
    {
      name: 'container-md',
      css: `max-width: 768px;`,
      category: 'components',
    },
    {
      name: 'container-lg',
      css: `max-width: 1024px;`,
      category: 'components',
    },
    {
      name: 'container-xl',
      css: `max-width: 1280px;`,
      category: 'components',
    },
    {
      name: 'container-2xl',
      css: `max-width: 1536px;`,
      category: 'components',
    },
  ];
}
