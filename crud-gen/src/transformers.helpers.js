"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonTransformer = JsonTransformer;
exports.isYalcTransformerGuard = isYalcTransformerGuard;
exports.yalcPlainToInstance = yalcPlainToInstance;
exports.yalcNew = yalcNew;
const object_helper_js_1 = require("@nest-yalc-2/utils/object.helper.js");
const class_transformer_1 = require("class-transformer");
function JsonTransformer(field, propertyPath) {
    return (dstObj, srcValue) => {
        const patch = (0, object_helper_js_1.objectSetProp)({}, propertyPath, srcValue);
        const merged = (0, object_helper_js_1.deepMerge)(dstObj[field] ?? {}, patch);
        dstObj[field] = merged;
        return merged;
    };
}
function isYalcTransformerGuard(obj) {
    return obj?.onAfterTransform !== undefined;
}
function yalcPlainToInstance(cls, plain) {
    const instance = (0, class_transformer_1.plainToInstance)(cls, typeof plain === 'object' ? plain : {});
    if (isYalcTransformerGuard(instance)) {
        instance.onAfterTransform?.(plain);
        delete instance.onAfterTransform;
    }
    return instance;
}
function yalcNew(cls, plain) {
    return yalcPlainToInstance(cls, plain);
}
//# sourceMappingURL=transformers.helpers.js.map