"use strict";
/**
 * # SBOM & Supply Chain Dependency Integrity Guard (`sbom-verifier.ts`)
 * Package SHA-256 cryptographic hash & dependency integrity validator
 * (Academic Ref: *Intelligent Continuous Security*, O'Reilly - Ch. 7).
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
exports.SbomSupplyChainVerifierEngine = void 0;
const crypto = __importStar(require("crypto"));
class SbomSupplyChainVerifierEngine {
    static verifyComponent(record, actualContent) {
        const bytes = typeof actualContent === 'string' ? Buffer.from(actualContent) : actualContent;
        const actualHash = crypto.createHash('sha256').update(bytes).digest('hex');
        const matches = actualHash.toLowerCase() === record.expectedSha256.toLowerCase();
        return { matches, actualHash };
    }
    static auditSupplyChain(manifest, actualComponents) {
        const tamperedComponents = [];
        const revokedComponents = [];
        let totalVerified = 0;
        for (const record of manifest) {
            if (record.isRevoked) {
                revokedComponents.push(`${record.name}@${record.version}`);
            }
            const content = actualComponents.get(record.name);
            if (content) {
                const { matches } = this.verifyComponent(record, content);
                if (!matches) {
                    tamperedComponents.push(`${record.name}@${record.version} (Hash mismatch)`);
                }
                else {
                    totalVerified++;
                }
            }
            else {
                tamperedComponents.push(`${record.name}@${record.version} (Missing component)`);
            }
        }
        return {
            isValid: tamperedComponents.length === 0 && revokedComponents.length === 0,
            tamperedComponents,
            revokedComponents,
            totalVerified,
        };
    }
}
exports.SbomSupplyChainVerifierEngine = SbomSupplyChainVerifierEngine;
