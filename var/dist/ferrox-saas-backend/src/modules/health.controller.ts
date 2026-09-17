import { Controller, Get } from '../../../../ferrox-node/dist/index';

@Controller('/health')
export class HealthController {
  @Get()
  getHealth() {
    return {
      status: 'UP',
      framework: 'Ferrox-Node Framework v0.6.0',
      timestamp: new Date().toISOString(),
      kernelCompliance: 'ENFORCED',
    };
  }
}
