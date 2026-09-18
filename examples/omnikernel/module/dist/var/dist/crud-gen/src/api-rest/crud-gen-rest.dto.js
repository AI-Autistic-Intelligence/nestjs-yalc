"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CGRestQueryArgs = exports.PaginatedResultDto = exports.PageData = exports.typeMap = exports.SortModelRest = exports.CGQueryDto = void 0;
exports.sortModelRestFactory = sortModelRestFactory;
exports.crudGenRestParamsFactory = crudGenRestParamsFactory;
exports.crudGenRestParamsNoPaginationFactory = crudGenRestParamsNoPaginationFactory;
exports.PaginationDTOMixin = PaginationDTOMixin;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const crud_gen_enum_js_1 = require("../crud-gen.enum.js");
const class_transformer_1 = require("class-transformer");
const class_transformer_helper_js_1 = require("@nest-yalc-2/field-middleware/class-transformer.helper.js");
class CGQueryDto extends PaginationDTOMixin() {
}
exports.CGQueryDto = CGQueryDto;
class SortModelRest {
}
exports.SortModelRest = SortModelRest;
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], SortModelRest.prototype, "colId", void 0);
const sortModelCacheMap = new WeakMap();
function sortModelRestFactory(entityModel) {
    const cached = sortModelCacheMap.get(entityModel);
    if (cached)
        return cached;
    const fieldsEnum = (0, crud_gen_enum_js_1.entityFieldsEnumFactory)(entityModel);
    class SortModel {
        constructor() {
            this.sort = crud_gen_enum_js_1.SortDirection.ASC;
        }
    }
    sortModelCacheMap.set(entityModel, SortModel);
    return SortModel;
}
exports.typeMap = new WeakMap();
function crudGenRestParamsFactory(defaultValues, entityModel) {
    const SortType = entityModel
        ? [sortModelRestFactory(entityModel)]
        : [SortModelRest];
    class CrudGenParams {
        constructor() {
            this.startRow = defaultValues?.startRow ?? crud_gen_enum_js_1.RowDefaultValues.START_ROW;
            this.endRow = defaultValues?.endRow ?? crud_gen_enum_js_1.RowDefaultValues.END_ROW;
        }
    }
    exports.typeMap.set(CrudGenParams, CrudGenParams);
    return exports.typeMap.get(CrudGenParams);
}
function crudGenRestParamsNoPaginationFactory(defaultValues, entityModel) {
    const SortType = entityModel
        ? [sortModelRestFactory(entityModel)]
        : [SortModelRest];
    class CrudGenParams {
        constructor() {
            this.sorting = defaultValues?.sorting;
            this.filters = defaultValues?.filters;
        }
    }
    exports.typeMap.set(CrudGenParams, CrudGenParams);
    return exports.typeMap.get(CrudGenParams);
}
let PageData = class PageData {
};
exports.PageData = PageData;
tslib_1.__decorate([
    (0, class_transformer_1.Expose)(),
    tslib_1.__metadata("design:type", Number)
], PageData.prototype, "count", void 0);
tslib_1.__decorate([
    (0, class_transformer_1.Expose)(),
    tslib_1.__metadata("design:type", Number)
], PageData.prototype, "startRow", void 0);
tslib_1.__decorate([
    (0, class_transformer_1.Expose)(),
    tslib_1.__metadata("design:type", Number)
], PageData.prototype, "endRow", void 0);
exports.PageData = PageData = tslib_1.__decorate([
    (0, class_transformer_1.Exclude)()
], PageData);
let PaginatedResultDto = class PaginatedResultDto {
    constructor(list, pageData) {
        this.list = list;
        this.pageData = pageData;
    }
};
exports.PaginatedResultDto = PaginatedResultDto;
tslib_1.__decorate([
    (0, class_transformer_1.Expose)(),
    tslib_1.__metadata("design:type", Array)
], PaginatedResultDto.prototype, "list", void 0);
tslib_1.__decorate([
    (0, class_transformer_1.Expose)(),
    tslib_1.__metadata("design:type", PageData)
], PaginatedResultDto.prototype, "pageData", void 0);
exports.PaginatedResultDto = PaginatedResultDto = tslib_1.__decorate([
    (0, class_transformer_1.Exclude)(),
    tslib_1.__metadata("design:paramtypes", [Array, PageData])
], PaginatedResultDto);
class CGRestQueryArgs extends PaginationDTOMixin() {
}
exports.CGRestQueryArgs = CGRestQueryArgs;
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Array)
], CGRestQueryArgs.prototype, "sorting", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Object)
], CGRestQueryArgs.prototype, "filters", void 0);
function PaginationDTOMixin(base = class {
}) {
    class PaginationDTO extends base {
        constructor() {
            super(...arguments);
            this.startRow = crud_gen_enum_js_1.RowDefaultValues.START_ROW;
            this.endRow = crud_gen_enum_js_1.RowDefaultValues.END_ROW;
        }
    }
    tslib_1.__decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsInt)(),
        (0, class_transformer_helper_js_1.ParseInt)(),
        (0, class_validator_1.Min)(0),
        tslib_1.__metadata("design:type", Number)
    ], PaginationDTO.prototype, "startRow", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsInt)(),
        (0, class_transformer_helper_js_1.ParseInt)(),
        (0, class_validator_1.Min)(0),
        tslib_1.__metadata("design:type", Number)
    ], PaginationDTO.prototype, "endRow", void 0);
    return PaginationDTO;
}
//# sourceMappingURL=crud-gen-rest.dto.js.map