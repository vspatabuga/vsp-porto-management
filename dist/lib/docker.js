import Docker from 'dockerode';
import { logger } from './logger.js';
const docker = new Docker();
export async function checkDocker() {
    try {
        await docker.ping();
        return true;
    }
    catch {
        return false;
    }
}
export async function getContainers(name) {
    const allContainers = await docker.listContainers({ all: true });
    return allContainers.filter(c => c.Names.some(n => n.includes(`vsp-${name}`)));
}
export async function isRunning(name) {
    const containers = await getContainers(name);
    return containers.some(c => c.State === 'running');
}
export async function pullImage(image) {
    logger.info(`Pulling ${image}...`);
    await new Promise((resolve, reject) => {
        docker.pull(image, (err, stream) => {
            if (err) {
                reject(err);
                return;
            }
            docker.modem.followProgress(stream, (err) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    });
}
export async function startSimulation(name) {
    logger.info(`Starting ${name} simulation...`);
    const containers = await getContainers(name);
    for (const container of containers) {
        const c = docker.getContainer(container.Id);
        if (container.State !== 'running') {
            await c.start();
        }
    }
}
export async function stopSimulation(name) {
    logger.info(`Stopping ${name} simulation...`);
    const containers = await getContainers(name);
    for (const container of containers) {
        const c = docker.getContainer(container.Id);
        if (container.State === 'running') {
            await c.stop();
        }
    }
}
export async function destroySimulation(name) {
    logger.info(`Destroying ${name} simulation...`);
    const containers = await getContainers(name);
    for (const container of containers) {
        const c = docker.getContainer(container.Id);
        await c.remove({ force: true, v: true });
    }
}
export function getContainerName(name, suffix) {
    return `vsp-${name}-${suffix}`;
}
//# sourceMappingURL=docker.js.map