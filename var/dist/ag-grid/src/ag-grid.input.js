var _a;
import { __decorate, __metadata } from "tslib";
import { Field, HideField, InputType, IntersectionType, registerEnumType, } from '@nestjs/graphql';
import { agQueryParamsNoPaginationFactory, } from './ag-grid.args';
import { entityFieldsEnumFactory, FilterType, GeneralFilters, Operators, SortDirection, } from './ag-grid.enum';
import { getEntityRelations } from "./ag-grid-metadata.helper";
let SortModel = class SortModel {
};
__decorate([
    Field(() => SortDirection, { nullable: true, defaultValue: 'ASC' }),
    __metadata("design:type", typeof (_a = typeof SortDirection !== "undefined" && SortDirection) === "function" ? _a : Object)
], SortModel.prototype, "sort", void 0);
SortModel = __decorate([
    InputType()
], SortModel);
export { SortModel };
const sortModelCacheMap = new WeakMap();
export function sortModelFactory(entityModel) {
    var _a;
    const cached = sortModelCacheMap.get(entityModel);
    if (cached)
        return cached;
    const fieldsEnum = entityFieldsEnumFactory(entityModel);
    let SortModel = class SortModel {
    };
    __decorate([
        Field(() => fieldsEnum),
        __metadata("design:type", Object)
    ], SortModel.prototype, "colId", void 0);
    __decorate([
        Field(() => SortDirection, { nullable: true, defaultValue: 'ASC' }),
        __metadata("design:type", typeof (_a = typeof SortDirection !== "undefined" && SortDirection) === "function" ? _a : Object)
    ], SortModel.prototype, "sort", void 0);
    SortModel = __decorate([
        InputType(`${entityModel.name}SortModel`)
    ], SortModel);
    sortModelCacheMap.set(entityModel, SortModel);
    return SortModel;
}
let RowGroup = class RowGroup {
};
RowGroup = __decorate([
    InputType()
], RowGroup);
export { RowGroup };
const filterExpressionInputCache = new WeakMap();
export function filterExpressionInputFactory(entityModel) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    let cached;
    if ((cached = filterExpressionInputCache.get(entityModel)))
        return cached;
    const FieldEnum = entityFieldsEnumFactory(entityModel);
    let FilterText = class FilterText {
    };
    __decorate([
        HideField(),
        __metadata("design:type", typeof (_a = typeof FilterType !== "undefined" && FilterType.TEXT) === "function" ? _a : Object)
    ], FilterText.prototype, "filterType", void 0);
    __decorate([
        Field(() => GeneralFilters),
        __metadata("design:type", typeof (_b = typeof GeneralFilters !== "undefined" && GeneralFilters) === "function" ? _b : Object)
    ], FilterText.prototype, "type", void 0);
    __decorate([
        Field(() => FieldEnum),
        __metadata("design:type", String)
    ], FilterText.prototype, "field", void 0);
    __decorate([
        Field(),
        __metadata("design:type", String)
    ], FilterText.prototype, "filter", void 0);
    FilterText = __decorate([
        InputType(`${entityModel.name}FilterTextInput`)
    ], FilterText);
    let FilterNumber = class FilterNumber {
    };
    __decorate([
        HideField(),
        __metadata("design:type", typeof (_c = typeof FilterType !== "undefined" && FilterType.NUMBER) === "function" ? _c : Object)
    ], FilterNumber.prototype, "filterType", void 0);
    __decorate([
        Field(() => GeneralFilters),
        __metadata("design:type", typeof (_d = typeof GeneralFilters !== "undefined" && GeneralFilters) === "function" ? _d : Object)
    ], FilterNumber.prototype, "type", void 0);
    __decorate([
        Field(() => FieldEnum),
        __metadata("design:type", String)
    ], FilterNumber.prototype, "field", void 0);
    __decorate([
        Field(),
        __metadata("design:type", Number)
    ], FilterNumber.prototype, "filter", void 0);
    __decorate([
        Field({ nullable: true }),
        __metadata("design:type", Number)
    ], FilterNumber.prototype, "filterTo", void 0);
    FilterNumber = __decorate([
        InputType(`${entityModel.name}FilterNumberInput`)
    ], FilterNumber);
    let FilterDate = class FilterDate {
    };
    __decorate([
        HideField(),
        __metadata("design:type", typeof (_e = typeof FilterType !== "undefined" && FilterType.DATE) === "function" ? _e : Object)
    ], FilterDate.prototype, "filterType", void 0);
    __decorate([
        Field(() => GeneralFilters),
        __metadata("design:type", typeof (_f = typeof GeneralFilters !== "undefined" && GeneralFilters) === "function" ? _f : Object)
    ], FilterDate.prototype, "type", void 0);
    __decorate([
        Field(() => FieldEnum),
        __metadata("design:type", String)
    ], FilterDate.prototype, "field", void 0);
    __decorate([
        Field(),
        __metadata("design:type", String)
    ], FilterDate.prototype, "dateFrom", void 0);
    __decorate([
        Field({ nullable: true }),
        __metadata("design:type", String)
    ], FilterDate.prototype, "dateTo", void 0);
    FilterDate = __decorate([
        InputType(`${entityModel.name}FilterDateInput`)
    ], FilterDate);
    let FilterSet = class FilterSet {
    };
    __decorate([
        HideField(),
        __metadata("design:type", typeof (_g = typeof FilterType !== "undefined" && FilterType.SET) === "function" ? _g : Object)
    ], FilterSet.prototype, "filterType", void 0);
    __decorate([
        Field(() => [String]),
        __metadata("design:type", Array)
    ], FilterSet.prototype, "values", void 0);
    __decorate([
        Field(() => FieldEnum),
        __metadata("design:type", String)
    ], FilterSet.prototype, "field", void 0);
    FilterSet = __decorate([
        InputType(`${entityModel.name}FilterSetInput`)
    ], FilterSet);
    let FilterExpressionProperty = class FilterExpressionProperty {
        static { _h = FilterType.TEXT, _j = FilterType.NUMBER, _k = FilterType.DATE, _l = FilterType.SET; }
    };
    __decorate([
        Field(() => FilterText, { nullable: true }),
        __metadata("design:type", FilterText)
    ], FilterExpressionProperty.prototype, _h, void 0);
    __decorate([
        Field(() => FilterNumber, { nullable: true }),
        __metadata("design:type", FilterNumber)
    ], FilterExpressionProperty.prototype, _j, void 0);
    __decorate([
        Field(() => FilterDate, { nullable: true }),
        __metadata("design:type", FilterDate)
    ], FilterExpressionProperty.prototype, _k, void 0);
    __decorate([
        Field(() => FilterSet, { nullable: true }),
        __metadata("design:type", FilterSet)
    ], FilterExpressionProperty.prototype, _l, void 0);
    FilterExpressionProperty = __decorate([
        InputType(`${entityModel.name}FilterInput`)
    ], FilterExpressionProperty);
    let FilterExpression = class FilterExpression {
    };
    __decorate([
        Field(() => Operators, { defaultValue: Operators.AND, nullable: true }),
        __metadata("design:type", typeof (_m = typeof Operators !== "undefined" && Operators) === "function" ? _m : Object)
    ], FilterExpression.prototype, "operator", void 0);
    __decorate([
        Field(() => [FilterExpressionProperty]),
        __metadata("design:type", Array)
    ], FilterExpression.prototype, "expressions", void 0);
    __decorate([
        Field(() => [FilterExpression]),
        __metadata("design:type", Array)
    ], FilterExpression.prototype, "childExpressions", void 0);
    FilterExpression = __decorate([
        InputType(`${entityModel.name}FilterExpressionInput`)
    ], FilterExpression);
    filterExpressionInputCache.set(entityModel, FilterExpression);
    return FilterExpression;
}
export var JoinTypes;
(function (JoinTypes) {
    JoinTypes[JoinTypes["LEFT_JOIN"] = 0] = "LEFT_JOIN";
    JoinTypes[JoinTypes["INNER_JOIN"] = 1] = "INNER_JOIN";
})(JoinTypes || (JoinTypes = {}));
const JoinOptionInputCache = new WeakMap();
export function agJoinArgFactory(entityModel, defaultValues) {
    const cached = JoinOptionInputCache.get(entityModel);
    if (cached)
        return cached;
    const resolverInfoList = getEntityRelations(entityModel);
    if (!resolverInfoList.length)
        return null;
    let JoinInput = class JoinInput {
    };
    __decorate([
        Field(() => JoinTypes),
        __metadata("design:type", Number)
    ], JoinInput.prototype, "joinType", void 0);
    JoinInput = __decorate([
        InputType(`${entityModel.name}JoinInputTypePartial`)
    ], JoinInput);
    registerEnumType(JoinTypes, {
        name: `JoinTypes`,
    });
    let JoinOptionInput = class JoinOptionInput {
    };
    JoinOptionInput = __decorate([
        InputType(`${entityModel.name}JoinOptionsInputType`)
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
            let JoinFullInput = class JoinFullInput extends IntersectionType(JoinInput, agQueryParamsNoPaginationFactory(defaultValues, typeClass)) {
            };
            JoinFullInput = __decorate([
                InputType(`${entityModel.name}${r.relation.propertyName}JoinInputType`)
            ], JoinFullInput);
            JoinOptionInput.prototype[r.relation.propertyName] = JoinFullInput;
            Field(() => JoinFullInput, { nullable: true })(JoinOptionInput.prototype, r.relation.propertyName);
        }
    });
    JoinOptionInputCache.set(entityModel, JoinOptionInput);
    return JoinOptionInput;
}
//# sourceMappingURL=ag-grid.input.js.map