import { describe, it, expect } from 'vitest';
import { loadConfig } from '../../src/core/config.js';
import { getDefaultConfig } from '../../src/core/config.js';
import { generateCSS } from '../../src/generator/index.js';
import { getAllUtilities } from '../../src/utilities/index.js';
import { getAllComponents } from '../../src/components/index.js';
import { purgeUnused, findUnknownClasses } from '../../src/scanner/purger.js';
import { extractClassNames } from '../../src/scanner/extractor.js';
import { resolveArbitraryUtility } from '../../src/generator/arbitrary.js';
import { runPlugins } from '../../src/plugins/index.js';
import { gridUtilities } from '../../src/utilities/grid.js';
import { containerComponent } from '../../src/components/container.js';

const config = loadConfig();

describe('Regression: scale utilities', () => {
  it('scale-N sets both --scale-x and --scale-y', () => {
    const utils = getAllUtilities(config);
    const s = utils.find(u => u.name === 'scale-150');
    expect(s).toBeDefined();
    expect(s.css).toContain('--scale-x: 1.5');
    expect(s.css).toContain('--scale-y: 1.5');
  });

  it('scale-100 is the identity reset', () => {
    const css = generateCSS(config, { utilities: [{ name: 'scale-100', css: '--scale-x: 1;\n--scale-y: 1;', category: 'transforms' }] });
    expect(css).toContain('--scale-x: 1');
  });

  it('single-axis scale-x-* / scale-y-* exist and only touch their axis', () => {
    const utils = getAllUtilities(config);
    const sx = utils.find(u => u.name === 'scale-x-150');
    const sy = utils.find(u => u.name === 'scale-y-150');
    expect(sx).toBeDefined();
    expect(sy).toBeDefined();
    expect(sx.property).toBe('--scale-x');
    expect(sx.value).toBe('1.5');
    expect(sy.property).toBe('--scale-y');
    expect(sy.value).toBe('1.5');
  });
});

describe('Regression: no duplicate utility names', () => {
  it('getAllUtilities emits unique names', () => {
    const utils = getAllUtilities(config);
    const seen = new Set();
    const dups = [];
    for (const u of utils) {
      if (seen.has(u.name)) dups.push(u.name);
      seen.add(u.name);
    }
    expect(dups).toEqual([]);
  });

  it('min-w-0 and min-h-0 come only from the spacing scale', () => {
    const utils = getAllUtilities(config);
    expect(utils.filter(u => u.name === 'min-w-0')).toHaveLength(1);
    expect(utils.filter(u => u.name === 'min-h-0')).toHaveLength(1);
    expect(utils.find(u => u.name === 'min-w-0').value).toBe('0px');
  });

  it('gap-0 is emitted from the spacing scale', () => {
    const utils = getAllUtilities(config);
    expect(utils.find(u => u.name === 'gap-0')).toEqual({
      name: 'gap-0', property: 'gap', value: '0px', category: 'flexbox',
    });
  });
});

describe('Regression: corner radius survives purge (P1)', () => {
  it('purged rounded-t-md keeps top-left and top-right radius', () => {
    const allUtilities = getAllUtilities(config);
    const purged = purgeUnused(allUtilities, new Set(['hdx_rounded-t-md']), 'hdx_', [], config);
    const css = generateCSS(config, { utilities: purged });

    const ruleMatch = css.match(/\.hdx_rounded-t-md\s*\{([^}]+)\}/);
    expect(ruleMatch).toBeTruthy();
    if (ruleMatch) {
      expect(ruleMatch[1]).toContain('border-top-left-radius');
      expect(ruleMatch[1]).toContain('border-top-right-radius');
    }
  });
});

describe('Regression: translate variants', () => {
  it('no dead double-dash translate names remain', () => {
    const utils = getAllUtilities(config);
    expect(utils.some(u => u.name.includes('translate--'))).toBe(false);
  });

  it('both translate axes are present for full negatives like -translate-x-full', () => {
    const utils = getAllUtilities(config);
    const full = utils.find(u => u.name === '-translate-x-full');
    const negHalf = utils.find(u => u.name === '-translate-y-1/2');
    expect(full).toBeDefined();
    expect(negHalf).toBeDefined();
  });
});

describe('Regression: negative arbitrary values', () => {
  it('-mt-[13px] emits margin-top: -13px', () => {
    const result = resolveArbitraryUtility('-mt-[13px]', config);
    expect(result).toBeDefined();
    expect(result.value).toBe('-13px');
  });

  it('-translate-x-[4px] keeps the sign out of the property value map', () => {
    const result = resolveArbitraryUtility('-translate-x-[4px]', config);
    expect(result).toBeDefined();
    expect(result.property).toBe('--translate-x');
    expect(result.value).toBe('-4px');
  });

  it('non-negatable negative arbitrary values are rejected', () => {
    const result = resolveArbitraryUtility('-text-[13px]', config);
    expect(result).toBeNull();
  });
});

describe('Regression: configurable prefix is prefix-scoped everywhere', () => {
  const myConfig = loadConfig({ prefix: 'my_' });

  it('dark variant emits .my_dark ancestor, never .hdx_dark', () => {
    const css = generateCSS(myConfig, {
      utilities: [
        { name: 'bg-primary', property: 'background-color', value: 'var(--my-color-primary)', category: 'colors', _requestedVariants: [['dark']] },
      ],
    });
    expect(css).toContain('.my_dark .my_dark_bg-primary');
    expect(css).not.toContain('hdx_dark');
  });

  it('dark variables are scoped under .my_dark', () => {
    const css = generateCSS(myConfig);
    expect(css).toContain('.my_dark {');
    expect(css).not.toContain('hdx_dark');
  });

  it('ring color falls back to a prefix-scoped variable', () => {
    const css = generateCSS(myConfig);
    expect(css).toContain('var(--my-ring-color, #2563EB)');
  });

  it('gradient stop variables are prefix-scoped', () => {
    const allUtilities = getAllUtilities(myConfig);
    const from = allUtilities.find(u => u.name === 'from-primary');
    const dir = allUtilities.find(u => u.name === 'bg-gradient-to-r');
    expect(from).toBeDefined();
    expect(dir).toBeDefined();
    const css = generateCSS(myConfig, { utilities: [from, { ...dir, name: 'bg-gradient-to-r' }] });
    expect(css).toContain('--my-gradient-stops');
  });

  it('placeholder and divide colors use prefix-scoped variables', () => {
    const allUtilities = getAllUtilities(myConfig);
    const place = allUtilities.find(u => u.name === 'placeholder-primary');
    const divide = allUtilities.find(u => u.name === 'divide-primary');
    expect(place).toBeDefined();
    expect(divide).toBeDefined();
    const css = generateCSS(myConfig, { utilities: [place, divide] });
    expect(css).toContain('var(--my-color-primary)');
    expect(css).not.toContain('--hdx-color-primary');
  });
});

describe('Regression: divide-{color} is a real border-color utility', () => {
  it('emits border-color via the child combinator selector', () => {
    const allUtilities = getAllUtilities(config);
    const divide = allUtilities.find(u => u.name === 'divide-primary');
    expect(divide).toBeDefined();
    expect(divide.selector).toContain(':not([hidden])');
    const css = generateCSS(config, { utilities: [divide] });
    expect(css).toContain('border-color: var(--hdx-color-primary)');
  });
});

describe('Regression: darkMode none produces no dark prefix', () => {
  it('parser yields no dark variant', () => {
    const noConfig = loadConfig({ darkMode: 'none' });
    const css = generateCSS(noConfig);
    expect(css).not.toContain('hdx_dark');
    expect(css).not.toContain('prefers-color-scheme');
  });
});

describe('Regression: darkMode both through the purger', () => {
  it('purged output emits both class-driven and media-driven dark rules', () => {
    const bothConfig = loadConfig({ darkMode: 'both' });
    const allUtilities = getAllUtilities(bothConfig);
    const purged = purgeUnused(allUtilities, new Set(['hdx_dark_bg-primary', 'hdx_dark_hover_bg-primary']), 'hdx_', [], bothConfig);
    const css = generateCSS(bothConfig, { utilities: purged });

    expect(css).toContain('.hdx_dark .hdx_dark_bg-primary');
    expect(css).toContain('@media (prefers-color-scheme: dark)');
    expect(css).toContain('.hdx_dark .hdx_dark_hover_bg-primary:hover');
    expect(css).toContain('.hdx_dark_hover_bg-primary:hover');
  });
});

describe('Regression: plugin variants resolve in purge scans', () => {
  const pluginConfig = loadConfig({
    plugins: [(ctx) => {
      ctx.addUtility({ name: 'glow', property: 'box-shadow', value: '0 0 12px lime', category: 'test' });
      ctx.addVariant({
        name: 'swipe',
        prefix: 'swipe_',
        type: 'ancestor',
        selector: (sel) => '.swipe-parent &',
      });
    }],
  });

  it('hdx_swipe_glow resolves to the plugin utility', () => {
    const { registry } = runPlugins(pluginConfig);
    const extraVariantPrefixes = registry.variants.map(v => v.prefix.replace(/_$/, ''));
    const allUtilities = [...getAllUtilities(pluginConfig), ...registry.utilities];

    const purged = purgeUnused(allUtilities, new Set(['hdx_swipe_glow']), 'hdx_', [], pluginConfig, extraVariantPrefixes);
    expect(purged).toHaveLength(1);
    expect(purged[0].name).toBe('glow');
    expect(purged[0]._requestedVariants).toContainEqual(['swipe']);

    const css = generateCSS(pluginConfig, { utilities: purged });
    expect(css).toContain('.swipe-parent .hdx_swipe_glow');
  });

  it('findUnknownClasses does not flag plugin-variant classes', () => {
    const { registry } = runPlugins(pluginConfig);
    const extraVariantPrefixes = registry.variants.map(v => v.prefix.replace(/_$/, ''));
    const allUtilities = [...getAllUtilities(pluginConfig), ...registry.utilities];
    const unknown = findUnknownClasses(allUtilities, new Set(['hdx_swipe_glow']), 'hdx_', pluginConfig, undefined, extraVariantPrefixes);
    expect(unknown).toHaveLength(0);
  });
});

describe('Regression: container breakpoints come from the theme', () => {
  it('container-md uses theme.breakpoints', () => {
    const cfg = loadConfig();
    cfg.theme.breakpoints.custom = '900px';
    const utils = containerComponent(cfg);
    const medium = utils.find(u => u.name === 'container-md');
    const custom = utils.find(u => u.name === 'container-custom');
    expect(medium).toBeDefined();
    expect(custom).toBeDefined();
    expect(custom.css).toContain('900px');
    expect(medium.css).toContain('768px');
  });
});

describe('Regression: extractor prefix parameter', () => {
  it('quoted class attributes extract every token regardless of prefix', () => {
    const html = '<div class="my_flex hdx_p-4"></div>';
    expect([...extractClassNames(html, 'my_')].sort()).toEqual(['hdx_p-4', 'my_flex']);
  });

  it('tags template literals and string literals with a custom prefix', () => {
    const html = '<div className={`my_flex ${"my_p-4"}`}></div>';
    const names = extractClassNames(html, 'my_');
    expect(names.has('my_flex')).toBe(true);
    expect(names.has('my_p-4')).toBe(true);
  });
});

describe('Regression: grid span-first shorthand intact', () => {
  it('grid-cols utilities remain unchanged', () => {
    const utils = gridUtilities(config);
    expect(utils.find(u => u.name === 'grid-cols-3').value).toBe('repeat(3, minmax(0, 1fr))');
  });
});

describe('Regression: default config shape', () => {
  it('getDefaultConfig exposes the documented defaults', () => {
    const d = getDefaultConfig();
    expect(d.prefix).toBe('hdx_');
    expect(d.darkMode).toBe('class');
    expect(d.reset).toBe(true);
    expect(d.components).toBe(true);
    expect(d.content).toEqual([]);
    expect(d.plugins).toEqual([]);
  });

  it('default theme carries colors, spacing and breakpoints', () => {
    const d = getDefaultConfig();
    expect(d.theme.colors.primary).toBe('#2563EB');
    expect(d.theme.spacing['4']).toBe('1rem');
    expect(d.theme.breakpoints.lg).toBe('1024px');
  });
});