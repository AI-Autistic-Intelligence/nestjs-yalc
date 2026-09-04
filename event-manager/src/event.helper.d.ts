import { LogLevelEnum } from '@nestjs-yalc/logger/logger.enum.js';
import { IErrorEventOptions } from './event.js';
export declare function getLogLevelByStatus(statusCode: number): "error" | "log" | "warn";
export declare function getLogLevelByError(error: any): "error" | "log" | "warn" | LogLevelEnum.LOG | LogLevelEnum.ERROR;
export declare function isErrorEvent(options: IErrorEventOptions): boolean;
