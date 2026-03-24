import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Open URL in default browser
 */
export async function openBrowser(url: string): Promise<void> {
  const { platform } = process;
  
  let command: string;
  
  if (platform === 'darwin') {
    command = `open "${url}"`;
  } else if (platform === 'win32') {
    command = `start "" "${url}"`;
  } else {
    // Linux
    const browsers = ['xdg-open', 'gnome-open', 'x-www-browser', 'firefox', 'google-chrome'];
    for (const browser of browsers) {
      try {
        await execAsync(`which ${browser}`);
        command = `${browser} "${url}"`;
        break;
      } catch {
        continue;
      }
    }
    command = `xdg-open "${url}"`; // Fallback
  }

  try {
    // Detach the process so it doesn't block
    execAsync(`${command} &`);
  } catch {
    console.log(`Please open: ${url}`);
  }
}

/**
 * Wait for a service to be healthy by polling the URL
 */
export async function waitForHealthCheck(
  url: string, 
  timeoutSeconds: number = 30,
  intervalMs: number = 1000
): Promise<boolean> {
  const startTime = Date.now();
  const endTime = startTime + timeoutSeconds * 1000;

  while (Date.now() < endTime) {
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        signal: AbortSignal.timeout(intervalMs),
      });
      
      if (response.ok || response.status === 301 || response.status === 302) {
        return true;
      }
    } catch {
      // Service not ready yet
    }

    await sleep(intervalMs);
  }

  return false;
}

/**
 * Wait for a specific port to be open
 */
export async function waitForPort(
  port: number,
  timeoutSeconds: number = 30
): Promise<boolean> {
  const startTime = Date.now();
  const endTime = startTime + timeoutSeconds * 1000;

  while (Date.now() < endTime) {
    try {
      await execAsync(`nc -z localhost ${port}`);
      return true;
    } catch {
      // Port not open yet
    }
    await sleep(1000);
  }

  return false;
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get the main container name for a simulation
 */
export function getMainContainerName(simulationName: string): string {
  return `vsp-${simulationName}`;
}

/**
 * Stream logs from simulation containers
 */
export async function streamLogs(
  simulationName: string, 
  follow: boolean = true,
  tail: number = 100
): Promise<void> {
  const { spawn } = await import('child_process');
  const containerName = `vsp-${simulationName}`;
  const args = ['logs'];
  if (follow) args.push('-f');
  args.push('--tail', tail.toString(), containerName);
  
  const dockerLogs = spawn('docker', args, { stdio: 'inherit' });
  
  return new Promise<void>((resolve) => {
    dockerLogs.on('close', () => resolve());
  });
}

/**
 * Get simulation status details
 */
export async function getSimulationStatus(simulationName: string): Promise<{
  running: boolean;
  containers: string[];
  ports: string[];
}> {
  try {
    const { stdout } = await execAsync(
      `docker ps --filter "name=vsp-${simulationName}" --format "{{.Names}}|{{.Ports}}"`,
    );
    
    const lines = stdout.trim().split('\n').filter(Boolean);
    const containers: string[] = [];
    const ports: string[] = [];
    
    for (const line of lines) {
      const [name, portStr] = line.split('|');
      if (name) containers.push(name);
      if (portStr) ports.push(portStr.trim());
    }
    
    return {
      running: containers.length > 0,
      containers,
      ports,
    };
  } catch {
    return {
      running: false,
      containers: [],
      ports: [],
    };
  }
}
