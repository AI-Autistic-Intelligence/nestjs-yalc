import { GqlExceptionFilter } from '@nestjs/graphql';
import type { LoggerService } from '@nestjs/common';
export declare class ValidationExceptionFilter implements GqlExceptionFilter {
    private logger;
    constructor(logger: LoggerService);
    catch(error: Error): any;
}
