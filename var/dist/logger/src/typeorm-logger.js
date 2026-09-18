"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeORMLogger = void 0;
const utils_1 = require("@nest-yalc-2/utils");
const logger_event_1 = require("@node-yalc/logger/logger.event");
class TypeORMLogger {
    constructor(event) {
        this.event = event;
        this.isLoggerEnabled = false;
        this.isLoggerEnabled = (0, utils_1.envIsTrue)(process.env.TYPEORM_LOGGING || 'false');
    }
    logQuery(query, parameters) {
        if (!this.isLoggerEnabled)
            return;
        this.event.debug?.(logger_event_1.LoggerEvent.QUERY_LOG, {
            data: {
                query,
                parameters,
            },
        });
    }
    logQueryError(error, query, parameters) {
        if (!this.isLoggerEnabled)
            return;
        this.event.error?.(logger_event_1.LoggerEvent.QUERY_ERROR, {
            data: {
                error,
                query,
                parameters,
            },
        });
    }
    logQuerySlow(time, query, parameters) {
        if (!this.isLoggerEnabled)
            return;
        this.event.warn?.(logger_event_1.LoggerEvent.QUERY_SLOW, {
            message: `SLOW QUERY!!!!`,
            data: {
                time,
                query,
                parameters,
            },
        });
    }
    logSchemaBuild(message) {
        if (!this.isLoggerEnabled)
            return;
        this.event.debug?.(logger_event_1.LoggerEvent.SCHEMA_BUILD, {
            message,
        });
    }
    logMigration(message) {
        if (!this.isLoggerEnabled)
            return;
        this.event.debug?.(logger_event_1.LoggerEvent.DEBUG, {
            message,
        });
    }
    log(level, message) {
        if (!this.isLoggerEnabled)
            return;
        switch (level) {
            case 'log':
                this.event.log?.(logger_event_1.LoggerEvent.LOG, {
                    message,
                });
                break;
            case 'info':
                this.event.verbose?.(logger_event_1.LoggerEvent.INFO, {
                    message,
                });
                break;
            case 'warn':
                this.event.warn?.(logger_event_1.LoggerEvent.WARN, {
                    message,
                });
                break;
        }
    }
}
exports.TypeORMLogger = TypeORMLogger;
//# sourceMappingURL=typeorm-logger.js.map