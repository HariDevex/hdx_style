import { stateVariants } from './states.js';
import { responsiveVariants } from './responsive.js';
import { darkVariants } from './dark.js';
import { groupVariants } from './group.js';

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
    ...darkVariants(config),
    ...groupVariants(config),
    ...customVariants,
  ];
}
