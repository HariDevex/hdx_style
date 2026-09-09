// HDX CSS — Vanilla example config
// Build with: node src/cli/index.js build -p -c examples/vanilla/hdx.config.js
export default {
  // Prefix for every utility/variant/component class
  prefix: 'hdx-',

  // Files to scan for used classes (enables production purging)
  content: ['./examples/vanilla/**/*.html'],

  // Force these classes into the output even if not detected above
  safelist: [],

  // Dark mode strategy: 'class' | 'media' | 'both' | 'none'
  darkMode: 'class',

  // Global reset + base styles
  reset: true,

<<<<<<< HEAD
  // Built-in component layer (.hdx-btn, .hdx-card, .hdx-input, ...)
=======
  // Built-in component layer (.hdx-btn, .hdx-card, .hdx-input, …)
>>>>>>> 4e3e9a2 (with error)
  components: true,

  // Theme customization (deep-merged over the defaults — see README
  // "Default Values" for the full shipped theme)
  theme: {
    // colors: { primary: '#2563EB' },   // override any semantic color
    // darkColors: { surface: '#1E293B' }, // dark-mode palette
    // breakpoints: { '3xl': '1920px' },   // add breakpoints (container-3xl too)
  },

  // Plugins: addUtilities / addVariants / addComponents
  plugins: [],
};