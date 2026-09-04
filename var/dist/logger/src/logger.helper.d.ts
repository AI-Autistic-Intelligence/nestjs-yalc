import { LogLevel } from '@nestjs/common';
export declare function getEnvLoggerLevels(): LogLevel[];
export declare function maskDataInObject(data: any, masks?: string[], trace?: any): any;
