"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConditionalCallStrategy = void 0;
class ConditionalCallStrategy {
    constructor(strategy, options = {}) {
        this.strategy = strategy;
        this.options = options;
    }
    call(path, options) {
        return this.whenEnabled(() => this.strategy.call(path, options));
    }
    get(path, options) {
        return this.whenEnabled(() => this.strategy.get(path, options));
    }
    post(path, options) {
        return this.whenEnabled(() => this.strategy.post(path, options));
    }
    async whenEnabled(execute) {
        if (this.isEnabled()) {
            return execute();
        }
        if (this.options.disabledResponse) {
            return this.options.disabledResponse;
        }
        throw this.resolveDisabledError();
    }
    isEnabled() {
        return typeof this.options.enabled === 'function'
            ? this.options.enabled()
            : this.options.enabled !== false;
    }
    resolveDisabledError() {
        if (typeof this.options.disabledError === 'function') {
            return this.options.disabledError();
        }
        return (this.options.disabledError ??
            new Error('ConditionalCallStrategy is disabled.'));
    }
}
exports.ConditionalCallStrategy = ConditionalCallStrategy;
//# sourceMappingURL=conditional-call.strategy.js.map