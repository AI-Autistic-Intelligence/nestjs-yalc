"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExceptionContextEnum = exports.getHttpStatusNameByCode = exports.ErrorsEnum = void 0;
const common_1 = require("@nestjs/common");
var ErrorsEnum;
(function (ErrorsEnum) {
    ErrorsEnum["BAD_REQUEST"] = "Bad request";
    ErrorsEnum["INVALID_VALUE"] = "Invalid value";
    ErrorsEnum["UNAUTHORIZED"] = "Unauthorized";
    ErrorsEnum["BAD_LOGIN"] = "Bad login";
    ErrorsEnum["PAYMENT_REQUIRED"] = "Payment required";
    ErrorsEnum["FORBIDDEN"] = "Forbidden";
    ErrorsEnum["FORBIDDEN_RESOURCE"] = "Forbidden resource";
    ErrorsEnum["NOT_FOUND"] = "Not found";
    ErrorsEnum["METHOD_NOT_ALLOWED"] = "Method not allowed";
    ErrorsEnum["NOT_ACCEPTABLE"] = "Not acceptable";
    ErrorsEnum["CONFLICT"] = "Conflict";
    ErrorsEnum["GONE"] = "Gone";
    ErrorsEnum["UNSUPPORTED_MEDIA_TYPE"] = "Unsupported media type";
    ErrorsEnum["UNPROCESSABLE_ENTITY"] = "Unprocessable entity";
    ErrorsEnum["UNAVAILABLE_FOR_LEGAL_REASONS"] = "Unavailable for legal reasons";
    ErrorsEnum["TOO_MANY_REQUESTS"] = "Too many requests";
    ErrorsEnum["INTERNAL_SERVER_ERROR"] = "Internal server error";
    ErrorsEnum["NOT_IMPLEMENTED"] = "Not implemented";
    ErrorsEnum["BAD_GATEWAY"] = "Bad gateway";
    ErrorsEnum["SERVICE_UNAVAILABLE"] = "Service unavailable";
    ErrorsEnum["GATEWAY_TIMEOUT"] = "Gateway timeout";
})(ErrorsEnum || (exports.ErrorsEnum = ErrorsEnum = {}));
const getHttpStatusNameByCode = (code) => {
    var _a;
    const httpStatusEnumName = (_a = Object.entries(common_1.HttpStatus).find(([, value]) => value === code)) === null || _a === void 0 ? void 0 : _a[0];
    const enumValue = ErrorsEnum[httpStatusEnumName];
    return enumValue !== null && enumValue !== void 0 ? enumValue : 'Unknown';
};
exports.getHttpStatusNameByCode = getHttpStatusNameByCode;
var ExceptionContextEnum;
(function (ExceptionContextEnum) {
    ExceptionContextEnum["DATABASE"] = "DatabaseException";
    ExceptionContextEnum["HTTP"] = "HttpException";
    ExceptionContextEnum["SYSTEM"] = "SystemException";
})(ExceptionContextEnum || (exports.ExceptionContextEnum = ExceptionContextEnum = {}));
//# sourceMappingURL=error.enum.js.map