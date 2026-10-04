"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RagHallucinationGroundednessEngine = void 0;
class RagHallucinationGroundednessEngine {
    static evaluateGroundedness(generatedResponse, retrievedContexts, groundednessThreshold = 0.70) {
        const claims = generatedResponse
            .split(/[.!?]/)
            .map((s) => s.trim())
            .filter((s) => s.length > 0);
        if (claims.length === 0) {
            return {
                groundednessScore: 1.0,
                isGrounded: true,
                unsupportedClaims: [],
                matchedContextFacts: [],
            };
        }
        const combinedContext = retrievedContexts.join(' ').toLowerCase();
        const contextWords = new Set(combinedContext
            .split(/[^a-zA-Z0-9]+/)
            .filter((w) => w.length > 0));
        let matchedClaimsCount = 0;
        const unsupportedClaims = [];
        const matchedContextFacts = [];
        for (const claim of claims) {
            const claimWords = claim
                .toLowerCase()
                .split(/[^a-zA-Z0-9]+/)
                .filter((w) => w.length > 3);
            if (claimWords.length === 0) {
                matchedClaimsCount++;
                continue;
            }
            const matches = claimWords.filter((w) => contextWords.has(w)).length;
            const matchRatio = matches / claimWords.length;
            if (matchRatio >= 0.4) {
                matchedClaimsCount++;
                matchedContextFacts.push(claim);
            }
            else {
                unsupportedClaims.push(claim);
            }
        }
        const groundednessScore = matchedClaimsCount / claims.length;
        const isGrounded = groundednessScore >= groundednessThreshold;
        return {
            groundednessScore,
            isGrounded,
            unsupportedClaims,
            matchedContextFacts,
        };
    }
}
exports.RagHallucinationGroundednessEngine = RagHallucinationGroundednessEngine;
//# sourceMappingURL=rag-groundedness.js.map