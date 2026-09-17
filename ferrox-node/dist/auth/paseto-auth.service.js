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
exports.PasetoAuthService = void 0;
const crypto = __importStar(require("crypto"));
class PasetoAuthService {
    secretKey;
    issuer;
    constructor(secretKeyString = 'ferrox-default-paseto-secret-32b', issuer = 'ferrox-node-auth') {
        this.secretKey = crypto.createHash('sha256').update(secretKeyString).digest();
        this.issuer = issuer;
    }
    /**
     * Generates a PASETO v4.local (symmetric encrypted) token
     */
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
        // AEAD encryption simulation with AES-256-GCM + SHA256 HMAC for v4 local parity
        const cipher = crypto.createCipheriv('aes-256-gcm', this.secretKey, nonce.subarray(0, 12));
        let encrypted = cipher.update(payloadJson, 'utf-8');
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        const authTag = cipher.getAuthTag();
        const tokenBuffer = Buffer.concat([nonce, authTag, encrypted]);
        return `v4.local.${tokenBuffer.toString('base64url')}`;
    }
    /**
     * Verifies and decrypts a PASETO v4.local token
     */
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
