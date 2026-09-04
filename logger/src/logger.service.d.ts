import { FactoryProvider } from '@nestjs/common';
import type { IImprovedLoggerOptions, ImprovedLoggerService } from '@nestjs-yalc/logger/logger-abstract.service.js';
export declare const LoggerServiceFactory: (appAlias: string, provide: string, context: string, options?: IImprovedLoggerOptions) => FactoryProvider<ImprovedLoggerService>;
