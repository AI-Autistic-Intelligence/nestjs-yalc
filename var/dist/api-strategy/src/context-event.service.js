import { __decorate, __metadata } from "tslib";
import { Injectable } from '@nestjs/common';
export function ContextEventServiceFactory(defaultStrategy) {
    let ContextEventService = class ContextEventService {
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
    ContextEventService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Object])
    ], ContextEventService);
    return ContextEventService;
}
//# sourceMappingURL=context-event.service.js.map