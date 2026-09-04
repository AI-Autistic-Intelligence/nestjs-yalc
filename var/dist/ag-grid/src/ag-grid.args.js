import { __decorate, __metadata } from "tslib";
import { ArgsType, Field } from '@nestjs/graphql';
import { filterExpressionInputFactory, SortModel, sortModelFactory, } from './ag-grid.input';
import { FilterScalar } from './filter.scalar';
import returnValue from '@nestjs-yalc/utils/returnValue';
import { RowDefaultValues } from './ag-grid.enum';
export const typeMap = new WeakMap();
export function agQueryParamsFactory(defaultValues, entityModel) {
    const SortType = entityModel ? [sortModelFactory(entityModel)] : [SortModel];
    const FilterType = entityModel
        ? filterExpressionInputFactory(entityModel)
        : FilterScalar;
    let AgQueryParamsClass = class AgQueryParamsClass {
        constructor() {
            this.startRow = defaultValues?.startRow ?? RowDefaultValues.START_ROW;
            this.endRow = defaultValues?.endRow ?? RowDefaultValues.END_ROW;
        }
    };
    __decorate([
        Field(returnValue(SortType), {
            nullable: true,
            defaultValue: defaultValues?.sorting,
        }),
        __metadata("design:type", Object)
    ], AgQueryParamsClass.prototype, "sorting", void 0);
    __decorate([
        Field(returnValue(FilterType), {
            nullable: true,
            defaultValue: defaultValues?.filters,
        }),
        __metadata("design:type", Object)
    ], AgQueryParamsClass.prototype, "filters", void 0);
    AgQueryParamsClass = __decorate([
        ArgsType()
    ], AgQueryParamsClass);
    typeMap.set(AgQueryParamsClass, AgQueryParamsClass);
    return typeMap.get(AgQueryParamsClass);
}
export function agQueryParamsNoPaginationFactory(defaultValues, entityModel) {
    const SortType = entityModel ? [sortModelFactory(entityModel)] : [SortModel];
    const FilterType = entityModel
        ? filterExpressionInputFactory(entityModel)
        : FilterScalar;
    let AgQueryParamsNoPaginationClass = class AgQueryParamsNoPaginationClass {
    };
    __decorate([
        Field(returnValue(SortType), {
            nullable: true,
            defaultValue: defaultValues?.sorting,
        }),
        __metadata("design:type", Object)
    ], AgQueryParamsNoPaginationClass.prototype, "sorting", void 0);
    __decorate([
        Field(returnValue(FilterType), {
            nullable: true,
            defaultValue: defaultValues?.filters,
        }),
        __metadata("design:type", Object)
    ], AgQueryParamsNoPaginationClass.prototype, "filters", void 0);
    AgQueryParamsNoPaginationClass = __decorate([
        ArgsType()
    ], AgQueryParamsNoPaginationClass);
    typeMap.set(AgQueryParamsNoPaginationClass, AgQueryParamsNoPaginationClass);
    return typeMap.get(AgQueryParamsNoPaginationClass);
}
//# sourceMappingURL=ag-grid.args.js.map