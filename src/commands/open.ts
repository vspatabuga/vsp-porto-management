import { getPackage } from '../lib/packages.js';
import { logger } from '../lib/logger.js';
import { isRepoInstalled } from '../lib/setup.js';
import { isRunning } from '../lib/docker.js';
import { openBrowser } from '../lib/simulation.js';

export async function openCommand(name: string): Promise<void> {
  const pkg = getPackage(name);
  if (!pkg) {
    logger.error(`Package '${name}' not found. Run 'vsp-porto list' for available packages.`);
    process.exit(1);
  }

  const installed = await isRepoInstalled(pkg.name);
  if (!installed) {
    logger.error(`${pkg.displayName} is not installed.`);
    logger.info(`Run 'vsp-porto install ${pkg.name}' first.`);
    process.exit(1);
  }

  const running = await isRunning(pkg.name);
  if (!running) {
    logger.warning(`${pkg.displayName} is not running.`);
    logger.info(`Run 'vsp-porto start ${pkg.name}' first.`);
    process.exit(1);
  }

  logger.info(`Opening ${pkg.displayName} in browser...`);
  await openBrowser(`http://localhost:${pkg.port}`);
}
