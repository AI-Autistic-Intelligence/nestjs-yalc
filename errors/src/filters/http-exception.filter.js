import { __decorate, __metadata } from "tslib";
import * as common from '@nestjs/common';
import { isDefaultErrorMixin, formatCause, } from '@node-yalc/errors';
import { MissingArgumentsError } from '@nest-yalc-2/crud-gen/missing-arguments.error.js';
import { isEntityError, } from '@nest-yalc-2/crud-gen/entity.error.js';
import { GqlError } from '@nest-yalc-2/graphql/plugins/gql.error.js';
import { BaseExceptionFilter } from '@nestjs/core';
import { getLogLevelByStatus } from '@node-yalc/event-manager/event.helper.js';
import { LogLevelEnum } from '@node-yalc/logger/logger.enum.js';
let HttpExceptionFilter = class HttpExceptionFilter extends BaseExceptionFilter {
    constructor(logger, applicationRef) {
        super(applicationRef);
        this.logger = logger;
    }
    catch(error, host, { sendResponse } = { sendResponse: true }) {
        try {
            const isHttpError = this.isHttpError(error) ||
                error instanceof common.HttpException ||
                typeof error.getStatus === 'function' ||
                typeof error.status === 'number' ||
                typeof error.statusCode === 'number' ||
                isDefaultErrorMixin(error);
            // TODO: Validate when monitoring is in place if we need an eventEmitter here instead of log
            switch (true) {
                // Base logging for normal operation execution errors
                case error instanceof MissingArgumentsError:
                    this.logger.log(error.message, {
                        ...(error.stack !== undefined ? { stack: error.stack } : {}),
                    });
                    break;
                case isDefaultErrorMixin(error):
                    // no need to log, DefaultErrorMixin already logs
                    break;
                /**
                 * Log original error message (for now only if is an EntityError)
                 * @todo refactor with the default error mixin
                 */
                case isEntityError(error):
                    {
                        const entityError = error;
                        this.logger.error(entityError.originalError?.message
                            ? entityError.originalError.message
                            : error, entityError.originalError?.stack, {
                            ...(entityError.originalError?.stack !== undefined ? { stack: entityError.originalError.stack } : {}),
                            data: {
                                response: entityError.getResponse(),
                                name: entityError.name,
                                ...(formatCause(entityError.cause) !== undefined ? { cause: formatCause(entityError.cause) } : {}),
                            },
                        });
                    }
                    break;
                case isHttpError:
                    {
                        const httpError = error;
                        const logLevel = getLogLevelByStatus(httpError.getStatus());
                        const errorCause = formatCause(error.cause);
                        if (logLevel === LogLevelEnum.ERROR) {
                            this.logger[logLevel](error.message, error.stack, {
                                ...(httpError.stack !== undefined ? { stack: httpError.stack } : {}),
                                data: {
                                    response: httpError.getResponse(),
                                    name: error.name,
                                    ...(errorCause !== undefined ? { cause: errorCause } : {}),
                                },
                            });
                        }
                        else {
                            this.logger[logLevel](error.message, {
                                ...(error.stack !== undefined ? { stack: error.stack } : {}),
                                data: {
                                    response: httpError.getResponse(),
                                    name: error.name,
                                    ...(errorCause !== undefined ? { cause: errorCause } : {}),
                                },
                            });
                        }
                    }
                    break;
                case error instanceof GqlError:
                    this.logger.error(error.systemMessage ?? error.message);
                    break;
                // Log critically any other error, as those are not expected
                default:
                    this.logger.error(error.message, error.stack, {
                        ...(error.stack !== undefined ? { stack: error.stack } : {}),
                        data: {
                            ...(formatCause(error.cause) !== undefined ? { cause: formatCause(error.cause) } : {}),
                            name: error.name,
                        },
                    });
                    break;
            }
            if (host.getType() === 'http') {
                if (sendResponse) {
                    const ctx = host.switchToHttp();
                    const response = ctx.getResponse();
                    let status = common.HttpStatus.INTERNAL_SERVER_ERROR;
                    if (typeof error.getStatus === 'function') {
                        status = error.getStatus();
                    }
                    else if (typeof error.status === 'number') {
                        status = error.status;
                    }
                    else if (typeof error.statusCode === 'number') {
                        status = error.statusCode;
                    }
                    const rawBody = typeof error.getResponse === 'function'
                        ? error.getResponse()
                        : (error.response ?? { message: error.message });
                    const body = typeof rawBody === 'object' && rawBody !== null
                        ? { statusCode: status, ...rawBody }
                        : { statusCode: status, message: rawBody };
                    return response.status(status).send(body);
                }
            }
        }
        catch (e) {
            // eslint-disable-next-line no-console
            console.error(e); // if there's an error with the logger itself
        }
        return error;
    }
};
HttpExceptionFilter = __decorate([
    common.Catch(),
    __metadata("design:paramtypes", [Object, Object])
], HttpExceptionFilter);
export { HttpExceptionFilter };
//# sourceMappingURL=http-exception.filter.js.map