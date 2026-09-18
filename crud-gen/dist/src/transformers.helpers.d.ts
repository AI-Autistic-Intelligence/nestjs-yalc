import { ClassType } from '@node-yalc/types/globals';
export declare function JsonTransformer(field: string, propertyPath: string): (dstObj: Record<any, any>, srcValue: any) => any;
export interface IYalcTransformer<TSrc> {
    onAfterTransform?: {
        (srcObj: TSrc | any): void;
    };
}
export declare function isYalcTransformerGuard<TSrc>(obj: any): obj is IYalcTransformer<TSrc>;
export declare function yalcPlainToInstance<TDest, TSrc = TDest>(cls: ClassType<TDest | IYalcTransformer<TSrc>>, plain: TSrc): TDest;
export declare function yalcNew<T>(cls: ClassType<T | IYalcTransformer<T>>, plain: T): T;
