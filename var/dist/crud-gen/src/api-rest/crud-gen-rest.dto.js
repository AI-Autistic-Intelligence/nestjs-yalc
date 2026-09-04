import { __decorate, __metadata } from "tslib";
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { entityFieldsEnumFactory, RowDefaultValues, SortDirection, } from '../crud-gen.enum.js';
import { Exclude, Expose } from 'class-transformer';
import { ParseInt } from '@nestjs-yalc/field-middleware/class-transformer.helper.js';
export class CGQueryDto extends PaginationDTOMixin() {
}
export class SortModelRest {
}
__decorate([
    IsString(),
    __metadata("design:type", String)
], SortModelRest.prototype, "colId", void 0);
const sortModelCacheMap = new WeakMap();
export function sortModelRestFactory(entityModel) {
    const cached = sortModelCacheMap.get(entityModel);
    if (cached)
        return cached;
    const fieldsEnum = entityFieldsEnumFactory(entityModel);
    class SortModel {
        constructor() {
            this.sort = SortDirection.ASC;
        }
    }
    sortModelCacheMap.set(entityModel, SortModel);
    return SortModel;
}
export const typeMap = new WeakMap();
export function crudGenRestParamsFactory(defaultValues, entityModel) {
    const SortType = entityModel
        ? [sortModelRestFactory(entityModel)]
        : [SortModelRest];
    class CrudGenParams {
        constructor() {
            this.startRow = defaultValues?.startRow ?? RowDefaultValues.START_ROW;
            this.endRow = defaultValues?.endRow ?? RowDefaultValues.END_ROW;
        }
    }
    typeMap.set(CrudGenParams, CrudGenParams);
    return typeMap.get(CrudGenParams);
}
export function crudGenRestParamsNoPaginationFactory(defaultValues, entityModel) {
    const SortType = entityModel
        ? [sortModelRestFactory(entityModel)]
        : [SortModelRest];
    class CrudGenParams {
        constructor() {
            this.sorting = defaultValues?.sorting;
            this.filters = defaultValues?.filters;
        }
    }
    typeMap.set(CrudGenParams, CrudGenParams);
    return typeMap.get(CrudGenParams);
}
let PageData = class PageData {
};
__decorate([
    Expose(),
    __metadata("design:type", Number)
], PageData.prototype, "count", void 0);
__decorate([
    Expose(),
    __metadata("design:type", Number)
], PageData.prototype, "startRow", void 0);
__decorate([
    Expose(),
    __metadata("design:type", Number)
], PageData.prototype, "endRow", void 0);
PageData = __decorate([
    Exclude()
], PageData);
export { PageData };
let PaginatedResultDto = class PaginatedResultDto {
    constructor(list, pageData) {
        this.list = list;
        this.pageData = pageData;
    }
};
__decorate([
    Expose(),
    __metadata("design:type", Array)
], PaginatedResultDto.prototype, "list", void 0);
__decorate([
    Expose(),
    __metadata("design:type", PageData)
], PaginatedResultDto.prototype, "pageData", void 0);
PaginatedResultDto = __decorate([
    Exclude(),
    __metadata("design:paramtypes", [Array, PageData])
], PaginatedResultDto);
export { PaginatedResultDto };
export class CGRestQueryArgs extends PaginationDTOMixin() {
}
__decorate([
    IsOptional(),
    __metadata("design:type", Array)
], CGRestQueryArgs.prototype, "sorting", void 0);
__decorate([
    IsOptional(),
    __metadata("design:type", Object)
], CGRestQueryArgs.prototype, "filters", void 0);
export function PaginationDTOMixin(base = class {
}) {
    class PaginationDTO extends base {
        constructor() {
            super(...arguments);
            this.startRow = RowDefaultValues.START_ROW;
            this.endRow = RowDefaultValues.END_ROW;
        }
    }
    __decorate([
        IsOptional(),
        IsInt(),
        ParseInt(),
        Min(0),
        __metadata("design:type", Number)
    ], PaginationDTO.prototype, "startRow", void 0);
    __decorate([
        IsOptional(),
        IsInt(),
        ParseInt(),
        Min(0),
        __metadata("design:type", Number)
    ], PaginationDTO.prototype, "endRow", void 0);
    return PaginationDTO;
}
//# sourceMappingURL=crud-gen-rest.dto.js.map