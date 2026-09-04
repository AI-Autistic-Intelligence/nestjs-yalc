import { LogLevel } from '@nestjs/common';
import type { IImprovedLoggerOptions, ImprovedLoggerService } from './logger-abstract.service.js';
export declare const AppLoggerFactory: (context: string, loggerLevels?: LogLevel[], loggerType?: string, options?: IImprovedLoggerOptions) => ImprovedLoggerService;
