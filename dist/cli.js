#!/usr/bin/env node
import { Command } from 'commander';
import { installCommand } from './commands/install.js';
import { listCommand } from './commands/list.js';
import { startCommand } from './commands/start.js';
import { stopCommand } from './commands/stop.js';
import { destroyCommand } from './commands/destroy.js';
import { openCommand } from './commands/open.js';
import { logsCommand } from './commands/logs.js';
import { docsCommand } from './commands/docs.js';
import { logger } from './lib/logger.js';
const program = new Command();
program
    .name('vsp-porto')
    .description(`
VSP Porto - Portfolio Simulation Manager
Experience Sovereign Systems Locally

Quick Start:
  curl -fsSL https://porto.vspatabuga.io/ | sh
  vsp-porto list
  vsp-porto install kalpataru
  vsp-porto start kalpataru
`)
    .version('2.0.0');
// Install command
program
    .command('install')
    .alias('i')
    .description('Install simulation packages from GitHub Packages')
    .argument('[package]', 'Specific package to install (optional, installs all if omitted)')
    .action(installCommand);
// List command
program
    .command('list')
    .alias('ls')
    .description('List available and installed packages')
    .action(listCommand);
// Start command
const startCmd = program
    .command('start')
    .description('Start a simulation')
    .argument('<package>', 'Package name to start');
startCmd
    .option('-o, --open', 'Open browser after starting')
    .option('--no-check', 'Skip health check')
    .action(async (pkg, options) => {
    await startCommand(pkg, options);
});
// Stop command
program
    .command('stop')
    .description('Stop a running simulation')
    .argument('<package>', 'Package name to stop')
    .action(stopCommand);
// Open command (new)
program
    .command('open')
    .alias('o')
    .description('Open simulation in browser')
    .argument('<package>', 'Package name to open')
    .action(openCommand);
// Logs command (new)
const logsCmd = program
    .command('logs')
    .description('View simulation logs')
    .argument('<package>', 'Package name to view logs for');
logsCmd
    .option('-f, --follow', 'Follow log output')
    .option('-n, --tail <lines>', 'Number of lines to show', '100')
    .action(async (pkg, options) => {
    await logsCommand(pkg, {
        follow: options.follow,
        tail: options.tail || '100',
    });
});
// Docs command (new)
program
    .command('docs')
    .alias('d')
    .description('Open documentation')
    .argument('[package]', 'Package name for specific docs (optional)')
    .action(docsCommand);
// Destroy command
program
    .command('destroy')
    .description('Remove simulation completely (uninstall)')
    .argument('<package>', 'Package name to destroy')
    .action(destroyCommand);
// Global options
program
    .option('-v, --verbose', 'Enable verbose output')
    .hook('preAction', (thisCommand) => {
    const opts = thisCommand.opts();
    if (opts.verbose) {
        process.env.VERBOSE = '1';
    }
});
// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
    logger.muted('\nAborted by user');
    process.exit(130);
});
program.parse();
//# sourceMappingURL=cli.js.map