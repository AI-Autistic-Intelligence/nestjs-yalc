import { ConsoleLoggerOptions } from '@nestjs/common';
import { IImprovedLoggerOptions, ImprovedLoggerService, LogMethodOptions } from './logger-abstract.service.js';
declare const ImprovedNestLogger_base: any;
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
