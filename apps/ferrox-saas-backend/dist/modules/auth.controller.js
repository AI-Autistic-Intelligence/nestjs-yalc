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
exports.AuthController = void 0;
const index_1 = require("../../../../ferrox-node/dist/index");
let AuthController = class AuthController {
    pasetoService;
    totpService;
    constructor(secretKey = 'ferrox-saas-master-paseto-secret-32b') {
        this.pasetoService = new index_1.PasetoAuthService(secretKey);
        this.totpService = new index_1.TotpAuthService();
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
__decorate([
    (0, index_1.Post)('/register'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "register", null);
__decorate([
    (0, index_1.Post)('/login'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    (0, index_1.Post)('/totp/setup'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "totpSetup", null);
__decorate([
    (0, index_1.Post)('/totp/verify'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "totpVerify", null);
exports.AuthController = AuthController = __decorate([
    (0, index_1.Controller)('/api/v1/auth'),
    __metadata("design:paramtypes", [String])
], AuthController);
