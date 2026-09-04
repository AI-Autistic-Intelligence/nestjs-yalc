"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FallbackCallStrategy = void 0;
class FallbackCallStrategy {
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
        var _a, _b, _c;
        return (_c = (_b = (_a = this.options).shouldFallback) === null || _b === void 0 ? void 0 : _b.call(_a, error, strategyIndex)) !== null && _c !== void 0 ? _c : true;
    }
}
exports.FallbackCallStrategy = FallbackCallStrategy;
//# sourceMappingURL=fallback-call.strategy.js.map