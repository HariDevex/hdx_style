import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it, vi } from 'vitest';

import { loadConfig } from '../../src/core/config.js';
import { generatePurgedBuildCss, createScanState } from '../../src/scanner/scan.js';

describe('incremental watch scanning', () => {
  it('re-reads only the changed file on an incremental rebuild', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hdx-watch-'));
    const a = path.join(dir, 'a.html');
    const b = path.join(dir, 'b.html');
    fs.writeFileSync(a, '<div class="hdx-flex"></div>');
    fs.writeFileSync(b, '<div class="hdx-grid-cols-2"></div>');
    try {
      const config = loadConfig({ content: [path.join(dir, '*.html')] });
      const readSpy = vi.spyOn(fs, 'readFileSync');

      // Full first build: both files are read.
      const state = createScanState();
      const css1 = await generatePurgedBuildCss(config, () => {}, () => {}, state);
      expect(css1).toContain('.hdx-flex');
      expect(css1).toContain('.hdx-grid-cols-2');
      expect(readSpy.mock.calls.some(([p]) => p === a)).toBe(true);
      expect(readSpy.mock.calls.some(([p]) => p === b)).toBe(true);

      readSpy.mockClear();

      // Incremental rebuild: only file b appears in the changed set.
      fs.writeFileSync(b, '<div class="hdx-hidden"></div>');
      state.changedFiles = new Set([b]);
      const css2 = await generatePurgedBuildCss(config, () => {}, () => {}, state);

      // a was reused from cache (no read); b was re-read.
      expect(readSpy.mock.calls.some(([p]) => p === a)).toBe(false);
      expect(readSpy.mock.calls.some(([p]) => p === b)).toBe(true);

      // The union reflects the old a-classes and the new b-classes.
      expect(css2).toContain('.hdx-flex');
      expect(css2).toContain('.hdx-hidden');
      expect(css2).not.toContain('.hdx-grid-cols-2');

      readSpy.mockRestore();
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it('full re-scan (changedFiles null) re-reads everything', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hdx-watch2-'));
    const a = path.join(dir, 'a.html');
    fs.writeFileSync(a, '<div class="hdx-flex"></div>');
    try {
      const config = loadConfig({ content: [a] });
      const readSpy = vi.spyOn(fs, 'readFileSync');

      const state = createScanState();
      await generatePurgedBuildCss(config, () => {}, () => {}, state);
      readSpy.mockClear();

      state.changedFiles = null;
      const css = await generatePurgedBuildCss(config, () => {}, () => {}, state);
      expect(readSpy.mock.calls.some(([p]) => p === a)).toBe(true);
      expect(css).toContain('.hdx-flex');
      readSpy.mockRestore();
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it('prunes cache entries for files that were deleted', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hdx-watch3-'));
    const a = path.join(dir, 'a.html');
    const b = path.join(dir, 'b.html');
    fs.writeFileSync(a, '<div class="hdx-flex"></div>');
    fs.writeFileSync(b, '<div class="hdx-grid-cols-2"></div>');
    try {
      const config = loadConfig({ content: [path.join(dir, '*.html')] });
      const state = createScanState();
      await generatePurgedBuildCss(config, () => {}, () => {}, state);
      expect(state.fileCache.has(a)).toBe(true);
      expect(state.fileCache.has(b)).toBe(true);

      fs.rmSync(b);
      state.changedFiles = new Set([b]);
      const css = await generatePurgedBuildCss(config, () => {}, () => {}, state);
      expect(state.fileCache.has(b)).toBe(false);
      expect(state.fileCache.has(a)).toBe(true);
      expect(css).toContain('.hdx-flex');
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});