import { getAllPackages } from '../lib/packages.js';
import { isRunning } from '../lib/docker.js';
import { logger } from '../lib/logger.js';
import { isRepoInstalled } from '../lib/setup.js';

export async function listCommand(): Promise<void> {
  const packages = getAllPackages();
  
  const rows = await Promise.all(
    packages.map(async (pkg) => {
      const running = await isRunning(pkg.name);
      const installed = await isRepoInstalled(pkg.name);
      
      let status = 'not installed';
      if (running) {
        status = 'running';
      } else if (installed) {
        status = 'stopped';
      }
      
      return {
        name: pkg.name,
        displayName: pkg.displayName,
        status,
        port: pkg.port,
        description: pkg.description,
      };
    })
  );

  // Header
  console.log('');
  console.log('  ┌─────────────────────────────────────────────────────────────────────┐');
  console.log('  │           VSP Porto - Available Simulations                       │');
  console.log('  └─────────────────────────────────────────────────────────────────────┘');
  console.log('');

  // Table header
  console.log('  ┌──────────────┬──────────────┬────────┬──────────────────────────────────┐');
  console.log('  │ NAME         │ STATUS       │ PORT   │ DESCRIPTION                      │');
  console.log('  ├──────────────┼──────────────┼────────┼──────────────────────────────────┤');

  for (const pkg of rows) {
    const statusColor = pkg.status === 'running' ? '\x1b[32m' : pkg.status === 'stopped' ? '\x1b[33m' : '\x1b[2m';
    const statusReset = '\x1b[0m';
    
    const name = pkg.name.padEnd(13);
    const status = (statusColor + pkg.status.padEnd(13) + statusReset).padEnd(14);
    const port = pkg.port.toString().padEnd(7);
    const desc = pkg.description.substring(0, 32).padEnd(32);
    
    console.log(`  │ ${name} │ ${status} │ ${port} │ ${desc} │`);
  }

  console.log('  └──────────────┴──────────────┴────────┴──────────────────────────────────┘');
  console.log('');

  // Usage hints
  console.log('  Usage:');
  console.log('    vsp-porto install <name>     Install a simulation');
  console.log('    vsp-porto start <name>        Start a simulation');
  console.log('    vsp-porto stop <name>         Stop a simulation');
  console.log('');
  console.log('  Examples:');
  console.log('    vsp-porto install kalpataru    Install Waste Management');
  console.log('    vsp-porto start kalpataru      Start simulation');
  console.log('    vsp-porto start kalpataru -o   Start and open browser');
  console.log('');

  // Quick install hint
  console.log('  Quick Install:');
  console.log('    curl -fsSL https://porto.vspatabuga.io/ | sh');
  console.log('');
}
