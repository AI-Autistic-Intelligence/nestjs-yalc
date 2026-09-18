import { ClassType, Mixin } from '@nest-yalc-2/types';
export declare const EntityWithTimestamps: <T extends ClassType>(base: T) => {
    new (): {
        createdAt: Date;
        updatedAt: Date;
    };
};
export type EntityWithTimestamps = Mixin<typeof EntityWithTimestamps>;
