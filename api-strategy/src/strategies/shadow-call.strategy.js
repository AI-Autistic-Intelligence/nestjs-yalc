"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShadowCallStrategy = void 0;
class ShadowCallStrategy {
    constructor(primary, shadows, options = {}) {
        var _a, _b;
        this.primary = primary;
        this.shadows = shadows;
        if (shadows.length === 0) {
            throw new Error('ShadowCallStrategy requires at least one shadow strategy.');
        }
        this.shadowErrorMode = (_a = options.shadowErrorMode) !== null && _a !== void 0 ? _a : 'ignore';
        this.awaitShadows =
            (_b = options.awaitShadows) !== null && _b !== void 0 ? _b : this.shadowErrorMode === 'throw';
    }
    call(path, options) {
        return this.execute((strategy) => strategy.call(path, options), (strategy) => strategy.call(path, options));
    }
    get(path, options) {
        return this.execute((strategy) => strategy.get(path, options), (strategy) => strategy.get(path, options));
    }
    post(path, options) {
        return this.execute((strategy) => strategy.post(path, options), (strategy) => strategy.post(path, options));
    }
    async execute(primaryCall, shadowCall) {
        const primaryResult = await primaryCall(this.primary);
        const shadowExecution = Promise.all(this.shadows.map((strategy) => shadowCall(strategy)));
        if (this.awaitShadows) {
            if (this.shadowErrorMode === 'throw') {
                await shadowExecution;
            }
            else {
                await shadowExecution.catch(() => undefined);
            }
        }
        else {
            void shadowExecution.catch(() => undefined);
        }
        return primaryResult;
    }
}
exports.ShadowCallStrategy = ShadowCallStrategy;
//# sourceMappingURL=shadow-call.strategy.js.map