/**
 * # NestJS Ferrox-Node RAG Groundedness & Response Interceptor (`sentinel.interceptor.ts`)
 * Evaluates LLM generated response groundedness against retrieved context
 */

import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadGatewayException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RagHallucinationGroundednessEngine } from './algorithms/rag-groundedness.js';

@Injectable()
export class RagGroundednessInterceptor implements NestInterceptor {
  constructor(private readonly minGroundednessScore: number = 0.70) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const retrievedContexts: string[] = request.ragContexts || [];

    return next.handle().pipe(
      map((response) => {
        if (typeof response === 'string' && retrievedContexts.length > 0) {
          const assessment = RagHallucinationGroundednessEngine.evaluateGroundedness(
            response,
            retrievedContexts,
            this.minGroundednessScore
          );

          if (!assessment.isGrounded) {
            throw new BadGatewayException(
              `[FerroxSentinel] LLM response failed groundedness check (Score: ${assessment.groundednessScore.toFixed(2)} < ${this.minGroundednessScore})`
            );
          }
        }
        return response;
      })
    );
  }
}
