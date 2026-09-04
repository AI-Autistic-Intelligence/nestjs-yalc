"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyAwaitOption = applyAwaitOption;
exports.isErrorOptions = isErrorOptions;
exports.event = event;
exports.getLoggerOption = getLoggerOption;
exports.resolveLoggerOption = resolveLoggerOption;
exports.eventLogAsync = eventLogAsync;
exports.eventLog = eventLog;
exports.eventErrorAsync = eventErrorAsync;
exports.eventError = eventError;
exports.eventWarnAsync = eventWarnAsync;
exports.eventWarn = eventWarn;
exports.eventDebugAsync = eventDebugAsync;
exports.eventDebug = eventDebug;
exports.eventVerboseAsync = eventVerboseAsync;
exports.eventVerbose = eventVerbose;
const logger_enum_js_1 = require("@nestjs-yalc/logger/logger.enum.js");
const logger_helper_js_1 = require("@nestjs-yalc/logger/logger.helper.js");
const default_error_js_1 = require("@nestjs-yalc/errors/default.error.js");
const emitter_js_1 = require("./emitter.js");
const global_emitter_js_1 = require("./global-emitter.js");
const logger_factory_js_1 = require("@nestjs-yalc/logger/logger.factory.js");
const class_helper_js_1 = require("@nestjs-yalc/utils/class.helper.js");
const object_helper_js_1 = require("@nestjs-yalc/utils/object.helper.js");
const _ = __importStar(require("lodash-es"));
const promise_helper_js_1 = require("@nestjs-yalc/utils/promise.helper.js");
function applyAwaitOption(options) {
    var _a;
    let event = options === null || options === void 0 ? void 0 : options.event;
    if (event !== false && event !== undefined) {
        event = Object.assign(Object.assign({}, event), { await: (_a = event.await) !== null && _a !== void 0 ? _a : true });
    }
    return Object.assign(Object.assign({}, options), { event });
}
function isErrorOptions(options) {
    return (options === null || options === void 0 ? void 0 : options.errorClass) !== undefined;
}
function event(eventName, options) {
    var _a, _b, _c, _d, _e, _f;
    const { data: _data, event, logger, mask, stack, config } = options !== null && options !== void 0 ? options : {};
    let receivedData = _data;
    const formattedEventName = (0, emitter_js_1.formatName)(eventName, (options === null || options === void 0 ? void 0 : options.event) ? (_a = options === null || options === void 0 ? void 0 : options.event) === null || _a === void 0 ? void 0 : _a.formatter : undefined);
    if (typeof receivedData === 'string') {
        receivedData = { message: receivedData };
    }
    if (mask)
        receivedData = (0, logger_helper_js_1.maskDataInObject)(receivedData, mask);
    const data = Object.assign(Object.assign({}, receivedData), { eventName: formattedEventName });
    const optionalMessage = (options === null || options === void 0 ? void 0 : options.logger) ? options.message : undefined;
    let errorInstance;
    let errorPayload = null;
    if (isErrorOptions(options)) {
        const { errorClass: _class, logger } = options, rest = __rest(options, ["errorClass", "logger"]);
        if (_class !== false && _class !== undefined) {
            if ((0, class_helper_js_1.isClass)(_class) || _class === true) {
                let _errorClass;
                const errorOptions = rest;
                if (_class === true) {
                    _errorClass = default_error_js_1.DefaultError;
                }
                else {
                    _errorClass = _class;
                }
                const message = optionalMessage !== null && optionalMessage !== void 0 ? optionalMessage : formattedEventName;
                errorInstance = new _errorClass(message, Object.assign(Object.assign({ eventName: formattedEventName }, errorOptions), { eventEmitter: false, logger: false }));
            }
            else {
                errorInstance = _class;
            }
            if ((0, default_error_js_1.isDefaultErrorMixin)(errorInstance)) {
                errorInstance.mergeErrorInfo(Object.assign(Object.assign({}, rest), { config, data: receivedData }));
                errorPayload = errorInstance.getEventPayload();
            }
            else {
                errorPayload = Object.assign(Object.assign(Object.assign({}, rest), errorInstance), { data: (0, object_helper_js_1.deepMergeWithoutArrayConcat)((_b = errorInstance.data) !== null && _b !== void 0 ? _b : {}, receivedData), response: (0, object_helper_js_1.deepMergeWithoutArrayConcat)((_c = errorInstance.response) !== null && _c !== void 0 ? _c : {}, (_d = options.response) !== null && _d !== void 0 ? _d : {}), config });
            }
        }
    }
    let logLevel = undefined;
    if (logger !== false) {
        const _g = logger && typeof logger !== 'string'
            ? logger
            : { level: logger, instance: undefined }, { instance: _instance, level: _level } = _g, rest = __rest(_g, ["instance", "level"]);
        const loggerConfig = Object.assign({ instance: (_instance !== null && _instance !== void 0 ? _instance : (0, logger_factory_js_1.AppLoggerFactory)('Event')), level: (_level !== null && _level !== void 0 ? _level : 'log') }, rest);
        const { level, instance } = loggerConfig;
        logLevel = level;
        const message = optionalMessage !== null && optionalMessage !== void 0 ? optionalMessage : formattedEventName;
        const logData = errorPayload ? errorPayload : { data };
        if (level === 'error') {
            instance.error(message, stack !== null && stack !== void 0 ? stack : errorPayload === null || errorPayload === void 0 ? void 0 : errorPayload.stack, {
                data: logData,
                event: false,
                config,
                stack: stack !== null && stack !== void 0 ? stack : errorPayload === null || errorPayload === void 0 ? void 0 : errorPayload.stack,
            });
        }
        else {
            (_e = instance[level]) === null || _e === void 0 ? void 0 : _e.call(instance, message, {
                data: logData,
                event: false,
                config,
                stack: stack !== null && stack !== void 0 ? stack : errorPayload === null || errorPayload === void 0 ? void 0 : errorPayload.stack,
            });
        }
    }
    let result;
    const toAwait = [];
    if (event !== false) {
        const eventEmitter = (_f = event === null || event === void 0 ? void 0 : event.emitter) !== null && _f !== void 0 ? _f : (0, global_emitter_js_1.getYalcGlobalEventEmitter)();
        const formatter = event === null || event === void 0 ? void 0 : event.formatter;
        const eventPayload = {
            message: optionalMessage,
            data,
            eventName: formattedEventName,
            config,
            level: logLevel,
            errorInfo: !_.isEmpty(errorPayload) ? errorPayload : undefined,
        };
        result = (0, emitter_js_1.emitEvent)(eventEmitter, eventName, eventPayload, {
            formatter,
            await: event === null || event === void 0 ? void 0 : event.await,
        });
        if (options === null || options === void 0 ? void 0 : options.eventAliases) {
            toAwait.push(...options.eventAliases.map((alias) => {
                let eventName;
                let _await;
                if (typeof alias === 'string') {
                    eventName = alias;
                    _await = event === null || event === void 0 ? void 0 : event.await;
                }
                else {
                    eventName = alias.eventName;
                    _await = alias === null || alias === void 0 ? void 0 : alias.await;
                }
                const emittedEvent = (0, emitter_js_1.emitEvent)(eventEmitter, eventName, eventPayload, {
                    formatter,
                    await: _await,
                });
                return emittedEvent;
            }));
        }
    }
    const promise = (async () => {
        await Promise.all(toAwait);
        return result;
    })();
    promise_helper_js_1.globalPromiseTracker.add(promise);
    const returnedError = errorInstance;
    return returnedError !== null && returnedError !== void 0 ? returnedError : promise;
}
function getLoggerOption(level, options) {
    if ((options === null || options === void 0 ? void 0 : options.logger) === false)
        return false;
    if (typeof (options === null || options === void 0 ? void 0 : options.logger) === 'string') {
        return { level: options.logger };
    }
    return Object.assign({ level }, options === null || options === void 0 ? void 0 : options.logger);
}
function resolveLoggerOption(logger) {
    if (logger === false)
        return false;
    if (typeof logger === 'string') {
        return { level: logger };
    }
    return logger;
}
async function eventLogAsync(eventName, options) {
    const _options = applyAwaitOption(options);
    return event(eventName, Object.assign(Object.assign({}, _options), { logger: getLoggerOption(logger_enum_js_1.LogLevelEnum.LOG, _options) }));
}
function eventLog(eventName, options) {
    return event(eventName, Object.assign(Object.assign({}, options), { logger: getLoggerOption(logger_enum_js_1.LogLevelEnum.LOG, options) }));
}
async function eventErrorAsync(eventName, options) {
    const _options = applyAwaitOption(options);
    return eventError(eventName, _options);
}
function eventError(eventName, options) {
    var _a;
    const _options = Object.assign(Object.assign({}, (options !== null && options !== void 0 ? options : {})), { logger: getLoggerOption(logger_enum_js_1.LogLevelEnum.ERROR, options), errorClass: (_a = options === null || options === void 0 ? void 0 : options.errorClass) !== null && _a !== void 0 ? _a : true });
    return event(eventName, _options);
}
async function eventWarnAsync(eventName, options) {
    const _options = applyAwaitOption(options);
    return event(eventName, Object.assign(Object.assign({}, _options), { logger: getLoggerOption(logger_enum_js_1.LogLevelEnum.WARN, _options) }));
}
function eventWarn(eventName, options) {
    return event(eventName, Object.assign(Object.assign({}, options), { logger: getLoggerOption(logger_enum_js_1.LogLevelEnum.WARN, options) }));
}
async function eventDebugAsync(eventName, options) {
    const _options = applyAwaitOption(options);
    return event(eventName, Object.assign(Object.assign({}, _options), { logger: getLoggerOption(logger_enum_js_1.LogLevelEnum.DEBUG, _options) }));
}
function eventDebug(eventName, options) {
    return event(eventName, Object.assign(Object.assign({}, options), { logger: getLoggerOption(logger_enum_js_1.LogLevelEnum.DEBUG, options) }));
}
async function eventVerboseAsync(eventName, options) {
    const _options = applyAwaitOption(options);
    return event(eventName, Object.assign(Object.assign({}, _options), { logger: getLoggerOption(logger_enum_js_1.LogLevelEnum.VERBOSE, _options) }));
}
function eventVerbose(eventName, options) {
    return event(eventName, Object.assign(Object.assign({}, options), { logger: getLoggerOption(logger_enum_js_1.LogLevelEnum.VERBOSE, options) }));
}
//# sourceMappingURL=event.js.map