import { deepMerge, objectSetProp } from '@node-yalc/utils/object.helper.js';
import { plainToInstance } from 'class-transformer';
export function JsonTransformer(field, propertyPath) {
    return (dstObj, srcValue) => {
        const patch = objectSetProp({}, propertyPath, srcValue);
        const merged = deepMerge(dstObj[field] ?? {}, patch);
        dstObj[field] = merged;
        return merged;
    };
}
export function isYalcTransformerGuard(obj) {
    return obj?.onAfterTransform !== undefined;
}
/**
 * Extended version of the plainToInstance
 * It support the IYalcTransformer interface to be able to
 * hook into the transformation process and trigger extra events for more complex
 * transformations. It also avoid unwanted behaviours when the plain value is not
 * an object.
 */
export function yalcPlainToInstance(cls, plain) {
    const instance = plainToInstance(cls, typeof plain === 'object' ? plain : {});
    if (isYalcTransformerGuard(instance)) {
        instance.onAfterTransform?.(plain);
        delete instance.onAfterTransform;
    }
    return instance;
}
/**
 * Just a shortcut for the yalcPlainToInstance
 * with cls and plain as the same type
 * This method is useful when you want to instantiate any class
 * without specifying the constructor, and still be able to use the
 * transformer hooks
 */
export function yalcNew(cls, plain) {
    return yalcPlainToInstance(cls, plain);
}
//# sourceMappingURL=transformers.helpers.js.map