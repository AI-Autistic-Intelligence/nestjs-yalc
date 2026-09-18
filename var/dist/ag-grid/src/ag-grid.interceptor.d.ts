import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { FieldMapper } from '@node-yalc/interfaces/maps.interface';
export declare function agGridInterceptorWorker<T>(startRow: number, endRow: number): ([page, count]: [T, number]) => {
    nodes: T;
    pageData: {
        count: number;
        startRow: number;
        endRow: number;
    };
};
export declare class AgGridInterceptor<T = FieldMapper> implements NestInterceptor<T> {
    intercept(context: ExecutionContext, next: CallHandler): import("rxjs").Observable<{
        nodes: unknown;
        pageData: {
            count: number;
            startRow: number;
            endRow: number;
        };
    }>;
}
