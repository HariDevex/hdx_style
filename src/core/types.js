/**
 * @typedef {Object} HdxConfig
 * @property {string} prefix
 * @property {string[]} content
 * @property {'class'|'media'|'both'|'none'} darkMode
 * @property {boolean} reset
 * @property {boolean} [components]
 * @property {Theme} theme
 * @property {Function[]} plugins
 * @property {string[]} [safelist]
 * @property {Object[]} [_customUtilities]
 * @property {Object[]} [_customVariants]
 * @property {Object[]} [_customComponents]
 */

/**
 * @typedef {Object} Theme
 * @property {Object<string,string>} colors
 * @property {Object<string,string>} [darkColors]
 * @property {Object<string,string>} spacing
 * @property {Object<string,string>} fontSize
 * @property {Object<string,string>} fontWeight
 * @property {Object<string,string>} lineHeight
 * @property {Object<string,string>} letterSpacing
 * @property {Object<string,string>} radius
 * @property {Object<string,string>} shadows
 * @property {Object<string,string>} breakpoints
 * @property {Object<string,string>} opacity
 * @property {Object<string,string>} zIndex
 * @property {Object<string,string>} transitionDuration
 * @property {Object<string,string>} transitionTiming
 */

/**
 * @typedef {Object} UtilityDefinition
 * @property {string} name
 * @property {string} [property]
 * @property {string} [value]
 * @property {string} [css]
 * @property {string} [selector] - Optional selector suffix appended to the class
 *   (e.g. ' > :not([hidden]) ~ :not([hidden])' for space/divide combinators).
 * @property {string} [category]
 */

/**
 * @typedef {Object} VariantDefinition
 * @property {string} name
 * @property {string} prefix
 * @property {function(string): string} selector
 * @property {'state'|'responsive'|'dark'|'ancestor'|'important'} [type]
 * @property {'class'|'media'|'both'} [strategy]
 */

/**
 * @typedef {Object} ComponentDefinition
 * @property {string} name
 * @property {string} css
 * @property {string} [category]
 */

/**
 * @typedef {Object} PluginContext
 * @property {function(UtilityDefinition): void} addUtility
 * @property {function(VariantDefinition): void} addVariant
 * @property {function(ComponentDefinition): void} addComponent
 * @property {HdxConfig} config
 */

/**
 * @typedef {Object} GenerateOptions
 * @property {boolean} [purge]
 * @property {string[]} [content]
 */
