import { getAllPackages, getPackage } from '../lib/packages.js';
import { isRunning } from '../lib/docker.js';
import { logger } from '../lib/logger.js';

export async function listCommand(): Promise<void> {
  const packages = getAllPackages();
  
  const rows = await Promise.all(
    packages.map(async (pkg) => {
      const running = await isRunning(pkg.name);
      return [
        pkg.name,
        running ? 'running' : pkg.installed ? 'stopped' : 'not installed',
        pkg.port.toString(),
        pkg.description
      ];
    })
  );

  logger.header('AVAILABLE PACKAGES');
  logger.table(['NAME', 'STATUS', 'PORT', 'DESCRIPTION'], rows);
}
