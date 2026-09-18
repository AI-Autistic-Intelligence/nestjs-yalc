import { ClassType, Mixin } from '@nest-yalc-2/types';
export declare const JsonEntityMixin: <T extends ClassType>(base: T) => {
    new (): {
        updateData(): void;
    };
};
export type JsonEntityMixin = Mixin<typeof JsonEntityMixin>;
