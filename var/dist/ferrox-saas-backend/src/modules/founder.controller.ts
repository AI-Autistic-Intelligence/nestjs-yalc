import { Controller, Get, Roles } from 'ferrox-node';

@Controller('/api/v1/founder')
@Roles('founder')
export class FounderController {
  @Get('/metrics')
  getSaaSMetrics() {
    return {
      mrr: 250000,
      arr: 3000000,
      activeTenants: 145,
      securityPosture: 'PASSING_100_PERCENT',
      sentinelThreatsBlocked: 42,
    };
  }
}
