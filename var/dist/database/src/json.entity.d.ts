import { ClassType, Mixin } from '@nestjs-yalc/types';
export declare const JsonEntityMixin: <T extends ClassType>(base: T) => {
    new (): {
        updateData(): void;
    };
};
export type JsonEntityMixin = Mixin<typeof JsonEntityMixin>;
