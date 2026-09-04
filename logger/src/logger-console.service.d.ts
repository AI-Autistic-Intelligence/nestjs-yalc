import { LogLevel } from '@nestjs/common';
import { IImprovedLoggerOptions, LoggerAbstractService } from './logger-abstract.service.js';
export declare class ConsoleLogger extends LoggerAbstractService {
    constructor(context: string, logLevels: LogLevel[] | undefined, options?: IImprovedLoggerOptions);
}
