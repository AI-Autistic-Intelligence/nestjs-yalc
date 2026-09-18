"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextEventServiceFactory = ContextEventServiceFactory;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
function ContextEventServiceFactory(defaultStrategy) {
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
    ContextEventService = tslib_1.__decorate([
        (0, common_1.Injectable)(),
        tslib_1.__metadata("design:paramtypes", [Object])
    ], ContextEventService);
    return ContextEventService;
}
//# sourceMappingURL=context-event.service.js.map