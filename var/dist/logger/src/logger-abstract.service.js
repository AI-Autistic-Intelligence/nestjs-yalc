"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerAbstractService = exports.EVENT_LOG_DEFAULT = void 0;
exports.beforeLogging = beforeLogging;
const logger_enum_js_1 = require("./logger.enum.js");
const plugin_helper_js_1 = require("@nest-yalc-2/utils/plugin.helper.js");
exports.EVENT_LOG_DEFAULT = 'EVENT_LOG_DEFAULT';
class LoggerAbstractService extends (0, plugin_helper_js_1.WithPluginSystem)() {
    constructor(context, logLevels, methods, options = {}) {
        super();
        this.context = context;
        this.logLevels = logLevels;
        this.methods = methods;
        this.options = options;
        this.isImprovedLoggerService = true;
        this.initializeLogger();
    }
    setLogLevels(levels) {
        this.logLevels = levels;
        this.initializeLogger();
    }
    initializeLogger() {
        const enabledLevels = {};
        this.logLevels?.forEach((level) => {
            if (!(level.toUpperCase() in logger_enum_js_1.LogLevelEnum))
                throw new Error(`ERROR: Logger Level: ${level} is not supported!`);
            enabledLevels[level] = true;
        });
        this.log = (message, options = {}) => {
            void this.beforeLogging(message, options);
            (enabledLevels[logger_enum_js_1.LogLevelEnum.LOG] === true &&
                this.methods[logger_enum_js_1.LogLevelEnum.LOG]
                ? this.methods[logger_enum_js_1.LogLevelEnum.LOG]
                : () => { })(message, options);
        };
        this.error = (message, stack, options = {}) => {
            options.stack = stack;
            void this.beforeLogging(message, options);
            (enabledLevels[logger_enum_js_1.LogLevelEnum.ERROR] === true &&
                this.methods[logger_enum_js_1.LogLevelEnum.ERROR]
                ? this.methods[logger_enum_js_1.LogLevelEnum.ERROR]
                : () => { })(message, stack, options);
        };
        this.warn = (message, options = {}) => {
            void this.beforeLogging(message, options);
            (enabledLevels[logger_enum_js_1.LogLevelEnum.WARN] === true &&
                this.methods[logger_enum_js_1.LogLevelEnum.WARN]
                ? this.methods[logger_enum_js_1.LogLevelEnum.WARN]
                : () => { })(message, options);
        };
        if (enabledLevels[logger_enum_js_1.LogLevelEnum.DEBUG] === true &&
            this.methods[logger_enum_js_1.LogLevelEnum.DEBUG])
            this.debug = (message, options = {}) => {
                void this.beforeLogging(message, options);
                this.methods[logger_enum_js_1.LogLevelEnum.DEBUG](message, options);
            };
        if (enabledLevels[logger_enum_js_1.LogLevelEnum.VERBOSE] === true &&
            this.methods[logger_enum_js_1.LogLevelEnum.VERBOSE])
            this.verbose = (message, options = {}) => {
                void this.beforeLogging(message, options);
                this.methods[logger_enum_js_1.LogLevelEnum.VERBOSE](message, options);
            };
    }
    beforeLogging(message, options) {
        this.options.event = this.options.event ?? {};
        this.invokePlugins('onBeforeLogging', message, options, this.options.clsService);
        return beforeLogging(message, options);
    }
}
exports.LoggerAbstractService = LoggerAbstractService;
function beforeLogging(message, options = {}) {
    const emitter = options && options.eventEmitter;
    if (!emitter)
        return;
    const useFallbackEvent = (options && options.useFallbackEvent) ?? false;
    const defaultEventName = useFallbackEvent ? exports.EVENT_LOG_DEFAULT : false;
    const eventName = options.event ?? defaultEventName;
    if (!eventName)
        return;
    const { event } = require('@nest-yalc-2/event-manager/event.js');
    event(eventName, {
        event: { emitter },
        data: options?.data,
        config: options?.config,
        masks: options?.masks,
        message,
        logger: false,
        stack: options?.stack,
    });
}
//# sourceMappingURL=logger-abstract.service.js.map