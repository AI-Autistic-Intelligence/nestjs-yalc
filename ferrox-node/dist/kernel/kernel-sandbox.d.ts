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
    /**
     * Generates Linux Seccomp BPF syscall filter configuration
     */
    generateSeccompBpfPolicy(): string;
    /**
     * Generates Linux Landlock LSM filesystem sandbox boundary configuration
     */
    generateLandlockPolicy(paths?: LandlockPathRule[]): string;
    /**
     * Generates /etc/sysctl.d/99-ferrox-kernel-hardening.conf sysctl configuration
     */
    generateSysctlHardeningConfig(): string;
}
