"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YalcDefaultAppModule = exports.YalcGlobalStaticModule = exports.YalcBaseAppModule = exports.buildEnvFilePath = void 0;
exports.registerSingletonDynamicModule = registerSingletonDynamicModule;
exports.getCachedModule = getCachedModule;
exports.envFilePathList = envFilePathList;
exports.yalcBaseAppModuleMetadataFactory = yalcBaseAppModuleMetadataFactory;
const def_const_js_1 = require("./def.const.js");
const life_cycle_handler_service_js_1 = require("./life-cycle-handler.service.js");
const common_1 = require("@nestjs/common");
const logger_service_js_1 = require("@nest-yalc-2/logger/logger.service.js");
const app_config_service_js_1 = require("./app-config.service.js");
const app_context_module_js_1 = require("./app-context.module.js");
const global_enum_js_1 = require("./global.enum.js");
const config_1 = require("@nestjs/config");
const joi_1 = __importDefault(require("joi"));
const index_js_1 = require("@nest-yalc-2/event-manager/index.js");
const event_emitter_1 = require("@nestjs/event-emitter");
const cls_module_js_1 = require("./cls.module.js");
const _ = __importStar(require("lodash-es"));
const logger_helper_js_1 = require("@nest-yalc-2/logger/logger.helper.js");
const singletonDynamicModules = new Map();
function registerSingletonDynamicModule(isSingleton, moduleToken, module) {
    if (!isSingleton) {
        return false;
    }
    const cached = singletonDynamicModules.get(moduleToken);
    if (cached) {
        return cached;
    }
    singletonDynamicModules.set(moduleToken, module);
    return singletonDynamicModules.get(moduleToken);
}
function getCachedModule(module, isSingleton) {
    if (isSingleton) {
        return singletonDynamicModules.get(module);
    }
    return null;
}
function envFilePathList(dirname = '.') {
    const envFilePath = [];
    envFilePath.push(`${dirname}/.env`);
    if (process.env.NODE_ENV) {
        envFilePath.push(`${dirname}/.env.${process.env.NODE_ENV}`);
    }
    if (process.env.NODE_ENV !== 'production')
        envFilePath.push(`${dirname}/.env.dist`);
    return envFilePath;
}
const _buildEnvFilePath = _.memoize((envDir, envPath) => {
    const envFilePath = [];
    if (!envPath) {
        common_1.Logger.debug(`Loading env from: ${envDir}, NODE_ENV: ${process.env.NODE_ENV}`);
        envFilePath.push(...envFilePathList(envDir));
    }
    else {
        envFilePath.push(...(Array.isArray(envPath) ? envPath : [envPath]));
    }
    common_1.Logger.debug(`Using env file paths: ${envFilePath}`);
    return envFilePath;
}, (envDir = '', envPath = '') => {
    return `${envDir}-${Array.isArray(envPath) ? envPath.join(',') : envPath}`;
});
exports.buildEnvFilePath = _buildEnvFilePath;
function yalcBaseAppModuleMetadataFactory(module, appAlias, options) {
    const _options = {
        isSingleton: false,
        global: true,
        ...(options ?? {}),
    };
    const { controllers, exports, imports, providers } = _options;
    const cached = getCachedModule(module, _options.isSingleton);
    if (cached) {
        return cached;
    }
    const _providers = [
        {
            provide: def_const_js_1.MODULE_ALIAS_TOKEN,
            useValue: appAlias,
        },
        {
            provide: def_const_js_1.MODULE_OPTION_TOKEN,
            useValue: options,
        },
        {
            provide: def_const_js_1.APP_EVENT_SERVICE,
            useExisting: 'INTERNAL_APP_EVENT_SERVICE',
        },
        {
            provide: (0, app_config_service_js_1.getAppEventToken)(appAlias),
            useExisting: 'INTERNAL_APP_EVENT_SERVICE',
        },
    ];
    const logger = options?.logger;
    if (logger) {
        _providers.push((logger === true ? logger_service_js_1.LoggerServiceFactory : logger)(appAlias, def_const_js_1.APP_LOGGER_SERVICE, appAlias));
        _providers.push({
            provide: (0, app_config_service_js_1.getAppLoggerToken)(appAlias),
            useExisting: def_const_js_1.APP_LOGGER_SERVICE,
        });
    }
    const hasConfig = _options.extraConfigs || _options.configFactory;
    if (hasConfig) {
        _providers.push((0, app_config_service_js_1.createAppConfigProvider)(appAlias), {
            provide: app_config_service_js_1.AppConfigService,
            useExisting: (0, app_config_service_js_1.getAppConfigToken)(appAlias),
        });
    }
    if (!_options.skipDuplicateAppCheck) {
        _providers.push(life_cycle_handler_service_js_1.LifeCycleHandler);
    }
    if (providers) {
        _providers.push(...providers);
    }
    const _imports = [];
    if (hasConfig) {
        const envFilePath = _buildEnvFilePath(options?.envDir, options?.envPath);
        _imports.push(YalcGlobalStaticModule, (options?.eventModuleClass ?? index_js_1.EventModule).forRootAsync({
            imports: [module],
            loggerProvider: {
                provide: 'INTERNAL_APP_LOGGER_SERVICE',
                useExisting: (0, app_config_service_js_1.getAppLoggerToken)(appAlias),
            },
            eventServiceToken: 'INTERNAL_APP_EVENT_SERVICE',
            eventEmitter: {
                provide: 'INTERNAL_APP_EVENT_EMITTER',
                useExisting: event_emitter_1.EventEmitter2,
            },
        }), config_1.ConfigModule.forRoot({
            envFilePath,
            load: [
                (0, config_1.registerAs)(appAlias, async () => {
                    await config_1.ConfigModule.envVariablesLoaded;
                    return await (_options.configFactory?.() ?? {});
                }),
                ...(_options.extraConfigs ?? []),
            ],
            validationSchema: joi_1.default.object({
                NODE_ENV: joi_1.default.string()
                    .valid(global_enum_js_1.NODE_ENV.DEVELOPMENT, global_enum_js_1.NODE_ENV.PRODUCTION, global_enum_js_1.NODE_ENV.TEST, global_enum_js_1.NODE_ENV.PIPELINE)
                    .default(global_enum_js_1.NODE_ENV.DEVELOPMENT),
            }),
            validationOptions: {
                allowUnknown: true,
                abortEarly: true,
            },
            isGlobal: true,
        }), cls_module_js_1.YalcClsModule);
    }
    if (imports) {
        _imports.push(...imports);
    }
    const _exports = [(0, app_config_service_js_1.getAppEventToken)(appAlias)];
    if (options?.logger) {
        _exports.push((0, app_config_service_js_1.getAppLoggerToken)(appAlias));
    }
    if (hasConfig) {
        _exports.push((0, app_config_service_js_1.getAppConfigToken)(appAlias));
    }
    if (exports) {
        _exports.push(...exports);
    }
    const _controllers = [];
    if (controllers) {
        _controllers.push(...controllers.map((c) => {
            c._appAlias = appAlias;
            return c;
        }));
    }
    const config = {
        imports: _imports,
        exports: _exports,
        controllers: _controllers,
        providers: _providers,
    };
    registerSingletonDynamicModule(_options.isSingleton, module, config);
    return config;
}
class YalcBaseAppModule {
    static _forRootStandalone(appAlias, options) {
        return this.assignDynamicProperties(yalcBaseAppModuleMetadataFactory(this, appAlias, {
            isStandalone: true,
            ...this.assignDynamicProperties({}),
            ...options,
        }), options);
    }
    static _forRoot(appAlias, options) {
        return this.assignDynamicProperties(yalcBaseAppModuleMetadataFactory(this, appAlias, {
            isStandalone: false,
            ...this.assignDynamicProperties({}),
            ...options,
        }), options);
    }
    static assignDynamicProperties(config, options) {
        config.module = this;
        config.global = options?.global ?? true;
        config.isSingleton = options?.isSingleton ?? false;
        return config;
    }
}
exports.YalcBaseAppModule = YalcBaseAppModule;
function yalcGlobalStaticModuleFactory() {
    return {
        imports: [
            event_emitter_1.EventEmitterModule.forRoot({
                global: true,
                maxListeners: 1000,
                wildcard: true,
            }),
        ],
    };
}
let YalcGlobalStaticModule = class YalcGlobalStaticModule {
};
exports.YalcGlobalStaticModule = YalcGlobalStaticModule;
exports.YalcGlobalStaticModule = YalcGlobalStaticModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)(yalcGlobalStaticModuleFactory())
], YalcGlobalStaticModule);
class YalcDefaultAppModule {
    static forRoot(appAlias, imports, options) {
        const _imports = [
            YalcGlobalStaticModule,
            (options?.eventModuleClass ?? index_js_1.EventModule).forRootAsync({
                loggerProvider: {
                    provide: 'INTERNAL_SYSTEM_LOGGER_SERVICE',
                    useExisting: def_const_js_1.SYSTEM_LOGGER_SERVICE,
                },
                eventServiceToken: 'INTERNAL_SYSTEM_EVENT_SERVICE',
            }),
            app_context_module_js_1.AppContextModule,
            cls_module_js_1.YalcClsModule,
            ...imports,
        ];
        const providers = [
            {
                provide: def_const_js_1.APP_ALIAS_TOKEN,
                useValue: appAlias,
            },
            {
                provide: def_const_js_1.APP_OPTION_TOKEN,
                useValue: options,
            },
        ];
        providers.push({
            provide: def_const_js_1.SYSTEM_LOGGER_SERVICE,
            useFactory: (configService, eventEmitter) => {
                const loggerFactory = options?.logger ?? logger_service_js_1.LoggerServiceFactory;
                return loggerFactory(appAlias, def_const_js_1.SYSTEM_LOGGER_SERVICE, appAlias, {
                    event: {
                        eventEmitter: eventEmitter,
                    },
                    overrideLoggerLevels: (0, logger_helper_js_1.getEnvLoggerLevels)(),
                }).useFactory(configService, eventEmitter);
            },
            inject: [def_const_js_1.MAIN_APP_CONFIG_SERVICE, event_emitter_1.EventEmitter2],
        }, {
            provide: def_const_js_1.MAIN_APP_CONFIG_SERVICE,
            useFactory: (config) => {
                return new app_config_service_js_1.AppConfigService(config, appAlias);
            },
            inject: [config_1.ConfigService],
        }, {
            provide: def_const_js_1.SYSTEM_EVENT_SERVICE,
            useExisting: 'INTERNAL_SYSTEM_EVENT_SERVICE',
        });
        const exports = [
            def_const_js_1.APP_OPTION_TOKEN,
            def_const_js_1.APP_ALIAS_TOKEN,
            def_const_js_1.SYSTEM_LOGGER_SERVICE,
            def_const_js_1.SYSTEM_EVENT_SERVICE,
            def_const_js_1.MAIN_APP_CONFIG_SERVICE,
        ];
        return {
            exports,
            providers,
            imports: _imports,
            module: YalcDefaultAppModule,
            global: true,
        };
    }
}
exports.YalcDefaultAppModule = YalcDefaultAppModule;
//# sourceMappingURL=base-app-module.helper.js.map