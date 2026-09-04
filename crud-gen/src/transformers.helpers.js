"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonTransformer = JsonTransformer;
exports.isYalcTransformerGuard = isYalcTransformerGuard;
exports.yalcPlainToInstance = yalcPlainToInstance;
exports.yalcNew = yalcNew;
const object_helper_js_1 = require("@nestjs-yalc/utils/object.helper.js");
const class_transformer_1 = require("class-transformer");
function JsonTransformer(field, propertyPath) {
    return (dstObj, srcValue) => {
        var _a;
        const patch = (0, object_helper_js_1.objectSetProp)({}, propertyPath, srcValue);
        const merged = (0, object_helper_js_1.deepMerge)((_a = dstObj[field]) !== null && _a !== void 0 ? _a : {}, patch);
        dstObj[field] = merged;
        return merged;
    };
}
function isYalcTransformerGuard(obj) {
    return (obj === null || obj === void 0 ? void 0 : obj.onAfterTransform) !== undefined;
}
function yalcPlainToInstance(cls, plain) {
    var _a;
    const instance = (0, class_transformer_1.plainToInstance)(cls, typeof plain === 'object' ? plain : {});
    if (isYalcTransformerGuard(instance)) {
        (_a = instance.onAfterTransform) === null || _a === void 0 ? void 0 : _a.call(instance, plain);
        delete instance.onAfterTransform;
    }
    return instance;
}
function yalcNew(cls, plain) {
    return yalcPlainToInstance(cls, plain);
}
//# sourceMappingURL=transformers.helpers.js.map