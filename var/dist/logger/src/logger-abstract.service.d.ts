import { LoggerService, LogLevel } from '@nestjs/common';
import { type EventEmitter2 } from '@nestjs/event-emitter';
import { PluginSystem } from '@nest-yalc-2/utils/plugin.helper.js';
import { YalcGlobalClsService } from '../../app/src/cls.module.js';
export interface LogMethodOptions {
    message?: any;
    data?: any;
    config?: any;
    masks?: string[];
    context?: string;
    stack?: string;
    event?: string | false;
}
export type LogMethod = (message: any, options?: LogMethodOptions) => void;
export type LogMethodError = (message: any, stack?: string, options?: LogMethodOptions) => void;
export interface ILoggerPluginMethods<TClsService = any> extends Record<string, {
    (...args: any[]): void;
} | undefined> {
    onBeforeLogging?: (message: any, options: LogMethodOptions, clsService: TClsService) => void;
}
export interface ImprovedLoggerService extends ImprovedLoggerServiceMethods, PluginSystem<ILoggerPluginMethods> {
}
export interface ImprovedLoggerServiceMethods extends LoggerService {
    log: LogMethod;
    error: LogMethodError;
    warn: LogMethod;
    debug?: LogMethod | undefined;
    verbose?: LogMethod;
}
export declare const EVENT_LOG_DEFAULT = "EVENT_LOG_DEFAULT";
export interface IImprovedLoggerOptions {
    event?: {
        eventEmitter?: EventEmitter2 | false;
        useFallbackEvent?: boolean;
    } | false;
    clsService?: YalcGlobalClsService;
    overrideLoggerLevels?: LogLevel[];
}
declare const LoggerAbstractService_base: {
    new (): {
        plugins: import("@nest-yalc-2/utils/plugin.helper.js").Plugin<ILoggerPluginMethods<any>>[];
        registerPlugin(plugin: import("@nest-yalc-2/utils/plugin.helper.js").Plugin<ILoggerPluginMethods<any>>): void;
        unregisterPlugin(plugin: import("@nest-yalc-2/utils/plugin.helper.js").Plugin<ILoggerPluginMethods<any>>): void;
        invokePlugins(methodName: keyof ILoggerPluginMethods<any>, ...args: any[]): void;
    };
};
export declare abstract class LoggerAbstractService extends LoggerAbstractService_base implements ImprovedLoggerService {
    protected context: string;
    protected logLevels: LogLevel[] | undefined;
    protected methods: ImprovedLoggerServiceMethods;
    protected options: IImprovedLoggerOptions;
    readonly isImprovedLoggerService = true;
    constructor(context: string, logLevels: LogLevel[] | undefined, methods: ImprovedLoggerServiceMethods, options?: IImprovedLoggerOptions);
    setLogLevels(levels: LogLevel[]): void;
    initializeLogger(): void;
    log: LogMethod;
    error: LogMethodError;
    warn: LogMethod;
    debug?: LogMethod | undefined;
    verbose?: LogMethod;
    beforeLogging(message: any, options: LogMethodOptions): void;
}
export declare function beforeLogging(message: any, options?: LogMethodOptions & IImprovedLoggerOptions['event']): void;
export {};
