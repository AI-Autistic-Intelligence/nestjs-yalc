import { ClassType } from '@nestjs-yalc/types/globals.d.js';
import { IApiCallStrategy } from './context-call.interface.js';
export interface IApiCallService<Strategy extends IApiCallStrategy> {
    setStrategy(strategy: Strategy): void;
    getStrategy(): Strategy;
}
export declare function ContextCallServiceFactory<Strategy extends IApiCallStrategy>(defaultStrategy: Strategy): ClassType<IApiCallService<Strategy>>;
