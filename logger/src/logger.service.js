"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerServiceFactory = void 0;
const logger_factory_js_1 = require("@nestjs-yalc/logger/logger.factory.js");
const app_config_service_js_1 = require("@nestjs-yalc/app/app-config.service.js");
const event_emitter_1 = require("@nestjs/event-emitter");
const LoggerServiceFactory = (appAlias, provide, context, options = {}) => ({
    provide: provide,
    useFactory: (config, eventEmitter) => {
        var _a, _b, _c, _d;
        const conf = config.values;
        const loggerType = conf.loggerType;
        const loggerLevels = (_a = options.overrideLoggerLevels) !== null && _a !== void 0 ? _a : (((_b = conf.logContextLevels) === null || _b === void 0 ? void 0 : _b[context]) || conf.logLevels || []);
        return (0, logger_factory_js_1.AppLoggerFactory)(context, loggerLevels, loggerType, {
            event: options.event !== false
                ? {
                    eventEmitter: (_d = (_c = options.event) === null || _c === void 0 ? void 0 : _c.eventEmitter) !== null && _d !== void 0 ? _d : eventEmitter,
                }
                : false,
        });
    },
    inject: [(0, app_config_service_js_1.getAppConfigToken)(appAlias), event_emitter_1.EventEmitter2],
});
exports.LoggerServiceFactory = LoggerServiceFactory;
//# sourceMappingURL=logger.service.js.map