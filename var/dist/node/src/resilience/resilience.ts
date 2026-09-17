export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export class CircuitBreaker {
  private failureThreshold: number;
  private recoveryTimeMs: number;
  private state: CircuitState = 'CLOSED';
  private failureCount: number = 0;
  private lastFailureTime: number = 0;

  constructor(failureThreshold: number = 5, recoveryTimeMs: number = 10000) {
    this.failureThreshold = failureThreshold;
    this.recoveryTimeMs = recoveryTimeMs;
  }

  public async execute<T>(fn: () => Promise<T>, fallback?: () => T): Promise<T> {
    const now = Date.now();

    if (this.state === 'OPEN') {
      if (now - this.lastFailureTime > this.recoveryTimeMs) {
        this.state = 'HALF_OPEN';
      } else {
        if (fallback) return fallback();
        throw new Error('CircuitBreaker is OPEN. Execution blocked.');
      }
    }

    try {
      const result = await fn();
      if (this.state === 'HALF_OPEN') {
        this.reset();
      }
      return result;
    } catch (err) {
      this.recordFailure();
      if (fallback) return fallback();
      throw err;
    }
  }

  private recordFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }

  public reset(): void {
    this.state = 'CLOSED';
    this.failureCount = 0;
  }

  public getState(): CircuitState {
    return this.state;
  }
}

export class RateLimiter {
  private capacity: number;
  private refillRatePerSec: number;
  private tokens: number;
  private lastRefillTimestamp: number;

  constructor(capacity: number = 100, refillRatePerSec: number = 10) {
    this.capacity = capacity;
    this.refillRatePerSec = refillRatePerSec;
    this.tokens = capacity;
    this.lastRefillTimestamp = Date.now();
  }

  public allowRequest(tokensRequested: number = 1): boolean {
    this.refill();
    if (this.tokens >= tokensRequested) {
      this.tokens -= tokensRequested;
      return true;
    }
    return false;
  }

  private refill(): void {
    const now = Date.now();
    const elapsedSecs = (now - this.lastRefillTimestamp) / 1000;
    this.tokens = Math.min(this.capacity, this.tokens + elapsedSecs * this.refillRatePerSec);
    this.lastRefillTimestamp = now;
  }
}

export class Singleflight {
  private inFlightCalls: Map<string, Promise<any>> = new Map();

  public async do<T>(key: string, fn: () => Promise<T>): Promise<T> {
    if (this.inFlightCalls.has(key)) {
      return this.inFlightCalls.get(key) as Promise<T>;
    }

    const promise = (async () => {
      try {
        return await fn();
      } finally {
        this.inFlightCalls.delete(key);
      }
    })();

    this.inFlightCalls.set(key, promise);
    return promise;
  }
}
