import { LogLevel } from '@nestjs/common';
import { type ImprovedLoggerService } from '@nest-yalc-2/logger/logger-abstract.service.js';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DefaultError, IErrorPayload } from '@nest-yalc-2/errors/default.error.js';
import { EventNameFormatter } from './emitter.js';
import { ClassType, InstanceType } from '@nest-yalc-2/types/globals.d.js';
interface IEventEmitterOptions<TFormatter extends EventNameFormatter = EventNameFormatter> {
    emitter?: EventEmitter2;
    formatter?: TFormatter;
    await?: boolean;
}
export interface IEventAliasOptions {
    eventName: string;
    await: boolean;
}
export interface IDataInfo {
    [key: string]: any;
    eventName: string;
}
export interface IEventPayload {
    message?: string;
    data?: IDataInfo;
    eventName: string;
    config?: any;
    level?: LogLevel;
    errorInfo?: IErrorPayload | null;
}
export interface IEventOptions<TFormatter extends EventNameFormatter = EventNameFormatter> {
    data?: any;
    config?: any;
    mask?: string[];
    event?: IEventEmitterOptions<TFormatter> | false;
    message?: string;
    stack?: string;
    logger?: {
        instance?: ImprovedLoggerService;
        level?: LogLevel;
    } | LogLevel | false;
    eventAliases?: (string | IEventAliasOptions)[];
}
export interface IErrorEventOptions<TFormatter extends EventNameFormatter = EventNameFormatter, TErrorClass extends DefaultError = DefaultError> extends IEventOptions<TFormatter>, Omit<IErrorPayload, 'internalMessage' | 'data' | 'cause'> {
    errorClass?: ClassType<TErrorClass> | TErrorClass | boolean;
    cause?: Error;
}
export interface IErrorEventOptionsRequired<TFormatter extends EventNameFormatter = EventNameFormatter, TErrorClass extends DefaultError = DefaultError> extends Omit<IErrorEventOptions<TFormatter, TErrorClass>, 'errorClass'>, Required<Pick<IErrorEventOptions<TFormatter, TErrorClass>, 'errorClass'>> {
}
export declare function applyAwaitOption<TFormatter extends EventNameFormatter = EventNameFormatter, TOpts extends IErrorEventOptions<TFormatter> | IEventOptions<TFormatter> = IEventOptions<TFormatter>>(options?: TOpts): TOpts;
type ReturnType<T> = T extends {
    errorClass: false;
} ? boolean | any[] | undefined : Error | DefaultError;
type PickError<TFormatter extends EventNameFormatter = EventNameFormatter, TOpt extends IErrorEventOptions<TFormatter> = IErrorEventOptions<TFormatter>> = NonNullable<TOpt extends {
    errorClass: infer T;
} ? T extends boolean ? DefaultError : InstanceType<any> : never>;
type eventErrorReturnType<TFormatter extends EventNameFormatter = EventNameFormatter, TOpt extends IErrorEventOptions<TFormatter> = IErrorEventOptions<TFormatter>> = TOpt extends {
    errorClass: false;
} ? TOpt extends {
    await: true;
} ? Promise<boolean | any[] | undefined> : boolean | any[] | undefined : TOpt extends {
    await: true;
} ? Promise<PickError<TFormatter, TOpt>> : PickError<TFormatter, TOpt>;
type eventErrorReturnTypeAsync<TFormatter extends EventNameFormatter = EventNameFormatter, TOpt extends IErrorEventOptions<TFormatter> = IErrorEventOptions<TFormatter>> = Promise<TOpt extends {
    errorClass: false;
} ? boolean | any | undefined : PickError<TFormatter, TOpt>>;
export declare function isErrorOptions(options?: IEventOptions | IErrorEventOptions): options is IErrorEventOptions;
export declare function event<TFormatter extends EventNameFormatter = EventNameFormatter, TOption extends IEventOptions<TFormatter> | IErrorEventOptions<TFormatter> = IEventOptions<TFormatter>>(eventName: Parameters<TFormatter> | string, options?: TOption): Promise<ReturnType<TOption>> | ReturnType<TOption>;
export declare function getLoggerOption(level: LogLevel, options?: IEventOptions): false | {
    instance?: ImprovedLoggerService;
    level: LogLevel;
};
export declare function resolveLoggerOption(logger: IEventOptions['logger']): false | {
    instance?: ImprovedLoggerService;
    level?: LogLevel;
} | undefined;
export declare function eventLogAsync<TFormatter extends EventNameFormatter = EventNameFormatter>(eventName: Parameters<TFormatter> | string, options?: IEventOptions<TFormatter>): Promise<any>;
export declare function eventLog<TFormatter extends EventNameFormatter = EventNameFormatter>(eventName: Parameters<TFormatter> | string, options?: IEventOptions<TFormatter>): any;
export declare function eventErrorAsync<TFormatter extends EventNameFormatter = EventNameFormatter, TOption extends IErrorEventOptions<TFormatter> = IEventOptions<TFormatter>>(eventName: Parameters<TFormatter> | string, options?: TOption): eventErrorReturnTypeAsync<TFormatter, TOption>;
export declare function eventError<TFormatter extends EventNameFormatter = EventNameFormatter, TOption extends IErrorEventOptions<TFormatter> = IErrorEventOptions<TFormatter>>(eventName: Parameters<TFormatter> | string, options?: TOption): eventErrorReturnType<TFormatter, TOption>;
export declare function eventWarnAsync<TFormatter extends EventNameFormatter = EventNameFormatter>(eventName: Parameters<TFormatter> | string, options?: IEventOptions<TFormatter>): Promise<any>;
export declare function eventWarn<TFormatter extends EventNameFormatter = EventNameFormatter>(eventName: Parameters<TFormatter> | string, options?: IEventOptions<TFormatter>): any;
export declare function eventDebugAsync<TFormatter extends EventNameFormatter = EventNameFormatter>(eventName: Parameters<TFormatter> | string, options?: IEventOptions<TFormatter>): Promise<any>;
export declare function eventDebug<TFormatter extends EventNameFormatter = EventNameFormatter>(eventName: Parameters<TFormatter> | string, options?: IEventOptions<TFormatter>): any;
export declare function eventVerboseAsync<TFormatter extends EventNameFormatter = EventNameFormatter>(eventName: Parameters<TFormatter> | string, options?: IEventOptions<TFormatter>): Promise<any>;
export declare function eventVerbose<TFormatter extends EventNameFormatter = EventNameFormatter>(eventName: Parameters<TFormatter> | string, options?: IEventOptions<TFormatter>): any;
export {};
