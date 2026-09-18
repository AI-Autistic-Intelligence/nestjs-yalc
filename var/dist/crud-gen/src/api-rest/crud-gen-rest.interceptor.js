"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrudGenRestPaginationInterceptor = void 0;
exports.crudGenRestPaginationInterceptorWorker = crudGenRestPaginationInterceptorWorker;
exports.buildCrudGenRestMapperInterceptor = buildCrudGenRestMapperInterceptor;
exports.buildCrudGenRestSimpleMapperInterceptor = buildCrudGenRestSimpleMapperInterceptor;
exports.buildPaginatedResultDto = buildPaginatedResultDto;
exports.buildPaginatedDTOInterceptor = buildPaginatedDTOInterceptor;
exports.buildDTOInterceptor = buildDTOInterceptor;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const crud_gen_rest_dto_js_1 = require("./crud-gen-rest.dto.js");
const object_mapper_interceptor_js_1 = require("@nest-yalc-2/utils/object-mapper.interceptor.js");
const simple_mapper_interceptor_js_1 = require("@nest-yalc-2/utils/simple-mapper.interceptor.js");
const transformers_helpers_js_1 = require("../transformers.helpers.js");
function crudGenRestPaginationInterceptorWorker(startRow, endRow) {
    return (data) => {
        if (Array.isArray(data) &&
            data.length === 2 &&
            typeof data[1] === 'number') {
            const [page, count] = data;
            return {
                list: page,
                pageData: { count, startRow: startRow ?? 0, endRow: endRow ?? count },
            };
        }
        const list = data;
        const count = Array.isArray(list) ? list.length : 0;
        const start = startRow ?? 0;
        const computedEnd = endRow ?? start + count;
        return {
            list,
            pageData: { count, startRow: start, endRow: computedEnd },
        };
    };
}
let CrudGenRestPaginationInterceptor = class CrudGenRestPaginationInterceptor {
    intercept(context, next) {
        const http = context.switchToHttp();
        const request = http.getRequest();
        const params = request.query ?? {};
        const { startRow, endRow } = params;
        return next
            .handle()
            .pipe((0, operators_1.map)(crudGenRestPaginationInterceptorWorker(startRow, endRow)));
    }
};
exports.CrudGenRestPaginationInterceptor = CrudGenRestPaginationInterceptor;
exports.CrudGenRestPaginationInterceptor = CrudGenRestPaginationInterceptor = tslib_1.__decorate([
    (0, common_1.Injectable)()
], CrudGenRestPaginationInterceptor);
function buildCrudGenRestMapperInterceptor(entityToDtoSchema, withPagination = false) {
    return (0, object_mapper_interceptor_js_1.objectMapperInterceptor)(entityToDtoSchema, {
        transformData: (data) => {
            return withPagination ? data[0] : data;
        },
        callback: (inputData, data) => {
            return withPagination ? [data, inputData[1]] : data;
        },
    });
}
function buildCrudGenRestSimpleMapperInterceptor(dto, withPagination = false) {
    return (0, simple_mapper_interceptor_js_1.buildSimpleMapperInterceptor)(dto, {
        transformer: (data) => {
            return withPagination ? data[0] : data;
        },
        callback: (inputData, data) => {
            return withPagination ? [data, inputData[1]] : data;
        },
    });
}
function buildPaginatedResultDto(dto) {
    class NewPaginatedResultDto extends crud_gen_rest_dto_js_1.PaginatedResultDto {
        constructor(data, pageData) {
            super(data.map((item) => {
                return (0, transformers_helpers_js_1.yalcPlainToInstance)(dto, item);
            }), pageData);
        }
    }
    return NewPaginatedResultDto;
}
function buildPaginatedDTOInterceptor(dto) {
    let PaginateDTOInterceptor = class PaginateDTOInterceptor {
        intercept(context, next) {
            const http = context.switchToHttp();
            const request = http.getRequest();
            const params = request.query ?? {};
            const { startRow, endRow } = params;
            return next.handle().pipe((0, operators_1.map)(([data, count]) => {
                const PaginatedDto = buildPaginatedResultDto(dto);
                const res = new PaginatedDto(data, {
                    count,
                    startRow: startRow ?? 0,
                    endRow: endRow ?? count,
                });
                return res;
            }));
        }
    };
    PaginateDTOInterceptor = tslib_1.__decorate([
        (0, common_1.Injectable)()
    ], PaginateDTOInterceptor);
    return PaginateDTOInterceptor;
}
function buildDTOInterceptor(dto) {
    let DtoInterceptor = class DtoInterceptor {
        intercept(_context, next) {
            return next.handle().pipe((0, operators_1.map)((data) => {
                return (0, transformers_helpers_js_1.yalcPlainToInstance)(dto, data);
            }));
        }
    };
    DtoInterceptor = tslib_1.__decorate([
        (0, common_1.Injectable)()
    ], DtoInterceptor);
    return DtoInterceptor;
}
//# sourceMappingURL=crud-gen-rest.interceptor.js.map