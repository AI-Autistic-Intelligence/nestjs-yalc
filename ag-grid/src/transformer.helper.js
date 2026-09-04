"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonTransformer = JsonTransformer;
const object_helper_1 = require("@nestjs-yalc/utils/object.helper");
function JsonTransformer(field, propertyPath) {
    return (dstObj, srcValue) => {
        var _a;
        const patch = (0, object_helper_1.objectSetProp)({}, propertyPath, srcValue);
        dstObj[field] = (0, object_helper_1.deepMerge)((_a = dstObj[field]) !== null && _a !== void 0 ? _a : {}, patch);
    };
}
//# sourceMappingURL=transformer.helper.js.map