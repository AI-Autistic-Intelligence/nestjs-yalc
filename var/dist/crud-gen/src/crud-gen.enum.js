import { isClass } from '@nestjs-yalc/utils/class.helper.js';
import { getMappedTypeProperties } from './crud-gen.helpers.js';
export var GeneralFilters;
(function (GeneralFilters) {
    GeneralFilters["NOT"] = "not";
    GeneralFilters["CONTAINS"] = "contains";
    GeneralFilters["NOTCONTAINS"] = "notContains";
    GeneralFilters["EQUALS"] = "equals";
    GeneralFilters["EQUAL"] = "equal";
    GeneralFilters["NOTEQUAL"] = "notEqual";
    GeneralFilters["LIKE"] = "like";
    GeneralFilters["NOTLIKE"] = "notLike";
    GeneralFilters["BETWEEN"] = "between";
    GeneralFilters["NOTBETWEEN"] = "notBetween";
    GeneralFilters["IN"] = "in";
    GeneralFilters["NOTIN"] = "notIn";
    GeneralFilters["STARTSWITH"] = "startsWith";
    GeneralFilters["NOTSTARTSWITH"] = "notStartsWith";
    GeneralFilters["ENDSWITH"] = "endsWith";
    GeneralFilters["NOTENDSWITH"] = "notEndsWith";
    GeneralFilters["LESSTHAN"] = "lessThan";
    GeneralFilters["NOTLESSTHAN"] = "notLessThan";
    GeneralFilters["LESSTHANOREQUAL"] = "lessThanOrEqual";
    GeneralFilters["NOTLESSTHANOREQUAL"] = "notLessThanOrEqual";
    GeneralFilters["GREATERTHAN"] = "greaterThan";
    GeneralFilters["NOTGREATERTHAN"] = "notGreaterThan";
    GeneralFilters["GREATERTHANOREQUAL"] = "greaterThanOrEqual";
    GeneralFilters["NOTGREATERTHANOREQUAL"] = "notGreaterThanOrEqual";
    GeneralFilters["INRANGE"] = "inRange";
    GeneralFilters["INDATE"] = "inDate";
    GeneralFilters["ISNULL"] = "isNull";
    GeneralFilters["NOTISNULL"] = "notIsNull";
    GeneralFilters["VIRTUAL"] = "virtual";
})(GeneralFilters || (GeneralFilters = {}));
export var FilterType;
(function (FilterType) {
    FilterType["TEXT"] = "text";
    FilterType["MULTI"] = "multi";
    FilterType["NUMBER"] = "number";
    FilterType["DATE"] = "date";
    FilterType["SET"] = "set";
})(FilterType || (FilterType = {}));
export var Operators;
(function (Operators) {
    Operators["AND"] = "AND";
    Operators["OR"] = "OR";
})(Operators || (Operators = {}));
export var SortDirection;
(function (SortDirection) {
    SortDirection["DESC"] = "DESC";
    SortDirection["ASC"] = "ASC";
})(SortDirection || (SortDirection = {}));
export var CustomWhereKeys;
(function (CustomWhereKeys) {
    CustomWhereKeys["MULTICOLUMNJOINOPTIONS"] = "multiColumnJoinOptions";
    CustomWhereKeys["MULTICOLUMNJOINOPERATOR"] = "multiColumnJoinOperator";
    CustomWhereKeys["OPERATOR"] = "operator";
})(CustomWhereKeys || (CustomWhereKeys = {}));
export var ExtraArgsStrategy;
(function (ExtraArgsStrategy) {
    ExtraArgsStrategy[ExtraArgsStrategy["DEFAULT"] = 0] = "DEFAULT";
    ExtraArgsStrategy[ExtraArgsStrategy["AT_LEAST_ONE"] = 1] = "AT_LEAST_ONE";
    ExtraArgsStrategy[ExtraArgsStrategy["ONLY_ONE"] = 2] = "ONLY_ONE";
})(ExtraArgsStrategy || (ExtraArgsStrategy = {}));
export var RowDefaultValues;
(function (RowDefaultValues) {
    RowDefaultValues[RowDefaultValues["END_ROW"] = 100] = "END_ROW";
    RowDefaultValues[RowDefaultValues["START_ROW"] = 0] = "START_ROW";
    RowDefaultValues[RowDefaultValues["MAX_ROW"] = 200] = "MAX_ROW";
})(RowDefaultValues || (RowDefaultValues = {}));
const fieldsEnumCache = new WeakMap();
export function entityFieldsEnumFactory(entityModel) {
    let cached;
    const prototype = !isClass(entityModel) ? entityModel.prototype : entityModel;
    if ((cached = fieldsEnumCache.get(prototype)))
        return {
            enum: cached,
            cached: true,
            prototype,
        };
    const properties = {};
    getMappedTypeProperties(prototype).map((v) => (properties[v] = v));
    const FieldsEnum = { ...properties };
    fieldsEnumCache.set(prototype, FieldsEnum);
    return { enum: FieldsEnum, cached: false, prototype };
}
//# sourceMappingURL=crud-gen.enum.js.map