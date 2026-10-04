import { GqlExceptionFilter } from '@nestjs/graphql';
import * as common from '@nestjs/common';
import type { HttpServer } from '@nestjs/common';
import { IAbstractDefaultError } from '@node-yalc/errors';
import { MissingArgumentsError } from '@nest-yalc-2/crud-gen/missing-arguments.error.js';
import { FastifyReply as FResponse } from 'fastify';
import { GqlError } from '@nest-yalc-2/graphql/plugins/gql.error.js';
import { BaseExceptionFilter } from '@nestjs/core';
import { type ImprovedLoggerService } from '@node-yalc/logger/logger-abstract.service.js';
type HttpErrorType = common.HttpException | MissingArgumentsError | GqlError | IAbstractDefaultError;
export declare class HttpExceptionFilter extends BaseExceptionFilter implements GqlExceptionFilter, common.ExceptionFilter {
    protected logger: ImprovedLoggerService;
    constructor(logger: ImprovedLoggerService, applicationRef?: HttpServer);
    catch(error: Error | HttpErrorType, host: common.ArgumentsHost, { sendResponse }?: {
        sendResponse: boolean;
    }): Error | FResponse<import("fastify").RouteGenericInterface, import("fastify").RawServerDefault, import("node:http").IncomingMessage, import("node:http").ServerResponse<import("node:http").IncomingMessage>, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown> | IAbstractDefaultError;
}
export {};
