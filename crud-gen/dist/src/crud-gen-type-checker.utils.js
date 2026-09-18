"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFilterInputStrict = isFilterInputStrict;
exports.isFilterModel = isFilterModel;
exports.isTextFilterModel = isTextFilterModel;
exports.isNumberFilterModel = isNumberFilterModel;
exports.isSetFilterModel = isSetFilterModel;
exports.isDateFilterModel = isDateFilterModel;
exports.isCombinedFilterModel = isCombinedFilterModel;
exports.isCombinedWhereModel = isCombinedWhereModel;
exports.isMulticolumnJoinOptions = isMulticolumnJoinOptions;
exports.isFindOperator = isFindOperator;
exports.isOperator = isOperator;
const crud_gen_enum_js_1 = require("./crud-gen.enum.js");
function isFilterInputStrict(currentFilter) {
    return !isMulticolumnJoinOptions(currentFilter) && !isOperator(currentFilter);
}
function isFilterModel(filter) {
    const casted = filter;
    return (isSetFilterModel(casted) ||
        (casted?.type !== undefined && casted.filterType !== undefined));
}
function isTextFilterModel(filter) {
    if (!filter)
        return false;
    if (isCombinedFilterModel(filter)) {
        return (isTextFilterModel(filter.condition1) &&
            isTextFilterModel(filter.condition2));
    }
    else {
        return filter.filterType === crud_gen_enum_js_1.FilterType.TEXT;
    }
}
function isNumberFilterModel(filter) {
    if (!filter)
        return false;
    if (isCombinedFilterModel(filter)) {
        return (isNumberFilterModel(filter.condition1) &&
            isNumberFilterModel(filter.condition2));
    }
    else {
        return filter.filterType === crud_gen_enum_js_1.FilterType.NUMBER;
    }
}
function isSetFilterModel(filter) {
    if (!filter)
        return false;
    return filter.filterType === crud_gen_enum_js_1.FilterType.SET;
}
function isDateFilterModel(filter) {
    if (!filter)
        return false;
    if (isCombinedFilterModel(filter)) {
        return (isDateFilterModel(filter.condition1) &&
            isDateFilterModel(filter.condition2));
    }
    else {
        return filter.filterType === crud_gen_enum_js_1.FilterType.DATE;
    }
}
function isCombinedFilterModel(filter) {
    const casted = filter;
    return (casted &&
        casted.operator !== undefined &&
        casted.condition1 !== undefined &&
        casted.condition2 !== undefined);
}
function isCombinedWhereModel(filter) {
    const casted = filter;
    return (casted &&
        casted.operator !== undefined &&
        casted.filter_1 !== undefined &&
        casted.filter_2 !== undefined);
}
function isMulticolumnJoinOptions(filter) {
    return (filter &&
        filter.multiColumnJoinOperator !== undefined);
}
function isFindOperator(filter) {
    const casted = filter;
    return (casted &&
        casted.type !== undefined &&
        (casted.value !== undefined ||
            casted.child !== undefined ||
            casted.type.toLowerCase() === crud_gen_enum_js_1.GeneralFilters.ISNULL.toLowerCase()));
}
function isOperator(val) {
    return Object.values(crud_gen_enum_js_1.Operators).includes(typeof val === 'string' ? val.toUpperCase() : val);
}
//# sourceMappingURL=crud-gen-type-checker.utils.js.map