import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { loadConfig } from '../../src/core/config.js';
import { explainBuild } from '../../src/scanner/scan.js';

function makeProject(html) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hdx-explain-'));
  const content = path.join(dir, 'src');
  fs.mkdirSync(content, { recursive: true });
  const file = path.join(content, 'index.html');
  fs.writeFileSync(file, html);
  return { dir, content, file };
}

describe('explainBuild', () => {
  it('lists kept utilities with counts and locations, plus unknowns', async () => {
    const { dir, content, file } = makeProject(
      '<div class="hdx-flex hdx-p-4 hdx-flex hdx-bogus"></div>',
    );
    try {
      const config = loadConfig({ content: [path.join(content, '**/*.html')] });
      const report = await explainBuild(config);

      expect(report.totals.utilities).toBe(2);
      const flex = report.classes.find((c) => c.className === 'hdx-flex');
      expect(flex.count).toBe(2);
      expect(flex.kind).toBe('utility');
      expect(flex.location).toMatch(/index\.html:1:\d+/);

      expect(report.unknown).toHaveLength(1);
      expect(report.unknown[0].className).toBe('hdx-bogus');
      expect(report.unknown[0].location).toMatch(/index\.html:1:\d+/);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it('resolves a responsive-flagged class to its base utility', async () => {
    const { dir, file } = makeProject('<div class="hdx-md_flex hdx-lg_hidden"></div>');
    try {
      const config = loadConfig({ content: [file] });
      const report = await explainBuild(config);
      const classes = report.classes.map((c) => c.className).sort();
      expect(classes).toContain('hdx-flex');
      expect(classes).toContain('hdx-hidden');
      expect(classes).not.toContain('hdx-md_flex');
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it('flags unused and arbitrary classes', async () => {
    const { dir, file } = makeProject('<div class="hdx-min-[900px]_flex hdx-btn"></div>');
    try {
      const config = loadConfig({ content: [file] });
      const report = await explainBuild(config);
      expect(report.classes.map((c) => c.className).sort()).toEqual(['hdx-btn', 'hdx-flex']);
      expect(report.totals.components).toBe(1);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});