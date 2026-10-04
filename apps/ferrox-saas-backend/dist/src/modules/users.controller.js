"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const tslib_1 = require("tslib");
const ferrox_node_1 = require("ferrox-node");
let UsersController = class UsersController {
    getProfile() {
        return {
            id: 'usr_ferrox_001',
            email: 'founder@ferrox.dev',
            roles: ['user', 'admin', 'founder'],
            securityTier: 'HIGH_SECURITY',
            twoFactorEnabled: true,
        };
    }
};
exports.UsersController = UsersController;
tslib_1.__decorate([
    (0, ferrox_node_1.Get)('/me'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], UsersController.prototype, "getProfile", null);
exports.UsersController = UsersController = tslib_1.__decorate([
    (0, ferrox_node_1.Controller)('/api/v1/users')
], UsersController);
//# sourceMappingURL=users.controller.js.map