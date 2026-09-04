import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { IFieldMapper } from '@nestjs-yalc/interfaces/maps.interface.js';
export declare function crudGenGqlInterceptorWorker<T>(startRow: number, endRow: number): (value: [T, number] | T) => T | [T, number] | {
    nodes: T;
    pageData: {
        count: number;
        startRow: number;
        endRow: number;
    };
};
export declare class CrudGenGqlInterceptor<T = IFieldMapper> implements NestInterceptor<T> {
    intercept(context: ExecutionContext, next: CallHandler): import("rxjs").Observable<any>;
}
