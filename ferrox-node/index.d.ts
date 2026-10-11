export * from '@nestjs/common';
export class PasetoAuthService {
  constructor(...args: unknown[]);
  generateV4LocalToken(...args: unknown[]): any;
}
export class TotpAuthService {
  constructor(...args: unknown[]);
  generateSecret(...args: unknown[]): any;
  generateOtpAuthUri(...args: unknown[]): any;
  verifyTotpCode(...args: unknown[]): any;
}
export class FerroxApp {
  constructor(...args: unknown[]);
  start(...args: unknown[]): any;
}
export class MandatoryComplianceGuard {
  constructor(...args: unknown[]);
}
export class FerroxSelfTestEngine {
  constructor(...args: unknown[]);
  runDiagnosticAudit(): any;
  runKaliRedTeamAudit(url: any): any;
}
export class KernelSandboxEngine {
  constructor(...args: unknown[]);
  generateSeccompBpfPolicy(): any;
  generateLandlockPolicy(): any;
  generateSysctlHardeningConfig(): any;
}
export const Roles: (...args: unknown[]) => any;
