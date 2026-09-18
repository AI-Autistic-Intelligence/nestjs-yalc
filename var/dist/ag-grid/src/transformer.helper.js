"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonTransformer = JsonTransformer;
const object_helper_1 = require("@nest-yalc-2/utils/object.helper");
function JsonTransformer(field, propertyPath) {
    return (dstObj, srcValue) => {
        const patch = (0, object_helper_1.objectSetProp)({}, propertyPath, srcValue);
        dstObj[field] = (0, object_helper_1.deepMerge)(dstObj[field] ?? {}, patch);
    };
}
//# sourceMappingURL=transformer.helper.js.map