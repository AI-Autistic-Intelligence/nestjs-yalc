import { AnyFunction } from '@nest-yalc-2/types/globals.d.js';
import * as pMap from 'p-map';
export declare const PROMISE_CONCURRENCY_LIMIT = 1000;
export declare function promiseMap<Element, NewElement>(input: Iterable<Element>, mapper: pMap.Mapper<Element, NewElement>, options?: pMap.Options): Promise<NewElement[]>;
export declare class PromiseTracker {
    private promises;
    private deferred;
    add(promise: Promise<any>): void;
    addDeferred(deferred: AnyFunction): void;
    private remove;
    waitForAll(): Promise<void>;
}
export declare const globalPromiseTracker: PromiseTracker;
