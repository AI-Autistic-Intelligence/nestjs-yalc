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
export declare class RagHallucinationGroundednessEngine {
    /**
     * Computes factual groundedness score as the ratio of generated response claims supported by retrieved context chunks
     */
    static evaluateGroundedness(generatedResponse: string, retrievedContexts: string[], groundednessThreshold?: number): GroundednessAssessment;
}
