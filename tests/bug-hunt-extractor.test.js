import { describe, it, expect } from 'vitest';
import { extractClassNames } from '../src/scanner/extractor.js';

describe('extractor: join pattern', () => {
  it('extracts classes from the very beginning of a very long array join', () => {
    const classes = ['hdx-unique-start'];
    for (let i = 0; i < 1000; i++) {
      classes.push('hdx-filler-' + i);
    }
    const content = `const cls = [${classes.map(c => "'" + c + "'").join(', ')}].join(' ')`;
    const extracted = extractClassNames(content);
    expect(extracted.has('hdx-unique-start')).toBe(true);
  });
});