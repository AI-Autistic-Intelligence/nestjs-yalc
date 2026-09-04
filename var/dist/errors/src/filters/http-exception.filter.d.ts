import { GqlExceptionFilter } from '@nestjs/graphql';
import * as common from '@nestjs/common';
import { DefaultErrorMixin, MissingArgumentsError } from '@nestjs-yalc/errors';
import { FastifyReply as FResponse } from 'fastify';
import { GqlError } from '@nestjs-yalc/graphql/plugins/gql.error.js';
import { BaseExceptionFilter } from '@nestjs/core';
import { type ImprovedLoggerService } from '@nestjs-yalc/logger/logger-abstract.service.js';
type HttpErrorType = common.HttpException | MissingArgumentsError | GqlError | DefaultErrorMixin;
export declare class HttpExceptionFilter extends BaseExceptionFilter implements GqlExceptionFilter, common.ExceptionFilter {
    protected logger: ImprovedLoggerService;
    constructor(logger: ImprovedLoggerService, applicationRef?: common.HttpServer);
    catch(error: Error | HttpErrorType, host: common.ArgumentsHost, { sendResponse }?: {
        sendResponse: boolean;
    }): Error | import("@nestjs-yalc/errors").IAbstractDefaultError | FResponse<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("node:http").ServerResponse<import("node:http").IncomingMessage>, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown>;
}
export {};
