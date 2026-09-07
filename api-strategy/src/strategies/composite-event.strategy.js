"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompositeEventStrategy = void 0;
class CompositeEventStrategy {
    constructor(strategies, options = {}) {
        this.strategies = strategies;
        if (strategies.length === 0) {
            throw new Error('CompositeEventStrategy requires at least one strategy.');
        }
        this.errorMode = options.errorMode ?? 'throw';
    }
    emit(path, payload, options) {
        const results = [];
        for (const strategy of this.strategies) {
            try {
                results.push(strategy.emit(path, payload, options));
            }
            catch (error) {
                if (this.errorMode === 'throw') {
                    throw error;
                }
            }
        }
        return results;
    }
    async emitAsync(path, payload, options) {
        const settled = await Promise.allSettled(this.strategies.map((strategy) => strategy.emitAsync(path, payload, options)));
        const results = [];
        for (const result of settled) {
            if (result.status === 'fulfilled') {
                results.push(result.value);
            }
            else if (this.errorMode === 'throw') {
                throw result.reason;
            }
        }
        return results;
    }
    async onModuleDestroy() {
        await Promise.all(this.strategies.map(async (strategy) => {
            await maybeDestroyStrategy(strategy);
        }));
    }
}
exports.CompositeEventStrategy = CompositeEventStrategy;
async function maybeDestroyStrategy(strategy) {
    const destroyable = strategy;
    if (typeof destroyable.onModuleDestroy === 'function') {
        await destroyable.onModuleDestroy();
    }
}
//# sourceMappingURL=composite-event.strategy.js.map