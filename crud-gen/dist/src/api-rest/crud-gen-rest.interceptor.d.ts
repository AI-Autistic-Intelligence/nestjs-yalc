import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { IFieldMapper } from '@nest-yalc-2/interfaces/maps.interface.js';
import { PageData, PaginatedResultDto } from './crud-gen-rest.dto.js';
import { ObjectMapperType } from '@node-yalc/utils/object-mapper.helper';
import { ClassType } from '@node-yalc/types/globals';
import { Observable } from 'rxjs';
export declare function crudGenRestPaginationInterceptorWorker<T>(startRow?: number, endRow?: number): (data: [T, number] | T) => {
    list: T;
    pageData: {
        count: number;
        startRow: number;
        endRow: number;
    };
} | {
    list: T[];
    pageData: {
        count: number;
        startRow: number;
        endRow: number;
    };
};
export declare class CrudGenRestPaginationInterceptor<T = IFieldMapper> implements NestInterceptor<T> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<{
        list: any;
        pageData: {
            count: number;
            startRow: number;
            endRow: number;
        };
    } | {
        list: any[];
        pageData: {
            count: number;
            startRow: number;
            endRow: number;
        };
    }>;
}
export declare function buildCrudGenRestMapperInterceptor<TInputObject extends Record<string, any> = any, TOutputObject extends Record<string, any> = any>(entityToDtoSchema: ObjectMapperType<TInputObject, TOutputObject>, withPagination?: boolean): {
    new (): {
        intercept(_context: ExecutionContext, next: CallHandler): Observable<any>;
    };
};
export declare function buildCrudGenRestSimpleMapperInterceptor<TInputObject extends Record<string, any> = any, TOutputObject extends Record<string, any> = any>(dto: new (data: TInputObject) => TOutputObject, withPagination?: boolean): new () => NestInterceptor<TInputObject, TOutputObject>;
export declare function buildPaginatedResultDto<TDto>(dto: new (...args: any[]) => TDto): new (data: TDto[], pageData: PageData) => PaginatedResultDto<TDto>;
export declare function buildPaginatedDTOInterceptor<T>(dto: new (...args: any[]) => T): ClassType<NestInterceptor>;
export declare function buildDTOInterceptor<TDto, TSrc>(dto: new (...args: TSrc[]) => TDto): ClassType<NestInterceptor>;
