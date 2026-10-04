export interface BehaviorAssessment {
    isAnomaly: boolean;
    anomalyScore: number;
    sequenceProbability: number;
}
export declare class MarkovBehaviorEngine {
    private transitionCounts;
    private stateTotals;
    trainSequence(sequence: string[]): void;
    evaluateSequence(sequence: string[]): BehaviorAssessment;
}
