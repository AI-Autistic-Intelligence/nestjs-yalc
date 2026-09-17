export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';
export declare class CircuitBreaker {
    private failureThreshold;
    private recoveryTimeMs;
    private state;
    private failureCount;
    private lastFailureTime;
    constructor(failureThreshold?: number, recoveryTimeMs?: number);
    execute<T>(fn: () => Promise<T>, fallback?: () => T): Promise<T>;
    private recordFailure;
    reset(): void;
    getState(): CircuitState;
}
export declare class RateLimiter {
    private capacity;
    private refillRatePerSec;
    private tokens;
    private lastRefillTimestamp;
    constructor(capacity?: number, refillRatePerSec?: number);
    allowRequest(tokensRequested?: number): boolean;
    private refill;
}
export declare class Singleflight {
    private inFlightCalls;
    do<T>(key: string, fn: () => Promise<T>): Promise<T>;
}
