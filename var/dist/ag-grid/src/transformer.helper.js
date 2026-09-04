import { deepMerge, objectSetProp } from '@nestjs-yalc/utils/object.helper';
export function JsonTransformer(field, propertyPath) {
    return (dstObj, srcValue) => {
        const patch = objectSetProp({}, propertyPath, srcValue);
        dstObj[field] = deepMerge(dstObj[field] ?? {}, patch);
    };
}
//# sourceMappingURL=transformer.helper.js.map