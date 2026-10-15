import { Controller, Post, Get, Roles } from '@ferrox-node/core';
import * as crypto from 'crypto';

export interface WebhookEndpoint {
  id: string;
  url: string;
  secret: string;
  events: string[];
  status: 'ACTIVE' | 'DISABLED';
  createdAt: string;
}

@Controller('/api/v1/webhooks')
export class WebhooksController {
  private endpoints: Map<string, WebhookEndpoint> = new Map([
    [
      'wh_001',
      {
        id: 'wh_001',
        url: 'https://webhook.site/ferrox-test',
        secret: 'whsec_enterprise_secret_key_84729482',
        events: ['order.fulfilled', 'user.created', 'payment.captured'],
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      },
    ],
  ]);

  @Get('/')
  @Roles('admin', 'founder')
  listWebhooks() {
    return {
      success: true,
      data: Array.from(this.endpoints.values()),
    };
  }

  @Post('/subscribe')
  @Roles('admin', 'founder')
  registerWebhook(req: any) {
    const { url, events } = req.body || {};
    const id = `wh_${Math.random().toString(36).substring(2, 9)}`;
    const secret = `whsec_${crypto.randomBytes(16).toString('hex')}`;

    const endpoint: WebhookEndpoint = {
      id,
      url: url || 'https://api.partner.com/webhooks',
      secret,
      events: events || ['order.fulfilled'],
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };

    this.endpoints.set(id, endpoint);
    return {
      success: true,
      data: endpoint,
    };
  }

  @Post('/verify')
  verifyWebhookSignature(req: any) {
    const { payload, signature, secret } = req.body || {};
    const expected = crypto.createHmac('sha256', secret || '').update(payload || '').digest('hex');
    const isValid = crypto.timingSafeEqual(Buffer.from(signature || ''), Buffer.from(expected));

    return {
      verified: isValid,
      timestamp: new Date().toISOString(),
    };
  }
}
