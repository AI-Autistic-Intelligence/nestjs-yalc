var EventModule_1;
import { __decorate } from "tslib";
import { Module } from '@nestjs/common';
import { YalcEventService } from './event.service.js';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AppLoggerFactory } from '@nestjs-yalc/logger/logger.factory.js';
import { isProviderObject } from '@nestjs-yalc/utils/nestjs/nest.helper.js';
export const EVENT_LOGGER = 'EVENT_LOGGER';
export const EVENT_EMITTER = 'EVENT_EMITTER';
function isImprovedLoggerService(loggerProvider) {
    return (loggerProvider !== undefined &&
        typeof loggerProvider === 'object' &&
        'isImprovedLoggerService' in loggerProvider &&
        loggerProvider.isImprovedLoggerService === true);
}
export const OPTION_PROVIDER = 'OPTION_PROVIDER';
let EventModule = EventModule_1 = class EventModule {
    static forRootAsync(options, optionProvider) {
        const loggerProviderName = typeof options?.loggerProvider === 'string'
            ? options.loggerProvider
            : options && isProviderObject(options.loggerProvider)
                ? options.loggerProvider.provide
                : EVENT_LOGGER;
        const emitterProviderName = options && isProviderObject(options.eventEmitter)
            ? options.eventEmitter.provide
            : EventEmitter2;
        const eventProviderName = options?.eventServiceToken ?? YalcEventService;
        const imports = options?.imports ?? [];
        const providers = [
            {
                provide: eventProviderName,
                useFactory: (logger, emitter) => {
                    return (options?.eventService?.(logger, emitter, options) ??
                        new YalcEventService(logger, emitter, options));
                },
                inject: [loggerProviderName, emitterProviderName],
            },
        ];
        const loggerProvider = options?.loggerProvider;
        if (isProviderObject(loggerProvider)) {
            providers.push(loggerProvider);
        }
        else {
            providers.push({
                provide: loggerProviderName,
                useFactory: (providedOptions) => {
                    const _options = providedOptions?.logger ?? loggerProvider;
                    if (isImprovedLoggerService(_options)) {
                        return _options;
                    }
                    else {
                        const defaultArgs = {
                            context: 'default',
                        };
                        const args = _options && typeof _options !== 'string' ? _options : defaultArgs;
                        return AppLoggerFactory(args.context, args.loggerLevels, args.loggerType, args.options);
                    }
                },
                inject: [{ token: OPTION_PROVIDER, optional: true }],
            });
        }
        if (options?.eventEmitter) {
            providers.push(options.eventEmitter);
        }
        if (optionProvider) {
            providers.push(optionProvider);
        }
        return {
            module: EventModule_1,
            providers,
            imports,
            exports: [loggerProviderName, eventProviderName],
        };
    }
};
EventModule = EventModule_1 = __decorate([
    Module({})
], EventModule);
export { EventModule };
//# sourceMappingURL=event.module.js.map