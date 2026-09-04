"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalPromiseTracker = exports.PromiseTracker = exports.PROMISE_CONCURRENCY_LIMIT = void 0;
exports.promiseMap = promiseMap;
const pMap = __importStar(require("p-map"));
exports.PROMISE_CONCURRENCY_LIMIT = 1000;
function promiseMap(input, mapper, options) {
    var _a, _b;
    return pMap.default(input, mapper, {
        concurrency: (_a = options === null || options === void 0 ? void 0 : options.concurrency) !== null && _a !== void 0 ? _a : exports.PROMISE_CONCURRENCY_LIMIT,
        stopOnError: (_b = options === null || options === void 0 ? void 0 : options.stopOnError) !== null && _b !== void 0 ? _b : true,
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