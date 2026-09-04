import { ConsoleLogger } from './logger-console.service';
import { PinoLogger } from './logger-pino.service';
import { Logger as NestLogger } from '@nestjs/common';
import { LoggerTypeEnum, LOG_LEVEL_DEFAULT } from './logger.enum';
export const AppLoggerFactory = (context, loggerLevels = LOG_LEVEL_DEFAULT, loggerType) => {
    let logger;
    switch (loggerType) {
        case LoggerTypeEnum.CONSOLE:
            logger = new ConsoleLogger(context, loggerLevels);
            break;
        case LoggerTypeEnum.PINO:
            logger = new PinoLogger(context, loggerLevels);
            break;
        case LoggerTypeEnum.NEST:
        default:
            logger = new NestLogger(context, {
                timestamp: true,
            });
            NestLogger.overrideLogger(loggerLevels);
            logger.setLogLevels?.(loggerLevels);
            break;
    }
    logger.debug?.(`Using ${loggerType} logger`);
    return logger;
};
//# sourceMappingURL=logger.factory.js.map