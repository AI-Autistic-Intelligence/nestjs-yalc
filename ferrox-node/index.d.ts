export * from '@nestjs/common';
export class PasetoAuthService {
  constructor(...args: any[]);
  generateV4LocalToken(...args: any[]): any;
}
export class TotpAuthService {
  constructor(...args: any[]);
  generateSecret(...args: any[]): any;
  generateOtpAuthUri(...args: any[]): any;
  verifyTotpCode(...args: any[]): any;
}
export class FerroxApp {
  constructor(...args: any[]);
  start(...args: any[]): any;
}
export class MandatoryComplianceGuard {
  constructor(...args: any[]);
}
export class FerroxSelfTestEngine {
  constructor(...args: any[]);
  runDiagnosticAudit(): any;
  runKaliRedTeamAudit(url: any): any;
}
export class KernelSandboxEngine {
  constructor(...args: any[]);
  generateSeccompBpfPolicy(): any;
  generateLandlockPolicy(): any;
  generateSysctlHardeningConfig(): any;
}
export const Roles: (...args: any[]) => any;
