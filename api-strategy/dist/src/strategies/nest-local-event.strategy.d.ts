import { IEventStrategy } from '../context-event.interface.js';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClassType } from '@node-yalc/types/globals';
export declare class NestLocalEventStrategy<P = any, O = any> implements IEventStrategy {
    private eventEmitter;
    constructor(eventEmitter: EventEmitter2);
    emit(path: string, payload: P, options?: O): boolean;
    emitAsync(path: string, payload: P, options?: O): Promise<any>;
}
export interface NestLocalEventStrategyProviderOptions {
    NestLocalStrategy?: ClassType<NestLocalEventStrategy>;
}
export declare const NestLocalEventStrategyProvider: (provide: string, options?: NestLocalEventStrategyProviderOptions) => {
    provide: string;
    useFactory: (eventEmitter: EventEmitter2) => NestLocalEventStrategy<any, any>;
    inject: (typeof EventEmitter2)[];
};
