"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerAbstractService = exports.EVENT_LOG_DEFAULT = void 0;
exports.beforeLogging = beforeLogging;
const logger_enum_js_1 = require("./logger.enum.js");
const plugin_helper_js_1 = require("@nestjs-yalc/utils/plugin.helper.js");
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
        var _a;
        const enabledLevels = {};
        (_a = this.logLevels) === null || _a === void 0 ? void 0 : _a.forEach((level) => {
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
        var _a;
        this.options.event = (_a = this.options.event) !== null && _a !== void 0 ? _a : {};
        this.invokePlugins('onBeforeLogging', message, options, this.options.clsService);
        return beforeLogging(message, options);
    }
}
exports.LoggerAbstractService = LoggerAbstractService;
function beforeLogging(message, options = {}) {
    var _a, _b;
    const emitter = options && options.eventEmitter;
    if (!emitter)
        return;
    const useFallbackEvent = (_a = (options && options.useFallbackEvent)) !== null && _a !== void 0 ? _a : false;
    const defaultEventName = useFallbackEvent ? exports.EVENT_LOG_DEFAULT : false;
    const eventName = (_b = options.event) !== null && _b !== void 0 ? _b : defaultEventName;
    if (!eventName)
        return;
    const { event } = require('@nestjs-yalc/event-manager/event.js');
    event(eventName, {
        event: { emitter },
        data: options === null || options === void 0 ? void 0 : options.data,
        config: options === null || options === void 0 ? void 0 : options.config,
        masks: options === null || options === void 0 ? void 0 : options.masks,
        message,
        logger: false,
        stack: options === null || options === void 0 ? void 0 : options.stack,
    });
}
//# sourceMappingURL=logger-abstract.service.js.map