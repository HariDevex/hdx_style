import { describe, it, expect } from 'vitest';
import { prefixClass, escapeClassName, getSelector, getSelectorWithDot } from '../../src/core/prefix.js';

describe('prefix', () => {
  it('prefixClass applies default prefix', () => {
    expect(prefixClass('flex')).toBe('hdx-flex');
    expect(prefixClass('p-4')).toBe('hdx-p-4');
  });

  it('prefixClass applies custom prefix', () => {
    expect(prefixClass('flex', 'my_')).toBe('my_flex');
  });

  it('escapeClassName escapes forward slash', () => {
    expect(escapeClassName('hdx-w-1/2')).toBe('hdx-w-1\\/2');
  });

  it('escapeClassName escapes brackets', () => {
    expect(escapeClassName('hdx-w-[100px]')).toBe('hdx-w-\\[100px\\]');
  });

  it('escapeClassName escapes dots', () => {
    expect(escapeClassName('hdx-test.class')).toBe('hdx-test\\.class');
  });

  it('escapeClassName escapes colons', () => {
    expect(escapeClassName('hdx-before:hover')).toBe('hdx-before\\:hover');
  });

  it('getSelector returns escaped prefixed name', () => {
    expect(getSelector('flex')).toBe('hdx-flex');
    expect(getSelector('w-1/2')).toBe('hdx-w-1\\/2');
  });

  it('getSelectorWithDot returns CSS selector', () => {
    expect(getSelectorWithDot('flex')).toBe('.hdx-flex');
    expect(getSelectorWithDot('w-1/2')).toBe('.hdx-w-1\\/2');
  });
});
