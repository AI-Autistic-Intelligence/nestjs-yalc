"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const tslib_1 = require("tslib");
const common = tslib_1.__importStar(require("@nestjs/common"));
const errors_1 = require("@nest-yalc-2/errors");
const entity_error_js_1 = require("@nest-yalc-2/crud-gen/entity.error.js");
const gql_error_js_1 = require("@nest-yalc-2/graphql/plugins/gql.error.js");
const core_1 = require("@nestjs/core");
const event_helper_js_1 = require("../../../event-manager/src/event.helper.js");
const logger_enum_1 = require("@node-yalc/logger/logger.enum");
let HttpExceptionFilter = class HttpExceptionFilter extends core_1.BaseExceptionFilter {
    constructor(logger, applicationRef) {
        super(applicationRef);
        this.logger = logger;
    }
    catch(error, host, { sendResponse } = { sendResponse: true }) {
        try {
            const isHttpError = this.isHttpError(error) || error instanceof common.HttpException;
            switch (true) {
                case error instanceof errors_1.MissingArgumentsError:
                    this.logger.log(error.message, {
                        stack: error.stack,
                    });
                    break;
                case (0, errors_1.isDefaultErrorMixin)(error):
                    break;
                case (0, entity_error_js_1.isEntityError)(error):
                    {
                        const entityError = error;
                        this.logger.error(entityError.originalError?.message
                            ? entityError.originalError.message
                            : error, entityError.originalError?.stack, {
                            stack: entityError.originalError?.stack,
                            data: {
                                response: entityError.getResponse(),
                                name: entityError.name,
                                cause: (0, errors_1.formatCause)(entityError.cause),
                            },
                        });
                    }
                    break;
                case isHttpError:
                    {
                        const httpError = error;
                        const logLevel = (0, event_helper_js_1.getLogLevelByStatus)(httpError.getStatus());
                        if (logLevel === logger_enum_1.LogLevelEnum.ERROR) {
                            this.logger[logLevel](error.message, error.stack, {
                                stack: httpError.stack,
                                data: {
                                    response: httpError.getResponse(),
                                    name: error.name,
                                    cause: (0, errors_1.formatCause)(error.cause),
                                },
                            });
                        }
                        else {
                            this.logger[logLevel](error.message, {
                                stack: error.stack,
                                data: {
                                    response: httpError.getResponse(),
                                    name: error.name,
                                    cause: (0, errors_1.formatCause)(error.cause),
                                },
                            });
                        }
                    }
                    break;
                case error instanceof gql_error_js_1.GqlError:
                    this.logger.error(error.systemMessage ?? error.message);
                    break;
                default:
                    this.logger.error(error.message, error.stack, {
                        stack: error.stack,
                        data: {
                            cause: (0, errors_1.formatCause)(error.cause),
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
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = tslib_1.__decorate([
    common.Catch(common.HttpException, errors_1.MissingArgumentsError, gql_error_js_1.GqlError, errors_1.DefaultErrorMixin),
    tslib_1.__metadata("design:paramtypes", [Object, Object])
], HttpExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map