import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ObjectMapperType } from '@node-yalc/utils/object-mapper.helper';
export declare function objectMapperInterceptor<TInputObject extends Record<string, any>, TOutputObject extends Record<string, any>>(mapper: ObjectMapperType<TInputObject, TOutputObject>, options?: {
    copyNonMappedProperties?: boolean;
    transformData?: {
        (data: any): any;
    };
    callback?: {
        (inputData: any, outputData: any): any;
    };
}): {
    new (): {
        intercept(_context: ExecutionContext, next: CallHandler): Observable<any>;
    };
};
