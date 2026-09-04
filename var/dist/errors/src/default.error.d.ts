import type { ImprovedLoggerService } from '@nestjs-yalc/logger/logger-abstract.service.js';
import { ClassType, Mixin } from '@nestjs-yalc/types/globals.d.js';
import { HttpException, HttpExceptionOptions, HttpStatus, LogLevel } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare const ON_DEFAULT_ERROR_EVENT = "onDefaultError";
export interface ISharedErrorProperties {
    data?: any;
    config?: any;
    internalMessage?: string;
    description?: string;
    eventName?: string;
}
export interface IHttpExceptionArguments {
    response?: Partial<IBetterResponseInterface>;
    errorCode?: HttpStatus | number;
}
export interface IHttpExceptionParentArguments extends Omit<IHttpExceptionArguments, 'errorCode'> {
}
export interface IErrorPayload extends ISharedErrorProperties {
    response?: Partial<IBetterResponseInterface>;
    cause?: IFormattedCause;
    errorName?: string;
}
export interface IErrorEventPayload extends IErrorPayload {
    message?: string;
    stack?: string;
}
export interface ILogErrorPayload extends Omit<IErrorEventPayload, keyof IHttpExceptionArguments> {
    [key: string]: any;
}
type loggerOptionType = {
    instance?: ImprovedLoggerService;
    level?: LogLevel;
} | false;
export interface IAbstractDefaultError extends Omit<HttpException, 'cause' | 'message'>, Omit<IErrorEventPayload, 'response'> {
    logger?: loggerOptionType;
    eventEmitter?: EventEmitter2;
    getResponse(): IBetterResponseInterface;
    getInternalMessage(): string | undefined;
    getDescription(): string | undefined;
    getEventPayload(): IErrorEventPayload;
    setErrorInfo(options: IAbstractDefaultErrorOptions & {
        response?: Partial<IBetterResponseInterface>;
    }): void;
    mergeErrorInfo(info: IAbstractDefaultErrorOptions & {
        response?: Partial<IBetterResponseInterface>;
        cause?: Error;
    }): void;
}
export interface IAbstractDefaultErrorConstructor<TErrorClass extends ClassType<HttpException> = ClassType<HttpException>> {
    new (options: IAbstractDefaultErrorOptions, ...args: ConstructorParameters<TErrorClass>): IAbstractDefaultError;
}
export interface IAbstractDefaultErrorOptions extends ISharedErrorProperties {
    masks?: string[];
    logger?: loggerOptionType | boolean;
    eventEmitter?: EventEmitter2 | boolean;
    eventName?: string;
    stack?: string;
}
export interface IDefaultErrorBaseOptions extends Omit<IAbstractDefaultErrorOptions, 'internalMessage'>, HttpExceptionOptions, IHttpExceptionParentArguments {
}
export interface IDefaultErrorOptions extends Omit<IAbstractDefaultErrorOptions, 'internalMessage'>, HttpExceptionOptions, IHttpExceptionArguments {
}
export interface IBetterResponseInterface {
    error?: string;
    statusCode: number;
    statusCodeDescription: string;
    message: string;
    [key: string]: any;
}
export declare const newDefaultError: <T extends ClassType<HttpException> = typeof HttpException>(base: T, options: IAbstractDefaultErrorOptions, ...args: ConstructorParameters<T>) => IAbstractDefaultError;
interface IFormattedCause {
    message?: string;
    stack?: string;
    parentCause?: IFormattedCause;
    [key: string]: any;
}
export declare function formatCause(error?: any): IFormattedCause | undefined;
export declare const DefaultErrorMixin: <T extends ClassType<HttpException> = ClassType<HttpException>>(base?: T) => IAbstractDefaultErrorConstructor<T>;
export type DefaultErrorMixin = Mixin<typeof DefaultErrorMixin>;
export interface IDefaultErrorBaseConstructor<T extends ClassType<HttpException> = ClassType<HttpException>> {
    new (internalMessage?: string, options?: Omit<IAbstractDefaultErrorOptions, 'internalMessage'>, ...args: ConstructorParameters<T>): IAbstractDefaultError;
}
export declare function DefaultErrorBase<T extends ClassType<HttpException> = ClassType<HttpException>>(base?: T): IDefaultErrorBaseConstructor<T>;
declare const DefaultError_base: IDefaultErrorBaseConstructor<typeof HttpException>;
export declare class DefaultError extends DefaultError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorOptions);
}
export declare const errorToDefaultError: (error: Error | HttpException | DefaultError, options?: IDefaultErrorOptions) => DefaultError;
export declare function isDefaultErrorMixin(error: any): error is IAbstractDefaultError;
export declare function isDefaultErrorMixinClass(error: any): error is typeof DefaultError;
export {};
