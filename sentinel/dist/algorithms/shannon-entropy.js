"use strict";
/**
 * # Shannon Payload Entropy Evaluator (`shannon-entropy.ts`)
 * Calculates payload information entropy to detect obfuscated, packed, or encrypted payloads
 * (Academic Ref: *Malware Data Science*, No Starch Press).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShannonEntropyEngine = void 0;
class ShannonEntropyEngine {
    /**
     * Calculates Shannon Entropy H(X) = -sum(P(x) * log2(P(x))) for string/buffer payload
     */
    static calculateEntropy(payload) {
        const bytes = typeof payload === 'string' ? Buffer.from(payload) : payload;
        if (bytes.length === 0) {
            return { entropyScore: 0.0, isSuspicious: false, byteLength: 0 };
        }
        const counts = new Array(256).fill(0);
        for (let i = 0; i < bytes.length; i++) {
            counts[bytes[i]]++;
        }
        let entropy = 0.0;
        const len = bytes.length;
        for (let i = 0; i < 256; i++) {
            if (counts[i] > 0) {
                const p = counts[i] / len;
                entropy -= p * Math.log2(p);
            }
        }
        // High entropy threshold > 7.2 indicates packed/encrypted payload
        const isSuspicious = entropy > 7.2 && bytes.length > 64;
        return {
            entropyScore: Math.round(entropy * 1000) / 1000,
            isSuspicious,
            byteLength: bytes.length,
        };
    }
}
exports.ShannonEntropyEngine = ShannonEntropyEngine;
