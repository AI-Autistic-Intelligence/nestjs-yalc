"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerServiceFactory = void 0;
const logger_factory_1 = require("@node-yalc/logger/logger.factory");
const app_config_service_js_1 = require("@nest-yalc-2/app/app-config.service.js");
const event_emitter_1 = require("@nestjs/event-emitter");
const LoggerServiceFactory = (appAlias, provide, context, options = {}) => ({
    provide: provide,
    useFactory: (config, eventEmitter) => {
        const conf = config.values;
        const loggerType = conf.loggerType;
        const loggerLevels = options.overrideLoggerLevels ??
            (conf.logContextLevels?.[context] || conf.logLevels || []);
        return (0, logger_factory_1.AppLoggerFactory)(context, loggerLevels, loggerType, {
            event: options.event !== false
                ? {
                    eventEmitter: options.event?.eventEmitter ?? eventEmitter,
                }
                : false,
        });
    },
    inject: [(0, app_config_service_js_1.getAppConfigToken)(appAlias), event_emitter_1.EventEmitter2],
});
exports.LoggerServiceFactory = LoggerServiceFactory;
//# sourceMappingURL=logger.service.js.map