"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TotpAuthService = void 0;
const crypto = __importStar(require("crypto"));
class TotpAuthService {
    /**
     * Generates a 32-character base32-encoded TOTP secret
     */
    generateSecret() {
        const buffer = crypto.randomBytes(20);
        return buffer.toString('hex').substring(0, 32).toUpperCase();
    }
    /**
     * Formats an otpauth URI for TOTP QR Code generation
     */
    generateOtpAuthUri(label, secret, issuer = 'Ferrox') {
        const encodedLabel = encodeURIComponent(label);
        const encodedIssuer = encodeURIComponent(issuer);
        return `otpauth://totp/${encodedIssuer}:${encodedLabel}?secret=${secret}&issuer=${encodedIssuer}&algorithm=SHA1&digits=6&period=30`;
    }
    /**
     * Validates a 6-digit TOTP code for a given secret within a time window
     */
    verifyTotpCode(secret, code, window = 1) {
        const currentStep = Math.floor(Date.now() / 1000 / 30);
        for (let errorWindow = -window; errorWindow <= window; errorWindow++) {
            const step = currentStep + errorWindow;
            const generatedCode = this.generateCodeForStep(secret, step);
            if (generatedCode === code.trim()) {
                return true;
            }
        }
        return false;
    }
    generateCodeForStep(secret, step) {
        const buffer = Buffer.alloc(8);
        let tempStep = step;
        for (let i = 7; i >= 0; i--) {
            buffer[i] = tempStep & 0xff;
            tempStep = Math.floor(tempStep / 256);
        }
        const hmac = crypto.createHmac('sha1', Buffer.from(secret, 'utf-8')).update(buffer).digest();
        const offset = hmac[hmac.length - 1] & 0xf;
        const binary = ((hmac[offset] & 0x7f) << 24) |
            ((hmac[offset + 1] & 0xff) << 16) |
            ((hmac[offset + 2] & 0xff) << 8) |
            (hmac[offset + 3] & 0xff);
        const otp = (binary % 1000000).toString();
        return otp.padStart(6, '0');
    }
}
exports.TotpAuthService = TotpAuthService;
