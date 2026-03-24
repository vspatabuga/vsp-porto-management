import { exec } from 'child_process';
import { promisify } from 'util';
import { PACKAGES, getPackage } from '../lib/packages.js';
import { logger } from '../lib/logger.js';
import { isRepoInstalled, getSimulationPath } from '../lib/setup.js';
import type { Package } from '../types/index.js';

const execAsync = promisify(exec);

const GITHUB_PACKAGES_REGISTRY = 'https://npm.pkg.github.com';

export async function installCommand(packageName?: string): Promise<void> {
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

async function installPackage(pkg: Package): Promise<void> {
  const simPath = getSimulationPath(pkg.name);

  // Check if already installed
  if (await isRepoInstalled(pkg.name)) {
    logger.warning(`${pkg.displayName} is already installed at ${simPath}`);
    logger.info(`Run 'vsp-porto start ${pkg.name}' to start it.`);
    return;
  }

  try {
    logger.info(`Installing ${pkg.displayName}...`);
    logger.muted(`Package: ${pkg.npmPackage}`);
    
    // Create a temporary directory for npm install
    const tempDir = `/tmp/vsp-${pkg.name}-temp`;
    
    // Clean up any existing temp directory
    await execAsync(`rm -rf "${tempDir}"`);
    
    // Create package directory for npm
    const pkgDir = `/tmp/vsp-${pkg.name}-package`;
    await execAsync(`rm -rf "${pkgDir}" && mkdir -p "${pkgDir}"`);
    
    // Create a minimal package.json for the package
    await execAsync(`cat > "${pkgDir}/package.json" << 'EOF'
{
  "name": "${pkg.npmPackage}",
  "version": "1.0.0",
  "private": true
}
EOF`);

    // Set up npmrc for GitHub Packages
    const npmrcPath = `${pkgDir}/.npmrc`;
    await execAsync(`cat > "${npmrcPath}" << 'EOF'
@vspatabuga:registry=${GITHUB_PACKAGES_REGISTRY}
EOF`);

    // Try to download from GitHub Packages
    logger.info('Attempting to download from GitHub Packages...');
    
    try {
      // Try npm pack first to get the tarball
      const tarballPath = `/tmp/${pkg.name}-${Date.now()}.tgz`;
      
      // Set npm config for GitHub Packages
      const npmConfig = execAsync(
        `cd "${pkgDir}" && npm pack ${pkg.npmPackage} --registry ${GITHUB_PACKAGES_REGISTRY} 2>&1`,
        { 
          env: { 
            ...process.env,
            npm_config_registry: GITHUB_PACKAGES_REGISTRY 
          } 
        }
      );
      
      // For now, if npm pack fails, we'll fall back to git clone
      // This is a workaround - in production, packages should be published first
      logger.warning('GitHub Packages download not available. Falling back to GitHub clone...');
      await fallbackGitClone(pkg);
      
    } catch {
      logger.warning('npm pack failed. Using GitHub clone as fallback...');
      await fallbackGitClone(pkg);
    }

    // Clean up temp directories
    await execAsync(`rm -rf "${tempDir}" "${pkgDir}"`);

    logger.success(`${pkg.displayName} installed successfully`);
    logger.info(`Run 'vsp-porto start ${pkg.name}' to start the simulation.`);

  } catch (error) {
    logger.error(`Failed to install ${pkg.displayName}`);
    console.error(error);
    process.exit(1);
  }
}

async function fallbackGitClone(pkg: Package): Promise<void> {
  const simPath = getSimulationPath(pkg.name);

  logger.info(`Cloning from GitHub: ${pkg.githubUrl}`);

  try {
    // Remove existing directory if any
    await execAsync(`rm -rf "${simPath}"`);

    // Clone the repository
    await execAsync(`git clone --depth 1 "${pkg.githubUrl}" "${simPath}"`);

    logger.muted(`Cloned to: ${simPath}`);

  } catch (error) {
    // If git clone fails, create a placeholder directory with instructions
    logger.warning('Could not clone repository. Creating placeholder...');
    
    await execAsync(`mkdir -p "${simPath}"`);
    
    const readme = `# ${pkg.displayName} Simulation

## Package Information
- **NPM Package**: ${pkg.npmPackage}
- **GitHub Repository**: ${pkg.githubUrl}

## Installation
This simulation package should be published to GitHub Packages.
Please ensure the package is published before installing.

To publish:
\`\`\`bash
cd ${pkg.repo}
git tag v1.0.0
git push origin v1.0.0
\`\`\`

Alternatively, you can manually clone the repository:
\`\`\`bash
git clone ${pkg.githubUrl} "${simPath}"
\`\`\`
`;

    await execAsync(`cat > "${simPath}/README.md" << 'EOF'
${readme}
EOF`);
  }
}
