import { LogLevel } from '@nestjs/common';
export declare function maskDataInObject(data?: any, paths?: string[], trace?: any): any;
export declare const getEnvLoggerLevelsByContext: (context: string) => LogLevel[];
export declare const getEnvLoggerLevels: (context?: string, def?: LogLevel[]) => LogLevel[];
