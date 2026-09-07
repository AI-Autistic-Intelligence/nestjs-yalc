import { ClassType, Mixin } from '@nest-yalc-2/types';
export declare const JsonEntityMixin: <T extends ClassType>(base: T) => {
    new (...args: any[]): {
        [x: string]: any;
        updateData(): void;
    };
} & T;
export type JsonEntityMixin = Mixin<typeof JsonEntityMixin>;
