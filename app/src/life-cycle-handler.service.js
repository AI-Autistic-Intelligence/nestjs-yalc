"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LifeCycleHandler = void 0;
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
exports.LifeCycleHandler = LifeCycleHandler = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(def_const_js_1.APP_LOGGER_SERVICE)),
    __param(1, (0, common_1.Inject)(def_const_js_1.MODULE_ALIAS_TOKEN)),
    __param(2, (0, common_1.Inject)(app_context_service_js_1.AppContextService)),
    __param(3, (0, common_1.Inject)(def_const_js_1.MODULE_OPTION_TOKEN)),
    __metadata("design:paramtypes", [Object, String, app_context_service_js_1.AppContextService, Object])
], LifeCycleHandler);
//# sourceMappingURL=life-cycle-handler.service.js.map