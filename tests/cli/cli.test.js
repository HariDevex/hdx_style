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

  it('hdx_css init creates hdx.config.js', () => {
    const testDir = path.join(tmpDir, 'init-test');
    fs.mkdirSync(testDir, { recursive: true });

    execSync(`node ${path.join(PROJECT_ROOT, 'src/cli/index.js')} init`, {
      cwd: testDir,
      encoding: 'utf-8',
    });

    expect(fs.existsSync(path.join(testDir, 'hdx.config.js'))).toBe(true);
    const content = fs.readFileSync(path.join(testDir, 'hdx.config.js'), 'utf-8');
    expect(content).toContain("prefix: 'hdx_'");
    expect(content).toContain('darkMode');
  });

  it('hdx_css build generates CSS file', () => {
    const testDir = path.join(tmpDir, 'build-test');
    fs.mkdirSync(testDir, { recursive: true });

    // Create config
    fs.writeFileSync(
      path.join(testDir, 'hdx.config.js'),
      `export default {
        prefix: 'hdx_',
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
    expect(css).toContain('.hdx_flex');
    expect(css).toContain('.hdx_p-4');
    expect(css).toContain('--hdx-color-primary');
  });

  it('hdx_css --version prints version', () => {
    const output = execSync(`node ${path.join(PROJECT_ROOT, 'src/cli/index.js')} --version`, {
      encoding: 'utf-8',
    });
    expect(output.trim()).toBe('0.1.0');
  });

  it('hdx_css --help prints help', () => {
    const output = execSync(`node ${path.join(PROJECT_ROOT, 'src/cli/index.js')} --help`, {
      encoding: 'utf-8',
    });
    expect(output).toContain('hdx_css');
    expect(output).toContain('init');
    expect(output).toContain('build');
    expect(output).toContain('watch');
    expect(output).toContain('generate');
  });
});
