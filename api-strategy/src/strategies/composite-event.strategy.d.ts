import { OnModuleDestroy } from '@nestjs/common';
import type { IEventStrategy } from '../context-event.interface.js';
export type CompositeEventStrategyErrorMode = 'throw' | 'ignore';
export interface CompositeEventStrategyOptions {
    errorMode?: CompositeEventStrategyErrorMode;
}
export declare class CompositeEventStrategy<P = any, R = any, O = any> implements IEventStrategy<P, R[], O>, OnModuleDestroy {
    private readonly strategies;
    private readonly errorMode;
    constructor(strategies: IEventStrategy<P, R, O>[], options?: CompositeEventStrategyOptions);
    emit(path: string, payload: P, options?: O): R[];
    emitAsync(path: string, payload: P, options?: O): Promise<R[]>;
    onModuleDestroy(): Promise<void>;
}
