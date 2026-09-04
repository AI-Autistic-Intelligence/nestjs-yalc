import { default as pino, stdTimeFunctions } from 'pino';
import { LoggerAbstractService } from './logger-abstract.service';
const dest = pino.destination({ sync: false });
export const logger = pino({
    formatters: {
        level: (label) => {
            return { level: label };
        },
    },
    timestamp: stdTimeFunctions.isoTime,
}, dest);
export const FLUSH_INTERVAL = 10000;
export class PinoLogger extends LoggerAbstractService {
    constructor(context, logLevels) {
        super(context, logLevels, {
            log: (message) => logger.info({}, `[${context}] ${message}`),
            error: (message, trace) => logger.error({}, `[${context}] ${message} ${trace}`),
            debug: (message) => logger.debug({}, `[${context}] ${message}`),
            warn: (message) => logger.warn({}, `[${context}] ${message}`),
            verbose: (message) => logger.trace({}, `[${context}] ${message}`),
        });
        logger.level = 'trace';
        setInterval(function () {
            logger.flush();
        }, FLUSH_INTERVAL).unref();
        const handler = (err, evt) => {
            logger.info(`${evt} caught`);
            if (err)
                logger.error(err, 'error caused exit');
            logger.flush();
            process.exit(err ? 1 : 0);
        };
        process.on('beforeExit', () => handler(null, 'beforeExit'));
        process.on('exit', () => handler(null, 'exit'));
        process.on('uncaughtException', (err) => handler(err, 'uncaughtException'));
        process.on('SIGINT', () => handler(null, 'SIGINT'));
        process.on('SIGQUIT', () => handler(null, 'SIGQUIT'));
        process.on('SIGTERM', () => handler(null, 'SIGTERM'));
    }
}
//# sourceMappingURL=logger-pino.service.js.map