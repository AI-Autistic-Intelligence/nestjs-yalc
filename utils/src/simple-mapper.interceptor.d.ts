import { NestInterceptor } from '@nestjs/common';
/**
 *
 * @param Dto
 * @param transformer used to transform the data before mapping it to the DTO.
 * This is useful when the data is not in the correct format to be mapped to the DTO.
 * @returns
 */
export declare function buildSimpleMapperInterceptor<T, R>(Dto: new (data: T) => R, options?: {
    transformer?: (data: T) => T;
    callback?: {
        (inputData: T, outputData: R | R[]): R | R[];
    };
}): new () => NestInterceptor<T, R | R[]>;
