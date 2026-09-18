"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
const tslib_1 = require("tslib");
const ferrox_node_1 = require("ferrox-node");
let HealthController = class HealthController {
    getHealth() {
        return {
            status: 'UP',
            framework: 'Ferrox-Node Framework v0.6.0',
            timestamp: new Date().toISOString(),
            kernelCompliance: 'ENFORCED',
        };
    }
};
exports.HealthController = HealthController;
tslib_1.__decorate([
    (0, ferrox_node_1.Get)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], HealthController.prototype, "getHealth", null);
exports.HealthController = HealthController = tslib_1.__decorate([
    (0, ferrox_node_1.Controller)('/health')
], HealthController);
//# sourceMappingURL=health.controller.js.map