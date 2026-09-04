import { __decorate, __metadata } from "tslib";
import * as common from '@nestjs/common';
import { DefaultErrorMixin, MissingArgumentsError, isDefaultErrorMixin, formatCause, } from '@nestjs-yalc/errors';
import { isEntityError, } from '@nestjs-yalc/crud-gen/entity.error.js';
import { GqlError } from '@nestjs-yalc/graphql/plugins/gql.error.js';
import { BaseExceptionFilter } from '@nestjs/core';
import { getLogLevelByStatus } from '../../../event-manager/src/event.helper.js';
import { LogLevelEnum } from '@nestjs-yalc/logger/logger.enum.js';
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
                        stack: error.stack,
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
                            stack: entityError.originalError?.stack,
                            data: {
                                response: entityError.getResponse(),
                                name: entityError.name,
                                cause: formatCause(entityError.cause),
                            },
                        });
                    }
                    break;
                case isHttpError:
                    {
                        const httpError = error;
                        const logLevel = getLogLevelByStatus(httpError.getStatus());
                        if (logLevel === LogLevelEnum.ERROR) {
                            this.logger[logLevel](error.message, error.stack, {
                                stack: httpError.stack,
                                data: {
                                    response: httpError.getResponse(),
                                    name: error.name,
                                    cause: formatCause(error.cause),
                                },
                            });
                        }
                        else {
                            this.logger[logLevel](error.message, {
                                stack: error.stack,
                                data: {
                                    response: httpError.getResponse(),
                                    name: error.name,
                                    cause: formatCause(error.cause),
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
                        stack: error.stack,
                        data: {
                            cause: formatCause(error.cause),
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