/**
 * # LSASS Process Handle & Credential Dumping Guard (`lsass-guard.ts`)
 * Intercepts process handle access requests targeting security processes
 * (Academic Ref: *Evading EDR*, No Starch Press - Ch. 4 & 12).
 */

export interface ProcessHandleTelemetry {
  sourcePid: number;
  targetProcessName: string;
  requestedAccessMask: number; // e.g. PROCESS_VM_READ (0x0010), PROCESS_DUP_HANDLE (0x0040)
  isSignedBinary: boolean;
}

export interface CredentialDumpAlert {
  sourcePid: number;
  targetProcess: string;
  threatSeverity: number;
  rationale: string;
}

export class LsassCredentialGuardEngine {
  public static inspectHandleAccess(telemetry: ProcessHandleTelemetry): CredentialDumpAlert | null {
    const targetLower = telemetry.targetProcessName.toLowerCase();
    const isTargetSecurityProcess =
      targetLower.includes('lsass') || targetLower.includes('winlogon') || targetLower.includes('services.exe');

    if (isTargetSecurityProcess) {
      const vmRead = (telemetry.requestedAccessMask & 0x0010) !== 0;
      const dupHandle = (telemetry.requestedAccessMask & 0x0040) !== 0;

      if ((vmRead || dupHandle) && !telemetry.isSignedBinary) {
        return {
          sourcePid: telemetry.sourcePid,
          targetProcess: telemetry.targetProcessName,
          threatSeverity: 0.99,
          rationale: `Unsigned Process (PID ${telemetry.sourcePid}) requested VM_READ/DUP_HANDLE access on ${telemetry.targetProcessName}`,
        };
      }
    }

    return null;
  }
}
