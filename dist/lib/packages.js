export const PACKAGES = [
    {
        name: 'kalpataru',
        displayName: 'Kalpataru',
        description: 'Waste Management & Circular Economy System',
        port: 3001,
        defaultPort: 3001,
        repo: 'kalpataru-backend-configuration',
        npmPackage: '@vspatabuga/sim-kalpataru',
        githubUrl: 'https://github.com/vspatabuga/kalpataru-backend-configuration',
        installed: false,
        status: 'not-installed'
    },
    {
        name: 'ai-gov',
        displayName: 'AI Governance',
        description: 'Private AI Orchestration Stack',
        port: 3003,
        defaultPort: 3003,
        repo: 'ai-governance-orchestrator',
        npmPackage: '@vspatabuga/sim-ai-gov',
        githubUrl: 'https://github.com/vspatabuga/ai-governance-orchestrator',
        installed: false,
        status: 'not-installed'
    },
    {
        name: 'ledger',
        displayName: 'Blockchain Ledger',
        description: 'Immutable Voting System',
        port: 3000,
        defaultPort: 3000,
        repo: 'evote-blockchain-dapps',
        npmPackage: '@vspatabuga/sim-ledger',
        githubUrl: 'https://github.com/vspatabuga/evote-blockchain-dapps',
        installed: false,
        status: 'not-installed'
    },
    {
        name: 'iac',
        displayName: 'Multi-Cloud IaC',
        description: 'Terraform Infrastructure Simulation',
        port: 3002,
        defaultPort: 3002,
        repo: 'sovereign-cloud-fabric',
        npmPackage: '@vspatabuga/sim-iac',
        githubUrl: 'https://github.com/vspatabuga/sovereign-cloud-fabric',
        installed: false,
        status: 'not-installed'
    },
    {
        name: 'zero-trust',
        displayName: 'Zero-Trust Network',
        description: 'Identity-Centric Security Architecture',
        port: 3004,
        defaultPort: 3004,
        repo: 'zero-trust-network',
        npmPackage: '@vspatabuga/sim-zero-trust',
        githubUrl: 'https://github.com/vspatabuga/zero-trust-network',
        installed: false,
        status: 'not-installed'
    }
];
export function getPackage(name) {
    return PACKAGES.find(p => p.name === name ||
        p.displayName.toLowerCase() === name.toLowerCase() ||
        p.npmPackage === name);
}
export function getAllPackages() {
    return [...PACKAGES];
}
export function getPackageByNpm(npmPackage) {
    return PACKAGES.find(p => p.npmPackage === npmPackage);
}
//# sourceMappingURL=packages.js.map