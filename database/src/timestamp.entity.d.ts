import { ClassType, Mixin } from '@node-yalc/types/globals.js';
/**
 * This is a mixin class that can be used to implement the createdAt and updatedAt
 * Database fields in a standardized way
 *
 */
export declare const EntityWithTimestamps: <T extends ClassType>(base: T) => {
    new (...args: any[]): {
        [x: string]: any;
        /**
         * DB insert time.
         */
        createdAt: Date;
        /**
         * DB last update time.
         */
        updatedAt: Date;
    };
} & T;
export type EntityWithTimestamps = Mixin<typeof EntityWithTimestamps>;
