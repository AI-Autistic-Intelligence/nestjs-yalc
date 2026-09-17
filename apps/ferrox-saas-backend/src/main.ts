import { FerroxApp, MandatoryComplianceGuard } from '../../../ferrox-node/dist/index';
import { HealthController } from './modules/health.controller';
import { AuthController } from './modules/auth.controller';
import { UsersController } from './modules/users.controller';
import { AdminController } from './modules/admin.controller';
import { FounderController } from './modules/founder.controller';

export async function bootstrap(engine: 'fastify' | 'express' = 'fastify', port: number = 8080) {
  const app = new FerroxApp({
    engine,
    port,
    globalGuards: [new MandatoryComplianceGuard()],
    controllers: [
      new HealthController(),
      new AuthController(),
      new UsersController(),
      new AdminController(),
      new FounderController(),
    ],
  });

  return await app.start();
}

if (require.main === module) {
  bootstrap('fastify', 8080);
}
