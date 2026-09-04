"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelemetryService = void 0;
exports.toTelemetryAttributes = toTelemetryAttributes;
const common_1 = require("@nestjs/common");
const api_1 = require("@opentelemetry/api");
const api_logs_1 = require("@opentelemetry/api-logs");
const tokens_js_1 = require("./tokens.js");
let TelemetryService = class TelemetryService {
    constructor(options) {
        this.options = options;
        this.tracer = api_1.trace.getTracer('@nestjs-yalc/observability');
        this.meter = api_1.metrics.getMeter('@nestjs-yalc/observability');
        this.logger = api_logs_1.logs.getLogger('@nestjs-yalc/observability');
        this.eventCounter = this.meter.createCounter('yalc_events_total');
        this.errorCounter = this.meter.createCounter('yalc_event_errors_total');
        this.durationHistogram = this.meter.createHistogram('yalc_operation_duration_ms');
    }
    get enabled() {
        return this.options.enabled;
    }
    measure(name, operation, attributes = {}) {
        if (!this.enabled) {
            return operation();
        }
        const normalizedAttributes = toTelemetryAttributes(attributes);
        const startedAt = Date.now();
        try {
            return this.tracer.startActiveSpan(name, { attributes: normalizedAttributes }, (span) => this.measureWithSpan(name, operation, normalizedAttributes, startedAt, span));
        }
        catch (error) {
            if (this.options.failureMode === 'throw') {
                throw error;
            }
            return operation();
        }
    }
    recordYalcEvent(eventName, payload) {
        if (!this.enabled) {
            return;
        }
        this.execute(() => {
            var _a, _b;
            const attributes = this.buildEventAttributes(eventName, payload);
            const activeSpan = api_1.trace.getActiveSpan();
            activeSpan === null || activeSpan === void 0 ? void 0 : activeSpan.addEvent(eventName, attributes);
            if (payload === null || payload === void 0 ? void 0 : payload.errorInfo) {
                activeSpan === null || activeSpan === void 0 ? void 0 : activeSpan.recordException(payload.errorInfo);
                activeSpan === null || activeSpan === void 0 ? void 0 : activeSpan.setStatus({
                    code: api_1.SpanStatusCode.ERROR,
                    message: getErrorMessage(payload.errorInfo),
                });
                this.errorCounter.add(1, attributes);
            }
            this.eventCounter.add(1, attributes);
            this.emitLogRecord(eventName, attributes, (_a = payload === null || payload === void 0 ? void 0 : payload.level) !== null && _a !== void 0 ? _a : 'info', {
                body: (_b = payload === null || payload === void 0 ? void 0 : payload.message) !== null && _b !== void 0 ? _b : eventName,
                exception: payload === null || payload === void 0 ? void 0 : payload.errorInfo,
            });
        });
    }
    recordDuration(name, durationMs, attributes = {}) {
        if (!this.enabled) {
            return;
        }
        this.execute(() => {
            this.durationHistogram.record(durationMs, Object.assign({ 'yalc.operation.name': name }, toTelemetryAttributes(attributes)));
            this.emitLogRecord(name, Object.assign({ 'yalc.telemetry.kind': 'duration', 'yalc.operation.name': name, 'yalc.operation.duration_ms': durationMs }, toTelemetryAttributes(attributes)), 'info');
        });
    }
    measureWithSpan(name, operation, attributes, startedAt, span) {
        try {
            const result = operation();
            if (isPromiseLike(result)) {
                return result.then((value) => {
                    this.finishSpan(name, startedAt, attributes, span);
                    return value;
                }, (error) => {
                    this.failSpan(name, startedAt, attributes, span, error);
                    throw error;
                });
            }
            this.finishSpan(name, startedAt, attributes, span);
            return result;
        }
        catch (error) {
            this.failSpan(name, startedAt, attributes, span, error);
            throw error;
        }
    }
    finishSpan(name, startedAt, attributes, span) {
        this.recordDuration(name, Date.now() - startedAt, attributes);
        span.setStatus({ code: api_1.SpanStatusCode.OK });
        span.end();
    }
    failSpan(name, startedAt, attributes, span, error) {
        this.recordDuration(name, Date.now() - startedAt, Object.assign(Object.assign({}, attributes), { 'yalc.operation.error': true }));
        span.recordException(normalizeError(error));
        span.setStatus({
            code: api_1.SpanStatusCode.ERROR,
            message: error instanceof Error ? error.message : String(error),
        });
        span.end();
    }
    buildEventAttributes(eventName, payload) {
        const attributes = {
            'yalc.event.name': eventName,
            'yalc.event.payload_name': payload === null || payload === void 0 ? void 0 : payload.eventName,
            'yalc.event.level': payload === null || payload === void 0 ? void 0 : payload.level,
            'yalc.event.has_error': Boolean(payload === null || payload === void 0 ? void 0 : payload.errorInfo),
        };
        if (payload === null || payload === void 0 ? void 0 : payload.errorInfo) {
            attributes['yalc.error.name'] = payload.errorInfo.errorName;
            attributes['yalc.error.message'] = getErrorMessage(payload.errorInfo);
            attributes['yalc.error.code'] = payload.errorInfo.errorCode;
        }
        if (this.options.payload.include && (payload === null || payload === void 0 ? void 0 : payload.data)) {
            attributes['yalc.event.payload'] = safeJsonStringify(maskObject(payload.data, this.options.payload.mask), this.options.payload.maxSize);
        }
        return toTelemetryAttributes(attributes);
    }
    emitLogRecord(name, attributes, severityText, options = {}) {
        var _a;
        this.logger.emit({
            eventName: name,
            severityText,
            severityNumber: toSeverityNumber(severityText),
            body: (_a = options.body) !== null && _a !== void 0 ? _a : name,
            attributes,
            context: api_1.context.active(),
            exception: options.exception,
        });
    }
    execute(operation) {
        try {
            return operation();
        }
        catch (error) {
            if (this.options.failureMode === 'throw') {
                throw error;
            }
            return undefined;
        }
    }
};
exports.TelemetryService = TelemetryService;
exports.TelemetryService = TelemetryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(tokens_js_1.OBSERVABILITY_OPTIONS)),
    __metadata("design:paramtypes", [Object])
], TelemetryService);
function toTelemetryAttributes(attributes = {}) {
    return Object.fromEntries(Object.entries(attributes)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => [key, toTelemetryAttributeValue(value)]));
}
function toTelemetryAttributeValue(value) {
    if (typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean') {
        return value;
    }
    if (Array.isArray(value)) {
        return safeJsonStringify(value, 4096);
    }
    return safeJsonStringify(value, 4096);
}
function safeJsonStringify(value, maxSize) {
    let output;
    try {
        output = JSON.stringify(value);
    }
    catch (_a) {
        output = String(value);
    }
    return output.length > maxSize ? output.slice(0, maxSize) : output;
}
function maskObject(value, mask) {
    if (!value || typeof value !== 'object') {
        return value;
    }
    if (Array.isArray(value)) {
        return value.map((item) => maskObject(item, mask));
    }
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [
        key,
        mask.some((maskKey) => key.toLowerCase().includes(maskKey.toLowerCase()))
            ? '[masked]'
            : maskObject(item, mask),
    ]));
}
function normalizeError(error) {
    if (error instanceof Error) {
        return error;
    }
    return new Error(String(error));
}
function isPromiseLike(value) {
    return (typeof value === 'object' &&
        value !== null &&
        'then' in value &&
        typeof value.then === 'function');
}
function toSeverityNumber(level) {
    if (level === 'error')
        return api_logs_1.SeverityNumber.ERROR;
    if (level === 'warn')
        return api_logs_1.SeverityNumber.WARN;
    if (level === 'debug')
        return api_logs_1.SeverityNumber.DEBUG;
    if (level === 'verbose')
        return api_logs_1.SeverityNumber.TRACE;
    return api_logs_1.SeverityNumber.INFO;
}
function getErrorMessage(errorInfo) {
    var _a;
    return (_a = errorInfo.message) !== null && _a !== void 0 ? _a : errorInfo.internalMessage;
}
//# sourceMappingURL=telemetry.service.js.map