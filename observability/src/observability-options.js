"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeObservabilityOptions = normalizeObservabilityOptions;
exports.createObservabilityOptionsFromEnv = createObservabilityOptionsFromEnv;
function normalizeObservabilityOptions(options) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    return {
        enabled: (_a = options.enabled) !== null && _a !== void 0 ? _a : false,
        serviceName: options.serviceName,
        otlpEndpoint: trimTrailingSlash((_b = options.otlpEndpoint) !== null && _b !== void 0 ? _b : 'http://127.0.0.1:4318'),
        eventManager: {
            enabled: (_d = (_c = options.eventManager) === null || _c === void 0 ? void 0 : _c.enabled) !== null && _d !== void 0 ? _d : true,
            listenTo: (_f = (_e = options.eventManager) === null || _e === void 0 ? void 0 : _e.listenTo) !== null && _f !== void 0 ? _f : ['**'],
            ignore: (_h = (_g = options.eventManager) === null || _g === void 0 ? void 0 : _g.ignore) !== null && _h !== void 0 ? _h : ['observability.**'],
        },
        payload: {
            include: (_k = (_j = options.payload) === null || _j === void 0 ? void 0 : _j.include) !== null && _k !== void 0 ? _k : false,
            maxSize: (_m = (_l = options.payload) === null || _l === void 0 ? void 0 : _l.maxSize) !== null && _m !== void 0 ? _m : 4096,
            mask: (_p = (_o = options.payload) === null || _o === void 0 ? void 0 : _o.mask) !== null && _p !== void 0 ? _p : [
                'authorization',
                'password',
                'secret',
                'token',
            ],
        },
        failureMode: (_q = options.failureMode) !== null && _q !== void 0 ? _q : 'ignore',
        metricExportIntervalMillis: (_r = options.metricExportIntervalMillis) !== null && _r !== void 0 ? _r : 500,
    };
}
function createObservabilityOptionsFromEnv(serviceName) {
    var _a, _b;
    return {
        enabled: process.env.YALC_OBSERVABILITY_ENABLED === 'true',
        serviceName: ((_a = process.env.YALC_OTEL_SERVICE_NAME) === null || _a === void 0 ? void 0 : _a.trim()) || serviceName,
        otlpEndpoint: (_b = process.env.YALC_OTEL_ENDPOINT) === null || _b === void 0 ? void 0 : _b.trim(),
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
    const items = value === null || value === void 0 ? void 0 : value.split(',').map((item) => item.trim()).filter(Boolean);
    return items && items.length > 0 ? items : undefined;
}
//# sourceMappingURL=observability-options.js.map