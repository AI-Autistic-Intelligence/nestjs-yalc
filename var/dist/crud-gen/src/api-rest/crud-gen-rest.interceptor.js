import { __decorate } from "tslib";
import { Injectable, } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { PaginatedResultDto, } from './crud-gen-rest.dto.js';
import { objectMapperInterceptor } from '@nestjs-yalc/utils/object-mapper.interceptor.js';
import { buildSimpleMapperInterceptor } from '@nestjs-yalc/utils/simple-mapper.interceptor.js';
import { yalcPlainToInstance } from '../transformers.helpers.js';
export function crudGenRestPaginationInterceptorWorker(startRow, endRow) {
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
            .pipe(map(crudGenRestPaginationInterceptorWorker(startRow, endRow)));
    }
};
CrudGenRestPaginationInterceptor = __decorate([
    Injectable()
], CrudGenRestPaginationInterceptor);
export { CrudGenRestPaginationInterceptor };
export function buildCrudGenRestMapperInterceptor(entityToDtoSchema, withPagination = false) {
    return objectMapperInterceptor(entityToDtoSchema, {
        transformData: (data) => {
            return withPagination ? data[0] : data;
        },
        callback: (inputData, data) => {
            return withPagination ? [data, inputData[1]] : data;
        },
    });
}
export function buildCrudGenRestSimpleMapperInterceptor(dto, withPagination = false) {
    return buildSimpleMapperInterceptor(dto, {
        transformer: (data) => {
            return withPagination ? data[0] : data;
        },
        callback: (inputData, data) => {
            return withPagination ? [data, inputData[1]] : data;
        },
    });
}
export function buildPaginatedResultDto(dto) {
    class NewPaginatedResultDto extends PaginatedResultDto {
        constructor(data, pageData) {
            super(data.map((item) => {
                return yalcPlainToInstance(dto, item);
            }), pageData);
        }
    }
    return NewPaginatedResultDto;
}
export function buildPaginatedDTOInterceptor(dto) {
    let PaginateDTOInterceptor = class PaginateDTOInterceptor {
        intercept(context, next) {
            const http = context.switchToHttp();
            const request = http.getRequest();
            const params = request.query ?? {};
            const { startRow, endRow } = params;
            return next.handle().pipe(map(([data, count]) => {
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
    PaginateDTOInterceptor = __decorate([
        Injectable()
    ], PaginateDTOInterceptor);
    return PaginateDTOInterceptor;
}
export function buildDTOInterceptor(dto) {
    let DtoInterceptor = class DtoInterceptor {
        intercept(_context, next) {
            return next.handle().pipe(map((data) => {
                return yalcPlainToInstance(dto, data);
            }));
        }
    };
    DtoInterceptor = __decorate([
        Injectable()
    ], DtoInterceptor);
    return DtoInterceptor;
}
//# sourceMappingURL=crud-gen-rest.interceptor.js.map