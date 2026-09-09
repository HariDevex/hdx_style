import { describe, it, expect } from 'vitest';
import { extractClassNames } from '../../src/scanner/extractor.js';

describe('extractor', () => {
  it('extracts from double-quoted class attribute', () => {
    const html = '<div class="hdx-flex hdx-p-4">';
    const classes = extractClassNames(html);
    expect(classes.has('hdx-flex')).toBe(true);
    expect(classes.has('hdx-p-4')).toBe(true);
  });

  it('extracts from single-quoted class attribute', () => {
    const html = "<div class='hdx-flex hdx-p-4'>";
    const classes = extractClassNames(html);
    expect(classes.has('hdx-flex')).toBe(true);
    expect(classes.has('hdx-p-4')).toBe(true);
  });

  it('extracts from className (JSX)', () => {
    const jsx = '<div className="hdx-flex hdx-bg-primary">';
    const classes = extractClassNames(jsx);
    expect(classes.has('hdx-flex')).toBe(true);
    expect(classes.has('hdx-bg-primary')).toBe(true);
  });

  it('extracts from :class (Vue)', () => {
    const vue = '<div :class="hdx-flex hdx-p-4">';
    const classes = extractClassNames(vue);
    expect(classes.has('hdx-flex')).toBe(true);
    expect(classes.has('hdx-p-4')).toBe(true);
  });

  it('extracts from ngClass (Angular)', () => {
    const angular = '<div ngClass="hdx-flex hdx-p-4">';
    const classes = extractClassNames(angular);
    expect(classes.has('hdx-flex')).toBe(true);
    expect(classes.has('hdx-p-4')).toBe(true);
  });

  it('returns empty set for no classes', () => {
    const html = '<div>no classes</div>';
    const classes = extractClassNames(html);
    expect(classes.size).toBe(0);
  });

  it('extracts from mixed string literals', () => {
    const content = 'const cls = "btn hdx-flex hdx-p-4";';
    const classes = extractClassNames(content);
    expect(classes.has('hdx-flex')).toBe(true);
    expect(classes.has('hdx-p-4')).toBe(true);
  });
});
