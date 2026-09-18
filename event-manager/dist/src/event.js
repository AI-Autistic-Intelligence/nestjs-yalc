"use strict";
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
const tslib_1 = require("tslib");
const logger_enum_js_1 = require("@nest-yalc-2/logger/logger.enum.js");
const logger_helper_js_1 = require("@nest-yalc-2/logger/logger.helper.js");
const default_error_js_1 = require("@nest-yalc-2/errors/default.error.js");
const emitter_js_1 = require("./emitter.js");
const global_emitter_js_1 = require("./global-emitter.js");
const logger_factory_js_1 = require("@nest-yalc-2/logger/logger.factory.js");
const class_helper_js_1 = require("@nest-yalc-2/utils/class.helper.js");
const object_helper_js_1 = require("@nest-yalc-2/utils/object.helper.js");
const _ = tslib_1.__importStar(require("lodash-es"));
const promise_helper_js_1 = require("@nest-yalc-2/utils/promise.helper.js");
function applyAwaitOption(options) {
    let event = options?.event;
    if (event !== false && event !== undefined) {
        event = { ...event, await: event.await ?? true };
    }
    return { ...options, event };
}
function isErrorOptions(options) {
    return options?.errorClass !== undefined;
}
function event(eventName, options) {
    const { data: _data, event, logger, mask, stack, config } = options ?? {};
    let receivedData = _data;
    const formattedEventName = (0, emitter_js_1.formatName)(eventName, options?.event ? options?.event?.formatter : undefined);
    if (typeof receivedData === 'string') {
        receivedData = { message: receivedData };
    }
    if (mask)
        receivedData = (0, logger_helper_js_1.maskDataInObject)(receivedData, mask);
    const data = { ...receivedData, eventName: formattedEventName };
    const optionalMessage = options?.logger ? options.message : undefined;
    let errorInstance;
    let errorPayload = null;
    if (isErrorOptions(options)) {
        const { errorClass: _class, logger, ...rest } = options;
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
                const message = optionalMessage ?? formattedEventName;
                errorInstance = new _errorClass(message, {
                    eventName: formattedEventName,
                    ...errorOptions,
                    eventEmitter: false,
                    logger: false,
                });
            }
            else {
                errorInstance = _class;
            }
            if ((0, default_error_js_1.isDefaultErrorMixin)(errorInstance)) {
                errorInstance.mergeErrorInfo({
                    ...rest,
                    config,
                    data: receivedData,
                });
                errorPayload = errorInstance.getEventPayload();
            }
            else {
                errorPayload = {
                    ...rest,
                    ...errorInstance,
                    data: (0, object_helper_js_1.deepMergeWithoutArrayConcat)(errorInstance.data ?? {}, receivedData),
                    response: (0, object_helper_js_1.deepMergeWithoutArrayConcat)(errorInstance.response ?? {}, options.response ?? {}),
                    config,
                };
            }
        }
    }
    let logLevel = undefined;
    if (logger !== false) {
        const { instance: _instance, level: _level, ...rest } = logger && typeof logger !== 'string'
            ? logger
            : { level: logger, instance: undefined };
        const loggerConfig = {
            instance: (_instance ??
                (0, logger_factory_js_1.AppLoggerFactory)('Event')),
            level: (_level ?? 'log'),
            ...rest,
        };
        const { level, instance } = loggerConfig;
        logLevel = level;
        const message = optionalMessage ?? formattedEventName;
        const logData = errorPayload ? errorPayload : { data };
        if (level === 'error') {
            instance.error(message, stack ?? errorPayload?.stack, {
                data: logData,
                event: false,
                config,
                stack: stack ?? errorPayload?.stack,
            });
        }
        else {
            instance[level]?.(message, {
                data: logData,
                event: false,
                config,
                stack: stack ?? errorPayload?.stack,
            });
        }
    }
    let result;
    const toAwait = [];
    if (event !== false) {
        const eventEmitter = event?.emitter ?? (0, global_emitter_js_1.getYalcGlobalEventEmitter)();
        const formatter = event?.formatter;
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
            await: event?.await,
        });
        if (options?.eventAliases) {
            toAwait.push(...options.eventAliases.map((alias) => {
                let eventName;
                let _await;
                if (typeof alias === 'string') {
                    eventName = alias;
                    _await = event?.await;
                }
                else {
                    eventName = alias.eventName;
                    _await = alias?.await;
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
    return returnedError ?? promise;
}
function getLoggerOption(level, options) {
    if (options?.logger === false)
        return false;
    if (typeof options?.logger === 'string') {
        return { level: options.logger };
    }
    return { level, ...options?.logger };
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
    return event(eventName, {
        ..._options,
        logger: getLoggerOption(logger_enum_js_1.LogLevelEnum.LOG, _options),
    });
}
function eventLog(eventName, options) {
    return event(eventName, {
        ...options,
        logger: getLoggerOption(logger_enum_js_1.LogLevelEnum.LOG, options),
    });
}
async function eventErrorAsync(eventName, options) {
    const _options = applyAwaitOption(options);
    return eventError(eventName, _options);
}
function eventError(eventName, options) {
    const _options = {
        ...(options ?? {}),
        logger: getLoggerOption(logger_enum_js_1.LogLevelEnum.ERROR, options),
        errorClass: options?.errorClass ?? true,
    };
    return event(eventName, _options);
}
async function eventWarnAsync(eventName, options) {
    const _options = applyAwaitOption(options);
    return event(eventName, {
        ..._options,
        logger: getLoggerOption(logger_enum_js_1.LogLevelEnum.WARN, _options),
    });
}
function eventWarn(eventName, options) {
    return event(eventName, {
        ...options,
        logger: getLoggerOption(logger_enum_js_1.LogLevelEnum.WARN, options),
    });
}
async function eventDebugAsync(eventName, options) {
    const _options = applyAwaitOption(options);
    return event(eventName, {
        ..._options,
        logger: getLoggerOption(logger_enum_js_1.LogLevelEnum.DEBUG, _options),
    });
}
function eventDebug(eventName, options) {
    return event(eventName, {
        ...options,
        logger: getLoggerOption(logger_enum_js_1.LogLevelEnum.DEBUG, options),
    });
}
async function eventVerboseAsync(eventName, options) {
    const _options = applyAwaitOption(options);
    return event(eventName, {
        ..._options,
        logger: getLoggerOption(logger_enum_js_1.LogLevelEnum.VERBOSE, _options),
    });
}
function eventVerbose(eventName, options) {
    return event(eventName, {
        ...options,
        logger: getLoggerOption(logger_enum_js_1.LogLevelEnum.VERBOSE, options),
    });
}
//# sourceMappingURL=event.js.map