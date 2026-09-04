#!/usr/bin/env node

import { Command } from 'commander';
import { initCommand } from './commands/init.js';
import { buildCommand } from './commands/build.js';
import { watchCommand } from './commands/watch.js';
import { generateCommand } from './commands/generate.js';

const program = new Command();

program
  .name('hdx_css')
  .description('HDX CSS — Modern utility-first CSS framework')
  .version('0.1.0');

initCommand(program);
buildCommand(program);
watchCommand(program);
generateCommand(program);

program.parse();
