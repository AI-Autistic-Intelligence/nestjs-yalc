"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RowGroup = exports.SortModel = exports.JoinTypes = void 0;
exports.sortModelFactory = sortModelFactory;
exports.filterExpressionInputFactory = filterExpressionInputFactory;
exports.agJoinArgFactory = agJoinArgFactory;
const graphql_1 = require("@nestjs/graphql");
const crud_gen_gql_enum_js_1 = require("./crud-gen-gql.enum.js");
const crud_gen_args_js_1 = require("../crud-gen.args.js");
const crud_gen_enum_js_1 = require("../crud-gen.enum.js");
const crud_gen_helpers_js_1 = require("../crud-gen.helpers.js");
const crud_gen_gql_interface_js_1 = require("./crud-gen-gql.interface.js");
var crud_gen_gql_interface_js_2 = require("./crud-gen-gql.interface.js");
Object.defineProperty(exports, "JoinTypes", { enumerable: true, get: function () { return crud_gen_gql_interface_js_2.JoinTypes; } });
let SortModel = class SortModel {
};
exports.SortModel = SortModel;
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], SortModel.prototype, "colId", void 0);
__decorate([
    (0, graphql_1.Field)(() => crud_gen_enum_js_1.SortDirection, { nullable: true, defaultValue: 'ASC' }),
    __metadata("design:type", String)
], SortModel.prototype, "sort", void 0);
exports.SortModel = SortModel = __decorate([
    (0, graphql_1.InputType)()
], SortModel);
const sortModelCacheMap = new WeakMap();
function sortModelFactory(entityModel) {
    const cached = sortModelCacheMap.get(entityModel);
    if (cached)
        return cached;
    const fieldsEnum = (0, crud_gen_gql_enum_js_1.entityFieldsEnumGqlFactory)(entityModel);
    let SortModel = class SortModel {
    };
    __decorate([
        (0, graphql_1.Field)(() => fieldsEnum),
        __metadata("design:type", Object)
    ], SortModel.prototype, "colId", void 0);
    __decorate([
        (0, graphql_1.Field)(() => crud_gen_enum_js_1.SortDirection, { nullable: true, defaultValue: 'ASC' }),
        __metadata("design:type", String)
    ], SortModel.prototype, "sort", void 0);
    SortModel = __decorate([
        (0, graphql_1.InputType)(`${entityModel.name}SortModel`)
    ], SortModel);
    sortModelCacheMap.set(entityModel, SortModel);
    return SortModel;
}
let RowGroup = class RowGroup {
};
exports.RowGroup = RowGroup;
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], RowGroup.prototype, "colId", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], RowGroup.prototype, "aggFunc", void 0);
exports.RowGroup = RowGroup = __decorate([
    (0, graphql_1.InputType)()
], RowGroup);
const filterExpressionInputCache = new WeakMap();
function filterExpressionInputFactory(entityModel) {
    var _a, _b, _c, _d;
    let cached;
    if ((cached = filterExpressionInputCache.get(entityModel)))
        return cached;
    const fieldsEnum = (0, crud_gen_gql_enum_js_1.entityFieldsEnumGqlFactory)(entityModel);
    let FilterText = class FilterText {
    };
    __decorate([
        (0, graphql_1.Field)(() => crud_gen_enum_js_1.FilterType, { nullable: true, defaultValue: crud_gen_enum_js_1.FilterType.TEXT }),
        __metadata("design:type", String)
    ], FilterText.prototype, "filterType", void 0);
    __decorate([
        (0, graphql_1.Field)(() => crud_gen_enum_js_1.GeneralFilters, { nullable: true }),
        __metadata("design:type", String)
    ], FilterText.prototype, "type", void 0);
    __decorate([
        (0, graphql_1.Field)(() => fieldsEnum),
        __metadata("design:type", String)
    ], FilterText.prototype, "field", void 0);
    __decorate([
        (0, graphql_1.Field)(() => String, { nullable: true }),
        __metadata("design:type", String)
    ], FilterText.prototype, "filter", void 0);
    FilterText = __decorate([
        (0, graphql_1.InputType)(`${entityModel.name}FilterTextInput`)
    ], FilterText);
    let FilterNumber = class FilterNumber {
    };
    __decorate([
        (0, graphql_1.Field)(() => crud_gen_enum_js_1.FilterType, { nullable: true, defaultValue: crud_gen_enum_js_1.FilterType.NUMBER }),
        __metadata("design:type", String)
    ], FilterNumber.prototype, "filterType", void 0);
    __decorate([
        (0, graphql_1.Field)(() => crud_gen_enum_js_1.GeneralFilters, { nullable: true }),
        __metadata("design:type", String)
    ], FilterNumber.prototype, "type", void 0);
    __decorate([
        (0, graphql_1.Field)(() => fieldsEnum),
        __metadata("design:type", String)
    ], FilterNumber.prototype, "field", void 0);
    __decorate([
        (0, graphql_1.Field)(() => Number, { nullable: true }),
        __metadata("design:type", Number)
    ], FilterNumber.prototype, "filter", void 0);
    __decorate([
        (0, graphql_1.Field)(() => Number, { nullable: true }),
        __metadata("design:type", Number)
    ], FilterNumber.prototype, "filterTo", void 0);
    FilterNumber = __decorate([
        (0, graphql_1.InputType)(`${entityModel.name}FilterNumberInput`)
    ], FilterNumber);
    let FilterDate = class FilterDate {
    };
    __decorate([
        (0, graphql_1.Field)(() => crud_gen_enum_js_1.FilterType, { nullable: true, defaultValue: crud_gen_enum_js_1.FilterType.DATE }),
        __metadata("design:type", String)
    ], FilterDate.prototype, "filterType", void 0);
    __decorate([
        (0, graphql_1.Field)(() => crud_gen_enum_js_1.GeneralFilters, { nullable: true }),
        __metadata("design:type", String)
    ], FilterDate.prototype, "type", void 0);
    __decorate([
        (0, graphql_1.Field)(() => fieldsEnum),
        __metadata("design:type", String)
    ], FilterDate.prototype, "field", void 0);
    __decorate([
        (0, graphql_1.Field)(() => String, { nullable: true }),
        __metadata("design:type", String)
    ], FilterDate.prototype, "dateFrom", void 0);
    __decorate([
        (0, graphql_1.Field)(() => String, { nullable: true }),
        __metadata("design:type", String)
    ], FilterDate.prototype, "dateTo", void 0);
    FilterDate = __decorate([
        (0, graphql_1.InputType)(`${entityModel.name}FilterDateInput`)
    ], FilterDate);
    let FilterSet = class FilterSet {
    };
    __decorate([
        (0, graphql_1.Field)(() => crud_gen_enum_js_1.FilterType, { nullable: true, defaultValue: crud_gen_enum_js_1.FilterType.SET }),
        __metadata("design:type", String)
    ], FilterSet.prototype, "filterType", void 0);
    __decorate([
        (0, graphql_1.Field)(() => [String], { nullable: true }),
        __metadata("design:type", Array)
    ], FilterSet.prototype, "values", void 0);
    __decorate([
        (0, graphql_1.Field)(() => fieldsEnum),
        __metadata("design:type", String)
    ], FilterSet.prototype, "field", void 0);
    FilterSet = __decorate([
        (0, graphql_1.InputType)(`${entityModel.name}FilterSetInput`)
    ], FilterSet);
    let FilterExpressionProperty = class FilterExpressionProperty {
    };
    _a = crud_gen_enum_js_1.FilterType.TEXT;
    _b = crud_gen_enum_js_1.FilterType.NUMBER;
    _c = crud_gen_enum_js_1.FilterType.DATE;
    _d = crud_gen_enum_js_1.FilterType.SET;
    __decorate([
        (0, graphql_1.Field)(() => FilterText, { nullable: true }),
        __metadata("design:type", FilterText)
    ], FilterExpressionProperty.prototype, _a, void 0);
    __decorate([
        (0, graphql_1.Field)(() => FilterNumber, { nullable: true }),
        __metadata("design:type", FilterNumber)
    ], FilterExpressionProperty.prototype, _b, void 0);
    __decorate([
        (0, graphql_1.Field)(() => FilterDate, { nullable: true }),
        __metadata("design:type", FilterDate)
    ], FilterExpressionProperty.prototype, _c, void 0);
    __decorate([
        (0, graphql_1.Field)(() => FilterSet, { nullable: true }),
        __metadata("design:type", FilterSet)
    ], FilterExpressionProperty.prototype, _d, void 0);
    FilterExpressionProperty = __decorate([
        (0, graphql_1.InputType)(`${entityModel.name}FilterInput`)
    ], FilterExpressionProperty);
    let FilterExpression = class FilterExpression {
    };
    __decorate([
        (0, graphql_1.Field)(() => crud_gen_enum_js_1.Operators, { defaultValue: crud_gen_enum_js_1.Operators.AND, nullable: true }),
        __metadata("design:type", String)
    ], FilterExpression.prototype, "operator", void 0);
    __decorate([
        (0, graphql_1.Field)(() => [FilterExpressionProperty], { nullable: true }),
        __metadata("design:type", Array)
    ], FilterExpression.prototype, "expressions", void 0);
    __decorate([
        (0, graphql_1.Field)(() => [FilterExpression], { nullable: true }),
        __metadata("design:type", Array)
    ], FilterExpression.prototype, "childExpressions", void 0);
    FilterExpression = __decorate([
        (0, graphql_1.InputType)(`${entityModel.name}FilterExpressionInput`)
    ], FilterExpression);
    filterExpressionInputCache.set(entityModel, FilterExpression);
    return FilterExpression;
}
const JoinOptionInputCache = new WeakMap();
function agJoinArgFactory(entityModel, defaultValues) {
    const cached = JoinOptionInputCache.get(entityModel);
    if (cached)
        return cached;
    const resolverInfoList = (0, crud_gen_helpers_js_1.getEntityRelations)(entityModel);
    if (!resolverInfoList.length)
        return null;
    let JoinInput = class JoinInput {
    };
    __decorate([
        (0, graphql_1.Field)(() => crud_gen_gql_interface_js_1.JoinTypes),
        __metadata("design:type", Number)
    ], JoinInput.prototype, "joinType", void 0);
    JoinInput = __decorate([
        (0, graphql_1.InputType)(`${entityModel.name}JoinInputTypePartial`)
    ], JoinInput);
    (0, graphql_1.registerEnumType)(crud_gen_gql_interface_js_1.JoinTypes, {
        name: `JoinTypes`,
    });
    let JoinOptionInput = class JoinOptionInput {
    };
    JoinOptionInput = __decorate([
        (0, graphql_1.InputType)(`${entityModel.name}JoinOptionsInputType`)
    ], JoinOptionInput);
    resolverInfoList.forEach((r) => {
        const type = r.relation.type;
        if (typeof type !== 'string') {
            const typeClass = type();
            let JoinFullInput = class JoinFullInput extends (0, graphql_1.IntersectionType)(JoinInput, (0, crud_gen_args_js_1.crudGenParamsNoPaginationFactory)(defaultValues, typeClass)) {
            };
            JoinFullInput = __decorate([
                (0, graphql_1.InputType)(`${entityModel.name}${r.relation.propertyName}JoinInputType`)
            ], JoinFullInput);
            JoinOptionInput.prototype[r.relation.propertyName] = JoinFullInput;
            (0, graphql_1.Field)(() => JoinFullInput, { nullable: true })(JoinOptionInput.prototype, r.relation.propertyName);
        }
    });
    JoinOptionInputCache.set(entityModel, JoinOptionInput);
    return JoinOptionInput;
}
//# sourceMappingURL=crud-gen.input.js.map