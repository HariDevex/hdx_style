import type { Plugin } from 'vite';

export interface HdxVitePluginOptions {
  /** Path to the HDX config file (default: hdx.config.{mjs,js,cjs} in the Vite root). */
  config?: string;
  /** Where to write the purged stylesheet (default: dist/hdx.css). */
  output?: string;
}

export function hdxVitePlugin(options?: HdxVitePluginOptions): Plugin;
export default hdxVitePlugin;