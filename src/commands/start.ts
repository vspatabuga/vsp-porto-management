import { exec } from 'child_process';
import { promisify } from 'util';
import { getPackage } from '../lib/packages.js';
import { checkDocker, isRunning } from '../lib/docker.js';
import { logger } from '../lib/logger.js';
import { isRepoInstalled } from '../lib/setup.js';

const execAsync = promisify(exec);

export async function startCommand(name: string): Promise<void> {
  if (!(await checkDocker())) {
    logger.error('Docker is not running. Please start Docker first.');
    process.exit(1);
  }

  const pkg = getPackage(name);
  if (!pkg) {
    logger.error(`Package '${name}' not found. Run 'vsp-porto list' for available packages.`);
    process.exit(1);
  }

  const installed = await isRepoInstalled(pkg.name);
  if (!installed) {
    logger.error(`${pkg.displayName} is not installed. Run 'vsp-porto install ${pkg.name}' first.`);
    process.exit(1);
  }

  const running = await isRunning(pkg.name);
  if (running) {
    logger.warning(`${pkg.displayName} is already running on port ${pkg.port}`);
    logger.info(`Open: http://localhost:${pkg.port}`);
    return;
  }

  logger.info(`Starting ${pkg.displayName} simulation...`);
  
  try {
    await execAsync(`docker compose -p vsp-${pkg.name} up -d`, {
      cwd: `/tmp/vsp-${pkg.name}`
    });
    logger.success(`${pkg.displayName} simulation started!`);
    logger.info(`Open: http://localhost:${pkg.port}`);
  } catch {
    logger.warning(`Could not auto-start. Try: vsp-porto-${pkg.name}`);
    logger.info(`Manual start: cd /tmp/vsp-${pkg.name} && docker compose up -d`);
  }
}
