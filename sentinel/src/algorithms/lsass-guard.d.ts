/**
 * # LSASS Process Handle & Credential Dumping Guard (`lsass-guard.ts`)
 * Intercepts process handle access requests targeting security processes
 * (Academic Ref: *Evading EDR*, No Starch Press - Ch. 4 & 12).
 */
export interface ProcessHandleTelemetry {
    sourcePid: number;
    targetProcessName: string;
    requestedAccessMask: number;
    isSignedBinary: boolean;
}
export interface CredentialDumpAlert {
    sourcePid: number;
    targetProcess: string;
    threatSeverity: number;
    rationale: string;
}
export declare class LsassCredentialGuardEngine {
    static inspectHandleAccess(telemetry: ProcessHandleTelemetry): CredentialDumpAlert | null;
}
