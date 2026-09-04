#!/usr/bin/env node

import { Command } from 'commander';
import { createRequire } from 'node:module';
import { initCommand } from './commands/init.js';
import { buildCommand } from './commands/build.js';
import { watchCommand } from './commands/watch.js';
import { generateCommand } from './commands/generate.js';

const require = createRequire(import.meta.url);
const pkg = require('../../package.json');

const program = new Command();

program
  .name('hdx_style')
  .description('HDX Style — Modern utility-first CSS framework')
  .version(pkg.version);

initCommand(program);
buildCommand(program);
watchCommand(program);
generateCommand(program);

program.parse();
