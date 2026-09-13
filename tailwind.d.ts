export interface TailwindPreset {
  theme: {
    extend: Record<string, unknown>;
  };
}

export interface TailwindPluginOptions {
  fluidFontSize?: Record<string, { min: string; max: string }>;
  injectVariables?: boolean;
  theme?: Record<string, unknown>;
}

export const hdxColors: Record<string, string>;
export const hdxDarkColors: Record<string, string>;
export const hdxSpacing: Record<string, string>;
export const hdxFontSize: Record<string, string>;
export const hdxFontWeight: Record<string, string>;
export const hdxLineHeight: Record<string, string>;
export const hdxLetterSpacing: Record<string, string>;
export const hdxBorderRadius: Record<string, string>;
export const hdxBoxShadow: Record<string, string>;
export const hdxScreens: Record<string, string>;
export const hdxOpacity: Record<string, string>;
export const hdxZIndex: Record<string, string>;
export const hdxTransitionDuration: Record<string, string>;
export const hdxTransitionTimingFunction: Record<string, string>;
export const hdxFontFamily: {
  sans: string[];
  serif: string[];
  mono: string[];
};

export function createTailwindPreset(overrides?: Record<string, unknown>): TailwindPreset;
export const hdxTailwindPreset: TailwindPreset;

export function createTailwindPlugin(options?: TailwindPluginOptions): {
  handler: (...args: unknown[]) => void;
  config?: Record<string, unknown>;
};
export const hdxTailwindPlugin: {
  handler: (...args: unknown[]) => void;
  config?: Record<string, unknown>;
};

export function generateTailwindThemeCSS(customTheme?: unknown): string;

export default hdxTailwindPreset;
