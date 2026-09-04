import { LogLevel } from '@nestjs/common';
import { LoggerAbstractService } from './logger-abstract.service';
export declare class ConsoleLogger extends LoggerAbstractService {
    constructor(context: string, logLevels: LogLevel[] | undefined);
}
