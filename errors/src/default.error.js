"use strict";
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
exports.errorToDefaultError = exports.DefaultError = exports.DefaultErrorMixin = exports.newDefaultError = exports.ON_DEFAULT_ERROR_EVENT = void 0;
exports.formatCause = formatCause;
exports.DefaultErrorBase = DefaultErrorBase;
exports.isDefaultErrorMixin = isDefaultErrorMixin;
exports.isDefaultErrorMixinClass = isDefaultErrorMixinClass;
const event_helper_js_1 = require("@nestjs-yalc/event-manager/event.helper.js");
const global_emitter_js_1 = require("@nestjs-yalc/event-manager/global-emitter.js");
const logger_factory_js_1 = require("@nestjs-yalc/logger/logger.factory.js");
const logger_helper_js_1 = require("@nestjs-yalc/logger/logger.helper.js");
const http_helper_js_1 = require("@nestjs-yalc/utils/http.helper.js");
const common_1 = require("@nestjs/common");
const error_enum_js_1 = require("./error.enum.js");
const object_helper_js_1 = require("@nestjs-yalc/utils/object.helper.js");
const class_helper_js_1 = require("@nestjs-yalc/utils/class.helper.js");
exports.ON_DEFAULT_ERROR_EVENT = 'onDefaultError';
const newDefaultError = (base, options, ...args) => {
    return new ((0, exports.DefaultErrorMixin)(base))(options, ...args);
};
exports.newDefaultError = newDefaultError;
function formatCause(error) {
    var _a;
    if (!error) {
        return undefined;
    }
    return Object.assign(Object.assign({}, error), { message: (_a = error.message) !== null && _a !== void 0 ? _a : error.toString(), stack: error.stack, parentCause: error.cause ? formatCause(error.cause) : undefined, cause: undefined });
}
const DefaultErrorMixin = (base) => {
    const BaseClass = base !== null && base !== void 0 ? base : common_1.HttpException;
    class _AbstractDefaultError extends BaseClass {
        constructor(options, ...args) {
            var _a, _b, _c, _d;
            super(...args);
            this.__DefaultErrorMixin = Object.freeze(true);
            const message = (_a = options.internalMessage) !== null && _a !== void 0 ? _a : this.message;
            this.setErrorInfo(options);
            if (options.logger) {
                const { instance, level } = options.logger !== true
                    ? options.logger
                    : { instance: undefined, level: undefined };
                this.logger = {
                    instance: instance !== null && instance !== void 0 ? instance : (0, logger_factory_js_1.AppLoggerFactory)('DefaultError'),
                    level: level !== null && level !== void 0 ? level : (0, event_helper_js_1.getLogLevelByStatus)(this.getStatus()),
                };
                if (this.logger.level === 'error') {
                    this.logger.instance.error(message, this.resolvedStack, {
                        data: this.eventPayload,
                        stack: this.resolvedStack,
                    });
                }
                else {
                    (_c = (_b = this.logger.instance) === null || _b === void 0 ? void 0 : _b[this.logger.level]) === null || _c === void 0 ? void 0 : _c.call(_b, message, {
                        data: this.eventPayload,
                        stack: this.resolvedStack,
                    });
                }
            }
            const eventEmitter = options.eventEmitter === true || options.eventEmitter === undefined
                ? (0, global_emitter_js_1.getYalcGlobalEventEmitter)()
                : options.eventEmitter;
            if (eventEmitter !== false) {
                (_d = this.eventName) !== null && _d !== void 0 ? _d : (this.eventName = exports.ON_DEFAULT_ERROR_EVENT);
                this.eventEmitter = eventEmitter;
                this.eventEmitter.emit(this.eventName, Object.assign(Object.assign({}, this.eventPayload), { eventName: this.eventName }));
            }
        }
        setErrorInfo(options) {
            var _a, _b, _c, _d, _e;
            const stack = (_a = options.stack) !== null && _a !== void 0 ? _a : this.stack;
            const errorCode = this.getStatus();
            this.cause = formatCause(this.cause);
            this.internalMessage = (_b = options.internalMessage) !== null && _b !== void 0 ? _b : (_c = this.cause) === null || _c === void 0 ? void 0 : _c.message;
            this.eventName = options.eventName;
            this.description =
                (_d = options.description) !== null && _d !== void 0 ? _d : (0, http_helper_js_1.getHttpStatusDescription)(errorCode);
            this.betterResponse = _AbstractDefaultError.buildResponse(this.message, this.description, errorCode, (_e = options === null || options === void 0 ? void 0 : options.response) !== null && _e !== void 0 ? _e : super.getResponse());
            this.data = options.masks
                ? (0, logger_helper_js_1.maskDataInObject)(options.data, options.masks)
                : options.data;
            const cause = this.cause;
            const payload = Object.assign(Object.assign({ data: this.data, eventName: this.eventName, description: this.description, internalMessage: this.internalMessage, errorName: this.name }, this.betterResponse), { stack,
                cause });
            this.resolvedStack = stack;
            this.eventPayload = payload;
        }
        mergeErrorInfo(info) {
            var _a;
            const { internalMessage, description, eventName, data, stack, cause, response } = info, rest = __rest(info, ["internalMessage", "description", "eventName", "data", "stack", "cause", "response"]);
            if (internalMessage)
                this.internalMessage = internalMessage;
            if (description)
                this.description = description;
            if (eventName)
                this.eventName = eventName;
            if (data)
                this.data = (0, object_helper_js_1.deepMergeWithoutArrayConcat)((_a = this.data) !== null && _a !== void 0 ? _a : {}, data);
            if (stack)
                this.resolvedStack = stack;
            if (cause) {
                this.cause = formatCause(cause);
                this.eventPayload.cause = this.cause;
            }
            if (response) {
                this.betterResponse = Object.assign(Object.assign({}, this.betterResponse), _AbstractDefaultError.buildResponse(this.message, this.description, this.getStatus(), response));
                this.message = this.betterResponse.message;
            }
            this.eventPayload = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, this.eventPayload), rest), { data: this.data, eventName: this.eventName, description: this.description, internalMessage: this.internalMessage, errorName: this.name }), this.betterResponse), { stack: this.resolvedStack });
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
            var _a;
            return `${(_a = this.internalMessage) !== null && _a !== void 0 ? _a : this.message} -\n [INFO: ${JSON.stringify(this.eventPayload, null, 2)}]`;
        }
        static buildResponse(message, codeDescription, statusCode, response) {
            let responseObj = {};
            if (typeof response === 'string' || response instanceof String) {
                message = response;
            }
            else {
                responseObj = response;
            }
            const baseBody = common_1.HttpException.createBody(message, (0, error_enum_js_1.getHttpStatusNameByCode)(statusCode), statusCode);
            return Object.assign(Object.assign(Object.assign({ statusCodeDescription: codeDescription }, baseBody), { message }), responseObj);
        }
    }
    _AbstractDefaultError.defaultStatusCode = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
    return _AbstractDefaultError;
};
exports.DefaultErrorMixin = DefaultErrorMixin;
function DefaultErrorBase(base) {
    var _a;
    return _a = class extends (0, exports.DefaultErrorMixin)(base !== null && base !== void 0 ? base : common_1.HttpException) {
            constructor(internalMessage, options, ...args) {
                super(Object.assign(Object.assign({}, (options !== null && options !== void 0 ? options : {})), { internalMessage }), ...args);
            }
        },
        _a.defaultStatusCode = common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        _a;
}
class DefaultError extends DefaultErrorBase(common_1.HttpException) {
    constructor(internalMessage, options) {
        const _a = options !== null && options !== void 0 ? options : {}, { description, cause, response, errorCode } = _a, defaultOptions = __rest(_a, ["description", "cause", "response", "errorCode"]);
        super(internalMessage, Object.assign(Object.assign({}, defaultOptions), { description }), response !== null && response !== void 0 ? response : {}, errorCode !== null && errorCode !== void 0 ? errorCode : common_1.HttpStatus.INTERNAL_SERVER_ERROR, {
            description,
            cause,
        });
    }
}
exports.DefaultError = DefaultError;
DefaultError.defaultStatusCode = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
const errorToDefaultError = (error, options = {}) => {
    var _a, _b;
    try {
        if (isDefaultErrorMixin(error)) {
            return error;
        }
    }
    catch (e) { }
    try {
        if (error instanceof common_1.HttpException) {
            JSON.stringify(error.cause);
            return new DefaultError(error.message, Object.assign({ errorCode: error.getStatus(), response: {
                    message: error.getResponse().toString(),
                    error: error.name,
                    statusCode: error.getStatus(),
                    statusCodeDescription: (0, http_helper_js_1.getHttpStatusDescription)(error.getStatus()),
                }, stack: error.stack, cause: error.cause }, options));
        }
    }
    catch (e) { }
    let name;
    try {
        name = (_a = error.name) !== null && _a !== void 0 ? _a : 'UnknownError';
        if (typeof name !== 'string') {
            name = 'UnknownError';
        }
    }
    catch (e) {
        name = 'UnknownError';
    }
    let message;
    try {
        message = (_b = error.message) !== null && _b !== void 0 ? _b : 'UnknownError';
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
    return new DefaultError(message, Object.assign({ stack,
        cause, response: {
            error: name,
        } }, options));
};
exports.errorToDefaultError = errorToDefaultError;
function isDefaultErrorMixin(error) {
    return error.__DefaultErrorMixin !== undefined;
}
function isDefaultErrorMixinClass(error) {
    return ((0, class_helper_js_1.isClass)(error) &&
        error.defaultStatusCode !== undefined);
}
//# sourceMappingURL=default.error.js.map