import { EventModule } from '@nest-yalc-2/event-manager/event.module.js';
import { LoggerServiceFactory } from '@nest-yalc-2/logger/index.js';
import { ClassType } from '@nest-yalc-2/types/globals.d.js';
import { DynamicModule, ModuleMetadata } from '@nestjs/common';
import { ConfigFactory, ConfigObject, ConfigFactoryKeyHost } from '@nestjs/config';
export interface ISingletonOption {
    isSingleton?: boolean;
}
export interface ISingletonDynamicModule extends ISingletonOption, DynamicModule {
}
export interface IYalcBaseAppOptions extends Partial<ISingletonDynamicModule> {
    configFactory?: ConfigFactory<ConfigObject>;
    extraConfigs?: (ConfigFactory<ConfigObject> & ConfigFactoryKeyHost<ReturnType<ConfigFactory<ConfigObject>>>)[];
    envPath?: string | string[];
    envDir?: string;
    migrations?: ClassType[];
    skipDuplicateAppCheck?: boolean;
    logger?: boolean | typeof LoggerServiceFactory;
    eventModuleClass?: typeof EventModule;
}
export type BaseAppStaticOptions = Omit<IYalcBaseAppOptions, 'module'>;
export interface IYalcBaseDynamicModule extends ISingletonDynamicModule {
    imports: NonNullable<DynamicModule['imports']>;
    exports: NonNullable<DynamicModule['exports']>;
    controllers: NonNullable<DynamicModule['controllers']>;
    providers: NonNullable<DynamicModule['providers']>;
}
export interface IYalcBaseStaticModule extends ModuleMetadata {
    imports: NonNullable<DynamicModule['imports']>;
    exports: NonNullable<DynamicModule['exports']>;
    controllers: NonNullable<DynamicModule['controllers']>;
    providers: NonNullable<DynamicModule['providers']>;
}
