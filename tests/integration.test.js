import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadConfig } from '../src/core/config.js';
import { generateCSS } from '../src/generator/index.js';
import { getAllUtilities } from '../src/utilities/index.js';
import { extractClassNames } from '../src/scanner/extractor.js';
import { purgeUnused } from '../src/scanner/purger.js';
import { generatePurgedBuildCss } from '../src/scanner/scan.js';
import { parseClass, mapUtilitiesToVariants } from '../src/core/parser.js';

describe('Integration: Purge actually reduces output', () => {
  it('purged output is smaller than full output', () => {
    const config = loadConfig();
    const fullCss = generateCSS(config);

    // Simulate purging: only request hdx-flex and hdx-p-4
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
    expect(purgedCss).toContain('.hdx-flex');
    // Should NOT contain unrelated utilities
    expect(purgedCss).not.toContain('.hdx-grid');
    expect(purgedCss).not.toContain('.hdx-shadow-xl');
    expect(purgedCss).not.toContain('.hdx-rotate-45');
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

    expect(purgedCss).toContain('.hdx-hover_bg-primary');
    expect(purgedCss).toContain(':hover');
  });

  it('scanner extracts classes and purger filters correctly', () => {
    const html = '<div class="hdx-flex hdx-p-4 hdx-text-primary"></div>';
    const classes = extractClassNames(html);
    expect(classes.has('hdx-flex')).toBe(true);
    expect(classes.has('hdx-p-4')).toBe(true);
    expect(classes.has('hdx-text-primary')).toBe(true);

    const config = loadConfig();
    const allUtilities = getAllUtilities(config);
    const purged = purgeUnused(allUtilities, classes, config.prefix);

    // Should keep flex, p-4, text-primary
    expect(purged.find(u => u.name === 'flex')).toBeDefined();
    expect(purged.find(u => u.name === 'p-4')).toBeDefined();
    expect(purged.find(u => u.name === 'text-primary')).toBeDefined();
  });

  it('purger output feeds demand-driven generation end to end', () => {
    const html = '<button class="hdx-lg_dark_hover_bg-primary"></button>';
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
    expect(purgedCss).toContain('.hdx-bg-primary');
    expect(purgedCss).not.toContain('.hdx-grid');
    expect(purgedCss).not.toContain('.hdx-shadow-xl');
  });

  it('design-token completeness additions survive a purge build end to end', () => {
    const html = `<div class="hdx-z-toast hdx-bg-gray-500 hdx-p-0.5 hdx-hover_bg-primary">
  <button class="hdx-btn-danger">Delete</button>
</div>`;
    const classes = extractClassNames(html);
    expect(classes.has('hdx-z-toast')).toBe(true);
    expect(classes.has('hdx-bg-gray-500')).toBe(true);
    expect(classes.has('hdx-p-0.5')).toBe(true);

    const config = loadConfig();
    const allUtilities = getAllUtilities(config);
    const purged = purgeUnused(allUtilities, classes, config.prefix);

    expect(purged.find(u => u.name === 'z-toast')).toBeDefined();
    expect(purged.find(u => u.name === 'bg-gray-500')).toBeDefined();
    expect(purged.find(u => u.name === 'p-0.5')).toBeDefined();
    expect(purged.find(u => u.name === 'bg-primary')._requestedVariants).toContainEqual(['hover']);

    const css = generateCSS(config, { utilities: purged });
    expect(css).toContain('.hdx-z-toast { z-index: 1500; }');
    expect(css).toContain('.hdx-bg-gray-500 { background-color: var(--hdx-color-gray-500); }');
    expect(css).toContain('.hdx-p-0\\.5 { padding: 0.125rem; }');
    expect(css).toContain('.hdx-hover_bg-primary:hover');
    // Button component + its press states ship regardless of used utilities.
    expect(css).toContain('.hdx-btn-danger:hover');
    expect(css).toContain('.hdx-btn-danger:active');
    // Dark action color and gray token land in the .hdx-dark token layer.
    expect(css).toContain('--hdx-color-danger: #F87171');
    expect(css).toContain('--hdx-color-gray-500: #64748B');
    // Unrelated utilities still stay out.
    expect(css).not.toContain('.hdx-z-50');
    expect(css).not.toContain('.hdx-bg-danger');
  });
});

describe('Integration: Dark mode uses hdx-dark', () => {
  it('dark variant selector is .hdx-dark', () => {
    const config = loadConfig({ darkMode: 'class' });
    const css = generateCSS(config);
    expect(css).toContain('.hdx-dark');
    expect(css).not.toContain('.dark {');
  });

  it('dark variables use .hdx-dark', () => {
    const config = loadConfig({ darkMode: 'class' });
    const css = generateCSS(config);
    // Dark variables should use .hdx-dark, not .dark
    expect(css).toContain('.hdx-dark {\n  --hdx-color-background');
  });

  it('dark variant generates correct CSS rule', () => {
    const config = loadConfig({ darkMode: 'class' });
    const css = generateCSS(config, {
      utilities: [
        { name: 'bg-primary', property: 'background-color', value: 'var(--hdx-color-primary)', category: 'colors', _requestedVariants: [['dark']] },
      ],
    });
    expect(css).toContain('.hdx-dark .hdx-dark_bg-primary');
  });
});

describe('Integration: Combined variant selectors', () => {
  it('responsive + state combo keeps the hover selector inside the media query', () => {
    const config = loadConfig();
    const css = generateCSS(config, {
      utilities: [
        { name: 'bg-primary', property: 'background-color', value: 'var(--hdx-color-primary)', category: 'colors', _requestedVariants: [['md', 'hover']] },
      ],
    });
    expect(css).toContain('@media (min-width: 768px) {');
    expect(css).toContain('.hdx-md_hover_bg-primary:hover');
  });

  it('responsive + dark combo places the dark ancestor inside the media query', () => {
    const config = loadConfig();
    const css = generateCSS(config, {
      utilities: [
        { name: 'bg-primary', property: 'background-color', value: 'var(--hdx-color-primary)', category: 'colors', _requestedVariants: [['md', 'dark']] },
      ],
    });
    expect(css).toContain('@media (min-width: 768px) {');
    expect(css).toContain('.hdx-dark .hdx-md_dark_bg-primary');
    expect(css).not.toContain('.hdx-dark .hdx-bg-primary');
  });

  it('responsive + dark + state combo emits fully qualified selector behind the dark ancestor', () => {
    const config = loadConfig();
    const css = generateCSS(config, {
      utilities: [
        { name: 'bg-primary', property: 'background-color', value: 'var(--hdx-color-primary)', category: 'colors', _requestedVariants: [['md', 'dark', 'hover']] },
      ],
    });
    expect(css).toContain('@media (min-width: 768px) {');
    expect(css).toContain('.hdx-dark .hdx-md_dark_hover_bg-primary:hover');
  });
});

describe('Integration: Group/peer use hdx-group/hdx-peer', () => {
  it('group-hover variant uses hdx-group ancestor', () => {
    const config = loadConfig();
    const css = generateCSS(config, {
      utilities: [
        { name: 'text-primary', property: 'color', value: 'var(--hdx-color-primary)', category: 'colors', _requestedVariants: [['group-hover']] },
      ],
    });
    expect(css).toContain('hdx-group:hover');
    expect(css).not.toContain('.group:hover');
  });

  it('peer-hover variant uses hdx-peer ancestor', () => {
    const config = loadConfig();
    const css = generateCSS(config, {
      utilities: [
        { name: 'text-primary', property: 'color', value: 'var(--hdx-color-primary)', category: 'colors', _requestedVariants: [['peer-hover']] },
      ],
    });
    expect(css).toContain('hdx-peer:hover');
    expect(css).not.toContain('.peer:hover');
  });
});

describe('Integration: Border multi-property', () => {
  it('border utility includes both width and style', () => {
    const config = loadConfig();
    const css = generateCSS(config);
    // border should set both border-width and border-style
    expect(css).toContain('.hdx-border');
    // Verify it contains both properties
    const borderMatch = css.match(/\.hdx-border\s*\{[^}]+\}/);
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
    const truncateMatch = css.match(/\.hdx-truncate\s*\{[^}]+\}/);
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

describe('Integration: Cascade ordering (P1 regression)', () => {
  it('base utilities precede all responsive media blocks in full output', () => {
    const config = loadConfig();
    const css = generateCSS(config);

    const baseInfoIdx = css.indexOf('.hdx-hidden');
    expect(baseInfoIdx).toBeGreaterThan(-1);

    // Every breakpoint media query must come after the base rule. This is the
    // ordering contract that lets `hdx-hidden hdx-lg_flex` show at >= lg.
    for (const [bp, width] of Object.entries(config.theme.breakpoints)) {
      const mediaBlock = css.indexOf('@media (min-width: ' + width + ')');
      expect(mediaBlock).toBeGreaterThan(-1);
      expect(baseInfoIdx).toBeLessThan(mediaBlock);
    }
  });

  it('responsive display variant is emitted inside the media block after hidden base', () => {
    const config = loadConfig();
    const css = generateCSS(config);

    const hiddenPos = css.indexOf('.hdx-hidden { display: none;');
    expect(hiddenPos).toBeGreaterThan(-1);

    // Find the media block that actually wraps the hdx-lg_flex rule and confirm
    // it contains display:flex and comes after the hidden base.
    const lgFlexRule = '.hdx-lg_flex { display: flex; }';
    expect(css).toContain(lgFlexRule);
    expect(hiddenPos).toBeLessThan(css.indexOf(lgFlexRule));
  });

  it('purged output also keeps base rules before responsive media blocks', () => {
    const config = loadConfig();
    const allUtilities = getAllUtilities(config);
    const utilMap = new Map(allUtilities.map(u => [u.name, u]));

    const neededUtils = [
      { ...utilMap.get('hidden'), _requestedVariants: [] },
      { ...utilMap.get('flex'), _requestedVariants: [['lg']] },
    ];

    const css = generateCSS(config, { utilities: neededUtils });

    const hiddenPos = css.indexOf('.hdx-hidden { display: none;');
    const lgPos = css.indexOf('@media (min-width: 1024px)');
    expect(hiddenPos).toBeLessThan(lgPos);
  });

  it('grid-cols-N base precedes its own responsive variants in purged output', () => {
    // The exact dashboard scenario from the audit: a base grid-cols-1 must not
    // beat its sm/xl "show" variants at any breakpoint.
    const config = loadConfig();
    const allUtilities = getAllUtilities(config);
    const utilMap = new Map(allUtilities.map(u => [u.name, u]));

    const neededUtils = [
      { ...utilMap.get('grid-cols-1'), _requestedVariants: [] },
      { ...utilMap.get('grid-cols-2'), _requestedVariants: [['sm']] },
      { ...utilMap.get('grid-cols-4'), _requestedVariants: [['xl']] },
    ];

    const css = generateCSS(config, { utilities: neededUtils });

    const basePos = css.indexOf('.hdx-grid-cols-1 {');
    expect(basePos).toBeGreaterThan(-1);

    for (const width of ['640px', '1280px']) {
      const mediaPos = css.indexOf('@media (min-width: ' + width + ')');
      expect(mediaPos).toBeGreaterThan(-1);
      expect(basePos).toBeLessThan(mediaPos);
    }
  });
});

describe('Integration: Media blocks grouped for inspection', () => {
  it('all breakpoint media queries are contiguous near the end of the utilities section', () => {
    const config = loadConfig();
    const css = generateCSS(config);
    const componentsIdx = css.indexOf('/* HDX CSS — Components */');
    const utilitiesSection = css.slice(0, componentsIdx);
    const lines = utilitiesSection.split('\n');

    const mediaLines = [];
    let firstMedia = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('@media (min-width')) {
        if (firstMedia === -1) firstMedia = i;
        mediaLines.push(i);
      }
    }

    expect(mediaLines.length).toBeGreaterThan(0);

    // Media blocks are contiguous: no unindented base rule appears between the
    // first and last breakpoint media query.
    for (let i = firstMedia; i <= mediaLines[mediaLines.length - 1]; i++) {
      const raw = lines[i];
      const t = raw.trim();
      if (/^\.hdx-.+\{/.test(t)) {
        expect(raw.startsWith('  ')).toBe(true);
      }
    }
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
  it('media strategy does not produce .hdx-dark class', () => {
    const config = loadConfig({ darkMode: 'media' });
    const css = generateCSS(config);
    expect(css).not.toContain('.hdx-dark {');
    expect(css).toContain('@media (prefers-color-scheme: dark)');
  });

  it('both strategy produces both', () => {
    const config = loadConfig({ darkMode: 'both' });
    const css = generateCSS(config);
    expect(css).toContain('.hdx-dark {');
    expect(css).toContain('@media (prefers-color-scheme: dark)');
  });
});

describe('Integration: Component layer gating (P1/1.7 regression)', () => {
  it('built-in components are emitted by default', () => {
    const config = loadConfig();
    const css = generateCSS(config);
    expect(css).toContain('/* HDX CSS — Components */');
    expect(css).toContain('.hdx-btn {');
  });

  it('components are omitted when config.components === false', () => {
    const config = loadConfig({ components: false });
    const css = generateCSS(config);
    expect(css).not.toContain('/* HDX CSS — Components */');
    expect(css).not.toContain('.hdx-btn {');
  });

  it('purged utility output remains correct when components are disabled', () => {
    const config = loadConfig({ components: false });
    const css = generateCSS(config, {
      utilities: [{
        name: 'flex',
        property: 'display',
        value: 'flex',
        category: 'display',
        _requestedVariants: [],
      }],
    });
    expect(css).toContain('.hdx-flex { display: flex; }');
    expect(css).not.toContain('.hdx-btn');
  });
});

describe('Integration: col-span emission (P1/1.2 regression)', () => {
  it('purged output uses span-first shorthand for col-span-N', () => {
    const config = loadConfig();
    const allUtilities = getAllUtilities(config);
    const utilMap = new Map(allUtilities.map(u => [u.name, u]));

    const css = generateCSS(config, {
      utilities: [
        { ...utilMap.get('col-span-2'), _requestedVariants: [] },
      ],
    });
    expect(css).toContain('.hdx-col-span-2 { grid-column: span 2 / span 2; }');
    expect(css).not.toContain('grid-column: 2 / span 2');
  });
});

describe('Integration: Component purging (demand-driven components)', () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hdx-comp-purge-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  const buildWithContent = async (html) => {
    const htmlPath = path.join(tmpDir, 'index.html');
    fs.writeFileSync(htmlPath, html);
    const config = loadConfig();
    config.content = [path.join(tmpDir, '*.html')];
    return generatePurgedBuildCss(config);
  };

  it('drops an unused component (modal) from a purged build when no hdx-modal* appears in content', async () => {
    const css = await buildWithContent('<div class="hdx-flex hdx-p-4"></div>');

    expect(css).toContain('.hdx-flex');
    expect(css).not.toContain('.hdx-modal-overlay');
    expect(css).not.toContain('.hdx-modal {');
    expect(css).not.toContain('.hdx-modal-header');
    // Unused utility-only components are equally purged.
    expect(css).not.toContain('.hdx-btn {');
    expect(css).not.toContain('.hdx-card');
  });

  it('keeps a component (and its states blocks) when its class appears in content', async () => {
    const css = await buildWithContent('<button class="hdx-btn hdx-btn-primary">Go</button>');

    expect(css).toContain('.hdx-btn {');
    expect(css).toContain('.hdx-btn-primary {');
    // Interactive states ship with their base definition.
    expect(css).toContain('.hdx-btn-primary:hover');
    expect(css).toContain('.hdx-btn-primary:active');
    // Unrelated components stay out of the purged build.
    expect(css).not.toContain('.hdx-modal-overlay');
    expect(css).not.toContain('.hdx-input');
  });

  it('composed components resolve independently (btn + btn-primary)', async () => {
    const css = await buildWithContent('<button class="hdx-btn hdx-btn-primary"></button>');

    expect(css).toContain('.hdx-btn {');
    expect(css).toContain('.hdx-btn-primary {');
  });

  it('keeps a component when only its class name is the sole usage', async () => {
    const css = await buildWithContent('<div class="hdx-modal-overlay"><div class="hdx-modal">x</div></div>');

    expect(css).toContain('.hdx-modal-overlay');
    expect(css).toContain('.hdx-modal {');
    expect(css).not.toContain('.hdx-btn {');
  });

  it('keeps safelisted components even when absent from content', async () => {
    const htmlPath = path.join(tmpDir, 'index.html');
    fs.writeFileSync(htmlPath, '<div class="hdx-flex"></div>');
    const config = loadConfig();
    config.content = [path.join(tmpDir, '*.html')];
    config.safelist = ['hdx-modal'];

    const css = await generatePurgedBuildCss(config);
    expect(css).toContain('.hdx-modal {');
    expect(css).not.toContain('.hdx-btn {');
  });
});
