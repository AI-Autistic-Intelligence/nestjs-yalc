import { type ImprovedLoggerService } from '@node-yalc/logger/logger-abstract.service.js';
import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { type IYalcBaseAppOptions } from './base-app.interface.js';
import { AppContextService } from './app-context.service.js';
/**
 * This class is used to handle the lifecycle of the app
 * and apply some common logic and checks to all apps
 */
export declare class LifeCycleHandler implements OnModuleDestroy, OnModuleInit {
    private readonly logger;
    private readonly moduleAlias;
    private readonly appContextService;
    private readonly options?;
    /**
     * We do this in the constructor since onModuleInit doesn't seem to be called
     * when we use 'useFactory' to create the provider
     * @todo: investigate why onModuleInit is not called
     *
     */
    constructor(logger: ImprovedLoggerService, moduleAlias: string, appContextService: AppContextService, options?: IYalcBaseAppOptions | undefined);
    onModuleInit(): void;
    onModuleDestroy(): void;
}
