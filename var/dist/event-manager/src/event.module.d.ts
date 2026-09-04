import { DynamicModule, LogLevel, Provider } from '@nestjs/common';
import { YalcEventService, IEventServiceOptions } from './event.service.js';
import { ImprovedLoggerService } from '@nestjs-yalc/logger/logger-abstract.service.js';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AppLoggerFactory } from '@nestjs-yalc/logger/logger.factory.js';
import { EventNameFormatter } from './emitter.js';
export declare const EVENT_LOGGER = "EVENT_LOGGER";
export declare const EVENT_EMITTER = "EVENT_EMITTER";
export type ILoggerProviderOptions = Parameters<typeof AppLoggerFactory>;
export type ILoggerProviderOptionsObject = {
    context: ILoggerProviderOptions[0];
    loggerLevels?: ILoggerProviderOptions[1];
    loggerType?: ILoggerProviderOptions[2];
    options?: ILoggerProviderOptions[3];
};
export interface IEventModuleOptions<TFormatter extends EventNameFormatter = EventNameFormatter> extends IEventServiceOptions<TFormatter> {
    loggerProvider?: ImprovedLoggerService | ILoggerProviderOptionsObject | Provider<ImprovedLoggerService> | string;
    eventEmitter?: Provider<EventEmitter2>;
    eventService?: (logger: ImprovedLoggerService, emitter: EventEmitter2, options?: IEventModuleOptions<TFormatter>) => YalcEventService;
    eventServiceToken?: string;
    imports?: any[];
    overrideLoggerLevels?: LogLevel[];
}
export declare const OPTION_PROVIDER = "OPTION_PROVIDER";
export interface IProviderOptions {
    logger: ImprovedLoggerService | ILoggerProviderOptionsObject;
    emitter: EventEmitter2;
}
export declare class EventModule {
    static forRootAsync<TFormatter extends EventNameFormatter = EventNameFormatter>(options?: IEventModuleOptions<TFormatter>, optionProvider?: Provider<IProviderOptions>): DynamicModule;
}
