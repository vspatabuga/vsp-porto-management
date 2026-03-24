import { exec } from 'child_process';
import { promisify } from 'util';
import { logger } from './logger.js';

const execAsync = promisify(exec);

// Default simulation storage path
const DEFAULT_SIM_PATH = '/tmp/vsp';

/**
 * Get the path where a simulation is stored
 */
export function getSimulationPath(simulationName: string): string {
  return `${DEFAULT_SIM_PATH}-${simulationName}`;
}

/**
 * Get the default simulation storage path
 */
export function getSimBasePath(): string {
  return DEFAULT_SIM_PATH;
}

/**
 * Check if a simulation is already installed
 */
export async function isRepoInstalled(targetName: string): Promise<boolean> {
  const targetPath = getSimulationPath(targetName);
  try {
    await execAsync(`test -d "${targetPath}"`);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if docker-compose.yml exists in simulation directory
 */
export async function hasDockerCompose(simName: string): Promise<boolean> {
  const targetPath = getSimulationPath(simName);
  try {
    await execAsync(`test -f "${targetPath}/docker-compose.yml"`);
    return true;
  } catch {
    return false;
  }
}

/**
 * Clean up simulation directory
 */
export async function cleanupSimulation(simName: string): Promise<void> {
  const targetPath = getSimulationPath(simName);
  try {
    await execAsync(`rm -rf "${targetPath}"`);
    logger.muted(`Cleaned up: ${targetPath}`);
  } catch {
    // Ignore errors
  }
}

/**
 * Get list of all installed simulations
 */
export async function getInstalledSimulations(): Promise<string[]> {
  const installed: string[] = [];
  
  try {
    const { stdout } = await execAsync(`ls -d ${DEFAULT_SIM_PATH}-* 2>/dev/null || true`);
    const dirs = stdout.trim().split('\n').filter(Boolean);
    
    for (const dir of dirs) {
      const name = dir.replace(`${DEFAULT_SIM_PATH}-`, '');
      if (name) {
        installed.push(name);
      }
    }
  } catch {
    // No simulations installed
  }
  
  return installed;
}

// Legacy function for backward compatibility
export async function setupLocalRepo(repoName: string, targetName: string): Promise<void> {
  const sourcePath = `/home/vsp/${repoName}`;
  const targetPath = getSimulationPath(targetName);

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
