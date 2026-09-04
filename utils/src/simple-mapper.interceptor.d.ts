import { NestInterceptor } from '@nestjs/common';
export declare function buildSimpleMapperInterceptor<T, R>(Dto: new (data: T) => R, options?: {
    transformer?: (data: T) => T;
    callback?: {
        (inputData: any, outputData: any): any;
    };
}): new () => NestInterceptor<T, R>;
