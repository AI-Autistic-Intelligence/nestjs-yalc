"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var EventModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventModule = exports.OPTION_PROVIDER = exports.EVENT_EMITTER = exports.EVENT_LOGGER = void 0;
const common_1 = require("@nestjs/common");
const event_service_js_1 = require("./event.service.js");
const event_emitter_1 = require("@nestjs/event-emitter");
const logger_factory_js_1 = require("@nestjs-yalc/logger/logger.factory.js");
const nest_helper_js_1 = require("@nestjs-yalc/utils/nestjs/nest.helper.js");
exports.EVENT_LOGGER = 'EVENT_LOGGER';
exports.EVENT_EMITTER = 'EVENT_EMITTER';
function isImprovedLoggerService(loggerProvider) {
    return (loggerProvider !== undefined &&
        typeof loggerProvider === 'object' &&
        'isImprovedLoggerService' in loggerProvider &&
        loggerProvider.isImprovedLoggerService === true);
}
exports.OPTION_PROVIDER = 'OPTION_PROVIDER';
let EventModule = EventModule_1 = class EventModule {
    static forRootAsync(options, optionProvider) {
        var _a, _b;
        const loggerProviderName = typeof (options === null || options === void 0 ? void 0 : options.loggerProvider) === 'string'
            ? options.loggerProvider
            : options && (0, nest_helper_js_1.isProviderObject)(options.loggerProvider)
                ? options.loggerProvider.provide
                : exports.EVENT_LOGGER;
        const emitterProviderName = options && (0, nest_helper_js_1.isProviderObject)(options.eventEmitter)
            ? options.eventEmitter.provide
            : event_emitter_1.EventEmitter2;
        const eventProviderName = (_a = options === null || options === void 0 ? void 0 : options.eventServiceToken) !== null && _a !== void 0 ? _a : event_service_js_1.YalcEventService;
        const imports = (_b = options === null || options === void 0 ? void 0 : options.imports) !== null && _b !== void 0 ? _b : [];
        const providers = [
            {
                provide: eventProviderName,
                useFactory: (logger, emitter) => {
                    var _a, _b;
                    return ((_b = (_a = options === null || options === void 0 ? void 0 : options.eventService) === null || _a === void 0 ? void 0 : _a.call(options, logger, emitter, options)) !== null && _b !== void 0 ? _b : new event_service_js_1.YalcEventService(logger, emitter, options));
                },
                inject: [loggerProviderName, emitterProviderName],
            },
        ];
        const loggerProvider = options === null || options === void 0 ? void 0 : options.loggerProvider;
        if ((0, nest_helper_js_1.isProviderObject)(loggerProvider)) {
            providers.push(loggerProvider);
        }
        else {
            providers.push({
                provide: loggerProviderName,
                useFactory: (providedOptions) => {
                    var _a;
                    const _options = (_a = providedOptions === null || providedOptions === void 0 ? void 0 : providedOptions.logger) !== null && _a !== void 0 ? _a : loggerProvider;
                    if (isImprovedLoggerService(_options)) {
                        return _options;
                    }
                    else {
                        const defaultArgs = {
                            context: 'default',
                        };
                        const args = _options && typeof _options !== 'string' ? _options : defaultArgs;
                        return (0, logger_factory_js_1.AppLoggerFactory)(args.context, args.loggerLevels, args.loggerType, args.options);
                    }
                },
                inject: [{ token: exports.OPTION_PROVIDER, optional: true }],
            });
        }
        if (options === null || options === void 0 ? void 0 : options.eventEmitter) {
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
exports.EventModule = EventModule;
exports.EventModule = EventModule = EventModule_1 = __decorate([
    (0, common_1.Module)({})
], EventModule);
//# sourceMappingURL=event.module.js.map