import type { Provider } from '@nestjs/common';
import type { IApiCallStrategy } from './context-call.interface.js';
import type { IEventStrategy } from './context-event.interface.js';
export type StrategySelectorToken<TStrategy = unknown> = string | symbol | (abstract new (...args: any[]) => TStrategy) | (new (...args: any[]) => TStrategy);
export type StrategySelectorBehavior = 'throw' | 'fallback';
export interface StrategySelectorFactoryOptions {
    inject?: any[];
    useFactory?: (...args: any[]) => string | null | undefined | Promise<string | null | undefined>;
}
export interface StrategySelectorProviderOptions<TStrategy> {
    provide: StrategySelectorToken<TStrategy>;
    defaultStrategy: string;
    strategies: Record<string, StrategySelectorToken<TStrategy>>;
    selector?: StrategySelectorFactoryOptions;
    unknownStrategyBehavior?: StrategySelectorBehavior;
}
export declare function StrategySelectorProvider<TStrategy>(options: StrategySelectorProviderOptions<TStrategy>): Provider<TStrategy>;
export declare function ApiCallStrategySelectorProvider(options: StrategySelectorProviderOptions<IApiCallStrategy>): Provider<IApiCallStrategy>;
export declare function EventStrategySelectorProvider(options: StrategySelectorProviderOptions<IEventStrategy>): Provider<IEventStrategy>;
