import { describe, it, expect } from 'vitest';
import { extractClassNames } from '../../src/scanner/extractor.js';

describe('Scanner: Multiline class attributes', () => {
  it('extracts classes from multiline class attribute', () => {
    const html = `
<div class="
  hdx_flex
  hdx_items-center
  hdx_gap-4
">
  Hello
</div>`;
    const classes = extractClassNames(html);
    expect(classes.has('hdx_flex')).toBe(true);
    expect(classes.has('hdx_items-center')).toBe(true);
    expect(classes.has('hdx_gap-4')).toBe(true);
  });

  it('extracts classes from multiline className attribute', () => {
    const jsx = `
<div
  className="
    hdx_bg-primary
    hdx_text-white
    hdx_p-4
  "
>
</div>`;
    const classes = extractClassNames(jsx);
    expect(classes.has('hdx_bg-primary')).toBe(true);
    expect(classes.has('hdx_text-white')).toBe(true);
    expect(classes.has('hdx_p-4')).toBe(true);
  });
});

describe('Scanner: Template literals', () => {
  it('extracts HDX classes from template literals', () => {
    const js = 'const cls = `hdx_flex hdx_p-4`;';
    const classes = extractClassNames(js);
    expect(classes.has('hdx_flex')).toBe(true);
    expect(classes.has('hdx_p-4')).toBe(true);
  });

  it('does not extract non-HDX template literals', () => {
    const js = 'const cls = `foo bar`;';
    const classes = extractClassNames(js);
    expect(classes.size).toBe(0);
  });
});

describe('Scanner: Vue and Svelte', () => {
  it('extracts from :class (Vue)', () => {
    const vue = '<div :class="hdx_flex hdx_p-4">Vue</div>';
    const classes = extractClassNames(vue);
    expect(classes.has('hdx_flex')).toBe(true);
    expect(classes.has('hdx_p-4')).toBe(true);
  });
});

describe('Scanner: Edge cases', () => {
  it('handles empty content', () => {
    const classes = extractClassNames('');
    expect(classes.size).toBe(0);
  });

  it('handles no classes', () => {
    const html = '<div>No classes here</div>';
    const classes = extractClassNames(html);
    expect(classes.size).toBe(0);
  });

  it('deduplicates classes', () => {
    const html = '<div class="hdx_flex"></div><div class="hdx_flex"></div>';
    const classes = extractClassNames(html);
    expect(classes.size).toBe(1);
  });
});
