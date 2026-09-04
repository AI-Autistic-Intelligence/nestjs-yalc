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
            log: (message, options, ...rest) => {
                var _a;
                return console.log(...logOnlyDefined(`[${(_a = options === null || options === void 0 ? void 0 : options.context) !== null && _a !== void 0 ? _a : context}]`, message, (0, logger_helper_js_1.maskDataInObject)(options === null || options === void 0 ? void 0 : options.data, options === null || options === void 0 ? void 0 : options.masks, options === null || options === void 0 ? void 0 : options.stack), options === null || options === void 0 ? void 0 : options.config, ...rest));
            },
            error: (message, trace, options, ...rest) => {
                var _a;
                return console.error(...logOnlyDefined(`[${(_a = options === null || options === void 0 ? void 0 : options.context) !== null && _a !== void 0 ? _a : context}]`, message, trace, (0, logger_helper_js_1.maskDataInObject)(options === null || options === void 0 ? void 0 : options.data, options === null || options === void 0 ? void 0 : options.masks), options === null || options === void 0 ? void 0 : options.config, ...rest));
            },
            debug: (message, options, ...rest) => {
                var _a;
                return console.debug(...logOnlyDefined(`[${(_a = options === null || options === void 0 ? void 0 : options.context) !== null && _a !== void 0 ? _a : context}]`, message, (0, logger_helper_js_1.maskDataInObject)(options === null || options === void 0 ? void 0 : options.data, options === null || options === void 0 ? void 0 : options.masks, options === null || options === void 0 ? void 0 : options.stack), options === null || options === void 0 ? void 0 : options.config, ...rest));
            },
            warn: (message, options, ...rest) => {
                var _a;
                return console.warn(...logOnlyDefined(`[${(_a = options === null || options === void 0 ? void 0 : options.context) !== null && _a !== void 0 ? _a : context}]`, message, (0, logger_helper_js_1.maskDataInObject)(options === null || options === void 0 ? void 0 : options.data, options === null || options === void 0 ? void 0 : options.masks, options === null || options === void 0 ? void 0 : options.stack), options === null || options === void 0 ? void 0 : options.config, ...rest));
            },
            verbose: (message, options, ...rest) => {
                var _a;
                return console.info(...logOnlyDefined(`[${(_a = options === null || options === void 0 ? void 0 : options.context) !== null && _a !== void 0 ? _a : context}]`, message, (0, logger_helper_js_1.maskDataInObject)(options === null || options === void 0 ? void 0 : options.data, options === null || options === void 0 ? void 0 : options.masks, options === null || options === void 0 ? void 0 : options.stack), options === null || options === void 0 ? void 0 : options.config, ...rest));
            },
        }, options);
    }
}
exports.ConsoleLogger = ConsoleLogger;
//# sourceMappingURL=logger-console.service.js.map