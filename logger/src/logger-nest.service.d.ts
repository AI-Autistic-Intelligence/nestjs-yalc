import { ConsoleLoggerOptions } from '@nestjs/common';
import { IImprovedLoggerOptions, ILoggerPluginMethods, ImprovedLoggerService, LogMethodOptions } from '@node-yalc/logger/logger-abstract.service.js';
declare const ImprovedNestLogger_base: new (...args: any[]) => {
    [x: string]: any;
    plugins: import("@node-yalc/utils/plugin.helper", { with: { "resolution-mode": "import" } }).Plugin<ILoggerPluginMethods<any>>[];
    registerPlugin(plugin: import("@node-yalc/utils/plugin.helper", { with: { "resolution-mode": "import" } }).Plugin<ILoggerPluginMethods<any>>): void;
    unregisterPlugin(plugin: import("@node-yalc/utils/plugin.helper", { with: { "resolution-mode": "import" } }).Plugin<ILoggerPluginMethods<any>>): void;
    invokePlugins(methodName: keyof ILoggerPluginMethods<any>, ...args: any[]): void;
};
export declare class ImprovedNestLogger extends ImprovedNestLogger_base implements ImprovedLoggerService {
    protected _options: IImprovedLoggerOptions;
    readonly isImprovedLoggerService = true;
    constructor(context: string, options: ConsoleLoggerOptions, _options?: IImprovedLoggerOptions);
    private getOptions;
    private composeMessage;
    log(message: unknown): void;
    log(message: unknown, options: LogMethodOptions): void;
    log(message: unknown, ...optionalParams: unknown[]): void;
    error(message: unknown, stack?: string | undefined): void;
    error(message: unknown, stack: string | undefined, options: LogMethodOptions): void;
    error(message: unknown, ...optionalParams: unknown[]): void;
    debug(message: unknown): void;
    debug(message: unknown, options: LogMethodOptions): void;
    debug(message: unknown, ...optionalParams: unknown[]): void;
    verbose(message: unknown): void;
    verbose(message: unknown, options: LogMethodOptions): void;
    verbose(message: unknown, ...optionalParams: unknown[]): void;
    warn(message: unknown): void;
    warn(message: unknown, options: LogMethodOptions): void;
    warn(message: unknown, ...optionalParams: unknown[]): void;
    beforeLogging(message: unknown, options: LogMethodOptions): void;
}
export {};
