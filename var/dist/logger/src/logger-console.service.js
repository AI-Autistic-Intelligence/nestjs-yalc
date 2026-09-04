import { LoggerAbstractService } from './logger-abstract.service';
export class ConsoleLogger extends LoggerAbstractService {
    constructor(context, logLevels) {
        super(context, logLevels, {
            log: (message) => console.log(`[${context}]`, message),
            error: (message, trace) => console.error(`[${context}]`, message, trace),
            debug: (message) => console.debug(`[${context}]`, message),
            warn: (message) => console.warn(`[${context}]`, message),
            verbose: (message) => console.info(`[${context}]`, message),
        });
    }
}
//# sourceMappingURL=logger-console.service.js.map