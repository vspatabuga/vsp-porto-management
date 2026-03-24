export interface Package {
    name: string;
    displayName: string;
    description: string;
    port: number;
    repo: string;
    npmPackage: string;
    githubUrl: string;
    installed: boolean;
    status: 'stopped' | 'running' | 'not-installed';
    defaultPort: number;
}
export interface Config {
    version: string;
    registry: string;
    installedPackages: string[];
    runningSimulations: string[];
    dataDir: string;
}
export interface DockerContainer {
    name: string;
    status: string;
    ports: string[];
}
export interface SimulationInfo {
    name: string;
    path: string;
    port: number;
    npmPackage: string;
}
//# sourceMappingURL=index.d.ts.map