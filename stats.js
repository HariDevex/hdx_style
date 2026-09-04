#!/usr/bin/env node

/**
 * HDX Style — Automated Statistics
 * Counts utilities, components, variants, and tests from actual source.
 */

import { loadConfig } from './src/core/config.js';
import { getAllUtilities } from './src/utilities/index.js';
import { getAllVariants } from './src/variants/index.js';
import { getAllComponents } from './src/components/index.js';
import fs from 'node:fs';
import path from 'node:path';

const config = loadConfig();

// Utilities
const utilities = getAllUtilities(config);
const utilCategories = [...new Set(utilities.map(u => u.category))];

// Variants
const variants = getAllVariants(config);

// Components
const components = getAllComponents(config);
const compCategories = [...new Set(components.map(c => c.category))];

// Tests
const testDir = path.resolve('tests');
let testCount = 0;
function countTests(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      countTests(path.join(dir, entry.name));
    } else if (entry.name.endsWith('.test.js')) {
      const content = fs.readFileSync(path.join(dir, entry.name), 'utf-8');
      const matches = content.match(/\bit\(/g);
      if (matches) testCount += matches.length;
    }
  }
}
countTests(testDir);

// Source files
let srcFiles = 0;
function countSrc(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && entry.name !== 'node_modules') {
      countSrc(path.join(dir, entry.name));
    } else if (entry.name.endsWith('.js')) {
      srcFiles++;
    }
  }
}
countSrc(path.resolve('src'));

// Generated CSS size
const cssPath = path.resolve('dist/hdx.css');
let cssSize = 'Not built yet';
if (fs.existsSync(cssPath)) {
  const bytes = fs.statSync(cssPath).size;
  cssSize = `${(bytes / 1024).toFixed(1)} KB`;
}

// Package size
const pkg = JSON.parse(fs.readFileSync(path.resolve('package.json'), 'utf-8'));
const deps = Object.keys(pkg.dependencies || {}).length;
const devDeps = Object.keys(pkg.devDependencies || {}).length;

console.log('');
console.log('╔══════════════════════════════════════════════════╗');
console.log('║       HDX Style — Framework Statistics          ║');
console.log('╠══════════════════════════════════════════════════╣');
console.log(`║  Utilities:        ${String(utilities.length).padStart(6)}                      ║`);
console.log(`║  Utility categories: ${String(utilCategories.length).padStart(4)}                      ║`);
console.log(`║  Components:       ${String(components.length).padStart(6)}                      ║`);
console.log(`║  Variants:         ${String(variants.length).padStart(6)}                      ║`);
console.log(`║  Tests:            ${String(testCount).padStart(6)}                      ║`);
console.log(`║  Source files:     ${String(srcFiles).padStart(6)}                      ║`);
console.log(`║  Generated CSS:    ${cssSize.padStart(6)}                      ║`);
console.log(`║  Runtime deps:     ${String(deps).padStart(6)}                      ║`);
console.log(`║  Dev deps:         ${String(devDeps).padStart(6)}                      ║`);
console.log('╠══════════════════════════════════════════════════╣');
console.log('║  Utility Categories:                             ║');
for (const cat of utilCategories) {
  const count = utilities.filter(u => u.category === cat).length;
  console.log(`║    ${cat.padEnd(20)} ${String(count).padStart(5)} utilities       ║`);
}
console.log('╠══════════════════════════════════════════════════╣');
console.log('║  Variants:                                       ║');
for (const v of variants) {
  console.log(`║    ${v.name.padEnd(20)} (${v.type})            ║`);
}
console.log('╚══════════════════════════════════════════════════╝');
console.log('');
