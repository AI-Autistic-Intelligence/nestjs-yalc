import { __decorate } from "tslib";
import { APP_ALIAS_TOKEN, APP_EVENT_SERVICE, APP_LOGGER_SERVICE, APP_OPTION_TOKEN, MAIN_APP_CONFIG_SERVICE, MODULE_ALIAS_TOKEN, MODULE_OPTION_TOKEN, SYSTEM_EVENT_SERVICE, SYSTEM_LOGGER_SERVICE, } from './def.const.js';
import { LifeCycleHandler } from './life-cycle-handler.service.js';
import { Global, Logger, Module } from '@nestjs/common';
import { LoggerServiceFactory } from '@nestjs-yalc/logger/logger.service.js';
import { AppConfigService, createAppConfigProvider, getAppConfigToken, getAppEventToken, getAppLoggerToken, } from './app-config.service.js';
import { AppContextModule } from './app-context.module.js';
import { NODE_ENV } from './global.enum.js';
import { ConfigModule, ConfigService, registerAs } from '@nestjs/config';
import Joi from 'joi';
import { EventModule } from '@nestjs-yalc/event-manager/index.js';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { YalcClsModule } from './cls.module.js';
import * as _ from 'lodash-es';
import { getEnvLoggerLevels } from '@nestjs-yalc/logger/logger.helper.js';
const singletonDynamicModules = new Map();
export function registerSingletonDynamicModule(isSingleton, moduleToken, module) {
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
export function getCachedModule(module, isSingleton) {
    if (isSingleton) {
        return singletonDynamicModules.get(module);
    }
    return null;
}
export function envFilePathList(dirname = '.') {
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
        Logger.debug(`Loading env from: ${envDir}, NODE_ENV: ${process.env.NODE_ENV}`);
        envFilePath.push(...envFilePathList(envDir));
    }
    else {
        envFilePath.push(...(Array.isArray(envPath) ? envPath : [envPath]));
    }
    Logger.debug(`Using env file paths: ${envFilePath}`);
    return envFilePath;
}, (envDir = '', envPath = '') => {
    return `${envDir}-${Array.isArray(envPath) ? envPath.join(',') : envPath}`;
});
export const buildEnvFilePath = _buildEnvFilePath;
export function yalcBaseAppModuleMetadataFactory(module, appAlias, options) {
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
            provide: MODULE_ALIAS_TOKEN,
            useValue: appAlias,
        },
        {
            provide: MODULE_OPTION_TOKEN,
            useValue: options,
        },
        {
            provide: APP_EVENT_SERVICE,
            useExisting: 'INTERNAL_APP_EVENT_SERVICE',
        },
        {
            provide: getAppEventToken(appAlias),
            useExisting: 'INTERNAL_APP_EVENT_SERVICE',
        },
    ];
    const logger = options?.logger;
    if (logger) {
        _providers.push((logger === true ? LoggerServiceFactory : logger)(appAlias, APP_LOGGER_SERVICE, appAlias));
        _providers.push({
            provide: getAppLoggerToken(appAlias),
            useExisting: APP_LOGGER_SERVICE,
        });
    }
    const hasConfig = _options.extraConfigs || _options.configFactory;
    if (hasConfig) {
        _providers.push(createAppConfigProvider(appAlias), {
            provide: AppConfigService,
            useExisting: getAppConfigToken(appAlias),
        });
    }
    if (!_options.skipDuplicateAppCheck) {
        _providers.push(LifeCycleHandler);
    }
    if (providers) {
        _providers.push(...providers);
    }
    const _imports = [];
    if (hasConfig) {
        const envFilePath = _buildEnvFilePath(options?.envDir, options?.envPath);
        _imports.push(YalcGlobalStaticModule, (options?.eventModuleClass ?? EventModule).forRootAsync({
            imports: [module],
            loggerProvider: {
                provide: 'INTERNAL_APP_LOGGER_SERVICE',
                useExisting: getAppLoggerToken(appAlias),
            },
            eventServiceToken: 'INTERNAL_APP_EVENT_SERVICE',
            eventEmitter: {
                provide: 'INTERNAL_APP_EVENT_EMITTER',
                useExisting: EventEmitter2,
            },
        }), ConfigModule.forRoot({
            envFilePath,
            load: [
                registerAs(appAlias, async () => {
                    await ConfigModule.envVariablesLoaded;
                    return await (_options.configFactory?.() ?? {});
                }),
                ...(_options.extraConfigs ?? []),
            ],
            validationSchema: Joi.object({
                NODE_ENV: Joi.string()
                    .valid(NODE_ENV.DEVELOPMENT, NODE_ENV.PRODUCTION, NODE_ENV.TEST, NODE_ENV.PIPELINE)
                    .default(NODE_ENV.DEVELOPMENT),
            }),
            validationOptions: {
                allowUnknown: true,
                abortEarly: true,
            },
            isGlobal: true,
        }), YalcClsModule);
    }
    if (imports) {
        _imports.push(...imports);
    }
    const _exports = [getAppEventToken(appAlias)];
    if (options?.logger) {
        _exports.push(getAppLoggerToken(appAlias));
    }
    if (hasConfig) {
        _exports.push(getAppConfigToken(appAlias));
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
export class YalcBaseAppModule {
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
function yalcGlobalStaticModuleFactory() {
    return {
        imports: [
            EventEmitterModule.forRoot({
                global: true,
                maxListeners: 1000,
                wildcard: true,
            }),
        ],
    };
}
let YalcGlobalStaticModule = class YalcGlobalStaticModule {
};
YalcGlobalStaticModule = __decorate([
    Global(),
    Module(yalcGlobalStaticModuleFactory())
], YalcGlobalStaticModule);
export { YalcGlobalStaticModule };
export class YalcDefaultAppModule {
    static forRoot(appAlias, imports, options) {
        const _imports = [
            YalcGlobalStaticModule,
            (options?.eventModuleClass ?? EventModule).forRootAsync({
                loggerProvider: {
                    provide: 'INTERNAL_SYSTEM_LOGGER_SERVICE',
                    useExisting: SYSTEM_LOGGER_SERVICE,
                },
                eventServiceToken: 'INTERNAL_SYSTEM_EVENT_SERVICE',
            }),
            AppContextModule,
            YalcClsModule,
            ...imports,
        ];
        const providers = [
            {
                provide: APP_ALIAS_TOKEN,
                useValue: appAlias,
            },
            {
                provide: APP_OPTION_TOKEN,
                useValue: options,
            },
        ];
        providers.push({
            provide: SYSTEM_LOGGER_SERVICE,
            useFactory: (configService, eventEmitter) => {
                const loggerFactory = options?.logger ?? LoggerServiceFactory;
                return loggerFactory(appAlias, SYSTEM_LOGGER_SERVICE, appAlias, {
                    event: {
                        eventEmitter: eventEmitter,
                    },
                    overrideLoggerLevels: getEnvLoggerLevels(),
                }).useFactory(configService, eventEmitter);
            },
            inject: [MAIN_APP_CONFIG_SERVICE, EventEmitter2],
        }, {
            provide: MAIN_APP_CONFIG_SERVICE,
            useFactory: (config) => {
                return new AppConfigService(config, appAlias);
            },
            inject: [ConfigService],
        }, {
            provide: SYSTEM_EVENT_SERVICE,
            useExisting: 'INTERNAL_SYSTEM_EVENT_SERVICE',
        });
        const exports = [
            APP_OPTION_TOKEN,
            APP_ALIAS_TOKEN,
            SYSTEM_LOGGER_SERVICE,
            SYSTEM_EVENT_SERVICE,
            MAIN_APP_CONFIG_SERVICE,
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
//# sourceMappingURL=base-app-module.helper.js.map