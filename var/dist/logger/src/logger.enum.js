export var LogLevelEnum;
(function (LogLevelEnum) {
    LogLevelEnum["LOG"] = "log";
    LogLevelEnum["ERROR"] = "error";
    LogLevelEnum["WARN"] = "warn";
    LogLevelEnum["DEBUG"] = "debug";
    LogLevelEnum["VERBOSE"] = "verbose";
})(LogLevelEnum || (LogLevelEnum = {}));
export const LOG_LEVEL_DEFAULT = [
    LogLevelEnum.DEBUG,
    LogLevelEnum.ERROR,
    LogLevelEnum.LOG,
    LogLevelEnum.WARN,
];
export const LOG_LEVEL_ALL = [
    LogLevelEnum.DEBUG,
    LogLevelEnum.ERROR,
    LogLevelEnum.LOG,
    LogLevelEnum.VERBOSE,
    LogLevelEnum.WARN,
];
export var LoggerTypeEnum;
(function (LoggerTypeEnum) {
    LoggerTypeEnum["CONSOLE"] = "console";
    LoggerTypeEnum["PINO"] = "pino";
    LoggerTypeEnum["NEST"] = "nest-logger";
})(LoggerTypeEnum || (LoggerTypeEnum = {}));
//# sourceMappingURL=logger.enum.js.map