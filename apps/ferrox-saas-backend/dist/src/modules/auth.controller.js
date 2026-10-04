"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const tslib_1 = require("tslib");
const ferrox_node_1 = require("ferrox-node");
let AuthController = class AuthController {
    constructor(secretKey = 'ferrox-saas-master-paseto-secret-32b') {
        this.pasetoService = new ferrox_node_1.PasetoAuthService(secretKey);
        this.totpService = new ferrox_node_1.TotpAuthService();
    }
    register(req) {
        const { email } = req.body || {};
        return {
            success: true,
            message: 'User registered successfully',
            email: email || 'user@ferrox.dev',
            totpSetupRequired: true,
        };
    }
    login(req) {
        const { email } = req.body || {};
        const token = this.pasetoService.generateV4LocalToken({
            sub: email || 'usr_ferrox_demo',
            roles: ['user', 'admin', 'founder'],
        }, 3600);
        return {
            tokenType: 'PASETO v4.local',
            token,
            expiresIn: 3600,
        };
    }
    totpSetup(req) {
        const email = req.body?.email || 'user@ferrox.dev';
        const secret = this.totpService.generateSecret();
        const uri = this.totpService.generateOtpAuthUri(email, secret, 'FerroxSaaS');
        return {
            secret,
            otpAuthUri: uri,
        };
    }
    totpVerify(req) {
        const { secret, code } = req.body || {};
        const isValid = this.totpService.verifyTotpCode(secret || '', code || '');
        return {
            isValid,
            status: isValid ? 'VERIFIED' : 'FAILED',
        };
    }
};
exports.AuthController = AuthController;
tslib_1.__decorate([
    (0, ferrox_node_1.Post)('/register'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], AuthController.prototype, "register", null);
tslib_1.__decorate([
    (0, ferrox_node_1.Post)('/login'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
tslib_1.__decorate([
    (0, ferrox_node_1.Post)('/totp/setup'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], AuthController.prototype, "totpSetup", null);
tslib_1.__decorate([
    (0, ferrox_node_1.Post)('/totp/verify'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], AuthController.prototype, "totpVerify", null);
exports.AuthController = AuthController = tslib_1.__decorate([
    (0, ferrox_node_1.Controller)('/api/v1/auth'),
    tslib_1.__metadata("design:paramtypes", [String])
], AuthController);
//# sourceMappingURL=auth.controller.js.map