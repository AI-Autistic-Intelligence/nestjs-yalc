"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinTypes = exports.RowGroup = exports.SortModel = void 0;
exports.sortModelFactory = sortModelFactory;
exports.filterExpressionInputFactory = filterExpressionInputFactory;
exports.agJoinArgFactory = agJoinArgFactory;
const tslib_1 = require("tslib");
const graphql_1 = require("@nestjs/graphql");
const ag_grid_args_1 = require("./ag-grid.args");
const ag_grid_enum_1 = require("./ag-grid.enum");
const ag_grid_metadata_helper_1 = require("./ag-grid-metadata.helper");
let SortModel = class SortModel {
};
exports.SortModel = SortModel;
tslib_1.__decorate([
    (0, graphql_1.Field)(() => ag_grid_enum_1.SortDirection, { nullable: true, defaultValue: 'ASC' }),
    tslib_1.__metadata("design:type", String)
], SortModel.prototype, "sort", void 0);
exports.SortModel = SortModel = tslib_1.__decorate([
    (0, graphql_1.InputType)()
], SortModel);
const sortModelCacheMap = new WeakMap();
function sortModelFactory(entityModel) {
    const cached = sortModelCacheMap.get(entityModel);
    if (cached)
        return cached;
    const fieldsEnum = (0, ag_grid_enum_1.entityFieldsEnumFactory)(entityModel);
    let SortModel = class SortModel {
    };
    tslib_1.__decorate([
        (0, graphql_1.Field)(() => fieldsEnum),
        tslib_1.__metadata("design:type", Object)
    ], SortModel.prototype, "colId", void 0);
    tslib_1.__decorate([
        (0, graphql_1.Field)(() => ag_grid_enum_1.SortDirection, { nullable: true, defaultValue: 'ASC' }),
        tslib_1.__metadata("design:type", String)
    ], SortModel.prototype, "sort", void 0);
    SortModel = tslib_1.__decorate([
        (0, graphql_1.InputType)(`${entityModel.name}SortModel`)
    ], SortModel);
    sortModelCacheMap.set(entityModel, SortModel);
    return SortModel;
}
let RowGroup = class RowGroup {
};
exports.RowGroup = RowGroup;
exports.RowGroup = RowGroup = tslib_1.__decorate([
    (0, graphql_1.InputType)()
], RowGroup);
const filterExpressionInputCache = new WeakMap();
function filterExpressionInputFactory(entityModel) {
    var _a, _b, _c, _d;
    let cached;
    if ((cached = filterExpressionInputCache.get(entityModel)))
        return cached;
    const FieldEnum = (0, ag_grid_enum_1.entityFieldsEnumFactory)(entityModel);
    let FilterText = class FilterText {
    };
    tslib_1.__decorate([
        (0, graphql_1.HideField)(),
        tslib_1.__metadata("design:type", String)
    ], FilterText.prototype, "filterType", void 0);
    tslib_1.__decorate([
        (0, graphql_1.Field)(() => ag_grid_enum_1.GeneralFilters),
        tslib_1.__metadata("design:type", String)
    ], FilterText.prototype, "type", void 0);
    tslib_1.__decorate([
        (0, graphql_1.Field)(() => FieldEnum),
        tslib_1.__metadata("design:type", String)
    ], FilterText.prototype, "field", void 0);
    tslib_1.__decorate([
        (0, graphql_1.Field)(),
        tslib_1.__metadata("design:type", String)
    ], FilterText.prototype, "filter", void 0);
    FilterText = tslib_1.__decorate([
        (0, graphql_1.InputType)(`${entityModel.name}FilterTextInput`)
    ], FilterText);
    let FilterNumber = class FilterNumber {
    };
    tslib_1.__decorate([
        (0, graphql_1.HideField)(),
        tslib_1.__metadata("design:type", String)
    ], FilterNumber.prototype, "filterType", void 0);
    tslib_1.__decorate([
        (0, graphql_1.Field)(() => ag_grid_enum_1.GeneralFilters),
        tslib_1.__metadata("design:type", String)
    ], FilterNumber.prototype, "type", void 0);
    tslib_1.__decorate([
        (0, graphql_1.Field)(() => FieldEnum),
        tslib_1.__metadata("design:type", String)
    ], FilterNumber.prototype, "field", void 0);
    tslib_1.__decorate([
        (0, graphql_1.Field)(),
        tslib_1.__metadata("design:type", Number)
    ], FilterNumber.prototype, "filter", void 0);
    tslib_1.__decorate([
        (0, graphql_1.Field)({ nullable: true }),
        tslib_1.__metadata("design:type", Number)
    ], FilterNumber.prototype, "filterTo", void 0);
    FilterNumber = tslib_1.__decorate([
        (0, graphql_1.InputType)(`${entityModel.name}FilterNumberInput`)
    ], FilterNumber);
    let FilterDate = class FilterDate {
    };
    tslib_1.__decorate([
        (0, graphql_1.HideField)(),
        tslib_1.__metadata("design:type", String)
    ], FilterDate.prototype, "filterType", void 0);
    tslib_1.__decorate([
        (0, graphql_1.Field)(() => ag_grid_enum_1.GeneralFilters),
        tslib_1.__metadata("design:type", String)
    ], FilterDate.prototype, "type", void 0);
    tslib_1.__decorate([
        (0, graphql_1.Field)(() => FieldEnum),
        tslib_1.__metadata("design:type", String)
    ], FilterDate.prototype, "field", void 0);
    tslib_1.__decorate([
        (0, graphql_1.Field)(),
        tslib_1.__metadata("design:type", String)
    ], FilterDate.prototype, "dateFrom", void 0);
    tslib_1.__decorate([
        (0, graphql_1.Field)({ nullable: true }),
        tslib_1.__metadata("design:type", String)
    ], FilterDate.prototype, "dateTo", void 0);
    FilterDate = tslib_1.__decorate([
        (0, graphql_1.InputType)(`${entityModel.name}FilterDateInput`)
    ], FilterDate);
    let FilterSet = class FilterSet {
    };
    tslib_1.__decorate([
        (0, graphql_1.HideField)(),
        tslib_1.__metadata("design:type", String)
    ], FilterSet.prototype, "filterType", void 0);
    tslib_1.__decorate([
        (0, graphql_1.Field)(() => [String]),
        tslib_1.__metadata("design:type", Array)
    ], FilterSet.prototype, "values", void 0);
    tslib_1.__decorate([
        (0, graphql_1.Field)(() => FieldEnum),
        tslib_1.__metadata("design:type", String)
    ], FilterSet.prototype, "field", void 0);
    FilterSet = tslib_1.__decorate([
        (0, graphql_1.InputType)(`${entityModel.name}FilterSetInput`)
    ], FilterSet);
    let FilterExpressionProperty = class FilterExpressionProperty {
        static { _a = ag_grid_enum_1.FilterType.TEXT, _b = ag_grid_enum_1.FilterType.NUMBER, _c = ag_grid_enum_1.FilterType.DATE, _d = ag_grid_enum_1.FilterType.SET; }
    };
    tslib_1.__decorate([
        (0, graphql_1.Field)(() => FilterText, { nullable: true }),
        tslib_1.__metadata("design:type", FilterText)
    ], FilterExpressionProperty.prototype, _a, void 0);
    tslib_1.__decorate([
        (0, graphql_1.Field)(() => FilterNumber, { nullable: true }),
        tslib_1.__metadata("design:type", FilterNumber)
    ], FilterExpressionProperty.prototype, _b, void 0);
    tslib_1.__decorate([
        (0, graphql_1.Field)(() => FilterDate, { nullable: true }),
        tslib_1.__metadata("design:type", FilterDate)
    ], FilterExpressionProperty.prototype, _c, void 0);
    tslib_1.__decorate([
        (0, graphql_1.Field)(() => FilterSet, { nullable: true }),
        tslib_1.__metadata("design:type", FilterSet)
    ], FilterExpressionProperty.prototype, _d, void 0);
    FilterExpressionProperty = tslib_1.__decorate([
        (0, graphql_1.InputType)(`${entityModel.name}FilterInput`)
    ], FilterExpressionProperty);
    let FilterExpression = class FilterExpression {
    };
    tslib_1.__decorate([
        (0, graphql_1.Field)(() => ag_grid_enum_1.Operators, { defaultValue: ag_grid_enum_1.Operators.AND, nullable: true }),
        tslib_1.__metadata("design:type", String)
    ], FilterExpression.prototype, "operator", void 0);
    tslib_1.__decorate([
        (0, graphql_1.Field)(() => [FilterExpressionProperty]),
        tslib_1.__metadata("design:type", Array)
    ], FilterExpression.prototype, "expressions", void 0);
    tslib_1.__decorate([
        (0, graphql_1.Field)(() => [FilterExpression]),
        tslib_1.__metadata("design:type", Array)
    ], FilterExpression.prototype, "childExpressions", void 0);
    FilterExpression = tslib_1.__decorate([
        (0, graphql_1.InputType)(`${entityModel.name}FilterExpressionInput`)
    ], FilterExpression);
    filterExpressionInputCache.set(entityModel, FilterExpression);
    return FilterExpression;
}
var JoinTypes;
(function (JoinTypes) {
    JoinTypes[JoinTypes["LEFT_JOIN"] = 0] = "LEFT_JOIN";
    JoinTypes[JoinTypes["INNER_JOIN"] = 1] = "INNER_JOIN";
})(JoinTypes || (exports.JoinTypes = JoinTypes = {}));
const JoinOptionInputCache = new WeakMap();
function agJoinArgFactory(entityModel, defaultValues) {
    const cached = JoinOptionInputCache.get(entityModel);
    if (cached)
        return cached;
    const resolverInfoList = (0, ag_grid_metadata_helper_1.getEntityRelations)(entityModel);
    if (!resolverInfoList.length)
        return null;
    let JoinInput = class JoinInput {
    };
    tslib_1.__decorate([
        (0, graphql_1.Field)(() => JoinTypes),
        tslib_1.__metadata("design:type", Number)
    ], JoinInput.prototype, "joinType", void 0);
    JoinInput = tslib_1.__decorate([
        (0, graphql_1.InputType)(`${entityModel.name}JoinInputTypePartial`)
    ], JoinInput);
    (0, graphql_1.registerEnumType)(JoinTypes, {
        name: `JoinTypes`,
    });
    let JoinOptionInput = class JoinOptionInput {
    };
    JoinOptionInput = tslib_1.__decorate([
        (0, graphql_1.InputType)(`${entityModel.name}JoinOptionsInputType`)
    ], JoinOptionInput);
    resolverInfoList.forEach((r) => {
        const type = r.relation.type;
        if (typeof type !== 'string') {
            let typeClass;
            try {
                typeClass = typeof type === 'function' ? type() : type;
            }
            catch {
                typeClass = type;
            }
            let JoinFullInput = class JoinFullInput extends (0, graphql_1.IntersectionType)(JoinInput, (0, ag_grid_args_1.agQueryParamsNoPaginationFactory)(defaultValues, typeClass)) {
            };
            JoinFullInput = tslib_1.__decorate([
                (0, graphql_1.InputType)(`${entityModel.name}${r.relation.propertyName}JoinInputType`)
            ], JoinFullInput);
            JoinOptionInput.prototype[r.relation.propertyName] = JoinFullInput;
            (0, graphql_1.Field)(() => JoinFullInput, { nullable: true })(JoinOptionInput.prototype, r.relation.propertyName);
        }
    });
    JoinOptionInputCache.set(entityModel, JoinOptionInput);
    return JoinOptionInput;
}
//# sourceMappingURL=ag-grid.input.js.map