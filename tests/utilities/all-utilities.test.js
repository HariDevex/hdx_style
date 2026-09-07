import { describe, it, expect } from 'vitest';
import { loadConfig } from '../../src/core/config.js';
import { displayUtilities } from '../../src/utilities/display.js';
import { flexboxUtilities } from '../../src/utilities/flexbox.js';
import { gridUtilities } from '../../src/utilities/grid.js';
import { spacingUtilities } from '../../src/utilities/spacing.js';
import { typographyUtilities } from '../../src/utilities/typography.js';
import { colorsUtilities } from '../../src/utilities/colors.js';
import { shadowsUtilities } from '../../src/utilities/shadows.js';
import { borderRadiusUtilities } from '../../src/utilities/border-radius.js';
import { opacityUtilities } from '../../src/utilities/opacity.js';
import { zIndexUtilities } from '../../src/utilities/z-index.js';
import { overflowUtilities } from '../../src/utilities/overflow.js';
import { sizingUtilities } from '../../src/utilities/sizing.js';
import { getAllUtilities } from '../../src/utilities/index.js';

const config = loadConfig();

describe('display utilities', () => {
  it('generates display utilities', () => {
    const utils = displayUtilities(config);
    expect(utils.length).toBeGreaterThanOrEqual(10);
    expect(utils.find(u => u.name === 'flex')).toEqual({
      name: 'flex', property: 'display', value: 'flex', category: 'display',
    });
    expect(utils.find(u => u.name === 'hidden')).toEqual({
      name: 'hidden', property: 'display', value: 'none', category: 'display',
    });
  });
});

describe('flexbox utilities', () => {
  it('generates flexbox utilities', () => {
    const utils = flexboxUtilities(config);
    expect(utils.length).toBeGreaterThan(20);
    expect(utils.find(u => u.name === 'items-center')).toEqual({
      name: 'items-center', property: 'align-items', value: 'center', category: 'flexbox',
    });
    expect(utils.find(u => u.name === 'justify-between')).toEqual({
      name: 'justify-between', property: 'justify-content', value: 'space-between', category: 'flexbox',
    });
  });

  it('generates dynamic gap utilities', () => {
    const utils = flexboxUtilities(config);
    expect(utils.find(u => u.name === 'gap-4')).toEqual({
      name: 'gap-4', property: 'gap', value: '1rem', category: 'flexbox',
    });
  });
});

describe('grid utilities', () => {
  it('generates grid-cols-1 through 12', () => {
    const utils = gridUtilities(config);
    expect(utils.find(u => u.name === 'grid-cols-1')).toBeDefined();
    expect(utils.find(u => u.name === 'grid-cols-12')).toBeDefined();
    expect(utils.find(u => u.name === 'grid-cols-3').value).toBe('repeat(3, minmax(0, 1fr))');
  });
});

describe('spacing utilities', () => {
  it('generates padding utilities', () => {
    const utils = spacingUtilities(config);
    expect(utils.find(u => u.name === 'p-4')).toEqual({
      name: 'p-4', property: 'padding', value: '1rem', category: 'spacing',
    });
    expect(utils.find(u => u.name === 'px-4')).toEqual({
      name: 'px-4', property: 'padding-inline', value: '1rem', category: 'spacing',
    });
  });

  it('generates margin utilities', () => {
    const utils = spacingUtilities(config);
    expect(utils.find(u => u.name === 'm-4')).toEqual({
      name: 'm-4', property: 'margin', value: '1rem', category: 'spacing',
    });
  });

  it('generates auto margins', () => {
    const utils = spacingUtilities(config);
    expect(utils.find(u => u.name === 'm-auto')).toEqual({
      name: 'm-auto', property: 'margin', value: 'auto', category: 'spacing',
    });
  });

  it('generates sub-4px half-step spacing including negatives', () => {
    const utils = spacingUtilities(config);
    expect(utils.find(u => u.name === 'p-0.5').value).toBe('0.125rem');
    expect(utils.find(u => u.name === 'py-1.5').value).toBe('0.375rem');
    expect(utils.find(u => u.name === '-m-0.5').value).toBe('-0.125rem');
    expect(utils.find(u => u.name === '-mx-1.5').value).toBe('-0.375rem');
    expect(utils.find(u => u.name === 'space-y-1.5').value).toBe('0.375rem');
  });
});

describe('typography utilities', () => {
  it('generates font sizes', () => {
    const utils = typographyUtilities(config);
    expect(utils.find(u => u.name === 'text-sm')).toEqual({
      name: 'text-sm', property: 'font-size', value: '0.875rem', category: 'typography',
    });
    expect(utils.find(u => u.name === 'text-2xl')).toEqual({
      name: 'text-2xl', property: 'font-size', value: '1.5rem', category: 'typography',
    });
  });

  it('generates font weights', () => {
    const utils = typographyUtilities(config);
    expect(utils.find(u => u.name === 'font-bold')).toEqual({
      name: 'font-bold', property: 'font-weight', value: '700', category: 'typography',
    });
  });

  it('generates text alignment', () => {
    const utils = typographyUtilities(config);
    expect(utils.find(u => u.name === 'text-center')).toEqual({
      name: 'text-center', property: 'text-align', value: 'center', category: 'typography',
    });
  });
});

describe('color utilities', () => {
  it('generates bg and text color utilities', () => {
    const utils = colorsUtilities(config);
    expect(utils.find(u => u.name === 'bg-primary')).toBeDefined();
    expect(utils.find(u => u.name === 'text-primary')).toBeDefined();
    expect(utils.find(u => u.name === 'bg-primary').value).toContain('var(--hdx-color-primary)');
  });

  it('generates gray-scale utilities for every family', () => {
    const utils = colorsUtilities(config);
    for (const tone of ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900']) {
      expect(utils.find(u => u.name === `bg-gray-${tone}`)).toBeDefined();
      expect(utils.find(u => u.name === `text-gray-${tone}`)).toBeDefined();
      expect(utils.find(u => u.name === `border-gray-${tone}`)).toBeDefined();
      expect(utils.find(u => u.name === `ring-gray-${tone}`)).toBeDefined();
      expect(utils.find(u => u.name === `divide-gray-${tone}`)).toBeDefined();
      expect(utils.find(u => u.name === `placeholder-gray-${tone}`)).toBeDefined();
    }
  });
});

describe('shadow utilities', () => {
  it('generates shadow utilities', () => {
    const utils = shadowsUtilities(config);
    expect(utils.find(u => u.name === 'shadow-sm')).toBeDefined();
    expect(utils.find(u => u.name === 'shadow-none')).toBeDefined();
    expect(utils.find(u => u.name === 'shadow')).toBeDefined();
  });
});

describe('border-radius utilities', () => {
  it('generates rounded utilities', () => {
    const utils = borderRadiusUtilities(config);
    expect(utils.find(u => u.name === 'rounded-lg')).toBeDefined();
    expect(utils.find(u => u.name === 'rounded-full')).toBeDefined();
    expect(utils.find(u => u.name === 'rounded')).toBeDefined();
  });
});

describe('opacity utilities', () => {
  it('generates opacity utilities', () => {
    const utils = opacityUtilities(config);
    expect(utils.find(u => u.name === 'opacity-0')).toBeDefined();
    expect(utils.find(u => u.name === 'opacity-50')).toBeDefined();
    expect(utils.find(u => u.name === 'opacity-100')).toBeDefined();
  });
});

describe('z-index utilities', () => {
  it('generates z-index utilities', () => {
    const utils = zIndexUtilities(config);
    expect(utils.find(u => u.name === 'z-10')).toBeDefined();
    expect(utils.find(u => u.name === 'z-50')).toBeDefined();
    expect(utils.find(u => u.name === 'z-auto')).toBeDefined();
  });

  it('generates semantic z-index utilities', () => {
    const utils = zIndexUtilities(config);
    const expected = {
      'z-dropdown': '1000',
      'z-sticky': '1100',
      'z-overlay': '1200',
      'z-modal': '1300',
      'z-popover': '1400',
      'z-toast': '1500',
    };
    for (const [name, value] of Object.entries(expected)) {
      expect(utils.find(u => u.name === name)).toEqual({
        name, property: 'z-index', value, category: 'z-index',
      });
    }
  });
});

describe('overflow utilities', () => {
  it('generates overflow utilities', () => {
    const utils = overflowUtilities(config);
    expect(utils.find(u => u.name === 'overflow-hidden')).toBeDefined();
    expect(utils.find(u => u.name === 'overflow-auto')).toBeDefined();
  });
});

describe('getAllUtilities', () => {
  it('returns all utilities combined', () => {
    const utils = getAllUtilities(config);
    expect(utils.length).toBeGreaterThan(200);
  });

  it('includes all categories', () => {
    const utils = getAllUtilities(config);
    const categories = [...new Set(utils.map(u => u.category))];
    expect(categories).toContain('display');
    expect(categories).toContain('flexbox');
    expect(categories).toContain('grid');
    expect(categories).toContain('spacing');
    expect(categories).toContain('typography');
    expect(categories).toContain('colors');
    expect(categories).toContain('borders');
  });

  it('includes min-h-screen and min-h-full keywords (used across docs/example)', () => {
    const utils = sizingUtilities(config);
    expect(utils.find(u => u.name === 'min-h-screen')).toEqual({
      name: 'min-h-screen', property: 'min-height', value: '100vh', category: 'sizing',
    });
    expect(utils.find(u => u.name === 'min-h-full')).toEqual({
      name: 'min-h-full', property: 'min-height', value: '100%', category: 'sizing',
    });
    expect(utils.find(u => u.name === 'min-w-full')).toEqual({
      name: 'min-w-full', property: 'min-width', value: '100%', category: 'sizing',
    });
  });
});
