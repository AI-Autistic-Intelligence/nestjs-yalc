"use strict";
/**
 * # NestJS Ferrox-Node Sentinel Module (`sentinel.module.ts`)
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var FerroxSentinelModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FerroxSentinelModule = void 0;
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
exports.FerroxSentinelModule = FerroxSentinelModule = FerroxSentinelModule_1 = __decorate([
    (0, common_1.Module)({})
], FerroxSentinelModule);
