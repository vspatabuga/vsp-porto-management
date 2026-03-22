import Docker from 'dockerode';
export declare function checkDocker(): Promise<boolean>;
export declare function getContainers(name: string): Promise<Docker.ContainerInfo[]>;
export declare function isRunning(name: string): Promise<boolean>;
export declare function pullImage(image: string): Promise<void>;
export declare function startSimulation(name: string): Promise<void>;
export declare function stopSimulation(name: string): Promise<void>;
export declare function destroySimulation(name: string): Promise<void>;
export declare function getContainerName(name: string, suffix: string): string;
//# sourceMappingURL=docker.d.ts.map