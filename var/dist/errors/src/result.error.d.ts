import { Result } from '@nest-yalc-2/event-manager/event-result.types.js';
import { IDefaultErrorOptions } from './default.error.js';
export declare const tryCatch: <T>(fn: () => T, options?: IDefaultErrorOptions) => Result<T>;
export declare const tryCatchAsync: <T>(fn: () => Promise<T>, options?: IDefaultErrorOptions) => Promise<Result<T>>;
