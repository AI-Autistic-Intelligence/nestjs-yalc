import { ClassType, Mixin } from '@node-yalc/types/globals.js';
export declare const EntityWithTimestamps: <T extends ClassType>(base: T) => {
    new (...args: any[]): {
        [x: string]: any;
        createdAt: Date;
        updatedAt: Date;
    };
} & T;
export type EntityWithTimestamps = Mixin<typeof EntityWithTimestamps>;
