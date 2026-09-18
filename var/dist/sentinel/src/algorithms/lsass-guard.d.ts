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
