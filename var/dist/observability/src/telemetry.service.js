import { __decorate, __metadata, __param } from "tslib";
import { Inject, Injectable } from '@nestjs/common';
import { SpanStatusCode, context, metrics, trace, } from '@opentelemetry/api';
import { logs, SeverityNumber } from '@opentelemetry/api-logs';
import { OBSERVABILITY_OPTIONS } from './tokens.js';
let TelemetryService = class TelemetryService {
    constructor(options) {
        this.options = options;
        this.tracer = trace.getTracer('@nestjs-yalc/observability');
        this.meter = metrics.getMeter('@nestjs-yalc/observability');
        this.logger = logs.getLogger('@nestjs-yalc/observability');
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
            const attributes = this.buildEventAttributes(eventName, payload);
            const activeSpan = trace.getActiveSpan();
            activeSpan?.addEvent(eventName, attributes);
            if (payload?.errorInfo) {
                activeSpan?.recordException(payload.errorInfo);
                activeSpan?.setStatus({
                    code: SpanStatusCode.ERROR,
                    message: getErrorMessage(payload.errorInfo),
                });
                this.errorCounter.add(1, attributes);
            }
            this.eventCounter.add(1, attributes);
            this.emitLogRecord(eventName, attributes, payload?.level ?? 'info', {
                body: payload?.message ?? eventName,
                exception: payload?.errorInfo,
            });
        });
    }
    recordDuration(name, durationMs, attributes = {}) {
        if (!this.enabled) {
            return;
        }
        this.execute(() => {
            this.durationHistogram.record(durationMs, {
                'yalc.operation.name': name,
                ...toTelemetryAttributes(attributes),
            });
            this.emitLogRecord(name, {
                'yalc.telemetry.kind': 'duration',
                'yalc.operation.name': name,
                'yalc.operation.duration_ms': durationMs,
                ...toTelemetryAttributes(attributes),
            }, 'info');
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
        span.setStatus({ code: SpanStatusCode.OK });
        span.end();
    }
    failSpan(name, startedAt, attributes, span, error) {
        this.recordDuration(name, Date.now() - startedAt, {
            ...attributes,
            'yalc.operation.error': true,
        });
        span.recordException(normalizeError(error));
        span.setStatus({
            code: SpanStatusCode.ERROR,
            message: error instanceof Error ? error.message : String(error),
        });
        span.end();
    }
    buildEventAttributes(eventName, payload) {
        const attributes = {
            'yalc.event.name': eventName,
            'yalc.event.payload_name': payload?.eventName,
            'yalc.event.level': payload?.level,
            'yalc.event.has_error': Boolean(payload?.errorInfo),
        };
        if (payload?.errorInfo) {
            attributes['yalc.error.name'] = payload.errorInfo.errorName;
            attributes['yalc.error.message'] = getErrorMessage(payload.errorInfo);
            attributes['yalc.error.code'] = payload.errorInfo.errorCode;
        }
        if (this.options.payload.include && payload?.data) {
            attributes['yalc.event.payload'] = safeJsonStringify(maskObject(payload.data, this.options.payload.mask), this.options.payload.maxSize);
        }
        return toTelemetryAttributes(attributes);
    }
    emitLogRecord(name, attributes, severityText, options = {}) {
        this.logger.emit({
            eventName: name,
            severityText,
            severityNumber: toSeverityNumber(severityText),
            body: options.body ?? name,
            attributes,
            context: context.active(),
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
TelemetryService = __decorate([
    Injectable(),
    __param(0, Inject(OBSERVABILITY_OPTIONS)),
    __metadata("design:paramtypes", [Object])
], TelemetryService);
export { TelemetryService };
export function toTelemetryAttributes(attributes = {}) {
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
    catch {
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
        return SeverityNumber.ERROR;
    if (level === 'warn')
        return SeverityNumber.WARN;
    if (level === 'debug')
        return SeverityNumber.DEBUG;
    if (level === 'verbose')
        return SeverityNumber.TRACE;
    return SeverityNumber.INFO;
}
function getErrorMessage(errorInfo) {
    return errorInfo.message ?? errorInfo.internalMessage;
}
//# sourceMappingURL=telemetry.service.js.map