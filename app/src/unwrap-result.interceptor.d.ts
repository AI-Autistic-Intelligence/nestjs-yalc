import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class UnwrapResultInterceptor implements NestInterceptor {
    intercept(_: ExecutionContext, next: CallHandler): Observable<any>;
}
