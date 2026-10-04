"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SbomSupplyChainVerifierEngine = void 0;
const tslib_1 = require("tslib");
const crypto = tslib_1.__importStar(require("crypto"));
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
//# sourceMappingURL=sbom-verifier.js.map