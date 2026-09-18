export interface SeccompSyscallRule {
    name: string;
    action: 'SCMP_ACT_ALLOW' | 'SCMP_ACT_KILL' | 'SCMP_ACT_ERRNO';
    comment?: string;
}
export interface LandlockPathRule {
    path: string;
    allowedAccess: ('read' | 'write' | 'execute')[];
}
export declare class KernelSandboxEngine {
    generateSeccompBpfPolicy(): string;
    generateLandlockPolicy(paths?: LandlockPathRule[]): string;
    generateSysctlHardeningConfig(): string;
}
