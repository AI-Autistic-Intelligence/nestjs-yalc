export declare enum LogLevelEnum {
    LOG = "log",
    ERROR = "error",
    WARN = "warn",
    DEBUG = "debug",
    VERBOSE = "verbose"
}
export declare const LOG_LEVEL_DEFAULT: LogLevelEnum[];
export declare const LOG_LEVEL_ALL: LogLevelEnum[];
export declare enum LoggerTypeEnum {
    CONSOLE = "console",
    PINO = "pino",
    NEST = "nest-logger"
}
