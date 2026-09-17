/**
 * # Markov Sequence Predictor (`markov-sequence.ts`)
 * State transition probability matrix P(S_{t+1} | S_t) over endpoint traversal paths
 * (Academic Ref: *ACM CCS*).
 */
export interface BehaviorAssessment {
    isAnomaly: boolean;
    anomalyScore: number;
    sequenceProbability: number;
}
export declare class MarkovBehaviorEngine {
    private transitionCounts;
    private stateTotals;
    /**
     * Trains/updates transition probability matrix with historical user navigation sequences
     */
    trainSequence(sequence: string[]): void;
    /**
     * Evaluates sequence probability P(S) = product(P(S_{i+1} | S_i))
     */
    evaluateSequence(sequence: string[]): BehaviorAssessment;
}
