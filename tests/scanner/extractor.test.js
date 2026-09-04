import { describe, it, expect } from 'vitest';
import { extractClassNames } from '../../src/scanner/extractor.js';

describe('extractor', () => {
  it('extracts from double-quoted class attribute', () => {
    const html = '<div class="hdx_flex hdx_p-4">';
    const classes = extractClassNames(html);
    expect(classes.has('hdx_flex')).toBe(true);
    expect(classes.has('hdx_p-4')).toBe(true);
  });

  it('extracts from single-quoted class attribute', () => {
    const html = "<div class='hdx_flex hdx_p-4'>";
    const classes = extractClassNames(html);
    expect(classes.has('hdx_flex')).toBe(true);
    expect(classes.has('hdx_p-4')).toBe(true);
  });

  it('extracts from className (JSX)', () => {
    const jsx = '<div className="hdx_flex hdx_bg-primary">';
    const classes = extractClassNames(jsx);
    expect(classes.has('hdx_flex')).toBe(true);
    expect(classes.has('hdx_bg-primary')).toBe(true);
  });

  it('extracts from :class (Vue)', () => {
    const vue = '<div :class="hdx_flex hdx_p-4">';
    const classes = extractClassNames(vue);
    expect(classes.has('hdx_flex')).toBe(true);
    expect(classes.has('hdx_p-4')).toBe(true);
  });

  it('extracts from ngClass (Angular)', () => {
    const angular = '<div ngClass="hdx_flex hdx_p-4">';
    const classes = extractClassNames(angular);
    expect(classes.has('hdx_flex')).toBe(true);
    expect(classes.has('hdx_p-4')).toBe(true);
  });

  it('returns empty set for no classes', () => {
    const html = '<div>no classes</div>';
    const classes = extractClassNames(html);
    expect(classes.size).toBe(0);
  });

  it('handles multiple elements', () => {
    const html = `
      <div class="hdx_flex">
        <span class="hdx_text-sm">text</span>
        <button class="hdx_btn">btn</button>
      </div>
    `;
    const classes = extractClassNames(html);
    expect(classes.has('hdx_flex')).toBe(true);
    expect(classes.has('hdx_text-sm')).toBe(true);
    expect(classes.has('hdx_btn')).toBe(true);
  });
});
