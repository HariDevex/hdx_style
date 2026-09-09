import { stateVariants } from './states.js';
import { responsiveVariants } from './responsive.js';
import { orientationVariants } from './orientation.js';
import { printVariants } from './print.js';
import { motionVariants } from './motion.js';
import { containerQueryVariants } from './container-query.js';
import { darkVariants } from './dark.js';
import { groupVariants } from './group.js';
import { importantVariants } from './important.js';

/**
 * Get all variant definitions
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').VariantDefinition[]}
 */
export function getAllVariants(config) {
  const customVariants = config._customVariants || [];

  return [
    ...stateVariants(config),
    ...responsiveVariants(config),
    ...orientationVariants(),
    ...printVariants(),
    ...motionVariants(),
    ...containerQueryVariants(config),
    ...darkVariants(config),
    ...groupVariants(config),
    ...importantVariants(),
    ...customVariants,
  ];
}
