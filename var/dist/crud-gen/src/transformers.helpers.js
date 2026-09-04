import { deepMerge, objectSetProp } from '@nestjs-yalc/utils/object.helper.js';
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
export function yalcPlainToInstance(cls, plain) {
    const instance = plainToInstance(cls, typeof plain === 'object' ? plain : {});
    if (isYalcTransformerGuard(instance)) {
        instance.onAfterTransform?.(plain);
        delete instance.onAfterTransform;
    }
    return instance;
}
export function yalcNew(cls, plain) {
    return yalcPlainToInstance(cls, plain);
}
//# sourceMappingURL=transformers.helpers.js.map