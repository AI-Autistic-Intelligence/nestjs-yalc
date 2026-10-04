import { ClassType, Mixin } from '@node-yalc/types/globals.js';
export declare const JsonEntityMixin: <T extends ClassType>(base: T) => {
    new (...args: any[]): {
        [x: string]: any;
        updateData(): void;
    };
} & T;
export type JsonEntityMixin = Mixin<typeof JsonEntityMixin>;
