import type { LogLevel } from '@nestjs/common';
import type { LoggerTypeEnum } from '@nest-yalc-2/logger/logger.enum.js';
export interface IServiceConf {
    appName: string;
    loggerType: LoggerTypeEnum | string;
    logLevels: LogLevel[];
    logContextLevels?: {
        [key: string]: LogLevel[];
    };
    domain?: string;
    host: string;
    port: number;
    isDev: boolean;
    isTest: boolean;
    isPipeline: boolean;
    isProduction: boolean;
    env: typeof process.env.NODE_ENV;
    apiPrefix?: string;
    basePath?: string;
    operationPrefix?: string;
}
