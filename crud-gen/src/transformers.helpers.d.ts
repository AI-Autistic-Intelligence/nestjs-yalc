import { ClassType } from '@node-yalc/types/globals.js';
export declare function JsonTransformer(field: string, propertyPath: string): (dstObj: Record<any, any>, srcValue: any) => any;
export interface IYalcTransformer<TSrc> {
    onAfterTransform?: {
        (srcObj: TSrc | any): void;
    };
}
export declare function isYalcTransformerGuard<TSrc>(obj: any): obj is IYalcTransformer<TSrc>;
/**
 * Extended version of the plainToInstance
 * It support the IYalcTransformer interface to be able to
 * hook into the transformation process and trigger extra events for more complex
 * transformations. It also avoid unwanted behaviours when the plain value is not
 * an object.
 */
export declare function yalcPlainToInstance<TDest, TSrc = TDest>(cls: ClassType<TDest | IYalcTransformer<TSrc>>, plain: TSrc): TDest;
/**
 * Just a shortcut for the yalcPlainToInstance
 * with cls and plain as the same type
 * This method is useful when you want to instantiate any class
 * without specifying the constructor, and still be able to use the
 * transformer hooks
 */
export declare function yalcNew<T>(cls: ClassType<T | IYalcTransformer<T>>, plain: T): T;
