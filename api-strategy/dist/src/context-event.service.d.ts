import { ClassType } from '@nest-yalc-2/types/globals.d.js';
import { IEventStrategy } from './context-event.interface.js';
export interface IApiMessageService<Strategy extends IEventStrategy> {
    setStrategy(strategy: Strategy): void;
    getStrategy(): Strategy;
}
export declare function ContextEventServiceFactory<Strategy extends IEventStrategy>(defaultStrategy: Strategy): ClassType<IApiMessageService<Strategy>>;
