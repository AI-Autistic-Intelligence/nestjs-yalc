import { ClassType, Mixin } from '@nest-yalc-2/types';
export declare const EntityWithTimestamps: <T extends ClassType>(base: T) => {
    new (...args: any[]): {
        [x: string]: any;
        createdAt: Date;
        updatedAt: Date;
    };
} & T;
export type EntityWithTimestamps = Mixin<typeof EntityWithTimestamps>;
