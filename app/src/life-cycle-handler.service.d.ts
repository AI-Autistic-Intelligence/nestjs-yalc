import { type ImprovedLoggerService } from '@nest-yalc-2/logger/logger-abstract.service.js';
import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { type IYalcBaseAppOptions } from './base-app.interface.js';
import { AppContextService } from './app-context.service.js';
export declare class LifeCycleHandler implements OnModuleDestroy, OnModuleInit {
    private readonly logger;
    private readonly moduleAlias;
    private readonly appContextService;
    private readonly options?;
    constructor(logger: ImprovedLoggerService, moduleAlias: string, appContextService: AppContextService, options?: IYalcBaseAppOptions | undefined);
    onModuleInit(): void;
    onModuleDestroy(): void;
}
