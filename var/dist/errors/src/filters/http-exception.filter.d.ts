import { GqlExceptionFilter } from '@nestjs/graphql';
import * as common from '@nestjs/common';
import { DefaultErrorMixin, MissingArgumentsError } from '@nest-yalc-2/errors';
import { GqlError } from '@nest-yalc-2/graphql/plugins/gql.error.js';
import { BaseExceptionFilter } from '@nestjs/core';
import { type ImprovedLoggerService } from '@nest-yalc-2/logger/logger-abstract.service.js';
type HttpErrorType = common.HttpException | MissingArgumentsError | GqlError | DefaultErrorMixin;
export declare class HttpExceptionFilter extends BaseExceptionFilter implements GqlExceptionFilter, common.ExceptionFilter {
    protected logger: ImprovedLoggerService;
    constructor(logger: ImprovedLoggerService, applicationRef?: common.HttpServer);
    catch(error: Error | HttpErrorType, host: common.ArgumentsHost, { sendResponse }?: {
        sendResponse: boolean;
    }): any;
}
export {};
