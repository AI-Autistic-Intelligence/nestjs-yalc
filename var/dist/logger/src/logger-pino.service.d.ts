import { LogLevel, OnApplicationShutdown } from '@nestjs/common';
import { type Logger } from 'pino';
import { type IImprovedLoggerOptions, LoggerAbstractService } from './logger-abstract.service.js';
export declare const FLUSH_INTERVAL = 10000;
export declare class PinoLogger extends LoggerAbstractService implements OnApplicationShutdown {
    getLogger(): Logger;
    constructor(context: string, logLevels: LogLevel[], options?: IImprovedLoggerOptions);
    onApplicationShutdown(): Promise<void>;
}
export declare function flush(): Promise<unknown>;
