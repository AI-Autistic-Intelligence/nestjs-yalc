import { LoggerEvent } from './logger.event';
export class TypeORMLogger {
    constructor(logger, eventEmitter) {
        this.logger = logger;
        this.eventEmitter = eventEmitter;
    }
    logQuery(query, parameters) {
        this.eventEmitter.emitAsync(LoggerEvent.QUERY_LOG, query);
        this.logger.debug?.(`query: ${query}, parameters: ${parameters}`);
    }
    logQueryError(error, query, parameters) {
        this.eventEmitter.emitAsync(LoggerEvent.QUERY_ERROR, query, error);
        this.logger.error?.(`error: ${error}, query: ${query}, parameters: ${parameters}`);
    }
    logQuerySlow(time, query, parameters) {
        this.eventEmitter.emitAsync(LoggerEvent.QUERY_SLOW, query, time);
        this.logger.warn?.(`SLOW QUERY!!!! time: ${time}, query: ${query}, parameters: ${parameters}`);
    }
    logSchemaBuild(message) {
        this.logger.debug?.(message);
    }
    logMigration(message) {
        this.logger.debug?.(message);
    }
    log(level, message) {
        switch (level) {
            case 'log':
                this.logger.log?.(message);
                break;
            case 'info':
                this.logger.verbose?.(message);
                break;
            case 'warn':
                this.logger.warn?.(message);
                break;
        }
    }
}
//# sourceMappingURL=typeorm-logger.js.map