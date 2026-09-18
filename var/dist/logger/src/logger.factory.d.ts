import { LogLevel } from '@nestjs/common';
import type { IImprovedLoggerOptions, ImprovedLoggerService } from '@node-yalc/logger/logger-abstract.service';
export declare const AppLoggerFactory: (context: string, loggerLevels?: LogLevel[], loggerType?: string, options?: IImprovedLoggerOptions) => ImprovedLoggerService;
