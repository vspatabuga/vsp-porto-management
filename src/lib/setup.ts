import { exec } from 'child_process';
import { promisify } from 'util';
import { logger } from './logger.js';

const execAsync = promisify(exec);

export async function setupLocalRepo(repoName: string, targetName: string): Promise<void> {
  const sourcePath = `/home/vsp/${repoName}`;
  const targetPath = `/tmp/vsp-${targetName}`;

  try {
    // Check if source exists
    await execAsync(`test -d "${sourcePath}"`);
  } catch {
    logger.error(`Local repository ${repoName} not found at ${sourcePath}`);
    logger.info('Please clone the repository first or check your setup.');
    process.exit(1);
  }

  logger.info(`Setting up ${targetName} from local repository...`);

  // Remove existing target
  try {
    await execAsync(`rm -rf "${targetPath}"`);
  } catch {
    // Ignore errors if target doesn't exist
  }

  // Copy source to target
  try {
    await execAsync(`cp -r "${sourcePath}" "${targetPath}"`);
    logger.success(`Copied ${repoName} to ${targetPath}`);
  } catch (error) {
    logger.error(`Failed to copy repository: ${error}`);
    process.exit(1);
  }

  // Check for docker-compose.yml
  try {
    await execAsync(`test -f "${targetPath}/docker-compose.yml"`);
  } catch {
    logger.warning(`docker-compose.yml not found in ${targetPath}`);
    logger.info('Simulation may not start correctly.');
  }
}

export async function isRepoInstalled(targetName: string): Promise<boolean> {
  const targetPath = `/tmp/vsp-${targetName}`;
  try {
    await execAsync(`test -d "${targetPath}"`);
    return true;
  } catch {
    return false;
  }
}