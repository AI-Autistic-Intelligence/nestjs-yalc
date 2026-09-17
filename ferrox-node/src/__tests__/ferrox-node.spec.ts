import 'reflect-metadata';
import {
  FerroxApp,
  Controller,
  Get,
  Post,
  UseGuard,
  PasetoAuthService,
  TotpAuthService,
  MandatoryComplianceGuard,
  FerroxSentinelSecurityEngine,
} from '../index';

@Controller('/api/v1/test')
class TestController {
  @Get('/ping')
  getPing() {
    return { status: 'OK', framework: 'Ferrox-Node' };
  }

  @Post('/echo')
  postEcho(req: any) {
    return { echo: req.body };
  }
}

describe('Ferrox-Node Framework Suite', () => {
  let pasetoService: PasetoAuthService;
  let totpService: TotpAuthService;
  let complianceGuard: MandatoryComplianceGuard;

  beforeEach(() => {
    pasetoService = new PasetoAuthService('test-secret-key-32-bytes-long!!');
    totpService = new TotpAuthService();
    complianceGuard = new MandatoryComplianceGuard();
  });

  it('should initialize FerroxApp with Fastify engine', () => {
    const app = new FerroxApp({
      engine: 'fastify',
      port: 9001,
      controllers: [new TestController()],
      globalGuards: [complianceGuard],
    });
    expect(app).toBeDefined();
  });

  it('should initialize FerroxApp with Express engine', () => {
    const app = new FerroxApp({
      engine: 'express',
      port: 9002,
      controllers: [new TestController()],
      globalGuards: [complianceGuard],
    });
    expect(app).toBeDefined();
  });

  it('should generate and verify PASETO v4.local tokens', () => {
    const payload = { sub: 'usr_123', roles: ['admin', 'founder'] };
    const token = pasetoService.generateV4LocalToken(payload, 3600);
    expect(token).toMatch(/^v4\.local\./);

    const verified = pasetoService.verifyV4LocalToken(token);
    expect(verified.sub).toBe('usr_123');
    expect(verified.roles).toContain('admin');
    expect(verified.roles).toContain('founder');
  });

  it('should reject expired PASETO tokens', () => {
    const payload = { sub: 'usr_expired' };
    const token = pasetoService.generateV4LocalToken(payload, -10);
    expect(() => pasetoService.verifyV4LocalToken(token)).toThrow('PASETO token has expired');
  });

  it('should generate TOTP secret and format otpauth URI', () => {
    const secret = totpService.generateSecret();
    expect(secret.length).toBeGreaterThanOrEqual(16);

    const uri = totpService.generateOtpAuthUri('user@ferrox.dev', secret, 'FerroxSaaS');
    expect(uri).toContain('otpauth://totp/FerroxSaaS:user%40ferrox.dev');
    expect(uri).toContain(`secret=${secret}`);
  });

  it('should enforce Mandatory Compliance Headers', () => {
    const req: any = { headers: {} };
    const resHeaders: Record<string, string> = {};
    const res: any = {
      setHeader: (key: string, val: string) => {
        resHeaders[key] = val;
      },
      status: () => res,
      json: () => {},
    };

    const allowed = complianceGuard.canActivate(req, res);
    expect(allowed).toBe(true);
    expect(resHeaders['X-Content-Type-Options']).toBe('nosniff');
    expect(resHeaders['X-Frame-Options']).toBe('DENY');
    expect(resHeaders['Strict-Transport-Security']).toBe('max-age=31536000; includeSubDomains; preload');
    expect(resHeaders['X-Ferrox-Kernel-Compliance']).toBe('ENFORCED');
  });

  it('should generate Linux Seccomp BPF policy and Sysctl hardening configs', () => {
    const engine = new FerroxSentinelSecurityEngine();
    const seccomp = engine.generateSeccompBpfPolicy();
    expect(seccomp).toContain('SCMP_ACT_KILL');
    expect(seccomp).toContain('execve');

    const sysctl = engine.generateSysctlHardeningConfig();
    expect(sysctl).toContain('net.ipv4.tcp_syncookies = 1');
    expect(sysctl).toContain('kernel.kptr_restrict = 2');
  });
});
