import { describe, it, expect } from 'vitest';
import { resolve, resolveColor, resolveRaw, colorVariable } from '../../src/generator/resolver.js';

describe('resolver', () => {
  it('resolve finds value in category', () => {
    expect(resolve('primary', { primary: '#2563EB' })).toBe('#2563EB');
  });

  it('resolve returns null for missing key', () => {
    expect(resolve('missing', { primary: '#2563EB' })).toBeNull();
  });

  it('resolve returns null for null category', () => {
    expect(resolve('primary', null)).toBeNull();
  });

  it('colorVariable returns CSS var reference', () => {
    expect(colorVariable('primary')).toBe('var(--hdx-color-primary)');
  });

  it('colorVariable with custom prefix', () => {
    expect(colorVariable('primary', 'my_')).toBe('var(--my-color-primary)');
  });

  it('resolveColor returns CSS variable for semantic color', () => {
    const colors = { primary: '#2563EB', text: '#0F172A' };
    expect(resolveColor('primary', colors)).toBe('var(--hdx-color-primary)');
    expect(resolveColor('text', colors)).toBe('var(--hdx-color-text)');
  });

  it('resolveColor returns null for missing color', () => {
    expect(resolveColor('missing', { primary: '#2563EB' })).toBeNull();
  });

  it('resolveRaw returns raw value', () => {
    const spacing = { 4: '1rem', 8: '2rem' };
    expect(resolveRaw('4', spacing)).toBe('1rem');
    expect(resolveRaw('8', spacing)).toBe('2rem');
  });

  it('resolveRaw returns null for missing key', () => {
    expect(resolveRaw('99', { 4: '1rem' })).toBeNull();
  });
});
