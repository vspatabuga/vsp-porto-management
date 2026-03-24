import { spawn } from 'child_process';
import { getPackage } from '../lib/packages.js';
import { logger } from '../lib/logger.js';
import { isRepoInstalled } from '../lib/setup.js';
import { isRunning } from '../lib/docker.js';

export async function logsCommand(
  name: string, 
  options: { follow?: boolean; tail?: string } = {}
): Promise<void> {
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
    logger.info(`Run 'vsp-porto start ${pkg.name}' to start it.`);
    process.exit(1);
  }

  const followFlag = options.follow ? ['-f'] : [];
  const tailLines = ['--tail', options.tail || '100'];
  const containerName = `vsp-${pkg.name}`;

  logger.info(`Showing logs for ${containerName}...`);
  logger.muted(`(Press Ctrl+C to stop)`);
  console.log('');

  // Use spawn for streaming logs
  const dockerLogs = spawn('docker', ['logs', ...followFlag, ...tailLines, containerName], {
    stdio: 'inherit',
  });

  dockerLogs.on('error', (error) => {
    logger.error('Failed to fetch logs');
    console.error(error);
    process.exit(1);
  });

  // Keep the process running until killed
  await new Promise<void>((resolve) => {
    dockerLogs.on('close', () => resolve());
  });
}
