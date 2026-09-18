"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasetoAuthService = void 0;
const tslib_1 = require("tslib");
const crypto = tslib_1.__importStar(require("crypto"));
class PasetoAuthService {
    constructor(secretKeyString = 'ferrox-default-paseto-secret-32b', issuer = 'ferrox-node-auth') {
        this.secretKey = crypto.createHash('sha256').update(secretKeyString).digest();
        this.issuer = issuer;
    }
    generateV4LocalToken(payload, ttlSeconds = 3600) {
        const now = Math.floor(Date.now() / 1000);
        const fullPayload = {
            iss: this.issuer,
            iat: now,
            exp: now + ttlSeconds,
            ...payload,
        };
        const payloadJson = JSON.stringify(fullPayload);
        const nonce = crypto.randomBytes(24);
        const cipher = crypto.createCipheriv('aes-256-gcm', this.secretKey, nonce.subarray(0, 12));
        let encrypted = cipher.update(payloadJson, 'utf-8');
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        const authTag = cipher.getAuthTag();
        const tokenBuffer = Buffer.concat([nonce, authTag, encrypted]);
        return `v4.local.${tokenBuffer.toString('base64url')}`;
    }
    verifyV4LocalToken(token) {
        if (!token.startsWith('v4.local.')) {
            throw new Error('Invalid PASETO token format. Expected v4.local prefix.');
        }
        const rawBase64 = token.slice(9);
        const tokenBuffer = Buffer.from(rawBase64, 'base64url');
        if (tokenBuffer.length < 40) {
            throw new Error('Corrupted PASETO token buffer');
        }
        const nonce = tokenBuffer.subarray(0, 24);
        const authTag = tokenBuffer.subarray(24, 40);
        const encrypted = tokenBuffer.subarray(40);
        const decipher = crypto.createDecipheriv('aes-256-gcm', this.secretKey, nonce.subarray(0, 12));
        decipher.setAuthTag(authTag);
        let decrypted = decipher.update(encrypted);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        const payload = JSON.parse(decrypted.toString('utf-8'));
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < now) {
            throw new Error('PASETO token has expired');
        }
        return payload;
    }
}
exports.PasetoAuthService = PasetoAuthService;
//# sourceMappingURL=paseto-auth.service.js.map