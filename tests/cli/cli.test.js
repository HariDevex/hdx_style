import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const PROJECT_ROOT = path.resolve('.');
const tmpDir = path.join(os.tmpdir(), 'hdx-css-cli-test-' + Date.now());

describe('CLI', () => {
  beforeAll(() => {
    fs.mkdirSync(tmpDir, { recursive: true });
  });

  afterAll(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('hdx-style init creates hdx.config.cjs in a CommonJS project', () => {
    const testDir = path.join(tmpDir, 'init-test');
    fs.mkdirSync(testDir, { recursive: true });

    execSync(`node ${path.join(PROJECT_ROOT, 'src/cli/index.js')} init`, {
      cwd: testDir,
      encoding: 'utf-8',
    });

    expect(fs.existsSync(path.join(testDir, 'hdx.config.cjs'))).toBe(true);
    const content = fs.readFileSync(path.join(testDir, 'hdx.config.cjs'), 'utf-8');
    expect(content).toContain('module.exports');
    expect(content).toContain("prefix: 'hdx-'");
    expect(content).toContain('darkMode');
  });

  it('hdx-style init creates hdx.config.js (ESM) in a module project', () => {
    const testDir = path.join(tmpDir, 'init-esm-test');
    fs.mkdirSync(testDir, { recursive: true });
    fs.writeFileSync(path.join(testDir, 'package.json'), JSON.stringify({ type: 'module' }));

    execSync(`node ${path.join(PROJECT_ROOT, 'src/cli/index.js')} init`, {
      cwd: testDir,
      encoding: 'utf-8',
    });

    expect(fs.existsSync(path.join(testDir, 'hdx.config.js'))).toBe(true);
    const content = fs.readFileSync(path.join(testDir, 'hdx.config.js'), 'utf-8');
    expect(content).toContain('export default');
  });

  it('hdx-style init skips when a config already exists', () => {
    const testDir = path.join(tmpDir, 'init-skip-test');
    fs.mkdirSync(testDir, { recursive: true });
    fs.writeFileSync(path.join(testDir, 'hdx.config.cjs'), 'module.exports = {};');

    const output = execSync(`node ${path.join(PROJECT_ROOT, 'src/cli/index.js')} init`, {
      cwd: testDir,
      encoding: 'utf-8',
    });

    expect(output).toContain('already exists');
    expect(fs.readFileSync(path.join(testDir, 'hdx.config.cjs'), 'utf-8')).toBe('module.exports = {};');
  });

  it('hdx-style build generates CSS file', () => {
    const testDir = path.join(tmpDir, 'build-test');
    fs.mkdirSync(testDir, { recursive: true });

    // Create config
    fs.writeFileSync(
      path.join(testDir, 'hdx.config.js'),
      `export default {
        prefix: 'hdx-',
        content: [],
        darkMode: 'class',
        theme: {},
        plugins: [],
      };`
    );

    execSync(`node ${path.join(PROJECT_ROOT, 'src/cli/index.js')} build -o dist/hdx.css`, {
      cwd: testDir,
      encoding: 'utf-8',
    });

    expect(fs.existsSync(path.join(testDir, 'dist/hdx.css'))).toBe(true);
    const css = fs.readFileSync(path.join(testDir, 'dist/hdx.css'), 'utf-8');
    expect(css).toContain('.hdx-flex');
    expect(css).toContain('.hdx-p-4');
    expect(css).toContain('--hdx-color-primary');
  });

  it('hdx-style build -p purges to only the used utilities across custom breakpoints', () => {
    const testDir = path.join(tmpDir, 'build-purge-test');
    fs.mkdirSync(testDir, { recursive: true });

    fs.writeFileSync(
      path.join(testDir, 'index.html'),
      '<div className="hdx-grid-cols-1 hdx-sm_grid-cols-2 hdx-xs_flex"></div>'
    );

    fs.writeFileSync(
      path.join(testDir, 'hdx.config.js'),
      `export default {
        prefix: 'hdx-',
        content: ['./index.html'],
        darkMode: 'class',
        theme: {
          breakpoints: { xs: '480px', sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1536px' },
        },
        plugins: [],
      };`
    );

    const output = execSync(
      `node ${path.join(PROJECT_ROOT, 'src/cli/index.js')} build -p -o dist/hdx.css`,
      { cwd: testDir, encoding: 'utf-8' }
    );

    expect(output).toContain('Keeping');

    const css = fs.readFileSync(path.join(testDir, 'dist/hdx.css'), 'utf-8');

    // Used utilities are present.
    expect(css).toContain('.hdx-grid-cols-1');
    expect(css).toContain('.hdx-sm_grid-cols-2');
    // The custom breakpoint variant resolves AND emits the xs media query.
    expect(css).toContain('@media (min-width: 480px)');
    expect(css).toContain('.hdx-xs_flex');
    // Unused utilities are purged away.
    expect(css).not.toContain('.hdx-rounded-lg');
    expect(css).not.toContain('.hdx-shadow-xl');
  });

  it('hdx-style build purges by default when content is configured', () => {
    const testDir = path.join(tmpDir, 'build-default-purge-test');
    fs.mkdirSync(testDir, { recursive: true });

    fs.writeFileSync(
      path.join(testDir, 'index.html'),
      '<div class="hdx-flex hdx-p-4"></div>'
    );

    fs.writeFileSync(
      path.join(testDir, 'hdx.config.js'),
      `export default {
        prefix: 'hdx-',
        content: ['./index.html'],
        darkMode: 'class',
        theme: {},
        plugins: [],
      };`
    );

    const output = execSync(
      `node ${path.join(PROJECT_ROOT, 'src/cli/index.js')} build -o dist/hdx.css`,
      { cwd: testDir, encoding: 'utf-8' }
    );

    expect(output).toContain('Keeping');

    const css = fs.readFileSync(path.join(testDir, 'dist/hdx.css'), 'utf-8');
    expect(css).toContain('.hdx-flex');
    expect(css).toContain('.hdx-p-4');
    expect(css).not.toContain('.hdx-rounded-lg');
    expect(css).not.toContain('.hdx-shadow-xl');
  });

  it('hdx-style --version prints version', () => {
    const output = execSync(`node ${path.join(PROJECT_ROOT, 'src/cli/index.js')} --version`, {
      encoding: 'utf-8',
    });
    const pkg = JSON.parse(fs.readFileSync(path.join(PROJECT_ROOT, 'package.json'), 'utf-8'));
    expect(output.trim()).toBe(pkg.version);
  });

  it('hdx-style --help prints help', () => {
    const output = execSync(`node ${path.join(PROJECT_ROOT, 'src/cli/index.js')} --help`, {
      encoding: 'utf-8',
    });
    expect(output).toContain('hdx-style');
    expect(output).toContain('init');
    expect(output).toContain('build');
    expect(output).toContain('watch');
    expect(output).toContain('generate');
  });
});
