import { GqlExceptionFilter } from '@nestjs/graphql';
import * as common from '@nestjs/common';
export declare class DatabaseExceptionFilter implements GqlExceptionFilter {
    private logger;
    constructor(logger: common.LoggerService);
    catch(error: Error, host: common.ArgumentsHost): Error;
}
