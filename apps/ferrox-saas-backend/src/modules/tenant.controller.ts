import { Controller, Get, Post, Roles } from '@ferrox-node/core';

export interface Tenant {
  id: string;
  name: string;
  plan: 'FREE' | 'STARTER' | 'ENTERPRISE';
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
  maxUsers: number;
}

@Controller('/api/v1/tenants')
export class TenantController {
  private tenants: Map<string, Tenant> = new Map([
    [
      'ten_alpha',
      {
        id: 'ten_alpha',
        name: 'Alpha Corp Global',
        plan: 'ENTERPRISE',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        maxUsers: 1000,
      },
    ],
    [
      'ten_beta',
      {
        id: 'ten_beta',
        name: 'Beta Labs Incubator',
        plan: 'STARTER',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        maxUsers: 25,
      },
    ],
  ]);

  @Get('/')
  @Roles('admin', 'founder')
  listTenants() {
    return {
      success: true,
      data: Array.from(this.tenants.values()),
    };
  }

  @Get('/:id')
  getTenant(req: any) {
    const id = req.params?.id || req.url?.split('/')?.pop();
    const tenant = this.tenants.get(id);
    if (!tenant) {
      return { success: false, error: `Tenant ${id} not found.` };
    }
    return { success: true, data: tenant };
  }

  @Post('/')
  @Roles('admin', 'founder')
  createTenant(req: any) {
    const { name, plan } = req.body || {};
    const id = `ten_${Math.random().toString(36).substring(2, 9)}`;
    const newTenant: Tenant = {
      id,
      name: name || 'New Organization',
      plan: plan || 'STARTER',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      maxUsers: plan === 'ENTERPRISE' ? 1000 : 50,
    };
    this.tenants.set(id, newTenant);
    return { success: true, data: newTenant };
  }
}
