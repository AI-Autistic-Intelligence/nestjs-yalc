"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FounderController = void 0;
const tslib_1 = require("tslib");
const index_1 = require("../../../../ferrox-node/dist/index");
let FounderController = class FounderController {
    getSaaSMetrics() {
        return {
            mrr: 250000,
            arr: 3000000,
            activeTenants: 145,
            securityPosture: 'PASSING_100_PERCENT',
            sentinelThreatsBlocked: 42,
        };
    }
};
exports.FounderController = FounderController;
tslib_1.__decorate([
    (0, index_1.Get)('/metrics'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], FounderController.prototype, "getSaaSMetrics", null);
exports.FounderController = FounderController = tslib_1.__decorate([
    (0, index_1.Controller)('/api/v1/founder'),
    (0, index_1.Roles)('founder')
], FounderController);
//# sourceMappingURL=founder.controller.js.map