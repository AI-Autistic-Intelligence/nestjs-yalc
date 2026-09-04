import { ClassType, Mixin } from '@nestjs-yalc/types';
export declare const EntityWithTimestamps: <T extends ClassType>(base: T) => {
    new (): {
        createdAt: Date;
        updatedAt: Date;
    };
};
export type EntityWithTimestamps = Mixin<typeof EntityWithTimestamps>;
