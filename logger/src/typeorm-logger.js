"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeORMLogger = void 0;
const utils_1 = require("@nestjs-yalc/utils");
const logger_event_js_1 = require("./logger.event.js");
class TypeORMLogger {
    constructor(event) {
        this.event = event;
        this.isLoggerEnabled = false;
        this.isLoggerEnabled = (0, utils_1.envIsTrue)(process.env.TYPEORM_LOGGING || 'false');
    }
    logQuery(query, parameters) {
        var _a, _b;
        if (!this.isLoggerEnabled)
            return;
        (_b = (_a = this.event).debug) === null || _b === void 0 ? void 0 : _b.call(_a, logger_event_js_1.LoggerEvent.QUERY_LOG, {
            data: {
                query,
                parameters,
            },
        });
    }
    logQueryError(error, query, parameters) {
        var _a, _b;
        if (!this.isLoggerEnabled)
            return;
        (_b = (_a = this.event).error) === null || _b === void 0 ? void 0 : _b.call(_a, logger_event_js_1.LoggerEvent.QUERY_ERROR, {
            data: {
                error,
                query,
                parameters,
            },
        });
    }
    logQuerySlow(time, query, parameters) {
        var _a, _b;
        if (!this.isLoggerEnabled)
            return;
        (_b = (_a = this.event).warn) === null || _b === void 0 ? void 0 : _b.call(_a, logger_event_js_1.LoggerEvent.QUERY_SLOW, {
            message: `SLOW QUERY!!!!`,
            data: {
                time,
                query,
                parameters,
            },
        });
    }
    logSchemaBuild(message) {
        var _a, _b;
        if (!this.isLoggerEnabled)
            return;
        (_b = (_a = this.event).debug) === null || _b === void 0 ? void 0 : _b.call(_a, logger_event_js_1.LoggerEvent.SCHEMA_BUILD, {
            message,
        });
    }
    logMigration(message) {
        var _a, _b;
        if (!this.isLoggerEnabled)
            return;
        (_b = (_a = this.event).debug) === null || _b === void 0 ? void 0 : _b.call(_a, logger_event_js_1.LoggerEvent.DEBUG, {
            message,
        });
    }
    log(level, message) {
        var _a, _b, _c, _d, _e, _f;
        if (!this.isLoggerEnabled)
            return;
        switch (level) {
            case 'log':
                (_b = (_a = this.event).log) === null || _b === void 0 ? void 0 : _b.call(_a, logger_event_js_1.LoggerEvent.LOG, {
                    message,
                });
                break;
            case 'info':
                (_d = (_c = this.event).verbose) === null || _d === void 0 ? void 0 : _d.call(_c, logger_event_js_1.LoggerEvent.INFO, {
                    message,
                });
                break;
            case 'warn':
                (_f = (_e = this.event).warn) === null || _f === void 0 ? void 0 : _f.call(_e, logger_event_js_1.LoggerEvent.WARN, {
                    message,
                });
                break;
        }
    }
}
exports.TypeORMLogger = TypeORMLogger;
//# sourceMappingURL=typeorm-logger.js.map