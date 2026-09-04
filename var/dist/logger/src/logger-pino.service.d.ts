import { LogLevel } from '@nestjs/common';
import { default as pino } from 'pino';
import { LoggerAbstractService } from './logger-abstract.service';
export declare const logger: pino.Logger<never, boolean>;
export declare const FLUSH_INTERVAL = 10000;
export declare class PinoLogger extends LoggerAbstractService {
    constructor(context: string, logLevels: LogLevel[]);
}
