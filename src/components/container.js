/**
 * Container component definition
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').ComponentDefinition[]}
 */
export function containerComponent(config) {
  const components = [
    {
      name: 'container',
      css: `width: 100%;
margin-inline: auto;
padding-inline: 1rem;`,
      category: 'components',
    },
  ];

  // container-{breakpoint} max-widths are derived from theme.breakpoints so a
  // custom breakpoint (e.g. 3xl) automatically gets an hdx-container-3xl.
  for (const [key, width] of Object.entries(config.theme.breakpoints || {})) {
    components.push({
      name: `container-${key}`,
      css: `max-width: ${width};`,
      category: 'components',
    });
  }

  return components;
}
