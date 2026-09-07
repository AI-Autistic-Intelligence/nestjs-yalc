"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultDateTransformer = exports.enumTransformer = void 0;
const date_helper_js_1 = require("@nest-yalc-2/utils/date.helper.js");
const enum_helper_js_1 = require("@nest-yalc-2/utils/enum.helper.js");
const enumTransformer = (enumName) => {
    const transformer = (value) => {
        return (0, enum_helper_js_1.belongsToEnum)(enumName, value) ? value : null;
    };
    return {
        to: (value) => value,
        from: transformer,
    };
};
exports.enumTransformer = enumTransformer;
const defaultDateTransformer = () => {
    const transform = (value) => {
        if (!value) {
            return date_helper_js_1.DateHelper.dateToSQLDateTime(new Date());
        }
        return value;
    };
    return {
        from: (value) => value,
        to: transform,
    };
};
exports.defaultDateTransformer = defaultDateTransformer;
//# sourceMappingURL=typeorm-transformer.helper.js.map