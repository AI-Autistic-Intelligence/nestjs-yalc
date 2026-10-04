import { FerroxSentinelModule } from '../sentinel.module.js';
import { FerroxSentinelGuard } from '../sentinel.guard.js';
import { RagGroundednessInterceptor } from '../sentinel.interceptor.js';

describe('FerroxSentinelModule', () => {
  it('should register module with default options', () => {
    const module = FerroxSentinelModule.register();
    expect(module.module).toBe(FerroxSentinelModule);
    expect(module.providers).toHaveLength(2);
    expect(module.exports).toEqual([FerroxSentinelGuard, RagGroundednessInterceptor]);
  });

  it('should register module with custom options', () => {
    const module = FerroxSentinelModule.register({ minGroundednessScore: 0.9 });
    expect(module.module).toBe(FerroxSentinelModule);
    const interceptorProvider = module.providers?.find(
      (p: any) => p.provide === RagGroundednessInterceptor
    ) as any;
    expect(interceptorProvider.useValue['minGroundednessScore']).toBe(0.9);
  });
});
