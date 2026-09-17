/**
 * # NestJS Ferrox-Node Sentinel Guard (`sentinel.guard.ts`)
 * CanActivate Guard evaluating entropy, prompt injection, and velocity anomalies
 */
import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class FerroxSentinelGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
