"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpAbstractStrategy = void 0;
class HttpAbstractStrategy {
    get(path, options) {
        return this.call(path, {
            ...options,
            method: 'GET',
        });
    }
    post(path, options) {
        return this.call(path, {
            ...options,
            method: 'POST',
        });
    }
}
exports.HttpAbstractStrategy = HttpAbstractStrategy;
//# sourceMappingURL=http-abstract-call.strategy.js.map