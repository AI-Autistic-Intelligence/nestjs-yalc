import * as pMap from 'p-map';
export const PROMISE_CONCURRENCY_LIMIT = 1000;
export function promiseMap(input, mapper, options) {
    return pMap.default(input, mapper, {
        concurrency: options?.concurrency ?? PROMISE_CONCURRENCY_LIMIT,
        stopOnError: options?.stopOnError ?? true,
    });
}
export class PromiseTracker {
    constructor() {
        this.promises = [];
        this.deferred = [];
    }
    add(promise) {
        this.promises.push(promise);
        void promise
            .finally(() => this.remove(promise))
            .catch(() => {
        });
    }
    addDeferred(deferred) {
        this.deferred.push(deferred);
    }
    remove(promise) {
        this.promises = this.promises.filter((p) => p !== promise);
    }
    async waitForAll() {
        await Promise.all(this.promises);
        await Promise.all(this.deferred.map((d) => d()));
    }
}
export const globalPromiseTracker = new PromiseTracker();
//# sourceMappingURL=promise.helper.js.map