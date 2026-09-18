"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LifeCycleHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const def_const_js_1 = require("./def.const.js");
const app_context_service_js_1 = require("./app-context.service.js");
let LifeCycleHandler = class LifeCycleHandler {
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
exports.LifeCycleHandler = LifeCycleHandler;
exports.LifeCycleHandler = LifeCycleHandler = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(def_const_js_1.APP_LOGGER_SERVICE)),
    tslib_1.__param(1, (0, common_1.Inject)(def_const_js_1.MODULE_ALIAS_TOKEN)),
    tslib_1.__param(2, (0, common_1.Inject)(app_context_service_js_1.AppContextService)),
    tslib_1.__param(3, (0, common_1.Inject)(def_const_js_1.MODULE_OPTION_TOKEN)),
    tslib_1.__metadata("design:paramtypes", [Object, String, app_context_service_js_1.AppContextService, Object])
], LifeCycleHandler);
//# sourceMappingURL=life-cycle-handler.service.js.map