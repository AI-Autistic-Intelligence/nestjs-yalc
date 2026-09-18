"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpStatusCodeToErrors = void 0;
const error_class_js_1 = require("./error.class.js");
const common_1 = require("@nestjs/common");
exports.httpStatusCodeToErrors = {
    [common_1.HttpStatus.BAD_REQUEST]: error_class_js_1.BadRequestError,
    [common_1.HttpStatus.UNAUTHORIZED]: error_class_js_1.UnauthorizedError,
    [common_1.HttpStatus.FORBIDDEN]: error_class_js_1.ForbiddenError,
    [common_1.HttpStatus.NOT_FOUND]: error_class_js_1.NotFoundError,
    [common_1.HttpStatus.CONFLICT]: error_class_js_1.ConflictError,
    [common_1.HttpStatus.INTERNAL_SERVER_ERROR]: error_class_js_1.InternalServerError,
    [common_1.HttpStatus.PAYMENT_REQUIRED]: error_class_js_1.PaymentRequiredError,
    [common_1.HttpStatus.METHOD_NOT_ALLOWED]: error_class_js_1.MethodNotAllowedError,
    [common_1.HttpStatus.GONE]: error_class_js_1.GoneError,
    [common_1.HttpStatus.UNSUPPORTED_MEDIA_TYPE]: error_class_js_1.UnsupportedMediaTypeError,
    [common_1.HttpStatus.UNPROCESSABLE_ENTITY]: error_class_js_1.UnprocessableEntityError,
    [common_1.HttpStatus.TOO_MANY_REQUESTS]: error_class_js_1.TooManyRequestsError,
    [common_1.HttpStatus.NOT_IMPLEMENTED]: error_class_js_1.NotImplementedError,
    [common_1.HttpStatus.BAD_GATEWAY]: error_class_js_1.BadGatewayError,
    [common_1.HttpStatus.SERVICE_UNAVAILABLE]: error_class_js_1.ServiceUnavailableError,
    [common_1.HttpStatus.GATEWAY_TIMEOUT]: error_class_js_1.GatewayTimeoutError,
};
//# sourceMappingURL=http-status-code-to-errors.js.map