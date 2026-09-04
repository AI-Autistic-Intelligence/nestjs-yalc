"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YalcClsModule = exports.YalcAlsService = exports.YalcGlobalClsService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_cls_1 = require("nestjs-cls");
const node_async_hooks_1 = require("node:async_hooks");
const node_crypto_1 = require("node:crypto");
class YalcGlobalClsService extends nestjs_cls_1.ClsService {
}
exports.YalcGlobalClsService = YalcGlobalClsService;
class YalcAlsService extends node_async_hooks_1.AsyncLocalStorage {
}
exports.YalcAlsService = YalcAlsService;
let YalcClsModule = class YalcClsModule {
};
exports.YalcClsModule = YalcClsModule;
exports.YalcClsModule = YalcClsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_cls_1.ClsModule.forRoot({
                global: true,
                middleware: {
                    mount: true,
                    setup: (cls, req) => {
                        cls.set('headers', req.headers);
                    },
                    generateId: true,
                    idGenerator: async (req) => { var _a, _b; return (_b = (_a = req.headers['X-Request-Id']) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : (0, node_crypto_1.randomUUID)(); },
                },
            }),
        ],
        providers: [
            {
                provide: YalcGlobalClsService,
                useExisting: nestjs_cls_1.ClsService,
            },
            {
                provide: YalcAlsService,
                useValue: new YalcAlsService(),
            },
        ],
        exports: [YalcGlobalClsService],
    })
], YalcClsModule);
//# sourceMappingURL=cls.module.js.map