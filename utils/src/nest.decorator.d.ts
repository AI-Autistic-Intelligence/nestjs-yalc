import { ExecutionContext } from '@nestjs/common';
export declare const paramDecoratorToCreate: (_data: unknown, context: ExecutionContext) => ExecutionContext;
export declare const GetContext: (...dataOrPipes: unknown[]) => ParameterDecorator;
