"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextCallServiceFactory = ContextCallServiceFactory;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
function ContextCallServiceFactory(defaultStrategy) {
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
    ContextCallService = tslib_1.__decorate([
        (0, common_1.Injectable)(),
        tslib_1.__metadata("design:paramtypes", [Object])
    ], ContextCallService);
    return ContextCallService;
}
//# sourceMappingURL=context-call.service.js.map