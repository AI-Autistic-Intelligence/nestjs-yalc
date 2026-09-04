export function getEnvLoggerLevels() {
    return ['log', 'error', 'warn', 'debug', 'verbose'];
}
import fastRedact from 'fast-redact';
import { isEmpty } from 'lodash-es';
export function maskDataInObject(data, masks, trace) {
    if (typeof data === 'string')
        data = { message: data };
    if (!masks || !data || isEmpty(masks) || isEmpty(data)) {
        if (trace)
            data ? (data.trace = trace) : (data = { trace });
        return data;
    }
    const redact = fastRedact({
        paths: masks,
    });
    return { ...JSON.parse(redact(data)), trace };
}
//# sourceMappingURL=logger.helper.js.map