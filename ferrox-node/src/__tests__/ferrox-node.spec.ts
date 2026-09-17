import 'reflect-metadata';
import {
  FerroxApp,
  Controller,
  Get,
  Post,
  PasetoAuthService,
  TotpAuthService,
  MandatoryComplianceGuard,
  KernelSandboxEngine,
  FerroxSelfTestEngine,
  CircuitBreaker,
  RateLimiter,
  Singleflight,
  CqrsEngine,
  SagaOrchestrator,
  FerroxDataGridEngine,
  FerroxCrudGenerator,
  FerroxJobQueue,
  StorageEngine,
  I18nEngine,
  TracingEngine,
  FerroxLogger,
  ConfigEngine,
  WebSocketTransportAdapter,
  KafkaEventBusAdapter,
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

describe('Ferrox-Node 100% Complete Framework Suite', () => {
  let pasetoService: PasetoAuthService;
  let totpService: TotpAuthService;
  let complianceGuard: MandatoryComplianceGuard;

  beforeEach(() => {
    pasetoService = new PasetoAuthService('test-secret-key-32-bytes-long!!');
    totpService = new TotpAuthService();
    complianceGuard = new MandatoryComplianceGuard();
  });

  it('should initialize FerroxApp with Fastify & Express engines', () => {
    const fastifyApp = new FerroxApp({
      engine: 'fastify',
      port: 9001,
      controllers: [new TestController()],
      globalGuards: [complianceGuard],
    });
    expect(fastifyApp).toBeDefined();

    const expressApp = new FerroxApp({
      engine: 'express',
      port: 9002,
      controllers: [new TestController()],
      globalGuards: [complianceGuard],
    });
    expect(expressApp).toBeDefined();
  });

  it('should generate and verify PASETO v4.local tokens', () => {
    const payload = { sub: 'usr_123', roles: ['admin', 'founder'] };
    const token = pasetoService.generateV4LocalToken(payload, 3600);
    expect(token).toMatch(/^v4\.local\./);

    const verified = pasetoService.verifyV4LocalToken(token);
    expect(verified.sub).toBe('usr_123');
    expect(verified.roles).toContain('admin');
  });

  it('should generate TOTP secret and format otpauth URI', () => {
    const secret = totpService.generateSecret();
    expect(secret.length).toBeGreaterThanOrEqual(16);

    const uri = totpService.generateOtpAuthUri('user@ferrox.dev', secret, 'FerroxSaaS');
    expect(uri).toContain('otpauth://totp/FerroxSaaS:user%40ferrox.dev');
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
    expect(resHeaders['X-Ferrox-Kernel-Compliance']).toBe('ENFORCED');
  });

  it('should generate Kernel Seccomp BPF policy & Landlock LSM policy & Sysctl configs', () => {
    const engine = new KernelSandboxEngine();
    const seccomp = engine.generateSeccompBpfPolicy();
    expect(seccomp).toContain('execve');
    expect(seccomp).toContain('SCMP_ACT_KILL');

    const landlock = engine.generateLandlockPolicy();
    expect(landlock).toContain('/proc');

    const sysctl = engine.generateSysctlHardeningConfig();
    expect(sysctl).toContain('net.ipv4.tcp_syncookies = 1');
  });

  it('should execute FerroxSelfTest diagnostic audit & Kali Red-Team audit runner', () => {
    const selfTest = new FerroxSelfTestEngine();
    const audit = selfTest.runDiagnosticAudit();
    expect(audit.overallScore).toBe(100);

    const kaliReport = selfTest.runKaliRedTeamAudit('http://localhost:8080');
    expect(kaliReport.overallVerdict).toBe('SECURE_PASS');
  });

  it('should execute CircuitBreaker, RateLimiter, and Singleflight deduplication', async () => {
    const breaker = new CircuitBreaker(2, 5000);
    const ok = await breaker.execute(async () => 'success');
    expect(ok).toBe('success');

    const limiter = new RateLimiter(10, 5);
    expect(limiter.allowRequest(1)).toBe(true);

    const singleflight = new Singleflight();
    let callCount = 0;
    const p1 = singleflight.do('key1', async () => {
      callCount++;
      return 'data';
    });
    const p2 = singleflight.do('key1', async () => {
      callCount++;
      return 'data';
    });
    const [r1, r2] = await Promise.all([p1, p2]);
    expect(r1).toBe('data');
    expect(r2).toBe('data');
    expect(callCount).toBe(1);
  });

  it('should execute CQRS Engine & Saga Orchestrator', async () => {
    const cqrs = new CqrsEngine();
    cqrs.registerCommandHandler('CREATE_USER', async (cmd) => ({ id: 'usr_1', email: cmd.payload.email }));
    const user = await cqrs.executeCommand({ type: 'CREATE_USER', payload: { email: 'test@ferrox.dev' } });
    expect(user.id).toBe('usr_1');

    let compensated = false;
    const saga = new SagaOrchestrator();
    saga.addStep({
      name: 'Step 1',
      action: async () => 'done',
      compensation: async () => {
        compensated = true;
      },
    });
    const sagaRes = await saga.execute();
    expect(sagaRes.success).toBe(true);
    expect(compensated).toBe(false);
  });

  it('should execute DataGrid pagination and CrudGenerator', () => {
    const items = [
      { id: 1, name: 'Alpha' },
      { id: 2, name: 'Beta' },
      { id: 3, name: 'Gamma' },
    ];
    const pageRes = FerroxDataGridEngine.paginate(items, { page: 1, pageSize: 2 });
    expect(pageRes.data.length).toBe(2);

    const crudRoutes = FerroxCrudGenerator.createCrudRoutes('User', {
      find: () => [],
      findById: () => null,
      create: (item) => ({ id: 1, ...item } as any),
      delete: () => true,
    });
    expect(crudRoutes.length).toBe(4);
  });

  it('should upload/download files via StorageEngine, perform I18n translation, W3C Tracing, Config & Transports', async () => {
    const storage = new StorageEngine();
    const uri = await storage.upload('test.txt', 'hello ferrox');
    expect(uri).toContain('memory://test.txt');

    const downloaded = await storage.download('test.txt');
    expect(downloaded.toString('utf-8')).toBe('hello ferrox');

    const i18n = new I18nEngine('it');
    i18n.registerTranslations('it', { welcome: 'Benvenuto {{ name }}!' });
    expect(i18n.translate('welcome', { name: 'Ferrox' })).toBe('Benvenuto Ferrox!');

    const traceCtx = TracingEngine.createTraceContext();
    const header = TracingEngine.formatTraceparent(traceCtx);
    const parsed = TracingEngine.parseTraceparent(header);
    expect(parsed.traceId).toBe(traceCtx.traceId);

    const logger = new FerroxLogger('test');
    expect(logger).toBeDefined();

    const config = new ConfigEngine({ PORT: 8080 });
    expect(config.get('PORT')).toBe(8080);

    const ws = new WebSocketTransportAdapter();
    let received = false;
    ws.on('TEST_EVENT', () => {
      received = true;
    });
    ws.handleIncomingMessage(JSON.stringify({ event: 'TEST_EVENT', payload: {} }), {});
    expect(received).toBe(true);

    const kafka = new KafkaEventBusAdapter();
    let kafkaEvent = null;
    kafka.subscribe('user-events', async (evt) => {
      kafkaEvent = evt;
    });
    await kafka.publish('user-events', { type: 'CREATED' });
    expect(kafkaEvent).toEqual({ type: 'CREATED' });
  });

  it('should enqueue background jobs', (done) => {
    const queue = new FerroxJobQueue();
    queue.registerWorker('SEND_EMAIL', async (payload) => {
      expect(payload.to).toBe('user@ferrox.dev');
      done();
    });
    queue.enqueue('SEND_EMAIL', { to: 'user@ferrox.dev' });
  });
});
