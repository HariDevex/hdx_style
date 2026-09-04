import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { loadConfig, getDefaultConfig, resolveConfigPath, loadConfigFromFile, getProjectModuleType } from '../../src/core/config.js';
import { deepMerge } from '../../src/theme/merge.js';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execSync } from 'node:child_process';

const PROJECT_ROOT = path.resolve('.');
const tmpDir = path.join(os.tmpdir(), 'hdx-config-test-' + Date.now());

describe('config', () => {
  it('getDefaultConfig returns valid config', () => {
    const config = getDefaultConfig();
    expect(config.prefix).toBe('hdx_');
    expect(config.darkMode).toBe('class');
    expect(config.theme).toBeDefined();
    expect(config.theme.colors).toBeDefined();
    expect(config.theme.spacing).toBeDefined();
    expect(config.theme.breakpoints).toBeDefined();
  });

  it('loadConfig merges with defaults', () => {
    const config = loadConfig({});
    expect(config.prefix).toBe('hdx_');
    expect(config.theme.colors.primary).toBe('#2563EB');
  });

  it('loadConfig overrides prefix', () => {
    const config = loadConfig({ prefix: 'my_' });
    expect(config.prefix).toBe('my_');
  });

  it('loadConfig overrides theme colors deeply', () => {
    const config = loadConfig({
      theme: {
        colors: {
          primary: '#7C3AED',
        },
      },
    });
    expect(config.theme.colors.primary).toBe('#7C3AED');
    // Other colors preserved
    expect(config.theme.colors.secondary).toBe('#64748B');
  });

  it('loadConfig overrides spacing', () => {
    const config = loadConfig({
      theme: {
        spacing: {
          4: '2rem',
        },
      },
    });
    expect(config.theme.spacing['4']).toBe('2rem');
    expect(config.theme.spacing['1']).toBe('0.25rem');
  });
});

describe('deepMerge', () => {
  it('merges flat objects', () => {
    const result = deepMerge({ a: 1, b: 2 }, { b: 3, c: 4 });
    expect(result).toEqual({ a: 1, b: 3, c: 4 });
  });

  it('merges nested objects', () => {
    const result = deepMerge(
      { a: { x: 1, y: 2 } },
      { a: { y: 3, z: 4 } }
    );
    expect(result).toEqual({ a: { x: 1, y: 3, z: 4 } });
  });

  it('does not mutate originals', () => {
    const target = { a: { x: 1 } };
    const source = { a: { y: 2 } };
    deepMerge(target, source);
    expect(target.a).toEqual({ x: 1 });
    expect(source.a).toEqual({ y: 2 });
  });
});

describe('config file loading', () => {
  beforeAll(() => {
    fs.mkdirSync(tmpDir, { recursive: true });
  });

  afterAll(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('getProjectModuleType detects type: module', async () => {
    const dir = path.join(tmpDir, 'esm-proj');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ type: 'module' }));
    expect(await getProjectModuleType(dir)).toBe('module');
  });

  it('getProjectModuleType returns commonjs for typeless projects', async () => {
    const dir = path.join(tmpDir, 'cjs-proj');
    fs.mkdirSync(dir, { recursive: true });
    expect(await getProjectModuleType(dir)).toBe('commonjs');
  });

  it('resolveConfigPath prefers hdx.config.js in module projects', async () => {
    const dir = path.join(tmpDir, 'resolve-esm');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ type: 'module' }));
    fs.writeFileSync(path.join(dir, 'hdx.config.js'), 'export default {};');

    const prevCwd = process.cwd();
    process.chdir(dir);
    const resolved = await resolveConfigPath();
    process.chdir(prevCwd);

    expect(resolved).toBe(path.join(dir, 'hdx.config.js'));
  });

  it('resolveConfigPath prefers hdx.config.cjs in CommonJS projects', async () => {
    const dir = path.join(tmpDir, 'resolve-cjs');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'hdx.config.cjs'), 'module.exports = {};');
    fs.writeFileSync(path.join(dir, 'hdx.config.js'), 'export default {};');

    const prevCwd = process.cwd();
    process.chdir(dir);
    const resolved = await resolveConfigPath();
    process.chdir(prevCwd);

    expect(resolved).toBe(path.join(dir, 'hdx.config.cjs'));
  });

  it('loadConfigFromFile loads hdx.config.cjs in CommonJS projects', async () => {
    const dir = path.join(tmpDir, 'load-cjs');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(
      path.join(dir, 'hdx.config.cjs'),
      `module.exports = { prefix: 'cjs_', content: [], darkMode: 'class', theme: {}, plugins: [] };`
    );

    const prevCwd = process.cwd();
    process.chdir(dir);
    const config = await loadConfigFromFile();
    process.chdir(prevCwd);

    expect(config.prefix).toBe('cjs_');
  });

  it('loadConfigFromFile loads ESM hdx.config.js in a typeless project without warning noise', async () => {
    const dir = path.join(tmpDir, 'load-esm-typeless');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(
      path.join(dir, 'hdx.config.js'),
      `export default { prefix: 'esm_', content: [], darkMode: 'class', theme: {}, plugins: [] };`
    );

    const prevCwd = process.cwd();
    process.chdir(dir);
    const config = await loadConfigFromFile();
    process.chdir(prevCwd);

    expect(config.prefix).toBe('esm_');
  });

  it('loadConfigFromFile returns defaults when no config file exists', async () => {
    const dir = path.join(tmpDir, 'no-config');
    fs.mkdirSync(dir, { recursive: true });

    const prevCwd = process.cwd();
    process.chdir(dir);
    const config = await loadConfigFromFile();
    process.chdir(prevCwd);

    expect(config.prefix).toBe('hdx_');
  });
});
