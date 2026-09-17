/**
 * # NestJS Ferrox-Node Sentinel Module (`sentinel.module.ts`)
 */

import { Module, DynamicModule } from '@nestjs/common';
import { FerroxSentinelGuard } from './sentinel.guard.js';
import { RagGroundednessInterceptor } from './sentinel.interceptor.js';

export interface SentinelModuleOptions {
  enablePromptSanitizer?: boolean;
  enableEntropyCheck?: boolean;
  minGroundednessScore?: number;
}

@Module({})
export class FerroxSentinelModule {
  static register(options: SentinelModuleOptions = {}): DynamicModule {
    return {
      module: FerroxSentinelModule,
      providers: [
        FerroxSentinelGuard,
        {
          provide: RagGroundednessInterceptor,
          useValue: new RagGroundednessInterceptor(options.minGroundednessScore ?? 0.70),
        },
      ],
      exports: [FerroxSentinelGuard, RagGroundednessInterceptor],
    };
  }
}
