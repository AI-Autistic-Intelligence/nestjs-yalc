"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerDefContext = exports.LoggerTypeEnum = exports.LOG_LEVEL_ALL = exports.LOG_LEVEL_DEFAULT = exports.LogLevelEnum = void 0;
var LogLevelEnum;
(function (LogLevelEnum) {
    LogLevelEnum["LOG"] = "log";
    LogLevelEnum["ERROR"] = "error";
    LogLevelEnum["WARN"] = "warn";
    LogLevelEnum["DEBUG"] = "debug";
    LogLevelEnum["VERBOSE"] = "verbose";
})(LogLevelEnum || (exports.LogLevelEnum = LogLevelEnum = {}));
exports.LOG_LEVEL_DEFAULT = [
    LogLevelEnum.DEBUG,
    LogLevelEnum.ERROR,
    LogLevelEnum.LOG,
    LogLevelEnum.WARN,
];
exports.LOG_LEVEL_ALL = [
    LogLevelEnum.DEBUG,
    LogLevelEnum.ERROR,
    LogLevelEnum.LOG,
    LogLevelEnum.VERBOSE,
    LogLevelEnum.WARN,
];
var LoggerTypeEnum;
(function (LoggerTypeEnum) {
    LoggerTypeEnum["CONSOLE"] = "console";
    LoggerTypeEnum["PINO"] = "pino";
    LoggerTypeEnum["NEST"] = "nest-logger";
})(LoggerTypeEnum || (exports.LoggerTypeEnum = LoggerTypeEnum = {}));
var LoggerDefContext;
(function (LoggerDefContext) {
    LoggerDefContext["NEST_SYSTEM"] = "system";
})(LoggerDefContext || (exports.LoggerDefContext = LoggerDefContext = {}));
//# sourceMappingURL=logger.enum.js.map