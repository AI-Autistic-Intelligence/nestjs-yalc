import { Spread } from '@nestjs-yalc/types/globals.d.js';
export declare const belongsToEnum: <T extends Record<string, string | number>>(enumObj: T, value: string | number) => boolean;
type Merge<T extends readonly any[]> = T extends readonly [infer H, ...infer R] ? Spread<H, Merge<R>> : {};
export declare const mergeEnums: <T extends any[]>(...enums: T) => Merge<T>;
export declare const getEnumValueByEnumKey: <T extends {
    [index: string]: string;
}>(myEnum: T, enumKey: string | undefined) => any | null;
export {};
