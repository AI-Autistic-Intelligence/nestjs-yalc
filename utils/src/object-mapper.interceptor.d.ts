import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ObjectMapperType } from '@node-yalc/utils/object-mapper.helper.js';
export declare function objectMapperInterceptor<TInputObject extends Record<string, unknown>, TOutputObject extends Record<string, unknown>>(mapper: ObjectMapperType<TInputObject, TOutputObject>, options?: {
    copyNonMappedProperties?: boolean;
    transformData?: {
        (data: unknown): unknown;
    };
    callback?: {
        (inputData: unknown, outputData: unknown): unknown;
    };
}): {
    new (): {
        intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown>;
    };
};
