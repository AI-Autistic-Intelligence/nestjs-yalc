export interface GroundednessAssessment {
    groundednessScore: number;
    isGrounded: boolean;
    unsupportedClaims: string[];
    matchedContextFacts: string[];
}
export declare class RagHallucinationGroundednessEngine {
    static evaluateGroundedness(generatedResponse: string, retrievedContexts: string[], groundednessThreshold?: number): GroundednessAssessment;
}
