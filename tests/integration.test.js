import { describe, it, expect } from 'vitest';
import { loadConfig } from '../src/core/config.js';
import { generateCSS } from '../src/generator/index.js';
import { getAllUtilities } from '../src/utilities/index.js';
import { extractClassNames } from '../src/scanner/extractor.js';
import { purgeUnused } from '../src/scanner/purger.js';
import { parseClass, mapUtilitiesToVariants } from '../src/core/parser.js';

describe('Integration: Purge actually reduces output', () => {
  it('purged output is smaller than full output', () => {
    const config = loadConfig();
    const fullCss = generateCSS(config);

    // Simulate purging: only request hdx_flex and hdx_p-4
    const allUtilities = getAllUtilities(config);
    const utilMap = new Map(allUtilities.map(u => [u.name, u]));
    const flexUtil = utilMap.get('flex');
    const p4Util = utilMap.get('p-4');

    const neededUtils = [
      { ...flexUtil, _requestedVariants: [] },
      { ...p4Util, _requestedVariants: [] },
    ];

    const purgedCss = generateCSS(config, { utilities: neededUtils });

    expect(purgedCss.length).toBeLessThan(fullCss.length);
  });

  it('purged output contains only requested utilities', () => {
    const config = loadConfig();
    const allUtilities = getAllUtilities(config);
    const utilMap = new Map(allUtilities.map(u => [u.name, u]));
    const flexUtil = utilMap.get('flex');

    const neededUtils = [
      { ...flexUtil, _requestedVariants: [] },
    ];

    const purgedCss = generateCSS(config, { utilities: neededUtils });

    // Should contain the requested utility
    expect(purgedCss).toContain('.hdx_flex');
    // Should NOT contain unrelated utilities
    expect(purgedCss).not.toContain('.hdx_grid');
    expect(purgedCss).not.toContain('.hdx_shadow-xl');
    expect(purgedCss).not.toContain('.hdx_rotate-45');
  });

  it('purged output includes requested variant combos', () => {
    const config = loadConfig();
    const allUtilities = getAllUtilities(config);
    const utilMap = new Map(allUtilities.map(u => [u.name, u]));
    const bgUtil = utilMap.get('bg-primary');

    const neededUtils = [
      { ...bgUtil, _requestedVariants: [['hover']] },
    ];

    const purgedCss = generateCSS(config, { utilities: neededUtils });

    expect(purgedCss).toContain('.hdx_hover_bg-primary');
    expect(purgedCss).toContain(':hover');
  });

  it('scanner extracts classes and purger filters correctly', () => {
    const html = '<div class="hdx_flex hdx_p-4 hdx_text-primary"></div>';
    const classes = extractClassNames(html);
    expect(classes.has('hdx_flex')).toBe(true);
    expect(classes.has('hdx_p-4')).toBe(true);
    expect(classes.has('hdx_text-primary')).toBe(true);

    const config = loadConfig();
    const allUtilities = getAllUtilities(config);
    const purged = purgeUnused(allUtilities, classes, config.prefix);

    // Should keep flex, p-4, text-primary
    expect(purged.find(u => u.name === 'flex')).toBeDefined();
    expect(purged.find(u => u.name === 'p-4')).toBeDefined();
    expect(purged.find(u => u.name === 'text-primary')).toBeDefined();
  });

  it('purger output feeds demand-driven generation end to end', () => {
    const html = '<button class="hdx_lg_dark_hover_bg-primary"></button>';
    const classes = extractClassNames(html);

    const config = loadConfig();
    const allUtilities = getAllUtilities(config);
    const purged = purgeUnused(allUtilities, classes, config.prefix);

    // The purger resolves deep combos via the class parser
    const bg = purged.find(u => u.name === 'bg-primary');
    expect(bg).toBeDefined();
    expect(bg._requestedVariants).toContainEqual(['lg', 'dark', 'hover']);

    // Its output drives the demand-driven generator
    const purgedCss = generateCSS(config, { utilities: purged });
    expect(purgedCss).toContain('.hdx_bg-primary');
    expect(purgedCss).not.toContain('.hdx_grid');
    expect(purgedCss).not.toContain('.hdx_shadow-xl');
  });
});

describe('Integration: Dark mode uses hdx_dark', () => {
  it('dark variant selector is .hdx_dark', () => {
    const config = loadConfig({ darkMode: 'class' });
    const css = generateCSS(config);
    expect(css).toContain('.hdx_dark');
    expect(css).not.toContain('.dark {');
  });

  it('dark variables use .hdx_dark', () => {
    const config = loadConfig({ darkMode: 'class' });
    const css = generateCSS(config);
    // Dark variables should use .hdx_dark, not .dark
    expect(css).toContain('.hdx_dark {\n  --hdx-color-background');
  });

  it('dark variant generates correct CSS rule', () => {
    const config = loadConfig({ darkMode: 'class' });
    const css = generateCSS(config, {
      utilities: [
        { name: 'bg-primary', property: 'background-color', value: 'var(--hdx-color-primary)', category: 'colors', _requestedVariants: [['dark']] },
      ],
    });
    expect(css).toContain('.hdx_dark .hdx_bg-primary');
  });
});

describe('Integration: Group/peer use hdx_group/hdx_peer', () => {
  it('group-hover variant uses hdx_group ancestor', () => {
    const config = loadConfig();
    const css = generateCSS(config, {
      utilities: [
        { name: 'text-primary', property: 'color', value: 'var(--hdx-color-primary)', category: 'colors', _requestedVariants: [['group-hover']] },
      ],
    });
    expect(css).toContain('hdx_group:hover');
    expect(css).not.toContain('.group:hover');
  });

  it('peer-hover variant uses hdx_peer ancestor', () => {
    const config = loadConfig();
    const css = generateCSS(config, {
      utilities: [
        { name: 'text-primary', property: 'color', value: 'var(--hdx-color-primary)', category: 'colors', _requestedVariants: [['peer-hover']] },
      ],
    });
    expect(css).toContain('hdx_peer:hover');
    expect(css).not.toContain('.peer:hover');
  });
});

describe('Integration: Border multi-property', () => {
  it('border utility includes both width and style', () => {
    const config = loadConfig();
    const css = generateCSS(config);
    // border should set both border-width and border-style
    expect(css).toContain('.hdx_border');
    // Verify it contains both properties
    const borderMatch = css.match(/\.hdx_border\s*\{[^}]+\}/);
    expect(borderMatch).toBeTruthy();
    if (borderMatch) {
      expect(borderMatch[0]).toContain('border-width');
      expect(borderMatch[0]).toContain('border-style');
    }
  });
});

describe('Integration: Truncate multi-property', () => {
  it('truncate sets overflow, text-overflow, and white-space', () => {
    const config = loadConfig();
    const css = generateCSS(config);
    const truncateMatch = css.match(/\.hdx_truncate\s*\{[^}]+\}/);
    expect(truncateMatch).toBeTruthy();
    if (truncateMatch) {
      expect(truncateMatch[0]).toContain('overflow: hidden');
      expect(truncateMatch[0]).toContain('text-overflow: ellipsis');
      expect(truncateMatch[0]).toContain('white-space: nowrap');
    }
  });
});

describe('Integration: Plugin validation', () => {
  it('rejects utility without name', () => {
    const config = loadConfig({
      plugins: [(ctx) => {
        ctx.addUtility({ property: 'color', value: 'red' });
      }],
    });
    expect(() => generateCSS(config)).toThrow('Utility must have a non-empty string name');
  });

  it('rejects utility with whitespace in name', () => {
    const config = loadConfig({
      plugins: [(ctx) => {
        ctx.addUtility({ name: 'my utility', property: 'color', value: 'red' });
      }],
    });
    expect(() => generateCSS(config)).toThrow('cannot contain whitespace');
  });

  it('accepts valid utility', () => {
    const config = loadConfig({
      plugins: [(ctx) => {
        ctx.addUtility({ name: 'my-color', property: 'color', value: 'red', category: 'test' });
      }],
    });
    expect(() => generateCSS(config)).not.toThrow();
  });

  it('accepts utility with css string', () => {
    const config = loadConfig({
      plugins: [(ctx) => {
        ctx.addUtility({ name: 'my-multiple', css: 'color: red;\nfont-size: 14px;', category: 'test' });
      }],
    });
    expect(() => generateCSS(config)).not.toThrow();
  });
});

describe('Integration: Configurable reset', () => {
  it('reset is included by default', () => {
    const config = loadConfig();
    const css = generateCSS(config);
    expect(css).toContain('box-sizing: border-box');
  });

  it('reset is excluded when disabled', () => {
    const config = loadConfig({ reset: false });
    const css = generateCSS(config);
    expect(css).not.toContain('box-sizing: border-box');
    expect(css).not.toContain('/* HDX CSS — Reset */');
  });
});

describe('Integration: Deterministic output', () => {
  it('generating CSS twice produces identical output', () => {
    const config = loadConfig();
    const css1 = generateCSS(config);
    const css2 = generateCSS(config);
    expect(css1).toBe(css2);
  });
});

describe('Integration: Dark mode strategy', () => {
  it('media strategy does not produce .hdx_dark class', () => {
    const config = loadConfig({ darkMode: 'media' });
    const css = generateCSS(config);
    expect(css).not.toContain('.hdx_dark {');
    expect(css).toContain('@media (prefers-color-scheme: dark)');
  });

  it('both strategy produces both', () => {
    const config = loadConfig({ darkMode: 'both' });
    const css = generateCSS(config);
    expect(css).toContain('.hdx_dark {');
    expect(css).toContain('@media (prefers-color-scheme: dark)');
  });
});
