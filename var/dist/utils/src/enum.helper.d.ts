import { Spread } from '@nestjs-yalc/types';
export declare const belongsToEnum: <T extends Record<string, any>>(enumObj: T, value: string | number) => boolean;
type Merge<T extends readonly any[]> = T extends readonly [infer H, ...infer R] ? Spread<H, Merge<R>> : Record<string, unknown>;
export declare const mergeEnums: <T extends any[]>(...enums: T) => Merge<T>;
export {};
