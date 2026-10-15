import { GqlExceptionFilter } from '@nestjs/graphql';
import { InputValidationError } from '@node-yalc/errors';
import type { LoggerService } from '@nestjs/common';
export declare class ValidationExceptionFilter implements GqlExceptionFilter {
    private logger;
    constructor(logger: LoggerService);
    catch(error: Error): InputValidationError;
}
