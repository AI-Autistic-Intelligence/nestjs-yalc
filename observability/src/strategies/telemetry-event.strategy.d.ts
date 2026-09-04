import { OnModuleDestroy } from '@nestjs/common';
import type { IEventStrategy } from '@nestjs-yalc/api-strategy/context-event.interface.js';
import { TelemetryService } from '../telemetry.service.js';
export interface TelemetryEventStrategyOptions {
    name: string;
    transport?: string;
}
export declare class TelemetryEventStrategy<P = any, R = any, O = any> implements IEventStrategy<P, R, O>, OnModuleDestroy {
    private readonly strategy;
    private readonly telemetry;
    private readonly options;
    constructor(strategy: IEventStrategy<P, R, O>, telemetry: TelemetryService, options: TelemetryEventStrategyOptions);
    emit(path: string, payload: P, options?: O): R;
    emitAsync(path: string, payload: P, options?: O): Promise<R>;
    onModuleDestroy(): Promise<void>;
    private attributes;
}
