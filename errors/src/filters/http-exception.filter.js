import { __decorate, __metadata } from "tslib";
import * as common from '@nestjs/common';
import { DefaultErrorMixin, isDefaultErrorMixin, formatCause, } from '@node-yalc/errors';
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
            const isHttpError = this.isHttpError(error) || error instanceof common.HttpException;
            switch (true) {
                case error instanceof MissingArgumentsError:
                    this.logger.log(error.message, {
                        ...(error.stack !== undefined ? { stack: error.stack } : {}),
                    });
                    break;
                case isDefaultErrorMixin(error):
                    break;
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
                    if (isHttpError)
                        status = error.getStatus();
                    return response.status(status).send(error.message);
                }
            }
        }
        catch (e) {
            console.error(e);
        }
        return error;
    }
};
HttpExceptionFilter = __decorate([
    common.Catch(common.HttpException, MissingArgumentsError, GqlError, DefaultErrorMixin),
    __metadata("design:paramtypes", [Object, Object])
], HttpExceptionFilter);
export { HttpExceptionFilter };
//# sourceMappingURL=http-exception.filter.js.map