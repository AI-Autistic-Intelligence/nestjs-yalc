"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalPromiseTracker = exports.PromiseTracker = exports.PROMISE_CONCURRENCY_LIMIT = void 0;
exports.promiseMap = promiseMap;
const tslib_1 = require("tslib");
const pMap = tslib_1.__importStar(require("p-map"));
exports.PROMISE_CONCURRENCY_LIMIT = 1000;
function promiseMap(input, mapper, options) {
    return pMap.default(input, mapper, {
        concurrency: options?.concurrency ?? exports.PROMISE_CONCURRENCY_LIMIT,
        stopOnError: options?.stopOnError ?? true,
    });
}
class PromiseTracker {
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
exports.PromiseTracker = PromiseTracker;
exports.globalPromiseTracker = new PromiseTracker();
//# sourceMappingURL=promise.helper.js.map