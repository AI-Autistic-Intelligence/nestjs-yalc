import { LoggerService } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Logger } from 'typeorm';
export declare class TypeORMLogger implements Logger {
    private logger;
    private eventEmitter;
    constructor(logger: LoggerService, eventEmitter: EventEmitter2);
    logQuery(query: string, parameters?: any[]): any;
    logQueryError(error: string | Error, query: string, parameters?: any[]): any;
    logQuerySlow(time: number, query: string, parameters?: any[]): any;
    logSchemaBuild(message: string): any;
    logMigration(message: string): any;
    log(level: 'log' | 'info' | 'warn', message: any): any;
}
