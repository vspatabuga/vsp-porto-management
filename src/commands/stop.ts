import { getPackage } from '../lib/packages.js';
import { checkDocker, isRunning, stopSimulation } from '../lib/docker.js';
import { logger } from '../lib/logger.js';

export async function stopCommand(name: string): Promise<void> {
  if (!checkDocker()) {
    logger.error('Docker is not running.');
    process.exit(1);
  }

  const pkg = getPackage(name);
  if (!pkg) {
    logger.error(`Package '${name}' not found.`);
    process.exit(1);
  }

  const running = await isRunning(pkg.name);
  if (!running) {
    logger.warning(`${pkg.displayName} is not running.`);
    return;
  }

  await stopSimulation(pkg.name);
  logger.success(`${pkg.displayName} simulation stopped.`);
  logger.info(`Run 'vsp-porto start ${pkg.name}' to restart.`);
}
