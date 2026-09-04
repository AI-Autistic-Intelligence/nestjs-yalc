import { LogLevelEnum } from '@nestjs-yalc/logger/logger.enum.js';
import { maskDataInObject } from '@nestjs-yalc/logger/logger.helper.js';
import { DefaultError, isDefaultErrorMixin, } from '@nestjs-yalc/errors/default.error.js';
import { emitEvent, formatName } from './emitter.js';
import { getYalcGlobalEventEmitter } from './global-emitter.js';
import { AppLoggerFactory } from '@nestjs-yalc/logger/logger.factory.js';
import { isClass } from '@nestjs-yalc/utils/class.helper.js';
import { deepMergeWithoutArrayConcat } from '@nestjs-yalc/utils/object.helper.js';
import * as _ from 'lodash-es';
import { globalPromiseTracker } from '@nestjs-yalc/utils/promise.helper.js';
export function applyAwaitOption(options) {
    let event = options?.event;
    if (event !== false && event !== undefined) {
        event = { ...event, await: event.await ?? true };
    }
    return { ...options, event };
}
export function isErrorOptions(options) {
    return options?.errorClass !== undefined;
}
export function event(eventName, options) {
    const { data: _data, event, logger, mask, stack, config } = options ?? {};
    let receivedData = _data;
    const formattedEventName = formatName(eventName, options?.event ? options?.event?.formatter : undefined);
    if (typeof receivedData === 'string') {
        receivedData = { message: receivedData };
    }
    if (mask)
        receivedData = maskDataInObject(receivedData, mask);
    const data = { ...receivedData, eventName: formattedEventName };
    const optionalMessage = options?.logger ? options.message : undefined;
    let errorInstance;
    let errorPayload = null;
    if (isErrorOptions(options)) {
        const { errorClass: _class, logger, ...rest } = options;
        if (_class !== false && _class !== undefined) {
            if (isClass(_class) || _class === true) {
                let _errorClass;
                const errorOptions = rest;
                if (_class === true) {
                    _errorClass = DefaultError;
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
            if (isDefaultErrorMixin(errorInstance)) {
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
                    data: deepMergeWithoutArrayConcat(errorInstance.data ?? {}, receivedData),
                    response: deepMergeWithoutArrayConcat(errorInstance.response ?? {}, options.response ?? {}),
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
                AppLoggerFactory('Event')),
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
        const eventEmitter = event?.emitter ?? getYalcGlobalEventEmitter();
        const formatter = event?.formatter;
        const eventPayload = {
            message: optionalMessage,
            data,
            eventName: formattedEventName,
            config,
            level: logLevel,
            errorInfo: !_.isEmpty(errorPayload) ? errorPayload : undefined,
        };
        result = emitEvent(eventEmitter, eventName, eventPayload, {
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
                const emittedEvent = emitEvent(eventEmitter, eventName, eventPayload, {
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
    globalPromiseTracker.add(promise);
    const returnedError = errorInstance;
    return returnedError ?? promise;
}
export function getLoggerOption(level, options) {
    if (options?.logger === false)
        return false;
    if (typeof options?.logger === 'string') {
        return { level: options.logger };
    }
    return { level, ...options?.logger };
}
export function resolveLoggerOption(logger) {
    if (logger === false)
        return false;
    if (typeof logger === 'string') {
        return { level: logger };
    }
    return logger;
}
export async function eventLogAsync(eventName, options) {
    const _options = applyAwaitOption(options);
    return event(eventName, {
        ..._options,
        logger: getLoggerOption(LogLevelEnum.LOG, _options),
    });
}
export function eventLog(eventName, options) {
    return event(eventName, {
        ...options,
        logger: getLoggerOption(LogLevelEnum.LOG, options),
    });
}
export async function eventErrorAsync(eventName, options) {
    const _options = applyAwaitOption(options);
    return eventError(eventName, _options);
}
export function eventError(eventName, options) {
    const _options = {
        ...(options ?? {}),
        logger: getLoggerOption(LogLevelEnum.ERROR, options),
        errorClass: options?.errorClass ?? true,
    };
    return event(eventName, _options);
}
export async function eventWarnAsync(eventName, options) {
    const _options = applyAwaitOption(options);
    return event(eventName, {
        ..._options,
        logger: getLoggerOption(LogLevelEnum.WARN, _options),
    });
}
export function eventWarn(eventName, options) {
    return event(eventName, {
        ...options,
        logger: getLoggerOption(LogLevelEnum.WARN, options),
    });
}
export async function eventDebugAsync(eventName, options) {
    const _options = applyAwaitOption(options);
    return event(eventName, {
        ..._options,
        logger: getLoggerOption(LogLevelEnum.DEBUG, _options),
    });
}
export function eventDebug(eventName, options) {
    return event(eventName, {
        ...options,
        logger: getLoggerOption(LogLevelEnum.DEBUG, options),
    });
}
export async function eventVerboseAsync(eventName, options) {
    const _options = applyAwaitOption(options);
    return event(eventName, {
        ..._options,
        logger: getLoggerOption(LogLevelEnum.VERBOSE, _options),
    });
}
export function eventVerbose(eventName, options) {
    return event(eventName, {
        ...options,
        logger: getLoggerOption(LogLevelEnum.VERBOSE, options),
    });
}
//# sourceMappingURL=event.js.map