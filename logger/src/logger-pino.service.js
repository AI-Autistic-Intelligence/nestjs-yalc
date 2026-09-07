"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinoLogger = exports.FLUSH_INTERVAL = void 0;
exports.flush = flush;
const pino_1 = __importDefault(require("pino"));
const logger_abstract_service_js_1 = require("./logger-abstract.service.js");
const logger_helper_js_1 = require("./logger.helper.js");
const promise_helper_js_1 = require("@nest-yalc-2/utils/promise.helper.js");
let logger;
let destination;
exports.FLUSH_INTERVAL = 10000;
class PinoLogger extends logger_abstract_service_js_1.LoggerAbstractService {
    getLogger() {
        return logger;
    }
    constructor(context, logLevels, options = {}) {
        super(context, logLevels, {
            log: (message, options) => logger.info({
                context: options?.context ?? context,
                ...(0, logger_helper_js_1.maskDataInObject)(options?.data, options?.masks),
                config: options?.config,
                trace: options?.stack,
            }, message),
            error: (message, trace, options) => {
                logger.error({
                    context: options?.context ?? context,
                    ...(0, logger_helper_js_1.maskDataInObject)(options?.data, options?.masks),
                    config: options?.config,
                    trace,
                }, message);
            },
            debug: (message, options) => logger.debug({
                context: options?.context ?? context,
                ...(0, logger_helper_js_1.maskDataInObject)(options?.data, options?.masks),
                config: options?.config,
                trace: options?.stack,
            }, message),
            warn: (message, options) => logger.warn({
                context: options?.context ?? context,
                ...(0, logger_helper_js_1.maskDataInObject)(options?.data, options?.masks),
                config: options?.config,
                trace: options?.stack,
            }, message),
            verbose: (message, options) => logger.trace({
                context: options?.context ?? context,
                ...(0, logger_helper_js_1.maskDataInObject)(options?.data, options?.masks),
                config: options?.config,
                trace: options?.stack,
            }, message),
        }, options);
        if (!logger) {
            destination = pino_1.default.destination({ sync: false });
            logger = (0, pino_1.default)({
                formatters: {
                    level: (label) => {
                        return { level: label };
                    },
                },
                timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
            }, destination);
        }
        logger.level = 'trace';
        setInterval(function () {
            logger.flush();
        }, exports.FLUSH_INTERVAL).unref();
        promise_helper_js_1.globalPromiseTracker.addDeferred(flush);
    }
    async onApplicationShutdown() {
        await flush();
    }
}
exports.PinoLogger = PinoLogger;
function flush() {
    destination?.flushSync();
    return new Promise((resolve, reject) => {
        logger.flush((err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve('Logger flushed successfully');
            }
        });
    });
}
//# sourceMappingURL=logger-pino.service.js.map