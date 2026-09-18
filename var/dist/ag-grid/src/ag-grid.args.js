"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeMap = void 0;
exports.agQueryParamsFactory = agQueryParamsFactory;
exports.agQueryParamsNoPaginationFactory = agQueryParamsNoPaginationFactory;
const tslib_1 = require("tslib");
const graphql_1 = require("@nestjs/graphql");
const ag_grid_input_1 = require("./ag-grid.input");
const filter_scalar_1 = require("./filter.scalar");
const returnValue_1 = tslib_1.__importDefault(require("@nest-yalc-2/utils/returnValue"));
const ag_grid_enum_1 = require("./ag-grid.enum");
exports.typeMap = new WeakMap();
function agQueryParamsFactory(defaultValues, entityModel) {
    const SortType = entityModel ? [(0, ag_grid_input_1.sortModelFactory)(entityModel)] : [ag_grid_input_1.SortModel];
    const FilterType = entityModel
        ? (0, ag_grid_input_1.filterExpressionInputFactory)(entityModel)
        : filter_scalar_1.FilterScalar;
    let AgQueryParamsClass = class AgQueryParamsClass {
        constructor() {
            this.startRow = defaultValues?.startRow ?? ag_grid_enum_1.RowDefaultValues.START_ROW;
            this.endRow = defaultValues?.endRow ?? ag_grid_enum_1.RowDefaultValues.END_ROW;
        }
    };
    tslib_1.__decorate([
        (0, graphql_1.Field)((0, returnValue_1.default)(SortType), {
            nullable: true,
            defaultValue: defaultValues?.sorting,
        }),
        tslib_1.__metadata("design:type", Object)
    ], AgQueryParamsClass.prototype, "sorting", void 0);
    tslib_1.__decorate([
        (0, graphql_1.Field)((0, returnValue_1.default)(FilterType), {
            nullable: true,
            defaultValue: defaultValues?.filters,
        }),
        tslib_1.__metadata("design:type", Object)
    ], AgQueryParamsClass.prototype, "filters", void 0);
    AgQueryParamsClass = tslib_1.__decorate([
        (0, graphql_1.ArgsType)()
    ], AgQueryParamsClass);
    exports.typeMap.set(AgQueryParamsClass, AgQueryParamsClass);
    return exports.typeMap.get(AgQueryParamsClass);
}
function agQueryParamsNoPaginationFactory(defaultValues, entityModel) {
    const SortType = entityModel ? [(0, ag_grid_input_1.sortModelFactory)(entityModel)] : [ag_grid_input_1.SortModel];
    const FilterType = entityModel
        ? (0, ag_grid_input_1.filterExpressionInputFactory)(entityModel)
        : filter_scalar_1.FilterScalar;
    let AgQueryParamsNoPaginationClass = class AgQueryParamsNoPaginationClass {
    };
    tslib_1.__decorate([
        (0, graphql_1.Field)((0, returnValue_1.default)(SortType), {
            nullable: true,
            defaultValue: defaultValues?.sorting,
        }),
        tslib_1.__metadata("design:type", Object)
    ], AgQueryParamsNoPaginationClass.prototype, "sorting", void 0);
    tslib_1.__decorate([
        (0, graphql_1.Field)((0, returnValue_1.default)(FilterType), {
            nullable: true,
            defaultValue: defaultValues?.filters,
        }),
        tslib_1.__metadata("design:type", Object)
    ], AgQueryParamsNoPaginationClass.prototype, "filters", void 0);
    AgQueryParamsNoPaginationClass = tslib_1.__decorate([
        (0, graphql_1.ArgsType)()
    ], AgQueryParamsNoPaginationClass);
    exports.typeMap.set(AgQueryParamsNoPaginationClass, AgQueryParamsNoPaginationClass);
    return exports.typeMap.get(AgQueryParamsNoPaginationClass);
}
//# sourceMappingURL=ag-grid.args.js.map