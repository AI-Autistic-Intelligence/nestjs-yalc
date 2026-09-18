import { ConsoleLoggerOptions } from '@nestjs/common';
import { IImprovedLoggerOptions, ILoggerPluginMethods, ImprovedLoggerService, LogMethodOptions } from '@node-yalc/logger/logger-abstract.service';
declare const ImprovedNestLogger_base: {
    new (...args: any[]): {
        [x: string]: any;
        plugins: import("@node-yalc/utils/plugin.helper").Plugin<ILoggerPluginMethods<any>>[];
        registerPlugin(plugin: import("@node-yalc/utils/plugin.helper").Plugin<ILoggerPluginMethods<any>>): void;
        unregisterPlugin(plugin: import("@node-yalc/utils/plugin.helper").Plugin<ILoggerPluginMethods<any>>): void;
        invokePlugins(methodName: keyof ILoggerPluginMethods<any>, ...args: any[]): void;
    };
};
export declare class ImprovedNestLogger extends ImprovedNestLogger_base implements ImprovedLoggerService {
    protected _options: IImprovedLoggerOptions;
    readonly isImprovedLoggerService = true;
    constructor(context: string, options: ConsoleLoggerOptions, _options?: IImprovedLoggerOptions);
    private getOptions;
    private composeMessage;
    log(message: any): void;
    log(message: any, options: LogMethodOptions): void;
    log(message: any, ...optionalParams: any[]): void;
    error(message: any, stack?: string | undefined): void;
    error(message: any, stack: string | undefined, options: LogMethodOptions): void;
    error(message: any, ...optionalParams: any[]): void;
    debug(message: any): void;
    debug(message: any, options: LogMethodOptions): void;
    debug(message: any, ...optionalParams: any[]): void;
    verbose(message: any): void;
    verbose(message: any, options: LogMethodOptions): void;
    verbose(message: any, ...optionalParams: any[]): void;
    warn(message: any): void;
    warn(message: any, options: LogMethodOptions): void;
    warn(message: any, ...optionalParams: any[]): void;
    beforeLogging(message: any, options: LogMethodOptions): void;
}
export {};
