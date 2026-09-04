export interface Theme {
  colors: Record<string, string>;
  spacing: Record<string, string>;
  fontSize: Record<string, string>;
  fontWeight: Record<string, string>;
  lineHeight: Record<string, string>;
  letterSpacing: Record<string, string>;
  radius: Record<string, string>;
  shadows: Record<string, string>;
  breakpoints: Record<string, string>;
  opacity: Record<string, string>;
  zIndex: Record<string, string>;
  transitionDuration: Record<string, string>;
  transitionTiming: Record<string, string>;
}

export interface HdxConfig {
  prefix: string;
  content: string[];
  darkMode: 'class' | 'media' | 'both';
  theme: Theme;
  plugins: PluginFunction[];
  safelist?: string[];
  reset?: boolean;
}

export interface GenerateOptions {
  utilities?: UtilityDefinition[];
}

export interface UtilityDefinition {
  name: string;
  property?: string;
  value?: string;
  css?: string;
  category?: string;
}

export interface VariantDefinition {
  name: string;
  prefix: string;
  type?: 'state' | 'responsive' | 'dark' | 'ancestor';
  selector: (...args: unknown[]) => string;
}

export interface ComponentDefinition {
  name: string;
  css: string;
  category?: string;
}

export interface PluginContext {
  addUtility: (util: UtilityDefinition) => void;
  addVariant: (variant: VariantDefinition) => void;
  addComponent: (component: ComponentDefinition) => void;
  config: HdxConfig;
}

export type PluginFunction = (context: PluginContext) => void;

export function loadConfig(userConfig?: Partial<HdxConfig>): HdxConfig;
export function loadConfigFromFile(configPath?: string): Promise<HdxConfig>;
export function getDefaultConfig(): HdxConfig;
export const defaultTheme: Theme;
export const defaultConfig: HdxConfig;

export function generateCSS(config: HdxConfig, options?: GenerateOptions): string;
export function extractClassNames(content: string): Set<string>;
export function getAllUtilities(config?: HdxConfig): UtilityDefinition[];
export function getAllVariants(config?: HdxConfig): VariantDefinition[];
export function prefixClass(name: string, prefix?: string): string;
export function escapeClassName(name: string): string;
export function getSelector(name: string, prefix?: string): string;
export function getSelectorWithDot(name: string, prefix?: string): string;