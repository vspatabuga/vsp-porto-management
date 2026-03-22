import { exec } from 'child_process';
import { promisify } from 'util';
import { PACKAGES, getPackage } from '../lib/packages.js';
import { logger } from '../lib/logger.js';
const execAsync = promisify(exec);
export async function installCommand(packageName) {
    if (!packageName) {
        logger.info('Installing all packages...');
        for (const pkg of PACKAGES) {
            await installPackage(pkg.name);
        }
        return;
    }
    const pkg = getPackage(packageName);
    if (!pkg) {
        logger.error(`Package '${packageName}' not found. Run 'vsp-porto list' for available packages.`);
        process.exit(1);
    }
    await installPackage(pkg.name);
}
async function installPackage(name) {
    const packageName = `@vspatabuga/porto-${name}`;
    try {
        logger.info(`Installing ${packageName}...`);
        await execAsync(`npm install -g ${packageName}`, {
            env: { ...process.env, npm_config_registry: 'https://npm.pkg.github.com' }
        });
        logger.success(`${packageName} installed successfully`);
    }
    catch (error) {
        logger.error(`Failed to install ${packageName}`);
        console.error(error);
        process.exit(1);
    }
}
//# sourceMappingURL=install.js.map