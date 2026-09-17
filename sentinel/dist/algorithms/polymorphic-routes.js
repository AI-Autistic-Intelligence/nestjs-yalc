"use strict";
/**
 * # Polymorphic API Route Mutation Engine (`polymorphic-routes.ts`)
 * Ephemeral time-windowed HMAC path rotation for endpoint obfuscation
 * (Academic Ref: *ACM SIGCOMM*).
 */
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
exports.PolymorphicRouteEngine = void 0;
const crypto = __importStar(require("crypto"));
class PolymorphicRouteEngine {
    secretKey;
    rotationPeriodSecs;
    constructor(secretKey, rotationPeriodSecs = 300) {
        this.secretKey = typeof secretKey === 'string' ? Buffer.from(secretKey) : secretKey;
        this.rotationPeriodSecs = rotationPeriodSecs;
    }
    /**
     * Generates the current mutated path for a given base path and timestamp
     */
    generateMutatedPath(basePath, timestampSecs) {
        const windowSlot = Math.floor(timestampSecs / this.rotationPeriodSecs);
        const hasher = crypto.createHash('sha256');
        hasher.update(this.secretKey);
        hasher.update(basePath);
        const slotBuf = Buffer.alloc(8);
        slotBuf.writeBigUInt64BE(BigInt(windowSlot));
        hasher.update(slotBuf);
        const hexHash = hasher.digest('hex').substring(0, 16);
        const currentMutatedPath = `${basePath}/_poly_${hexHash}`;
        const expiresInSecs = this.rotationPeriodSecs - (timestampSecs % this.rotationPeriodSecs);
        return {
            basePath,
            currentMutatedPath,
            windowSlot,
            expiresInSecs,
        };
    }
    /**
     * Validates incoming request path against current and previous window slot
     */
    validateRequest(requestPath, basePath, timestampSecs) {
        const currentSlot = Math.floor(timestampSecs / this.rotationPeriodSecs);
        for (const slot of [currentSlot, Math.max(0, currentSlot - 1)]) {
            const hasher = crypto.createHash('sha256');
            hasher.update(this.secretKey);
            hasher.update(basePath);
            const slotBuf = Buffer.alloc(8);
            slotBuf.writeBigUInt64BE(BigInt(slot));
            hasher.update(slotBuf);
            const hexHash = hasher.digest('hex').substring(0, 16);
            const expectedPath = `${basePath}/_poly_${hexHash}`;
            if (requestPath === expectedPath) {
                return {
                    isValid: true,
                    basePath,
                    windowSlot: slot,
                };
            }
        }
        return {
            isValid: false,
            basePath,
            windowSlot: currentSlot,
        };
    }
}
exports.PolymorphicRouteEngine = PolymorphicRouteEngine;
