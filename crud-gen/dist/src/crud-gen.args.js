"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeMap = void 0;
exports.crudGenParamsFactory = crudGenParamsFactory;
exports.crudGenParamsNoPaginationFactory = crudGenParamsNoPaginationFactory;
const tslib_1 = require("tslib");
const graphql_1 = require("@nestjs/graphql");
const crud_gen_input_js_1 = require("./api-graphql/crud-gen.input.js");
const filter_scalar_js_1 = require("./filter.scalar.js");
const returnValue_js_1 = tslib_1.__importDefault(require("@nest-yalc-2/utils/returnValue.js"));
const crud_gen_enum_js_1 = require("./crud-gen.enum.js");
exports.typeMap = new WeakMap();
function crudGenParamsFactory(defaultValues, entityModel) {
    const SortType = entityModel ? [(0, crud_gen_input_js_1.sortModelFactory)(entityModel)] : [crud_gen_input_js_1.SortModel];
    const FilterType = entityModel
        ? (0, crud_gen_input_js_1.filterExpressionInputFactory)(entityModel)
        : filter_scalar_js_1.FilterScalar;
    let CrudGenParams = class CrudGenParams {
        constructor() {
            this.startRow = defaultValues?.startRow ?? crud_gen_enum_js_1.RowDefaultValues.START_ROW;
            this.endRow = defaultValues?.endRow ?? crud_gen_enum_js_1.RowDefaultValues.END_ROW;
        }
    };
    tslib_1.__decorate([
        (0, graphql_1.Field)(() => Number, {
            nullable: true,
            defaultValue: defaultValues?.startRow ?? crud_gen_enum_js_1.RowDefaultValues.START_ROW,
        }),
        tslib_1.__metadata("design:type", Number)
    ], CrudGenParams.prototype, "startRow", void 0);
    tslib_1.__decorate([
        (0, graphql_1.Field)(() => Number, {
            nullable: true,
            defaultValue: defaultValues?.endRow ?? crud_gen_enum_js_1.RowDefaultValues.END_ROW,
        }),
        tslib_1.__metadata("design:type", Number)
    ], CrudGenParams.prototype, "endRow", void 0);
    tslib_1.__decorate([
        (0, graphql_1.Field)((0, returnValue_js_1.default)(SortType), {
            nullable: true,
            defaultValue: defaultValues?.sorting,
        }),
        tslib_1.__metadata("design:type", Object)
    ], CrudGenParams.prototype, "sorting", void 0);
    tslib_1.__decorate([
        (0, graphql_1.Field)((0, returnValue_js_1.default)(FilterType), {
            nullable: true,
            defaultValue: defaultValues?.filters,
        }),
        tslib_1.__metadata("design:type", Object)
    ], CrudGenParams.prototype, "filters", void 0);
    CrudGenParams = tslib_1.__decorate([
        (0, graphql_1.ArgsType)()
    ], CrudGenParams);
    exports.typeMap.set(CrudGenParams, CrudGenParams);
    return exports.typeMap.get(CrudGenParams);
}
function crudGenParamsNoPaginationFactory(defaultValues, entityModel) {
    const SortType = entityModel ? [(0, crud_gen_input_js_1.sortModelFactory)(entityModel)] : [crud_gen_input_js_1.SortModel];
    const FilterType = entityModel
        ? (0, crud_gen_input_js_1.filterExpressionInputFactory)(entityModel)
        : filter_scalar_js_1.FilterScalar;
    let CrudGenParams = class CrudGenParams {
    };
    tslib_1.__decorate([
        (0, graphql_1.Field)((0, returnValue_js_1.default)(SortType), {
            nullable: true,
            defaultValue: defaultValues?.sorting,
        }),
        tslib_1.__metadata("design:type", Object)
    ], CrudGenParams.prototype, "sorting", void 0);
    tslib_1.__decorate([
        (0, graphql_1.Field)((0, returnValue_js_1.default)(FilterType), {
            nullable: true,
            defaultValue: defaultValues?.filters,
        }),
        tslib_1.__metadata("design:type", Object)
    ], CrudGenParams.prototype, "filters", void 0);
    CrudGenParams = tslib_1.__decorate([
        (0, graphql_1.ArgsType)()
    ], CrudGenParams);
    exports.typeMap.set(CrudGenParams, CrudGenParams);
    return exports.typeMap.get(CrudGenParams);
}
//# sourceMappingURL=crud-gen.args.js.map