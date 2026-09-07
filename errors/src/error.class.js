"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputValidationError = exports.LoginError = exports.AdditionalVerificationNeededError = exports.GatewayTimeoutError = exports.ServiceUnavailableError = exports.BadGatewayError = exports.NotImplementedError = exports.TooManyRequestsError = exports.UnprocessableEntityError = exports.UnsupportedMediaTypeError = exports.GoneError = exports.NotAcceptableError = exports.MethodNotAllowedError = exports.PaymentRequiredError = exports.InternalServerError = exports.ConflictError = exports.NotFoundError = exports.ForbiddenError = exports.UnauthorizedError = exports.BadRequestError = void 0;
const common_1 = require("@nestjs/common");
const error_enum_js_1 = require("./error.enum.js");
const default_error_js_1 = require("./default.error.js");
const axios_1 = require("axios");
function buildArgs(errorName, internalMessage, options) {
    const { cause, description, response, ...restOptions } = options ?? {};
    return [
        internalMessage ? `${errorName}: ${internalMessage}` : errorName,
        { ...(restOptions ?? {}), description },
        response ?? {},
        {
            cause,
            description,
        },
    ];
}
function buildArgsHttpException(errorName, internalMessage, options, errorCode) {
    const args = buildArgs(errorName, internalMessage, options);
    return [
        args[0],
        args[1],
        args[2],
        errorCode ?? common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        typeof args[3] === 'string' ? { description: args[3] } : args[3],
    ];
}
class BadRequestError extends (0, default_error_js_1.DefaultErrorBase)(common_1.BadRequestException) {
    static { this.defaultStatusCode = common_1.HttpStatus.BAD_REQUEST; }
    constructor(internalMessage, options) {
        super(...buildArgs(error_enum_js_1.ErrorsEnum.BAD_REQUEST, internalMessage, options));
    }
}
exports.BadRequestError = BadRequestError;
class UnauthorizedError extends (0, default_error_js_1.DefaultErrorBase)(common_1.UnauthorizedException) {
    static { this.defaultStatusCode = common_1.HttpStatus.UNAUTHORIZED; }
    constructor(internalMessage, options) {
        super(...buildArgs(error_enum_js_1.ErrorsEnum.UNAUTHORIZED, internalMessage, options));
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends (0, default_error_js_1.DefaultErrorBase)(common_1.ForbiddenException) {
    static { this.defaultStatusCode = common_1.HttpStatus.FORBIDDEN; }
    constructor(internalMessage, options) {
        super(...buildArgs(error_enum_js_1.ErrorsEnum.FORBIDDEN, internalMessage, options));
    }
}
exports.ForbiddenError = ForbiddenError;
class NotFoundError extends (0, default_error_js_1.DefaultErrorBase)(common_1.NotFoundException) {
    static { this.defaultStatusCode = common_1.HttpStatus.NOT_FOUND; }
    constructor(internalMessage, options) {
        super(...buildArgs(error_enum_js_1.ErrorsEnum.NOT_FOUND, internalMessage, options));
    }
}
exports.NotFoundError = NotFoundError;
class ConflictError extends (0, default_error_js_1.DefaultErrorBase)(common_1.ConflictException) {
    static { this.defaultStatusCode = common_1.HttpStatus.CONFLICT; }
    constructor(internalMessage, options) {
        super(...buildArgs(error_enum_js_1.ErrorsEnum.CONFLICT, internalMessage, options));
    }
}
exports.ConflictError = ConflictError;
class InternalServerError extends (0, default_error_js_1.DefaultErrorBase)(common_1.InternalServerErrorException) {
    static { this.defaultStatusCode = common_1.HttpStatus.INTERNAL_SERVER_ERROR; }
    constructor(internalMessage, options) {
        super(...buildArgs(error_enum_js_1.ErrorsEnum.INTERNAL_SERVER_ERROR, internalMessage, options));
    }
}
exports.InternalServerError = InternalServerError;
class PaymentRequiredError extends (0, default_error_js_1.DefaultErrorBase)(common_1.HttpException) {
    static { this.defaultStatusCode = common_1.HttpStatus.PAYMENT_REQUIRED; }
    constructor(internalMessage, options) {
        super(...buildArgsHttpException(error_enum_js_1.ErrorsEnum.PAYMENT_REQUIRED, internalMessage, options, PaymentRequiredError.defaultStatusCode));
    }
}
exports.PaymentRequiredError = PaymentRequiredError;
class MethodNotAllowedError extends (0, default_error_js_1.DefaultErrorBase)(common_1.MethodNotAllowedException) {
    static { this.defaultStatusCode = common_1.HttpStatus.METHOD_NOT_ALLOWED; }
    constructor(internalMessage, options) {
        super(...buildArgs(error_enum_js_1.ErrorsEnum.METHOD_NOT_ALLOWED, internalMessage, options));
    }
}
exports.MethodNotAllowedError = MethodNotAllowedError;
class NotAcceptableError extends (0, default_error_js_1.DefaultErrorBase)(common_1.NotAcceptableException) {
    static { this.defaultStatusCode = common_1.HttpStatus.NOT_ACCEPTABLE; }
    constructor(internalMessage, options) {
        super(...buildArgs(error_enum_js_1.ErrorsEnum.NOT_ACCEPTABLE, internalMessage, options));
    }
}
exports.NotAcceptableError = NotAcceptableError;
class GoneError extends (0, default_error_js_1.DefaultErrorBase)(common_1.GoneException) {
    static { this.defaultStatusCode = common_1.HttpStatus.GONE; }
    constructor(internalMessage, options) {
        super(...buildArgs(error_enum_js_1.ErrorsEnum.GONE, internalMessage, options));
    }
}
exports.GoneError = GoneError;
class UnsupportedMediaTypeError extends (0, default_error_js_1.DefaultErrorBase)(common_1.UnsupportedMediaTypeException) {
    static { this.defaultStatusCode = common_1.HttpStatus.UNSUPPORTED_MEDIA_TYPE; }
    constructor(internalMessage, options) {
        super(...buildArgs(error_enum_js_1.ErrorsEnum.UNSUPPORTED_MEDIA_TYPE, internalMessage, options));
    }
}
exports.UnsupportedMediaTypeError = UnsupportedMediaTypeError;
class UnprocessableEntityError extends (0, default_error_js_1.DefaultErrorBase)(common_1.UnprocessableEntityException) {
    static { this.defaultStatusCode = common_1.HttpStatus.UNPROCESSABLE_ENTITY; }
    constructor(internalMessage, options) {
        super(...buildArgs(error_enum_js_1.ErrorsEnum.UNPROCESSABLE_ENTITY, internalMessage, options));
    }
}
exports.UnprocessableEntityError = UnprocessableEntityError;
class TooManyRequestsError extends (0, default_error_js_1.DefaultErrorBase)(common_1.HttpException) {
    static { this.defaultStatusCode = common_1.HttpStatus.TOO_MANY_REQUESTS; }
    constructor(internalMessage, options) {
        super(...buildArgsHttpException(error_enum_js_1.ErrorsEnum.TOO_MANY_REQUESTS, internalMessage, options, common_1.HttpStatus.TOO_MANY_REQUESTS));
    }
}
exports.TooManyRequestsError = TooManyRequestsError;
class NotImplementedError extends (0, default_error_js_1.DefaultErrorBase)(common_1.NotImplementedException) {
    static { this.defaultStatusCode = common_1.HttpStatus.NOT_IMPLEMENTED; }
    constructor(internalMessage, options) {
        super(...buildArgs(error_enum_js_1.ErrorsEnum.NOT_IMPLEMENTED, internalMessage, options));
    }
}
exports.NotImplementedError = NotImplementedError;
class BadGatewayError extends (0, default_error_js_1.DefaultErrorBase)(common_1.BadGatewayException) {
    static { this.defaultStatusCode = common_1.HttpStatus.BAD_GATEWAY; }
    constructor(internalMessage, options) {
        super(...buildArgs(error_enum_js_1.ErrorsEnum.BAD_GATEWAY, internalMessage, options));
    }
}
exports.BadGatewayError = BadGatewayError;
class ServiceUnavailableError extends (0, default_error_js_1.DefaultErrorBase)(common_1.ServiceUnavailableException) {
    static { this.defaultStatusCode = common_1.HttpStatus.SERVICE_UNAVAILABLE; }
    constructor(internalMessage, options) {
        super(...buildArgs(error_enum_js_1.ErrorsEnum.SERVICE_UNAVAILABLE, internalMessage, options));
    }
}
exports.ServiceUnavailableError = ServiceUnavailableError;
class GatewayTimeoutError extends (0, default_error_js_1.DefaultErrorBase)(common_1.GatewayTimeoutException) {
    static { this.defaultStatusCode = common_1.HttpStatus.GATEWAY_TIMEOUT; }
    constructor(internalMessage, options) {
        super(...buildArgs(error_enum_js_1.ErrorsEnum.GATEWAY_TIMEOUT, internalMessage, options));
    }
}
exports.GatewayTimeoutError = GatewayTimeoutError;
class AdditionalVerificationNeededError extends (0, default_error_js_1.DefaultErrorBase)(common_1.HttpException) {
    static { this.defaultStatusCode = axios_1.HttpStatusCode.UnavailableForLegalReasons; }
    constructor(internalMessage, options) {
        super(...buildArgsHttpException(error_enum_js_1.ErrorsEnum.UNAVAILABLE_FOR_LEGAL_REASONS, internalMessage, options, AdditionalVerificationNeededError.defaultStatusCode));
    }
}
exports.AdditionalVerificationNeededError = AdditionalVerificationNeededError;
class LoginError extends (0, default_error_js_1.DefaultErrorBase)(common_1.UnauthorizedException) {
    static { this.defaultStatusCode = common_1.HttpStatus.UNAUTHORIZED; }
    constructor(internalMessage, options) {
        super(...buildArgs(error_enum_js_1.ErrorsEnum.BAD_LOGIN, internalMessage, options));
    }
}
exports.LoginError = LoginError;
class InputValidationError extends (0, default_error_js_1.DefaultErrorBase)(common_1.BadRequestException) {
    static { this.defaultStatusCode = common_1.HttpStatus.BAD_REQUEST; }
    constructor(internalMessage, options) {
        super(...buildArgs(error_enum_js_1.ErrorsEnum.INVALID_VALUE, internalMessage, options));
    }
}
exports.InputValidationError = InputValidationError;
//# sourceMappingURL=error.class.js.map