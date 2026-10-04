export interface EntropyAssessment {
    entropyScore: number;
    isSuspicious: boolean;
    byteLength: number;
}
export declare class ShannonEntropyEngine {
    static calculateEntropy(payload: string | Buffer): EntropyAssessment;
}
