import { __decorate } from "tslib";
import { Module } from '@nestjs/common';
import { ClsModule, ClsService } from 'nestjs-cls';
import { AsyncLocalStorage } from 'node:async_hooks';
import { randomUUID } from 'node:crypto';
export class YalcGlobalClsService extends ClsService {
}
export class YalcAlsService extends AsyncLocalStorage {
}
let YalcClsModule = class YalcClsModule {
};
YalcClsModule = __decorate([
    Module({
        imports: [
            ClsModule.forRoot({
                global: true,
                middleware: {
                    mount: true,
                    setup: (cls, req) => {
                        cls.set('headers', req.headers);
                    },
                    generateId: true,
                    idGenerator: async (req) => req.headers['X-Request-Id']?.toString() ?? randomUUID(),
                },
            }),
        ],
        providers: [
            {
                provide: YalcGlobalClsService,
                useExisting: ClsService,
            },
            {
                provide: YalcAlsService,
                useValue: new YalcAlsService(),
            },
        ],
        exports: [YalcGlobalClsService],
    })
], YalcClsModule);
export { YalcClsModule };
//# sourceMappingURL=cls.module.js.map