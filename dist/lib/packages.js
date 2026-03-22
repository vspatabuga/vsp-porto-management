export const PACKAGES = [
    {
        name: 'kalpataru',
        displayName: 'Kalpataru',
        description: 'Waste Management & Circular Economy',
        port: 3000,
        repo: 'kalpataru-backend-configuration',
        installed: false,
        status: 'not-installed'
    },
    {
        name: 'ai-gov',
        displayName: 'AI Governance',
        description: 'Private AI Orchestration Stack',
        port: 3003,
        repo: 'ai-governance-orchestrator',
        installed: false,
        status: 'not-installed'
    },
    {
        name: 'ledger',
        displayName: 'Blockchain Ledger',
        description: 'Immutable Voting System',
        port: 3001,
        repo: 'evote-blockchain-dapps',
        installed: false,
        status: 'not-installed'
    },
    {
        name: 'iac',
        displayName: 'Multi-Cloud IaC',
        description: 'Terraform Infrastructure Simulation',
        port: 3002,
        repo: 'sovereign-cloud-fabric',
        installed: false,
        status: 'not-installed'
    },
    {
        name: 'zero-trust',
        displayName: 'Zero-Trust Network',
        description: 'Identity-Centric Security',
        port: 3004,
        repo: 'zero-trust-network',
        installed: false,
        status: 'not-installed'
    }
];
export function getPackage(name) {
    return PACKAGES.find(p => p.name === name || p.displayName.toLowerCase() === name.toLowerCase());
}
export function getAllPackages() {
    return [...PACKAGES];
}
//# sourceMappingURL=packages.js.map