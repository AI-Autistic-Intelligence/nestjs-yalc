import { DynamicModule, INestApplicationContext, LoggerService, Type } from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import type { IServiceConf } from './conf.type.js';
import { ICreateOptions, INestCreateOptions } from './app-bootstrap.helper.js';
import { EventModule } from '@nest-yalc-2/event-manager/event.module.js';
import { LoggerServiceFactory } from '@nest-yalc-2/logger/logger.service.js';
import { FastifyInstance } from 'fastify';
export interface IGlobalOptions {
    extraImports?: NonNullable<DynamicModule['imports']>;
    eventModuleClass?: typeof EventModule;
    logger?: typeof LoggerServiceFactory;
    /**
     * This is used to avoid bootstrapping a multi-server app
     */
    skipMultiServerCheck?: boolean;
}
export declare const getBootstrappedApps: () => Set<any>;
export declare const getMainBootstrappedApp: <TApp extends BaseAppBootstrap<NestFastifyApplication | INestApplicationContext>>() => TApp | null;
export declare abstract class BaseAppBootstrap<TAppType extends NestFastifyApplication | INestApplicationContext> {
    protected appAlias: string;
    protected readonly appModule: Type<any>;
    protected app?: TAppType;
    protected loggerService: LoggerService;
    protected module: Type<any> | DynamicModule;
    protected isClosed: boolean;
    constructor(appAlias: string, appModule: Type<any>, options?: {
        globalsOptions?: IGlobalOptions;
    });
    initApp(options?: {
        createOptions?: INestCreateOptions;
        fastifyInstance?: FastifyInstance;
    }): Promise<this>;
    setApp(app: TAppType): this;
    /**
     * This method is used to cleanup the app and remove it from the global set of bootstrapped apps
     */
    closeCleanup(): void;
    isAppClosed(): boolean;
    getAppAlias(): string;
    getConf(): IServiceConf | undefined;
    getApp(): TAppType;
    closeApp(): Promise<void>;
    cleanup(): Promise<void>;
    /**
     *
     * @returns The main module of the business logic (the one that is passed in the constructor)
     */
    getAppModule(): Type<any>;
    /**
     *
     * @returns The global module that is used to bootstrap the app (YalcDefaultAppModule)
     */
    getModule(): Type<any> | DynamicModule;
    applyBootstrapGlobals(_options?: ICreateOptions): Promise<this>;
}
