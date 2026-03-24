import { exec } from 'child_process';
import { promisify } from 'util';
import { getPackage } from '../lib/packages.js';
import { logger } from '../lib/logger.js';

const execAsync = promisify(exec);

export async function docsCommand(name?: string): Promise<void> {
  if (!name) {
    // Show documentation for vsp-porto itself
    logger.info('Opening VSP Porto documentation...');
    await openUrl('https://github.com/vspatabuga/vsp-porto-management');
    return;
  }

  const pkg = getPackage(name);
  if (!pkg) {
    logger.error(`Package '${name}' not found. Run 'vsp-porto list' for available packages.`);
    process.exit(1);
  }

  // Try to open local docs first, then fall back to GitHub
  const localDocsPath = `/tmp/vsp-${pkg.name}/docs`;
  const localReadme = `/tmp/vsp-${pkg.name}/README.md`;

  try {
    // Check for local docs
    await execAsync(`test -d "${localDocsPath}"`);
    logger.info(`Opening local documentation for ${pkg.displayName}...`);
    
    // Open README as fallback since docs directory is preferred
    await execAsync(`open "${localReadme}" 2>/dev/null || xdg-open "${localReadme}" 2>/dev/null || echo "Cannot open file. Path: ${localReadme}"`);
    
  } catch {
    // Fall back to GitHub
    logger.info(`Opening GitHub documentation for ${pkg.displayName}...`);
    await openUrl(pkg.githubUrl);
  }
}

async function openUrl(url: string): Promise<void> {
  const { platform } = process;
  
  let command: string;
  
  if (platform === 'darwin') {
    command = `open "${url}"`;
  } else if (platform === 'win32') {
    command = `start "" "${url}"`;
  } else {
    command = `xdg-open "${url}"`;
  }

  try {
    execAsync(`${command} &`);
    console.log(`Opened: ${url}`);
  } catch {
    console.log(`Please open: ${url}`);
  }
}
