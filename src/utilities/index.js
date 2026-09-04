import { displayUtilities } from './display.js';
import { flexboxUtilities } from './flexbox.js';
import { gridUtilities } from './grid.js';
import { positioningUtilities } from './positioning.js';
import { spacingUtilities } from './spacing.js';
import { sizingUtilities } from './sizing.js';
import { typographyUtilities } from './typography.js';
import { colorsUtilities } from './colors.js';
import { backgroundsUtilities } from './backgrounds.js';
import { bordersUtilities } from './borders.js';
import { borderRadiusUtilities } from './border-radius.js';
import { shadowsUtilities } from './shadows.js';
import { opacityUtilities } from './opacity.js';
import { overflowUtilities } from './overflow.js';
import { zIndexUtilities } from './z-index.js';
import { transformsUtilities } from './transforms.js';
import { transitionsUtilities } from './transitions.js';
import { animationsUtilities, getAnimationKeyframes } from './animations.js';
import { accessibilityUtilities } from './accessibility.js';

/**
 * Get all utility definitions from all categories
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').UtilityDefinition[]}
 */
export function getAllUtilities(config) {
  const customUtilities = config._customUtilities || [];

  return [
    ...displayUtilities(config),
    ...flexboxUtilities(config),
    ...gridUtilities(config),
    ...positioningUtilities(config),
    ...spacingUtilities(config),
    ...sizingUtilities(config),
    ...typographyUtilities(config),
    ...colorsUtilities(config),
    ...backgroundsUtilities(config),
    ...bordersUtilities(config),
    ...borderRadiusUtilities(config),
    ...shadowsUtilities(config),
    ...opacityUtilities(config),
    ...overflowUtilities(config),
    ...zIndexUtilities(config),
    ...transformsUtilities(config),
    ...transitionsUtilities(config),
    ...animationsUtilities(config),
    ...accessibilityUtilities(config),
    ...customUtilities,
  ];
}

/**
 * Get animation keyframes CSS
 * @returns {string}
 */
export { getAnimationKeyframes };
