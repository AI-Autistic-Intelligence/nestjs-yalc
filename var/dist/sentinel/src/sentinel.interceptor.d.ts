import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class RagGroundednessInterceptor implements NestInterceptor {
    private readonly minGroundednessScore;
    constructor(minGroundednessScore?: number);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
