"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YalcEventService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const event_js_1 = require("./event.js");
const event_emitter_1 = require("@nestjs/event-emitter");
const default_error_js_1 = require("@nest-yalc-2/errors/default.error.js");
const error_class_js_1 = require("@nest-yalc-2/errors/error.class.js");
const event_helper_js_1 = require("./event.helper.js");
const http_status_code_to_errors_js_1 = require("@nest-yalc-2/errors/http-status-code-to-errors.js");
const class_helper_js_1 = require("@nest-yalc-2/utils/class.helper.js");
const neverthrow_1 = require("neverthrow");
function InjectTrace() {
    return function (_target, _key, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            let options = args[1];
            if (typeof options !== 'object' || options === null) {
                options = {};
                args[1] = options;
            }
            if (!options.stack &&
                !options.errorClass?.stack &&
                !options.cause?.stack) {
                options.stack = new Error().stack;
            }
            return originalMethod.apply(this, args);
        };
        return descriptor;
    };
}
let YalcEventService = class YalcEventService {
    constructor(loggerService, eventEmitter, options) {
        this.loggerService = loggerService;
        this.eventEmitter = eventEmitter;
        this.options = options;
        this.emit = this.log;
        this.emitAsync = this.logAsync;
    }
    get logger() {
        return this.loggerService;
    }
    get emitter() {
        return this.eventEmitter;
    }
    _error(eventName, options) {
        return (0, event_js_1.eventError)(eventName, this.buildOptions(options));
    }
    async logAsync(eventName, options) {
        return (0, event_js_1.eventLogAsync)(eventName, this.buildOptions(options));
    }
    async _errorAsync(eventName, options) {
        return (0, event_js_1.eventErrorAsync)(eventName, this.buildOptions(options));
    }
    error(eventName, options) {
        return this._error(eventName, this.buildErrorOptions(options));
    }
    errorResult(eventName, options) {
        return (0, neverthrow_1.err)(this.error(eventName, options));
    }
    async errorFromFn(eventName, cb, options) {
        try {
            const result = await cb();
            return (0, neverthrow_1.ok)(result);
        }
        catch (error) {
            return this.errorResult(eventName, this.applyCause(error, options));
        }
    }
    async errorAsync(eventName, options) {
        return this._errorAsync(eventName, this.buildErrorOptions(options));
    }
    async warnAsync(eventName, options) {
        return (0, event_js_1.eventWarnAsync)(eventName, this.buildOptions(options));
    }
    async debugAsync(eventName, options) {
        return (0, event_js_1.eventDebugAsync)(eventName, this.buildOptions(options));
    }
    async verboseAsync(eventName, options) {
        return (0, event_js_1.eventVerboseAsync)(eventName, this.buildOptions(options));
    }
    log(eventName, options) {
        return (0, event_js_1.eventLog)(eventName, this.buildOptions(options));
    }
    warn(eventName, options) {
        return (0, event_js_1.eventWarn)(eventName, this.buildOptions(options));
    }
    debug(eventName, options) {
        return (0, event_js_1.eventDebug)(eventName, this.buildOptions(options));
    }
    verbose(eventName, options) {
        return (0, event_js_1.eventVerbose)(eventName, this.buildOptions(options));
    }
    errorHttp(eventName, errorCode, options) {
        const httpCode = errorCode;
        const selectedError = http_status_code_to_errors_js_1.httpStatusCodeToErrors[httpCode] ?? error_class_js_1.InternalServerError;
        const mergedOptions = this.applyLoggerLevel((0, event_js_1.applyAwaitOption)(this.buildErrorOptions(options, selectedError)), (0, event_helper_js_1.getLogLevelByStatus)(errorCode));
        return this._error(eventName, mergedOptions);
    }
    errorHttpResult(eventName, errorCode, options) {
        const httpCode = errorCode;
        const selectedError = http_status_code_to_errors_js_1.httpStatusCodeToErrors[httpCode] ?? error_class_js_1.InternalServerError;
        const mergedOptions = this.applyLoggerLevel((0, event_js_1.applyAwaitOption)(this.buildErrorOptions(options, selectedError)), (0, event_helper_js_1.getLogLevelByStatus)(errorCode));
        return (0, neverthrow_1.err)(this._error(eventName, mergedOptions));
    }
    errorForward(eventName, error, options) {
        const rebasedError = (0, default_error_js_1.errorToDefaultError)(error);
        let mergedOptions = this.buildErrorOptions(options, rebasedError);
        if (mergedOptions.logger === undefined) {
            mergedOptions = this.applyLoggerLevelByStatus(mergedOptions, rebasedError);
        }
        return this._error(eventName, {
            ...mergedOptions,
        });
    }
    errorForwardResult(eventName, error, options) {
        return (0, neverthrow_1.err)(this.errorForward(eventName, error, options));
    }
    async errorForwardFromFn(eventName, cb, options) {
        try {
            const result = await cb();
            return (0, neverthrow_1.ok)(result);
        }
        catch (error) {
            return this.errorForwardResult(eventName, error, options);
        }
    }
    errorBadRequest(eventName, options) {
        const mergedOptions = this.applyLoggerLevelByError((0, event_js_1.applyAwaitOption)(this.buildErrorOptions(options, error_class_js_1.BadRequestError)));
        return this._error(eventName, mergedOptions);
    }
    errorBadRequestResult(eventName, options) {
        const mergedOptions = this.applyLoggerLevelByError((0, event_js_1.applyAwaitOption)(this.buildErrorOptions(options, error_class_js_1.BadRequestError)));
        return (0, neverthrow_1.err)(this._error(eventName, mergedOptions));
    }
    async errorBadRequestFromFn(eventName, cb, options) {
        try {
            const result = await cb();
            return (0, neverthrow_1.ok)(result);
        }
        catch (error) {
            return this.errorBadRequestResult(eventName, options);
        }
    }
    errorUnauthorized(eventName, options) {
        const mergedOptions = this.applyLoggerLevelByError((0, event_js_1.applyAwaitOption)(this.buildErrorOptions(options, error_class_js_1.UnauthorizedError)));
        return this._error(eventName, mergedOptions);
    }
    errorUnauthorizedResult(eventName, options) {
        return (0, neverthrow_1.err)(this.errorUnauthorized(eventName, options));
    }
    async errorUnauthorizedFromFn(eventName, cb, options) {
        try {
            const result = await cb();
            return (0, neverthrow_1.ok)(result);
        }
        catch (error) {
            return this.errorUnauthorizedResult(eventName, options);
        }
    }
    errorPaymentRequired(eventName, options) {
        const mergedOptions = this.applyLoggerLevelByError((0, event_js_1.applyAwaitOption)(this.buildErrorOptions(options, error_class_js_1.PaymentRequiredError)));
        return this._error(eventName, mergedOptions);
    }
    errorForbidden(eventName, options) {
        const mergedOptions = this.applyLoggerLevelByError((0, event_js_1.applyAwaitOption)(this.buildErrorOptions(options, error_class_js_1.ForbiddenError)));
        return this._error(eventName, mergedOptions);
    }
    errorForbiddenResult(eventName, options) {
        return (0, neverthrow_1.err)(this.errorForbidden(eventName, options));
    }
    async errorForbiddenFromFn(eventName, cb, options) {
        try {
            const result = await cb();
            return (0, neverthrow_1.ok)(result);
        }
        catch (error) {
            return this.errorForbiddenResult(eventName, options);
        }
    }
    errorNotFound(eventName, options) {
        const mergedOptions = this.applyLoggerLevelByError((0, event_js_1.applyAwaitOption)(this.buildErrorOptions(options, error_class_js_1.NotFoundError)));
        return this._error(eventName, mergedOptions);
    }
    errorNotFoundResult(eventName, options) {
        const mergedOptions = this.applyLoggerLevelByError((0, event_js_1.applyAwaitOption)(this.buildErrorOptions(options, error_class_js_1.NotFoundError)));
        return (0, neverthrow_1.err)(this._error(eventName, mergedOptions));
    }
    async errorNotFoundFromFn(eventName, cb, options) {
        try {
            const result = await cb();
            return (0, neverthrow_1.ok)(result);
        }
        catch (error) {
            return this.errorNotFoundResult(eventName, options);
        }
    }
    errorMethodNotAllowed(eventName, options) {
        const mergedOptions = this.applyLoggerLevelByError((0, event_js_1.applyAwaitOption)(this.buildErrorOptions(options, error_class_js_1.MethodNotAllowedError)));
        return this._error(eventName, mergedOptions);
    }
    errorMethodNotAllowedResult(eventName, options) {
        return (0, neverthrow_1.err)(this.errorMethodNotAllowed(eventName, options));
    }
    async errorMethodNotAllowedFromFn(eventName, cb, options) {
        try {
            const result = await cb();
            return (0, neverthrow_1.ok)(result);
        }
        catch (error) {
            return this.errorMethodNotAllowedResult(eventName, options);
        }
    }
    errorNotAcceptable(eventName, options) {
        const mergedOptions = this.applyLoggerLevelByError((0, event_js_1.applyAwaitOption)(this.buildErrorOptions(options, error_class_js_1.NotAcceptableError)));
        return this._error(eventName, mergedOptions);
    }
    errorNotAcceptableResult(eventName, options) {
        return (0, neverthrow_1.err)(this.errorNotAcceptable(eventName, options));
    }
    async errorNotAcceptableFromFn(eventName, cb, options) {
        try {
            const result = await cb();
            return (0, neverthrow_1.ok)(result);
        }
        catch (error) {
            return this.errorNotAcceptableResult(eventName, options);
        }
    }
    errorConflict(eventName, options) {
        const mergedOptions = this.applyLoggerLevelByError((0, event_js_1.applyAwaitOption)(this.buildErrorOptions(options, error_class_js_1.ConflictError)));
        return this._error(eventName, mergedOptions);
    }
    errorConflictResult(eventName, options) {
        return (0, neverthrow_1.err)(this.errorConflict(eventName, options));
    }
    async errorConflictFromFn(eventName, cb, options) {
        try {
            const result = await cb();
            return (0, neverthrow_1.ok)(result);
        }
        catch (error) {
            return this.errorConflictResult(eventName, options);
        }
    }
    errorGone(eventName, options) {
        const mergedOptions = this.applyLoggerLevelByError((0, event_js_1.applyAwaitOption)(this.buildErrorOptions(options, error_class_js_1.GoneError)));
        return this._error(eventName, mergedOptions);
    }
    errorGoneResult(eventName, options) {
        return (0, neverthrow_1.err)(this.errorGone(eventName, options));
    }
    async errorGoneFromFn(eventName, cb, options) {
        try {
            const result = await cb();
            return (0, neverthrow_1.ok)(result);
        }
        catch (error) {
            return this.errorGoneResult(eventName, options);
        }
    }
    errorUnsupportedMediaType(eventName, options) {
        const mergedOptions = this.applyLoggerLevelByError((0, event_js_1.applyAwaitOption)(this.buildErrorOptions(options, error_class_js_1.UnsupportedMediaTypeError)));
        return this._error(eventName, mergedOptions);
    }
    errorUnsupportedMediaTypeResult(eventName, options) {
        return (0, neverthrow_1.err)(this.errorUnsupportedMediaType(eventName, options));
    }
    async errorUnsupportedMediaTypeFromFn(eventName, cb, options) {
        try {
            const result = await cb();
            return (0, neverthrow_1.ok)(result);
        }
        catch (error) {
            return this.errorUnsupportedMediaTypeResult(eventName, options);
        }
    }
    errorUnprocessableEntity(eventName, options) {
        const mergedOptions = this.applyLoggerLevelByError((0, event_js_1.applyAwaitOption)(this.buildErrorOptions(options, error_class_js_1.UnprocessableEntityError)));
        return this._error(eventName, mergedOptions);
    }
    errorUnprocessableEntityResult(eventName, options) {
        return (0, neverthrow_1.err)(this.errorUnprocessableEntity(eventName, options));
    }
    async errorUnprocessableEntityFromFn(eventName, cb, options) {
        try {
            const result = await cb();
            return (0, neverthrow_1.ok)(result);
        }
        catch (error) {
            return this.errorUnprocessableEntityResult(eventName, options);
        }
    }
    errorTooManyRequests(eventName, options) {
        const mergedOptions = this.applyLoggerLevelByError((0, event_js_1.applyAwaitOption)(this.buildErrorOptions(options, error_class_js_1.TooManyRequestsError)));
        return this._error(eventName, mergedOptions);
    }
    errorTooManyRequestsResult(eventName, options) {
        return (0, neverthrow_1.err)(this.errorTooManyRequests(eventName, options));
    }
    async errorTooManyRequestsFromFn(eventName, cb, options) {
        try {
            const result = await cb();
            return (0, neverthrow_1.ok)(result);
        }
        catch (error) {
            return this.errorTooManyRequestsResult(eventName, options);
        }
    }
    errorInternalServerError(eventName, options) {
        const mergedOptions = (0, event_js_1.applyAwaitOption)(this.buildErrorOptions(options, error_class_js_1.InternalServerError));
        return this._error(eventName, mergedOptions);
    }
    errorInternalServerErrorResult(eventName, options) {
        return (0, neverthrow_1.err)(this.errorInternalServerError(eventName, options));
    }
    async errorInternalServerErrorFromFn(eventName, cb, options) {
        try {
            const result = await cb();
            return (0, neverthrow_1.ok)(result);
        }
        catch (error) {
            return this.errorInternalServerErrorResult(eventName, options);
        }
    }
    errorNotImplemented(eventName, options) {
        const mergedOptions = (0, event_js_1.applyAwaitOption)(this.buildErrorOptions(options, error_class_js_1.NotImplementedError));
        return this._error(eventName, mergedOptions);
    }
    errorNotImplementedResult(eventName, options) {
        return (0, neverthrow_1.err)(this.errorNotImplemented(eventName, options));
    }
    async errorNotImplementedFromFn(eventName, cb, options) {
        try {
            const result = await cb();
            return (0, neverthrow_1.ok)(result);
        }
        catch (error) {
            return this.errorNotImplementedResult(eventName, options);
        }
    }
    errorBadGateway(eventName, options) {
        const mergedOptions = (0, event_js_1.applyAwaitOption)(this.buildErrorOptions(options, error_class_js_1.BadGatewayError));
        return this._error(eventName, mergedOptions);
    }
    errorBadGatewayResult(eventName, options) {
        return (0, neverthrow_1.err)(this.errorBadGateway(eventName, options));
    }
    async errorBadGatewayFromFn(eventName, cb, options) {
        try {
            const result = await cb();
            return (0, neverthrow_1.ok)(result);
        }
        catch (error) {
            return this.errorBadGatewayResult(eventName, options);
        }
    }
    errorServiceUnavailable(eventName, options) {
        const mergedOptions = (0, event_js_1.applyAwaitOption)(this.buildErrorOptions(options, error_class_js_1.ServiceUnavailableError));
        return this._error(eventName, mergedOptions);
    }
    errorServiceUnavailableResult(eventName, options) {
        return (0, neverthrow_1.err)(this.errorServiceUnavailable(eventName, options));
    }
    async errorServiceUnavailableFromFn(eventName, cb, options) {
        try {
            const result = await cb();
            return (0, neverthrow_1.ok)(result);
        }
        catch (error) {
            return this.errorServiceUnavailableResult(eventName, options);
        }
    }
    errorGatewayTimeout(eventName, options) {
        const mergedOptions = (0, event_js_1.applyAwaitOption)(this.buildErrorOptions(options, error_class_js_1.GatewayTimeoutError));
        return this._error(eventName, mergedOptions);
    }
    errorGatewayTimeoutResult(eventName, options) {
        return (0, neverthrow_1.err)(this.errorGatewayTimeout(eventName, options));
    }
    async errorGatewayTimeoutFromFn(eventName, cb, options) {
        try {
            const result = await cb();
            return (0, neverthrow_1.ok)(result);
        }
        catch (error) {
            return this.errorGatewayTimeoutResult(eventName, options);
        }
    }
    getLoggerLevelByOptions(options) {
        return (0, event_helper_js_1.getLogLevelByError)(options.errorClass);
    }
    applyLoggerLevel(options, level) {
        if (options?.logger === false)
            return options;
        const loggerOption = (0, event_js_1.resolveLoggerOption)(options?.logger);
        return {
            ...options,
            logger: {
                ...(loggerOption || {}),
                level,
            },
        };
    }
    applyLoggerLevelByStatus(options, error) {
        const level = (0, event_helper_js_1.getLogLevelByStatus)(error.getStatus());
        return this.applyLoggerLevel(options, level);
    }
    applyLoggerLevelByError(options) {
        const level = this.getLoggerLevelByOptions(options);
        return this.applyLoggerLevel(options, level);
    }
    applyCause(cause, options) {
        return {
            ...options,
            cause,
        };
    }
    buildOptions(options) {
        const _options = { ...options };
        let event;
        if (_options?.event !== undefined || this.eventEmitter) {
            event =
                _options.event === false
                    ? false
                    : {
                        ..._options?.event,
                        emitter: _options?.event?.emitter ?? this.eventEmitter,
                        formatter: _options?.event?.formatter ?? this.options?.formatter,
                    };
        }
        if ((0, event_js_1.isErrorOptions)(_options)) {
            const _errorOptions = _options;
            if (_errorOptions.errorClass &&
                _errorOptions.errorClass !== true &&
                !(0, class_helper_js_1.isClass)(_errorOptions.errorClass)) {
                const error = (0, default_error_js_1.errorToDefaultError)(_errorOptions.errorClass);
                _errorOptions.stack ??= error.stack;
            }
            else if (_errorOptions.cause) {
                const cause = (0, default_error_js_1.formatCause)(_errorOptions.cause);
                _errorOptions.stack ??= cause?.stack;
            }
            else {
                _errorOptions.stack ??= new Error().stack;
            }
        }
        const loggerOption = (0, event_js_1.resolveLoggerOption)(_options?.logger);
        const res = {
            ..._options,
            event,
            logger: _options?.logger === false
                ? false
                : {
                    ...(loggerOption || {}),
                    instance: this.loggerService,
                },
        };
        return res;
    }
    buildErrorOptions(options = {}, defaultClass = true) {
        options.errorClass ??= defaultClass;
        return options;
    }
};
exports.YalcEventService = YalcEventService;
tslib_1.__decorate([
    InjectTrace(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], YalcEventService.prototype, "error", null);
tslib_1.__decorate([
    InjectTrace(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], YalcEventService.prototype, "errorAsync", null);
tslib_1.__decorate([
    InjectTrace(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", error_class_js_1.BadRequestError)
], YalcEventService.prototype, "errorBadRequest", null);
tslib_1.__decorate([
    InjectTrace(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", error_class_js_1.UnauthorizedError)
], YalcEventService.prototype, "errorUnauthorized", null);
tslib_1.__decorate([
    InjectTrace(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", error_class_js_1.PaymentRequiredError)
], YalcEventService.prototype, "errorPaymentRequired", null);
tslib_1.__decorate([
    InjectTrace(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", error_class_js_1.ForbiddenError)
], YalcEventService.prototype, "errorForbidden", null);
tslib_1.__decorate([
    InjectTrace(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", error_class_js_1.NotFoundError)
], YalcEventService.prototype, "errorNotFound", null);
tslib_1.__decorate([
    InjectTrace(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", error_class_js_1.MethodNotAllowedError)
], YalcEventService.prototype, "errorMethodNotAllowed", null);
tslib_1.__decorate([
    InjectTrace(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", error_class_js_1.NotAcceptableError)
], YalcEventService.prototype, "errorNotAcceptable", null);
tslib_1.__decorate([
    InjectTrace(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", error_class_js_1.ConflictError)
], YalcEventService.prototype, "errorConflict", null);
tslib_1.__decorate([
    InjectTrace(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", error_class_js_1.GoneError)
], YalcEventService.prototype, "errorGone", null);
tslib_1.__decorate([
    InjectTrace(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", error_class_js_1.UnsupportedMediaTypeError)
], YalcEventService.prototype, "errorUnsupportedMediaType", null);
tslib_1.__decorate([
    InjectTrace(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", error_class_js_1.UnprocessableEntityError)
], YalcEventService.prototype, "errorUnprocessableEntity", null);
tslib_1.__decorate([
    InjectTrace(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", error_class_js_1.TooManyRequestsError)
], YalcEventService.prototype, "errorTooManyRequests", null);
tslib_1.__decorate([
    InjectTrace(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", error_class_js_1.InternalServerError)
], YalcEventService.prototype, "errorInternalServerError", null);
tslib_1.__decorate([
    InjectTrace(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", error_class_js_1.NotImplementedError)
], YalcEventService.prototype, "errorNotImplemented", null);
tslib_1.__decorate([
    InjectTrace(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", error_class_js_1.BadGatewayError)
], YalcEventService.prototype, "errorBadGateway", null);
tslib_1.__decorate([
    InjectTrace(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", error_class_js_1.ServiceUnavailableError)
], YalcEventService.prototype, "errorServiceUnavailable", null);
tslib_1.__decorate([
    InjectTrace(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Object)
], YalcEventService.prototype, "errorGatewayTimeout", null);
exports.YalcEventService = YalcEventService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [Object, event_emitter_1.EventEmitter2, Object])
], YalcEventService);
//# sourceMappingURL=event.service.js.map