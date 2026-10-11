import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { modelFieldToDest } from './model-object.helper.js';
import { ClassType } from '@node-yalc/types/globals.js';

export function modelFieldMapperInterceptor(
  inputClass: ClassType,
  outputClass: ClassType,
) {
  @Injectable()
  class ModelFieldMapperInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
      const request = context.switchToHttp().getRequest();
      if (request.body) {
        const mappedInput = modelFieldToDest(inputClass as unknown as Record<string, unknown>, outputClass as unknown as Record<string, unknown>);
        context.switchToHttp().getRequest().body = mappedInput;
      }

      return next.handle().pipe(
        map((data) => {
          return modelFieldToDest(data as unknown as Record<string, unknown>, outputClass as unknown as Record<string, unknown>);
        }),
      );
    }
  }

  return ModelFieldMapperInterceptor;
}
