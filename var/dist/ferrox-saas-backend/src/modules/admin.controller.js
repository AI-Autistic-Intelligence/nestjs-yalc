"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const tslib_1 = require("tslib");
const ferrox_node_1 = require("ferrox-node");
let AdminController = class AdminController {
    getUsers() {
        return [
            { id: 'usr_001', email: 'alice@ferrox.dev', role: 'admin' },
            { id: 'usr_002', email: 'bob@ferrox.dev', role: 'user' },
        ];
    }
    getAuditLogs() {
        return [
            { id: 'log_101', event: 'PASETO_TOKEN_ISSUED', ip: '127.0.0.1', timestamp: new Date().toISOString() },
            { id: 'log_102', event: 'TOTP_2FA_VERIFIED', ip: '127.0.0.1', timestamp: new Date().toISOString() },
        ];
    }
};
exports.AdminController = AdminController;
tslib_1.__decorate([
    (0, ferrox_node_1.Get)('/users'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], AdminController.prototype, "getUsers", null);
tslib_1.__decorate([
    (0, ferrox_node_1.Get)('/audit-logs'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], AdminController.prototype, "getAuditLogs", null);
exports.AdminController = AdminController = tslib_1.__decorate([
    (0, ferrox_node_1.Controller)('/api/v1/admin'),
    (0, ferrox_node_1.Roles)('admin')
], AdminController);
//# sourceMappingURL=admin.controller.js.map