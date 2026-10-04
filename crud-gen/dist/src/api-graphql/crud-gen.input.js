import { __decorate, __metadata } from "tslib";
import { Field, InputType, IntersectionType, registerEnumType, } from '@nestjs/graphql';
import { entityFieldsEnumGqlFactory } from './crud-gen-gql.enum.js';
import { crudGenParamsNoPaginationFactory } from '../crud-gen.args.js';
import { FilterType, GeneralFilters, Operators, SortDirection, } from '../crud-gen.enum.js';
import { getEntityRelations } from '../crud-gen.helpers.js';
import { JoinTypes, } from './crud-gen-gql.interface.js';
export { JoinTypes } from './crud-gen-gql.interface.js';
let SortModel = class SortModel {
};
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], SortModel.prototype, "colId", void 0);
__decorate([
    Field(() => SortDirection, { nullable: true, defaultValue: 'ASC' }),
    __metadata("design:type", String)
], SortModel.prototype, "sort", void 0);
SortModel = __decorate([
    InputType()
], SortModel);
export { SortModel };
const sortModelCacheMap = new WeakMap();
export function sortModelFactory(entityModel) {
    const cached = sortModelCacheMap.get(entityModel);
    if (cached)
        return cached;
    const fieldsEnum = entityFieldsEnumGqlFactory(entityModel);
    let SortModel = class SortModel {
    };
    __decorate([
        Field(() => fieldsEnum),
        __metadata("design:type", Object)
    ], SortModel.prototype, "colId", void 0);
    __decorate([
        Field(() => SortDirection, { nullable: true, defaultValue: 'ASC' }),
        __metadata("design:type", String)
    ], SortModel.prototype, "sort", void 0);
    SortModel = __decorate([
        InputType(`${entityModel.name}SortModel`)
    ], SortModel);
    sortModelCacheMap.set(entityModel, SortModel);
    return SortModel;
}
let RowGroup = class RowGroup {
};
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], RowGroup.prototype, "colId", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], RowGroup.prototype, "aggFunc", void 0);
RowGroup = __decorate([
    InputType()
], RowGroup);
export { RowGroup };
const filterExpressionInputCache = new WeakMap();
export function filterExpressionInputFactory(entityModel) {
    var _a, _b, _c, _d;
    let cached;
    if ((cached = filterExpressionInputCache.get(entityModel)))
        return cached;
    const fieldsEnum = entityFieldsEnumGqlFactory(entityModel);
    let FilterText = class FilterText {
    };
    __decorate([
        Field(() => FilterType, { nullable: true, defaultValue: FilterType.TEXT }),
        __metadata("design:type", String)
    ], FilterText.prototype, "filterType", void 0);
    __decorate([
        Field(() => GeneralFilters, { nullable: true }),
        __metadata("design:type", String)
    ], FilterText.prototype, "type", void 0);
    __decorate([
        Field(() => fieldsEnum),
        __metadata("design:type", String)
    ], FilterText.prototype, "field", void 0);
    __decorate([
        Field(() => String, { nullable: true }),
        __metadata("design:type", String)
    ], FilterText.prototype, "filter", void 0);
    FilterText = __decorate([
        InputType(`${entityModel.name}FilterTextInput`)
    ], FilterText);
    let FilterNumber = class FilterNumber {
    };
    __decorate([
        Field(() => FilterType, { nullable: true, defaultValue: FilterType.NUMBER }),
        __metadata("design:type", String)
    ], FilterNumber.prototype, "filterType", void 0);
    __decorate([
        Field(() => GeneralFilters, { nullable: true }),
        __metadata("design:type", String)
    ], FilterNumber.prototype, "type", void 0);
    __decorate([
        Field(() => fieldsEnum),
        __metadata("design:type", String)
    ], FilterNumber.prototype, "field", void 0);
    __decorate([
        Field(() => Number, { nullable: true }),
        __metadata("design:type", Number)
    ], FilterNumber.prototype, "filter", void 0);
    __decorate([
        Field(() => Number, { nullable: true }),
        __metadata("design:type", Number)
    ], FilterNumber.prototype, "filterTo", void 0);
    FilterNumber = __decorate([
        InputType(`${entityModel.name}FilterNumberInput`)
    ], FilterNumber);
    let FilterDate = class FilterDate {
    };
    __decorate([
        Field(() => FilterType, { nullable: true, defaultValue: FilterType.DATE }),
        __metadata("design:type", String)
    ], FilterDate.prototype, "filterType", void 0);
    __decorate([
        Field(() => GeneralFilters, { nullable: true }),
        __metadata("design:type", String)
    ], FilterDate.prototype, "type", void 0);
    __decorate([
        Field(() => fieldsEnum),
        __metadata("design:type", String)
    ], FilterDate.prototype, "field", void 0);
    __decorate([
        Field(() => String, { nullable: true }),
        __metadata("design:type", String)
    ], FilterDate.prototype, "dateFrom", void 0);
    __decorate([
        Field(() => String, { nullable: true }),
        __metadata("design:type", String)
    ], FilterDate.prototype, "dateTo", void 0);
    FilterDate = __decorate([
        InputType(`${entityModel.name}FilterDateInput`)
    ], FilterDate);
    let FilterSet = class FilterSet {
    };
    __decorate([
        Field(() => FilterType, { nullable: true, defaultValue: FilterType.SET }),
        __metadata("design:type", String)
    ], FilterSet.prototype, "filterType", void 0);
    __decorate([
        Field(() => [String], { nullable: true }),
        __metadata("design:type", Array)
    ], FilterSet.prototype, "values", void 0);
    __decorate([
        Field(() => fieldsEnum),
        __metadata("design:type", String)
    ], FilterSet.prototype, "field", void 0);
    FilterSet = __decorate([
        InputType(`${entityModel.name}FilterSetInput`)
    ], FilterSet);
    let FilterExpressionProperty = class FilterExpressionProperty {
        static { _a = FilterType.TEXT, _b = FilterType.NUMBER, _c = FilterType.DATE, _d = FilterType.SET; }
    };
    __decorate([
        Field(() => FilterText, { nullable: true }),
        __metadata("design:type", FilterText)
    ], FilterExpressionProperty.prototype, _a, void 0);
    __decorate([
        Field(() => FilterNumber, { nullable: true }),
        __metadata("design:type", FilterNumber)
    ], FilterExpressionProperty.prototype, _b, void 0);
    __decorate([
        Field(() => FilterDate, { nullable: true }),
        __metadata("design:type", FilterDate)
    ], FilterExpressionProperty.prototype, _c, void 0);
    __decorate([
        Field(() => FilterSet, { nullable: true }),
        __metadata("design:type", FilterSet)
    ], FilterExpressionProperty.prototype, _d, void 0);
    FilterExpressionProperty = __decorate([
        InputType(`${entityModel.name}FilterInput`)
    ], FilterExpressionProperty);
    let FilterExpression = class FilterExpression {
    };
    __decorate([
        Field(() => Operators, { defaultValue: Operators.AND, nullable: true }),
        __metadata("design:type", String)
    ], FilterExpression.prototype, "operator", void 0);
    __decorate([
        Field(() => [FilterExpressionProperty], { nullable: true }),
        __metadata("design:type", Array)
    ], FilterExpression.prototype, "expressions", void 0);
    __decorate([
        Field(() => [FilterExpression], { nullable: true }),
        __metadata("design:type", Array)
    ], FilterExpression.prototype, "childExpressions", void 0);
    FilterExpression = __decorate([
        InputType(`${entityModel.name}FilterExpressionInput`)
    ], FilterExpression);
    filterExpressionInputCache.set(entityModel, FilterExpression);
    return FilterExpression;
}
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
            const typeClass = type();
            let JoinFullInput = class JoinFullInput extends IntersectionType(JoinInput, crudGenParamsNoPaginationFactory(defaultValues, typeClass)) {
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
//# sourceMappingURL=crud-gen.input.js.map