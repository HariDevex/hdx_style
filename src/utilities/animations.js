/**
 * Animation utilities
 * @param {import('../core/types.js').HdxConfig} config
 * @returns {import('../core/types.js').UtilityDefinition[]}
 */
export function animationsUtilities(config) {
  return [
    { name: 'animate-none', property: 'animation', value: 'none', category: 'animations' },
    { name: 'animate-spin', property: 'animation', value: 'hdx-spin 1s linear infinite', category: 'animations' },
    { name: 'animate-ping', property: 'animation', value: 'hdx-ping 1s cubic-bezier(0, 0, 0.2, 1) infinite', category: 'animations' },
    { name: 'animate-pulse', property: 'animation', value: 'hdx-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite', category: 'animations' },
    { name: 'animate-bounce', property: 'animation', value: 'hdx-bounce 1s infinite', category: 'animations' },
  ];
}

/**
 * Get animation keyframes CSS
 * @returns {string}
 */
export function getAnimationKeyframes() {
  return `@keyframes hdx-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes hdx-ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

@keyframes hdx-pulse {
  50% {
    opacity: .5;
  }
}

@keyframes hdx-bounce {
  0%, 100% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}
`;
}
