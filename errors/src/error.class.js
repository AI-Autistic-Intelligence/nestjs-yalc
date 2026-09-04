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
exports.InputValidationError = exports.LoginError = exports.AdditionalVerificationNeededError = exports.GatewayTimeoutError = exports.ServiceUnavailableError = exports.BadGatewayError = exports.NotImplementedError = exports.TooManyRequestsError = exports.UnprocessableEntityError = exports.UnsupportedMediaTypeError = exports.GoneError = exports.NotAcceptableError = exports.MethodNotAllowedError = exports.PaymentRequiredError = exports.InternalServerError = exports.ConflictError = exports.NotFoundError = exports.ForbiddenError = exports.UnauthorizedError = exports.BadRequestError = void 0;
const common_1 = require("@nestjs/common");
const error_enum_js_1 = require("./error.enum.js");
const default_error_js_1 = require("./default.error.js");
const axios_1 = require("axios");
function buildArgs(errorName, internalMessage, options) {
    const _a = options !== null && options !== void 0 ? options : {}, { cause, description, response } = _a, restOptions = __rest(_a, ["cause", "description", "response"]);
    return [
        internalMessage ? `${errorName}: ${internalMessage}` : errorName,
        Object.assign(Object.assign({}, (restOptions !== null && restOptions !== void 0 ? restOptions : {})), { description }),
        response !== null && response !== void 0 ? response : {},
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
        errorCode !== null && errorCode !== void 0 ? errorCode : common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        typeof args[3] === 'string' ? { description: args[3] } : args[3],
    ];
}
class BadRequestError extends (0, default_error_js_1.DefaultErrorBase)(common_1.BadRequestException) {
    constructor(internalMessage, options) {
        super(...buildArgs(error_enum_js_1.ErrorsEnum.BAD_REQUEST, internalMessage, options));
    }
}
exports.BadRequestError = BadRequestError;
BadRequestError.defaultStatusCode = common_1.HttpStatus.BAD_REQUEST;
class UnauthorizedError extends (0, default_error_js_1.DefaultErrorBase)(common_1.UnauthorizedException) {
    constructor(internalMessage, options) {
        super(...buildArgs(error_enum_js_1.ErrorsEnum.UNAUTHORIZED, internalMessage, options));
    }
}
exports.UnauthorizedError = UnauthorizedError;
UnauthorizedError.defaultStatusCode = common_1.HttpStatus.UNAUTHORIZED;
class ForbiddenError extends (0, default_error_js_1.DefaultErrorBase)(common_1.ForbiddenException) {
    constructor(internalMessage, options) {
        super(...buildArgs(error_enum_js_1.ErrorsEnum.FORBIDDEN, internalMessage, options));
    }
}
exports.ForbiddenError = ForbiddenError;
ForbiddenError.defaultStatusCode = common_1.HttpStatus.FORBIDDEN;
class NotFoundError extends (0, default_error_js_1.DefaultErrorBase)(common_1.NotFoundException) {
    constructor(internalMessage, options) {
        super(...buildArgs(error_enum_js_1.ErrorsEnum.NOT_FOUND, internalMessage, options));
    }
}
exports.NotFoundError = NotFoundError;
NotFoundError.defaultStatusCode = common_1.HttpStatus.NOT_FOUND;
class ConflictError extends (0, default_error_js_1.DefaultErrorBase)(common_1.ConflictException) {
    constructor(internalMessage, options) {
        super(...buildArgs(error_enum_js_1.ErrorsEnum.CONFLICT, internalMessage, options));
    }
}
exports.ConflictError = ConflictError;
ConflictError.defaultStatusCode = common_1.HttpStatus.CONFLICT;
class InternalServerError extends (0, default_error_js_1.DefaultErrorBase)(common_1.InternalServerErrorException) {
    constructor(internalMessage, options) {
        super(...buildArgs(error_enum_js_1.ErrorsEnum.INTERNAL_SERVER_ERROR, internalMessage, options));
    }
}
exports.InternalServerError = InternalServerError;
InternalServerError.defaultStatusCode = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
class PaymentRequiredError extends (0, default_error_js_1.DefaultErrorBase)(common_1.HttpException) {
    constructor(internalMessage, options) {
        super(...buildArgsHttpException(error_enum_js_1.ErrorsEnum.PAYMENT_REQUIRED, internalMessage, options, PaymentRequiredError.defaultStatusCode));
    }
}
exports.PaymentRequiredError = PaymentRequiredError;
PaymentRequiredError.defaultStatusCode = common_1.HttpStatus.PAYMENT_REQUIRED;
class MethodNotAllowedError extends (0, default_error_js_1.DefaultErrorBase)(common_1.MethodNotAllowedException) {
    constructor(internalMessage, options) {
        super(...buildArgs(error_enum_js_1.ErrorsEnum.METHOD_NOT_ALLOWED, internalMessage, options));
    }
}
exports.MethodNotAllowedError = MethodNotAllowedError;
MethodNotAllowedError.defaultStatusCode = common_1.HttpStatus.METHOD_NOT_ALLOWED;
class NotAcceptableError extends (0, default_error_js_1.DefaultErrorBase)(common_1.NotAcceptableException) {
    constructor(internalMessage, options) {
        super(...buildArgs(error_enum_js_1.ErrorsEnum.NOT_ACCEPTABLE, internalMessage, options));
    }
}
exports.NotAcceptableError = NotAcceptableError;
NotAcceptableError.defaultStatusCode = common_1.HttpStatus.NOT_ACCEPTABLE;
class GoneError extends (0, default_error_js_1.DefaultErrorBase)(common_1.GoneException) {
    constructor(internalMessage, options) {
        super(...buildArgs(error_enum_js_1.ErrorsEnum.GONE, internalMessage, options));
    }
}
exports.GoneError = GoneError;
GoneError.defaultStatusCode = common_1.HttpStatus.GONE;
class UnsupportedMediaTypeError extends (0, default_error_js_1.DefaultErrorBase)(common_1.UnsupportedMediaTypeException) {
    constructor(internalMessage, options) {
        super(...buildArgs(error_enum_js_1.ErrorsEnum.UNSUPPORTED_MEDIA_TYPE, internalMessage, options));
    }
}
exports.UnsupportedMediaTypeError = UnsupportedMediaTypeError;
UnsupportedMediaTypeError.defaultStatusCode = common_1.HttpStatus.UNSUPPORTED_MEDIA_TYPE;
class UnprocessableEntityError extends (0, default_error_js_1.DefaultErrorBase)(common_1.UnprocessableEntityException) {
    constructor(internalMessage, options) {
        super(...buildArgs(error_enum_js_1.ErrorsEnum.UNPROCESSABLE_ENTITY, internalMessage, options));
    }
}
exports.UnprocessableEntityError = UnprocessableEntityError;
UnprocessableEntityError.defaultStatusCode = common_1.HttpStatus.UNPROCESSABLE_ENTITY;
class TooManyRequestsError extends (0, default_error_js_1.DefaultErrorBase)(common_1.HttpException) {
    constructor(internalMessage, options) {
        super(...buildArgsHttpException(error_enum_js_1.ErrorsEnum.TOO_MANY_REQUESTS, internalMessage, options, common_1.HttpStatus.TOO_MANY_REQUESTS));
    }
}
exports.TooManyRequestsError = TooManyRequestsError;
TooManyRequestsError.defaultStatusCode = common_1.HttpStatus.TOO_MANY_REQUESTS;
class NotImplementedError extends (0, default_error_js_1.DefaultErrorBase)(common_1.NotImplementedException) {
    constructor(internalMessage, options) {
        super(...buildArgs(error_enum_js_1.ErrorsEnum.NOT_IMPLEMENTED, internalMessage, options));
    }
}
exports.NotImplementedError = NotImplementedError;
NotImplementedError.defaultStatusCode = common_1.HttpStatus.NOT_IMPLEMENTED;
class BadGatewayError extends (0, default_error_js_1.DefaultErrorBase)(common_1.BadGatewayException) {
    constructor(internalMessage, options) {
        super(...buildArgs(error_enum_js_1.ErrorsEnum.BAD_GATEWAY, internalMessage, options));
    }
}
exports.BadGatewayError = BadGatewayError;
BadGatewayError.defaultStatusCode = common_1.HttpStatus.BAD_GATEWAY;
class ServiceUnavailableError extends (0, default_error_js_1.DefaultErrorBase)(common_1.ServiceUnavailableException) {
    constructor(internalMessage, options) {
        super(...buildArgs(error_enum_js_1.ErrorsEnum.SERVICE_UNAVAILABLE, internalMessage, options));
    }
}
exports.ServiceUnavailableError = ServiceUnavailableError;
ServiceUnavailableError.defaultStatusCode = common_1.HttpStatus.SERVICE_UNAVAILABLE;
class GatewayTimeoutError extends (0, default_error_js_1.DefaultErrorBase)(common_1.GatewayTimeoutException) {
    constructor(internalMessage, options) {
        super(...buildArgs(error_enum_js_1.ErrorsEnum.GATEWAY_TIMEOUT, internalMessage, options));
    }
}
exports.GatewayTimeoutError = GatewayTimeoutError;
GatewayTimeoutError.defaultStatusCode = common_1.HttpStatus.GATEWAY_TIMEOUT;
class AdditionalVerificationNeededError extends (0, default_error_js_1.DefaultErrorBase)(common_1.HttpException) {
    constructor(internalMessage, options) {
        super(...buildArgsHttpException(error_enum_js_1.ErrorsEnum.UNAVAILABLE_FOR_LEGAL_REASONS, internalMessage, options, AdditionalVerificationNeededError.defaultStatusCode));
    }
}
exports.AdditionalVerificationNeededError = AdditionalVerificationNeededError;
AdditionalVerificationNeededError.defaultStatusCode = axios_1.HttpStatusCode.UnavailableForLegalReasons;
class LoginError extends (0, default_error_js_1.DefaultErrorBase)(common_1.UnauthorizedException) {
    constructor(internalMessage, options) {
        super(...buildArgs(error_enum_js_1.ErrorsEnum.BAD_LOGIN, internalMessage, options));
    }
}
exports.LoginError = LoginError;
LoginError.defaultStatusCode = common_1.HttpStatus.UNAUTHORIZED;
class InputValidationError extends (0, default_error_js_1.DefaultErrorBase)(common_1.BadRequestException) {
    constructor(internalMessage, options) {
        super(...buildArgs(error_enum_js_1.ErrorsEnum.INVALID_VALUE, internalMessage, options));
    }
}
exports.InputValidationError = InputValidationError;
InputValidationError.defaultStatusCode = common_1.HttpStatus.BAD_REQUEST;
//# sourceMappingURL=error.class.js.map