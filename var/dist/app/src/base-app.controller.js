import { __decorate, __metadata } from "tslib";
import { CURAPP_CONF_ALIAS } from '@nestjs-yalc/app/def.const.js';
import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseAppService } from './base-app.service.js';
import { ApiOperation } from '@nestjs/swagger';
let BaseAppController = class BaseAppController {
    constructor(appService, configService) {
        this.appService = appService;
        this.configService = configService;
    }
    getHello() {
        const conf = this.configService.get(CURAPP_CONF_ALIAS);
        return this.appService.getHello(conf?.appName || 'no-name');
    }
    shutdown() {
        const conf = this.configService.get(CURAPP_CONF_ALIAS);
        if (conf && (conf.isDev || conf.isTest)) {
            console.log(`Bye bye!`);
            process.exit(0);
        }
    }
};
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], BaseAppController.prototype, "getHello", null);
__decorate([
    ApiOperation({
        description: 'Shutdown the application, only available on development and test environment',
    }),
    Get('shutdown'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BaseAppController.prototype, "shutdown", null);
BaseAppController = __decorate([
    Controller(),
    __metadata("design:paramtypes", [BaseAppService,
        ConfigService])
], BaseAppController);
export { BaseAppController };
//# sourceMappingURL=base-app.controller.js.map