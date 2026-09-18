import { ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClassType } from '@node-yalc/types/globals';
export declare function modelFieldMapperInterceptor(inputClass: ClassType, outputClass: ClassType): {
    new (): {
        intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    };
};
