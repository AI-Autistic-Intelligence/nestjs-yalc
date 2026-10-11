import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { IFieldMapper } from '@node-yalc/interfaces/maps.interface.js';
import {
  CGQueryDto,
  PageData,
  PaginatedResultDto,
} from './crud-gen-rest.dto.js';
import { objectMapperInterceptor } from '@nest-yalc-2/utils/object-mapper.interceptor.js';
import { ObjectMapperType } from '@node-yalc/utils/object-mapper.helper.js';
import { buildSimpleMapperInterceptor } from '@nest-yalc-2/utils/simple-mapper.interceptor.js';
import { ClassType } from '@node-yalc/types/globals.js';
import { Observable } from 'rxjs';
import { yalcPlainToInstance } from '../transformers.helpers.js';

export function crudGenRestPaginationInterceptorWorker<T>(
  startRow?: number,
  endRow?: number,
) {
  return (data: [T, number] | T) => {
    if (
      Array.isArray(data) &&
      data.length === 2 &&
      typeof data[1] === 'number'
    ) {
      const [page, count] = data as [T, number];
      return {
        list: page,
        pageData: { count, startRow: startRow ?? 0, endRow: endRow ?? count },
      };
    }

    const list = data as unknown as T[];
    const count = Array.isArray(list) ? list.length : 0;
    const start = startRow ?? 0;
    const computedEnd = endRow ?? start + count;
    return {
      list,
      pageData: { count, startRow: start, endRow: computedEnd },
    };
  };
}

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
@Injectable()
export class CrudGenRestPaginationInterceptor<
  T = IFieldMapper,
> implements NestInterceptor<T> {
  intercept(context: ExecutionContext, next: CallHandler) {
    const http = context.switchToHttp();
    const request = http.getRequest();

    const params: CGQueryDto = request.query ?? {};

    const { startRow, endRow } = params;

    return next
      .handle()
      .pipe(map(crudGenRestPaginationInterceptorWorker(startRow, endRow)));
  }
}

export function buildCrudGenRestMapperInterceptor<
  TInputObject extends Record<string, unknown> = any,
  TOutputObject extends Record<string, unknown> = any,
>(
  entityToDtoSchema: ObjectMapperType<TInputObject, TOutputObject>,
  withPagination: boolean = false,
) {
  return objectMapperInterceptor<TInputObject, TOutputObject>(
    entityToDtoSchema,
    {
      transformData: (data: unknown) => {
        return withPagination ? (data as unknown[])[0] : data;
      },
      callback: (inputData: unknown, data: unknown) => {
        return withPagination ? [data, (inputData as unknown[])[1]] : data;
      },
    },
  );
}

export function buildCrudGenRestSimpleMapperInterceptor<
  TInputObject extends Record<string, unknown> = any,
  TOutputObject extends Record<string, unknown> = any,
>(
  dto: new (data: TInputObject) => TOutputObject,
  withPagination: boolean = false,
) {
  return buildSimpleMapperInterceptor<TInputObject, TOutputObject>(dto, {
    transformer: (data: unknown) => {
      return (withPagination ? (data as unknown[])[0] : data) as TInputObject;
    },
    callback: (inputData: unknown, data: unknown) => {
      return (withPagination ? [data, (inputData as unknown[])[1]] : data) as TOutputObject | TOutputObject[];
    },
  });
}

export function buildPaginatedResultDto<TDto>(
  dto: new (...args: unknown[]) => TDto,
): new (data: TDto[], pageData: PageData) => PaginatedResultDto<TDto> {
  class NewPaginatedResultDto extends PaginatedResultDto<TDto> {
    constructor(data: unknown[], pageData: PageData) {
      super(
        data.map((item) => {
          return yalcPlainToInstance<TDto, unknown>(dto, item);
        }),
        pageData,
      );
    }
  }
  return NewPaginatedResultDto;
}

/**
 * Can be used in combination with the ClassSerializerInterceptor
 */
export function buildPaginatedDTOInterceptor<T>(
  dto: new (...args: unknown[]) => T,
): ClassType<NestInterceptor> {
  @Injectable()
  class PaginateDTOInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
      const http = context.switchToHttp();
      const request = http.getRequest();

      const params: CGQueryDto = request.query ?? {};

      const { startRow, endRow } = params;

      return next.handle().pipe(
        map(([data, count]) => {
          const PaginatedDto = buildPaginatedResultDto(dto);
          const res = new PaginatedDto(data, {
            count,
            startRow: startRow ?? 0,
            endRow: endRow ?? count,
          });
          return res;
        }),
      );
    }
  }

  return PaginateDTOInterceptor;
}

/**
 * Can be used in combination with the ClassSerializerInterceptor
 */
export function buildDTOInterceptor<TDto, TSrc>(
  dto: new (...args: TSrc[]) => TDto,
): ClassType<NestInterceptor> {
  @Injectable()
  class DtoInterceptor implements NestInterceptor {
    intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
      return next.handle().pipe(
        map((data) => {
          return yalcPlainToInstance<TDto, TSrc>(dto, data);
        }),
      );
    }
  }

  return DtoInterceptor;
}
