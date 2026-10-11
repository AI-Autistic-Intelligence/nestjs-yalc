/**
 * # NestJS Ferrox-Node Sentinel Module (`sentinel.module.ts`)
 */
import { DynamicModule } from '@nestjs/common';
export interface SentinelModuleOptions {
    enablePromptSanitizer?: boolean;
    enableEntropyCheck?: boolean;
    minGroundednessScore?: number;
}
export declare class FerroxSentinelModule {
    static register(options?: SentinelModuleOptions): DynamicModule;
}
