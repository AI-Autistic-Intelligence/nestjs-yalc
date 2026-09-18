import { AppLoggerFactory } from '@node-yalc/logger/logger.factory';
import { FactoryProvider, LogLevel } from '@nestjs/common';
import type {
  IImprovedLoggerOptions,
  ImprovedLoggerService,
} from '@node-yalc/logger/logger-abstract.service';
import { IServiceConf } from '@nest-yalc-2/app/conf.type.js';
import {
  AppConfigService,
  getAppConfigToken,
} from '@nest-yalc-2/app/app-config.service.js';
import { EventEmitter2 } from '@nestjs/event-emitter';

export const LoggerServiceFactory = (
  appAlias: string,
  provide: string,
  context: string,
  options: IImprovedLoggerOptions = {},
): FactoryProvider<ImprovedLoggerService> => ({
  provide: provide,
  useFactory: (
    config: AppConfigService<IServiceConf>,
    eventEmitter: EventEmitter2,
  ): ImprovedLoggerService => {
    const conf = config.values;
    const loggerType = conf.loggerType;
    const loggerLevels: LogLevel[] =
      options.overrideLoggerLevels ??
      (conf.logContextLevels?.[context] || conf.logLevels || []);

    return AppLoggerFactory(context, loggerLevels, loggerType, {
      event:
        /* istanbul ignore next */
        options.event !== false
          ? {
              eventEmitter: options.event?.eventEmitter ?? eventEmitter,
            }
          : false,
    });
  },
  inject: [getAppConfigToken(appAlias), EventEmitter2],
});
