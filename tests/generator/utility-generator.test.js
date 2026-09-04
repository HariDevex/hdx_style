import { describe, it, expect } from 'vitest';
import { generateRule, generateMultiPropertyRule } from '../../src/generator/utility-generator.js';

describe('utility-generator', () => {
  it('generates simple rule', () => {
    const def = { name: 'flex', property: 'display', value: 'flex' };
    const css = generateRule(def);
    expect(css).toBe('.hdx_flex { display: flex; }\n');
  });

  it('generates rule with prefix', () => {
    const def = { name: 'flex', property: 'display', value: 'flex' };
    const css = generateRule(def, 'my_');
    expect(css).toBe('.my_flex { display: flex; }\n');
  });

  it('generates rule with escaped name', () => {
    const def = { name: 'w-1/2', property: 'width', value: '50%' };
    const css = generateRule(def);
    expect(css).toContain('.hdx_w-1\\/2');
  });

  it('generates multi-property rule', () => {
    const def = {
      name: 'btn',
      css: 'display: inline-flex;\nalign-items: center;\npadding: 0.5rem 1rem;',
    };
    const css = generateMultiPropertyRule(def);
    expect(css).toContain('.hdx_btn {');
    expect(css).toContain('display: inline-flex');
    expect(css).toContain('align-items: center');
    expect(css).toContain('padding: 0.5rem 1rem');
  });
});
