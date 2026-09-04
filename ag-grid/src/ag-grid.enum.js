"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RowDefaultValues = exports.ExtraArgsStrategy = exports.CustomWhereKeys = exports.SortDirection = exports.Operators = exports.FilterType = exports.GeneralFilters = void 0;
exports.entityFieldsEnumFactory = entityFieldsEnumFactory;
const class_helper_1 = require("@nestjs-yalc/utils/class.helper");
const graphql_1 = require("@nestjs/graphql");
const ag_grid_metadata_helper_1 = require("./ag-grid-metadata.helper");
var GeneralFilters;
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
})(GeneralFilters || (exports.GeneralFilters = GeneralFilters = {}));
(0, graphql_1.registerEnumType)(GeneralFilters, {
    name: 'GeneralFiltersEnum',
});
var FilterType;
(function (FilterType) {
    FilterType["TEXT"] = "text";
    FilterType["MULTI"] = "multi";
    FilterType["NUMBER"] = "number";
    FilterType["DATE"] = "date";
    FilterType["SET"] = "set";
})(FilterType || (exports.FilterType = FilterType = {}));
(0, graphql_1.registerEnumType)(FilterType, {
    name: 'FilterTypeEnum',
});
var Operators;
(function (Operators) {
    Operators["AND"] = "AND";
    Operators["OR"] = "OR";
})(Operators || (exports.Operators = Operators = {}));
(0, graphql_1.registerEnumType)(Operators, {
    name: 'FilterOperatorsEnum',
});
var SortDirection;
(function (SortDirection) {
    SortDirection["DESC"] = "DESC";
    SortDirection["ASC"] = "ASC";
})(SortDirection || (exports.SortDirection = SortDirection = {}));
(0, graphql_1.registerEnumType)(SortDirection, {
    name: 'SortDirection',
});
var CustomWhereKeys;
(function (CustomWhereKeys) {
    CustomWhereKeys["MULTICOLUMNJOINOPTIONS"] = "multiColumnJoinOptions";
    CustomWhereKeys["MULTICOLUMNJOINOPERATOR"] = "multiColumnJoinOperator";
    CustomWhereKeys["OPERATOR"] = "operator";
})(CustomWhereKeys || (exports.CustomWhereKeys = CustomWhereKeys = {}));
var ExtraArgsStrategy;
(function (ExtraArgsStrategy) {
    ExtraArgsStrategy[ExtraArgsStrategy["DEFAULT"] = 0] = "DEFAULT";
    ExtraArgsStrategy[ExtraArgsStrategy["AT_LEAST_ONE"] = 1] = "AT_LEAST_ONE";
    ExtraArgsStrategy[ExtraArgsStrategy["ONLY_ONE"] = 2] = "ONLY_ONE";
})(ExtraArgsStrategy || (exports.ExtraArgsStrategy = ExtraArgsStrategy = {}));
var RowDefaultValues;
(function (RowDefaultValues) {
    RowDefaultValues[RowDefaultValues["END_ROW"] = 100] = "END_ROW";
    RowDefaultValues[RowDefaultValues["START_ROW"] = 0] = "START_ROW";
    RowDefaultValues[RowDefaultValues["MAX_ROW"] = 200] = "MAX_ROW";
})(RowDefaultValues || (exports.RowDefaultValues = RowDefaultValues = {}));
const fieldsEnumCache = new WeakMap();
function entityFieldsEnumFactory(entityModel) {
    let cached;
    const prototype = !(0, class_helper_1.isClass)(entityModel) ? entityModel.prototype : entityModel;
    if ((cached = fieldsEnumCache.get(prototype)))
        return cached;
    const properties = {};
    (0, ag_grid_metadata_helper_1.getMappedTypeProperties)(prototype).map((v) => (properties[v] = v));
    const FieldsEnum = Object.assign({}, properties);
    (0, graphql_1.registerEnumType)(FieldsEnum, {
        name: `${prototype.name}FieldEnum`,
    });
    fieldsEnumCache.set(prototype, FieldsEnum);
    return FieldsEnum;
}
//# sourceMappingURL=ag-grid.enum.js.map