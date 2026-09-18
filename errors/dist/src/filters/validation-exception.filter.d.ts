import * as common from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { InputValidationError } from '../index.js';
export declare class ValidationExceptionFilter implements GqlExceptionFilter {
    private logger;
    constructor(logger: common.LoggerService);
    catch(error: Error): InputValidationError;
}
