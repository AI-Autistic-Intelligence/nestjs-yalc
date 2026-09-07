"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConditionalEventStrategy = void 0;
class ConditionalEventStrategy {
    constructor(strategy, options = {}) {
        this.strategy = strategy;
        this.options = options;
    }
    emit(path, payload, options) {
        if (!this.shouldRun(path, payload, options)) {
            return this.options.disabledResult;
        }
        return this.strategy.emit(path, payload, options);
    }
    async emitAsync(path, payload, options) {
        if (!this.shouldRun(path, payload, options)) {
            return this.options.disabledResult;
        }
        return this.strategy.emitAsync(path, payload, options);
    }
    async onModuleDestroy() {
        const destroyable = this.strategy;
        if (typeof destroyable.onModuleDestroy === 'function') {
            await destroyable.onModuleDestroy();
        }
    }
    shouldRun(path, payload, options) {
        const enabled = typeof this.options.enabled === 'function'
            ? this.options.enabled()
            : this.options.enabled;
        if (enabled === false) {
            return false;
        }
        return this.options.shouldEmit?.(path, payload, options) ?? true;
    }
}
exports.ConditionalEventStrategy = ConditionalEventStrategy;
//# sourceMappingURL=conditional-event.strategy.js.map