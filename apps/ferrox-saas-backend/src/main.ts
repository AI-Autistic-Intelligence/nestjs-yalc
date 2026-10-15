import { FerroxApp, MandatoryComplianceGuard } from '@ferrox-node/core';
import { HealthController } from './modules/health.controller';
import { AuthController } from './modules/auth.controller';
import { UsersController } from './modules/users.controller';
import { AdminController } from './modules/admin.controller';
import { FounderController } from './modules/founder.controller';
import { AdminDashboardController } from './modules/admin-dashboard.controller';
import { FounderDashboardController } from './modules/founder-dashboard.controller';
import { TenantController } from './modules/tenant.controller';
import { BillingController } from './modules/billing.controller';
import { WebhooksController } from './modules/webhooks.controller';
import { MailerController } from './modules/mailer.controller';
import { NotificationsController } from './modules/notifications.controller';

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
      new AdminDashboardController(),
      new FounderDashboardController(),
      new TenantController(),
      new BillingController(),
      new WebhooksController(),
      new MailerController(),
      new NotificationsController(),
    ],
  });

  return await app.start();
}

if (require.main === module) {
  bootstrap('fastify', 8080);
}
