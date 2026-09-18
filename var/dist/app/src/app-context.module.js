"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppContextModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const app_context_service_js_1 = require("./app-context.service.js");
let AppContextModule = class AppContextModule {
};
exports.AppContextModule = AppContextModule;
exports.AppContextModule = AppContextModule = tslib_1.__decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({ providers: [app_context_service_js_1.AppContextService], exports: [app_context_service_js_1.AppContextService] })
], AppContextModule);
//# sourceMappingURL=app-context.module.js.map