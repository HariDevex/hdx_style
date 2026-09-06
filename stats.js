#!/usr/bin/env node

/**
 * HDX Style — Automated Statistics
 * Counts utilities, components, variants, and tests from actual source.
 *
 * The computation lives in `collectStats()` (exported) so scripts such as
 * scripts/verify-stats.js reuse the exact same numbers — they cannot drift.
 */

import { loadConfig } from './src/core/config.js';
import { getAllUtilities } from './src/utilities/index.js';
import { getAllVariants } from './src/variants/index.js';
import { getAllComponents } from './src/components/index.js';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(import.meta.url));

/**
 * Collect the current framework statistics from source. Deterministic: reads
 * only the repo's own config, registries, and test fixtures.
 * @returns {{
 *   utilities: import('./src/core/types.js').UtilityDefinition[],
 *   utilCategories: string[],
 *   components: import('./src/core/types.js').ComponentDefinition[],
 *   variants: import('./src/core/types.js').VariantDefinition[],
 *   breakpoints: number,
 *   tests: number,
 *   srcFiles: number,
 *   deps: number,
 *   devDeps: number,
 *   cssSize: string,
 * }}
 */
export function collectStats() {
  const config = loadConfig();

  // Utilities
  const utilities = getAllUtilities(config);
  const utilCategories = [...new Set(utilities.map(u => u.category))];

  // Variants
  const variants = getAllVariants(config);

  // Components
  const components = getAllComponents(config);

  // Tests
  let testCount = 0;
  const countTests = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        countTests(path.join(dir, entry.name));
      } else if (entry.name.endsWith('.test.js')) {
        const content = readFileSync(path.join(dir, entry.name), 'utf-8');
        const matches = content.match(/\bit\(/g);
        if (matches) testCount += matches.length;
      }
    }
  };
  countTests(path.join(root, 'tests'));

  // Source files
  let srcFiles = 0;
  const countSrc = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory() && entry.name !== 'node_modules') {
        countSrc(path.join(dir, entry.name));
      } else if (entry.name.endsWith('.js')) {
        srcFiles++;
      }
    }
  };
  countSrc(path.join(root, 'src'));

  // Generated CSS size
  const cssPath = path.join(root, 'dist', 'hdx.css');
  let cssSize = 'Not built yet';
  if (fsExists(cssPath)) {
    const bytes = statSync(cssPath).size;
    cssSize = `${(bytes / 1024).toFixed(1)} KB`;
  }

  // Package size
  const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf-8'));
  const deps = Object.keys(pkg.dependencies || {}).length;
  const devDeps = Object.keys(pkg.devDependencies || {}).length;

  // Responsive breakpoints (from the resolved config theme)
  const breakpoints = Object.keys(config.theme.breakpoints || {}).length;

  return {
    utilities,
    utilCategories,
    components,
    variants,
    breakpoints,
    tests: testCount,
    srcFiles,
    deps,
    devDeps,
    cssSize,
  };
}

function fsExists(p) {
  try {
    statSync(p);
    return true;
  } catch {
    return false;
  }
}

/**
 * Print the human-readable report (only when stats.js is executed directly).
 */
function print(stats) {
  const { utilities, utilCategories, components, variants, breakpoints, tests, srcFiles, deps, devDeps, cssSize } = stats;
  const pad = (n) => String(n).padStart(6);

  console.log('');
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║       HDX Style — Framework Statistics          ║');
  console.log('╠══════════════════════════════════════════════════╣');
  console.log(`║  Utilities:        ${pad(utilities.length)}                      ║`);
  console.log(`║  Utility categories: ${String(utilCategories.length).padStart(4)}                      ║`);
  console.log(`║  Components:       ${pad(components.length)}                      ║`);
  console.log(`║  Variants:         ${pad(variants.length)}                      ║`);
  console.log(`║  Tests:            ${pad(tests)}                      ║`);
  console.log(`║  Source files:     ${pad(srcFiles)}                      ║`);
  console.log(`║  Generated CSS:    ${pad(cssSize)}                      ║`);
  console.log(`║  Runtime deps:     ${pad(deps)}                      ║`);
  console.log(`║  Dev deps:         ${pad(devDeps)}                      ║`);
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
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  print(collectStats());
}