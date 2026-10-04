export class FallbackCallStrategy {
    constructor(strategies, options = {}) {
        this.strategies = strategies;
        this.options = options;
        if (strategies.length === 0) {
            throw new Error('FallbackCallStrategy requires at least one strategy.');
        }
    }
    call(path, options) {
        return this.execute((strategy) => strategy.call(path, options));
    }
    get(path, options) {
        return this.execute((strategy) => strategy.get(path, options));
    }
    post(path, options) {
        return this.execute((strategy) => strategy.post(path, options));
    }
    async execute(callStrategy) {
        let lastError;
        for (const [index, strategy] of this.strategies.entries()) {
            try {
                return await callStrategy(strategy);
            }
            catch (error) {
                lastError = error;
                if (!this.shouldFallback(error, index)) {
                    throw error;
                }
            }
        }
        throw lastError;
    }
    shouldFallback(error, strategyIndex) {
        return this.options.shouldFallback?.(error, strategyIndex) ?? true;
    }
}
//# sourceMappingURL=fallback-call.strategy.js.map