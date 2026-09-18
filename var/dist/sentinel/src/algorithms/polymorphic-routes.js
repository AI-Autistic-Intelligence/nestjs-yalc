"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolymorphicRouteEngine = void 0;
const tslib_1 = require("tslib");
const crypto = tslib_1.__importStar(require("crypto"));
class PolymorphicRouteEngine {
    constructor(secretKey, rotationPeriodSecs = 300) {
        this.secretKey = typeof secretKey === 'string' ? Buffer.from(secretKey) : secretKey;
        this.rotationPeriodSecs = rotationPeriodSecs;
    }
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
//# sourceMappingURL=polymorphic-routes.js.map