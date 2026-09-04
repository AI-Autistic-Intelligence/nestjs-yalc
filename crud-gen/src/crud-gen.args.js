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
exports.crudGenParamsFactory = crudGenParamsFactory;
exports.crudGenParamsNoPaginationFactory = crudGenParamsNoPaginationFactory;
const graphql_1 = require("@nestjs/graphql");
const crud_gen_input_js_1 = require("./api-graphql/crud-gen.input.js");
const filter_scalar_js_1 = require("./filter.scalar.js");
const returnValue_js_1 = __importDefault(require("@nestjs-yalc/utils/returnValue.js"));
const crud_gen_enum_js_1 = require("./crud-gen.enum.js");
exports.typeMap = new WeakMap();
function crudGenParamsFactory(defaultValues, entityModel) {
    var _a, _b;
    const SortType = entityModel ? [(0, crud_gen_input_js_1.sortModelFactory)(entityModel)] : [crud_gen_input_js_1.SortModel];
    const FilterType = entityModel
        ? (0, crud_gen_input_js_1.filterExpressionInputFactory)(entityModel)
        : filter_scalar_js_1.FilterScalar;
    let CrudGenParams = class CrudGenParams {
        constructor() {
            var _a, _b;
            this.startRow = (_a = defaultValues === null || defaultValues === void 0 ? void 0 : defaultValues.startRow) !== null && _a !== void 0 ? _a : crud_gen_enum_js_1.RowDefaultValues.START_ROW;
            this.endRow = (_b = defaultValues === null || defaultValues === void 0 ? void 0 : defaultValues.endRow) !== null && _b !== void 0 ? _b : crud_gen_enum_js_1.RowDefaultValues.END_ROW;
        }
    };
    __decorate([
        (0, graphql_1.Field)(() => Number, {
            nullable: true,
            defaultValue: (_a = defaultValues === null || defaultValues === void 0 ? void 0 : defaultValues.startRow) !== null && _a !== void 0 ? _a : crud_gen_enum_js_1.RowDefaultValues.START_ROW,
        }),
        __metadata("design:type", Number)
    ], CrudGenParams.prototype, "startRow", void 0);
    __decorate([
        (0, graphql_1.Field)(() => Number, {
            nullable: true,
            defaultValue: (_b = defaultValues === null || defaultValues === void 0 ? void 0 : defaultValues.endRow) !== null && _b !== void 0 ? _b : crud_gen_enum_js_1.RowDefaultValues.END_ROW,
        }),
        __metadata("design:type", Number)
    ], CrudGenParams.prototype, "endRow", void 0);
    __decorate([
        (0, graphql_1.Field)((0, returnValue_js_1.default)(SortType), {
            nullable: true,
            defaultValue: defaultValues === null || defaultValues === void 0 ? void 0 : defaultValues.sorting,
        }),
        __metadata("design:type", Object)
    ], CrudGenParams.prototype, "sorting", void 0);
    __decorate([
        (0, graphql_1.Field)((0, returnValue_js_1.default)(FilterType), {
            nullable: true,
            defaultValue: defaultValues === null || defaultValues === void 0 ? void 0 : defaultValues.filters,
        }),
        __metadata("design:type", Object)
    ], CrudGenParams.prototype, "filters", void 0);
    CrudGenParams = __decorate([
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
    __decorate([
        (0, graphql_1.Field)((0, returnValue_js_1.default)(SortType), {
            nullable: true,
            defaultValue: defaultValues === null || defaultValues === void 0 ? void 0 : defaultValues.sorting,
        }),
        __metadata("design:type", Object)
    ], CrudGenParams.prototype, "sorting", void 0);
    __decorate([
        (0, graphql_1.Field)((0, returnValue_js_1.default)(FilterType), {
            nullable: true,
            defaultValue: defaultValues === null || defaultValues === void 0 ? void 0 : defaultValues.filters,
        }),
        __metadata("design:type", Object)
    ], CrudGenParams.prototype, "filters", void 0);
    CrudGenParams = __decorate([
        (0, graphql_1.ArgsType)()
    ], CrudGenParams);
    exports.typeMap.set(CrudGenParams, CrudGenParams);
    return exports.typeMap.get(CrudGenParams);
}
//# sourceMappingURL=crud-gen.args.js.map