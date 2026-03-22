#!/usr/bin/env node

import { Command } from 'commander';
import { installCommand } from './commands/install.js';
import { listCommand } from './commands/list.js';
import { startCommand } from './commands/start.js';
import { stopCommand } from './commands/stop.js';
import { destroyCommand } from './commands/destroy.js';
import { logger } from './lib/logger.js';

const program = new Command();

program
  .name('vsp-porto')
  .description('VSP Portfolio Simulation Manager - Experience Sovereign Systems Locally')
  .version('1.0.0');

program
  .command('install')
  .alias('i')
  .description('Install simulation packages')
  .argument('[package]', 'Specific package to install (optional)')
  .action(installCommand);

program
  .command('list')
  .alias('ls')
  .description('List available/installed packages')
  .action(listCommand);

program
  .command('start')
  .description('Start a simulation')
  .argument('<package>', 'Package name to start')
  .action(startCommand);

program
  .command('stop')
  .description('Stop a running simulation')
  .argument('<package>', 'Package name to stop')
  .action(stopCommand);

program
  .command('destroy')
  .description('Remove simulation completely')
  .argument('<package>', 'Package name to destroy')
  .action(destroyCommand);

program.parse();
