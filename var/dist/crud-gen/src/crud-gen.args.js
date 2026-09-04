import { __decorate, __metadata } from "tslib";
import { ArgsType, Field } from '@nestjs/graphql';
import { filterExpressionInputFactory, SortModel, sortModelFactory, } from './api-graphql/crud-gen.input.js';
import { FilterScalar } from './filter.scalar.js';
import returnValue from '@nestjs-yalc/utils/returnValue.js';
import { RowDefaultValues } from './crud-gen.enum.js';
export const typeMap = new WeakMap();
export function crudGenParamsFactory(defaultValues, entityModel) {
    const SortType = entityModel ? [sortModelFactory(entityModel)] : [SortModel];
    const FilterType = entityModel
        ? filterExpressionInputFactory(entityModel)
        : FilterScalar;
    let CrudGenParams = class CrudGenParams {
        constructor() {
            this.startRow = defaultValues?.startRow ?? RowDefaultValues.START_ROW;
            this.endRow = defaultValues?.endRow ?? RowDefaultValues.END_ROW;
        }
    };
    __decorate([
        Field(() => Number, {
            nullable: true,
            defaultValue: defaultValues?.startRow ?? RowDefaultValues.START_ROW,
        }),
        __metadata("design:type", Number)
    ], CrudGenParams.prototype, "startRow", void 0);
    __decorate([
        Field(() => Number, {
            nullable: true,
            defaultValue: defaultValues?.endRow ?? RowDefaultValues.END_ROW,
        }),
        __metadata("design:type", Number)
    ], CrudGenParams.prototype, "endRow", void 0);
    __decorate([
        Field(returnValue(SortType), {
            nullable: true,
            defaultValue: defaultValues?.sorting,
        }),
        __metadata("design:type", Object)
    ], CrudGenParams.prototype, "sorting", void 0);
    __decorate([
        Field(returnValue(FilterType), {
            nullable: true,
            defaultValue: defaultValues?.filters,
        }),
        __metadata("design:type", Object)
    ], CrudGenParams.prototype, "filters", void 0);
    CrudGenParams = __decorate([
        ArgsType()
    ], CrudGenParams);
    typeMap.set(CrudGenParams, CrudGenParams);
    return typeMap.get(CrudGenParams);
}
export function crudGenParamsNoPaginationFactory(defaultValues, entityModel) {
    const SortType = entityModel ? [sortModelFactory(entityModel)] : [SortModel];
    const FilterType = entityModel
        ? filterExpressionInputFactory(entityModel)
        : FilterScalar;
    let CrudGenParams = class CrudGenParams {
    };
    __decorate([
        Field(returnValue(SortType), {
            nullable: true,
            defaultValue: defaultValues?.sorting,
        }),
        __metadata("design:type", Object)
    ], CrudGenParams.prototype, "sorting", void 0);
    __decorate([
        Field(returnValue(FilterType), {
            nullable: true,
            defaultValue: defaultValues?.filters,
        }),
        __metadata("design:type", Object)
    ], CrudGenParams.prototype, "filters", void 0);
    CrudGenParams = __decorate([
        ArgsType()
    ], CrudGenParams);
    typeMap.set(CrudGenParams, CrudGenParams);
    return typeMap.get(CrudGenParams);
}
//# sourceMappingURL=crud-gen.args.js.map