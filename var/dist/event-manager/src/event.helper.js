import { LogLevelEnum } from '@nestjs-yalc/logger/logger.enum.js';
import { isClass } from '@nestjs-yalc/utils/class.helper.js';
import { HttpStatus } from '@nestjs/common';
import { getStatusCodeFromError } from '@nestjs-yalc/errors/error.helper.js';
export function getLogLevelByStatus(statusCode) {
    let loggerLevel;
    switch (true) {
        case statusCode >= HttpStatus.INTERNAL_SERVER_ERROR:
            loggerLevel = LogLevelEnum.ERROR;
            break;
        case statusCode === HttpStatus.TOO_MANY_REQUESTS:
            loggerLevel = LogLevelEnum.WARN;
            break;
        case statusCode >= HttpStatus.BAD_REQUEST:
        default:
            loggerLevel = LogLevelEnum.LOG;
            break;
    }
    return loggerLevel;
}
export function getLogLevelByError(error) {
    const statusCode = getStatusCodeFromError(error);
    if (statusCode) {
        return getLogLevelByStatus(statusCode);
    }
    let _error;
    if (isClass(error)) {
        _error = new error();
    }
    else {
        _error = error;
    }
    const httpException = _error;
    if (httpException.getStatus)
        return getLogLevelByStatus(httpException.getStatus());
    return _error.stack ? LogLevelEnum.ERROR : LogLevelEnum.LOG;
}
export function isErrorEvent(options) {
    if (typeof options.logger === 'object' &&
        options.logger.level === LogLevelEnum.ERROR) {
        return true;
    }
    if (!options.errorClass) {
        return false;
    }
    if (options.errorClass === true) {
        return true;
    }
    const logLevel = getLogLevelByError(options.errorClass);
    return logLevel === LogLevelEnum.ERROR;
}
//# sourceMappingURL=event.helper.js.map