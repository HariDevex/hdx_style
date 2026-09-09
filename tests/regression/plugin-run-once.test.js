import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { loadConfig } from '../../src/core/config.js';
import { generatePurgedBuildCss } from '../../src/scanner/scan.js';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createRequire } from 'node:module';

const tmpDir = path.join(os.tmpdir(), 'hdx-plugin-run-test-' + Date.now());
const require = createRequire(import.meta.url);

// A shared counter. `runPlugins` is invoked twice today (once by scan.js for
// purge-matching, once internally by generateCSS). If both run, this reaches 2;
// after the fix it must be exactly 1.
let pluginRunCount = 0;

function sideEffectPlugin(ctx) {
  pluginRunCount += 1;
  ctx.addUtility({ name: 'glow', property: 'box-shadow', value: '0 0 4px lime', category: 'test' });
}

describe('Regression: plugins run exactly once per purged build', () => {
  beforeAll(() => {
    pluginRunCount = 0;
    fs.mkdirSync(tmpDir, { recursive: true });
    fs.writeFileSync(path.join(tmpDir, 'index.html'), '<div class="hdx-flex hdx-glow"></div>');
  });

  afterAll(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('side-effecting plugin handler fires a single time across scan + generate', async () => {
    const config = loadConfig({
      prefix: 'hdx-',
      content: [path.join(tmpDir, 'index.html')],
      plugins: [sideEffectPlugin],
    });

    // Reset the counter, then run the full production build path. Previously
    // generatePurgedBuildCss ran plugins AND generateCSS ran them again, so a
    // side-effecting plugin fired twice.
    pluginRunCount = 0;
    const css = await generatePurgedBuildCss(config, () => {}, () => {});

    expect(pluginRunCount).toBe(1);
    // The plugin utility is still purge-matched and emitted.
    expect(css).toContain('.hdx-glow');
    expect(css).toContain('.hdx-flex');
  });

  it('generateCSS still runs plugins itself when no registry is supplied', () => {
    const { generateCSS } = require('../../src/generator/index.js');
    const config = loadConfig({ plugins: [sideEffectPlugin] });
    pluginRunCount = 0;
    generateCSS(config);
    expect(pluginRunCount).toBe(1);
  });
});