"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YalcClsModule = exports.YalcAlsService = exports.YalcGlobalClsService = void 0;
const tslib_1 = require("tslib");
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
exports.YalcClsModule = YalcClsModule = tslib_1.__decorate([
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
                    idGenerator: async (req) => {
                        return req.headers['X-Request-Id']?.toString() ?? (0, node_crypto_1.randomUUID)();
                    },
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