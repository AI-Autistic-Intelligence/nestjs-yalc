"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleLogger = void 0;
const logger_abstract_service_js_1 = require("./logger-abstract.service.js");
const logger_helper_js_1 = require("./logger.helper.js");
const logOnlyDefined = (...args) => {
    return args.filter(function (element) {
        return element !== undefined;
    });
};
class ConsoleLogger extends logger_abstract_service_js_1.LoggerAbstractService {
    constructor(context, logLevels, options = {}) {
        super(context, logLevels, {
            log: (message, options, ...rest) => console.log(...logOnlyDefined(`[${options?.context ?? context}]`, message, (0, logger_helper_js_1.maskDataInObject)(options?.data, options?.masks, options?.stack), options?.config, ...rest)),
            error: (message, trace, options, ...rest) => console.error(...logOnlyDefined(`[${options?.context ?? context}]`, message, trace, (0, logger_helper_js_1.maskDataInObject)(options?.data, options?.masks), options?.config, ...rest)),
            debug: (message, options, ...rest) => console.debug(...logOnlyDefined(`[${options?.context ?? context}]`, message, (0, logger_helper_js_1.maskDataInObject)(options?.data, options?.masks, options?.stack), options?.config, ...rest)),
            warn: (message, options, ...rest) => console.warn(...logOnlyDefined(`[${options?.context ?? context}]`, message, (0, logger_helper_js_1.maskDataInObject)(options?.data, options?.masks, options?.stack), options?.config, ...rest)),
            verbose: (message, options, ...rest) => console.info(...logOnlyDefined(`[${options?.context ?? context}]`, message, (0, logger_helper_js_1.maskDataInObject)(options?.data, options?.masks, options?.stack), options?.config, ...rest)),
        }, options);
    }
}
exports.ConsoleLogger = ConsoleLogger;
//# sourceMappingURL=logger-console.service.js.map