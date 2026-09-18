"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultDateTransformer = exports.enumTransformer = void 0;
const date_helper_1 = require("@node-yalc/utils/date.helper");
const enum_helper_1 = require("@node-yalc/utils/enum.helper");
const enumTransformer = (enumName) => {
    const transformer = (value) => {
        return (0, enum_helper_1.belongsToEnum)(enumName, value) ? value : null;
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
            return date_helper_1.DateHelper.dateToSQLDateTime(new Date());
        }
        return value;
    };
    return {
        from: (value) => value,
        to: transform,
    };
};
exports.defaultDateTransformer = defaultDateTransformer;
//# sourceMappingURL=transformer.helper.js.map