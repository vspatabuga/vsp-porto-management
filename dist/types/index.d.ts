export interface Package {
    name: string;
    displayName: string;
    description: string;
    port: number;
    repo: string;
    installed: boolean;
    status: 'stopped' | 'running' | 'not-installed';
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
//# sourceMappingURL=index.d.ts.map