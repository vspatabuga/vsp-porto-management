import { exec } from 'child_process';
import { promisify } from 'util';
import { getPackage } from '../lib/packages.js';
import { checkDocker, isRunning } from '../lib/docker.js';
import { logger } from '../lib/logger.js';
import { isRepoInstalled, getSimulationPath, hasDockerCompose } from '../lib/setup.js';
import { openBrowser, waitForHealthCheck } from '../lib/simulation.js';
const execAsync = promisify(exec);
export async function startCommand(name, options = {}) {
    if (!(await checkDocker())) {
        logger.error('Docker is not running. Please start Docker first.');
        process.exit(1);
    }
    const pkg = getPackage(name);
    if (!pkg) {
        logger.error(`Package '${name}' not found. Run 'vsp-porto list' for available packages.`);
        process.exit(1);
    }
    const simPath = getSimulationPath(pkg.name);
    const installed = await isRepoInstalled(pkg.name);
    if (!installed) {
        logger.error(`${pkg.displayName} is not installed.`);
        logger.info(`Run 'vsp-porto install ${pkg.name}' first.`);
        process.exit(1);
    }
    const hasCompose = await hasDockerCompose(pkg.name);
    if (!hasCompose) {
        logger.error(`docker-compose.yml not found in ${simPath}`);
        logger.error('This simulation package may not be properly configured.');
        process.exit(1);
    }
    const running = await isRunning(pkg.name);
    if (running) {
        logger.warning(`${pkg.displayName} is already running on port ${pkg.port}`);
        logger.info(`Open: http://localhost:${pkg.port}`);
        return;
    }
    logger.info(`Starting ${pkg.displayName} simulation...`);
    logger.muted(`Directory: ${simPath}`);
    try {
        // Start docker-compose
        await execAsync(`cd "${simPath}" && docker compose -p vsp-${pkg.name} up -d`, { cwd: simPath });
        logger.success(`${pkg.displayName} started!`);
        // Wait for health check if requested
        if (options.check !== false) {
            logger.info('Waiting for services to be ready...');
            const isHealthy = await waitForHealthCheck(`http://localhost:${pkg.port}`, 30);
            if (isHealthy) {
                logger.success('Services are ready!');
            }
            else {
                logger.warning('Services may not be fully ready yet.');
                logger.info('Check status with: vsp-porto logs ' + pkg.name);
            }
        }
        // Auto-open browser if requested
        if (options.open) {
            await openBrowser(`http://localhost:${pkg.port}`);
        }
        // Display access information
        displayAccessInfo(pkg);
    }
    catch (error) {
        logger.error(`Failed to start ${pkg.displayName}`);
        console.error(error);
        logger.info('Check logs with: docker compose -p vsp-' + pkg.name + ' logs');
        process.exit(1);
    }
}
function displayAccessInfo(pkg) {
    console.log('');
    logger.success('═══════════════════════════════════════════════════════════════');
    console.log('');
    console.log(`  ${pkg.displayName} Simulation`);
    console.log(`  ${pkg.description}`);
    console.log('');
    console.log('  Access URLs:');
    console.log(`    🌐  http://localhost:${pkg.port}`);
    console.log('');
    console.log('  Commands:');
    console.log(`    vsp-porto open ${pkg.name}     → Open in browser`);
    console.log(`    vsp-porto logs ${pkg.name}     → View logs`);
    console.log(`    vsp-porto stop ${pkg.name}     → Stop simulation`);
    console.log('');
    logger.success('═══════════════════════════════════════════════════════════════');
    console.log('');
}
//# sourceMappingURL=start.js.map