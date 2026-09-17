"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Singleflight = exports.RateLimiter = exports.CircuitBreaker = void 0;
class CircuitBreaker {
    failureThreshold;
    recoveryTimeMs;
    state = 'CLOSED';
    failureCount = 0;
    lastFailureTime = 0;
    constructor(failureThreshold = 5, recoveryTimeMs = 10000) {
        this.failureThreshold = failureThreshold;
        this.recoveryTimeMs = recoveryTimeMs;
    }
    async execute(fn, fallback) {
        const now = Date.now();
        if (this.state === 'OPEN') {
            if (now - this.lastFailureTime > this.recoveryTimeMs) {
                this.state = 'HALF_OPEN';
            }
            else {
                if (fallback)
                    return fallback();
                throw new Error('CircuitBreaker is OPEN. Execution blocked.');
            }
        }
        try {
            const result = await fn();
            if (this.state === 'HALF_OPEN') {
                this.reset();
            }
            return result;
        }
        catch (err) {
            this.recordFailure();
            if (fallback)
                return fallback();
            throw err;
        }
    }
    recordFailure() {
        this.failureCount++;
        this.lastFailureTime = Date.now();
        if (this.failureCount >= this.failureThreshold) {
            this.state = 'OPEN';
        }
    }
    reset() {
        this.state = 'CLOSED';
        this.failureCount = 0;
    }
    getState() {
        return this.state;
    }
}
exports.CircuitBreaker = CircuitBreaker;
class RateLimiter {
    capacity;
    refillRatePerSec;
    tokens;
    lastRefillTimestamp;
    constructor(capacity = 100, refillRatePerSec = 10) {
        this.capacity = capacity;
        this.refillRatePerSec = refillRatePerSec;
        this.tokens = capacity;
        this.lastRefillTimestamp = Date.now();
    }
    allowRequest(tokensRequested = 1) {
        this.refill();
        if (this.tokens >= tokensRequested) {
            this.tokens -= tokensRequested;
            return true;
        }
        return false;
    }
    refill() {
        const now = Date.now();
        const elapsedSecs = (now - this.lastRefillTimestamp) / 1000;
        this.tokens = Math.min(this.capacity, this.tokens + elapsedSecs * this.refillRatePerSec);
        this.lastRefillTimestamp = now;
    }
}
exports.RateLimiter = RateLimiter;
class Singleflight {
    inFlightCalls = new Map();
    async do(key, fn) {
        if (this.inFlightCalls.has(key)) {
            return this.inFlightCalls.get(key);
        }
        const promise = (async () => {
            try {
                return await fn();
            }
            finally {
                this.inFlightCalls.delete(key);
            }
        })();
        this.inFlightCalls.set(key, promise);
        return promise;
    }
}
exports.Singleflight = Singleflight;
