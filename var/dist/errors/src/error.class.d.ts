import { BadRequestException, UnauthorizedException, ForbiddenException, NotFoundException, ConflictException, InternalServerErrorException, HttpException, HttpStatus, MethodNotAllowedException, NotAcceptableException, GoneException, UnsupportedMediaTypeException, UnprocessableEntityException, NotImplementedException, BadGatewayException, ServiceUnavailableException, GatewayTimeoutException } from '@nestjs/common';
import { IDefaultErrorBaseOptions } from './default.error.js';
declare const BadRequestError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof BadRequestException>;
export declare class BadRequestError extends BadRequestError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const UnauthorizedError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof UnauthorizedException>;
export declare class UnauthorizedError extends UnauthorizedError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const ForbiddenError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof ForbiddenException>;
export declare class ForbiddenError extends ForbiddenError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const NotFoundError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof NotFoundException>;
export declare class NotFoundError extends NotFoundError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const ConflictError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof ConflictException>;
export declare class ConflictError extends ConflictError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const InternalServerError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof InternalServerErrorException>;
export declare class InternalServerError extends InternalServerError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const PaymentRequiredError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof HttpException>;
export declare class PaymentRequiredError extends PaymentRequiredError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const MethodNotAllowedError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof MethodNotAllowedException>;
export declare class MethodNotAllowedError extends MethodNotAllowedError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const NotAcceptableError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof NotAcceptableException>;
export declare class NotAcceptableError extends NotAcceptableError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const GoneError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof GoneException>;
export declare class GoneError extends GoneError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const UnsupportedMediaTypeError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof UnsupportedMediaTypeException>;
export declare class UnsupportedMediaTypeError extends UnsupportedMediaTypeError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const UnprocessableEntityError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof UnprocessableEntityException>;
export declare class UnprocessableEntityError extends UnprocessableEntityError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const TooManyRequestsError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof HttpException>;
export declare class TooManyRequestsError extends TooManyRequestsError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const NotImplementedError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof NotImplementedException>;
export declare class NotImplementedError extends NotImplementedError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const BadGatewayError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof BadGatewayException>;
export declare class BadGatewayError extends BadGatewayError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const ServiceUnavailableError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof ServiceUnavailableException>;
export declare class ServiceUnavailableError extends ServiceUnavailableError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const GatewayTimeoutError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof GatewayTimeoutException>;
export declare class GatewayTimeoutError extends GatewayTimeoutError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const AdditionalVerificationNeededError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof HttpException>;
export declare class AdditionalVerificationNeededError extends AdditionalVerificationNeededError_base {
    static defaultStatusCode: any;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const LoginError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof UnauthorizedException>;
export declare class LoginError extends LoginError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const InputValidationError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof BadRequestException>;
export declare class InputValidationError extends InputValidationError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
export {};
