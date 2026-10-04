import { __decorate, __metadata } from "tslib";
import { Injectable } from '@nestjs/common';
export function ContextCallServiceFactory(defaultStrategy) {
    let ContextCallService = class ContextCallService {
        constructor(strategy = defaultStrategy) {
            this.strategy = strategy;
        }
        setStrategy(strategy) {
            this.strategy = strategy;
        }
        getStrategy() {
            return this.strategy;
        }
    };
    ContextCallService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Object])
    ], ContextCallService);
    return ContextCallService;
}
//# sourceMappingURL=context-call.service.js.map