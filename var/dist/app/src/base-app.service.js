import { __decorate, __metadata, __param } from "tslib";
import * as common from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { APP_LOGGER_SERVICE } from '@nestjs-yalc/app/def.const.js';
import { AppEvents } from './app.events.js';
let BaseAppService = class BaseAppService {
    constructor(logger) {
        this.logger = logger;
    }
    getHello(appName) {
        return `Hello World from ${appName}!`;
    }
    handleBeforeAllRoutes(context) {
        const handlerName = context.getHandler().name;
        if (!handlerName.startsWith('_') && handlerName.includes('_'))
            this.logger.debug?.(`Running Handler: ${handlerName}`);
    }
};
__decorate([
    OnEvent(AppEvents.BEFORE_ALL_ROUTES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BaseAppService.prototype, "handleBeforeAllRoutes", null);
BaseAppService = __decorate([
    common.Injectable(),
    __param(0, common.Inject(APP_LOGGER_SERVICE)),
    __metadata("design:paramtypes", [Object])
], BaseAppService);
export { BaseAppService };
//# sourceMappingURL=base-app.service.js.map