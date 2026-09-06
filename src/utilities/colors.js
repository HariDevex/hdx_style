import { colorVariable, semanticVar } from '../generator/resolver.js';

/**
 * Color utilities (bg-{color}, text-{color})
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').UtilityDefinition[]}
 */
export function colorsUtilities(config) {
  const { colors } = config.theme;
  const prefix = config.prefix;
  const utils = [];

  // Child combinator shared with borders.js divide-* width rules so
  // `hdx_divide-x hdx_divide-primary` colors the borders between children.
  const childCombinator = ' > :not([hidden]) ~ :not([hidden])';

  for (const [key] of Object.entries(colors)) {
    const cssVar = colorVariable(key, prefix);

    // Background color
    utils.push({
      name: `bg-${key}`,
      property: 'background-color',
      value: cssVar,
      category: 'colors',
    });

    // Text color
    utils.push({
      name: `text-${key}`,
      property: 'color',
      value: cssVar,
      category: 'colors',
    });

    // Border color
    utils.push({
      name: `border-${key}`,
      property: 'border-color',
      value: cssVar,
      category: 'colors',
    });

    // Ring color (for focus rings)
    utils.push({
      name: `ring-${key}`,
      property: semanticVar('ring-color', prefix),
      value: cssVar,
      category: 'colors',
    });

    // Divide color (borders between adjacent children, see borders.js)
    utils.push({
      name: `divide-${key}`,
      property: 'border-color',
      value: cssVar,
      category: 'colors',
      selector: childCombinator,
    });

    // Placeholder color
    utils.push({
      name: `placeholder-${key}`,
      property: semanticVar('placeholder-color', prefix),
      value: cssVar,
      category: 'colors',
    });

    // Accent color
    utils.push({
      name: `accent-${key}`,
      property: 'accent-color',
      value: cssVar,
      category: 'colors',
    });

    // Caret color
    utils.push({
      name: `caret-${key}`,
      property: 'caret-color',
      value: cssVar,
      category: 'colors',
    });

    // Gradient stops. Each rule composes the --hdx-gradient-stops variable that
    // bg-gradient-to-* consumes, mirroring Tailwind's var-based gradient model.
    const gFrom = semanticVar('gradient-from', prefix);
    const gVia = semanticVar('gradient-via', prefix);
    const gTo = semanticVar('gradient-to', prefix);
    const gStops = semanticVar('gradient-stops', prefix);
    utils.push({
      name: `from-${key}`,
      css: `${gFrom}: ${cssVar};\n${gStops}: var(${gFrom}), var(${gTo}, transparent);`,
      category: 'colors',
    });
    utils.push({
      name: `via-${key}`,
      css: `${gVia}: ${cssVar};\n${gStops}: var(${gFrom}, transparent), var(${gVia}), var(${gTo}, transparent);`,
      category: 'colors',
    });
    utils.push({
      name: `to-${key}`,
      css: `${gTo}: ${cssVar};\n${gStops}: var(${gFrom}, transparent), var(${gTo});`,
      category: 'colors',
    });
  }

  return utils;
}
