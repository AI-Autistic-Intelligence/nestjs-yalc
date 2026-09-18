import { ReturnOrFunctionReturnType } from '@nest-yalc-2/types/globals.d.js';
export type ConfigTuple<K, T> = {
    k: K | K[];
    v: T;
};
export declare function checkForDuplicateKeys<K>(keys: K[]): void;
export declare class ConfigValueManager {
    static value: <K, T, TDefault = undefined>(currentKey: K, configurations: ConfigTuple<K, T> | ConfigTuple<K, T>[], defaultValue?: TDefault) => ReturnOrFunctionReturnType<T> | ReturnOrFunctionReturnType<TDefault>;
    static is: <K>(currentKey: K, keys: K[] | K, isNegative?: boolean) => any;
    static only: <K, T>(currentKey: K, keys: K[] | K, value: T) => ReturnOrFunctionReturnType<T> | undefined;
    static skip: <K, T>(currentKey: K, keys: K[] | K, value: T) => ReturnOrFunctionReturnType<T> | undefined;
}
