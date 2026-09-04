/**
 * Run all plugins
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').HdxConfig}
 */
export function runPlugins(config) {
  const ctx = {
    addUtility(def) {
      if (!config._customUtilities) config._customUtilities = [];
      config._customUtilities.push(def);
    },
    addVariant(def) {
      if (!config._customVariants) config._customVariants = [];
      config._customVariants.push(def);
    },
    addComponent(def) {
      if (!config._customComponents) config._customComponents = [];
      config._customComponents.push(def);
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

  return config;
}
