"use strict";
/**
 * # Markov Sequence Predictor (`markov-sequence.ts`)
 * State transition probability matrix P(S_{t+1} | S_t) over endpoint traversal paths
 * (Academic Ref: *ACM CCS*).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkovBehaviorEngine = void 0;
class MarkovBehaviorEngine {
    transitionCounts = new Map();
    stateTotals = new Map();
    /**
     * Trains/updates transition probability matrix with historical user navigation sequences
     */
    trainSequence(sequence) {
        for (let i = 0; i < sequence.length - 1; i++) {
            const current = sequence[i];
            const next = sequence[i + 1];
            if (!this.transitionCounts.has(current)) {
                this.transitionCounts.set(current, new Map());
            }
            const nextMap = this.transitionCounts.get(current);
            nextMap.set(next, (nextMap.get(next) || 0) + 1);
            this.stateTotals.set(current, (this.stateTotals.get(current) || 0) + 1);
        }
    }
    /**
     * Evaluates sequence probability P(S) = product(P(S_{i+1} | S_i))
     */
    evaluateSequence(sequence) {
        if (sequence.length < 2) {
            return { isAnomaly: false, anomalyScore: 0.0, sequenceProbability: 1.0 };
        }
        let prob = 1.0;
        for (let i = 0; i < sequence.length - 1; i++) {
            const current = sequence[i];
            const next = sequence[i + 1];
            const total = this.stateTotals.get(current) || 0;
            const count = this.transitionCounts.get(current)?.get(next) || 0;
            const transitionProb = total > 0 ? (count + 1) / (total + 10) : 0.05;
            prob *= transitionProb;
        }
        const anomalyScore = Math.min(1.0, Math.max(0.0, 1.0 - Math.pow(prob, 1 / (sequence.length - 1))));
        const isAnomaly = anomalyScore > 0.85;
        return {
            isAnomaly,
            anomalyScore: Math.round(anomalyScore * 1000) / 1000,
            sequenceProbability: prob,
        };
    }
}
exports.MarkovBehaviorEngine = MarkovBehaviorEngine;
