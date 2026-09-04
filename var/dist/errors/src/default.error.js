import { getLogLevelByStatus } from '@nestjs-yalc/event-manager/event.helper.js';
import { getYalcGlobalEventEmitter } from '@nestjs-yalc/event-manager/global-emitter.js';
import { AppLoggerFactory } from '@nestjs-yalc/logger/logger.factory.js';
import { maskDataInObject } from '@nestjs-yalc/logger/logger.helper.js';
import { getHttpStatusDescription } from '@nestjs-yalc/utils/http.helper.js';
import { HttpException, HttpStatus, } from '@nestjs/common';
import { getHttpStatusNameByCode } from './error.enum.js';
import { deepMergeWithoutArrayConcat } from '@nestjs-yalc/utils/object.helper.js';
import { isClass } from '@nestjs-yalc/utils/class.helper.js';
export const ON_DEFAULT_ERROR_EVENT = 'onDefaultError';
export const newDefaultError = (base, options, ...args) => {
    return new (DefaultErrorMixin(base))(options, ...args);
};
export function formatCause(error) {
    if (!error) {
        return undefined;
    }
    return {
        ...error,
        message: error.message ?? error.toString(),
        stack: error.stack,
        parentCause: error.cause ? formatCause(error.cause) : undefined,
        cause: undefined,
    };
}
export const DefaultErrorMixin = (base) => {
    const BaseClass = base ?? HttpException;
    class _AbstractDefaultError extends BaseClass {
        static { this.defaultStatusCode = HttpStatus.INTERNAL_SERVER_ERROR; }
        constructor(options, ...args) {
            super(...args);
            this.__DefaultErrorMixin = Object.freeze(true);
            const message = options.internalMessage ?? this.message;
            this.setErrorInfo(options);
            if (options.logger) {
                const { instance, level } = options.logger !== true
                    ? options.logger
                    : { instance: undefined, level: undefined };
                this.logger = {
                    instance: instance ?? AppLoggerFactory('DefaultError'),
                    level: level ?? getLogLevelByStatus(this.getStatus()),
                };
                if (this.logger.level === 'error') {
                    this.logger.instance.error(message, this.resolvedStack, {
                        data: this.eventPayload,
                        stack: this.resolvedStack,
                    });
                }
                else {
                    this.logger.instance?.[this.logger.level]?.(message, {
                        data: this.eventPayload,
                        stack: this.resolvedStack,
                    });
                }
            }
            const eventEmitter = options.eventEmitter === true || options.eventEmitter === undefined
                ? getYalcGlobalEventEmitter()
                : options.eventEmitter;
            if (eventEmitter !== false) {
                this.eventName ??= ON_DEFAULT_ERROR_EVENT;
                this.eventEmitter = eventEmitter;
                this.eventEmitter.emit(this.eventName, {
                    ...this.eventPayload,
                    eventName: this.eventName,
                });
            }
        }
        setErrorInfo(options) {
            const stack = options.stack ?? this.stack;
            const errorCode = this.getStatus();
            this.cause = formatCause(this.cause);
            this.internalMessage = options.internalMessage ?? this.cause?.message;
            this.eventName = options.eventName;
            this.description =
                options.description ?? getHttpStatusDescription(errorCode);
            this.betterResponse = _AbstractDefaultError.buildResponse(this.message, this.description, errorCode, options?.response ?? super.getResponse());
            this.data = options.masks
                ? maskDataInObject(options.data, options.masks)
                : options.data;
            const cause = this.cause;
            const payload = {
                data: this.data,
                eventName: this.eventName,
                description: this.description,
                internalMessage: this.internalMessage,
                errorName: this.name,
                ...this.betterResponse,
                stack,
                cause,
            };
            this.resolvedStack = stack;
            this.eventPayload = payload;
        }
        mergeErrorInfo(info) {
            const { internalMessage, description, eventName, data, stack, cause, response, ...rest } = info;
            if (internalMessage)
                this.internalMessage = internalMessage;
            if (description)
                this.description = description;
            if (eventName)
                this.eventName = eventName;
            if (data)
                this.data = deepMergeWithoutArrayConcat(this.data ?? {}, data);
            if (stack)
                this.resolvedStack = stack;
            if (cause) {
                this.cause = formatCause(cause);
                this.eventPayload.cause = this.cause;
            }
            if (response) {
                this.betterResponse = {
                    ...this.betterResponse,
                    ..._AbstractDefaultError.buildResponse(this.message, this.description, this.getStatus(), response),
                };
                this.message = this.betterResponse.message;
            }
            this.eventPayload = {
                ...this.eventPayload,
                ...rest,
                data: this.data,
                eventName: this.eventName,
                description: this.description,
                internalMessage: this.internalMessage,
                errorName: this.name,
                ...this.betterResponse,
                stack: this.resolvedStack,
            };
        }
        getEventPayload() {
            return this.eventPayload;
        }
        getInternalMessage() {
            return this.internalMessage;
        }
        getDescription() {
            return this.description;
        }
        getResponse() {
            return this.betterResponse;
        }
        toString() {
            return `${this.internalMessage ?? this.message} -\n [INFO: ${JSON.stringify(this.eventPayload, null, 2)}]`;
        }
        static buildResponse(message, codeDescription, statusCode, response) {
            let responseObj = {};
            if (typeof response === 'string' || response instanceof String) {
                message = response;
            }
            else {
                responseObj = response;
            }
            const baseBody = HttpException.createBody(message, getHttpStatusNameByCode(statusCode), statusCode);
            return {
                statusCodeDescription: codeDescription,
                ...baseBody,
                message,
                ...responseObj,
            };
        }
    }
    return _AbstractDefaultError;
};
export function DefaultErrorBase(base) {
    return class extends DefaultErrorMixin(base ?? HttpException) {
        static { this.defaultStatusCode = HttpStatus.INTERNAL_SERVER_ERROR; }
        constructor(internalMessage, options, ...args) {
            super({ ...(options ?? {}), internalMessage }, ...args);
        }
    };
}
export class DefaultError extends DefaultErrorBase(HttpException) {
    static { this.defaultStatusCode = HttpStatus.INTERNAL_SERVER_ERROR; }
    constructor(internalMessage, options) {
        const { description, cause, response, errorCode, ...defaultOptions } = options ?? {};
        super(internalMessage, { ...defaultOptions, description }, response ?? {}, errorCode ?? HttpStatus.INTERNAL_SERVER_ERROR, {
            description,
            cause,
        });
    }
}
export const errorToDefaultError = (error, options = {}) => {
    try {
        if (isDefaultErrorMixin(error)) {
            return error;
        }
    }
    catch (e) { }
    try {
        if (error instanceof HttpException) {
            JSON.stringify(error.cause);
            return new DefaultError(error.message, {
                errorCode: error.getStatus(),
                response: {
                    message: error.getResponse().toString(),
                    error: error.name,
                    statusCode: error.getStatus(),
                    statusCodeDescription: getHttpStatusDescription(error.getStatus()),
                },
                stack: error.stack,
                cause: error.cause,
                ...options,
            });
        }
    }
    catch (e) { }
    let name;
    try {
        name = error.name ?? 'UnknownError';
        if (typeof name !== 'string') {
            name = 'UnknownError';
        }
    }
    catch (e) {
        name = 'UnknownError';
    }
    let message;
    try {
        message = error.message ?? 'UnknownError';
        if (typeof message !== 'string') {
            message = 'UnknownError';
        }
    }
    catch (e) {
        message = 'UnknownError';
    }
    let stack;
    try {
        JSON.stringify(error.stack);
        stack = error.stack;
    }
    catch (e) { }
    let cause;
    try {
        const errorCause = error.cause;
        JSON.stringify(errorCause);
        cause = errorCause;
    }
    catch (e) { }
    return new DefaultError(message, {
        stack,
        cause,
        response: {
            error: name,
        },
        ...options,
    });
};
export function isDefaultErrorMixin(error) {
    return error.__DefaultErrorMixin !== undefined;
}
export function isDefaultErrorMixinClass(error) {
    return (isClass(error) &&
        error.defaultStatusCode !== undefined);
}
//# sourceMappingURL=default.error.js.map