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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppLoggerFactory = void 0;
const logger_console_service_js_1 = require("./logger-console.service.js");
const logger_pino_service_js_1 = require("./logger-pino.service.js");
const common_1 = require("@nestjs/common");
const logger_enum_js_1 = require("./logger.enum.js");
const logger_nest_service_js_1 = require("./logger-nest.service.js");
const _ = __importStar(require("lodash-es"));
const logger_helper_js_1 = require("./logger.helper.js");
exports.AppLoggerFactory = _.memoize((context, loggerLevels = logger_enum_js_1.LOG_LEVEL_DEFAULT, loggerType, options) => {
    var _a, _b;
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
            (_a = logger.setLogLevels) === null || _a === void 0 ? void 0 : _a.call(logger, loggerLevels);
            break;
    }
    common_1.Logger.overrideLogger((0, logger_helper_js_1.getEnvLoggerLevels)());
    (_b = common_1.Logger.debug) === null || _b === void 0 ? void 0 : _b.call(common_1.Logger, `Use Logger: ${loggerType !== null && loggerType !== void 0 ? loggerType : `not specified, fallback to default (${logger_enum_js_1.LoggerTypeEnum.NEST})`}`);
    return logger;
}, (context, loggerLevels, loggerType, options) => `${context}-${loggerLevels === null || loggerLevels === void 0 ? void 0 : loggerLevels.join('-')}-${loggerType}-${options}`);
//# sourceMappingURL=logger.factory.js.map