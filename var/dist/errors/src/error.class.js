import { BadRequestException, UnauthorizedException, ForbiddenException, NotFoundException, ConflictException, InternalServerErrorException, HttpException, HttpStatus, MethodNotAllowedException, NotAcceptableException, GoneException, UnsupportedMediaTypeException, UnprocessableEntityException, NotImplementedException, BadGatewayException, ServiceUnavailableException, GatewayTimeoutException, } from '@nestjs/common';
import { ErrorsEnum } from './error.enum.js';
import { DefaultErrorBase } from './default.error.js';
import { HttpStatusCode } from 'axios';
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
        errorCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
        typeof args[3] === 'string' ? { description: args[3] } : args[3],
    ];
}
export class BadRequestError extends DefaultErrorBase(BadRequestException) {
    static { this.defaultStatusCode = HttpStatus.BAD_REQUEST; }
    constructor(internalMessage, options) {
        super(...buildArgs(ErrorsEnum.BAD_REQUEST, internalMessage, options));
    }
}
export class UnauthorizedError extends DefaultErrorBase(UnauthorizedException) {
    static { this.defaultStatusCode = HttpStatus.UNAUTHORIZED; }
    constructor(internalMessage, options) {
        super(...buildArgs(ErrorsEnum.UNAUTHORIZED, internalMessage, options));
    }
}
export class ForbiddenError extends DefaultErrorBase(ForbiddenException) {
    static { this.defaultStatusCode = HttpStatus.FORBIDDEN; }
    constructor(internalMessage, options) {
        super(...buildArgs(ErrorsEnum.FORBIDDEN, internalMessage, options));
    }
}
export class NotFoundError extends DefaultErrorBase(NotFoundException) {
    static { this.defaultStatusCode = HttpStatus.NOT_FOUND; }
    constructor(internalMessage, options) {
        super(...buildArgs(ErrorsEnum.NOT_FOUND, internalMessage, options));
    }
}
export class ConflictError extends DefaultErrorBase(ConflictException) {
    static { this.defaultStatusCode = HttpStatus.CONFLICT; }
    constructor(internalMessage, options) {
        super(...buildArgs(ErrorsEnum.CONFLICT, internalMessage, options));
    }
}
export class InternalServerError extends DefaultErrorBase(InternalServerErrorException) {
    static { this.defaultStatusCode = HttpStatus.INTERNAL_SERVER_ERROR; }
    constructor(internalMessage, options) {
        super(...buildArgs(ErrorsEnum.INTERNAL_SERVER_ERROR, internalMessage, options));
    }
}
export class PaymentRequiredError extends DefaultErrorBase(HttpException) {
    static { this.defaultStatusCode = HttpStatus.PAYMENT_REQUIRED; }
    constructor(internalMessage, options) {
        super(...buildArgsHttpException(ErrorsEnum.PAYMENT_REQUIRED, internalMessage, options, PaymentRequiredError.defaultStatusCode));
    }
}
export class MethodNotAllowedError extends DefaultErrorBase(MethodNotAllowedException) {
    static { this.defaultStatusCode = HttpStatus.METHOD_NOT_ALLOWED; }
    constructor(internalMessage, options) {
        super(...buildArgs(ErrorsEnum.METHOD_NOT_ALLOWED, internalMessage, options));
    }
}
export class NotAcceptableError extends DefaultErrorBase(NotAcceptableException) {
    static { this.defaultStatusCode = HttpStatus.NOT_ACCEPTABLE; }
    constructor(internalMessage, options) {
        super(...buildArgs(ErrorsEnum.NOT_ACCEPTABLE, internalMessage, options));
    }
}
export class GoneError extends DefaultErrorBase(GoneException) {
    static { this.defaultStatusCode = HttpStatus.GONE; }
    constructor(internalMessage, options) {
        super(...buildArgs(ErrorsEnum.GONE, internalMessage, options));
    }
}
export class UnsupportedMediaTypeError extends DefaultErrorBase(UnsupportedMediaTypeException) {
    static { this.defaultStatusCode = HttpStatus.UNSUPPORTED_MEDIA_TYPE; }
    constructor(internalMessage, options) {
        super(...buildArgs(ErrorsEnum.UNSUPPORTED_MEDIA_TYPE, internalMessage, options));
    }
}
export class UnprocessableEntityError extends DefaultErrorBase(UnprocessableEntityException) {
    static { this.defaultStatusCode = HttpStatus.UNPROCESSABLE_ENTITY; }
    constructor(internalMessage, options) {
        super(...buildArgs(ErrorsEnum.UNPROCESSABLE_ENTITY, internalMessage, options));
    }
}
export class TooManyRequestsError extends DefaultErrorBase(HttpException) {
    static { this.defaultStatusCode = HttpStatus.TOO_MANY_REQUESTS; }
    constructor(internalMessage, options) {
        super(...buildArgsHttpException(ErrorsEnum.TOO_MANY_REQUESTS, internalMessage, options, HttpStatus.TOO_MANY_REQUESTS));
    }
}
export class NotImplementedError extends DefaultErrorBase(NotImplementedException) {
    static { this.defaultStatusCode = HttpStatus.NOT_IMPLEMENTED; }
    constructor(internalMessage, options) {
        super(...buildArgs(ErrorsEnum.NOT_IMPLEMENTED, internalMessage, options));
    }
}
export class BadGatewayError extends DefaultErrorBase(BadGatewayException) {
    static { this.defaultStatusCode = HttpStatus.BAD_GATEWAY; }
    constructor(internalMessage, options) {
        super(...buildArgs(ErrorsEnum.BAD_GATEWAY, internalMessage, options));
    }
}
export class ServiceUnavailableError extends DefaultErrorBase(ServiceUnavailableException) {
    static { this.defaultStatusCode = HttpStatus.SERVICE_UNAVAILABLE; }
    constructor(internalMessage, options) {
        super(...buildArgs(ErrorsEnum.SERVICE_UNAVAILABLE, internalMessage, options));
    }
}
export class GatewayTimeoutError extends DefaultErrorBase(GatewayTimeoutException) {
    static { this.defaultStatusCode = HttpStatus.GATEWAY_TIMEOUT; }
    constructor(internalMessage, options) {
        super(...buildArgs(ErrorsEnum.GATEWAY_TIMEOUT, internalMessage, options));
    }
}
export class AdditionalVerificationNeededError extends DefaultErrorBase(HttpException) {
    static { this.defaultStatusCode = HttpStatusCode.UnavailableForLegalReasons; }
    constructor(internalMessage, options) {
        super(...buildArgsHttpException(ErrorsEnum.UNAVAILABLE_FOR_LEGAL_REASONS, internalMessage, options, AdditionalVerificationNeededError.defaultStatusCode));
    }
}
export class LoginError extends DefaultErrorBase(UnauthorizedException) {
    static { this.defaultStatusCode = HttpStatus.UNAUTHORIZED; }
    constructor(internalMessage, options) {
        super(...buildArgs(ErrorsEnum.BAD_LOGIN, internalMessage, options));
    }
}
export class InputValidationError extends DefaultErrorBase(BadRequestException) {
    static { this.defaultStatusCode = HttpStatus.BAD_REQUEST; }
    constructor(internalMessage, options) {
        super(...buildArgs(ErrorsEnum.INVALID_VALUE, internalMessage, options));
    }
}
//# sourceMappingURL=error.class.js.map