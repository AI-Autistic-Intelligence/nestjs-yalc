/**
 * # RAG Groundedness & Hallucination Guardrail Engine (`rag-groundedness.ts`)
 * RAG factual claim overlap ratio scoring engine
 * (Academic Ref: *Building LLM-Powered Applications* & *Mastering LLM Applications*).
 */

export interface GroundednessAssessment {
  groundednessScore: number;
  isGrounded: boolean;
  unsupportedClaims: string[];
  matchedContextFacts: string[];
}

export class RagHallucinationGroundednessEngine {
  /**
   * Computes factual groundedness score as the ratio of generated response claims supported by retrieved context chunks
   */
  public static evaluateGroundedness(
    generatedResponse: string,
    retrievedContexts: string[],
    groundednessThreshold: number = 0.70
  ): GroundednessAssessment {
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
    const contextWords = new Set(
      combinedContext
        .split(/[^a-zA-Z0-9]+/)
        .filter((w) => w.length > 0)
    );

    let matchedClaimsCount = 0;
    const unsupportedClaims: string[] = [];
    const matchedContextFacts: string[] = [];

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
      } else {
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
