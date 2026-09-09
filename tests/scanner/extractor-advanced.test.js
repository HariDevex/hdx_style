import { describe, it, expect } from 'vitest';
import { extractClassNames } from '../../src/scanner/extractor.js';

describe('Scanner: Multiline class attributes', () => {
  it('extracts classes from multiline class attribute', () => {
    const html = `
<div class="
  hdx-flex
  hdx-items-center
  hdx-gap-4
">
  Hello
</div>`;
    const classes = extractClassNames(html);
    expect(classes.has('hdx-flex')).toBe(true);
    expect(classes.has('hdx-items-center')).toBe(true);
    expect(classes.has('hdx-gap-4')).toBe(true);
  });

  it('extracts classes from multiline className attribute', () => {
    const jsx = `
<div
  className="
    hdx-bg-primary
    hdx-text-white
    hdx-p-4
  "
>
</div>`;
    const classes = extractClassNames(jsx);
    expect(classes.has('hdx-bg-primary')).toBe(true);
    expect(classes.has('hdx-text-white')).toBe(true);
    expect(classes.has('hdx-p-4')).toBe(true);
  });
});

describe('Scanner: Template literals', () => {
  it('extracts HDX classes from template literals', () => {
    const js = 'const cls = `hdx-flex hdx-p-4`;';
    const classes = extractClassNames(js);
    expect(classes.has('hdx-flex')).toBe(true);
    expect(classes.has('hdx-p-4')).toBe(true);
  });

  it('does not extract non-HDX template literals', () => {
    const js = 'const cls = `foo bar`;';
    const classes = extractClassNames(js);
    expect(classes.size).toBe(0);
  });
});

describe('Scanner: Vue and Svelte', () => {
  it('extracts from :class (Vue)', () => {
    const vue = '<div :class="hdx-flex hdx-p-4">Vue</div>';
    const classes = extractClassNames(vue);
    expect(classes.has('hdx-flex')).toBe(true);
    expect(classes.has('hdx-p-4')).toBe(true);
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
    const html = '<div class="hdx-flex"></div><div class="hdx-flex"></div>';
    const classes = extractClassNames(html);
    expect(classes.size).toBe(1);
  });
});
