/**
 * Plugin system with isolated registry.
 * Plugins receive a context with addUtility/addVariant/addComponent methods
 * that write to a registry rather than mutating the original config.
 *
 * @module plugins/index
 */

/**
 * Create a fresh plugin registry
 * @returns {{ utilities: import('../core/types.js').UtilityDefinition[], variants: import('../core/types.js').VariantDefinition[], components: import('../core/types.js').ComponentDefinition[] }}
 */
export function createRegistry() {
  return {
    utilities: [],
    variants: [],
    components: [],
  };
}

/**
 * Validate a utility definition
 * @param {import('../core/types.js').UtilityDefinition} def
 * @throws {Error}
 */
function validateUtility(def) {
  if (!def || typeof def !== 'object') {
    throw new Error('HDX CSS Plugin Error: Utility definition must be an object.');
  }
  if (!def.name || typeof def.name !== 'string') {
    throw new Error('HDX CSS Plugin Error: Utility must have a non-empty string name.');
  }
  if (/\s/.test(def.name)) {
    throw new Error(`HDX CSS Plugin Error: Invalid utility name "${def.name}". Names cannot contain whitespace.`);
  }
  if (!def.property && !def.css) {
    throw new Error(`HDX CSS Plugin Error: Utility "${def.name}" must define either "property" or "css".`);
  }
}

/**
 * Validate a variant definition
 * @param {import('../core/types.js').VariantDefinition} def
 * @throws {Error}
 */
function validateVariant(def) {
  if (!def || typeof def !== 'object') {
    throw new Error('HDX CSS Plugin Error: Variant definition must be an object.');
  }
  if (!def.name || typeof def.name !== 'string') {
    throw new Error('HDX CSS Plugin Error: Variant must have a non-empty string name.');
  }
  if (!def.prefix || typeof def.prefix !== 'string') {
    throw new Error(`HDX CSS Plugin Error: Variant "${def.name}" must have a prefix string.`);
  }
  if (typeof def.selector !== 'function') {
    throw new Error(`HDX CSS Plugin Error: Variant "${def.name}" must have a selector function.`);
  }
}

/**
 * Validate a component definition
 * @param {import('../core/types.js').ComponentDefinition} def
 * @throws {Error}
 */
function validateComponent(def) {
  if (!def || typeof def !== 'object') {
    throw new Error('HDX CSS Plugin Error: Component definition must be an object.');
  }
  if (!def.name || typeof def.name !== 'string') {
    throw new Error('HDX CSS Plugin Error: Component must have a non-empty string name.');
  }
  if (/\s/.test(def.name)) {
    throw new Error(`HDX CSS Plugin Error: Invalid component name "${def.name}". Names cannot contain whitespace.`);
  }
  if (!def.css || typeof def.css !== 'string') {
    throw new Error(`HDX CSS Plugin Error: Component "${def.name}" must have a css string.`);
  }
}

/**
 * Run all plugins and return a registry with collected definitions.
 * Does NOT mutate the original config.
 *
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {{ registry: ReturnType<typeof createRegistry>, config: import('../core/types.js').HdxConfig }}
 */
export function runPlugins(config) {
  const registry = createRegistry();

  const ctx = {
    addUtility(def) {
      validateUtility(def);
      registry.utilities.push(def);
    },
    addVariant(def) {
      validateVariant(def);
      registry.variants.push(def);
    },
    addComponent(def) {
      validateComponent(def);
      registry.components.push(def);
    },
    config,
  };

  for (const plugin of (config.plugins || [])) {
    if (typeof plugin === 'function') {
      plugin(ctx);
    } else if (plugin && typeof plugin.handler === 'function') {
      plugin.handler(ctx);
    }
  }

  return { registry, config };
}
