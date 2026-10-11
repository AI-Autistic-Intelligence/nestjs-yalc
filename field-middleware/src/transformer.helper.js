"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultDateTransformer = exports.enumTransformer = void 0;
const date_helper_js_1 = require("@node-yalc/utils/date.helper.js");
const enum_helper_js_1 = require("@node-yalc/utils/enum.helper.js");
/**
 * Function for transforming the unfitting enum data to null after reading it from the database
 * @param enumName: enum object for checking if the column value belongs to it
 * @returns ValueTransformer object
 */
const enumTransformer = (enumName) => {
    const transformer = (value) => {
        return (0, enum_helper_js_1.belongsToEnum)(enumName, value) ? value : null;
    };
    return {
        to: (value) => value, // no transformation for writing
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
//# sourceMappingURL=transformer.helper.js.map