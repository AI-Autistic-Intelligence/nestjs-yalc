/**
 * # Shannon Payload Entropy Evaluator (`shannon-entropy.ts`)
 * Calculates payload information entropy to detect obfuscated, packed, or encrypted payloads
 * (Academic Ref: *Malware Data Science*, No Starch Press).
 */
export interface EntropyAssessment {
    entropyScore: number;
    isSuspicious: boolean;
    byteLength: number;
}
export declare class ShannonEntropyEngine {
    /**
     * Calculates Shannon Entropy H(X) = -sum(P(x) * log2(P(x))) for string/buffer payload
     */
    static calculateEntropy(payload: string | Buffer): EntropyAssessment;
}
