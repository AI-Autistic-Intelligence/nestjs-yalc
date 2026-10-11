import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

/**
 *
 * @param Dto
 * @param transformer used to transform the data before mapping it to the DTO.
 * This is useful when the data is not in the correct format to be mapped to the DTO.
 * @returns
 */
export function buildSimpleMapperInterceptor<T, R>(
  Dto: new (data: T) => R,
  options?: {
    transformer?: (data: T) => T;
    callback?: { (inputData: T, outputData: R | R[]): R | R[] };
  },
): new () => NestInterceptor<T, R | R[]> {
  @Injectable()
  class SimpleMapper implements NestInterceptor<T, R | R[]> {
    intercept(
      _context: ExecutionContext,
      next: CallHandler<T>,
    ): Observable<R | R[]> {
      return next.handle().pipe(
        map((data) => {
          const tData = options?.transformer?.(data) ?? data;
          const mappedData = Array.isArray(tData)
            ? tData.map((d) => new Dto(d))
            : new Dto(tData);

          return options?.callback?.(data, mappedData) ?? mappedData;
        }),
      );
    }
  }

  return SimpleMapper;
}
