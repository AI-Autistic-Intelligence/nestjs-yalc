"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogLevelByStatus = getLogLevelByStatus;
exports.getLogLevelByError = getLogLevelByError;
exports.isErrorEvent = isErrorEvent;
const logger_enum_js_1 = require("@nest-yalc-2/logger/logger.enum.js");
const class_helper_js_1 = require("@nest-yalc-2/utils/class.helper.js");
const common_1 = require("@nestjs/common");
const error_helper_js_1 = require("@nest-yalc-2/errors/error.helper.js");
function getLogLevelByStatus(statusCode) {
    let loggerLevel;
    switch (true) {
        case statusCode >= common_1.HttpStatus.INTERNAL_SERVER_ERROR:
            loggerLevel = logger_enum_js_1.LogLevelEnum.ERROR;
            break;
        case statusCode === common_1.HttpStatus.TOO_MANY_REQUESTS:
            loggerLevel = logger_enum_js_1.LogLevelEnum.WARN;
            break;
        case statusCode >= common_1.HttpStatus.BAD_REQUEST:
        default:
            loggerLevel = logger_enum_js_1.LogLevelEnum.LOG;
            break;
    }
    return loggerLevel;
}
function getLogLevelByError(error) {
    const statusCode = (0, error_helper_js_1.getStatusCodeFromError)(error);
    if (statusCode) {
        return getLogLevelByStatus(statusCode);
    }
    let _error;
    if ((0, class_helper_js_1.isClass)(error)) {
        _error = new error();
    }
    else {
        _error = error;
    }
    const httpException = _error;
    if (httpException.getStatus)
        return getLogLevelByStatus(httpException.getStatus());
    return _error.stack ? logger_enum_js_1.LogLevelEnum.ERROR : logger_enum_js_1.LogLevelEnum.LOG;
}
function isErrorEvent(options) {
    if (typeof options.logger === 'object' &&
        options.logger.level === logger_enum_js_1.LogLevelEnum.ERROR) {
        return true;
    }
    if (!options.errorClass) {
        return false;
    }
    if (options.errorClass === true) {
        return true;
    }
    const logLevel = getLogLevelByError(options.errorClass);
    return logLevel === logger_enum_js_1.LogLevelEnum.ERROR;
}
//# sourceMappingURL=event.helper.js.map