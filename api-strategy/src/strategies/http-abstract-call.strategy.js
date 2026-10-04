export class HttpAbstractStrategy {
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
//# sourceMappingURL=http-abstract-call.strategy.js.map