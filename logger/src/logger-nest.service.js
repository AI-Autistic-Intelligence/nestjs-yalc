"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImprovedNestLogger = void 0;
const common_1 = require("@nestjs/common");
const logger_abstract_service_js_1 = require("./logger-abstract.service.js");
const logger_helper_js_1 = require("./logger.helper.js");
const plugin_helper_js_1 = require("@nest-yalc-2/utils/plugin.helper.js");
class ImprovedNestLogger extends (0, plugin_helper_js_1.WithPluginSystem)(common_1.ConsoleLogger) {
    constructor(context, options, _options = {}) {
        super(context, options);
        this._options = _options;
        this.isImprovedLoggerService = true;
    }
    getOptions(options) {
        return typeof options === 'string' ? { message: options } : options;
    }
    composeMessage(message, options) {
        const data = {
            ...(0, logger_helper_js_1.maskDataInObject)(options.data, options.masks, options.stack),
            config: options.config,
        };
        return ((typeof message === 'string'
            ? message
            : JSON.stringify(message, null, 2)) +
            (data ? `\n${JSON.stringify(data, null, 2)}` : ''));
    }
    log(message, options = {}, ...rest) {
        const _options = this.getOptions(options);
        this.beforeLogging(message, _options);
        super.log(this.composeMessage(message, _options), _options.context ?? this.context, ...rest);
    }
    error(message, stack, options = {}, ...rest) {
        const _options = this.getOptions(options);
        this.beforeLogging(message, _options);
        super.error(this.composeMessage(message, _options), stack, _options.context ?? this.context, ...rest);
    }
    debug(message, options = {}, ...rest) {
        const _options = this.getOptions(options);
        this.beforeLogging(message, _options);
        super.debug(this.composeMessage(message, _options), _options.context ?? this.context, ...rest);
    }
    verbose(message, options = {}, ...rest) {
        const _options = this.getOptions(options);
        this.beforeLogging(message, _options);
        super.verbose(this.composeMessage(message, _options), _options.context ?? this.context, ...rest);
    }
    warn(message, options = {}, ...rest) {
        const _options = this.getOptions(options);
        this.beforeLogging(message, _options);
        super.warn(this.composeMessage(message, _options), _options.context ?? this.context, ...rest);
    }
    beforeLogging(message, options) {
        this.options.event = this.options.event ?? {};
        this.invokePlugins('onBeforeLogging', message, options, this._options.clsService);
        void (0, logger_abstract_service_js_1.beforeLogging)(message, options);
    }
}
exports.ImprovedNestLogger = ImprovedNestLogger;
//# sourceMappingURL=logger-nest.service.js.map