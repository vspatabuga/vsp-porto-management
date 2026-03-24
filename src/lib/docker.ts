import Docker from 'dockerode';
import { logger } from './logger.js';

const docker = new Docker();

export async function checkDocker(): Promise<boolean> {
  try {
    await docker.ping();
    return true;
  } catch {
    return false;
  }
}

export async function getContainers(name: string): Promise<Docker.ContainerInfo[]> {
  const allContainers = await docker.listContainers({ all: true });
  // Container names use underscores, not hyphens
  // e.g., "zero-trust" becomes "vsp_zero_trust_web"
  const nameWithUnderscores = name.replace(/-/g, '_');
  return allContainers.filter(c => 
    c.Names.some(n => n.includes(`vsp_${nameWithUnderscores}`))
  );
}

export async function isRunning(name: string): Promise<boolean> {
  const containers = await getContainers(name);
  return containers.some(c => c.State === 'running');
}

export async function pullImage(image: string): Promise<void> {
  logger.info(`Pulling ${image}...`);
  await new Promise<void>((resolve, reject) => {
    docker.pull(image, (err: Error | null, stream: NodeJS.ReadableStream) => {
      if (err) {
        reject(err);
        return;
      }
      docker.modem.followProgress(stream, (err: Error | null) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });
}

export async function startSimulation(name: string): Promise<void> {
  logger.info(`Starting ${name} simulation...`);
  const containers = await getContainers(name);
  
  for (const container of containers) {
    const c = docker.getContainer(container.Id);
    if (container.State !== 'running') {
      await c.start();
    }
  }
}

export async function stopSimulation(name: string): Promise<void> {
  logger.info(`Stopping ${name} simulation...`);
  const containers = await getContainers(name);
  
  for (const container of containers) {
    const c = docker.getContainer(container.Id);
    if (container.State === 'running') {
      await c.stop();
    }
  }
}

export async function destroySimulation(name: string): Promise<void> {
  logger.info(`Destroying ${name} simulation...`);
  const containers = await getContainers(name);
  
  for (const container of containers) {
    const c = docker.getContainer(container.Id);
    await c.remove({ force: true, v: true });
  }
}

export function getContainerName(name: string, suffix: string): string {
  // Container names use underscores
  const nameWithUnderscores = name.replace(/-/g, '_');
  return `vsp_${nameWithUnderscores}_${suffix}`;
}
