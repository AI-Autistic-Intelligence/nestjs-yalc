import { YalcEventService } from '@nestjs-yalc/event-manager/event.service.js';
import { Logger } from 'typeorm';
export declare class TypeORMLogger implements Logger {
    private event;
    private isLoggerEnabled;
    constructor(event: YalcEventService);
    logQuery(query: string, parameters?: any[]): any;
    logQueryError(error: string | Error, query: string, parameters?: any[]): any;
    logQuerySlow(time: number, query: string, parameters?: any[]): any;
    logSchemaBuild(message: string): any;
    logMigration(message: string): any;
    log(level: 'log' | 'info' | 'warn', message: any): any;
}
