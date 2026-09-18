"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseAppService = void 0;
const tslib_1 = require("tslib");
const common = tslib_1.__importStar(require("@nestjs/common"));
const event_emitter_1 = require("@nestjs/event-emitter");
const def_const_js_1 = require("@nest-yalc-2/app/def.const.js");
const app_events_js_1 = require("./app.events.js");
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
exports.BaseAppService = BaseAppService;
tslib_1.__decorate([
    (0, event_emitter_1.OnEvent)(app_events_js_1.AppEvents.BEFORE_ALL_ROUTES),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], BaseAppService.prototype, "handleBeforeAllRoutes", null);
exports.BaseAppService = BaseAppService = tslib_1.__decorate([
    common.Injectable(),
    tslib_1.__param(0, common.Inject(def_const_js_1.APP_LOGGER_SERVICE)),
    tslib_1.__metadata("design:paramtypes", [Object])
], BaseAppService);
//# sourceMappingURL=base-app.service.js.map