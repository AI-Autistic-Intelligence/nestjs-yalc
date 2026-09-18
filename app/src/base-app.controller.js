"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseAppController = void 0;
const tslib_1 = require("tslib");
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
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", String)
], BaseAppController.prototype, "getHello", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        description: 'Shutdown the application, only available on development and test environment',
    }),
    (0, common_1.Get)('shutdown'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], BaseAppController.prototype, "shutdown", null);
exports.BaseAppController = BaseAppController = tslib_1.__decorate([
    (0, common_1.Controller)(),
    tslib_1.__metadata("design:paramtypes", [base_app_service_js_1.BaseAppService,
        config_1.ConfigService])
], BaseAppController);
//# sourceMappingURL=base-app.controller.js.map