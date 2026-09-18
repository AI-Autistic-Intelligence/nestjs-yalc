interface IIsObject {
    (item: any): boolean;
}
interface IObject {
    [key: string]: any;
}
interface IDeepMerge {
    (target: IObject, ...sources: Array<IObject>): IObject;
}
export declare const isObject: IIsObject;
export declare function isObjectStrict(val: any): val is Record<string, any>;
export declare const _deepMerge: (isArrayConcat: boolean, target: IObject, ...sources: Array<IObject>) => IObject;
export declare const deepMerge: IDeepMerge;
export declare const deepMergeWithoutArrayConcat: IDeepMerge;
export declare function objectSetProp(obj: Record<any, any>, path: string, value: any): Record<any, any>;
export declare function objectsHaveSameKeys(...objects: any[]): boolean;
export declare function getObjectId(object: Record<string, unknown> | Array<unknown>): number;
export {};
