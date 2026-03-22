import { getAllPackages } from '../lib/packages.js';
import { isRunning } from '../lib/docker.js';
import { logger } from '../lib/logger.js';
import { isRepoInstalled } from '../lib/setup.js';
export async function listCommand() {
    const packages = getAllPackages();
    const rows = await Promise.all(packages.map(async (pkg) => {
        const running = await isRunning(pkg.name);
        const installed = await isRepoInstalled(pkg.name);
        return [
            pkg.name,
            running ? 'running' : installed ? 'stopped' : 'not installed',
            pkg.port.toString(),
            pkg.description
        ];
    }));
    logger.header('AVAILABLE PACKAGES');
    logger.table(['NAME', 'STATUS', 'PORT', 'DESCRIPTION'], rows);
}
//# sourceMappingURL=list.js.map