export class ShadowCallStrategy {
    constructor(primary, shadows, options = {}) {
        this.primary = primary;
        this.shadows = shadows;
        if (shadows.length === 0) {
            throw new Error('ShadowCallStrategy requires at least one shadow strategy.');
        }
        this.shadowErrorMode = options.shadowErrorMode ?? 'ignore';
        this.awaitShadows =
            options.awaitShadows ?? this.shadowErrorMode === 'throw';
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
//# sourceMappingURL=shadow-call.strategy.js.map