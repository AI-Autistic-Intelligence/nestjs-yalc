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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeMap = void 0;
exports.agQueryParamsFactory = agQueryParamsFactory;
exports.agQueryParamsNoPaginationFactory = agQueryParamsNoPaginationFactory;
const graphql_1 = require("@nestjs/graphql");
const ag_grid_input_1 = require("./ag-grid.input");
const filter_scalar_1 = require("./filter.scalar");
const returnValue_1 = __importDefault(require("@nestjs-yalc/utils/returnValue"));
const ag_grid_enum_1 = require("./ag-grid.enum");
exports.typeMap = new WeakMap();
function agQueryParamsFactory(defaultValues, entityModel) {
    const SortType = entityModel ? [(0, ag_grid_input_1.sortModelFactory)(entityModel)] : [ag_grid_input_1.SortModel];
    const FilterType = entityModel
        ? (0, ag_grid_input_1.filterExpressionInputFactory)(entityModel)
        : filter_scalar_1.FilterScalar;
    let AgQueryParamsClass = class AgQueryParamsClass {
        constructor() {
            var _a, _b;
            this.startRow = (_a = defaultValues === null || defaultValues === void 0 ? void 0 : defaultValues.startRow) !== null && _a !== void 0 ? _a : ag_grid_enum_1.RowDefaultValues.START_ROW;
            this.endRow = (_b = defaultValues === null || defaultValues === void 0 ? void 0 : defaultValues.endRow) !== null && _b !== void 0 ? _b : ag_grid_enum_1.RowDefaultValues.END_ROW;
        }
    };
    __decorate([
        (0, graphql_1.Field)((0, returnValue_1.default)(SortType), {
            nullable: true,
            defaultValue: defaultValues === null || defaultValues === void 0 ? void 0 : defaultValues.sorting,
        }),
        __metadata("design:type", Object)
    ], AgQueryParamsClass.prototype, "sorting", void 0);
    __decorate([
        (0, graphql_1.Field)((0, returnValue_1.default)(FilterType), {
            nullable: true,
            defaultValue: defaultValues === null || defaultValues === void 0 ? void 0 : defaultValues.filters,
        }),
        __metadata("design:type", Object)
    ], AgQueryParamsClass.prototype, "filters", void 0);
    AgQueryParamsClass = __decorate([
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
    __decorate([
        (0, graphql_1.Field)((0, returnValue_1.default)(SortType), {
            nullable: true,
            defaultValue: defaultValues === null || defaultValues === void 0 ? void 0 : defaultValues.sorting,
        }),
        __metadata("design:type", Object)
    ], AgQueryParamsNoPaginationClass.prototype, "sorting", void 0);
    __decorate([
        (0, graphql_1.Field)((0, returnValue_1.default)(FilterType), {
            nullable: true,
            defaultValue: defaultValues === null || defaultValues === void 0 ? void 0 : defaultValues.filters,
        }),
        __metadata("design:type", Object)
    ], AgQueryParamsNoPaginationClass.prototype, "filters", void 0);
    AgQueryParamsNoPaginationClass = __decorate([
        (0, graphql_1.ArgsType)()
    ], AgQueryParamsNoPaginationClass);
    exports.typeMap.set(AgQueryParamsNoPaginationClass, AgQueryParamsNoPaginationClass);
    return exports.typeMap.get(AgQueryParamsNoPaginationClass);
}
//# sourceMappingURL=ag-grid.args.js.map