import { __decorate, __metadata, __param } from "tslib";
import { Injectable, Inject, } from '@nestjs/common';
import { APP_LOGGER_SERVICE, MODULE_ALIAS_TOKEN, MODULE_OPTION_TOKEN, } from './def.const.js';
import { AppContextService } from './app-context.service.js';
/**
 * This class is used to handle the lifecycle of the app
 * and apply some common logic and checks to all apps
 */
let LifeCycleHandler = class LifeCycleHandler {
    /**
     * We do this in the constructor since onModuleInit doesn't seem to be called
     * when we use 'useFactory' to create the provider
     * @todo: investigate why onModuleInit is not called
     *
     */
    constructor(logger, moduleAlias, appContextService, options) {
        this.logger = logger;
        this.moduleAlias = moduleAlias;
        this.appContextService = appContextService;
        this.options = options;
        this.logger.debug?.(`====================== Init ${this.moduleAlias} ======================`);
        if (this.options?.skipDuplicateAppCheck !== true &&
            this.appContextService.initializedApps.has(this.moduleAlias)) {
            throw new Error(`Cannot initialize the same app (${this.moduleAlias}) twice`);
        }
        this.appContextService.initializedApps.add(this.moduleAlias);
    }
    onModuleInit() { }
    onModuleDestroy() {
        this.logger.debug?.(`====================== Close ${this.moduleAlias} ======================`);
        this.appContextService.initializedApps.delete(this.moduleAlias);
    }
};
LifeCycleHandler = __decorate([
    Injectable(),
    __param(0, Inject(APP_LOGGER_SERVICE)),
    __param(1, Inject(MODULE_ALIAS_TOKEN)),
    __param(2, Inject(AppContextService)),
    __param(3, Inject(MODULE_OPTION_TOKEN)),
    __metadata("design:paramtypes", [Object, String, AppContextService, Object])
], LifeCycleHandler);
export { LifeCycleHandler };
//# sourceMappingURL=life-cycle-handler.service.js.map