import { LogLevel } from '@nestjs/common';
import { type IEventOptions, type IErrorEventOptions, type IErrorEventOptionsRequired } from './event.js';
import { type ImprovedLoggerService } from '@nest-yalc-2/logger';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventNameFormatter } from './emitter.js';
import { DefaultError } from '@nest-yalc-2/errors/default.error.js';
import { BadGatewayError, BadRequestError, ConflictError, ForbiddenError, GatewayTimeoutError, GoneError, InternalServerError, MethodNotAllowedError, NotAcceptableError, NotFoundError, NotImplementedError, PaymentRequiredError, ServiceUnavailableError, TooManyRequestsError, UnauthorizedError, UnprocessableEntityError, UnsupportedMediaTypeError } from '@nest-yalc-2/errors/error.class.js';
import type { ClassType } from '@nest-yalc-2/types/globals.d.js';
import { Err } from 'neverthrow';
import { type PromiseResult } from './event-result.types.js';
export interface IEventServiceOptions<TFormatter extends EventNameFormatter = EventNameFormatter> {
    formatter?: TFormatter;
}
export type IErrorBasedMethodOptions<TErrorOptions> = Omit<TErrorOptions, 'errorClass'>;
export declare function injectTrace<T extends IEventOptions>(options?: T): T | undefined;
export declare class YalcEventService<TFormatter extends EventNameFormatter = EventNameFormatter, TEventOptions extends IEventOptions<TFormatter> = IEventOptions<TFormatter>, TErrorOptions extends IErrorEventOptions<TFormatter> = IErrorEventOptions<TFormatter>> {
    protected readonly loggerService: ImprovedLoggerService;
    protected readonly eventEmitter: EventEmitter2;
    protected options?: any | undefined;
    constructor(loggerService: ImprovedLoggerService, eventEmitter: EventEmitter2, options?: any | undefined);
    get logger(): ImprovedLoggerService;
    get emitter(): EventEmitter2;
    emit: (eventName: Parameters<TFormatter> | string, options?: TEventOptions) => any;
    emitAsync: (eventName: Parameters<TFormatter> | string, options?: TEventOptions) => Promise<any>;
    protected _error<TOpts extends IErrorEventOptions<TFormatter>>(eventName: Parameters<TFormatter> | string, options?: TOpts): TOpts extends {
        errorClass: false;
    } ? TOpts extends {
        await: true;
    } ? Promise<boolean | any[] | undefined> : boolean | any[] | undefined : TOpts extends {
        await: true;
    } ? Promise<(TOpts extends infer T ? T extends TOpts ? T extends {
        errorClass: infer T_1;
    } ? T_1 extends boolean ? DefaultError : InstanceType<any> : never : never : never) & {}> : (TOpts extends {
        errorClass: infer T_1;
    } ? T_1 extends boolean ? DefaultError : InstanceType<any> : never) & {};
    logAsync(eventName: Parameters<TFormatter> | string, options?: TEventOptions): Promise<any>;
    protected _errorAsync<TOpts extends IErrorEventOptions<TFormatter>>(eventName: Parameters<TFormatter> | string, options?: TOpts): Promise<TOpts extends {
        errorClass: false;
    } ? any : (TOpts extends {
        errorClass: infer T;
    } ? T extends boolean ? DefaultError : InstanceType<any> : never) & {}>;
    error(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): boolean | any[] | undefined;
    errorResult(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): Err<never, DefaultError>;
    errorFromFn<T>(eventName: Parameters<TFormatter> | string, cb: () => PromiseLike<T> | T, options?: IErrorBasedMethodOptions<TErrorOptions>): PromiseResult<T>;
    errorAsync(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): Promise<any>;
    warnAsync(eventName: Parameters<TFormatter> | string, options?: TEventOptions): Promise<any>;
    debugAsync(eventName: Parameters<TFormatter> | string, options?: TEventOptions): Promise<any>;
    verboseAsync(eventName: Parameters<TFormatter> | string, options?: TEventOptions): Promise<any>;
    log(eventName: Parameters<TFormatter> | string, options?: TEventOptions): any;
    warn(eventName: Parameters<TFormatter> | string, options?: TEventOptions): any;
    debug(eventName: Parameters<TFormatter> | string, options?: TEventOptions): any;
    verbose(eventName: Parameters<TFormatter> | string, options?: TEventOptions): any;
    errorHttp(eventName: Parameters<TFormatter> | string, errorCode: number, options?: TErrorOptions): any;
    errorHttpResult(eventName: Parameters<TFormatter> | string, errorCode: number, options?: TErrorOptions): Err<never, DefaultError>;
    errorForward<TError extends DefaultError>(eventName: Parameters<TFormatter> | string, error: Error | TError, options?: IErrorBasedMethodOptions<TErrorOptions>): TError;
    errorForwardResult<TError extends DefaultError>(eventName: Parameters<TFormatter> | string, error: Error | TError, options?: IErrorBasedMethodOptions<TErrorOptions>): Err<never, TError>;
    errorForwardFromFn<T, E extends DefaultError = DefaultError>(eventName: Parameters<TFormatter> | string, cb: () => PromiseLike<T> | T, options?: IErrorBasedMethodOptions<TErrorOptions>): PromiseResult<T, E>;
    errorBadRequest(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): BadRequestError;
    errorBadRequestResult(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): Err<never, BadRequestError>;
    errorBadRequestFromFn<T>(eventName: Parameters<TFormatter> | string, cb: () => PromiseLike<T> | T, options?: IErrorBasedMethodOptions<TErrorOptions>): PromiseResult<T, BadRequestError>;
    errorUnauthorized(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): UnauthorizedError;
    errorUnauthorizedResult(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): Err<never, UnauthorizedError>;
    errorUnauthorizedFromFn<T>(eventName: Parameters<TFormatter> | string, cb: () => PromiseLike<T> | T, options?: IErrorBasedMethodOptions<TErrorOptions>): PromiseResult<T, UnauthorizedError>;
    errorPaymentRequired(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): PaymentRequiredError;
    errorForbidden(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): ForbiddenError;
    errorForbiddenResult(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): Err<never, ForbiddenError>;
    errorForbiddenFromFn<T>(eventName: Parameters<TFormatter> | string, cb: () => PromiseLike<T> | T, options?: IErrorBasedMethodOptions<TErrorOptions>): PromiseResult<T, ForbiddenError>;
    errorNotFound(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): NotFoundError;
    errorNotFoundResult(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): Err<never, NotFoundError>;
    errorNotFoundFromFn<T>(eventName: Parameters<TFormatter> | string, cb: () => PromiseLike<T> | T, options?: IErrorBasedMethodOptions<TErrorOptions>): PromiseResult<T, NotFoundError>;
    errorMethodNotAllowed(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): MethodNotAllowedError;
    errorMethodNotAllowedResult(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): Err<never, MethodNotAllowedError>;
    errorMethodNotAllowedFromFn<T>(eventName: Parameters<TFormatter> | string, cb: () => PromiseLike<T> | T, options?: IErrorBasedMethodOptions<TErrorOptions>): PromiseResult<T, MethodNotAllowedError>;
    errorNotAcceptable(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): NotAcceptableError;
    errorNotAcceptableResult(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): Err<never, NotAcceptableError>;
    errorNotAcceptableFromFn<T>(eventName: Parameters<TFormatter> | string, cb: () => PromiseLike<T> | T, options?: IErrorBasedMethodOptions<TErrorOptions>): PromiseResult<T, NotAcceptableError>;
    errorConflict(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): ConflictError;
    errorConflictResult(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): Err<never, ConflictError>;
    errorConflictFromFn<T>(eventName: Parameters<TFormatter> | string, cb: () => PromiseLike<T> | T, options?: IErrorBasedMethodOptions<TErrorOptions>): PromiseResult<T, ConflictError>;
    errorGone(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): GoneError;
    errorGoneResult(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): Err<never, GoneError>;
    errorGoneFromFn<T>(eventName: Parameters<TFormatter> | string, cb: () => PromiseLike<T> | T, options?: IErrorBasedMethodOptions<TErrorOptions>): PromiseResult<T, GoneError>;
    errorUnsupportedMediaType(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): UnsupportedMediaTypeError;
    errorUnsupportedMediaTypeResult(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): Err<never, UnsupportedMediaTypeError>;
    errorUnsupportedMediaTypeFromFn<T>(eventName: Parameters<TFormatter> | string, cb: () => PromiseLike<T> | T, options?: IErrorBasedMethodOptions<TErrorOptions>): PromiseResult<T, UnsupportedMediaTypeError>;
    errorUnprocessableEntity(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): UnprocessableEntityError;
    errorUnprocessableEntityResult(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): Err<never, UnprocessableEntityError>;
    errorUnprocessableEntityFromFn<T>(eventName: Parameters<TFormatter> | string, cb: () => PromiseLike<T> | T, options?: IErrorBasedMethodOptions<TErrorOptions>): PromiseResult<T, UnprocessableEntityError>;
    errorTooManyRequests(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): TooManyRequestsError;
    errorTooManyRequestsResult(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): Err<never, TooManyRequestsError>;
    errorTooManyRequestsFromFn<T>(eventName: Parameters<TFormatter> | string, cb: () => PromiseLike<T> | T, options?: IErrorBasedMethodOptions<TErrorOptions>): PromiseResult<T, TooManyRequestsError>;
    errorInternalServerError(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): InternalServerError;
    errorInternalServerErrorResult(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): Err<never, InternalServerError>;
    errorInternalServerErrorFromFn<T>(eventName: Parameters<TFormatter> | string, cb: () => PromiseLike<T> | T, options?: IErrorBasedMethodOptions<TErrorOptions>): PromiseResult<T, InternalServerError>;
    errorNotImplemented(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): NotImplementedError;
    errorNotImplementedResult(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): Err<never, NotImplementedError>;
    errorNotImplementedFromFn<T>(eventName: Parameters<TFormatter> | string, cb: () => PromiseLike<T> | T, options?: IErrorBasedMethodOptions<TErrorOptions>): PromiseResult<T, NotImplementedError>;
    errorBadGateway(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): BadGatewayError;
    errorBadGatewayResult(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): Err<never, BadGatewayError>;
    errorBadGatewayFromFn<T>(eventName: Parameters<TFormatter> | string, cb: () => PromiseLike<T> | T, options?: IErrorBasedMethodOptions<TErrorOptions>): PromiseResult<T, BadGatewayError>;
    errorServiceUnavailable(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): ServiceUnavailableError;
    errorServiceUnavailableResult(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): Err<never, ServiceUnavailableError>;
    errorServiceUnavailableFromFn<T>(eventName: Parameters<TFormatter> | string, cb: () => PromiseLike<T> | T, options?: IErrorBasedMethodOptions<TErrorOptions>): PromiseResult<T, ServiceUnavailableError>;
    errorGatewayTimeout(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): any;
    errorGatewayTimeoutResult(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): Err<never, GatewayTimeoutError>;
    errorGatewayTimeoutFromFn<T>(eventName: Parameters<TFormatter> | string, cb: () => PromiseLike<T> | T, options?: IErrorBasedMethodOptions<TErrorOptions>): PromiseResult<T, GatewayTimeoutError>;
    protected getLoggerLevelByOptions(options: IErrorEventOptions<TFormatter>): "error" | "log" | "warn" | import("@nest-yalc-2/logger/logger.enum.js").LogLevelEnum.LOG | import("@nest-yalc-2/logger/logger.enum.js").LogLevelEnum.ERROR;
    protected applyLoggerLevel<TOpt extends IEventOptions<TFormatter> | IErrorEventOptions<TFormatter>>(options: TOpt, level: LogLevel): TOpt;
    protected applyLoggerLevelByStatus<TOpts extends IErrorEventOptions<TFormatter>>(options: TOpts, error: DefaultError): TOpts;
    protected applyLoggerLevelByError<TOpts extends IErrorEventOptions<TFormatter> | IEventOptions<TFormatter>>(options: TOpts): TOpts;
    protected applyCause<TOpts extends IErrorEventOptions<TFormatter>>(cause: unknown, options?: TOpts): TOpts;
    protected buildOptions<TOpts extends IErrorEventOptions<TFormatter> | IEventOptions<TFormatter>>(options?: TOpts): TOpts;
    protected buildErrorOptions<TErrorClass extends DefaultError = DefaultError>(options?: IErrorEventOptions<TFormatter>, defaultClass?: ClassType<TErrorClass> | TErrorClass | boolean): IErrorEventOptionsRequired<TFormatter, TErrorClass>;
}
