import { Controller, Get, Post, Roles } from '@ferrox-node/core';

export interface Subscription {
  id: string;
  tenantId: string;
  planId: string;
  status: 'ACTIVE' | 'TRIALING' | 'CANCELLED';
  currentPeriodEnd: string;
  monthlyAmountCents: number;
}

@Controller('/api/v1/billing')
export class BillingController {
  private subscriptions: Map<string, Subscription> = new Map([
    [
      'sub_001',
      {
        id: 'sub_001',
        tenantId: 'ten_alpha',
        planId: 'plan_enterprise_tier',
        status: 'ACTIVE',
        currentPeriodEnd: new Date(Date.now() + 30 * 86400000).toISOString(),
        monthlyAmountCents: 49900,
      },
    ],
  ]);

  @Get('/plans')
  getAvailablePlans() {
    return {
      success: true,
      plans: [
        { id: 'plan_free', name: 'Developer Community', priceCents: 0, features: ['10k requests/mo', '1 Project'] },
        { id: 'plan_starter', name: 'Startup Pro', priceCents: 9900, features: ['1M requests/mo', '5 Projects', 'Email Support'] },
        { id: 'plan_enterprise', name: 'Enterprise Sovereign', priceCents: 49900, features: ['Unlimited requests', 'SLA 99.99%', 'Dedicated VPC'] },
      ],
    };
  }

  @Get('/subscription')
  getSubscription(req: any) {
    const tenantId = req.headers?.['x-tenant-id'] || 'ten_alpha';
    const sub = Array.from(this.subscriptions.values()).find((s) => s.tenantId === tenantId);
    return {
      success: true,
      data: sub || null,
    };
  }

  @Post('/checkout')
  @Roles('admin', 'founder')
  checkout(req: any) {
    const { tenantId, planId } = req.body || {};
    const subId = `sub_${Math.random().toString(36).substring(2, 9)}`;
    const newSub: Subscription = {
      id: subId,
      tenantId: tenantId || 'ten_alpha',
      planId: planId || 'plan_starter',
      status: 'ACTIVE',
      currentPeriodEnd: new Date(Date.now() + 30 * 86400000).toISOString(),
      monthlyAmountCents: planId === 'plan_enterprise' ? 49900 : 9900,
    };
    this.subscriptions.set(subId, newSub);
    return {
      success: true,
      message: 'Subscription successfully created.',
      subscription: newSub,
    };
  }
}
