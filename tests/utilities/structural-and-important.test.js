import { describe, it, expect } from 'vitest';
import { loadConfig } from '../../src/core/config.js';
import { generateCSS } from '../../src/generator/index.js';
import { spacingUtilities } from '../../src/utilities/spacing.js';
import { bordersUtilities } from '../../src/utilities/borders.js';
import { backgroundsUtilities } from '../../src/utilities/backgrounds.js';
import { colorsUtilities } from '../../src/utilities/colors.js';
import { interactionUtilities } from '../../src/utilities/interaction.js';
import { parseClass } from '../../src/core/parser.js';
import { markImportant } from '../../src/generator/variant-pipeline.js';

const config = loadConfig();

describe('P2: interaction utilities', () => {
  it('generates cursor utilities', () => {
    const utils = interactionUtilities();
    expect(utils.find(u => u.name === 'cursor-pointer')).toEqual({
      name: 'cursor-pointer', property: 'cursor', value: 'pointer', category: 'interaction',
    });
    expect(utils.find(u => u.name === 'cursor-not-allowed')).toBeDefined();
  });

  it('generates user-select, appearance and resize utilities', () => {
    const utils = interactionUtilities();
    expect(utils.find(u => u.name === 'select-none')).toEqual({
      name: 'select-none', property: 'user-select', value: 'none', category: 'interaction',
    });
    expect(utils.find(u => u.name === 'appearance-none')).toBeDefined();
    expect(utils.find(u => u.name === 'resize-y')).toBeDefined();
  });

  it('emits working CSS for the new interaction utilities', () => {
    const css = generateCSS(config);
    expect(css).toContain('.hdx-cursor-pointer { cursor: pointer; }');
    expect(css).toContain('.hdx-select-none { user-select: none; }');
    expect(css).toContain('.hdx-appearance-none { appearance: none; }');
    expect(css).toContain('.hdx-resize-y { resize: vertical; }');
  });
});

describe('P2: space-* and divide-* child combinators', () => {
  const combinator = ' > :not([hidden]) ~ :not([hidden])';

  it('space-y-4 carries the child combinator', () => {
    const utils = spacingUtilities(config);
    const spaceY4 = utils.find(u => u.name === 'space-y-4');
    expect(spaceY4).toBeDefined();
    expect(spaceY4.selector).toBe(combinator);
    expect(spaceY4.property).toBe('margin-block-start');
    expect(spaceY4.value).toBe('1rem');
  });

  it('space-x-2 carries the child combinator', () => {
    const utils = spacingUtilities(config);
    const spaceX2 = utils.find(u => u.name === 'space-x-2');
    expect(spaceX2.selector).toBe(combinator);
    expect(spaceX2.property).toBe('margin-inline-start');
  });

  it('divide-x and divide-y emit the child combinator rule', () => {
    const utils = bordersUtilities(config);
    const divideX = utils.find(u => u.name === 'divide-x');
    const divideY = utils.find(u => u.name === 'divide-y');
    expect(divideX.selector).toBe(combinator);
    expect(divideY.selector).toBe(combinator);

    const css = generateCSS(config);
    expect(css).toContain('.hdx-divide-x' + combinator);
    expect(css).toContain('.hdx-divide-y' + combinator);
  });

  it('responsive variant of space-y-4 keeps the combinator inside the media query', () => {
    const css = generateCSS(config);
    expect(css).toContain('@media (min-width: 768px) {');
    expect(css).toMatch(/\.hdx-md_space-y-4 > :not\(\[hidden\]\) ~ :not\(\[hidden\]\) \{ margin-block-start:/);
  });

  it('parses hdx-md_space-y-4 into responsive variant + space-y-4 utility', () => {
    const parsed = parseClass('hdx-md_space-y-4', 'hdx-');
    expect(parsed.valid).toBe(true);
    expect(parsed.variants).toEqual(['md']);
    expect(parsed.utility).toBe('space-y-4');
  });
});

describe('P2: gradient utilities', () => {
  it('generates bg-gradient-to-* directions', () => {
    const utils = backgroundsUtilities(config);
    for (const dir of ['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl']) {
      expect(utils.find(u => u.name === 'bg-gradient-to-' + dir)).toBeDefined();
    }
  });

  it('generates from-*, via-*, to-* stops that compose --hdx-gradient-stops', () => {
    const utils = colorsUtilities(config);
    const from = utils.find(u => u.name === 'from-primary');
    const via = utils.find(u => u.name === 'via-primary');
    const to = utils.find(u => u.name === 'to-primary');

    expect(from.css).toContain('--hdx-gradient-from');
    expect(from.css).toContain('--hdx-gradient-stops');
    expect(via.css).toContain('--hdx-gradient-stops');
    expect(to.css).toContain('--hdx-gradient-stops');
  });

  it('emits renderable gradient CSS', () => {
    const css = generateCSS(config);
    expect(css).toContain('.hdx-bg-gradient-to-r { background-image: linear-gradient(to right, var(--hdx-gradient-stops, transparent)); }');
    expect(css).toContain('.hdx-from-primary');
    expect(css).toContain('.hdx-via-primary');
    expect(css).toContain('.hdx-to-primary');
  });
});

describe('P2: important variant', () => {
  it('hdx-important_bg-primary emits a !important declaration', () => {
    const css = generateCSS(config, {
      utilities: [
        { name: 'bg-primary', property: 'background-color', value: 'var(--hdx-color-primary)', category: 'colors', _requestedVariants: [['important']] },
      ],
    });
    expect(css).toContain('.hdx-important_bg-primary { background-color: var(--hdx-color-primary) !important; }');
  });

  it('parser resolves hdx-important_bg-primary', () => {
    const parsed = parseClass('hdx-important_bg-primary', 'hdx-');
    expect(parsed.valid).toBe(true);
    expect(parsed.variants).toEqual(['important']);
    expect(parsed.utility).toBe('bg-primary');
  });

  it('important combines with responsive and state variants', () => {
    const css = generateCSS(config, {
      utilities: [
        { name: 'flex', property: 'display', value: 'flex', category: 'display', _requestedVariants: [['md', 'important']] },
        { name: 'text-primary', property: 'color', value: 'var(--hdx-color-primary)', category: 'colors', _requestedVariants: [['hover', 'important']] },
      ],
    });
    expect(css).toContain('@media (min-width: 768px) {');
    expect(css).toContain('.hdx-md_important_flex { display: flex !important; }');
    expect(css).toContain('.hdx-hover_important_text-primary:hover { color: var(--hdx-color-primary) !important; }');
  });

  it('does not double-mark declarations that already carry !important', () => {
    // A value (plugin utility or arbitrary value) that already ends in
    // !important must not be injected with a second one — `!important !important`
    // is invalid CSS that browsers drop. (Task 6 hardening)
    const css = generateCSS(config, {
      utilities: [
        { name: 'w-auto', property: 'width', value: 'auto !important', category: 'sizing', _requestedVariants: [['important']] },
        { name: 'p-1', css: 'padding: 0 !important;\nmargin: 0;', category: 'spacing', _requestedVariants: [['important']] },
      ],
    });

    expect(css).toContain('.hdx-important_w-auto { width: auto !important; }');
    expect(css).not.toContain('!important !important');

    // Multi-declaration rules: only unmarked declarations gain the flag.
    expect(css).toContain('padding: 0 !important;');
    expect(css).toContain('margin: 0 !important;');
  });

  it('does not corrupt semicolons inside quoted string values', () => {
    const css = generateCSS(config, {
      utilities: [
        { name: 'content', property: 'content', value: "';'", category: 'content', _requestedVariants: [['important']] },
        { name: 'msg', property: 'content', value: "'a;b'", category: 'content', _requestedVariants: [['important']] },
      ],
    });
    // The literal `;` inside the quoted value must survive untouched; only the
    // declaration-terminating `;` gains the flag. (Task: harden markImportant
    // against quoted semicolons.)
    expect(css).toContain(".hdx-important_content { content: ';' !important; }");
    expect(css).toContain(".hdx-important_msg { content: 'a;b' !important; }");
    expect(css).not.toContain("content: ' !important;'");
  });
});

describe('markImportant helper', () => {
  it('leaves already-important declarations untouched', () => {
    expect(markImportant('.a { x: 1 !important; }')).toBe('.a { x: 1 !important; }');
    expect(markImportant('.a { x: 1 ! important; }')).toBe('.a { x: 1 ! important; }');
    expect(markImportant('.a { x: 1 !IMPORTANT; }')).toBe('.a { x: 1 !IMPORTANT; }');
  });

  it('marks unmarked declarations once', () => {
    expect(markImportant('.a { x: 1 !important; y: 2; }')).toBe('.a { x: 1 !important; y: 2 !important; }');
    expect(markImportant('.a { x: 1; }')).toBe('.a { x: 1 !important; }');
  });

  it('preserves semicolons inside quoted strings', () => {
    expect(markImportant(".a { content: ';'; }")).toBe(".a { content: ';' !important; }");
    expect(markImportant('.a { content: "a;b"; }')).toBe('.a { content: "a;b" !important; }');
  });

  it('honors backslash-escaped quotes inside strings', () => {
    const css = String.raw`.a { content: "he said \"hi\"; go"; }`;
    const expected = String.raw`.a { content: "he said \"hi\"; go" !important; }`;
    expect(markImportant(css)).toBe(expected);
  });
});