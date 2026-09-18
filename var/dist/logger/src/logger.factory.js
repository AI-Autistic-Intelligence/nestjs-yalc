"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppLoggerFactory = void 0;
const tslib_1 = require("tslib");
const logger_console_service_js_1 = require("./logger-console.service.js");
const logger_pino_service_js_1 = require("./logger-pino.service.js");
const common_1 = require("@nestjs/common");
const logger_enum_js_1 = require("./logger.enum.js");
const logger_nest_service_js_1 = require("./logger-nest.service.js");
const _ = tslib_1.__importStar(require("lodash-es"));
const logger_helper_js_1 = require("./logger.helper.js");
exports.AppLoggerFactory = _.memoize((context, loggerLevels = logger_enum_js_1.LOG_LEVEL_DEFAULT, loggerType, options) => {
    let logger;
    switch (loggerType) {
        case logger_enum_js_1.LoggerTypeEnum.CONSOLE:
            logger = new logger_console_service_js_1.ConsoleLogger(context, loggerLevels, options);
            break;
        case logger_enum_js_1.LoggerTypeEnum.PINO:
            logger = new logger_pino_service_js_1.PinoLogger(context, loggerLevels, options);
            break;
        case logger_enum_js_1.LoggerTypeEnum.NEST:
        default:
            logger = new logger_nest_service_js_1.ImprovedNestLogger(context, {
                timestamp: true,
            }, options);
            logger.setLogLevels?.(loggerLevels);
            break;
    }
    common_1.Logger.overrideLogger((0, logger_helper_js_1.getEnvLoggerLevels)());
    common_1.Logger.debug?.(`Use Logger: ${loggerType ??
        `not specified, fallback to default (${logger_enum_js_1.LoggerTypeEnum.NEST})`}`);
    return logger;
}, (context, loggerLevels, loggerType, options) => `${context}-${loggerLevels?.join('-')}-${loggerType}-${options}`);
//# sourceMappingURL=logger.factory.js.map