import { PACKAGES, getPackage } from '../lib/packages.js';
import { logger } from '../lib/logger.js';
import { setupLocalRepo } from '../lib/setup.js';
export async function installCommand(packageName) {
    if (!packageName) {
        logger.info('Installing all packages...');
        for (const pkg of PACKAGES) {
            await installPackage(pkg);
        }
        return;
    }
    const pkg = getPackage(packageName);
    if (!pkg) {
        logger.error(`Package '${packageName}' not found. Run 'vsp-porto list' for available packages.`);
        process.exit(1);
    }
    await installPackage(pkg);
}
async function installPackage(pkg) {
    try {
        logger.info(`Installing ${pkg.displayName}...`);
        await setupLocalRepo(pkg.repo, pkg.name);
        logger.success(`${pkg.displayName} installed successfully`);
    }
    catch (error) {
        logger.error(`Failed to install ${pkg.displayName}`);
        console.error(error);
        process.exit(1);
    }
}
//# sourceMappingURL=install.js.map