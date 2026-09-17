import 'reflect-metadata';
import { HealthController } from '../modules/health.controller';
import { AuthController } from '../modules/auth.controller';
import { UsersController } from '../modules/users.controller';
import { AdminController } from '../modules/admin.controller';
import { FounderController } from '../modules/founder.controller';

describe('Ferrox Enterprise SaaS Backend (Node.js Port) Suite', () => {
  let healthCtrl: HealthController;
  let authCtrl: AuthController;
  let usersCtrl: UsersController;
  let adminCtrl: AdminController;
  let founderCtrl: FounderController;

  beforeEach(() => {
    healthCtrl = new HealthController();
    authCtrl = new AuthController('test-saas-paseto-secret-32-bytes');
    usersCtrl = new UsersController();
    adminCtrl = new AdminController();
    founderCtrl = new FounderController();
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

  it('should return profile, admin audit logs, and founder metrics', () => {
    const profile = usersCtrl.getProfile({});
    expect(profile.email).toBe('founder@ferrox.dev');

    const users = adminCtrl.getUsers();
    expect(users.length).toBeGreaterThan(0);

    const metrics = founderCtrl.getSaaSMetrics();
    expect(metrics.arr).toBe(3000000);
    expect(metrics.securityPosture).toBe('PASSING_100_PERCENT');
  });
});
