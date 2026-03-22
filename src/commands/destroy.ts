import { exec } from 'child_process';
import { promisify } from 'util';
import { getPackage } from '../lib/packages.js';
import { checkDocker, destroySimulation } from '../lib/docker.js';
import { logger } from '../lib/logger.js';

const execAsync = promisify(exec);

export async function destroyCommand(name: string): Promise<void> {
  if (!(await checkDocker())) {
    logger.error('Docker is not running.');
    process.exit(1);
  }

  const pkg = getPackage(name);
  if (!pkg) {
    logger.error(`Package '${name}' not found.`);
    process.exit(1);
  }

  logger.warning(`This will remove ALL data for ${pkg.displayName}.`);
  logger.warning('Press Ctrl+C to cancel, or Enter to continue...');
  
  try {
    await destroySimulation(pkg.name);
    await execAsync(`rm -rf /tmp/vsp-${pkg.name}`);
    await execAsync(`npm uninstall -g @vspatabuga/porto-${pkg.name}`, {
      env: { ...process.env, npm_config_registry: 'https://npm.pkg.github.com' }
    });
    logger.success(`${pkg.displayName} simulation completely removed.`);
  } catch {
    logger.warning('Some cleanup may have failed. Check manually.');
  }
}
