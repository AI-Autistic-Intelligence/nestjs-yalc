import { __decorate } from "tslib";
import { Global, Module } from '@nestjs/common';
import { AppContextService } from './app-context.service.js';
let AppContextModule = class AppContextModule {
};
AppContextModule = __decorate([
    Global(),
    Module({ providers: [AppContextService], exports: [AppContextService] })
], AppContextModule);
export { AppContextModule };
//# sourceMappingURL=app-context.module.js.map