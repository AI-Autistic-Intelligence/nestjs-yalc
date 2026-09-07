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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseAppController = void 0;
const def_const_js_1 = require("@nest-yalc-2/app/def.const.js");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const base_app_service_js_1 = require("./base-app.service.js");
const swagger_1 = require("@nestjs/swagger");
let BaseAppController = class BaseAppController {
    constructor(appService, configService) {
        this.appService = appService;
        this.configService = configService;
    }
    getHello() {
        const conf = this.configService.get(def_const_js_1.CURAPP_CONF_ALIAS);
        return this.appService.getHello(conf?.appName || 'no-name');
    }
    shutdown() {
        const conf = this.configService.get(def_const_js_1.CURAPP_CONF_ALIAS);
        if (conf && (conf.isDev || conf.isTest)) {
            console.log(`Bye bye!`);
            process.exit(0);
        }
    }
};
exports.BaseAppController = BaseAppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], BaseAppController.prototype, "getHello", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        description: 'Shutdown the application, only available on development and test environment',
    }),
    (0, common_1.Get)('shutdown'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BaseAppController.prototype, "shutdown", null);
exports.BaseAppController = BaseAppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [base_app_service_js_1.BaseAppService,
        config_1.ConfigService])
], BaseAppController);
//# sourceMappingURL=base-app.controller.js.map