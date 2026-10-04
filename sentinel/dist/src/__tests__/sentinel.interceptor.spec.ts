import { ExecutionContext, CallHandler, BadGatewayException } from '@nestjs/common';
import { of } from 'rxjs';
import { RagGroundednessInterceptor } from '../sentinel.interceptor.js';
import { RagHallucinationGroundednessEngine } from '../algorithms/rag-groundedness.js';

describe('RagGroundednessInterceptor', () => {
  let interceptor: RagGroundednessInterceptor;

  beforeEach(() => {
    interceptor = new RagGroundednessInterceptor();
  });

  it('should allow response without RAG contexts', (done) => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({}),
      }),
    } as ExecutionContext;

    const mockNext = {
      handle: () => of('valid response'),
    } as CallHandler;

    interceptor.intercept(mockContext, mockNext).subscribe({
      next: (val) => {
        expect(val).toBe('valid response');
        done();
      },
    });
  });

  it('should allow grounded response', (done) => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          ragContexts: ['valid context'],
        }),
      }),
    } as ExecutionContext;

    const mockNext = {
      handle: () => of('valid response'),
    } as CallHandler;

    jest.spyOn(RagHallucinationGroundednessEngine, 'evaluateGroundedness').mockReturnValueOnce({
      isGrounded: true,
      groundednessScore: 0.9,
      explanation: 'test'
    });

    interceptor.intercept(mockContext, mockNext).subscribe({
      next: (val) => {
        expect(val).toBe('valid response');
        done();
      },
    });
  });

  it('should throw BadGatewayException on ungrounded response', (done) => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          ragContexts: ['valid context'],
        }),
      }),
    } as ExecutionContext;

    const mockNext = {
      handle: () => of('invalid response'),
    } as CallHandler;

    jest.spyOn(RagHallucinationGroundednessEngine, 'evaluateGroundedness').mockReturnValueOnce({
      isGrounded: false,
      groundednessScore: 0.2,
      explanation: 'test'
    });

    interceptor.intercept(mockContext, mockNext).subscribe({
      error: (err) => {
        expect(err).toBeInstanceOf(BadGatewayException);
        done();
      },
    });
  });
});
