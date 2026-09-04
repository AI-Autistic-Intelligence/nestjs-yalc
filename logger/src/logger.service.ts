import { AppLoggerFactory } from './logger.factory.js';
import { LogLevel } from '@nestjs/common';

export function LoggerServiceFactory(
  context: string,
  loggerLevels?: LogLevel[],
  loggerType?: string,
) {
  return AppLoggerFactory(context, loggerLevels, loggerType);
}
