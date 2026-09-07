"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const common = __importStar(require("@nestjs/common"));
const errors_1 = require("@nest-yalc-2/errors");
const entity_error_js_1 = require("@nest-yalc-2/crud-gen/entity.error.js");
const gql_error_js_1 = require("@nest-yalc-2/graphql/plugins/gql.error.js");
const core_1 = require("@nestjs/core");
const event_helper_js_1 = require("../../../event-manager/src/event.helper.js");
const logger_enum_js_1 = require("@nest-yalc-2/logger/logger.enum.js");
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
                        if (logLevel === logger_enum_js_1.LogLevelEnum.ERROR) {
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
exports.HttpExceptionFilter = HttpExceptionFilter = __decorate([
    common.Catch(common.HttpException, errors_1.MissingArgumentsError, gql_error_js_1.GqlError, errors_1.DefaultErrorMixin),
    __metadata("design:paramtypes", [Object, Object])
], HttpExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map