import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build, SIZE_LIMIT_KB, CURATED } from '../scripts/build-starter.js';
import { loadConfig } from '../src/core/config.js';
import { getAllUtilities } from '../src/utilities/index.js';

const root = path.dirname(fileURLToPath(import.meta.url));

describe('Starter stylesheet (css/index.css)', () => {
  it('builds within the size gate', () => {
    build();
    const cssPath = path.join(root, '..', 'css', 'index.css');
    expect(fs.existsSync(cssPath)).toBe(true);
    const kb = fs.statSync(cssPath).size / 1024;
    expect(kb).toBeLessThanOrEqual(SIZE_LIMIT_KB);
  });

  it('includes tokens, reset, a responsive media rule, components, and keyframes', () => {
    build();
    const css = fs.readFileSync(path.join(root, '..', 'css', 'index.css'), 'utf-8');

    expect(css).toContain('--hdx-color-primary');
    expect(css).toContain('box-sizing: border-box');
    expect(css).toContain('.hdx-btn');
    expect(css).toContain('@media (min-width: 768px)');
    expect(css).toContain('.hdx-md_flex');
    expect(css).toContain('Keyframes');
  });

  it('every curated utility name resolves to a real utility (typo guard)', () => {
    const allNames = new Set(getAllUtilities(loadConfig()).map(u => u.name));
    const curated = Object.values(CURATED).flat();
    const missing = curated.filter(n => !allNames.has(n));
    expect(missing).toEqual([]);
  });
});