"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TotpAuthService = void 0;
const tslib_1 = require("tslib");
const crypto = tslib_1.__importStar(require("crypto"));
class TotpAuthService {
    generateSecret() {
        const buffer = crypto.randomBytes(20);
        return buffer.toString('hex').substring(0, 32).toUpperCase();
    }
    generateOtpAuthUri(label, secret, issuer = 'Ferrox') {
        const encodedLabel = encodeURIComponent(label);
        const encodedIssuer = encodeURIComponent(issuer);
        return `otpauth://totp/${encodedIssuer}:${encodedLabel}?secret=${secret}&issuer=${encodedIssuer}&algorithm=SHA1&digits=6&period=30`;
    }
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
//# sourceMappingURL=totp-auth.service.js.map