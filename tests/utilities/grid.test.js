import { describe, it, expect } from 'vitest';
import { gridUtilities } from '../../src/utilities/grid.js';
import { loadConfig } from '../../src/core/config.js';
import { generateCSS } from '../../src/generator/index.js';
import { getAllUtilities } from '../../src/utilities/index.js';

describe('Grid col-span / row-span semantics (P1/1.2 regression)', () => {
  const config = loadConfig();

  it('col-span-N uses span-first shorthand with no start line pinning', () => {
    const grid = gridUtilities(config);
    expect(grid.find(u => u.name === 'col-span-2').value).toBe('span 2 / span 2');
    expect(grid.find(u => u.name === 'col-span-3').value).toBe('span 3 / span 3');
    expect(grid.find(u => u.name === 'col-span-4').value).toBe('span 4 / span 4');
  });

  it('col-span-full still spans the whole grid', () => {
    const grid = gridUtilities(config);
    expect(grid.find(u => u.name === 'col-span-full').value).toBe('1 / -1');
  });

  it('row-span-N uses span-first shorthand and row-span-full spans whole grid', () => {
    const grid = gridUtilities(config);
    expect(grid.find(u => u.name === 'row-span-2').value).toBe('span 2 / span 2');
    expect(grid.find(u => u.name === 'row-span-full').value).toBe('1 / -1');
  });

  it('emitted CSS never pins a start grid line for col-span', () => {
    const css = generateCSS(config, {
      utilities: getAllUtilities(config).filter(u => /^col-span-/.test(u.name) || /^row-span-/.test(u.name)),
    });
    // No rule should contain the pinning form "N / span N" (start-pinned).
    const pinned = /col-span-\d+\s*\{\s*grid-column:\s*\d+\s*\/\s*span/.exec(css);
    expect(pinned).toBeNull();
    const actual = getAllUtilities(config).find(u => u.name === 'col-span-3');
    expect(actual.value).toBe('span 3 / span 3');
  });
});
