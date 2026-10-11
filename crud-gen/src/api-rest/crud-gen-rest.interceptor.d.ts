import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { IFieldMapper } from '@node-yalc/interfaces/maps.interface.js';
import { PageData, PaginatedResultDto } from './crud-gen-rest.dto.js';
import { ObjectMapperType } from '@node-yalc/utils/object-mapper.helper.js';
import { ClassType } from '@node-yalc/types/globals.js';
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
/**
 * This interceptor is used to add pagination to the response
 * by creating an object with the following structure:
 * {
 *   list: [data],
 *   pageData: {
 *     count: number,
 *     startRow: number,
 *     endRow: number,
 *    }
 */
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
export declare function buildCrudGenRestMapperInterceptor<TInputObject extends Record<string, unknown> = any, TOutputObject extends Record<string, unknown> = any>(entityToDtoSchema: ObjectMapperType<TInputObject, TOutputObject>, withPagination?: boolean): {
    new (): {
        intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown>;
    };
};
export declare function buildCrudGenRestSimpleMapperInterceptor<TInputObject extends Record<string, unknown> = any, TOutputObject extends Record<string, unknown> = any>(dto: new (data: TInputObject) => TOutputObject, withPagination?: boolean): new () => NestInterceptor<TInputObject, TOutputObject | TOutputObject[]>;
export declare function buildPaginatedResultDto<TDto>(dto: new (...args: unknown[]) => TDto): new (data: TDto[], pageData: PageData) => PaginatedResultDto<TDto>;
/**
 * Can be used in combination with the ClassSerializerInterceptor
 */
export declare function buildPaginatedDTOInterceptor<T>(dto: new (...args: unknown[]) => T): ClassType<NestInterceptor>;
/**
 * Can be used in combination with the ClassSerializerInterceptor
 */
export declare function buildDTOInterceptor<TDto, TSrc>(dto: new (...args: TSrc[]) => TDto): ClassType<NestInterceptor>;
