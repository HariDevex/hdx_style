/**
 * HDX CSS Default Theme
 * Modern SaaS + Developer Dashboard design language
 */

export const defaultTheme = {
  colors: {
    primary: '#2563EB',
    'primary-hover': '#1D4ED8',
    'primary-active': '#1E40AF',
    secondary: '#64748B',
    'secondary-hover': '#475569',
    success: '#16A34A',
    'success-hover': '#15803D',
    danger: '#DC2626',
    'danger-hover': '#B91C1C',
    warning: '#D97706',
    'warning-hover': '#B45309',
    info: '#0284C7',
    'info-hover': '#0369A1',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    'surface-secondary': '#F1F5F9',
    text: '#0F172A',
    'text-secondary': '#475569',
    'text-muted': '#64748B',
    border: '#E2E8F0',
    'border-strong': '#CBD5E1',
    white: '#FFFFFF',
    black: '#000000',
  },

  darkColors: {
    background: '#0F172A',
    surface: '#1E293B',
    'surface-secondary': '#334155',
    text: '#F8FAFC',
    'text-secondary': '#CBD5E1',
    'text-muted': '#94A3B8',
    border: '#334155',
    'border-strong': '#475569',
  },

  spacing: {
    0: '0px',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    32: '8rem',
  },

  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },

  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },

  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },

  radius: {
    none: '0px',
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },

  shadows: {
    none: 'none',
    sm: '0 1px 2px rgba(15, 23, 42, 0.05)',
    md: '0 4px 6px rgba(15, 23, 42, 0.08)',
    lg: '0 10px 15px rgba(15, 23, 42, 0.10)',
    xl: '0 20px 25px rgba(15, 23, 42, 0.12)',
    '2xl': '0 25px 50px rgba(15, 23, 42, 0.15)',
    inner: 'inset 0 2px 4px rgba(15, 23, 42, 0.06)',
  },

  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  opacity: {
    0: '0',
    5: '0.05',
    10: '0.1',
    15: '0.15',
    20: '0.2',
    25: '0.25',
    30: '0.3',
    40: '0.4',
    50: '0.5',
    60: '0.6',
    70: '0.7',
    75: '0.75',
    80: '0.8',
    90: '0.9',
    95: '0.95',
    100: '1',
  },

  zIndex: {
    0: '0',
    10: '10',
    20: '20',
    30: '30',
    40: '40',
    50: '50',
    auto: 'auto',
  },

  transitionDuration: {
    75: '75ms',
    100: '100ms',
    150: '150ms',
    200: '200ms',
    300: '300ms',
    500: '500ms',
    700: '700ms',
    1000: '1000ms',
  },

  transitionTiming: {
    linear: 'linear',
    ease: 'ease',
    'ease-in': 'ease-in',
    'ease-out': 'ease-out',
    'ease-in-out': 'ease-in-out',
  },
};

export const defaultFontFamily = 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

export const defaultConfig = {
  prefix: 'hdx_',
  content: [],
  safelist: [],
  darkMode: 'class',
  reset: true,
  theme: defaultTheme,
  plugins: [],
};
