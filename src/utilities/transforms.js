/**
 * Transform utilities
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').UtilityDefinition[]}
 */
export function transformsUtilities(config) {
  const utils = [
    // Base transform
    { name: 'transform', property: 'transform', value: 'translateX(var(--translate-x, 0)) translateY(var(--translate-y, 0)) rotate(var(--rotate, 0)) skewX(var(--skew-x, 0)) skewY(var(--skew-y, 0)) scaleX(var(--scale-x, 1)) scaleY(var(--scale-y, 1))', category: 'transforms' },
    { name: 'transform-none', property: 'transform', value: 'none', category: 'transforms' },
    { name: 'transform-gpu', property: 'transform', value: 'translate3d(var(--translate-x, 0), var(--translate-y, 0), 0) rotate(var(--rotate, 0)) skewX(var(--skew-x, 0)) skewY(var(--skew-y, 0)) scaleX(var(--scale-x, 1)) scaleY(var(--scale-y, 1))', category: 'transforms' },

    // Scale (sets both axes so `hdx-scale-150` scales evenly; use scale-x-* /
    // scale-y-* arbitrary values to scale a single axis)
    { name: 'scale-0', css: '--scale-x: 0;\n--scale-y: 0;', category: 'transforms' },
    { name: 'scale-50', css: '--scale-x: .5;\n--scale-y: .5;', category: 'transforms' },
    { name: 'scale-75', css: '--scale-x: .75;\n--scale-y: .75;', category: 'transforms' },
    { name: 'scale-90', css: '--scale-x: .9;\n--scale-y: .9;', category: 'transforms' },
    { name: 'scale-95', css: '--scale-x: .95;\n--scale-y: .95;', category: 'transforms' },
    { name: 'scale-100', css: '--scale-x: 1;\n--scale-y: 1;', category: 'transforms' },
    { name: 'scale-105', css: '--scale-x: 1.05;\n--scale-y: 1.05;', category: 'transforms' },
    { name: 'scale-110', css: '--scale-x: 1.1;\n--scale-y: 1.1;', category: 'transforms' },
    { name: 'scale-125', css: '--scale-x: 1.25;\n--scale-y: 1.25;', category: 'transforms' },
    { name: 'scale-150', css: '--scale-x: 1.5;\n--scale-y: 1.5;', category: 'transforms' },
    { name: 'scale-x-0', property: '--scale-x', value: '0', category: 'transforms' },
    { name: 'scale-x-50', property: '--scale-x', value: '.5', category: 'transforms' },
    { name: 'scale-x-75', property: '--scale-x', value: '.75', category: 'transforms' },
    { name: 'scale-x-95', property: '--scale-x', value: '.95', category: 'transforms' },
    { name: 'scale-x-100', property: '--scale-x', value: '1', category: 'transforms' },
    { name: 'scale-x-105', property: '--scale-x', value: '1.05', category: 'transforms' },
    { name: 'scale-x-110', property: '--scale-x', value: '1.1', category: 'transforms' },
    { name: 'scale-x-125', property: '--scale-x', value: '1.25', category: 'transforms' },
    { name: 'scale-x-150', property: '--scale-x', value: '1.5', category: 'transforms' },
    { name: 'scale-y-0', property: '--scale-y', value: '0', category: 'transforms' },
    { name: 'scale-y-50', property: '--scale-y', value: '.5', category: 'transforms' },
    { name: 'scale-y-75', property: '--scale-y', value: '.75', category: 'transforms' },
    { name: 'scale-y-95', property: '--scale-y', value: '.95', category: 'transforms' },
    { name: 'scale-y-100', property: '--scale-y', value: '1', category: 'transforms' },
    { name: 'scale-y-105', property: '--scale-y', value: '1.05', category: 'transforms' },
    { name: 'scale-y-110', property: '--scale-y', value: '1.1', category: 'transforms' },
    { name: 'scale-y-125', property: '--scale-y', value: '1.25', category: 'transforms' },
    { name: 'scale-y-150', property: '--scale-y', value: '1.5', category: 'transforms' },

    // Rotate
    { name: 'rotate-0', property: '--rotate', value: '0deg', category: 'transforms' },
    { name: 'rotate-1', property: '--rotate', value: '1deg', category: 'transforms' },
    { name: 'rotate-2', property: '--rotate', value: '2deg', category: 'transforms' },
    { name: 'rotate-3', property: '--rotate', value: '3deg', category: 'transforms' },
    { name: 'rotate-6', property: '--rotate', value: '6deg', category: 'transforms' },
    { name: 'rotate-12', property: '--rotate', value: '12deg', category: 'transforms' },
    { name: 'rotate-45', property: '--rotate', value: '45deg', category: 'transforms' },
    { name: 'rotate-90', property: '--rotate', value: '90deg', category: 'transforms' },
    { name: 'rotate-180', property: '--rotate', value: '180deg', category: 'transforms' },

    // Negative rotate (Tailwind-compatible: -rotate-45, -rotate-90, …)
    { name: '-rotate-1', property: '--rotate', value: '-1deg', category: 'transforms' },
    { name: '-rotate-2', property: '--rotate', value: '-2deg', category: 'transforms' },
    { name: '-rotate-3', property: '--rotate', value: '-3deg', category: 'transforms' },
    { name: '-rotate-6', property: '--rotate', value: '-6deg', category: 'transforms' },
    { name: '-rotate-12', property: '--rotate', value: '-12deg', category: 'transforms' },
    { name: '-rotate-45', property: '--rotate', value: '-45deg', category: 'transforms' },
    { name: '-rotate-90', property: '--rotate', value: '-90deg', category: 'transforms' },
    { name: '-rotate-180', property: '--rotate', value: '-180deg', category: 'transforms' },

    // Translate
    { name: 'translate-x-0', property: '--translate-x', value: '0px', category: 'transforms' },
    { name: 'translate-x-px', property: '--translate-x', value: '1px', category: 'transforms' },
    { name: 'translate-x-full', property: '--translate-x', value: '100%', category: 'transforms' },
    { name: 'translate-x-1/2', property: '--translate-x', value: '50%', category: 'transforms' },
    { name: 'translate-x-1/4', property: '--translate-x', value: '25%', category: 'transforms' },
    { name: 'translate-x-1/3', property: '--translate-x', value: '33.333333%', category: 'transforms' },
    { name: 'translate-x-2/3', property: '--translate-x', value: '66.666667%', category: 'transforms' },
    { name: 'translate-x-2/4', property: '--translate-x', value: '50%', category: 'transforms' },
    { name: 'translate-x-3/4', property: '--translate-x', value: '75%', category: 'transforms' },

    { name: 'translate-y-0', property: '--translate-y', value: '0px', category: 'transforms' },
    { name: 'translate-y-px', property: '--translate-y', value: '1px', category: 'transforms' },
    { name: 'translate-y-full', property: '--translate-y', value: '100%', category: 'transforms' },
    { name: 'translate-y-1/2', property: '--translate-y', value: '50%', category: 'transforms' },
    { name: 'translate-y-1/4', property: '--translate-y', value: '25%', category: 'transforms' },
    { name: 'translate-y-1/3', property: '--translate-y', value: '33.333333%', category: 'transforms' },
    { name: 'translate-y-2/3', property: '--translate-y', value: '66.666667%', category: 'transforms' },
    { name: 'translate-y-2/4', property: '--translate-y', value: '50%', category: 'transforms' },
    { name: 'translate-y-3/4', property: '--translate-y', value: '75%', category: 'transforms' },

    // Negative translate (Tailwind-compatible: -translate-x-4, -translate-y-1/2)
    { name: '-translate-x-px', property: '--translate-x', value: '-1px', category: 'transforms' },
    { name: '-translate-x-full', property: '--translate-x', value: '-100%', category: 'transforms' },
    { name: '-translate-x-1/2', property: '--translate-x', value: '-50%', category: 'transforms' },
    { name: '-translate-x-1/4', property: '--translate-x', value: '-25%', category: 'transforms' },
    { name: '-translate-x-1/3', property: '--translate-x', value: '-33.333333%', category: 'transforms' },
    { name: '-translate-x-2/3', property: '--translate-x', value: '-66.666667%', category: 'transforms' },
    { name: '-translate-x-2/4', property: '--translate-x', value: '-50%', category: 'transforms' },
    { name: '-translate-x-3/4', property: '--translate-x', value: '-75%', category: 'transforms' },
    { name: '-translate-y-px', property: '--translate-y', value: '-1px', category: 'transforms' },
    { name: '-translate-y-full', property: '--translate-y', value: '-100%', category: 'transforms' },
    { name: '-translate-y-1/2', property: '--translate-y', value: '-50%', category: 'transforms' },
    { name: '-translate-y-1/4', property: '--translate-y', value: '-25%', category: 'transforms' },
    { name: '-translate-y-1/3', property: '--translate-y', value: '-33.333333%', category: 'transforms' },
    { name: '-translate-y-2/3', property: '--translate-y', value: '-66.666667%', category: 'transforms' },
    { name: '-translate-y-2/4', property: '--translate-y', value: '-50%', category: 'transforms' },
    { name: '-translate-y-3/4', property: '--translate-y', value: '-75%', category: 'transforms' },

    // Skew
    { name: 'skew-x-0', property: '--skew-x', value: '0deg', category: 'transforms' },
    { name: 'skew-x-1', property: '--skew-x', value: '1deg', category: 'transforms' },
    { name: 'skew-x-2', property: '--skew-x', value: '2deg', category: 'transforms' },
    { name: 'skew-x-3', property: '--skew-x', value: '3deg', category: 'transforms' },
    { name: 'skew-x-6', property: '--skew-x', value: '6deg', category: 'transforms' },
    { name: 'skew-x-12', property: '--skew-x', value: '12deg', category: 'transforms' },
    { name: 'skew-y-0', property: '--skew-y', value: '0deg', category: 'transforms' },
    { name: 'skew-y-1', property: '--skew-y', value: '1deg', category: 'transforms' },
    { name: 'skew-y-2', property: '--skew-y', value: '2deg', category: 'transforms' },
    { name: 'skew-y-3', property: '--skew-y', value: '3deg', category: 'transforms' },
    { name: 'skew-y-6', property: '--skew-y', value: '6deg', category: 'transforms' },
    { name: 'skew-y-12', property: '--skew-y', value: '12deg', category: 'transforms' },

    // Origin
    { name: 'origin-center', property: 'transform-origin', value: 'center', category: 'transforms' },
    { name: 'origin-top', property: 'transform-origin', value: 'top', category: 'transforms' },
    { name: 'origin-top-right', property: 'transform-origin', value: 'top right', category: 'transforms' },
    { name: 'origin-right', property: 'transform-origin', value: 'right', category: 'transforms' },
    { name: 'origin-bottom-right', property: 'transform-origin', value: 'bottom right', category: 'transforms' },
    { name: 'origin-bottom', property: 'transform-origin', value: 'bottom', category: 'transforms' },
    { name: 'origin-bottom-left', property: 'transform-origin', value: 'bottom left', category: 'transforms' },
    { name: 'origin-left', property: 'transform-origin', value: 'left', category: 'transforms' },
    { name: 'origin-top-left', property: 'transform-origin', value: 'top left', category: 'transforms' },
  ];

  // Negative translate driven by the theme spacing scale (-translate-x-4, …)
  const negate = (value) => {
    if (/^0(px|rem|%)$/.test(value) || value === '0') return '0px';
    return value.startsWith('-') ? value : '-' + value;
  };
  for (const [key, value] of Object.entries(config.theme.spacing || {})) {
    utils.push({ name: `-translate-x-${key}`, property: '--translate-x', value: negate(value), category: 'transforms' });
    utils.push({ name: `-translate-y-${key}`, property: '--translate-y', value: negate(value), category: 'transforms' });
  }

  return utils;
}
