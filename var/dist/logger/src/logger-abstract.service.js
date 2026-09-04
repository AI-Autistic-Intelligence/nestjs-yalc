import { LogLevelEnum } from './logger.enum';
export class LoggerAbstractService {
    constructor(context, logLevels, methods) {
        this.context = context;
        this.logLevels = logLevels;
        this.methods = methods;
        const enabledLevels = {};
        this.logLevels?.forEach((level) => {
            if (!(level.toUpperCase() in LogLevelEnum))
                throw new Error(`ERROR: Logger Level: ${level} is not supported!`);
            enabledLevels[level] = true;
        });
        if (enabledLevels[LogLevelEnum.LOG] === true &&
            this.methods[LogLevelEnum.LOG])
            this.log = this.methods[LogLevelEnum.LOG];
        if (enabledLevels[LogLevelEnum.ERROR] === true &&
            this.methods[LogLevelEnum.ERROR])
            this.error = this.methods[LogLevelEnum.ERROR];
        if (enabledLevels[LogLevelEnum.WARN] === true &&
            this.methods[LogLevelEnum.WARN])
            this.warn = this.methods[LogLevelEnum.WARN];
        if (enabledLevels[LogLevelEnum.DEBUG] === true &&
            this.methods[LogLevelEnum.DEBUG])
            this.debug = this.methods[LogLevelEnum.DEBUG];
        if (enabledLevels[LogLevelEnum.VERBOSE] === true &&
            this.methods[LogLevelEnum.VERBOSE])
            this.verbose = this.methods[LogLevelEnum.VERBOSE];
    }
}
//# sourceMappingURL=logger-abstract.service.js.map