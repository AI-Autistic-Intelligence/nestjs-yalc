import { LoggerService, LogLevel } from '@nestjs/common';
export type LogMethod = (message: unknown, context?: string) => void;
export type LogMethodError = (message: unknown, trace?: string, context?: string) => void;
export declare abstract class LoggerAbstractService implements LoggerService {
    protected context: string;
    protected logLevels: LogLevel[] | undefined;
    protected methods: LoggerService;
    constructor(context: string, logLevels: LogLevel[] | undefined, methods: LoggerService);
    log: LogMethod;
    error: LogMethodError;
    warn: LogMethod;
    debug?: LogMethod | undefined;
    verbose?: LogMethod;
}
