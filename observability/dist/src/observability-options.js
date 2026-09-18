"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeObservabilityOptions = normalizeObservabilityOptions;
exports.createObservabilityOptionsFromEnv = createObservabilityOptionsFromEnv;
function normalizeObservabilityOptions(options) {
    return {
        enabled: options.enabled ?? false,
        serviceName: options.serviceName,
        otlpEndpoint: trimTrailingSlash(options.otlpEndpoint ?? 'http://127.0.0.1:4318'),
        eventManager: {
            enabled: options.eventManager?.enabled ?? true,
            listenTo: options.eventManager?.listenTo ?? ['**'],
            ignore: options.eventManager?.ignore ?? ['observability.**'],
        },
        payload: {
            include: options.payload?.include ?? false,
            maxSize: options.payload?.maxSize ?? 4096,
            mask: options.payload?.mask ?? [
                'authorization',
                'password',
                'secret',
                'token',
            ],
        },
        failureMode: options.failureMode ?? 'ignore',
        metricExportIntervalMillis: options.metricExportIntervalMillis ?? 500,
    };
}
function createObservabilityOptionsFromEnv(serviceName) {
    return {
        enabled: process.env.YALC_OBSERVABILITY_ENABLED === 'true',
        serviceName: process.env.YALC_OTEL_SERVICE_NAME?.trim() || serviceName,
        otlpEndpoint: process.env.YALC_OTEL_ENDPOINT?.trim(),
        eventManager: {
            enabled: process.env.YALC_OBSERVABILITY_EVENT_MANAGER_ENABLED !== 'false',
            listenTo: splitCsv(process.env.YALC_OBSERVABILITY_EVENT_LISTEN_TO),
            ignore: splitCsv(process.env.YALC_OBSERVABILITY_EVENT_IGNORE),
        },
        payload: {
            include: process.env.YALC_OBSERVABILITY_INCLUDE_EVENT_PAYLOAD === 'true',
            mask: splitCsv(process.env.YALC_OBSERVABILITY_PAYLOAD_MASK),
        },
        failureMode: process.env.YALC_OBSERVABILITY_FAILURE_MODE === 'throw'
            ? 'throw'
            : 'ignore',
    };
}
function trimTrailingSlash(value) {
    return value.replace(/\/+$/, '');
}
function splitCsv(value) {
    const items = value
        ?.split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    return items && items.length > 0 ? items : undefined;
}
//# sourceMappingURL=observability-options.js.map