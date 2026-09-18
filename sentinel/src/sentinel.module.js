"use strict";
var FerroxSentinelModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FerroxSentinelModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const sentinel_guard_js_1 = require("./sentinel.guard.js");
const sentinel_interceptor_js_1 = require("./sentinel.interceptor.js");
let FerroxSentinelModule = FerroxSentinelModule_1 = class FerroxSentinelModule {
    static register(options = {}) {
        return {
            module: FerroxSentinelModule_1,
            providers: [
                sentinel_guard_js_1.FerroxSentinelGuard,
                {
                    provide: sentinel_interceptor_js_1.RagGroundednessInterceptor,
                    useValue: new sentinel_interceptor_js_1.RagGroundednessInterceptor(options.minGroundednessScore ?? 0.70),
                },
            ],
            exports: [sentinel_guard_js_1.FerroxSentinelGuard, sentinel_interceptor_js_1.RagGroundednessInterceptor],
        };
    }
};
exports.FerroxSentinelModule = FerroxSentinelModule;
exports.FerroxSentinelModule = FerroxSentinelModule = FerroxSentinelModule_1 = tslib_1.__decorate([
    (0, common_1.Module)({})
], FerroxSentinelModule);
//# sourceMappingURL=sentinel.module.js.map