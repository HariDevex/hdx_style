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
});
