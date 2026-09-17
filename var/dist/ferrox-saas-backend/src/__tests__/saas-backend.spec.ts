import 'reflect-metadata';
import { HealthController } from '../modules/health.controller';
import { AuthController } from '../modules/auth.controller';
import { UsersController } from '../modules/users.controller';
import { AdminController } from '../modules/admin.controller';
import { FounderController } from '../modules/founder.controller';
import { AdminDashboardController } from '../modules/admin-dashboard.controller';
import { FounderDashboardController } from '../modules/founder-dashboard.controller';

describe('Ferrox Enterprise SaaS Backend Complete Suite', () => {
  let healthCtrl: HealthController;
  let authCtrl: AuthController;
  let usersCtrl: UsersController;
  let adminCtrl: AdminController;
  let founderCtrl: FounderController;
  let adminDashCtrl: AdminDashboardController;
  let founderDashCtrl: FounderDashboardController;

  beforeEach(() => {
    healthCtrl = new HealthController();
    authCtrl = new AuthController('test-saas-paseto-secret-32-bytes');
    usersCtrl = new UsersController();
    adminCtrl = new AdminController();
    founderCtrl = new FounderController();
    adminDashCtrl = new AdminDashboardController();
    founderDashCtrl = new FounderDashboardController();
  });

  it('should return health status UP with kernel compliance ENFORCED', () => {
    const health = healthCtrl.getHealth();
    expect(health.status).toBe('UP');
    expect(health.framework).toContain('Ferrox-Node');
    expect(health.kernelCompliance).toBe('ENFORCED');
  });

  it('should issue PASETO v4.local tokens on login', () => {
    const loginRes = authCtrl.login({ body: { email: 'admin@ferrox.dev' } });
    expect(loginRes.tokenType).toBe('PASETO v4.local');
    expect(loginRes.token).toMatch(/^v4\.local\./);
  });

  it('should generate TOTP 2FA secret and verify code', () => {
    const setupRes = authCtrl.totpSetup({ body: { email: 'admin@ferrox.dev' } });
    expect(setupRes.secret).toBeDefined();
    expect(setupRes.otpAuthUri).toContain('otpauth://totp/FerroxSaaS');

    const verifyRes = authCtrl.totpVerify({ body: { secret: setupRes.secret, code: '000000' } });
    expect(verifyRes).toHaveProperty('isValid');
  });

  it('should render Admin Dashboard HTML and execute SelfTest & Kali Red-Team audits', () => {
    const html = adminDashCtrl.getAdminDashboardHtml();
    expect(html).toContain('Ferrox Security Admin Dashboard');
    expect(html).toContain('Ecosystem Security Posture');

    const selfTest = adminDashCtrl.runSelfTest();
    expect(selfTest.overallScore).toBe(100);

    const kaliReport = adminDashCtrl.runKaliAudit({ body: { targetUrl: 'http://localhost:8080' } });
    expect(kaliReport.overallVerdict).toBe('SECURE_PASS');
  });

  it('should return Kernel Sandbox policies (Seccomp BPF / Landlock) and Sysctl config', () => {
    const sandbox = adminDashCtrl.getKernelSandboxPolicy();
    expect(sandbox.seccompBpf.defaultAction).toBe('SCMP_ACT_ERRNO');

    const sysctl = adminDashCtrl.getKernelSysctlConfig();
    expect(sysctl.sysctlConfig).toContain('net.ipv4.tcp_syncookies = 1');
  });

  it('should render Founder Suite HTML and return SaaS metrics', () => {
    const html = founderDashCtrl.getFounderDashboardHtml();
    expect(html).toContain('Ferrox Founder Suite Executive Dashboard');
    expect(html).toContain('$250,000');

    const profile = usersCtrl.getProfile();
    expect(profile.email).toBe('founder@ferrox.dev');

    const users = adminCtrl.getUsers();
    expect(users.length).toBeGreaterThan(0);

    const metrics = founderCtrl.getSaaSMetrics();
    expect(metrics.arr).toBe(3000000);
  });
});
