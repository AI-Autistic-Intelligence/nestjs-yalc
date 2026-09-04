import { OnModuleDestroy } from '@nestjs/common';
import type { IEventStrategy } from '../context-event.interface.js';
export interface ConditionalEventStrategyOptions<P = any, R = any, O = any> {
    enabled?: boolean | (() => boolean);
    shouldEmit?: (path: string, payload: P, options?: O) => boolean;
    disabledResult?: R;
}
export declare class ConditionalEventStrategy<P = any, R = any, O = any> implements IEventStrategy<P, R, O>, OnModuleDestroy {
    private readonly strategy;
    private readonly options;
    constructor(strategy: IEventStrategy<P, R, O>, options?: ConditionalEventStrategyOptions<P, R, O>);
    emit(path: string, payload: P, options?: O): R;
    emitAsync(path: string, payload: P, options?: O): Promise<R>;
    onModuleDestroy(): Promise<void>;
    private shouldRun;
}
