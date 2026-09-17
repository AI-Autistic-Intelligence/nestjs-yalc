"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const index_1 = require("../../../../ferrox-node/dist/index");
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
__decorate([
    (0, index_1.Get)('/users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getUsers", null);
__decorate([
    (0, index_1.Get)('/audit-logs'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAuditLogs", null);
exports.AdminController = AdminController = __decorate([
    (0, index_1.Controller)('/api/v1/admin'),
    (0, index_1.Roles)('admin')
], AdminController);
